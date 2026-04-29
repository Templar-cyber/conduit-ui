"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "http://localhost:3000/update-password",
    });

    if (error) {
      setMessage("Something went wrong. Try again.");
    } else {
      setMessage("Check your email for the reset link.");
    }
  };

  return (
    <div className="p-10 relative z-50">
      <div className="max-w-md mx-auto">
        {/* LOGO */}
        <div className="flex justify-center mb-8">
          <img
            src="/CONDUIT_logo_on_white.jpeg"
            alt="CONDUIT"
            className="h-60"
          />
        </div>

        {/* CARD */}
        <div className="border border-gray-200 rounded-xl p-6 shadow-sm bg-white">
          <h1 className="text-xl font-semibold mb-4 text-center">
            Forgot your password?
          </h1>

          <p className="text-sm text-gray-500 text-center mb-6">
            Enter your email and we’ll send you a reset link.
          </p>

          <form onSubmit={handleReset} className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 placeholder:text-gray-400"
            />

            <button
              type="submit"
              className="w-full bg-blue-600 text-white rounded-lg p-3"
            >
              Send reset link
            </button>
          </form>

          {/* MESSAGE */}
          {message && (
            <p className="text-sm text-green-600 text-center mt-4">{message}</p>
          )}

          {/* BACK */}
          <button
            onClick={() => (window.location.href = "/login")}
            className="text-sm text-gray-500 hover:underline mt-4 block mx-auto"
          >
            Back to login
          </button>
        </div>
      </div>
    </div>
  );
}
