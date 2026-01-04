import Navbar from "../components/navbar.jsx";
import { UserCheck, Cpu, AlertTriangle, Database } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen ">
      <Navbar />

      <div className="max-w-5xl mx-auto p-8 mt-13">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
            About Cura Health Assistant
          </h1>
          <p className="text-gray-600 text-lg">
            AI-powered supplement recommendations personalized for your needs
          </p>
        </div>

        {/* What it does */}
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-4 mb-12">
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-shadow duration-300 text-center">
            <UserCheck className="mx-auto mb-4 text-indigo-500" size={36} />
            <h2 className="text-xl font-semibold mb-2">Personalized</h2>
            <p className="text-gray-600 text-sm">
              Recommendations are tailored based on your inputs like age, health
              goals, and lifestyle.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-shadow duration-300 text-center">
            <Cpu className="mx-auto mb-4 text-green-500" size={36} />
            <h2 className="text-xl font-semibold mb-2">AI Powered</h2>
            <p className="text-gray-600 text-sm">
              Our intelligent assistant analyzes your answers to provide
              informative supplement suggestions.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-shadow duration-300 text-center">
            <AlertTriangle className="mx-auto mb-4 text-red-500" size={36} />
            <h2 className="text-xl font-semibold mb-2">Safe & Informational</h2>
            <p className="text-gray-600 text-sm">
              Cura provides guidance only. Always consult a licensed healthcare
              professional before making changes.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-shadow duration-300 text-center">
            <Database className="mx-auto mb-4 text-blue-500" size={36} />
            <h2 className="text-xl font-semibold mb-2">Trusted Data Source</h2>
            <p className="text-gray-600 text-sm">
              Supplement information is sourced from the{" "}
              <a
                href="https://ods.od.nih.gov/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline hover:text-blue-800"
              >
                NIH Office of Dietary Supplements (ODS)
              </a>
              .
            </p>
          </div>
        </div>

        {/* How it works */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <Cpu size={28} className="text-green-500" /> How It Works
          </h2>
          <ol className="list-decimal list-inside space-y-3 text-gray-700 text-lg">
            <li>
              Answer a few simple questions about your age, gender, and health
              concerns.
            </li>
            <li>
              Our AI analyzes your inputs and generates personalized supplement
              recommendations.
            </li>
            <li>
              Always consult a licensed healthcare professional before taking
              any supplements.
            </li>
          </ol>
        </div>

        {/* Disclaimer */}
        <div className="bg-yellow-50 p-6 rounded-xl border-l-4 border-yellow-400 flex items-start gap-4">
          <AlertTriangle className="text-yellow-500 mt-1" size={28} />
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-1">
              Disclaimer
            </h3>
            <p className="text-gray-700 text-sm">
              ⚠️ This platform is for informational purposes only and does not
              replace professional medical advice.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
