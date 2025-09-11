package graph

import (
	"sort"
	"strings"

	"github.com/jschell12/terraform-state-map/backend/terraform"
)

func BuildFromState(st *terraform.State) Graph {
	idx := map[string]bool{}
	nodes := make([]Node, 0, 256)
	edges := make([]Edge, 0, 512)
	compounds := map[string][]string{}

	for _, r := range st.Resources() {
		addr := r.Address()
		if idx[addr] {
			continue
		}
		layer := classifyLayer(r.Type)
		n := Node{
			ID:         addr,
			Type:       r.Type,
			Icon:       iconFor(r.Type),
			Account:    r.Account,
			Region:     r.Region,
			ModulePath: r.ModulePath,
			Provider:   r.Provider,
			URN:        r.RealID,
			Tags:       r.Tags,
			Layer:      layer,
		}
		nodes = append(nodes, n)
		idx[addr] = true

		if r.ModulePath != "" {
			compounds[r.ModulePath] = append(compounds[r.ModulePath], addr)
		}

		for _, dep := range r.DependsOn {
			edges = append(edges, Edge{Source: addr, Target: dep, Kind: "dep"})
		}
		for _, ref := range r.References {
			edges = append(edges, Edge{Source: addr, Target: ref, Kind: "ref"})
		}
	}

	// determinism
	sort.Slice(nodes, func(i, j int) bool { return nodes[i].ID < nodes[j].ID })
	sort.Slice(edges, func(i, j int) bool {
		if edges[i].Source == edges[j].Source {
			return edges[i].Target < edges[j].Target
		}
		return edges[i].Source < edges[j].Source
	})

	// to slice
	comps := make([]Compound, 0, len(compounds))
	for k, v := range compounds {
		sort.Strings(v)
		label := k
		if strings.HasPrefix(label, "module.") {
			label = label[len("module."):]
		}
		comps = append(comps, Compound{ID: k, Label: label, Children: v})
	}

	return Graph{Nodes: nodes, Edges: edges, Compounds: comps}
}

func iconFor(tp string) string {
	if strings.HasPrefix(tp, "aws_") {
		// very rough mapping
		if strings.Contains(tp, "vpc") {
			return "aws/vpc"
		}
		if strings.Contains(tp, "subnet") {
			return "aws/subnet"
		}
		if strings.Contains(tp, "iam") {
			return "aws/iam"
		}
		if strings.Contains(tp, "s3") {
			return "aws/s3"
		}
		if strings.Contains(tp, "eks") {
			return "aws/eks"
		}
		if strings.Contains(tp, "ec2") {
			return "aws/ec2"
		}
		return "aws/other"
	}
	return "other"
}

func classifyLayer(tp string) string {
	// Foundations
	if strings.HasPrefix(tp, "aws_vpc") || strings.HasPrefix(tp, "aws_subnet") ||
		strings.HasPrefix(tp, "aws_internet_gateway") || strings.HasPrefix(tp, "aws_route") ||
		strings.HasPrefix(tp, "aws_route_table") || strings.HasPrefix(tp, "aws_vpn") ||
		strings.HasPrefix(tp, "aws_iam_") || strings.HasPrefix(tp, "aws_kms_") ||
		strings.HasPrefix(tp, "aws_cloudtrail") || strings.HasPrefix(tp, "aws_config_") ||
		strings.HasPrefix(tp, "aws_guardduty") || strings.HasPrefix(tp, "aws_route53_") {
		return "foundations"
	}
	// Platforms
	if strings.HasPrefix(tp, "aws_eks_") || strings.HasPrefix(tp, "aws_ecs_") ||
		strings.HasPrefix(tp, "aws_ecr_") || strings.HasPrefix(tp, "aws_batch_") ||
		strings.HasPrefix(tp, "aws_msk_") || strings.HasPrefix(tp, "aws_opensearch_") ||
		strings.HasPrefix(tp, "aws_elasticsearch_") || strings.HasPrefix(tp, "aws_efs_") ||
		strings.HasPrefix(tp, "aws_elb") || strings.HasPrefix(tp, "aws_lb") ||
		strings.HasPrefix(tp, "aws_cloudwatch_") || strings.HasPrefix(tp, "aws_logs_") ||
		strings.HasPrefix(tp, "aws_sfn_") {
		return "platforms"
	}
	// Apps default
	return "apps"
}
