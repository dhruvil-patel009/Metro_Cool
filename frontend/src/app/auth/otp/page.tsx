"use client";

import { useState, useEffect } from "react"
import { ArrowLeft, Phone, Edit3, Info, Shield } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import OtpInput from "react-otp-input";
import { useAuthStore } from "@/store/auth.store";

export default function VerifyOTP() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useAuthStore((s) => s.setAuth);


  const phone = searchParams.get("phone"); // from login page

  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(179); // 2:59 in seconds
  const [loading, setLoading] = useState(false);


  // 🔐 Guard
  useEffect(() => {
    if (!phone) router.push("/auth/login");
  }, [phone, router]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // ✅ VERIFY OTP API
  const handleVerify = async () => {
    if (otp.length !== 6 || !phone) return;

    try {
      setLoading(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/verify-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone, otp }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Invalid OTP");
        return;
      }

      /**
       * ✅ THE MOST IMPORTANT FIX
       * Save token + role using Zustand
       */
      setAuth(
        data.session.accessToken,
        {
          id: data.user.id,
          firstName: data.user.firstName,
          lastName: data.user.lastName,
          role: data.user.role,
          phone: data.user.phone,
          email: data.user.email,
        }
      );



      toast.success("Login successful");

      /**
       * ✅ ROLE-BASED REDIRECT
       */
      if (data.user.role === "admin") {
        router.replace("/admin");
      } else if (data.user.role === "technician") {
        router.replace("/technician");
      } else {
        router.replace("/User");
      }

      // // 🔐 Store tokens (DEV MODE)
      // localStorage.setItem("accessToken", data.session.accessToken);
      // localStorage.setItem("refreshToken", data.session.refreshToken);

      toast.success("Login successful");

      // 🚦 Redirect by role
  
    } catch {
      toast.error("Server error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatPhone = (phone?: string | null) => {
  if (!phone) return "";
  return phone.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
};

    // ⌨️ Enter key
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && otp.length === 6 && !loading) {
      handleVerify();
    }
  };

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };



  return (
    <div className="flex min-h-screen">
      {/* Left Hero Section */}
      <div className="relative hidden w-1/2 lg:block">
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/otp-screen.jpg"
            alt="AC Technician at work"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/80 to-slate-900/60" />
        </div>

        {/* Logo */}
        <div className="absolute left-8 top-8 z-10 flex items-center gap-2 text-white">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm">
            <Phone className="h-5 w-5" />
          </div>
          <span className="text-xl font-semibold">AC Marketplace</span>
        </div>

        {/* Hero Text */}
        <div className="absolute bottom-12 left-8 right-8 z-10 text-white">
          <h1 className="mb-4 text-4xl font-bold leading-tight text-balance">
            Secure access for the entire ecosystem.
          </h1>
          <p className="max-w-lg text-lg leading-relaxed text-white/90">
            Verify your identity to manage service requests, technicians, and
            automated settlements safely. Designed for Users, Technicians, and
            Admins.
          </p>
        </div>
      </div>

      {/* Right Form Section */}
      <div className="flex w-full items-center justify-center bg-white px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-md">
          {/* Back to Login */}
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-sm text-gray-600 transition-colors hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Login
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h2 className="mb-3 text-3xl font-bold text-gray-900">
              Verify Phone Number
            </h2>
            <p className="text-gray-600">
              We've sent a 6-digit verification code to{" "}
              <span className="font-semibold text-gray-900">
                {formatPhone(phone)}
              </span>
              .
            </p>
            <button className="mt-2 inline-flex items-center gap-1.5 text-sm text-blue-600 transition-colors hover:text-blue-700">
              <Edit3 className="h-3.5 w-3.5" />
              Change number
            </button>
          </div>

          {/* OTP Input */}
          {/* <OtpInput
                        value={otp}
                        onChange={setOtp}
                        numInputs={6}
                        shouldAutoFocus
                        inputType="tel"
                        containerStyle="flex justify-between"
                        renderInput={(props) => (
                            <input
                                {...props}
                                className="h-14 w-14 rounded-lg border border-gray-300 text-center text-xl font-semibold focus:border-blue-600 focus:outline-none"
                            />
                        )}
                    /> */}

          <div className="mt-6">
            <OtpInput
              value={otp}
              onChange={setOtp}
              numInputs={6}
              shouldAutoFocus
              inputType="tel"
              containerStyle="flex justify-between gap-3"
              renderInput={(props) => (
                <input
                  {...props}
                  style={{ width: 56, height: 56 }}
                  className="
          h-14 w-24 mb-4
          rounded-md
          border border-gray-300
          bg-white
          text-black
          text-center
          text-xl font-semibold
          tracking-widest
          focus:border-blue-600
          focus:ring-2 focus:ring-blue-600/20
          focus:outline-none
        "
                  autoComplete="one-time-code"
                  inputMode="numeric"
                   onKeyDown={handleKeyDown}
                />
              )}
            />
          </div>

          {/* Timer and Resend */}
          <div className="mb-6 flex items-center justify-between text-sm">
            <span className="text-gray-600">
              Code expires in{" "}
              <span className="font-semibold text-gray-900">
                {formatTime(timeLeft)}
              </span>
            </span>
            <button
              onClick={() => setTimeLeft(180)}
              className="font-semibold text-blue-600 transition-colors hover:text-blue-700"
            >
              ↻ Resend Code
            </button>
          </div>

          {/* Verify Button */}
          <button
            onClick={handleVerify}
            disabled={otp.length !== 6 || loading}
            className="mb-8 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-700 py-3.5 text-base font-semibold text-white transition-colors hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
          >
            <Shield className="h-5 w-5" />
            Verify & Login
          </button>

          {/* Help Section */}
          <div className="rounded-lg bg-gray-50 p-4">
            <div className="flex gap-3">
              <Info className="mt-0.5 h-5 w-5 flex-shrink-0 text-gray-400" />
              <div>
                <p className="mb-1 text-sm font-semibold text-gray-900">
                  Having trouble?
                </p>
                <p className="text-sm text-gray-600">
                  If you didn't receive the code, check your network connection
                  or contact{" "}
                  <button className="font-semibold text-blue-600 hover:text-blue-700">
                    support
                  </button>
                  .
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <p className="mt-8 text-center text-xs text-gray-500">
            Protected by reCAPTCHA and subject to the Google{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Privacy Policy
            </a>{" "}
            and{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Terms of Service
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}