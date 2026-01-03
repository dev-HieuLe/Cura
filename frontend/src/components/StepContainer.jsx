import { motion } from "framer-motion";

export default function StepContainer({ children, step }) {
  return (
    <motion.div
      key={step}
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -100, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
}
