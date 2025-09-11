"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import cytoscape, { ElementDefinition } from "cytoscape";
import fcose from "cytoscape-fcose";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

// npm i cytoscape cytoscape-fcose
cytoscape.use(fcose);

// ---- Types matching the extractor's graph.json ----
export type GraphJson = {
    nodes: Array<{
        id: string;
        type: string;
        modulePath?: string;
        account?: string;
        region?: string;
        layer?: "foundations" | "platforms" | "apps" | string;
    }>;
    edges: Array<{ source: string; target: string; kind?: string }>;
    compounds?: Array<{ id: string; label?: string; children?: string[] }>;
};

// ---- Helpers ----
const topModule = (mp?: string) => {
    if (!mp) return "root";
    const parts = mp.split(".");
    for (let i = 0; i < parts.length; i++) {
        if (parts[i] === "module" && parts[i + 1]) return parts[i + 1];
    }
    return "misc";
};

const niceName = (k: string) => {
    const map: Record<string, string> = {
        vpc: "VPC",
        eks: "EKS",
        app: "App",
        db: "Database",
        iam: "IAM",
        kms: "KMS",
        s3: "S3",
        msg: "Messaging",
        root: "Root",
        misc: "Misc",
    };
    return map[k] || k.charAt(0).toUpperCase() + k.slice(1);
};

const baseStyle: cytoscape.Stylesheet[] = [
    { selector: "node", style: { label: "data(label)", "font-size": 9, "background-color": "#8aa", "text-wrap": "wrap", "text-max-width": 120, "border-width": 1, "border-color": "#445" } },
    { selector: 'node[layer = "foundations"]', style: { "background-color": "#a3d5a1" } },
    { selector: 'node[layer = "platforms"]', style: { "background-color": "#a1c5f3" } },
    { selector: 'node[layer = "apps"]', style: { "background-color": "#f3c5a1" } },
    { selector: 'edge[kind = "dep"]', style: { "line-style": "solid", width: 1 } },
    { selector: 'edge[kind = "ref"]', style: { "line-style": "dashed", width: 1 } },
];

function MiniCy({ elements }: { elements: ElementDefinition[] }) {
    const ref = useRef<HTMLDivElement>(null);
    const cyRef = useRef<cytoscape.Core | null>(null);

    // create once
    useEffect(() => {
        if (!ref.current) return;
        const cy = cytoscape({
            container: ref.current,
            elements: [],
            style: baseStyle,
            layout: { name: "fcose", quality: "draft", randomize: true, animate: false, nodeSeparation: 60 },
        });
        cyRef.current = cy;

        const ro = new ResizeObserver(() => cy.resize());
        ro.observe(ref.current);

        // first paint safety
        requestAnimationFrame(() => cy.resize());

        return () => { ro.disconnect(); cy.destroy(); cyRef.current = null; };
    }, []);

    // update data + layout after paint
    useEffect(() => {
        const cy = cyRef.current;
        if (!cy) return;

        cy.startBatch();
        cy.elements().remove();
        cy.add(elements);
        cy.endBatch();

        requestAnimationFrame(() => {
            if (!cyRef.current) return;
            cy.resize();
            cy.layout({ name: "fcose", quality: "draft", randomize: true, animate: false, nodeSeparation: 60 }).run();
            cy.fit(undefined, 20);
        });
    }, [elements]);

    // inline height avoids Tailwind purge/mis-measure
    return (
        <div
            ref={ref}
            style={{ height: 224, width: "100%" }}
            className="relative rounded-md border border-dashed"
        />
    );
}

// below your GraphJson type
type Group = { nodes: GraphJson["nodes"]; edges: GraphJson["edges"] };

