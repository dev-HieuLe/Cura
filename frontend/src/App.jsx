import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/navbar";

export default function App() {
  return (
    <div className="min-h-screen">
      {/* <Navbar onGoHome={goHome} /> */}
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  );
}
