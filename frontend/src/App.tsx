import { Navbar } from "./components/Navbar";
import { HeroPanel } from "./components/HeroPanel";
import { SummaryCards } from "./components/SummaryCards";
import { EntriesTable } from "./components/EntriesTable";
import TfGraphCards from "./components/TfGraphCards";
import StateUpload from "./components/StateUpload";
import { useState } from "react";

export default function App() {
  const [graph, setGraph] = useState<any | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-6 space-y-8">
        {/* <HeroPanel /> */}
        {/* <SummaryCards /> */}
        {/* <EntriesTable /> */}
        <StateUpload onGraph={setGraph} />
        {graph ? <TfGraphCards graph={graph} /> : null}
      </main>
    </div>
  );
}