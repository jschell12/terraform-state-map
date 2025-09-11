package main

import (
	"context"
	"encoding/json"
	"io"
	"log"
	"mime/multipart"
	"net/http"
	"os/exec"
	"strconv"
	"strings"
	"time"

	"github.com/jschell12/terraform-state-map/backend/graph"
	"github.com/jschell12/terraform-state-map/backend/terraform"
)

const maxUpload = 100 << 20 // 100MB

func main() {
	mux := http.NewServeMux()

	mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		cors(w, r)
		if r.Method == http.MethodOptions {
			w.WriteHeader(204)
			return
		}
		writeJSON(w, 200, map[string]string{"status": "ok"})
	})

	// POST /graph
	// - multipart: field name "state" with .tfstate
	// - or JSON: {"pull":true,"cwd":"/path"} to run `terraform state pull` server-side
	mux.HandleFunc("/graph", func(w http.ResponseWriter, r *http.Request) {
		cors(w, r)
		if r.Method == http.MethodOptions {
			w.WriteHeader(204)
			return
		}
		if r.Method != http.MethodPost {
			http.Error(w, "POST only", 405)
			return
		}
		r.Body = http.MaxBytesReader(w, r.Body, maxUpload)

		var stateBytes []byte
		var err error

		ct := r.Header.Get("Content-Type")
		if strings.HasPrefix(ct, "multipart/form-data") {
			if err := r.ParseMultipartForm(maxUpload); err != nil {
				http.Error(w, "invalid multipart: "+err.Error(), 400)
				return
			}
			if parseBool(r.FormValue("pull")) {
				cwd := r.FormValue("cwd")
				if cwd == "" {
					http.Error(w, "cwd required when pull=true", 400)
					return
				}
				stateBytes, err = terraformPull(r.Context(), cwd)
				if err != nil {
					http.Error(w, "terraform pull: "+err.Error(), 500)
					return
				}
			} else {
				f, _, err := r.FormFile("state")
				if err != nil {
					http.Error(w, "state file required (field 'state'): "+err.Error(), 400)
					return
				}
				defer safeClose(f)
				stateBytes, err = io.ReadAll(f)
				if err != nil {
					http.Error(w, "read state: "+err.Error(), 400)
					return
				}
			}
		} else {
			// raw body: JSON control or raw tfstate
			body, err := io.ReadAll(r.Body)
			if err != nil {
				http.Error(w, "read body: "+err.Error(), 400)
				return
			}
			if looksJSONObj(body) {
				var in struct {
					Pull bool   `json:"pull"`
					Cwd  string `json:"cwd"`
				}
				if err := json.Unmarshal(body, &in); err != nil {
					http.Error(w, "bad json: "+err.Error(), 400)
					return
				}
				if !in.Pull {
					http.Error(w, "send multipart with 'state' or set pull=true", 400)
					return
				}
				if in.Cwd == "" {
					http.Error(w, "cwd required when pull=true", 400)
					return
				}
				stateBytes, err = terraformPull(r.Context(), in.Cwd)
				if err != nil {
					http.Error(w, "terraform pull: "+err.Error(), 500)
					return
				}
			} else {
				stateBytes = body
			}
		}

		st, err := terraform.ParseState(stateBytes)
		if err != nil {
			http.Error(w, "parse state: "+err.Error(), 400)
			return
		}
		g := graph.BuildFromState(st)

		w.Header().Set("Content-Type", "application/json")
		w.Header().Set("Content-Disposition", `inline; filename="graph.json"`)
		w.WriteHeader(200)
		enc := json.NewEncoder(w)
		enc.SetIndent("", "  ")
		_ = enc.Encode(g)
	})

	addr := getenv("ADDR", ":8080")
	log.Printf("listening on %s", addr)
	s := &http.Server{
		Addr: addr,
		Handler: http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			log.Printf("%s %s", r.Method, r.URL.Path)
			mux.ServeHTTP(w, r)
		}),
		ReadHeaderTimeout: 10 * time.Second,
	}
	log.Fatal(s.ListenAndServe())
}

func terraformPull(ctx context.Context, cwd string) ([]byte, error) {
	ctx, cancel := context.WithTimeout(ctx, 90*time.Second)
	defer cancel()
	cmd := exec.CommandContext(ctx, "terraform", "state", "pull")
	cmd.Dir = cwd
	return cmd.Output()
}

// --- helpers ---
func cors(w http.ResponseWriter, r *http.Request) {
	origin := getenv("ALLOW_ORIGIN", "*")
	w.Header().Set("Access-Control-Allow-Origin", origin)
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
	w.Header().Set("Access-Control-Max-Age", "600")
}
func looksJSONObj(b []byte) bool { s := strings.TrimSpace(string(b)); return strings.HasPrefix(s, "{") }
func getenv(k, d string) string {
	if v := strings.TrimSpace(strings.ReplaceAll(strings.TrimSpace(strings.ReplaceAll(strings.TrimSpace(strings.ReplaceAll(strings.TrimSpace(""), "\n", "")), "\r", "")), " ", "")); v != "" {
		return v
	}
	return d
}                                // compact helper avoided; use simple:
func parseBool(s string) bool    { b, _ := strconv.ParseBool(s); return b }
func safeClose(f multipart.File) { _ = f.Close() }
func writeJSON(w http.ResponseWriter, code int, v any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	_ = json.NewEncoder(w).Encode(v)
}
