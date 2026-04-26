"use client";

import { Truck, Package, BarChart3 } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [step, setStep] = useState<"email" | "password">("email");
  const [mode, setMode] = useState<"login" | "reset">("login");
  const [email, setEmail] = useState(" ");
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });

    if (error) {
      console.error("Google login error:", error.message);
    }
  };
  const handlePasswordReset = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "http://localhost:3000/reset-password",
    });

    if (error) {
      console.error("Reset error:", error.message);
    } else {
      setMode("sent"); // show confirmation UI
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="w-1/2 bg-[#f9fafb] text-black flex flex-col justify-center px-16">
        <div className="max-w-md w-full">
          {/* LOGO */}
          <div className="mb-6 flex items-center">
            <img
              src="/CONDUIT_logo_on_white.jpeg"
              alt="CONDUIT"
              className="h-60 w-auto"
            />
          </div>

          {/* STATIC BLOCK */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">Welcome back</h2>

            <p className="text-gray-500 mb-6 leading-relaxed">
              Sign in to access your CONDUIT workflow and manage your
              operations.
            </p>

            {/* GOOGLE BUTTON */}
            <button
              onClick={handleGoogleLogin}
              className="w-full border border-gray-300 rounded-lg p-3 mb-4 flex items-center justify-center gap-2 hover:bg-gray-50 transition"
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                className="w-5 h-5"
                alt="Google"
              />
              Continue with Google
            </button>

            {/* OR DIVIDER */}
            <div className="flex items-center my-4">
              <div className="flex-1 h-px bg-gray-300" />
              <span className="px-3 text-sm text-gray-400">Or</span>
              <div className="flex-1 h-px bg-gray-300" />
            </div>
          </div>

          {/* ========================= */}
          {/* DYNAMIC BLOCK */}
          {/* ========================= */}

          <div className="space-y-4">
            {/* EMAIL (ALWAYS VISIBLE) */}
            <input
              type="email"
              value={email || ""}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              className="w-full border border-gray-300 rounded-lg p-3"
            />

            {/* CONTINUE BUTTON (STEP CONTROL) */}
            {step === "email" && (
              <button
                onClick={() => setStep("password")}
                className="w-full bg-blue-600 text-white rounded-lg p-3 transition hover:bg-blue-700 active:bg-blue-800"
              >
                Continue
              </button>
            )}

            {/* PASSWORD STEP */}
            {step === "password" && (
              <>
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="w-full border border-gray-300 rounded-lg p-3"
                />

                <button className="w-full bg-blue-600 text-white rounded-lg p-3 transition hover:bg-blue-700 active:bg-blue-800">
                  Log in
                </button>

                <button
                  onClick={() => setMode("reset")}
                  className="text-sm text-blue-600 text-left transition hover:text-blue-800 underline-offset-2 hover:underline"
                >
                  Forgot password?
                </button>
              </>
            )}

            {/* RESET MODE */}
            {mode === "reset" && (
              <>
                <button className="w-full bg-blue-600 text-white rounded-lg p-3 transition hover:bg-blue-700 active:bg-blue-800">
                  Send reset link
                </button>

                <button
                  onClick={() => {
                    setMode("login");
                    setStep("email");
                  }}
                  className="text-sm text-gray-500 text-left"
                >
                  Back to login
                </button>
              </>
            )}
          </div>

          {/* FOOTER */}
          <p className="text-xs text-gray-400 mt-5">
            By proceeding, you agree to the Terms of Service and Privacy Policy
          </p>
        </div>
      </div>

      {/* RIGHT SIDE (VISUAL) */}
      <div className="w-1/2 relative flex items-center justify-center text-white overflow-hidden">
        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-indigo-600 to-cyan-400" />

        {/* Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.12),transparent_60%)]" />

        {/* SVG Orbital System */}
        <svg className="absolute w-[700px] h-[700px]" viewBox="0 0 700 700">
          {/* Main Circle */}
          <circle
            cx="350"
            cy="350"
            r="250"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="1"
            fill="none"
          />

          {/* Shifted Overlap Circle (less overlap, pushed right) */}
          <circle
            cx="520"
            cy="330"
            r="250"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="1"
            fill="none"
          />

          {/* Waypoint dots */}
          <circle cx="350" cy="100" r="4" fill="white" opacity="0.8" />
          <circle cx="580" cy="350" r="4" fill="white" opacity="0.6" />
          <circle cx="350" cy="600" r="4" fill="white" opacity="0.6" />
          <circle cx="120" cy="350" r="4" fill="white" opacity="0.6" />
        </svg>

        {/* Icons */}
        <div className="absolute inset-0">
          {/* Top Right */}
          <div className="absolute top-[18%] right-[20%] w-16 h-16 rounded-full border border-white/30 flex items-center justify-center backdrop-blur bg-white/5">
            <Package size={26} />
          </div>

          {/* Truck (moved UP to sit on orbital line) */}
          <div className="absolute bottom-[26%] left-[20%] w-16 h-16 rounded-full border border-white/30 flex items-center justify-center backdrop-blur bg-white/5">
            <Truck size={26} />
          </div>

          {/* Bottom Right */}
          <div className="absolute bottom-[22%] right-[22%] w-16 h-16 rounded-full border border-white/30 flex items-center justify-center backdrop-blur bg-white/5">
            <BarChart3 size={26} />
          </div>
        </div>

        {/* Content */}
        <div className="relative text-center max-w-lg px-10">
          <h1 className="text-1xl font-semibold mb-5 tracking-tight leading-snug">
            CONDUIT Fulfilment System
          </h1>

          <p className="text-m opacity-90 leading-relaxed tracking-wide">
            Automate your order flow, coordinate suppliers, and manage your
            fulfilment pipeline in real time.
          </p>

          <p className="text-m opacity-70 mt-4">
            Built for precision, speed, and complete operational control.
          </p>
        </div>
      </div>
    </div>
  );
}
