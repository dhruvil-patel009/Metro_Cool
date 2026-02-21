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
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow w-96 space-y-4">
        <h2 className="text-xl font-semibold">Forgot MPIN</h2>
        <input
          type="email"
          placeholder="Enter your email"
          className="border p-3 w-full"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
        />
        <button onClick={sendLink} className="bg-blue-600 text-white p-3 w-full rounded">
          Send Reset Link
        </button>
      </div>
    </div>
  );
}