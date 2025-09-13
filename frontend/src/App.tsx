// src/App.tsx
"use client";
import { useState, useMemo, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useParams, Link } from "react-router-dom";
import cytoscape, { ElementDefinition } from "cytoscape";
import fcose from "cytoscape-fcose";
import { Navbar } from "./components/Navbar";
import StateUpload from "./components/StateUpload";
import TfGraphCards from "./components/TfGraphCards";

cytoscape.use(fcose);

// ---- helpers for the detail page ----
type GraphJson = {
  nodes: Array<{ id: string; type: string; modulePath?: string; account?: string; region?: string; layer?: string }>;
  edges: Array<{ source: string; target: string; kind?: string }>;
};

const topModule = (mp?: string) => {
  if (!mp) return "root";
  const parts = mp.split(".");
  for (let i = 0; i < parts.length; i++) {
    if (parts[i] === "module" && parts[i + 1]) return parts[i + 1];
  }
  return "misc";
};

function buildGroups(g: GraphJson): Map<string, { nodes: GraphJson["nodes"]; edges: GraphJson["edges"] }> {
  const by = new Map<string, { nodes: GraphJson["nodes"]; edges: GraphJson["edges"] }>();
  g.nodes?.forEach((n) => {
    const k = topModule(n.modulePath);
    if (!by.has(k)) by.set(k, { nodes: [], edges: [] });
    by.get(k)!.nodes.push(n);
  });
  const id2g: Record<string, string> = {};
  for (const [k, v] of by) v.nodes.forEach((n) => (id2g[n.id] = k));
  g.edges?.forEach((e) => {
    const g1 = id2g[e.source];
    if (g1 && g1 === id2g[e.target]) by.get(g1)!.edges.push(e);
  });
  return by;
}

// tiny Cytoscape canvas for the detail page
function MiniCy({ elements, height = 600 }: { elements: ElementDefinition[]; height?: number | string }) {
  const ref = useRef<HTMLDivElement>(null);
  const cyRef = useRef<cytoscape.Core | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const cy = cytoscape({
      container: ref.current,
      elements: [],
      style: [
        {
          selector: "node",
          style: {
            label: "data(label)",
            "font-size": 9,
            "background-color": "#8aa",
            "text-wrap": "wrap",
            "text-max-width": 120,
            "border-width": 1,
            "border-color": "#445",
          },
        },
        { selector: 'edge[kind = "dep"]', style: { "line-style": "solid", width: 1 } },
        { selector: 'edge[kind = "ref"]', style: { "line-style": "dashed", width: 1 } },
      ],
      layout: { name: "fcose", quality: "draft", randomize: true, animate: false, nodeSeparation: 60 } as any,
    });
    cyRef.current = cy;

    const fit = () => {
      if (!cyRef.current) return;
      cyRef.current.resize();
      cyRef.current.fit(undefined, 20);
    };
    const ro = new ResizeObserver(fit);
    ro.observe(ref.current);
    requestAnimationFrame(fit);

    return () => {
      ro.disconnect();
      cy.destroy();
      cyRef.current = null;
    };
  }, []);

  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;
    cy.startBatch();
    cy.elements().remove();
    cy.add(elements);
    cy.endBatch();
    requestAnimationFrame(() => {
      cy.layout({ name: "fcose", quality: "draft", randomize: true, animate: false, nodeSeparation: 60 } as any).run();
      cy.fit(undefined, 20);
    });
  }, [elements, height]);

  return <div ref={ref} style={{ height, width: "100%" }} className="rounded-md border" />;
}

// ---- pages ----
function UploadPage({ setGraph }: { setGraph: (g: any) => void }) {
  const navigate = useNavigate();
  return (
    <main className="container mx-auto px-4 py-6 space-y-8">
      <StateUpload
        onGraph={(g) => {
          setGraph(g);
          navigate("/groups");
        }}
      />
    </main>
  );
}

function ResourceGroupsListPage({ graph }: { graph: any | null }) {
  if (!graph) return <Navigate to="/" replace />;
  return (
    <main className="container mx-auto px-4 py-6 space-y-8">
      <TfGraphCards graph={graph} />
    </main>
  );
}

function ResourceGroupDetailPage({ graph }: { graph: GraphJson | null }) {
  const { groupId } = useParams();
  if (!graph) return <Navigate to="/" replace />;
  const groups = useMemo(() => buildGroups(graph), [graph]);
  const group = groups.get(groupId || "");
  if (!group) {
    return (
      <main className="container mx-auto px-4 py-6">
        <p className="mb-4">No such group: {groupId}</p>
        <Link className="text-blue-600 underline" to="/groups">
          ← Back to groups
        </Link>
      </main>
    );
  }

  const nodeIds = new Set(group.nodes.map((n) => n.id));
  const elements: ElementDefinition[] = [
    ...group.nodes.map((n) => ({
      data: { id: n.id, label: n.id.split(".").slice(-2).join("."), type: n.type, layer: (n as any).layer || "" },
    })),
    ...group.edges
      .filter((e) => nodeIds.has(e.source) && nodeIds.has(e.target))
      .map((e) => ({ data: { id: `${e.source}->${e.target}`, source: e.source, target: e.target, kind: e.kind || "dep" } })),
  ];

  return (
    <main className="container mx-auto px-4 py-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{groupId}</h2>
        <Link className="rounded border px-3 py-1 text-sm hover:bg-slate-50" to="/groups">
          Back
        </Link>
      </div>
      <MiniCy elements={elements} height={640} />
    </main>
  );
}

// ---- app ----
export default function App() {
  const [graph, setGraph] = useState<any | null>(null);

  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Navbar />
        <Routes>
          <Route path="/" element={<UploadPage setGraph={setGraph} />} />
          <Route path="/groups" element={<ResourceGroupsListPage graph={graph} />} />
          <Route path="/groups/:groupId" element={<ResourceGroupDetailPage graph={graph} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}
