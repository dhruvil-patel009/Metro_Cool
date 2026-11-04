"use client";

import type React from "react"

import { useState, useRef, useCallback, useEffect } from "react"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Card } from "@/app/components/ui/card"
import { Wallet, BadgeCheck, BarChart3, User, CreditCard, Phone, Mail, Tag, Lock, CheckCircle2, XCircle, Loader2, AlertCircle } from "lucide-react"
import { toast } from "react-toastify"
import { useRouter } from "next/navigation"
import SuccessModal from "./successModel";
import Link from "next/link";

export default function TechnicianRegistration() {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();


  const [form, setForm] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    phone: '',
    email: '',
    mpin: '',
    confirmMpin: '',
    experienceYears: '',
    promoCode: '',
      services: [] as string[],

  });

  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [aadhaarPan, setAadhaarPan] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [aadhaarPreview, setAadhaarPreview] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [aadhaarError, setAadhaarError] = useState<string | null>(null);

  // Maximum allowed file size limits
  const MAX_PROFILE_PHOTO_SIZE = 2 * 1024 * 1024; // 2 MB
  const MAX_AADHAAR_PAN_SIZE = 5 * 1024 * 1024;   // 5 MB

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  // Promo code validation state
  const [promoValidating, setPromoValidating] = useState(false);
  const [promoValid, setPromoValid] = useState<boolean | null>(null);
  const [promoMessage, setPromoMessage] = useState<string>("");
  const promoDebounceRef = useRef<NodeJS.Timeout | null>(null);

  const handleReturnToHome = () => {
    router.push('/');
  };

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const profileInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (
    type: "profile" | "document",
    file: File | null
  ) => {
    if (!file) return;

    if (type === "profile") {
      const allowedImageTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
      if (!allowedImageTypes.includes(file.type)) {
        const errorMsg = "Invalid file type. Please upload a JPG or PNG image.";
        setProfileError(errorMsg);
        toast.error(errorMsg);
        setProfilePhoto(null);
        setProfilePreview(null);
        if (profileInputRef.current) profileInputRef.current.value = "";
        return;
      }

      if (file.size > MAX_PROFILE_PHOTO_SIZE) {
        const currentSize = formatFileSize(file.size);
        const errorMsg = `File size is ${currentSize}. Maximum allowed size is 2 MB. Please choose a smaller image.`;
        setProfileError(errorMsg);
        toast.error(`Profile photo is too large (${currentSize}). Please upload an image under 2 MB.`);
        setProfilePhoto(null);
        setProfilePreview(null);
        if (profileInputRef.current) profileInputRef.current.value = "";
        return;
      }

      setProfileError(null);
      setProfilePhoto(file);
      setProfilePreview(URL.createObjectURL(file));
      toast.success(`Profile photo selected (${formatFileSize(file.size)})`);
    }

    if (type === "document") {
      const allowedDocTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg", "application/pdf"];
      if (!allowedDocTypes.includes(file.type)) {
        const errorMsg = "Invalid file type. Please upload a PDF, JPG, or PNG document.";
        setAadhaarError(errorMsg);
        toast.error(errorMsg);
        setAadhaarPan(null);
        setAadhaarPreview(null);
        if (documentInputRef.current) documentInputRef.current.value = "";
        return;
      }

      if (file.size > MAX_AADHAAR_PAN_SIZE) {
        const currentSize = formatFileSize(file.size);
        const errorMsg = `File size is ${currentSize}. Maximum allowed size is 5 MB. Please choose a smaller file.`;
        setAadhaarError(errorMsg);
        toast.error(`Document is too large (${currentSize}). Please upload a file under 5 MB.`);
        setAadhaarPan(null);
        setAadhaarPreview(null);
        if (documentInputRef.current) documentInputRef.current.value = "";
        return;
      }

      setAadhaarError(null);
      setAadhaarPan(file);
      setAadhaarPreview(file.type === "application/pdf" ? null : URL.createObjectURL(file));
      toast.success(`Document selected (${formatFileSize(file.size)})`);
    }
  };

  const handleRemoveFile = (type: "profile" | "document") => {
    if (type === "profile") {
      setProfilePhoto(null);
      setProfilePreview(null);
      setProfileError(null);
      if (profileInputRef.current) profileInputRef.current.value = "";
    } else {
      setAadhaarPan(null);
      setAadhaarPreview(null);
      setAadhaarError(null);
      if (documentInputRef.current) documentInputRef.current.value = "";
    }
  };

  // Validate promo code with debounce
  const validatePromoCode = useCallback((code: string) => {
    if (promoDebounceRef.current) {
      clearTimeout(promoDebounceRef.current);
    }

    if (!code.trim()) {
      setPromoValid(null);
      setPromoMessage("");
      setPromoValidating(false);
      return;
    }

    setPromoValidating(true);
    promoDebounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/referral/validate/${code.trim()}`
        );
        const data = await res.json();

        if (data.valid) {
          setPromoValid(true);
          setPromoMessage(data.message || `Referred by ${data.referrerName}`);
        } else {
          setPromoValid(false);
          setPromoMessage(data.message || "Invalid referral code");
        }
      } catch {
        setPromoValid(false);
        setPromoMessage("Could not validate code");
      } finally {
        setPromoValidating(false);
      }
    }, 600);
  }, []);

  const handlePromoCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    setForm({ ...form, promoCode: value });
    validatePromoCode(value);
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault(); // 🔥 VERY IMPORTANT

  if (!form.firstName || !form.lastName || !form.phone || !form.email) {
    toast.warning('Please fill all required fields');
    return;
  }

  if (!profilePhoto || !aadhaarPan) {
    toast.warning('Please upload profile photo and Aadhaar/PAN');
    return;
  }

  if (profilePhoto.size > MAX_PROFILE_PHOTO_SIZE) {
    toast.error(`Profile photo exceeds 2 MB limit (${formatFileSize(profilePhoto.size)}). Please choose a smaller image.`);
    return;
  }

  if (aadhaarPan.size > MAX_AADHAAR_PAN_SIZE) {
    toast.error(`Aadhaar/PAN document exceeds 5 MB limit (${formatFileSize(aadhaarPan.size)}). Please choose a smaller file.`);
    return;
  }

  if (form.mpin !== form.confirmMpin) {
    toast.error("MPIN mismatch");
    return;
  }

  if (!/^\d{4}$/.test(form.mpin)) {
    toast.error("MPIN must be 4 digits");
    return;
  }

  try {
    setLoading(true);

    const formData = new FormData();
    formData.append('role', 'technician');
    formData.append('firstName', form.firstName);
    formData.append('middleName', form.middleName);
    formData.append('lastName', form.lastName);
    formData.append('phone', form.phone);
    formData.append('email', form.email);
    formData.append("mpin", form.mpin);
    formData.append('experienceYears', form.experienceYears);
    formData.append('promoCode', form.promoCode);
    formData.append('services', JSON.stringify(form.services));
    formData.append('profile_photo', profilePhoto);
    formData.append('aadhaar_pan', aadhaarPan);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/register`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.error || 'Registration failed');
      return;
    }

    toast.success('🎉 Registration successful! Waiting for admin approval');
    setShowModal(true);
  } catch (err) {
    toast.error('Server error. Please try again later');
  } finally {
    setLoading(false);
  }
};


  const handleModalConfirm = () => {
    setShowModal(false);
    router.push('/auth/login'); // 👈 login page
  };

  const SERVICE_OPTIONS = [
  'AC Repair',
  'AC Installation',
  'AC Maintenance',
  'Gas Refilling',
  'AC Uninstallation',
];

