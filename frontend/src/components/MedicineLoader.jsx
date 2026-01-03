import { motion } from "framer-motion";
import { Pill, Search } from "lucide-react";

export default function MedicineLoader() {
  const orbitRadius = 40; // distance from the pill center

  return (
    <>
      {/* Dark overlay */}
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Loader content */}
      <motion.div
        className="fixed inset-0 flex items-center justify-center z-50"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
      >
        <div className="flex flex-col items-center justify-center">
          <div className="relative w-24 h-24">
            {/* Medicine capsule */}
            <Pill className="w-24 h-24 text-green-500" />

            {/* Magnifying glass orbit */}
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              animate={{
                x: [0, orbitRadius, 0, -orbitRadius, 0],
                y: [-orbitRadius, 0, orbitRadius, 0, -orbitRadius],
              }}
              transition={{
                repeat: Infinity,
                duration: 4,
                ease: "easeInOut",
                repeatType: "loop",
              }}
            >
              <Search className="w-8 h-8 text-yellow-400 shadow-lg rounded-full bg-red-500 p-1" />
            </motion.div>
          </div>

          <p className="mt-4 text-white font-medium text-center">
            Analyzing your health report...
          </p>
        </div>
      </motion.div>
    </>
  );
}
