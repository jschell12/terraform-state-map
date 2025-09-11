package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"log"
	"os"
	"os/exec"
	"path/filepath"

	"github.com/jschell12/terraform-state-map/backend/graph"
	"github.com/jschell12/terraform-state-map/backend/terraform"
)

func main() {
	statePath := flag.String("state", "", "Path to tfstate file")
	pull := flag.Bool("pull", false, "Run `terraform state pull` in CWD")
	out := flag.String("out", "graph.json", "Output graph JSON path")
	flag.Parse()

	var stateBytes []byte
	var err error

	if *pull {
		cmd := exec.Command("terraform", "state", "pull")
		stateBytes, err = cmd.Output()
		if err != nil {
			log.Fatalf("failed to pull state: %v", err)
		}
	} else {
		if statePath == nil || *statePath == "" {
			log.Fatalf("-state required when -pull is false")
		}
		stateBytes, err = os.ReadFile(*statePath)
		if err != nil {
			log.Fatalf("read state: %v", err)
		}
	}

	st, err := terraform.ParseState(stateBytes)
	if err != nil {
		log.Fatalf("parse state: %v", err)
	}

	g := graph.BuildFromState(st)

	b, err := json.MarshalIndent(g, "", "  ")
	if err != nil {
		log.Fatalf("marshal graph: %v", err)
	}

	if err := os.MkdirAll(filepath.Dir(*out), 0o755); err != nil && filepath.Dir(*out) != "." {
		log.Fatalf("mkdir out dir: %v", err)
	}
	if err := os.WriteFile(*out, b, 0o644); err != nil {
		log.Fatalf("write graph: %v", err)
	}

	fmt.Printf("wrote %s (nodes=%d, edges=%d)\n", *out, len(g.Nodes), len(g.Edges))
}
