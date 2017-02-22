// Copyright 2017 The Go Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package gateway

import (
	"log"
	"net/http"
	"sync"

	"github.com/gorilla/mux"
)

type Behavior struct {
	Name    string              `json:"name"`
	Path    string              `json:"path"`
	Host    string              `json:"host"`
	Methods []string            `json:"methods"`
	Headers map[string][]string `json:"headers"`
	Queries map[string][]string `json:"queries"`
}

type Origin interface {
	CreateHandler(b Behavior) (http.Handler, error)
}

type Configuration interface {
	GetBehaviors() []Behavior
	FindOrigin(b Behavior) Origin
}

func CreateRouter(c Configuration) http.Handler {
	r := mux.NewRouter()

	for _, b := range c.GetBehaviors() {
		o := c.FindOrigin(b)
		if o == nil {
			continue
		}

		sr := r.PathPrefix(b.Path)

		h, err := o.CreateHandler(b)
		if err != nil {
			log.Println(err)
			continue
		}
		sr.Handler(h)

		if len(b.Host) > 0 {
			sr.Host(b.Host)
		}
		if len(b.Methods) > 0 {
			sr.Methods(b.Methods...)
		}
		for k, vl := range b.Headers {
			for _, v := range vl {
				sr.Headers(k, v)
			}
		}
		for k, vl := range b.Queries {
			for _, v := range vl {
				sr.Queries(k, v)
			}
		}
	}

	return r
}

type ManageHttpService struct {
	sync.Mutex
	App  *http.Server
	Curr Configuration
}

func (mhs *ManageHttpService) UpdateRouter(c Configuration) {
	mhs.Lock()
	defer mhs.Unlock()

	r := CreateRouter(c)
	mhs.App.Handler = r
	mhs.Curr = c
}

func (mhs *ManageHttpService) GetCurrentConfig() Configuration {
	return mhs.Curr
}

type Decoder interface {
	Decode(v interface{}) error
}

type ParseConfiguration func(d Decoder) (c Configuration, err error)
