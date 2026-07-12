"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import {
  Copy,
  Gift,
  Users,
  Percent,
  CheckCircle2,
  Clock,
  Share2,
  Sparkles,
  Loader2,
} from "lucide-react";
import { toast } from "react-toastify";

const API = process.env.NEXT_PUBLIC_API_BASE_URL!;
const getToken = () =>
  typeof window === "undefined"
    ? ""
    : localStorage.getItem("accessToken") || localStorage.getItem("token") || "";

/* ── Fetch referral code ── */
const fetchMyCode = async () => {
  const res = await fetch(`${API}/referral/my-code`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) throw new Error("Failed to fetch referral code");
  return res.json();
};

/* ── Fetch referral list ── */
const fetchMyReferrals = async () => {
  const res = await fetch(`${API}/referral/my-referrals`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) throw new Error("Failed to fetch referrals");
  return res.json();
};

/* ── Generate referral code ── */
const generateReferralCode = async () => {
  const res = await fetch(`${API}/referral/generate`, {
    method: "POST",
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) throw new Error("Failed to generate code");
  return res.json();
};

export default function ReferralsPage() {
  const [copied, setCopied] = useState(false);
  const queryClient = useQueryClient();

  const { data: codeData, isLoading: codeLoading } = useQuery({
    queryKey: ["my-referral-code"],
    queryFn: fetchMyCode,
  });

  const { data: referralsData, isLoading: referralsLoading } = useQuery({
    queryKey: ["my-referrals"],
    queryFn: fetchMyReferrals,
  });

  const generateMutation = useMutation({
    mutationFn: generateReferralCode,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-referral-code"] });
      toast.success("Referral code generated!");
    },
    onError: () => {
      toast.error("Failed to generate code. Try again.");
    },
  });

  const referralCode = codeData?.referralCode;
  const totalReferrals = referralsData?.totalReferrals || 0;
  const activeRewards = referralsData?.activeRewards || 0;
  const referrals = referralsData?.referrals || [];

  const handleCopy = () => {
    if (!referralCode) return;
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    toast.success("Code copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    if (!referralCode) return;
    const text = `Join Metro Cool as a technician! Use my referral code: ${referralCode} during registration and we both benefit. Register here: ${window.location.origin}/auth/technician-registration`;

    if (navigator.share) {
      navigator.share({ title: "Metro Cool Referral", text });
    } else {
      navigator.clipboard.writeText(text);
      toast.success("Share text copied to clipboard!");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Referral Program</h1>
        <p className="text-gray-600 mt-1">
          Invite other technicians and earn commission discounts on your jobs.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-900">{totalReferrals}</p>
              <p className="text-xs text-blue-600">Total Referrals</p>
            </div>
          </div>
        </Card>

        <Card className="p-5 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center">
              <Percent className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-900">{activeRewards}</p>
              <p className="text-xs text-green-600">Active Rewards</p>
            </div>
          </div>
        </Card>

        <Card className="p-5 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500 flex items-center justify-center">
              <Gift className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-900">5%</p>
              <p className="text-xs text-purple-600">Discount Per Referral</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Referral Code Section */}
      <Card className="p-6 shadow-lg">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-orange-500" />
          <h2 className="text-lg font-semibold text-gray-900">Your Referral Code</h2>
        </div>

        {codeLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
          </div>
        ) : referralCode ? (
          <div className="space-y-4">
            {/* Code Display */}
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
              <code className="text-2xl font-bold text-gray-900 tracking-widest flex-1">
                {referralCode}
              </code>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="gap-2"
              >
                {copied ? (
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
                {copied ? "Copied" : "Copy"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="gap-2"
              >
                <Share2 className="w-4 h-4" />
                Share
              </Button>
            </div>

            {/* How it works */}
            <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
              <h3 className="text-sm font-semibold text-orange-800 mb-2">How it works</h3>
              <ol className="text-sm text-orange-700 space-y-1 list-decimal list-inside">
                <li>Share your code with other AC technicians</li>
                <li>They enter your code during registration</li>
                <li>You get 5% commission discount on your next 3 jobs per referral</li>
              </ol>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <Gift className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 mb-4">
              Generate your unique referral code to start earning rewards.
            </p>
            <Button
              onClick={() => generateMutation.mutate()}
              disabled={generateMutation.isPending}
              className="bg-orange-600 hover:bg-orange-700 text-white gap-2"
            >
              {generateMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              Generate My Code
            </Button>
          </div>
        )}
      </Card>

      {/* Referral History */}
      <Card className="p-6 shadow-lg">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Referral History</h2>

        {referralsLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
          </div>
        ) : referrals.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No referrals yet. Share your code to get started!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {referrals.map((r: any) => (
              <div
                key={r.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center ${
                      r.rewardStatus === "active"
                        ? "bg-green-100 text-green-600"
                        : r.rewardStatus === "used"
                        ? "bg-gray-100 text-gray-500"
                        : "bg-red-100 text-red-500"
                    }`}
                  >
                    {r.rewardStatus === "active" ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <Clock className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{r.referredName}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(r.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${
                      r.rewardStatus === "active"
                        ? "bg-green-100 text-green-700"
                        : r.rewardStatus === "used"
                        ? "bg-gray-100 text-gray-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {r.rewardStatus === "active"
                      ? `${r.jobsRemaining} jobs left`
                      : r.rewardStatus === "used"
                      ? "Completed"
                      : "Expired"}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">{r.rewardValue}% discount</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
