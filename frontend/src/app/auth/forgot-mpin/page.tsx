"use client";
import { useState } from "react";
import { toast } from "react-toastify";

export default function ForgotMpin() {
  const [email, setEmail] = useState("");

  const sendLink = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/forgot-mpin`,
      {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({ email }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.error);
      return;
    }

    toast.success("Reset link sent to your email 📧");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4 sm:px-6 lg:px-8">

  <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-6 sm:p-8 space-y-6">

    {/* Logo */}
    <div className="flex justify-center">
      <div className="h-12 w-12 sm:h-14 sm:w-14 flex items-center justify-center rounded-full bg-blue-600 text-white text-xl sm:text-2xl font-bold shadow-md">
        🔐
      </div>
    </div>

    {/* Heading */}
    <div className="text-center space-y-1">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
        Forgot MPIN?
      </h2>
      <p className="text-xs sm:text-sm text-gray-500">
        Enter your registered email to receive reset instructions.
      </p>
    </div>

    {/* Email Input */}
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-600">
        Email Address
      </label>
      <input
        type="email"
        placeholder="you@example.com"
        className="w-full rounded-lg border border-gray-300 p-3 text-sm sm:text-base 
                   focus:outline-none focus:ring-2 focus:ring-blue-500 
                   focus:border-transparent transition duration-200"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
    </div>

    {/* Button */}
    <button
      onClick={sendLink}
      className="w-full bg-blue-600 hover:bg-blue-700 active:scale-95 
                 text-white font-semibold p-3 rounded-lg 
                 shadow-md transition duration-200 text-sm sm:text-base"
    >
      Send Reset Link
    </button>

    {/* Back to Login */}
    <p className="text-center text-xs sm:text-sm text-gray-500">
      Remember your MPIN?{" "}
      <span className="text-blue-600 font-medium cursor-pointer hover:underline">
        Back to Login
      </span>
    </p>

  </div>
</div>
  );
}