const handleServiceAdd = (service: string) => {
  if (form.services.includes(service)) return;

  setForm({
    ...form,
    services: [...form.services, service],
  });
};

const handleServiceRemove = (service: string) => {
  setForm({
    ...form,
    services: form.services.filter((s) => s !== service),
  });
};

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Left Side - Hero & Benefits */}
          <div className="lg:sticky lg:top-8 space-y-6 w-full lg:w-[420px] flex-shrink-0">
            {/* Hero Card */}
            <Card className="overflow-hidden shadow-xl">
              <div className="relative h-64">
                <img
                  src="/assets/hero-technician.jpg"
                  alt="Technician at work"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 to-transparent" />
                <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
                  <h2 className="text-3xl font-bold mb-3 text-balance">Join Our Network</h2>
                  <p className="text-blue-100 text-pretty leading-relaxed">
                    Connect with thousands of customers looking for AC experts like you. Grow your business today.
                  </p>
                </div>
              </div>
            </Card>

            {/* Benefits Cards */}
            <div className="space-y-4">
              <BenefitCard
                icon={<Wallet className="w-6 h-6" />}
                title="Automated Settlements"
                description="Get paid instantly upon job completion with our automated financial system."
                color="bg-orange-100 text-orange-600"
              />
              <BenefitCard
                icon={<BadgeCheck className="w-6 h-6" />}
                title="Verified Technician Badge"
                description="Build trust with clients by displaying your verified status on profile."
                color="bg-cyan-100 text-cyan-600"
              />
              <BenefitCard
                icon={<BarChart3 className="w-6 h-6" />}
                title="Tiered Benefits"
                description="Unlock lower commission rates as you complete more jobs successfully."
                color="bg-blue-100 text-blue-600"
              />
            </div>
          </div>

          {/* Right Side - Registration Form */}
          <div className="flex-1 w-full">
            <Card className="p-8 shadow-xl bg-white">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-500 mb-2">Technician Registration</h1>
                <p className="text-gray-600">Fill in your details to start receiving service requests.</p>
              </div>

