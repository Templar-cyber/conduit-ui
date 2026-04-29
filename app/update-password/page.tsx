"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Required for Supabase recovery session
  useEffect(() => {
    supabase.auth.getSession();
  }, []);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      alert("Fill both fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      alert(error.message);
    } else {
      alert("Password updated");
      window.location.href = "/login";
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
        <div className="border border-gray-200 rounded-xl p-6 shadow-sm">
          <h1 className="text-xl font-semibold mb-6 text-center">
            Reset your password
          </h1>

          <form onSubmit={handleUpdatePassword} className="flex flex-col gap-4">
            <input
              type="password"
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3"
            />

            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3"
            />

            <button
              type="submit"
              className="w-full bg-blue-600 text-white rounded-lg p-3"
            >
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
