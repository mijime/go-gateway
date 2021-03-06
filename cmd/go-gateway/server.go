// Copyright 2017 The Go Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.
package main

import (
	"encoding/json"
	"io"
	"net/http"

	stats "github.com/fukata/golang-stats-api-handler"
	"github.com/gorilla/mux"
	"github.com/mijime/go-gateway/lib/gateway"
)

//go:generate go-assets-builder -s "/data" -o bindata.go data

const (
	HeaderContentType = "Content-Type"
	ContentTypeJson   = "application/json"
	MethodGet         = "GET"
	MethodPost        = "POST"
)

type HttpManageHttpService struct {
	*gateway.ManageHttpService
	*http.Server
}

func NewHttpManageService(app *http.Server) HttpManageHttpService {
	r := mux.NewRouter()

	hms := HttpManageHttpService{
		ManageHttpService: &gateway.ManageHttpService{
			App:  app,
			Curr: &CustomConfiguration{},
		},
		Server: &http.Server{Handler: r},
	}

	api := r.PathPrefix("/api").Subrouter()

	api.HandleFunc("/config.json", func(w http.ResponseWriter, r *http.Request) {
		res, err := hms.GetConfig()
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.Header().Set(HeaderContentType, ContentTypeJson)
		w.Write(res)
	}).Methods(MethodGet)

	api.HandleFunc("/config.json", func(w http.ResponseWriter, r *http.Request) {
		updateErr := hms.UpdateConfig(r.Body)
		if updateErr != nil {
			http.Error(w, updateErr.Error(), http.StatusBadRequest)
			return
		}

		res, err := hms.GetConfig()
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.Header().Set(HeaderContentType, ContentTypeJson)
		w.Write(res)
	}).Methods(MethodPost)

	api.HandleFunc("/stats.json", stats.Handler).Methods(MethodGet)

	r.PathPrefix("/").Handler(http.FileServer(Assets))

	return hms
}

func (hms HttpManageHttpService) GetConfig() ([]byte, error) {
	return json.Marshal(hms.GetCurrentConfig())
}

func parseConfig(d gateway.Decoder) (gateway.Configuration, error) {
	c := CustomConfiguration{}
	err := d.Decode(&c)
	return c, err
}

func (hms HttpManageHttpService) UpdateConfig(r io.Reader) error {
	var err error

	decoder := json.NewDecoder(r)

	c, err := parseConfig(decoder)
	if err != nil {
		return err
	}

	hms.UpdateRouter(c)
	return nil
}
