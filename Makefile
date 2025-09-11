# Binaries
BIN_DIR := backend/bin
TFMAP   := $(BIN_DIR)/tfmap
API     := $(BIN_DIR)/apiserver

# I/O (adjust paths if your backend/examples live elsewhere)
STATE := backend/examples/terraform-big-sample.tfstate
OUT   := backend/examples/graph.json

.PHONY: all build build-cli build-api graph pull clean api run-api up

all: build

## Build both binaries
build: build-cli build-api

## CLI: backend/cmd/tfmap -> bin/tfmap
build-cli:
	pushd backend/cmd/tfmap && go build -o ../../$(TFMAP); popd

## API: backend/cmd/apiserver -> bin/apiserver
build-api:
	pushd backend/cmd/apiserver && go build -o ../../$(API); popd

## Generate graph from local state
graph: build-cli
	$(TFMAP) -state $(STATE) -out $(OUT)

## Pull state (runs `terraform state pull` in CWD) and write graph
pull: build-cli
	$(TFMAP) -pull -out $(OUT)

## Build only the API
api: build-api

## Run API (TFMAP_BIN is ignored if your server is in-process; harmless otherwise)
run-api: api
	ALLOW_ORIGIN=* ADDR=:8080 TFMAP_BIN=./$(TFMAP) ./$(API)

clean:
	rm -f $(TFMAP) $(API) $(OUT)

up:
	docker compose up --build