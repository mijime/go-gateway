// Copyright 2017 The Go Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package main

import (
	"bytes"
	"flag"
	"io/ioutil"
	"log"
	"net"
	"net/http"
	"runtime"
	"strings"
	"sync"

	"github.com/google/gops/agent"
)

func StartServer(wg *sync.WaitGroup, s *http.Server, l net.Listener) error {
	defer wg.Done()
	defer l.Close()

	return s.Serve(l)
}

func createListener(addr string) (net.Listener, error) {
	addrs := strings.Split(addr, "://")

	if len(addrs) < 2 {
		return net.Listen("tcp", addrs[0])
	}

	return net.Listen(addrs[0], addrs[1])
}

func MustListen(l net.Listener, err error) net.Listener {
	if err != nil {
		log.Fatal(err)
	}

	return l
}

func main() {
	runtime.GOMAXPROCS(runtime.NumCPU())

	if err := agent.Listen(nil); err != nil {
		log.Fatal(err)
	}

	var (
		addr       string
		manageAddr string
		configPath string
	)

	flag.StringVar(&addr, "addr", "127.0.0.1:3000", "bind address")
	flag.StringVar(&manageAddr, "manage-addr", "127.0.0.1:3001", "bind address")
	flag.StringVar(&configPath, "config", "", "initial config path")
	flag.Parse()

	app := &http.Server{}
	hms := NewHttpManageService(app)

	if len(configPath) > 0 {
		initConfig, err := ioutil.ReadFile(configPath)
		if err != nil {
			log.Fatal(err)
		}

		updateErr := hms.UpdateConfig(bytes.NewBuffer(initConfig))
		if updateErr != nil {
			log.Fatal(updateErr)
		}
	}

	wg := &sync.WaitGroup{}

	wg.Add(1)
	go StartServer(wg, app, MustListen(createListener(addr)))

	wg.Add(1)
	go StartServer(wg, hms.Server, MustListen(createListener(manageAddr)))

	wg.Wait()
}
