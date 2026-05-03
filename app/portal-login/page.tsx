"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (email && password) {
      router.push("/portal/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-[380px] text-center">
        {/* LOGO */}
        <div className="flex justify-center mb-1">
          <Image
            src="/CONDUIT_logo_on_white.jpeg" // adjust extension if needed
            alt="CONDUIT"
            width={400}
            height={120}
            priority
          />
        </div>

        {/* TITLE */}
        <h2 className="text-[40px] font-semibold text-black tracking-tight mb-2">
          Supplier Portal
        </h2>

        {/* SUBTEXT */}
        <p className="text-gray-500 mb-8">Please log in</p>

        {/* FORM */}
        <form onSubmit={handleLogin} className="space-y-4 text-left">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-md text-black"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-md text-black"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
