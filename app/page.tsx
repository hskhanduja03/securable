"use client";

import { useRouter } from "next/navigation";
import { Target } from "lucide-react"; // Adjust import path if different
import { useEffect } from "react";

export default function LandingPage() {
  const router = useRouter();

  return (
    <main className="relative flex flex-col items-center justify-center min-h-screen px-6 bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 text-white overflow-hidden">
      {/* Logo */}
      <div className="mb-8 flex items-center space-x-3 animate-fadeIn">
        <Target className="w-8 h-8 text-white" />
        <h1 className="text-4xl font-extrabold tracking-tight">Trackr</h1>
      </div>

      {/* Tagline */}
      <p className="max-w-lg text-center text-orange-100 text-lg mb-12 animate-fadeIn delay-100">
        Simplify your finances with Trackr — effortless expense tracking, smart
        insights, and total control.
      </p>

      {/* Get Started Button */}
      <button
        onClick={() => router.push("/dashboard")}
        className="px-10 py-4 rounded-full bg-white text-orange-600 font-semibold shadow-lg hover:bg-orange-50 transition-colors duration-300 animate-fadeIn delay-200 focus:outline-none focus:ring-4 focus:ring-white/50"
        aria-label="Get started with Trackr"
      >
        Get Started →
      </button>

      {/* Footer */}
      <footer className="absolute bottom-6 text-orange-200 text-sm select-none">
        © {new Date().getFullYear()} Trackr. All rights reserved.
      </footer>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease forwards;
        }
        .animate-fadeIn.delay-100 {
          animation-delay: 0.1s;
        }
        .animate-fadeIn.delay-200 {
          animation-delay: 0.2s;
        }
      `}</style>
    </main>
  );
}
