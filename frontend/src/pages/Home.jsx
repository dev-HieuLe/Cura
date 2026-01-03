import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import MedicineLoader from "../components/MedicineLoader.jsx";
import {
  User,
  Calendar,
  AlertTriangle,
  HeartPulse,
  Pill,
  X,
} from "lucide-react";

import Navbar from "../components/navbar.jsx";
import StepContainer from "../components/StepContainer";
import PdfThumbnail from "../components/PdfThumbnail";

/* ================= MEDICAL ALERT ================= */

function MedicalAlert({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          <X size={18} />
        </button>

        <div className="flex flex-col items-center text-center">
          <AlertTriangle className="text-red-500 mb-3" size={36} />

          <h2 className="text-xl font-semibold text-red-600">Medical Notice</h2>

          <p className="text-sm text-gray-600 mt-4 leading-relaxed">
            This appears to be a <strong>medical concern</strong>.
            <br />
            We are not allowed to give diagnostic or prescription advice.
          </p>

          <p className="text-sm text-gray-500 mt-2">
            Please consult a licensed healthcare professional.
          </p>

          <button onClick={onClose} className="mt-6 w-full primary-btn">
            Got it
          </button>
        </div>
      </motion.div>
    </div>
  );
}

/* ================= MAIN ================= */

export default function Home() {
  // inside Home component
  const goHome = () => {
    setStep(1);
    setResults([]);
    setParsedAdvice("");
    setForm({
      gender: "",
      age: 18,
      allergies: "",
      problem: "",
    });
  };

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showMedicalAlert, setShowMedicalAlert] = useState(false);

  const [form, setForm] = useState({
    gender: "",
    age: 18,
    allergies: "",
    problem: "",
  });

  const [results, setResults] = useState([]);
  const [parsedAdvice, setParsedAdvice] = useState("");

  const next = () => setStep(step + 1);
  const back = () => setStep(step - 1);

  const closeMedicalAlert = () => {
    setShowMedicalAlert(false);
    setStep(1);
    setResults([]);
    setParsedAdvice("");
    setForm({
      gender: "",
      age: 18,
      allergies: "",
      problem: "",
    });
  };

  const submit = async () => {
    setLoading(true);

    const res = await fetch("http://localhost:8080/api/recommend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: `
        Gender: ${form.gender}
        Age: ${form.age}
        Allergies: ${form.allergies}
        Problem: ${form.problem}
        `,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (data.intent === "medical") {
      setShowMedicalAlert(true);
      return;
    }

    setResults(data.recommendations || []);
    setParsedAdvice(data.advice || "");
    setStep(5);
  };

  return (
    <>
      <Navbar onGoHome={goHome} />

      <div className="min-h-screen w-full bg-gray-50 overflow-y-auto mt-20">
        {showMedicalAlert && <MedicalAlert onClose={closeMedicalAlert} />}

        <div className="w-full min-h-screen bg-white p-8 flex justify-center">
          <div className="w-full max-w-[1200px]">
            <AnimatePresence mode="wait">
              {/* STEP 1 */}
              {step === 1 && (
                <StepContainer step={1}>
                  <h1 className="title flex items-center justify-center gap-2">
                    <User size={20} /> Select your gender
                  </h1>

                  <div className="grid grid-cols-2 gap-4 mt-6 max-w-md mx-auto">
                    {["Male", "Female"].map((g) => (
                      <button
                        key={g}
                        onClick={() => {
                          setForm({ ...form, gender: g });
                          next();
                        }}
                        className="card-btn"
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </StepContainer>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <StepContainer step={2}>
                  <h1 className="title flex items-center justify-center gap-2">
                    <Calendar size={20} /> How old are you?
                  </h1>

                  <p className="text-center mt-2 text-gray-500">
                    {form.age} years old
                  </p>

                  <div className="mt-6 flex justify-center">
                    <div className="w-full max-w-md">
                      <input
                        type="range"
                        min="13"
                        max="80"
                        value={form.age}
                        onChange={(e) =>
                          setForm({ ...form, age: e.target.value })
                        }
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div className="actions">
                    <button onClick={back} className="ghost-btn">
                      Back
                    </button>
                    <button onClick={next} className="primary-btn">
                      Next
                    </button>
                  </div>
                </StepContainer>
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <StepContainer step={3}>
                  <h1 className="title flex items-center justify-center gap-2">
                    <AlertTriangle size={20} /> Any allergies?
                  </h1>

                  <div className="mt-6 flex justify-center">
                    <textarea
                      className="input w-full max-w-xl"
                      placeholder="e.g. lactose, seafood (optional)"
                      onChange={(e) =>
                        setForm({ ...form, allergies: e.target.value })
                      }
                    />
                  </div>

                  <div className="actions">
                    <button onClick={back} className="ghost-btn">
                      Back
                    </button>
                    <button onClick={next} className="primary-btn">
                      Next
                    </button>
                  </div>
                </StepContainer>
              )}

              {/* STEP 4 */}
              {step === 4 && (
                <StepContainer step={4}>
                  <h1 className="title flex items-center justify-center gap-2">
                    <HeartPulse size={20} /> Describe your health concern
                  </h1>

                  <div className="mt-6 flex justify-center">
                    <textarea
                      className="input h-40 w-full max-w-xl"
                      placeholder="Describe how you feel, what you want to improve..."
                      onChange={(e) =>
                        setForm({ ...form, problem: e.target.value })
                      }
                    />
                  </div>

                  <div className="actions">
                    <button onClick={back} className="ghost-btn">
                      Back
                    </button>
                    <button onClick={submit} className="primary-btn">
                      {loading ? "Analyzing..." : "Get Recommendations"}
                    </button>
                    {/* Loader */}

                    <AnimatePresence>
                      {loading && (
                        <motion.div
                          key="loader"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="mt-10"
                        >
                          <MedicineLoader />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </StepContainer>
              )}

              {/* STEP 5 */}
              {step === 5 && (
                <StepContainer step={5}>
                  <h1 className="title flex items-center justify-center gap-2">
                    <Pill size={22} /> Your Recommendations
                  </h1>

                  <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {results.map((r, i) => (
                      <motion.div
                        key={i}
                        whileHover={{ y: -8, scale: 1.03 }}
                        transition={{ type: "spring", stiffness: 260 }}
                        className="relative rounded-2xl bg-gray-50 p-4 shadow-sm hover:shadow-xl"
                      >
                        <PdfThumbnail id={r.id} />

                        <h2 className="mt-5 text-xl font-semibold text-center">
                          {r.name}
                        </h2>

                        <p className="mt-1 text-sm text-center text-gray-500">
                          By {r.brand}
                        </p>

                        <a
                          href={r.labelUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute bottom-4 right-5 text-sm font-medium text-gray-600 hover:text-gray-900 transition"
                        >
                          View Info →
                        </a>
                      </motion.div>
                    ))}
                  </div>

                  {parsedAdvice && (
                    <div className="mt-16 max-w-4xl mx-auto">
                      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600 text-sm font-bold">
                            AI
                          </span>
                          Suggestion from Health Care AI
                        </h3>

                        <div className="mt-4 text-gray-700 leading-relaxed text-sm whitespace-pre-line">
                          {parsedAdvice}
                        </div>

                        <p className="mt-6 text-xs text-gray-400">
                          ⚠️ Educational only. Not medical advice.
                        </p>
                      </div>
                    </div>
                  )}
                </StepContainer>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
}
