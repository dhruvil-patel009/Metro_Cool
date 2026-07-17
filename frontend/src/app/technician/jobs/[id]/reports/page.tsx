"use client"

import {
  ClipboardList,
  PenTool,
  StickyNote,
  Camera,
  Plus,
  X,
  LayoutDashboard,
  ChevronRight,
  Save,
  ShieldCheck,
  Check,
  AlertCircle,
  RotateCcw,
  Briefcase,
  User,
  IndianRupee,
  Smartphone,
  Loader2,
} from "lucide-react"
import { Button } from "@/app/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"

const API = process.env.NEXT_PUBLIC_API_BASE_URL!
const getToken = () => localStorage.getItem("accessToken") || localStorage.getItem("token") || ""

/* ─── OTP length is 4 digits — matches what payment controller generates ─── */
const OTP_LEN = 4

export default function ServiceCompletionReportPage() {
  const routeParams = useParams()
  const jobId = routeParams?.id as string

  /* ── Booking data (fetched for success screen) ── */
  const [booking, setBooking] = useState<any>(null)

  /* ── Report fields ── */
  const [issueDescription, setIssueDescription] = useState("")
  const [fixApplied, setFixApplied] = useState("")
  const [additionalNotes, setAdditionalNotes] = useState("")
  const [photoFiles, setPhotoFiles] = useState<File[]>([])
  const [photos, setPhotos] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  /* ── Validation errors ── */
  const [errors, setErrors] = useState<{ issue?: boolean; fix?: boolean; photos?: boolean }>({})

  /* ── OTP ── */
  const [currentStep, setCurrentStep] = useState<"report" | "otp" | "completed">("report")
  const [otpValues, setOtpValues] = useState<string[]>(Array(OTP_LEN).fill(""))
  const [isVerifying, setIsVerifying] = useState(false)
  const [otpError, setOtpError] = useState("")
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  /* ── Fetch booking for success screen ── */
  useEffect(() => {
    if (!jobId) return
    fetch(`${API}/bookings/techjobs/${jobId}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    })
      .then(r => r.json())
      .then(d => { if (d.success) setBooking(d.booking) })
      .catch(console.error)
  }, [jobId])

  /* ── Check if report already exists (resume OTP flow) ── */
  useEffect(() => {
    if (!jobId) return
    fetch(`${API}/service-report/job/${jobId}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    })
      .then(r => r.json())
      .then(d => {
        if (d.success && d.report) {
          // Report already submitted — go directly to OTP step
          setCurrentStep("otp")
          setTimeout(() => inputRefs.current[0]?.focus(), 400)
        }
      })
      .catch(() => { /* no report found, stay on report step */ })
  }, [jobId])

  /* ── OTP input handlers ── */
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value) || value.length > 1) return
    const next = [...otpValues]
    next[index] = value
    setOtpValues(next)
    setOtpError("")
    if (value && index < OTP_LEN - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleOtpKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LEN)
    if (!text) return
    const next = Array(OTP_LEN).fill("")
    text.split("").forEach((ch, i) => { next[i] = ch })
    setOtpValues(next)
    setOtpError("")
    // Focus last filled or next empty
    const lastIdx = Math.min(text.length, OTP_LEN - 1)
    inputRefs.current[lastIdx]?.focus()
  }

  const clearOtp = () => {
    setOtpValues(Array(OTP_LEN).fill(""))
    setOtpError("")
    inputRefs.current[0]?.focus()
  }

  /* ── Verify OTP ── */
  const handleVerifyOtp = async () => {
    const otp = otpValues.join("")
    if (otp.length !== OTP_LEN) return

    setIsVerifying(true)
    setOtpError("")

    try {
      const res = await fetch(`${API}/tech-jobs/${jobId}/verify-otp`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ otp }),
      })
      const data = await res.json()

      if (!res.ok || !data.success) {
        setOtpError(data.message || "Incorrect OTP. Please try again.")
        // Shake + clear
        clearOtp()
        return
      }

      setCurrentStep("completed")
    } catch {
      setOtpError("Network error. Please try again.")
    } finally {
      setIsVerifying(false)
    }
  }

  /* ── Submit service report ── */
  const submitServiceReport = async () => {
    const newErrors: { issue?: boolean; fix?: boolean; photos?: boolean } = {}
    if (!issueDescription.trim()) newErrors.issue = true
    if (!fixApplied.trim()) newErrors.fix = true
    if (photoFiles.length === 0) newErrors.photos = true

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    setErrors({})

    try {
      setIsSubmitting(true)

      const formData = new FormData()
      formData.append("job_id", jobId)
      formData.append("issue_description", issueDescription)
      formData.append("fix_applied", fixApplied)
      formData.append("additional_notes", additionalNotes)
      photoFiles.forEach(f => formData.append("photos", f))

      const res = await fetch(`${API}/service-report/create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
        body: formData,
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.message || "Report submission failed")

      // Update booking status to "report_submitted"
      await fetch(`${API}/tech-jobs/${jobId}/report`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${getToken()}` },
      })

      setCurrentStep("otp")
      // Auto-focus first OTP box
      setTimeout(() => inputRefs.current[0]?.focus(), 400)
    } catch (err: any) {
      alert(err.message || "Report submission failed. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const otpFilled = otpValues.join("").length === OTP_LEN

  /* ════════════════════════════════════════════════════════
     RENDER
  ════════════════════════════════════════════════════════ */
  return (
    <div className="bg-slate-50/50 min-h-screen">
      <main className="max-w-4xl mx-auto p-4 sm:p-8 space-y-8">
        <AnimatePresence mode="wait">

          {/* ─────────────── STEP 1 — REPORT ─────────────── */}
          {currentStep === "report" && (
            <motion.div
              key="report"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">
                <span>Dashboard</span>
                <ChevronRight className="w-3 h-3 opacity-30" />
                <span>Active Jobs</span>
                <ChevronRight className="w-3 h-3 opacity-30" />
                <span className="text-slate-900">Job #{jobId?.slice(0, 6)?.toUpperCase()} · Report</span>
              </div>

              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                    Service Completion Report
                  </h1>
                  <p className="text-slate-400 font-medium mt-1">
                    Fill in the details, then proceed to OTP verification.
                  </p>
                </div>
                <div className="bg-orange-50 text-orange-600 px-4 py-1.5 rounded-full border border-orange-100 flex items-center gap-2 self-start">
                  <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest">In Progress</span>
                </div>
              </div>

              <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                {/* Progress bar */}
                <div className="px-8 py-5 border-b border-slate-50 bg-slate-50/40">
                  <div className="flex items-center justify-between mb-2 text-[10px] font-black uppercase tracking-widest">
                    <span className="text-blue-500">Step 3 of 4: Report Details</span>
                    <span className="text-slate-400">Next: OTP Verification</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: "0%" }}
                      animate={{ width: "75%" }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full bg-blue-500 rounded-full"
                    />
                  </div>
                </div>

                <div className="p-6 sm:p-10 space-y-8">
                  {/* Issue */}
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 text-slate-900 font-bold">
                      <ClipboardList className="w-5 h-5 text-blue-500" />
                      Issue Description <span className="text-red-500 text-sm">*</span>
                    </label>
                    <textarea
                      value={issueDescription}
                      onChange={e => { setIssueDescription(e.target.value); setErrors(prev => ({ ...prev, issue: false })) }}
                      placeholder="Describe the diagnosed problem in detail..."
                      rows={4}
                      className={`w-full p-4 rounded-2xl bg-white border ${errors.issue ? 'border-red-400 ring-4 ring-red-50' : 'border-slate-200'} focus:border-blue-400 focus:ring-4 focus:ring-blue-50 outline-none text-slate-700 font-medium leading-relaxed resize-none transition-all`}
                    />
                    {errors.issue && <p className="text-red-500 text-sm font-medium">Issue description is required</p>}
                  </div>

                  {/* Fix */}
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 text-slate-900 font-bold">
                      <PenTool className="w-5 h-5 text-blue-500" />
                      Fix Applied <span className="text-red-500 text-sm">*</span>
                    </label>
                    <textarea
                      value={fixApplied}
                      onChange={e => { setFixApplied(e.target.value); setErrors(prev => ({ ...prev, fix: false })) }}
                      placeholder="List parts replaced and repairs performed..."
                      rows={4}
                      className={`w-full p-4 rounded-2xl bg-white border ${errors.fix ? 'border-red-400 ring-4 ring-red-50' : 'border-slate-200'} focus:border-blue-400 focus:ring-4 focus:ring-blue-50 outline-none text-slate-700 font-medium leading-relaxed resize-none transition-all`}
                    />
                    {errors.fix && <p className="text-red-500 text-sm font-medium">Fix applied is required</p>}
                  </div>

                  {/* Notes */}
                  <div className="space-y-3">
                    <label className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-slate-900 font-bold">
                        <StickyNote className="w-5 h-5 text-blue-500" />
                        Additional Notes
                      </span>
                      <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Optional</span>
                    </label>
                    <textarea
                      value={additionalNotes}
                      onChange={e => setAdditionalNotes(e.target.value)}
                      placeholder="Warnings, follow-up recommendations, or customer comments..."
                      rows={3}
                      className="w-full p-4 rounded-2xl bg-white border border-slate-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-50 outline-none text-slate-700 font-medium leading-relaxed resize-none transition-all"
                    />
                  </div>

                  {/* Photos */}
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 text-slate-900 font-bold">
                      <Camera className="w-5 h-5 text-blue-500" />
                      Proof of Work <span className="text-red-500 text-sm">*</span>
                    </label>
                    {errors.photos && <p className="text-red-500 text-sm font-medium">At least one proof of work photo is required</p>}
                    <div className={`grid grid-cols-2 sm:grid-cols-4 gap-4 ${errors.photos ? 'p-3 rounded-2xl border-2 border-dashed border-red-300 bg-red-50/30' : ''}`}>
                      <label className="aspect-[4/3] rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 text-slate-300 hover:border-blue-400 hover:text-blue-400 transition-all cursor-pointer group">
                        <Plus className="w-6 h-6 group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Add Photo</span>
                        <input
                          type="file" accept="image/*" multiple className="hidden"
                          onChange={e => {
                            const files = Array.from(e.target.files || [])
                            setPhotoFiles(p => [...p, ...files])
                            setPhotos(p => [...p, ...files.map(f => URL.createObjectURL(f))])
                            setErrors(prev => ({ ...prev, photos: false }))
                          }}
                        />
                      </label>
                      {photos.map((src, i) => (
                        <div key={i} className="aspect-[4/3] rounded-2xl overflow-hidden relative group border border-slate-100 shadow-sm">
                          <img src={src} alt="Proof" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                          <button
                            onClick={() => {
                              setPhotos(p => p.filter((_, j) => j !== i))
                              setPhotoFiles(p => p.filter((_, j) => j !== i))
                            }}
                            className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full shadow flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="px-6 sm:px-10 py-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between gap-4">
                  <Button variant="outline" className="px-6 h-12 rounded-xl border-slate-200 font-bold text-slate-600 bg-white gap-2">
                    <Save className="w-4 h-4" /> Save Draft
                  </Button>
                  <Button
                    onClick={submitServiceReport}
                    disabled={isSubmitting}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white h-12 rounded-xl font-bold text-base gap-2 shadow-lg transition-all active:scale-[0.98]"
                  >
                    {isSubmitting
                      ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting…</>
                      : <>Proceed to OTP Verification <ChevronRight className="w-4 h-4" /></>
                    }
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ─────────────── STEP 2 — OTP ─────────────── */}
          {currentStep === "otp" && (
            <motion.div
              key="otp"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="min-h-[80vh] flex items-center justify-center py-8"
            >
              <div className="w-full max-w-md">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden"
                >
                  {/* Header */}
                  <div className="pt-10 pb-8 px-8 bg-gradient-to-br from-blue-50 via-white to-blue-50/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100/30 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-100/20 rounded-full blur-2xl" />

                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                      className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200 relative"
                    >
                      <ShieldCheck className="w-8 h-8 text-white" />
                    </motion.div>

                    <h2 className="text-2xl font-black text-slate-900 text-center mb-2">
                      Enter Customer OTP
                    </h2>
                    <p className="text-slate-500 text-center text-sm leading-relaxed">
                      Ask the customer for the <span className="font-bold text-slate-700">4-digit code</span> shown
                      on their payment completion screen.
                    </p>
                  </div>

                  {/* How it works pill */}
                  <div className="mx-8 mt-6 flex items-center gap-3 bg-blue-50 border border-blue-100 rounded-2xl px-4 py-3">
                    <Smartphone className="w-5 h-5 text-blue-500 shrink-0" />
                    <p className="text-xs text-blue-700 font-medium">
                      The customer sees this code on their screen after payment — just ask them to read it out to you.
                    </p>
                  </div>

                  {/* OTP input */}
                  <div className="px-8 pt-6 pb-4">
                    <div className="flex justify-center gap-3 mb-2">
                      {otpValues.map((value, index) => (
                        <motion.input
                          key={index}
                          ref={el => { inputRefs.current[index] = el }}
                          initial={{ opacity: 0, y: 16 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.15 + index * 0.06 }}
                          id={`otp-${index}`}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={value}
                          onChange={e => handleOtpChange(index, e.target.value)}
                          onKeyDown={e => handleOtpKeyDown(e, index)}
                          onPaste={handleOtpPaste}
                          className={`w-16 h-16 text-center text-3xl font-black rounded-2xl border-2 outline-none transition-all
                            ${otpError
                              ? "border-red-400 bg-red-50 text-red-600 shake"
                              : value
                              ? "border-blue-500 bg-blue-50 text-blue-700 shadow-md shadow-blue-100"
                              : "border-slate-200 bg-white text-slate-900 hover:border-slate-300"
                            }
                            focus:border-blue-500 focus:ring-4 focus:ring-blue-50
                          `}
                        />
                      ))}
                    </div>

                    {/* Error message */}
                    <AnimatePresence>
                      {otpError && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="flex items-center gap-2 text-red-600 text-sm font-medium mt-3 bg-red-50 border border-red-100 rounded-xl px-4 py-3"
                        >
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          {otpError}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Verify button */}
                  <div className="px-8 pb-4">
                    <Button
                      onClick={handleVerifyOtp}
                      disabled={!otpFilled || isVerifying}
                      className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-base gap-2 shadow-lg shadow-blue-100 transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]"
                    >
                      {isVerifying
                        ? <><Loader2 className="w-5 h-5 animate-spin" /> Verifying…</>
                        : <><Check className="w-5 h-5" /> Verify & Close Job</>
                      }
                    </Button>
                  </div>

                  {/* Clear link */}
                  {otpValues.some(v => v !== "") && !isVerifying && (
                    <div className="pb-4 text-center">
                      <button
                        onClick={clearOtp}
                        className="text-slate-400 text-sm hover:text-slate-600 font-medium flex items-center gap-1.5 mx-auto transition-colors"
                      >
                        <RotateCcw className="w-3.5 h-3.5" /> Clear
                      </button>
                    </div>
                  )}

                  {/* Info note */}
                  <div className="px-8 pb-8">
                    <div className="bg-slate-50 rounded-2xl p-4 flex gap-3 border border-slate-100">
                      <AlertCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      <p className="text-xs text-slate-500 leading-relaxed">
                        By verifying this OTP, you confirm the job is done to the customer's satisfaction.
                        This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* ─────────────── STEP 3 — SUCCESS ─────────────── */}
          {currentStep === "completed" && (
            <motion.div
              key="completed"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="min-h-[80vh] flex items-center justify-center py-8 px-4"
            >
              <div className="w-full max-w-sm sm:max-w-md">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="bg-white rounded-3xl shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden"
                >
                  {/* Success header */}
                  <div className="pt-12 pb-8 px-6 sm:px-8 bg-gradient-to-b from-emerald-50 to-white relative overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-emerald-100/40 rounded-full blur-3xl -translate-y-1/2" />

                    <div className="flex justify-center mb-6 relative">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.1 }}
                        className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-xl shadow-emerald-200 relative"
                      >
                        {/* Ripple */}
                        {[1, 1.4, 1.8].map((scale, i) => (
                          <motion.div
                            key={i}
                            initial={{ scale: 1, opacity: 0.3 }}
                            animate={{ scale, opacity: 0 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeOut" as const, delay: i * 0.5 }}
                            className="absolute inset-0 rounded-full bg-emerald-400"
                          />
                        ))}
                        <motion.div
                          initial={{ scale: 0, rotate: -90 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.3 }}
                        >
                          <Check className="w-10 h-10 text-white stroke-[3]" />
                        </motion.div>
                      </motion.div>
                    </div>

                    <motion.h2
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="text-2xl sm:text-[26px] font-black text-slate-900 text-center mb-2"
                    >
                      Job Closed Successfully!
                    </motion.h2>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="text-slate-500 text-center text-sm"
                    >
                      Job <span className="font-bold text-slate-800">#{jobId?.slice(0, 8).toUpperCase()}</span> has been
                      verified and closed.
                    </motion.p>
                  </div>

                  {/* Job summary */}
                  <div className="px-6 sm:px-8 py-5 space-y-1">
                    {[
                      {
                        icon: Briefcase,
                        label: "Service",
                        value: (booking?.services as any)?.title || booking?.service?.title || "AC Service",
                        delay: 0.6,
                      },
                      {
                        icon: User,
                        label: "Customer",
                        value: booking?.user?.full_name || "—",
                        delay: 0.7,
                      },
                      {
                        icon: IndianRupee,
                        label: "Job Amount",
                        value: booking?.total_amount
                          ? `₹${Number(booking.total_amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`
                          : "—",
                        delay: 0.8,
                        highlight: true,
                      },
                    ].map(({ icon: Icon, label, value, delay, highlight }) => (
                      <motion.div
                        key={label}
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay }}
                        className="flex items-center justify-between py-3.5 border-b border-slate-100 last:border-b-0"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center">
                            <Icon className="w-4 h-4 text-slate-500" />
                          </div>
                          <span className="text-slate-500 font-medium text-sm">{label}</span>
                        </div>
                        <span className={`font-bold ${highlight ? "text-emerald-600 text-lg" : "text-slate-900 text-sm"}`}>
                          {value}
                        </span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Actions */}
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    className="px-6 sm:px-8 pb-8 pt-3 space-y-3"
                  >
                    <Link href="/technician/jobs">
                      <Button className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold gap-2 transition-all shadow-md shadow-blue-200/50">
                        <LayoutDashboard className="w-4 h-4" /> Back to Jobs
                      </Button>
                    </Link>
                    <Link href="/technician/jobs?tab=completed">
                      <Button variant="outline" className="w-full h-12 rounded-xl font-bold text-slate-600 border-slate-200 gap-2 hover:bg-slate-50 transition-all">
                        <RotateCcw className="w-4 h-4" /> View Completed Jobs
                      </Button>
                    </Link>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  )
}
