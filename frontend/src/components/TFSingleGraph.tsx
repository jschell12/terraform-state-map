import { MiniCy, buildGroups } from "./components/TfGraphCards";
import { ElementDefinition } from "cytoscape";
import { useParams, Navigate, Link } from "react-router-dom";

function ResourceGroupDetailPage({ graph }: { graph: any | null }) {
    const { groupId } = useParams();
    if (!graph) return <Navigate to="/" replace />;

    const groups = buildGroups(graph);
    const group = groups.get(groupId || "");
    if (!group) return <main className="container mx-auto px-4 py-6">No such group <Link to="/groups">Back</Link></main>;

    const ids = new Set(group.nodes.map(n => n.id));
    const elements: ElementDefinition[] = [
        ...group.nodes.map(n => ({ data: { id: n.id, label: n.id.split(".").slice(-2).join("."), type: n.type, layer: (n as any).layer || "" } })),
        ...group.edges.filter(e => ids.has(e.source) && ids.has(e.target))
            .map(e => ({ data: { id: `${e.source}->${e.target}`, source: e.source, target: e.target, kind: e.kind || "dep" } })),
    ];

    return (
        <main className="container mx-auto px-4 py-6 space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">{groupId}</h2>
                <Link to="/groups" className="rounded border px-3 py-1 text-sm hover:bg-slate-50">Back</Link>
            </div>
            <MiniCy key={groupId} elements={elements} height={640} />
        </main>
    );
}
