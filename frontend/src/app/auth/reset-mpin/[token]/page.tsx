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
    <div className="min-h-screen flex justify-center items-center">
      <div className="bg-white shadow p-8 rounded-lg w-96 space-y-4">
        <h2 className="text-xl font-semibold text-center">Reset MPIN 🔐</h2>

        <input
          type="password"
          maxLength={4}
          placeholder="New MPIN"
          value={mpin}
          onChange={(e)=>setMpin(e.target.value.replace(/\D/g,''))}
          className="border p-3 w-full"
        />

        <input
          type="password"
          maxLength={4}
          placeholder="Confirm MPIN"
          value={confirm}
          onChange={(e)=>setConfirm(e.target.value.replace(/\D/g,''))}
          className="border p-3 w-full"
        />

        <button
          onClick={handleReset}
          disabled={loading}
          className="bg-blue-600 text-white w-full p-3 rounded"
        >
          {loading ? "Resetting..." : "Reset MPIN"}
        </button>
      </div>
    </div>
  );
}