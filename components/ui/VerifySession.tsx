import React from "react";
import { motion } from "framer-motion";
import { Target } from "lucide-react";
import { Card } from "./card";

const VerifySession = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-sm"
      >
        <Card className="relative overflow-hidden border border-transparent bg-white/20 dark:bg-gray-900/30 backdrop-blur-md rounded-2xl shadow-lg p-10 flex flex-col items-center text-center">
          {/* Animated glowing gradient circle behind icon */}
          <motion.div
            animate={{
              rotate: 360,
            }}
            transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
            className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-gradient-to-tr from-orange-400 via-red-500 to-pink-600 opacity-30 blur-3xl"
          />
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              delay: 0.15,
              type: "spring",
              stiffness: 250,
              damping: 20,
            }}
            className="relative z-10 flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-red-600 shadow-lg"
          >
            <Target className="w-10 h-10 text-white drop-shadow-md" />
          </motion.div>

          <h2 className="relative z-10 mt-8 mb-3 text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Verifying Session
          </h2>
          <p className="relative z-10 max-w-xs text-gray-700 dark:text-gray-300 mb-8 text-sm leading-relaxed">
            Please wait while we check your authentication status...
          </p>

          <div className="relative z-10 flex items-center space-x-3">
            <span className="inline-block w-6 h-6 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
              Checking credentials
            </span>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default VerifySession;
