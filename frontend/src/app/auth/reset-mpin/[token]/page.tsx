"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

export default function ResetMpinPage() {
  const { token } = useParams();
  const router = useRouter();

  const [mpin, setMpin] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!/^\d{4}$/.test(mpin)) {
      return toast.error("MPIN must be 4 digits");
    }

    if (mpin !== confirm) {
      return toast.error("MPIN does not match");
    }

    try {
      setLoading(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/reset-mpin`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token,
            mpin,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error);
        return;
      }

      toast.success("MPIN reset successful 🎉");
      router.push("/auth/login");
    } catch {
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4 sm:px-6 lg:px-8">
    
    <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-6 sm:p-8 space-y-6">

      {/* Logo / Icon */}
      <div className="flex justify-center">
        <div className="h-12 w-12 sm:h-14 sm:w-14 flex items-center justify-center rounded-full bg-blue-600 text-white text-xl sm:text-2xl font-bold shadow-md">
          🔐
        </div>
      </div>

      {/* Heading */}
      <div className="text-center space-y-1">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
          Reset MPIN
        </h2>
        <p className="text-xs sm:text-sm text-gray-500">
          Enter your new 4-digit MPIN below.
        </p>
      </div>

      {/* New MPIN */}
      <div className="space-y-2">
        <label className="text-md font-medium mb-2 text-black-600">
          New MPIN
        </label>
        <input
          type="password"
          maxLength={4}
          placeholder="••••"
          value={mpin}
          onChange={(e)=>setMpin(e.target.value.replace(/\D/g,''))}
          className="w-full rounded-lg border mt-2 border-gray-300 p-3 text-sm sm:text-base
                     text-left tracking-widest
                     focus:outline-none focus:ring-2 focus:ring-blue-500
                     focus:border-transparent transition duration-200"
        />
      </div>

      {/* Confirm MPIN */}
      <div className="space-y-2">
        <label className="text-md font-medium text-black-600">
          Confirm MPIN
        </label>
        <input
          type="password"
          maxLength={4}
          placeholder="••••"
          value={confirm}
          onChange={(e)=>setConfirm(e.target.value.replace(/\D/g,''))}
          className="w-full rounded-lg border mt-2 border-gray-300 p-3 text-sm sm:text-base
                     text-left tracking-widest
                     focus:outline-none focus:ring-2 focus:ring-blue-500
                     focus:border-transparent transition duration-200"
        />
      </div>

      {/* Button */}
      <button
        onClick={handleReset}
        disabled={loading}
        className={`w-full p-3 rounded-lg font-semibold text-sm sm:text-base
          transition duration-200 shadow-md
          ${loading
            ? "bg-blue-400 cursor-not-allowed text-white"
            : "bg-blue-600 hover:bg-blue-700 active:scale-95 text-white"
          }`}
      >
        {loading ? "Resetting..." : "Reset MPIN"}
      </button>

    </div>
  </div>
  );
}