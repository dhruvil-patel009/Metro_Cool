"use client";

import {
  Bell,
  Hammer,
  ClipboardList,
  PenTool,
  StickyNote,
  Camera,
  Plus,
  X,
  LayoutDashboard,
  ChevronRight,
  Save,
  Lock,
  Check,
  AlertCircle,
  LayoutGrid,
  RotateCcw,
  Briefcase,
  User,
  DollarSign,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";



export default function ServiceCompletionReportPage({
  params,
}: {
  params: { id: string };
}) {
  const routeParams = useParams();
  const jobId = routeParams?.id as string;
  // -------- FORM DATA ----------
  const [issueDescription, setIssueDescription] = useState("");
  const [fixApplied, setFixApplied] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");

  // -------- PHOTO DATA ----------
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [photos, setPhotos] = useState<string[]>([]);

  // -------- LOADING ----------
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [currentStep, setCurrentStep] = useState<
    "report" | "otp" | "completed"
  >("report");
  const [otpValues, setOtpValues] = useState<string[]>([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    if (!/^\d*$/.test(value)) return;

    const newOtpValues = [...otpValues];
    newOtpValues[index] = value;
    setOtpValues(newOtpValues);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const otpCode = otpValues.join("");
    if (otpCode.length !== 6) return;

    try {
      setIsVerifying(true);

      const token = localStorage.getItem("token");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/tech-jobs/${jobId}/verify-otp`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            otp: otpCode, // later real SMS validation
          }),
        }
      );

      const data = await res.json();

      if (!data.success) {
        alert("OTP verification failed");
        setIsVerifying(false);
        return;
      }

      // SUCCESS → close job
      setCurrentStep("completed");

    } catch (err) {
      console.error(err);
      alert("Server error");
    } finally {
      setIsVerifying(false);
    }
  };


  const handleResendCode = async () => {
    setIsResending(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsResending(false);
    setOtpValues(["", "", "", "", "", ""]);
    const firstInput = document.getElementById("otp-0");
    firstInput?.focus();
  };

  const submitServiceReport = async () => {
    if (!issueDescription || !fixApplied) {
      alert("Please fill Issue & Fix fields");
      return;
    }

    try {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append("job_id", jobId);
      formData.append("issue_description", issueDescription);
      formData.append("fix_applied", fixApplied);
      formData.append("additional_notes", additionalNotes);

      photoFiles.forEach((file) => formData.append("photos", file));

      const res = await fetch(
        "http://localhost:5000/api/service-report/create",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (!data.success) throw new Error();

      // ONLY NOW OPEN OTP SCREEN
      setCurrentStep("otp");
    } catch (err) {
      alert("Report submission failed");
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className=" bg-slate-50/50 ">
      <main className="max-w-4xl mx-auto p-8 space-y-8">
        <AnimatePresence mode="wait">
          {currentStep === "report" && (
            <motion.div
              key="report"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <span>Dashboard</span>
                  <ChevronRight className="w-3 h-3 opacity-30" />
                  <span>Active Jobs</span>
                  <ChevronRight className="w-3 h-3 opacity-30" />
                  <span className="text-slate-900">Job #{params.id}-AC</span>
                </div>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <div className="space-y-2">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                      Service Completion Report
                    </h1>
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-cyan-50 rounded flex items-center justify-center">
                        <div className="w-2.5 h-2.5 rounded-full border-2 border-[#0891b2]" />
                      </div>
                      <span className="text-sm font-bold text-slate-500 tracking-wide">
                        Job #{params.id}-AC - AC Repair
                      </span>
                    </div>
                  </div>
                  <div className="bg-orange-50 text-orange-600 px-4 py-1.5 rounded-full border border-orange-100 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      In Progress
                    </span>
                  </div>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden mt-8"
              >
                <div className="px-10 py-6 border-b border-slate-50 bg-slate-50/30">
                  <div className="flex items-center justify-between mb-3 text-[10px] font-black uppercase tracking-widest">
                    <span className="text-blue-500">
                      Step 3 of 4: Report Details
                    </span>
                    <span className="text-slate-400">Next: Verification</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: "0%" }}
                      animate={{ width: "75%" }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full bg-cyan-400 rounded-full"
                    />
                  </div>
                </div>

                <div className="p-10 space-y-10">
                  <div className="space-y-4">
                    <label className="flex items-center gap-3 text-slate-900 font-bold tracking-tight">
                      <ClipboardList className="w-5 h-5 text-blue-500" />
                      Issue Description
                    </label>
                    <textarea
                      value={issueDescription}
                      onChange={(e) => setIssueDescription(e.target.value)}
                      placeholder="Describe the diagnosed problem in detail..."
                      className="w-full h-32 p-6 rounded-2xl bg-white border border-slate-200 focus:border-[#0891b2] focus:ring-4 focus:ring-cyan-50 transition-all outline-none text-slate-600 font-medium leading-relaxed resize-none"
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="flex items-center gap-3 text-slate-900 font-bold tracking-tight">
                      <PenTool className="w-5 h-5 text-blue-500" />
                      Fix Applied
                    </label>
                    <textarea
                      value={fixApplied}
                      onChange={(e) => setFixApplied(e.target.value)}
                      placeholder="List parts replaced and repairs performed..."
                      className="w-full h-32 p-6 rounded-2xl bg-white border border-slate-200 focus:border-[#0891b2] focus:ring-4 focus:ring-cyan-50 transition-all outline-none text-slate-600 font-medium leading-relaxed resize-none"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-3 text-slate-900 font-bold tracking-tight">
                        <StickyNote className="w-5 h-5 text-blue-500" />
                        Additional Notes
                      </label>
                      <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                        (Optional)
                      </span>
                    </div>
                    <textarea
                      value={additionalNotes}
                      onChange={(e) => setAdditionalNotes(e.target.value)}
                      placeholder="Any warnings, follow-up recommendations, or customer comments..."
                      className="w-full h-24 p-6 rounded-2xl bg-white border border-slate-200 focus:border-[#0891b2] focus:ring-4 focus:ring-cyan-50 transition-all outline-none text-slate-600 font-medium leading-relaxed resize-none"
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="flex items-center gap-3 text-slate-900 font-bold tracking-tight">
                      <Camera className="w-5 h-5 text-blue-500" />
                      Proof of Work
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <label className="aspect-[4/3] rounded-2xl border-2 border-dashed border-slate-100 flex flex-col items-center justify-center gap-2 text-slate-300 hover:border-[#0891b2] hover:text-blue-500 transition-all bg-slate-50/50 group cursor-pointer">
                        <Plus className="w-6 h-6 transition-transform group-hover:scale-110" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">
                          Add Photo
                        </span>

                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={(e) => {
                            const files = e.target.files;
                            if (!files) return;

                            const arr = Array.from(files);
                            setPhotoFiles((prev) => [...prev, ...arr]);

                            const previews = arr.map((file) => URL.createObjectURL(file));
                            setPhotos((prev) => [...prev, ...previews]);
                          }}
                        />
                      </label>

                      {photos.map((src, i) => (
                        <div
                          key={i}
                          className="aspect-[4/3] rounded-2xl overflow-hidden relative group border border-slate-100 shadow-sm"
                        >
                          <img
                            src={src || "/placeholder.svg"}
                            alt="Proof"
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          />
                          <button
                            onClick={() => {
                              setPhotos((prev) => prev.filter((_, index) => index !== i));
                              setPhotoFiles((prev) => prev.filter((_, index) => index !== i));
                            }}
                            className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full shadow-lg flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="px-10 py-8 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between gap-4">
                  <Button
                    variant="outline"
                    className="px-8 h-14 rounded-xl border-slate-200 font-bold text-slate-600 bg-white gap-2 hover:bg-slate-50 transition-all"
                  >
                    <Save className="w-5 h-5" />
                    Save Draft
                  </Button>
                  <Button
                    // onClick={() => setCurrentStep("otp")}
                    onClick={submitServiceReport}
                    disabled={isSubmitting}
                    className="flex-1 bg-cyan-400 hover:bg-cyan-500 text-white h-14 rounded-xl font-black text-lg gap-2 shadow-lg shadow-cyan-100 transition-all active:scale-[0.98] hover:shadow-xl hover:shadow-cyan-200"
                  >
                    {isSubmitting ? "Submitting..." : "Proceed to OTP Verification"}
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </div>
              </motion.div>

              <footer className="text-center py-4 mt-8">
                <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">
                  © 2026 Metro Cool Services. Job ID: {params.id}-AC
                </p>
              </footer>
            </motion.div>
          )}

          {currentStep === "otp" && (
            <motion.div
              key="otp"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="min-h-[80vh] flex items-center justify-center p-4"
            >
              <div className="w-full max-w-lg">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden"
                >
                  {/* Header section with gradient background */}
                  <div className="pt-12 pb-8 px-8 bg-gradient-to-br from-cyan-50 via-white to-cyan-50/30 relative overflow-hidden">
                    {/* Decorative circles */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-100/30 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-cyan-100/20 rounded-full blur-2xl" />

                    <div className="flex justify-center mb-6 relative">
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{
                          delay: 0.2,
                          type: "spring",
                          stiffness: 200,
                          damping: 15,
                        }}
                        className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-100 to-cyan-50 flex items-center justify-center shadow-lg shadow-cyan-100/50"
                      >
                        <Lock className="w-9 h-9 text-cyan-500" />
                      </motion.div>
                    </div>

                    <motion.h2
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-3xl font-black text-slate-900 text-center mb-3 text-balance"
                    >
                      Verify Customer OTP
                    </motion.h2>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="text-slate-500 text-center leading-relaxed px-4 text-balance"
                    >
                      Ask the customer for the 6-digit verification code sent to
                      their mobile ending in{" "}
                      <span className="font-bold text-slate-900">**89</span>.
                    </motion.p>
                  </div>

                  {/* OTP Input Section */}
                  <div className="px-8 py-10">
                    <div className="flex justify-center gap-3 mb-8">
                      {otpValues.map((value, index) => (
                        <motion.input
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 + index * 0.05 }}
                          id={`otp-${index}`}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={value}
                          onChange={(e) =>
                            handleOtpChange(index, e.target.value)
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Backspace" && !value && index > 0) {
                              const prevInput = document.getElementById(
                                `otp-${index - 1}`,
                              );
                              prevInput?.focus();
                            }
                          }}
                          className="w-12 h-14 text-center text-2xl font-bold text-slate-900 border-2 border-slate-200 rounded-xl focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50 outline-none transition-all hover:border-cyan-300 bg-white shadow-sm"
                        />
                      ))}
                    </div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                    >
                      <Button
                        onClick={handleVerifyOtp}
                        disabled={
                          otpValues.join("").length !== 6 || isVerifying
                        }
                        className="w-full h-14 bg-cyan-400 hover:bg-cyan-500 text-white rounded-xl font-black text-base gap-2 shadow-lg shadow-cyan-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl hover:shadow-cyan-200 active:scale-[0.98]"
                      >
                        {isVerifying ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{
                                duration: 1,
                                repeat: Number.POSITIVE_INFINITY,
                                ease: "linear",
                              }}
                            >
                              <RotateCcw className="w-5 h-5" />
                            </motion.div>
                            Verifying...
                          </>
                        ) : (
                          <>
                            <Check className="w-5 h-5" />
                            Verify & Close Job
                          </>
                        )}
                      </Button>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.9 }}
                      className="flex items-center justify-center gap-2 mt-6 text-sm"
                    >
                      <span className="text-slate-500">
                        Didn't receive code?
                      </span>
                      <button
                        onClick={handleResendCode}
                        disabled={isResending}
                        className="text-cyan-500 font-bold hover:text-cyan-600 transition-colors flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed hover:underline"
                      >
                        {isResending ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{
                                duration: 1,
                                repeat: Number.POSITIVE_INFINITY,
                                ease: "linear",
                              }}
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                            </motion.div>
                            Sending...
                          </>
                        ) : (
                          <>
                            Resend Code
                            <RotateCcw className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    </motion.div>
                  </div>

                  {/* Info section */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                    className="px-8 pb-8"
                  >
                    <div className="bg-slate-50 rounded-2xl p-4 flex gap-3 border border-slate-100">
                      <AlertCircle className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-slate-500 leading-relaxed text-balance">
                        By verifying this OTP, you confirm that the job has been
                        completed to the customer's satisfaction and all safety
                        protocols were followed. This action cannot be undone.
                      </p>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {currentStep === "completed" && (
            <motion.div
              key="completed"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="min-h-[80vh] flex items-center justify-center p-4"
            >
              <div className="w-full max-w-lg">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden"
                >
                  {/* Success header */}
                  <div className="pt-12 pb-8 px-8 bg-gradient-to-br from-cyan-50 via-white to-cyan-50/30 relative overflow-hidden">
                    {/* Decorative circles */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-100/30 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-cyan-100/20 rounded-full blur-2xl" />

                    <div className="flex justify-center mb-6 relative">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          delay: 0.2,
                          type: "spring",
                          stiffness: 200,
                          damping: 12,
                        }}
                        className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-100 to-cyan-50 flex items-center justify-center shadow-lg shadow-cyan-100/50 relative"
                      >
                        {/* Success ripple effect */}
                        <motion.div
                          initial={{ scale: 1, opacity: 0.5 }}
                          animate={{ scale: 1.5, opacity: 0 }}
                          transition={{
                            duration: 1.5,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "easeOut",
                          }}
                          className="absolute inset-0 rounded-full bg-cyan-400"
                        />
                        <motion.div
                          initial={{ scale: 0, rotate: -90 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{
                            delay: 0.4,
                            type: "spring",
                            stiffness: 300,
                            damping: 15,
                          }}
                        >
                          <Check className="w-10 h-10 text-cyan-500 stroke-[3]" />
                        </motion.div>
                      </motion.div>
                    </div>

                    <motion.h2
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="text-3xl font-black text-slate-900 text-center mb-3 text-balance"
                    >
                      Job Completed Successfully
                    </motion.h2>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      className="text-slate-500 text-center text-balance"
                    >
                      Job ID{" "}
                      <span className="font-bold text-slate-900">
                        #{params.id}829
                      </span>{" "}
                      has been closed and synced.
                    </motion.p>
                  </div>

                  {/* Job details */}
                  <div className="px-8 py-8 space-y-0">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 }}
                      className="flex items-center justify-between py-5 border-b border-slate-100 hover:bg-slate-50/50 transition-colors rounded-lg px-3 -mx-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center">
                          <Briefcase className="w-5 h-5 text-slate-400" />
                        </div>
                        <span className="text-slate-600 font-medium">
                          Service Type
                        </span>
                      </div>
                      <span className="font-bold text-slate-900">
                        Emergency Plumbing
                      </span>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 }}
                      className="flex items-center justify-between py-5 border-b border-slate-100 hover:bg-slate-50/50 transition-colors rounded-lg px-3 -mx-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center">
                          <User className="w-5 h-5 text-slate-400" />
                        </div>
                        <span className="text-slate-600 font-medium">
                          Customer
                        </span>
                      </div>
                      <span className="font-bold text-slate-900">
                        Westside Apartments
                      </span>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.9 }}
                      className="flex items-center justify-between py-5 hover:bg-slate-50/50 transition-colors rounded-lg px-3 -mx-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center">
                          <DollarSign className="w-5 h-5 text-slate-400" />
                        </div>
                        <span className="text-slate-600 font-medium">
                          Total Earnings
                        </span>
                      </div>
                      <span className="font-bold text-cyan-500 text-xl">
                        $245.00
                      </span>
                    </motion.div>
                  </div>

                  {/* Action buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                    className="px-8 pb-8 space-y-3"
                  >
                    <Link href="/technician/jobs">
                      <Button
                        variant="outline"
                        className="w-full h-14 cursor-pointer border-slate-200 rounded-xl font-bold text-slate-600 bg-white gap-2 hover:bg-slate-50 transition-all"
                      >
                        <LayoutDashboard className="w-5 h-5" />
                        Go to Dashboard
                      </Button>
                    </Link>
                    <Link href="/technician/jobs?tab=completed">
                      <Button
                        variant="outline"
                        className="w-full h-14 cursor-pointer border-slate-200 rounded-xl font-bold text-slate-600 bg-white gap-2 hover:bg-slate-50 transition-all"
                      >
                        <RotateCcw className="w-5 h-5" />
                        View Completed Jobs
                      </Button>
                    </Link>
                  </motion.div>

                  {/* Report issue link */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.1 }}
                    className="pb-8 text-center"
                  >
                    <button className="text-slate-400 text-sm hover:text-slate-600 transition-colors flex items-center gap-2 mx-auto group">
                      <AlertCircle className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                      Report an issue with this job
                    </button>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