function buildGroups(g: GraphJson): Map<string, Group> {
    const by = new Map<string, Group>();
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



export default function TfGraphCards({ graph }: { graph?: GraphJson }) {
    // Optional local file loader for convenience
    const [data, setData] = useState<GraphJson | undefined>(graph);


    // replace your groups state/useMemo with this
    const [groups, setGroups] = useState<Map<string, Group>>(new Map());

    // history stacks
    const historyRef = useRef<{ past: Array<[string, Group][]>; future: Array<[string, Group][]> }>({
        past: [],
        future: [],
    });

    const snapshot = (m: Map<string, Group>) =>
        Array.from(m.entries()).map(([k, v]) => [k, { nodes: [...v.nodes], edges: [...v.edges] }] as [string, Group]);

    const restore = (arr: [string, Group][]) =>
        new Map(arr.map(([k, v]) => [k, { nodes: [...v.nodes], edges: [...v.edges] }]));

    const commit = (updater: (prev: Map<string, Group>) => Map<string, Group>) => {
        setGroups((prev) => {
            historyRef.current.past.push(snapshot(prev));
            historyRef.current.future = [];
            return updater(prev);
        });
    };

    const undo = () =>
        setGroups((cur) => {
            const past = historyRef.current.past;
            if (!past.length) return cur;
            const curSnap = snapshot(cur);
            const prevSnap = past.pop()!;
            historyRef.current.future.push(curSnap);
            return restore(prevSnap);
        });

    const redo = () =>
        setGroups((cur) => {
            const fut = historyRef.current.future;
            if (!fut.length) return cur;
            historyRef.current.past.push(snapshot(cur));
            const nextSnap = fut.pop()!;
            return restore(nextSnap);
        });

    // rebuild groups when `data` changes and clear history
    useEffect(() => {
        if (!data) return;
        setGroups(buildGroups(data));
        historyRef.current.past = [];
        historyRef.current.future = [];
    }, [data]);

    const canUndo = historyRef.current.past.length > 0;
    const canRedo = historyRef.current.future.length > 0;

    const onDragStart = (e: React.DragEvent, key: string) => {
        e.dataTransfer.setData("text/plain", key);
        e.dataTransfer.effectAllowed = "move";
    };
    const onDragOver = (e: React.DragEvent) => e.preventDefault(); // allow drop
    const onDrop = (e: React.DragEvent, targetKey: string) => {
        e.preventDefault();
        const sourceKey = e.dataTransfer.getData("text/plain");
        if (!sourceKey || sourceKey === targetKey || !data) return;

        commit(prev => {
            const src = prev.get(sourceKey);
            const tgt = prev.get(targetKey);
            if (!src || !tgt) return prev; // no-op, no history push

            const mergedNodes = [...tgt.nodes, ...src.nodes];
            const ids = new Set(mergedNodes.map(n => n.id));

            const seen = new Set<string>();
            const mergedEdges = (data.edges || [])
                .filter(ed => ids.has(ed.source) && ids.has(ed.target))
                .filter(ed => {
                    const id = `${ed.source}->${ed.target}`;
                    if (seen.has(id)) return false;
                    seen.add(id);
                    return true;
                });

            const next = new Map(prev);
            next.set(targetKey, { nodes: mergedNodes, edges: mergedEdges });
            next.delete(sourceKey);
            return next;
        });
    };

    useEffect(() => {
        if (data) {
            setGroups(buildGroups(data));
        }
    }, [data]);

    const total = useMemo(() => {
        let n = 0, e = 0;
        for (const [, g] of groups) { n += g.nodes.length; e += g.edges.length; }
        return { n, e };
    }, [groups]);

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                {/* <h2 className="text-base font-semibold">Terraform Graph</h2> */}
                <div className="flex items-center gap-2 text-xs text-slate-600">
                    <Badge variant="outline">{total.n} resources</Badge>
                    <Badge variant="outline">{groups.size} groups</Badge>
                </div>
                <div className="ml-auto flex items-center space-x-4">
                    <button
                        className="rounded border px-2 py-1"
                        onClick={undo}
                        disabled={!canUndo}
                    >
                        Undo
                    </button>
                    <button
                        className="rounded border px-2 py-1"
                        onClick={redo}
                        disabled={!canRedo}
                    >
                        Redo
                    </button>
                    <button
                        className="rounded border px-2 py-1"
                        onClick={() => data && commit(() => buildGroups(data))}
                    >
                        Reset
                    </button>
                </div>
            </div>

            {!data && (
                <label className="block w-full cursor-pointer rounded-md border p-4 text-sm text-slate-600 hover:bg-slate-50">
                    <input type="file" accept="application/json" className="hidden" onChange={async (e) => {
                        const f = e.target.files?.[0]; if (!f) return; const text = await f.text(); setData(JSON.parse(text));
                    }} />
                    Select a graph.json
                </label>
            )}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from(groups.entries()).map(([key, g]) => {
                    const counts = { foundations: 0, platforms: 0, apps: 0 } as Record<string, number>;
                    const accounts = new Set<string>();
                    const regions = new Set<string>();
                    g.nodes.forEach((n) => {
                        if ((n as any).layer && counts[(n as any).layer] !== undefined) counts[(n as any).layer]++;
                        if ((n as any).account) accounts.add((n as any).account);
                        if ((n as any).region) regions.add((n as any).region);
                    });

                    const elements: ElementDefinition[] = [];
                    g.nodes.forEach((n) => {
                        elements.push({ data: { id: n.id, label: n.id.split('.').slice(-2).join('.'), type: n.type, layer: (n as any).layer || '' } });
                    });
                    g.edges.forEach((e) => elements.push({ data: { id: `${e.source}->${e.target}`, source: e.source, target: e.target, kind: e.kind || 'dep' } }));

                    return (
                        <Card key={key}

                            draggable
                            onDragStart={(e) => onDragStart(e, key)}
                            onDragOver={onDragOver}
                            onDrop={(e) => onDrop(e, key)}
                        >
                            <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-sm font-medium">{niceName(key)}</CardTitle>
                                    <div className="flex items-center gap-2 text-[11px] text-slate-600">
                                        <Badge variant="outline">F:{counts.foundations}</Badge>
                                        <Badge variant="outline">P:{counts.platforms}</Badge>
                                        <Badge variant="outline">A:{counts.apps}</Badge>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <MiniCy elements={elements} />
                                <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-slate-600">
                                    <Badge variant="outline">{g.nodes.length} resources</Badge>
                                    <Badge variant="outline">{g.edges.length} links</Badge>
                                    <Badge variant="outline">{accounts.size} acct</Badge>
                                    <Badge variant="outline">{regions.size} region</Badge>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
