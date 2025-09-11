import { Navbar } from "./components/Navbar";
import { HeroPanel } from "./components/HeroPanel";
import { SummaryCards } from "./components/SummaryCards";
import { EntriesTable } from "./components/EntriesTable";
import TfGraphCards from "./components/TfGraphCards";

export default function App() {
  return (
    <div className="min-h-screen bg-background">  
      <Navbar />
      <main className="container mx-auto px-4 py-6 space-y-8">
        {/* <HeroPanel /> */}
        {/* <SummaryCards /> */}
        {/* <EntriesTable /> */}

        <TfGraphCards />
      </main>
    </div>
  );
}