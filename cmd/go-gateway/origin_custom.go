// Copyright 2017 The Go Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package main

import (
	"container/ring"
	"errors"
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
	"sync"

	"github.com/mijime/go-gateway/lib/gateway"
)

type CustomOrigin struct {
	Hosts                  []string            `json:"hosts"`
	MaxIdleConns           int                 `json:"max_idle_conns"`
	MaxIdleConnsPerHost    int                 `json:"max_idle_conns_per_host"`
	MaxResponseHeaderBytes int64               `json:"max_response_header_bytes"`
	ApplyHeaders           map[string][]string `json:"apply_headers"`
}

func (o CustomOrigin) CreateHandler(b gateway.Behavior) (http.Handler, error) {
	if len(o.Hosts) < 1 {
		return nil, errors.New(b.Name + ": not found hosts")
	}

	targets := ring.New(len(o.Hosts))
	for _, host := range o.Hosts {
		target, err := url.Parse(host)

		if err != nil {
			return nil, err
		}

		targets.Value = target
		targets = targets.Next()
	}

	m := &sync.Mutex{}
	director := func(r *http.Request) {
		m.Lock()
		defer m.Unlock()

		u := targets.Value.(*url.URL)

		log.Println(b.Name, r.Method, r.URL)
		r.URL.Scheme = u.Scheme
		r.URL.Host = u.Host

		for k, vl := range o.ApplyHeaders {
			for _, v := range vl {
				r.Header.Set(k, v)
			}
		}

		targets = targets.Next()
	}

	transport := &http.Transport{
		MaxIdleConns:           o.MaxIdleConns,
		MaxIdleConnsPerHost:    o.MaxIdleConnsPerHost,
		MaxResponseHeaderBytes: o.MaxResponseHeaderBytes,
	}

	return &httputil.ReverseProxy{
		Director:  director,
		Transport: transport,
	}, nil
}

type CustomConfiguration struct {
	Origins   map[string]CustomOrigin `json:"origins"`
	Behaviors []gateway.Behavior      `json:"behaviors"`
}

func (c CustomConfiguration) GetBehaviors() []gateway.Behavior {
	return c.Behaviors
}

func (c CustomConfiguration) FindOrigin(b gateway.Behavior) gateway.Origin {
	return c.Origins[b.Name]
}
