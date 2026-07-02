import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Loader2, Sparkles, Check } from "lucide-react";

export default function App() {
  const [status, setStatus] = useState<"idle" | "processing" | "success">("idle");
  const [secondsLeft, setSecondsLeft] = useState<number>(10);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleHelloClick = () => {
    if (status !== "idle") return;

    setStatus("processing");
    setSecondsLeft(10);

    const startTime = Date.now();
    timerRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      const remaining = Math.max(10 - Math.floor(elapsed), 0);
      setSecondsLeft(remaining);

      if (elapsed >= 10) {
        if (timerRef.current) clearInterval(timerRef.current);
        setStatus("success");
      }
    }, 100);
  };

  const handleReset = () => {
    setStatus("idle");
    setSecondsLeft(10);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 select-none font-sans overflow-hidden">
      <div className="w-full max-w-md flex flex-col items-center justify-center text-center space-y-8">
        
        {/* Animated Container */}
        <div className="h-64 flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            {status === "idle" && (
              <motion.div
                key="idle"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center"
              >
                <button
                  id="hello-btn-trigger"
                  onClick={handleHelloClick}
                  className="px-8 py-4 bg-gray-950 text-white font-semibold rounded-full tracking-wide shadow-lg hover:bg-gray-800 active:scale-95 transition-all duration-200 cursor-pointer flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Hello
                </button>
              </motion.div>
            )}

            {status === "processing" && (
              <motion.div
                key="processing"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center space-y-4"
              >
                {/* Visual Circular Loader with progress countdown */}
                <div className="relative w-28 h-28 flex items-center justify-center">
                  <svg className="absolute w-full h-full transform -rotate-90">
                    <circle
                      cx="56"
                      cy="56"
                      r="48"
                      className="text-gray-100"
                      strokeWidth="6"
                      stroke="currentColor"
                      fill="transparent"
                    />
                    <motion.circle
                      cx="56"
                      cy="56"
                      r="48"
                      className="text-gray-950"
                      strokeWidth="6"
                      strokeDasharray={301.6}
                      initial={{ strokeDashoffset: 301.6 }}
                      animate={{ strokeDashoffset: (secondsLeft / 10) * 301.6 }}
                      transition={{ duration: 0.1, ease: "linear" }}
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                    />
                  </svg>
                  <span className="text-2xl font-mono font-bold text-gray-900">
                    {secondsLeft}s
                  </span>
                </div>
                
                <p className="text-sm font-medium text-gray-400 tracking-wide animate-pulse">
                  Processing background request...
                </p>
              </motion.div>
            )}

            {status === "success" && (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="flex flex-col items-center space-y-6"
              >
                {/* Success Icon */}
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center border border-emerald-100 shadow-sm">
                  <Check className="w-8 h-8" />
                </div>

                {/* Micro-JSON Box */}
                <div className="bg-gray-50 border border-gray-150 rounded-2xl p-4 w-72 shadow-sm font-mono text-xs text-left text-gray-800">
                  <pre>{JSON.stringify({ message: "Hello" }, null, 2)}</pre>
                </div>

                {/* Reset Trigger */}
                <button
                  onClick={handleReset}
                  className="text-xs font-semibold text-gray-400 hover:text-gray-600 transition duration-150 cursor-pointer uppercase tracking-wider"
                >
                  Run Again
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
