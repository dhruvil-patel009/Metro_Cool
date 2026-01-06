"use client";

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Card } from "@/app/components/ui/card"
import { Wallet, BadgeCheck, BarChart3, User, CreditCard, Phone, Mail, Tag, Lock } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import SuccessModal from "../register/successModel";

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
    experienceYears: '',
    promoCode: ''
  });

  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [aadhaarPan, setAadhaarPan] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [aadhaarPreview, setAadhaarPreview] = useState<string | null>(null);

const handleReturnToHome = () => {
  router.push('/');
}
  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleProfilePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setProfilePhoto(file);
    setProfilePreview(URL.createObjectURL(file));
  };

  const handleAadhaarPanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAadhaarPan(file);
    setAadhaarPreview(URL.createObjectURL(file));
  };

  const profileInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (
    type: "profile" | "document",
    file: File | null
  ) => {
    if (!file) return;

    if (type === "profile") {
      setProfilePhoto(file);
      setProfilePreview(URL.createObjectURL(file));
    }

    if (type === "document") {
      setAadhaarPan(file);
      setAadhaarPreview(URL.createObjectURL(file));
    }
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

  try {
    setLoading(true);

    const formData = new FormData();
    formData.append('role', 'technician');
    formData.append('firstName', form.firstName);
    formData.append('middleName', form.middleName);
    formData.append('lastName', form.lastName);
    formData.append('phone', form.phone);
    formData.append('email', form.email);
    formData.append('experienceYears', form.experienceYears);
    formData.append('promoCode', form.promoCode);
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
    router.push('/login'); // 👈 login page
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
                    Connect with thousands of customers looking for HVAC experts like you. Grow your business today.
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

                  {/* File Uploads */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FileUploadBox
                      icon={<User className="w-8 h-8" />}
                      title="Upload Profile Photo"
                      subtitle="JPG, PNG (Max 2MB)"
                      inputRef={profileInputRef}
                      file={profilePhoto}
                      preview={profilePreview}
                      accept="image/jpeg,image/png"
                      onFileSelect={(file) => handleFileUpload("profile", file)}
                    />

                    <FileUploadBox
                      icon={<CreditCard className="w-8 h-8" />}
                      title="Upload Aadhaar / PAN"
                      subtitle="PDF, JPG (Max 5MB)"
                      inputRef={documentInputRef}
                      file={aadhaarPan}
                      preview={aadhaarPreview}
                      accept="application/pdf,image/jpeg,image/png"
                      onFileSelect={(file) => handleFileUpload("document", file)}
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
                      placeholder="Enter code"
                      onChange={handleChange}
                      className="pl-10 bg-white text-gray-900 border-gray-300 placeholder:text-gray-400"
                    />
                  </div>
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
  onFileSelect,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  inputRef: React.RefObject<HTMLInputElement | null>;
  file: File | null;
  preview?: string | null;
  accept: string;
  onFileSelect: (file: File | null) => void;
}) {
  return (
    <div
      onClick={() => inputRef.current?.click()}
      className="border-2 border-dashed border-gray-300 rounded-xl p-6 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all bg-white"
    >
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept={accept}
        onChange={(e) => onFileSelect(e.target.files?.[0] || null)}
      />

      {/* 🔹 NO FILE SELECTED */}
      {!file && (
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="text-blue-600">{icon}</div>
          <p className="font-medium text-gray-900 text-sm">{title}</p>
          <p className="text-xs text-gray-500">{subtitle}</p>
        </div>
      )}

      {/* 🔹 FILE SELECTED */}
      {file && (
        <div className="flex flex-col items-center gap-3">
          {preview ? (
            <img
              src={preview}
              alt="Preview"
              className="w-28 h-28 rounded-lg object-cover border"
            />
          ) : (
            <div className="text-sm text-blue-600 font-medium truncate max-w-[180px]">
              📄 {file.name}
            </div>
          )}

          <p className="text-xs text-green-600 font-semibold">
            ✓ File Selected
          </p>
        </div>
      )}
    </div>
  );
}

