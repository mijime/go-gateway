GOSRC = ./cmd/... ./lib/...

install: generate
	go install -v $(GOSRC)

generate: fmt vendor cmd/go-gateway/data
	go generate -v $(GOSRC)

cmd/go-gateway/data: webpack.config.js
	yarn run -- eslint-fix
	yarn run -- gulp --production

fmt:
	go fmt $(GOSRC)
	go vet -v $(GOSRC)

vendor:
	dep ensure -v --update

dep:
	go get -u -v github.com/jessevdk/go-assets-builder
	go get -u -v github.com/golang/dep
	go get -u -v gopkg.in/godo.v2/cmd/godo
