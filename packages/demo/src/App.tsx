import { useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { SplashScreen } from "./components/SplashScreen";
import { Landing } from "./pages/Landing";
import { Demos } from "./pages/Demos";
import { Docs } from "./pages/Docs";
import { AdvancedExamples } from "./pages/AdvancedExamples";

function AppContent() {
  const location = useLocation();
  const [showSplash, setShowSplash] = useState(() => {
    // Only show splash on landing page and if not already shown this session
    if (location.pathname !== "/") return false;
    const hasSeenSplash = sessionStorage.getItem("ethosgate-splash-shown");
    return !hasSeenSplash;
  });

  const handleSplashComplete = () => {
    setShowSplash(false);
    sessionStorage.setItem("ethosgate-splash-shown", "true");
  };

  return (
    <>
      {showSplash && <SplashScreen onComplete={handleSplashComplete} duration={2500} />}
      <div className={`min-h-screen bg-transparent ${showSplash ? "opacity-0" : "animate-fade-in"}`}>
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/demos" element={<Demos />} />
          <Route path="/docs" element={<Docs />} />
          <Route path="/examples" element={<AdvancedExamples />} />
        </Routes>
      </div>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
