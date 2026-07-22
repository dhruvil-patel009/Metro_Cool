"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Mail, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";

type Step = "form" | "sent";

export default function ForgotMpin() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<Step>("form");

  const handleSubmit = async () => {
    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/forgot-mpin`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Something went wrong. Please try again.");
        return;
      }

      setStep("sent");
    } catch {
      toast.error("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !loading) handleSubmit();
  };

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">

      {/* ── LEFT HERO ── */}
      <div className="relative flex min-h-[280px] w-full flex-col justify-between bg-slate-900 p-8 lg:min-h-screen lg:w-1/2 lg:p-12">
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/login-screen.png"
            alt="AC Technician"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/80 to-slate-900/60" />
        </div>

        {/* Brand */}
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-white/10 backdrop-blur-sm">
              <div className="h-6 w-6 rounded border-2 border-white" />
            </div>
            <span className="text-xl font-semibold text-white">AC Marketplace</span>
          </Link>
        </div>

        {/* Hero text */}
        <div className="relative z-10 mt-auto">
          {/* <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
            <Mail className="h-7 w-7 text-white" />
          </div> */}
          <h1 className="mb-4 text-3xl font-bold text-white lg:text-4xl">
            Reset your MPIN
          </h1>
          <p className="text-base text-gray-300 lg:text-lg">
            No worries — it happens to everyone. Enter your registered email and
            we'll send you a secure reset link instantly.
          </p>
        </div>
      </div>

      {/* ── RIGHT FORM ── */}
      <div className="flex w-full items-center justify-center bg-white p-6 sm:p-8 lg:w-1/2 lg:p-12">
        <div className="w-full max-w-md space-y-8">

          {step === "form" ? (
            <>
              {/* Back link */}
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Login
              </Link>

              {/* Heading */}
              <div className="space-y-1.5">
                <h2 className="text-3xl font-bold text-gray-900">Forgot MPIN?</h2>
                <p className="text-gray-500">
                  Enter your registered email address and we'll send you a link
                  to reset your MPIN.
                </p>
              </div>

              {/* Email field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-900">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="you@example.com"
                    className="w-full rounded-lg border border-gray-300 bg-white py-3.5 pl-10 pr-4 text-gray-900 placeholder-gray-400
                               focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20
                               transition duration-200 text-sm sm:text-base"
                  />
                </div>
              </div>

              {/* Submit button */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-700 px-6 py-3.5
                           text-base font-semibold text-white transition hover:bg-blue-800
                           active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Sending…
                  </>
                ) : (
                  <>
                    Send Reset Link
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>

              {/* Footer note */}
              <p className="text-center text-xs text-gray-400">
                Remember your MPIN?{" "}
                <Link href="/auth/login" className="text-blue-600 font-medium hover:underline">
                  Back to Login
                </Link>
              </p>
            </>
          ) : (
            /* ── SUCCESS STATE ── */
            <>
              <div className="flex flex-col items-center text-center space-y-6">
                {/* Icon */}
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
                  <CheckCircle2 className="h-10 w-10 text-emerald-600" />
                </div>

                {/* Text */}
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-gray-900">Check your inbox</h2>
                  <p className="text-gray-500 text-sm leading-relaxed max-w-sm">
                    We've sent a password reset link to{" "}
                    <span className="font-semibold text-gray-800">{email}</span>.
                    It may take a minute to arrive.
                  </p>
                </div>

                {/* Tip box */}
                <div className="w-full rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-left">
                  <p className="text-sm font-semibold text-amber-800 mb-1">Didn't receive it?</p>
                  <ul className="text-sm text-amber-700 space-y-1 list-disc list-inside">
                    <li>Check your spam or junk folder</li>
                    <li>Make sure you entered the correct email</li>
                    <li>Wait a few minutes and try again</li>
                  </ul>
                </div>

                {/* Actions */}
                <div className="w-full space-y-3">
                  <button
                    onClick={() => { setStep("form"); setEmail(""); }}
                    className="w-full rounded-lg border border-gray-300 bg-white py-3 text-sm font-semibold
                               text-gray-700 transition hover:bg-gray-50 active:scale-[0.98]"
                  >
                    Try a different email
                  </button>
                  <Link
                    href="/auth/login"
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-700 px-6 py-3
                               text-sm font-semibold text-white transition hover:bg-blue-800 active:scale-[0.98]"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Login
                  </Link>
                </div>
              </div>
            </>
          )}

        </div>
      </div>

    </div>
  );
}
