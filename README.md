# Terraform State Map (scaffold)

Purpose: parse a Terraform state file and emit a graph JSON, then visualize it with AWS/GCP/Azure icons in a browser.

## Quick start

### 1) Build extractor (Go >= 1.21)
```bash
cd extractor
go mod tidy
go build -o tfmap
```

### 2) Generate graph
```bash
# From a local state file
./tfmap -state ../examples/sample.tfstate -out ../examples/graph.json

# Or pull from current dir (runs 'terraform state pull' via shell) 
./tfmap -pull -out ../examples/graph.json
```

### 3) View graph
Open `viewer/index.html` in a browser and select the generated `graph.json`.
(Uses Cytoscape.js via CDN.)

## Notes
- This is a minimal skeleton. It reads state JSON, builds resource nodes and dependency edges,
  groups by module path, provider, account, region (best-effort), and writes a compact graph JSON.
- Extend `terraform/loader.go` to enrich classification and add HCL parsing later.
- No HashiCorp code is embedded. You control whether to point users to TFC/TFE APIs from another tool.
