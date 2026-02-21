"use client";

import { useState } from "react";
import { ArrowRight, Lock, User, Users } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useAuthStore } from "@/store/auth.store";

export default function Page() {
  const router = useRouter();

  const [identifier, setIdentifier] = useState("");
  const [mpin, setMpin] = useState("");
  const [loading, setLoading] = useState(false);
  const loginStore = useAuthStore.getState();

  /* ==============================
        LOGIN FUNCTION
  ============================== */
  const handleLogin = async () => {
    if (!identifier || !mpin) {
      toast.error("Please enter phone/email and MPIN");
      return;
    }

    if (!/^\d{4}$/.test(mpin)) {
      toast.error("MPIN must be 4 digits");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            identifier,
            mpin,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Login failed");
        return;
      }

      // 🔐 Save login session
      // localStorage.setItem("accessToken", data.accessToken);
      // localStorage.setItem("user", JSON.stringify(data.user));
      loginStore.login(data.user, data.accessToken);

      toast.success("Login successful 🎉");

      // Redirect based on role
      if (data.user.role === "technician") {
        router.push("/technician");
      } else if (data.user.role === "admin") {
        router.push("/admin");
      }else{
        router.push("/user");
      }
    } catch (error) {
      toast.error("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ENTER KEY SUPPORT */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !loading) {
      handleLogin();
    }
  };

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* LEFT SIDE HERO */}
      <div className="relative flex min-h-[400px] w-full flex-col justify-between bg-slate-900 p-8 lg:min-h-screen lg:w-1/2 lg:p-12">
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

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-white/10 backdrop-blur-sm">
              <div className="h-6 w-6 rounded border-2 border-white" />
            </div>
            <span className="text-xl font-semibold text-white">
              AC Marketplace
            </span>
          </div>
        </div>

        <div className="relative z-10 mt-auto">
          <h1 className="mb-4 text-4xl font-bold text-white lg:text-5xl">
            Secure Login with MPIN
          </h1>
          <p className="text-lg text-gray-100">
            Enter your registered phone number or email and your 4-digit MPIN.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE LOGIN FORM */}
      <div className="flex w-full items-center justify-center bg-white p-8 lg:w-1/2 lg:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Heading */}
          <div>
            <h2 className="mb-2 text-3xl font-bold text-gray-900">
              Welcome back 👋
            </h2>
            <p className="text-gray-600">
              Login using your phone/email and secure MPIN.
            </p>
          </div>

          {/* Identifier */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900">
              Phone Number or Email
            </label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter phone or email"
              className="w-full rounded-lg border border-gray-300 bg-white py-3.5 px-4 text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
            />
          </div>

          {/* MPIN */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900">
              4 Digit MPIN
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="password"
                inputMode="numeric"
                maxLength={4}
                value={mpin}
                onChange={(e) =>
                  setMpin(e.target.value.replace(/\D/g, ""))
                }
                onKeyDown={handleKeyDown}
                placeholder="****"
                className="w-full rounded-lg border border-gray-300 bg-white py-3.5 pl-12 pr-4 text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
              />
            </div>

            <p
              className="text-sm text-blue-600 text-right mt-2 cursor-pointer hover:underline"
              onClick={() => router.push("/auth/forgot-mpin")}
            >
              Forgot MPIN?
            </p>
          </div>

          {/* Login Button */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-700 px-6 py-3.5 text-base font-semibold text-white transition hover:bg-blue-800 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login Securely"}
            <ArrowRight className="h-5 w-5" />
          </button>

          {/* Register options */}
          <div>
            <p className="text-center text-sm text-gray-600">
              New to AC Marketplace?
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <button
              onClick={() => router.push("/auth/register")}
              className="group flex flex-col items-center rounded-lg border-2 border-gray-200 bg-white p-6 hover:border-blue-600 hover:bg-blue-50"
            >
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 group-hover:bg-blue-200">
                <User className="h-6 w-6 text-blue-700" />
              </div>
              <h3 className="text-base font-semibold text-gray-900">
                Join as User
              </h3>
              <p className="text-sm text-gray-600">Book services</p>
            </button>

            <button
              onClick={() => router.push("/auth/technician-registration")}
              className="group flex flex-col items-center rounded-lg border-2 border-gray-200 bg-white p-6 hover:border-blue-600 hover:bg-blue-50"
            >
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 group-hover:bg-blue-200">
                <Users className="h-6 w-6 text-blue-700" />
              </div>
              <h3 className="text-base font-semibold text-gray-900">
                Join as Technician
              </h3>
              <p className="text-sm text-gray-600">Offer services</p>
            </button>
          </div>

          <p className="text-center text-xs text-gray-500">
            Secure MPIN authentication protects your account 🔐
          </p>
        </div>
      </div>
    </div>
  );
}