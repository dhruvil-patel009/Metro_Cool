"use client";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

export default function ResetMpin() {
  const { token } = useParams();
  const router = useRouter();

  const [mpin, setMpin] = useState("");

  const reset = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/reset-mpin`,
      {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ token, mpin }),
      }
    );

    const data = await res.json();

    if(!res.ok){
      toast.error(data.error);
      return;
    }

    toast.success("MPIN reset successful 🎉");
    router.push("/auth/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow w-96 space-y-4">
        <h2 className="text-xl font-semibold">Set New MPIN</h2>
        <input
          type="password"
          maxLength={4}
          placeholder="Enter new 4 digit MPIN"
          className="border p-3 w-full"
          value={mpin}
          onChange={(e)=>setMpin(e.target.value)}
        />
        <button onClick={reset} className="bg-green-600 text-white p-3 w-full rounded">
          Reset MPIN
        </button>
      </div>
    </div>
  );
}