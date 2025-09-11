// ui/GraphCard.tsx
"use client";
import React, { useEffect, useRef } from "react";
import cytoscape from "cytoscape";
import coseBilkent from "cytoscape-cose-bilkent";
cytoscape.use(coseBilkent);

// Accept either {nodes,edges} or {elements:{nodes,edges}}
type CyElems = { nodes?: ElementDefinition[]; edges?: ElementDefinition[] };
type Props = { title: string; elements?: CyElems | { elements?: CyElems } };

const sizeTier = (n: number) => (n > 200 ? "xl" : n > 120 ? "lg" : n > 60 ? "md" : n > 25 ? "sm" : "xs");
const tierHeights: Record<string, string> = { xs: "h-52", sm: "h-72", md: "h-96", lg: "h-[32rem]", xl: "h-[40rem]" };
const cyPadding: Record<string, number> = { xs: 30, sm: 40, md: 60, lg: 80, xl: 100 };

export default function GraphCard({ title, elements }: Props) {
    const unwrapped = (elements as any)?.elements ?? (elements as any) ?? {};
    const nodes = Array.isArray(unwrapped?.nodes) ? (unwrapped!.nodes as ElementDefinition[]) : [];
    const edges = Array.isArray(unwrapped?.edges) ? (unwrapped!.edges as ElementDefinition[]) : [];
    const nodeCount = nodes.length;

    const tier = sizeTier(nodeCount);
    const spanClass =
        tier === "xl" ? "col-span-1 md:col-span-2 xl:col-span-3"
            : tier === "lg" ? "col-span-1 md:col-span-2"
                : "col-span-1";

    const cyRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!cyRef.current) return;

        const cy = cytoscape({
            container: cyRef.current,
            elements: { nodes, edges },
            style: [
                {
                    selector: "node",
                    style: {
                        label: "data(label)",
                        "text-wrap": "wrap",
                        "text-max-width": "140px",
                        "text-valign": "center",
                        "text-halign": "center",
                        "font-size": nodeCount > 120 ? 8 : nodeCount > 60 ? 9 : 10,
                    },
                },
                { selector: "edge", style: { "curve-style": "unbundled-bezier", "target-arrow-shape": "triangle" } },
            ],
            layout: {
                name: "cose-bilkent", // falls back to cose if plugin missing
                randomize: true,
                fit: true,
                padding: cyPadding[tier],
                nodeRepulsion: 5000 * (1 + Math.log10(Math.max(10, nodeCount))),
                idealEdgeLength: 90 * (1 + Math.log10(Math.max(10, nodeCount))),
                gravity: 0.25,
                numIter: 2500,
                tile: true,
                animate: false,
            } as any,
            pixelRatio: 2,
            wheelSensitivity: 0.2,
        });

        const pad = cyPadding[tier];
        cy.ready(() => cy.fit(pad));
        const ro = new ResizeObserver(() => cy.fit(pad));
        ro.observe(cyRef.current);

        return () => {
            ro.disconnect();
            cy.destroy();
        };
        // Rebuild only when counts change to avoid thrashing
    }, [nodeCount, edges.length, tier]);

    return (
        <div className={`rounded-2xl border bg-white shadow-sm p-4 ${spanClass}`}>
            <div className="mb-3 text-sm font-medium">{title}</div>
            <div ref={cyRef} className={`w-full ${tierHeights[tier]}`} />
        </div>
    );
}
