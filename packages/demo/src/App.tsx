import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Landing } from "./pages/Landing";
import { Demos } from "./pages/Demos";
import { Docs } from "./pages/Docs";
import { AdvancedExamples } from "./pages/AdvancedExamples";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-transparent">
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/demos" element={<Demos />} />
          <Route path="/docs" element={<Docs />} />
          <Route path="/examples" element={<AdvancedExamples />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
