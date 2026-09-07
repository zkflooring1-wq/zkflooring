"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Shield, Mail, Lock, Eye, EyeOff, RotateCw, CheckCircle2, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

interface MathChallenge {
  num1: number;
  num2: number;
}

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("admin@zkflooring.com");
  const [password, setPassword] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [mathChallenge, setMathChallenge] = useState<MathChallenge>({ num1: 4, num2: 5 });
  const [mathAnswer, setMathAnswer] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Generate single-digit random math challenge (1 to 9 + 1 to 9)
  const generateNewMath = () => {
    const n1 = Math.floor(Math.random() * 9) + 1;
    const n2 = Math.floor(Math.random() * 9) + 1;
    setMathChallenge({ num1: n1, num2: n2 });
    setMathAnswer("");
  };

  useEffect(() => {
    generateNewMath();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // 1. Math Challenge Check (single digit 1-9 + 1-9)
    const expectedMathSum = mathChallenge.num1 + mathChallenge.num2;
    if (parseInt(mathAnswer.trim(), 10) !== expectedMathSum) {
      setError("Incorrect math calculation answer. Please try again.");
      generateNewMath();
      return;
    }

    // 2. Security Key Verification (ZKF2027)
    if (securityAnswer.trim().toUpperCase() !== "ZKF2027") {
      setError("Invalid Master Security Key. Please verify your authorization code.");
      generateNewMath();
      return;
    }

    setLoading(true);

    try {
      // 3. Supabase Auth Verification
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (authError || !data.user) {
        setError(authError?.message || "Invalid admin email address or password.");
        generateNewMath();
        setLoading(false);
        return;
      }

      setSuccess(true);
      toast.success("Welcome back, Admin!");

      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 700);

    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred. Please try again.");
      generateNewMath();
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0D0B08] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Ambient background glows */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-gradient-to-br from-[#BF953F]/15 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-gradient-to-tl from-[#B38728]/15 to-transparent blur-3xl pointer-events-none" />

      <main className="w-full max-w-[460px] bg-[#16120B] rounded-[24px] border border-[#BF953F]/30 shadow-2xl p-8 sm:p-9 relative z-10 backdrop-blur-xl">
        {/* Header Branding */}
        <header className="text-center mb-7">
          <div className="w-14 h-14 rounded-2xl mx-auto mb-4 bg-gradient-to-br from-[#BF953F] via-[#FCF6BA] to-[#B38728] flex items-center justify-center shadow-lg shadow-[#B38728]/25">
            <Shield className="w-7 h-7 text-[#16120B]" />
          </div>
          <h1 className="text-white text-2xl font-black tracking-wider uppercase mb-1">
            ZK Flooring
          </h1>
          <div className="inline-flex items-center gap-1.5 bg-[#BF953F]/10 border border-[#BF953F]/35 rounded-full px-3 py-0.5 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#BF953F]" />
            <span className="text-[#FCF6BA] text-[11px] font-bold tracking-wider uppercase">
              Executive Control Center
            </span>
          </div>
          <p className="text-[#8C8477] text-xs">
            Multi-Layer Protected Admin Portal
          </p>
        </header>

        {/* Error Alert */}
        {error && (
          <div className="flex items-center gap-2.5 bg-red-500/10 border border-red-500/30 rounded-xl p-3 mb-5 text-red-300 text-xs font-semibold">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Success Alert */}
        {success && (
          <div className="flex items-center gap-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 mb-5 text-emerald-300 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Authorization verified. Opening Admin Dashboard...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#DCD3C5]" htmlFor="admin-email">
              Admin Email Address
            </label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3.5 w-4 h-4 text-[#AA771C] pointer-events-none" />
              <input
                id="admin-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@zkflooring.com"
                className="w-full h-11 bg-[#201A11] border border-[#BF953F]/30 rounded-xl pl-10 pr-3.5 text-white text-xs font-medium focus:outline-none focus:border-[#BF953F] transition-all"
                disabled={loading || success}
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#DCD3C5]" htmlFor="admin-password">
              Admin Password
            </label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3.5 w-4 h-4 text-[#AA771C] pointer-events-none" />
              <input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                className="w-full h-11 bg-[#201A11] border border-[#BF953F]/30 rounded-xl pl-10 pr-10 text-white text-xs font-medium focus:outline-none focus:border-[#BF953F] transition-all"
                disabled={loading || success}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-[#8C8477] hover:text-white transition-colors"
                title={showPassword ? "Hide password" : "Show password"}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Security Question Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-[#DCD3C5]" htmlFor="admin-security">
                Master Security Authorization
              </label>
              <span className="text-[#BF953F] bg-[#BF953F]/15 border border-[#BF953F]/30 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase">
                Key Code
              </span>
            </div>
            <div className="relative flex items-center">
              <Shield className="absolute left-3.5 w-4 h-4 text-[#AA771C] pointer-events-none" />
              <input
                id="admin-security"
                type="text"
                required
                value={securityAnswer}
                onChange={(e) => setSecurityAnswer(e.target.value)}
                placeholder="Enter Master Security Key..."
                className="w-full h-11 bg-[#201A11] border border-[#BF953F]/30 rounded-xl pl-10 pr-3.5 text-white text-xs font-medium focus:outline-none focus:border-[#BF953F] transition-all"
                disabled={loading || success}
                autoComplete="off"
              />
            </div>
          </div>

          {/* Dynamic Math Challenge (Single Digit 1-9 + 1-9) */}
          <div className="bg-[#201A11] border border-[#BF953F]/35 rounded-xl p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-[#FCF6BA] text-[11px] font-bold tracking-wider uppercase">
                  Bot Defense Challenge
                </span>
              </div>
              <button
                type="button"
                onClick={generateNewMath}
                disabled={loading || success}
                className="text-[#BF953F] text-[11px] font-bold flex items-center gap-1 hover:text-[#FCF6BA] transition-colors"
                title="New Math Problem"
              >
                <RotateCw className="w-3 h-3" />
                <span>New Problem</span>
              </button>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="flex-1 bg-[#16120B] border border-dashed border-[#BF953F]/45 rounded-lg py-2 px-3 text-center text-[#FCF6BA] font-extrabold text-sm tracking-wide select-none">
                What is {mathChallenge.num1} + {mathChallenge.num2}?
              </div>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                required
                value={mathAnswer}
                onChange={(e) => setMathAnswer(e.target.value.replace(/[^0-9]/g, ""))}
                placeholder="Answer"
                className="w-24 h-10 bg-[#16120B] border border-[#BF953F]/40 rounded-lg text-center text-white font-bold text-sm focus:outline-none focus:border-[#BF953F]"
                disabled={loading || success}
                autoComplete="off"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || success}
            className="w-full h-12 rounded-xl border-none bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] text-[#16120B] font-extrabold text-xs tracking-wider uppercase shadow-lg shadow-[#B38728]/30 hover:opacity-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-[#16120B]/30 border-t-[#16120B] rounded-full animate-spin" />
                <span>Authenticating Credentials...</span>
              </>
            ) : success ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-[#16120B]" />
                <span>Access Granted</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 text-[#16120B]" />
                <span>Authorize &amp; Enter Dashboard</span>
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <footer className="mt-6 pt-4 border-t border-[#BF953F]/15 flex flex-col items-center gap-2 text-center">
          <a
            href="http://localhost:3000"
            className="text-[#8C8477] text-xs font-semibold hover:text-[#DCD3C5] transition-colors inline-flex items-center gap-1.5"
          >
            <span>&larr;</span>
            <span>Return to Public Website</span>
          </a>
          <div className="text-[#575148] text-[10px] tracking-wider uppercase">
            TLS 1.3 Encrypted &bull; Supabase Auth Guard
          </div>
        </footer>
      </main>
    </div>
  );
}
