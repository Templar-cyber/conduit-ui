"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function PortalLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function getUserRole(userId: string) {
    const { data, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("ROLE FETCH ERROR:", error);
      return null;
    }

    return data?.role;
  }
  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    setError("");
    setLoading(true);

    console.log("START LOGIN");

    const { data, error: signInError } = await supabase.auth.signInWithPassword(
      {
        email,
        password,
      },
    );

    console.log("RESPONSE:", { data, error });
    console.log("AFTER SIGN IN");

    if (signInError) {
      console.log("SIGN IN ERROR:", signInError.message);
      setError(signInError.message);
      setLoading(false);
      return;
    }

    // success
    const role = data?.user ? await getUserRole(data.user.id) : null;

    if (role === "admin") {
      router.push("/dashboard");
    } else if (role === "supplier") {
      router.push("/portal/menu");
    } else {
      router.push("/login");
    }

    setLoading(false); // important

    router.push("/portal/menu");
  };

  return (
    <div className="min-h-screen flex">
      {/* LEFT SIDE */}
      <div className="w-1/2 bg-white flex items-center justify-center">
        <div className="w-[420px] space-y-8">
          {/* LOGO */}
          <div className="flex justify-center">
            <img
              src="/CONDUIT_logo_on_white.jpeg"
              alt="CONDUIT"
              className="h-60 object-contain"
            />
          </div>

          {/* TITLE */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-semibold text-gray-900">
              Supplier Portal
            </h1>
            <p className="text-gray-500 text-sm">Sign in to continue</p>
          </div>

          {/* FORM */}
          <div className="space-y-5">
            {/* EMAIL */}
            <div className="space-y-1">
              <label className="text-sm text-gray-600">Email</label>
              <input
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm text-gray-900 placeholder-gray-400 bg-white transition-all duration-200 hover:border-purple-500 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            {/* PASSWORD */}
            <div className="space-y-1">
              <label className="text-sm text-gray-600">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm text-gray-900 placeholder-gray-400 bg-white transition-all duration-200 hover:border-purple-500 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}
            {/* BUTTON */}
            <button
              type="button"
              onClick={handleLogin}
              disabled={loading}
              className={`w-full py-3 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium cursor-pointer transition-all duration-200 ${
                loading
                  ? "opacity-60 cursor-not-allowed"
                  : "hover:from-purple-600 hover:to-blue-600 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
              }`}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </div>

          {/* FOOTER */}
          <div className="text-center">
            <a href="#" className="text-sm text-gray-500 hover:text-gray-700">
              Forgot password?
            </a>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-1/2 relative overflow-hidden">
        <img
          src="/portal-bg.jpeg"
          alt="Supply chain network"
          className="absolute inset-0 w-full h-full object-cover scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-br from-purple-700/80 to-indigo-900/80" />

        <div className="absolute inset-0 bg-black/10" />

        {/* SaaS words */}
        <div className="absolute inset-0 pointer-events-none">
          <span className="absolute top-[15%] left-[10%] text-white/10 text-[28px]">
            Achievement
          </span>
          <span className="absolute top-[30%] right-[12%] text-white/10 text-[22px]">
            Gratification
          </span>
          <span className="absolute bottom-[25%] left-[8%] text-white/10 text-[26px]">
            Realisation
          </span>
          <span className="absolute top-[50%] right-[18%] text-white/10 text-[20px]">
            Contentment
          </span>
          <span className="absolute bottom-[15%] right-[10%] text-white/10 text-[30px]">
            Completion
          </span>
          <span className="absolute top-[32%] left-[20%] text-white/10 text-[24px]">
            Execution
          </span>
          <span className="absolute bottom-[35%] left-[25%] text-white/10 text-[18px]">
            Satisfaction
          </span>
        </div>

        {/* Center brand */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <img
            src="/CONDUIT_logo_on_white.jpeg"
            alt="CONDUIT"
            className="w-[320px] max-w-[70%] object-contain opacity-40"
          />

          <div className="text-center -mt-6">
            <div className="text-[72px] font-semibold tracking-[0.12em] leading-tight opacity-30">
              Fulfilment
            </div>
            <div className="text-[32px] font-light tracking-[0.3em] uppercase opacity-30 mt-2">
              made simple
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