<form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Details */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                      Personal Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="firstName" className="text-sm font-medium text-gray-900">
                          First Name
                        </label>
                        <Input
                          id="firstName"
                          name="firstName"
                          placeholder="John"
                          onChange={handleChange}
                          className="bg-white text-gray-900 border-gray-300 placeholder:text-gray-400"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="middleName" className="text-sm font-medium text-gray-900">
                          Middle Name
                        </label>
                        <Input
                          id="middleName"
                          name="middleName"
                          onChange={handleChange}
                          className="bg-white text-gray-900 border-gray-300 placeholder:text-gray-400"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="lastName" className="text-sm font-medium text-gray-900">
                          Last Name
                        </label>
                        <Input
                          id="lastName"
                          name="lastName"
                          placeholder="Doe"
                          onChange={handleChange}
                          className="bg-white text-gray-900 border-gray-300 placeholder:text-gray-400"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="phone" className="text-sm font-medium text-gray-900">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          placeholder="(555) 000-0000"
                          onChange={handleChange}
                          className="pl-10 bg-white text-gray-900 border-gray-300 placeholder:text-gray-400"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium text-gray-900">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="john@example.com"
                          onChange={handleChange}
                          className="pl-10 bg-white text-gray-900 border-gray-300 placeholder:text-gray-400"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Account Security (MPIN) */}
<div className="space-y-6">
  <div>
    <h3 className="text-xxl font-semibold text-black uppercase tracking-wider mb-4 bolder">
      Account Security
    </h3>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

      {/* MPIN */}
      <div className="space-y-2">
        <label htmlFor="mpin" className="text-sm font-medium text-gray-900">
          Create 4-Digit MPIN
        </label>

        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />

          <Input
            id="mpin"
            name="mpin"
            type="password"
            inputMode="numeric"
            maxLength={4}
            placeholder="Enter 4 digit MPIN"
            value={form.mpin}
            onChange={(e) =>
              setForm({
                ...form,
                mpin: e.target.value.replace(/\D/g, "")
              })
            }
            className="pl-10 bg-white text-gray-900 border-gray-300 placeholder:text-gray-400"
            required
          />
        </div>
      </div>

      {/* Confirm MPIN */}
      <div className="space-y-2">
        <label htmlFor="confirmMpin" className="text-sm font-medium text-gray-900">
          Confirm MPIN
        </label>

        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />

          <Input
            id="confirmMpin"
            name="confirmMpin"
            type="password"
            inputMode="numeric"
            maxLength={4}
            placeholder="Re-enter MPIN"
            value={form.confirmMpin}
            onChange={(e) =>
              setForm({
                ...form,
                confirmMpin: e.target.value.replace(/\D/g, "")
              })
            }
            className="pl-10 bg-white text-gray-900 border-gray-300 placeholder:text-gray-400"
            required
          />
        </div>
      </div>

    </div>

    {/* Helper text */}
    <p className="text-xs text-gray-500 mt-2">
      This MPIN will be used to login into the app. Keep it secure 🔐
    </p>
  </div>
