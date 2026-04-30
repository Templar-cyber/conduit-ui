"use client";

import { Truck, Package, BarChart3 } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Turnstile from "react-turnstile";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const router = useRouter();

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });

    if (error) console.error(error.message);
  };
  const handleLogin = async () => {
    setErrorMessage("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    console.log("LOGIN RESULT:", data, error);

    if (error) {
      setErrorMessage("Incorrect details, please try again");

      setFailedAttempts((prev) => prev + 1);

      return;
    }

    // send user to dashboard
    window.location.href = "/dashboard";
  };
  return (
    <div className="min-h-screen flex">
      {/* LEFT */}
      <div className="w-1/2 bg-[#f9fafb] flex items-center justify-center px-16 relative z-10">
        <div className="max-w-md w-full">
          {/* LOGO */}
          <img src="/CONDUIT_logo_on_white.jpeg" className="h-60 mb-6" />

          <h2 className="text-2xl font-semibold mb-1 text-gray-700">
            Welcome back
          </h2>
          <p className="text-1xl font-semibold mb-4 text-gray-700">
            Sign in to access your CONDUIT workflow
          </p>

          {/* GOOGLE */}
          <button
            onClick={handleGoogleLogin}
            className="w-full border border-gray-300 rounded-lg p-3 mb-4 flex items-center justify-center gap-2
bg-white text-gray-700 cursor-pointer transition-all duration-200
hover:bg-gray-50 hover:shadow-md hover:-translate-y-[1px]
active:scale-[0.98]"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              className="w-5 h-5"
            />
            Continue with Google
          </button>

          {/* OR */}
          <div className="flex items-center my-4">
            <div className="flex-1 h-px bg-gray-300" />
            <span className="px-3 text-sm text-gray-400">Or</span>
            <div className="flex-1 h-px bg-gray-300" />
          </div>

          {/* EMAIL */}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@company.com"
            className="w-full border border-gray-300 rounded-lg p-3 mb-4 text-gray-900 placeholder:text-gray-400"
          />

          {/* PASSWORD */}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full border border-gray-300 rounded-lg p-3 mb-4 text-gray-900 placeholder:text-gray-400"
          />

          {/* LOGIN */}

          {failedAttempts >= 5 && (
            <div className="mt-2 mb-3">
              <Turnstile
                sitekey="0x4AAAAAADEbApCEXtV9oT31"
                onVerify={(token) => setCaptchaToken(token)}
              />
            </div>
          )}
          {errorMessage && (
            <p className="text-red-500 text-sm mb-3">{errorMessage}</p>
          )}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              console.log("CLICK FIRED");
              handleLogin();
            }}
            className="w-full bg-blue-600 text-white rounded-lg p-3 mb-4 cursor-pointer 
            transition hover:bg-blue-700 active:bg-blue-800
            disabled:opacity-50 disabled:cursor-not-allowed disabled;hover:bg-blue-600"
          >
            Log in
          </button>

          {/* FOOTER */}
          <button
            onClick={() => router.push("/forgot-password")}
            className="text-sm text-blue-600 text-left cursor-pointer hover:underline"
          >
            Forgot password?
          </button>
        </div>
      </div>

      {/* RIGHT SIDE (VISUAL) */}
      <div
        className="w-1/2 relative flex items-center justify-center text-white 
      overflow-hidden pointer-events-none z-0"
      >
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
