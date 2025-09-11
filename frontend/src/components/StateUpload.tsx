import { useState } from "react";
import { uploadTfState } from "./api";

export default function StateUpload({ onGraph }: { onGraph: (g: any) => void }) {
    const [busy, setBusy] = useState(false);
    const [err, setErr] = useState<string | null>(null);

    return (
        <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={async (e) => {
                e.preventDefault();
                const f = e.dataTransfer.files?.[0];
                if (!f) return;
                setBusy(true); setErr(null);
                try { const g = await uploadTfState(f); onGraph(g); }
                catch (e: any) { setErr(e.message || "upload failed"); }
                finally { setBusy(false); }
            }}
            className="border-dashed border rounded p-6 text-sm text-slate-600"
        >
            <input
                type="file"
                accept=".tfstate,application/json"
                onChange={async (e) => {
                    const f = e.target.files?.[0];
                    if (!f) return;
                    setBusy(true); setErr(null);
                    try { const g = await uploadTfState(f); onGraph(g); }
                    catch (e: any) { setErr(e.message || "upload failed"); }
                    finally { setBusy(false); }
                }}
            />
            <div className="mt-2">{busy ? "Processing…" : "Drop a .tfstate or pick a file"}</div>
            {err ? <div className="mt-2 text-red-600">{err}</div> : null}
        </div>
    );
}