</div>
                </div>

                {/* Professional Info */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                      Professional Info
                    </h3>
                    <div className="space-y-2">
                      <label htmlFor="yearsOfExperience" className="text-sm font-medium text-gray-900">
                        Years of Experience
                      </label>
                      <select
                        id="yearsOfExperience"
                        name="yearsOfExperience"
                        onChange={handleChange}
                        className="flex h-10 w-full rounded-lg border border-gray-300 bg-white text-gray-900 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        required
                      >
                        <option value="">Select years</option>
                        <option value="0-1">0-1 years</option>
                        <option value="1-3">1-3 years</option>
                        <option value="3-5">3-5 years</option>
                        <option value="5-10">5-10 years</option>
                        <option value="10+">10+ years</option>
                      </select>
                    </div>
                  </div>

                  {/* Services Provided */}
<div className="space-y-2">
  <label className="text-sm font-medium text-gray-900">
    Services Provided
  </label>

  {/* Dropdown */}
  <select
    onChange={(e) => {
      handleServiceAdd(e.target.value);
      e.currentTarget.selectedIndex = 0; // reset
    }}
    className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
  >
    <option value="">Select service</option>
    {SERVICE_OPTIONS.map((service) => (
      <option key={service} value={service}>
        {service}
      </option>
    ))}
  </select>

  {/* Selected Services */}
  {form.services.length > 0 && (
    <div className="flex flex-wrap gap-2 mt-2">
      {form.services.map((service) => (
        <span
          key={service}
          className="flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium"
        >
          {service}
          <button
            type="button"
            onClick={() => handleServiceRemove(service)}
            className="text-blue-700 hover:text-red-600 font-bold"
          >
            ×
          </button>
        </span>
      ))}
    </div>
  )}
</div>


                  {/* File Uploads */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FileUploadBox
                      icon={<User className="w-7 h-7" />}
                      title="Upload Profile Photo"
                      subtitle="JPG, PNG (Max 2 MB)"
                      inputRef={profileInputRef}
                      file={profilePhoto}
                      preview={profilePreview}
                      accept="image/jpeg,image/png,image/webp,image/jpg"
                      error={profileError}
                      onFileSelect={(file) => handleFileUpload("profile", file)}
                      onRemove={() => handleRemoveFile("profile")}
                    />

                    <FileUploadBox
                      icon={<CreditCard className="w-7 h-7" />}
                      title="Upload Aadhaar / PAN"
                      subtitle="PDF, JPG, PNG (Max 5 MB)"
                      inputRef={documentInputRef}
                      file={aadhaarPan}
                      preview={aadhaarPreview}
                      accept="application/pdf,image/jpeg,image/png,image/webp,image/jpg"
                      error={aadhaarError}
                      onFileSelect={(file) => handleFileUpload("document", file)}
                      onRemove={() => handleRemoveFile("document")}
                    />
                  </div>

                </div>

                {/* Promo Code */}
                <div className="space-y-2">
                  <label htmlFor="promoCode" className="text-sm font-medium text-gray-900">
                    Promo Code <span className="text-gray-500">(Optional)</span>
                  </label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <Input
                      id="promoCode"
                      name="promoCode"
                      placeholder="Enter referral code"
                      value={form.promoCode}
                      onChange={handlePromoCodeChange}
                      className={`pl-10 pr-10 bg-white text-gray-900 border-gray-300 placeholder:text-gray-400 ${
                        promoValid === true ? "border-green-500 focus:ring-green-500" :
                        promoValid === false ? "border-red-400 focus:ring-red-400" : ""
                      }`}
                    />
                    {/* Validation icon */}
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {promoValidating && (
                        <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
                      )}
                      {!promoValidating && promoValid === true && (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      )}
                      {!promoValidating && promoValid === false && (
                        <XCircle className="w-4 h-4 text-red-400" />
                      )}
                    </div>
                  </div>
                  {/* Validation message */}
                  {promoMessage && (
                    <p className={`text-xs mt-1 ${
                      promoValid ? "text-green-600" : "text-red-500"
                    }`}>
                      {promoMessage}
                    </p>
                  )}
                  <p className="text-xs text-gray-500">
                    Have a referral code from another technician? Enter it so they earn ₹400 once you complete 3 jobs.
                  </p>
                </div>

                {/* Submit Button */}
                <div className="space-y-4">
                  <Button
                    type="submit"
                    className="w-full h-12 text-base font-semibold bg-orange-600 hover:bg-orange-700 text-white shadow-lg hover:shadow-xl"
                    disabled={loading}
                  >
                {loading ? 'Submitting...' : 'Complete Registration'}
                  </Button>

                   <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-blue-600 hover:underline">
              Sign in
            </Link>
          </p>
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                    <Lock className="w-3 h-3" />
                    <span>Your data is securely encrypted and stored.</span>
                  </div>
                </div>
              </form>
            </Card>
          </div>
        </div>
      </div>
        {/* Success Modal */}
      {showModal && (
        <SuccessModal
          onReturnToHome={handleReturnToHome}
          onClose={() => setShowModal(false)}
        />
         )}
    </div>
  )
}

