import { AnimatePresence, motion } from "framer-motion";
import Navbar from "../components/navbar.jsx";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    question: "Can the AI give prescriptions?",
    answer:
      "No. Cura does not provide prescriptions or diagnostic advice. It only suggests supplements based on the information you provide.",
  },
  {
    question: "Is my personal data safe?",
    answer:
      "Yes. All your data is processed securely. We do not share personal information with third parties and follow best practices for data privacy.",
  },
  {
    question: "How does Cura decide what supplements I need?",
    answer:
      "Cura uses AI algorithms to analyze the information you provide, such as health goals or lifestyle factors, and suggests supplements that may be beneficial.",
  },
  {
    question: "Can I rely solely on Cura for my health?",
    answer:
      "No. Cura is a guidance tool for supplement recommendations. It is not a substitute for professional medical advice or diagnosis.",
  },
  {
    question: "Does Cura track my supplement intake over time?",
    answer:
      "Currently, Cura does not track your supplement history. It provides recommendations based on the information you input at each session.",
  },
  {
    question: "Are the supplement suggestions personalized?",
    answer:
      "Yes. Recommendations are tailored based on your inputs, such as your health goals, age, and lifestyle. However, it’s always best to consult a healthcare professional before starting any new supplement.",
  },
  {
    question: "Do I need to create an account to use Cura?",
    answer:
      "No account is required to receive supplement recommendations. However, creating an account may allow additional features in the future.",
  },
  {
    question: "What should I do if I have allergies or medical conditions?",
    answer:
      "Always inform your healthcare provider about any allergies or medical conditions before taking supplements. Cura recommendations do not account for individual medical conditions.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-3xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6 mt-10">
          Frequently Asked Questions
        </h1>

        <div className="space-y-5">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm p-4">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex justify-between items-center text-left"
              >
                <span className="font-medium text-gray-800">
                  {faq.question}
                </span>
                <motion.div
                  animate={{ rotate: openIndex === i ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown size={20} />
                </motion.div>
              </button>

              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2 text-gray-600 text-sm"
                  >
                    {faq.answer}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
