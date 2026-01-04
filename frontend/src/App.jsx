import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ChatWidget from "./components/ChatWidget";
import About from "./pages/About";
import FAQ from "./pages/FAQ";

export default function App() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Pill playground in the background */}

      {/* Main content */}
      <div className="relative z-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<FAQ />} />
        </Routes>
      </div>

      {/* Chat widget on top */}
      <div className="fixed bottom-5 right-5 z-50">
        <ChatWidget />
      </div>
    </div>
  );
}