// Benefit Card Component
function BenefitCard({
  icon,
  title,
  description,
  color,
}: {
  icon: React.ReactNode
  title: string
  description: string
  color: string
}) {
  return (
    <Card className="p-5 bg-white hover:shadow-lg transition-shadow duration-300 cursor-pointer">
      <div className="flex gap-4">
        <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${color} flex items-center justify-center shadow-md`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 mb-1 text-pretty">{title}</h3>
          <p className="text-sm text-gray-600 leading-relaxed text-pretty">{description}</p>
        </div>
      </div>
    </Card>
  )
}

// File Upload Box Component
function FileUploadBox({
  icon,
  title,
  subtitle,
  inputRef,
  file,
  preview,
  accept,
  error,
  onFileSelect,
  onRemove,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  inputRef: React.RefObject<HTMLInputElement | null>;
  file: File | null;
  preview?: string | null;
  accept: string;
  error?: string | null;
  onFileSelect: (file: File | null) => void;
  onRemove?: () => void;
}) {
  const [isDragging, setIsDragging] = useState(false);

  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      onFileSelect(droppedFile);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-5 cursor-pointer transition-all bg-white relative group ${
          error
            ? "border-red-400 bg-red-50/40 hover:border-red-500"
            : file
            ? "border-green-400 bg-green-50/30 hover:border-green-500"
            : isDragging
            ? "border-blue-600 bg-blue-50"
            : "border-gray-300 hover:border-blue-500 hover:bg-blue-50/50"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept={accept}
          onChange={(e) => {
            const f = e.target.files?.[0] || null;
            onFileSelect(f);
            e.target.value = "";
          }}
        />

        {/* 🔹 NO FILE SELECTED */}
        {!file && (
          <div className="flex flex-col items-center gap-2.5 text-center">
            <div className={`p-3 rounded-full transition-colors ${
              error ? "bg-red-100 text-red-600" : "bg-blue-50 text-blue-600 group-hover:bg-blue-100"
            }`}>
              {icon}
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">{title}</p>
              <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
            </div>
            <span className="text-xs text-blue-600 font-medium group-hover:underline">
              Click to browse or drag & drop
            </span>
          </div>
        )}

        {/* 🔹 FILE SELECTED */}
        {file && (
          <div className="flex flex-col items-center gap-2.5">
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="w-24 h-24 rounded-lg object-cover border shadow-sm"
              />
            ) : (
              <div className="w-20 h-20 rounded-lg bg-blue-50 border border-blue-200 flex flex-col items-center justify-center text-blue-600 shadow-sm">
                <span className="text-2xl">📄</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider mt-1">PDF Document</span>
              </div>
            )}

            <div className="text-center max-w-[200px]">
              <p className="text-xs font-semibold text-gray-800 truncate" title={file.name}>
                {file.name}
              </p>
              <p className="text-[11px] text-gray-500">
                Size: <span className="font-medium text-gray-700">{formatSize(file.size)}</span>
              </p>
            </div>

            <div className="flex items-center gap-2.5 mt-0.5">
              <span className="inline-flex items-center gap-1 text-[11px] text-green-700 font-semibold bg-green-100/90 px-2 py-0.5 rounded-full">
                ✓ Ready
              </span>
              {onRemove && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove();
                  }}
                  className="text-xs text-red-500 hover:text-red-700 font-medium hover:underline"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ⚠️ INLINE ERROR ALERT */}
      {error && (
        <div className="flex items-start gap-2 p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs animate-in fade-in duration-200">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold">Size limit exceeded: </span>
            <span>{error}</span>
          </div>
        </div>
      )}
    </div>
  );
}

