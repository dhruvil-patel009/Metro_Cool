"use client"

import { useState } from "react"
import { ArrowRight, Phone, User, Users } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function Page() {

  const [phone, setPhone] = useState<string>("");
  const [loading, setLoading] = useState(false);


  const router = useRouter();

  // digits only (no spaces)
  const phoneDigits = phone.replace(/\D/g, "");
  const isValidPhone = phoneDigits.length === 10;

  // ✅ format: 123 456 7890 (10 digits total)
  const formatPhone = (value: string): string => {
    const digits = value.replace(/\D/g, "").slice(0, 10);

    const part1 = digits.slice(0, 3);
    const part2 = digits.slice(3, 6);
    const part3 = digits.slice(6, 10);

    return [part1, part2, part3].filter(Boolean).join(" ");
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhone(e.target.value));
  };




  const handleLogin = async () => {
    const digits = phone.replace(/\D/g, "");

    if (digits.length !== 10) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }

    try {
      setLoading(true);


      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login-phone`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone: phoneDigits }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to send OTP");
        return;
      }

      // DEV MODE OTP (OPTIONAL)
      console.log("OTP:", data.otp);


      //  ✅ store one-time flag
      sessionStorage.setItem("otp_sent", "true");
      // ✅ correct redirect
      router.push(`/auth/otp?phone=${phoneDigits}`);
    } catch (err) {
      toast.error("Server error. Please try again.");
    }
  };

  // ENTER KEY SUPPORT
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && isValidPhone && !loading) {
      handleLogin();
    }
  };

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* Left Side - Hero Section */}
      <div className="relative flex min-h-[400px] w-full flex-col justify-between bg-slate-900 p-8 lg:min-h-screen lg:w-1/2 lg:p-12">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image src="/assets/login-screen.png" alt="HVAC Technician at work" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/80 to-slate-900/60" />
        </div>

        {/* Content */}
        <div className="relative z-10">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-white/10 backdrop-blur-sm">
              <div className="h-6 w-6 rounded border-2 border-white" />
            </div>
            <span className="text-xl font-semibold text-white">HVAC Marketplace</span>
          </div>
        </div>

        <div className="relative z-10 mt-auto">
          <h1 className="mb-4 text-balance text-4xl font-bold leading-tight text-white lg:text-5xl">
            Professional HVAC solutions for every season.
          </h1>
          <p className="text-pretty text-lg text-gray-100 lg:text-xl">
            Connect with certified technicians, manage service requests, and handle payments all in one place.
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex w-full items-center justify-center bg-white p-8 lg:w-1/2 lg:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Welcome Section */}
          <div>
            <h2 className="mb-2 text-3xl font-bold text-gray-900">Welcome back</h2>
            <p className="text-gray-600">Enter your mobile number to log in or create an account.</p>
          </div>

          <div>
            <label htmlFor="phone" className="mb-2 block text-sm font-medium text-gray-900">
              Phone Number
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <Phone className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="tel"
                id="phone"
                inputMode="numeric"
                value={phone}
                onChange={handlePhoneChange}
                onKeyDown={handleKeyDown}

                placeholder="(555) 000-0000"
                className="w-full rounded-lg border border-gray-300 bg-white py-3.5 pl-12 pr-4 text-base text-gray-900 placeholder:text-gray-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
              />
            </div>
          </div>

          <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-700 px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"               disabled={!isValidPhone || loading}
              onClick={handleLogin}>
              {loading ? "Sending OTP..." : "Login Securely"}
            <ArrowRight className="h-5 w-5" />
          </button>

          {/* New User Section */}
          <div>
            <p className="text-center text-sm text-gray-600">New to HVAC Marketplace?</p>
          </div>

          {/* Role Selection Cards */}
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Join as User */}
            <button className="group flex flex-col items-center rounded-lg border-2 border-gray-200 bg-white p-6 transition-all hover:border-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 transition-colors group-hover:bg-blue-200">
                <User className="h-6 w-6 text-blue-700" />
              </div>
              <h3 className="mb-1 text-base font-semibold text-gray-900">Join as User</h3>
              <p className="text-sm text-gray-600">Book services</p>
            </button>

            {/* Join as Technician */}
            <button className="group flex flex-col items-center rounded-lg border-2 border-gray-200 bg-white p-6 transition-all hover:border-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 transition-colors group-hover:bg-blue-200">
                <Users className="h-6 w-6 text-blue-700" />
              </div>
              <h3 className="mb-1 text-base font-semibold text-gray-900">Join as Technician</h3>
              <p className="text-sm text-gray-600">Offer services</p>
            </button>
          </div>

          {/* Footer Text */}
          <p className="text-center text-xs text-gray-500">
            By continuing, you agree to our{" "}
            <a href="#" className="text-blue-700 underline hover:text-blue-800">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-blue-700 underline hover:text-blue-800">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
