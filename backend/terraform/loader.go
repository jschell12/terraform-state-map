package terraform

import (
	"encoding/json"
	"fmt"
	"strings"
)

// Minimal state model to avoid Terraform libs.
type State struct {
	Values struct {
		RootModule *Module `json:"root_module"`
	} `json:"values"`
}

type Module struct {
	Resources    []StateResource `json:"resources"`
	ChildModules []Module        `json:"child_modules"`
	Address      string          `json:"address"` // optional in some exports
}

// Flattened resource representation for graph layer.
type Resource struct {
	Type       string
	Name       string
	Provider   string
	ModulePath string
	Instance   string // [0], ["key"], etc
	RealID     string // from attributes (e.g., arn or id)
	Account    string // best-effort
	Region     string // best-effort
	Tags       map[string]string
	DependsOn  []string // absolute addrs
	References []string // heuristic
}

func (r Resource) Address() string {
	addr := r.Type + "." + r.Name
	if r.ModulePath != "" {
		addr = r.ModulePath + "." + addr
	}
	if r.Instance != "" {
		addr += r.Instance
	}
	return addr
}

type StateResource struct {
	Address  string                 `json:"address"`
	Mode     string                 `json:"mode"`
	Type     string                 `json:"type"`
	Name     string                 `json:"name"`
	Provider string                 `json:"provider_name"`
	Index    interface{}            `json:"index"` // number or string or null
	Taint    bool                   `json:"tainted"`
	Dep      []string               `json:"depends_on"`
	Attr     map[string]interface{} `json:"values"`
}

func ParseState(b []byte) (*State, error) {
	var s State
	if err := json.Unmarshal(b, &s); err != nil {
		return nil, fmt.Errorf("invalid state json: %w", err)
	}
	return &s, nil
}

func (s *State) allResources() []StateResource {
	var out []StateResource
	var walk func(m Module, prefix string)
	walk = func(m Module, prefix string) {
		for _, r := range m.Resources {
			out = append(out, r)
		}
		for _, c := range m.ChildModules {
			walk(c, c.Address)
		}
	}
	if s.Values.RootModule != nil {
		walk(*s.Values.RootModule, "")
	}
	return out
}

func (s *State) Resources() []Resource {
	var out []Resource
	for _, r := range s.allResources() {
		res := Resource{
			Type:       r.Type,
			Name:       r.Name,
			Provider:   r.Provider,
			ModulePath: modulePathFromAddress(r.Address),
			Instance:   instanceSuffix(r.Index),
			DependsOn:  absolutizeDeps(r.Dep, r.Address),
			Tags:       mapStringString(r.Attr, "tags"),
		}
		res.RealID = firstString(r.Attr, []string{"arn", "id", "name", "bucket", "vpc_id"})
		res.Account = inferAccount(r.Attr)
		res.Region = inferRegion(r.Attr)
		res.References = guessRefs(r.Attr)
		out = append(out, res)
	}
	return out
}

// helpers

func modulePathFromAddress(addr string) string {
	// e.g., module.vpc.module.nat.aws_eip.this[0] -> module.vpc.module.nat
	parts := strings.Split(addr, ".")
	for i, p := range parts {
		if strings.HasPrefix(p, "aws_") || strings.Contains(p, "_") && i+1 < len(parts) && parts[i+1] != "module" {
			return strings.Join(parts[:i], ".")
		}
	}
	return strings.TrimSuffix(addr, "."+resourceLeaf(addr))
}

func resourceLeaf(addr string) string {
	// aws_x.y[0]
	lastDot := strings.LastIndex(addr, ".")
	if lastDot == -1 {
		return addr
	}
	return addr[lastDot+1:]
}

func instanceSuffix(idx interface{}) string {
	switch v := idx.(type) {
	case float64:
		return fmt.Sprintf("[%d]", int(v))
	case string:
		return fmt.Sprintf("[%q]", v)
	default:
		return ""
	}
}

func absolutizeDeps(deps []string, self string) []string {
	out := make([]string, 0, len(deps))
	for _, d := range deps {
		out = append(out, d)
	}
	return out
}

func firstString(m map[string]interface{}, keys []string) string {
	for _, k := range keys {
		if v, ok := m[k]; ok {
			if s, ok := v.(string); ok && s != "" {
				return s
			}
		}
	}
	return ""
}

func mapStringString(m map[string]interface{}, key string) map[string]string {
	res := map[string]string{}
	if m == nil {
		return res
	}
	if v, ok := m[key]; ok {
		if mm, ok := v.(map[string]interface{}); ok {
			for k2, v2 := range mm {
				if s, ok := v2.(string); ok {
					res[k2] = s
				}
			}
		}
	}
	return res
}

func inferAccount(attrs map[string]interface{}) string {
	if v, ok := attrs["owner_id"]; ok {
		if s, ok := v.(string); ok {
			return s
		}
	}
	if v, ok := attrs["account_id"]; ok {
		if s, ok := v.(string); ok {
			return s
		}
	}
	return ""
}

func inferRegion(attrs map[string]interface{}) string {
	if v, ok := attrs["region"]; ok {
		if s, ok := v.(string); ok {
			return s
		}
	}
	// heuristics for ARNs
	if v, ok := attrs["arn"]; ok {
		if s, ok := v.(string); ok {
			parts := strings.Split(s, ":")
			if len(parts) > 3 {
				return parts[3]
			}
		}
	}
	return ""
}

func guessRefs(attrs map[string]interface{}) []string {
	// Minimal placeholder: in real version parse expressions from HCL.
	return nil
}
