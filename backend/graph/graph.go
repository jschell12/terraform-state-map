package graph

type Node struct {
	ID         string            `json:"id"`
	Type       string            `json:"type"` // aws_s3_bucket
	Icon       string            `json:"icon"` // hint for UI (e.g., aws/s3)
	Account    string            `json:"account,omitempty"`
	Region     string            `json:"region,omitempty"`
	ModulePath string            `json:"modulePath,omitempty"`
	Provider   string            `json:"provider,omitempty"`
	URN        string            `json:"urn,omitempty"` // real ID: arn, vpc-*, etc
	Tags       map[string]string `json:"tags,omitempty"`
	Layer      string            `json:"layer,omitempty"`
}

type Edge struct {
	Source string `json:"source"`
	Target string `json:"target"`
	Kind   string `json:"kind"` // ref|dep
}

type Compound struct {
	ID       string   `json:"id"`
	Label    string   `json:"label"`
	Children []string `json:"children"`
}

type Graph struct {
	Nodes     []Node     `json:"nodes"`
	Edges     []Edge     `json:"edges"`
	Compounds []Compound `json:"compounds"`
}
