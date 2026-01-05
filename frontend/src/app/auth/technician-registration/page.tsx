// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import {
//   Phone,
//   Mail,
//   Camera,
//   CreditCard,
//   Tag
// } from "lucide-react";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// // import VerificationPendingModal from "@/app/components/VerificationPendingModal";

// export default function TechnicianRegistration() {
//   const router = useRouter();

//   const [loading, setLoading] = useState(false);
//   const [showModal, setShowModal] = useState(false);

//   const [form, setForm] = useState({
//     firstName: "",
//     middleName: "",
//     lastName: "",
//     phone: "",
//     email: "",
//     experienceYears: "",
//     promoCode: "",
//   });

//   const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
//   const [aadhaarPan, setAadhaarPan] = useState<File | null>(null);
//   const [profilePreview, setProfilePreview] = useState<string | null>(null);

//   const handleChange = (e: any) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleProfilePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     setProfilePhoto(file);
//     setProfilePreview(URL.createObjectURL(file));
//   };

//   const handleAadhaarPanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     setAadhaarPan(file);
//   };

//   const handleSubmit = async () => {
//     if (!form.firstName || !form.lastName || !form.phone || !form.email) {
//       toast.warning("Please fill all required fields");
//       return;
//     }

//     if (!profilePhoto || !aadhaarPan) {
//       toast.warning("Please upload profile photo and Aadhaar/PAN");
//       return;
//     }

//     try {
//       setLoading(true);

//       const formData = new FormData();
//       Object.entries(form).forEach(([k, v]) => formData.append(k, v));
//       formData.append("role", "technician");
//       formData.append("profile_photo", profilePhoto);
//       formData.append("aadhaar_pan", aadhaarPan);

//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/register`,
//         { method: "POST", body: formData }
//       );

//       const data = await res.json();
//       if (!res.ok) {
//         toast.error(data.error || "Registration failed");
//         return;
//       }

//       toast.success("🎉 Registration successful!");
//       setShowModal(true);
//     } catch {
//       toast.error("Server error. Try again later.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       <ToastContainer position="top-right" autoClose={3000} />

//       <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100 flex items-center justify-center p-4">
//         <div className="grid max-w-6xl w-full bg-white rounded-2xl shadow-xl overflow-hidden lg:grid-cols-3">

//           {/* LEFT INFO PANEL */}
//           <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-cyan-600 to-blue-700 text-white p-8">
//             <div>
//               <h2 className="text-3xl font-bold mb-4">Join Our Network</h2>
//               <p className="text-sm text-cyan-100">
//                 Connect with thousands of customers looking for HVAC experts.
//               </p>
//             </div>

//             <ul className="space-y-6 mt-10">
//               <li className="flex gap-3">
//                 <span>💳</span>
//                 <div>
//                   <h4 className="font-semibold">Instant Payments</h4>
//                   <p className="text-sm text-cyan-100">
//                     Get paid immediately after job completion.
//                   </p>
//                 </div>
//               </li>
//               <li className="flex gap-3">
//                 <span>✔️</span>
//                 <div>
//                   <h4 className="font-semibold">Verified Badge</h4>
//                   <p className="text-sm text-cyan-100">
//                     Build trust with customers.
//                   </p>
//                 </div>
//               </li>
//               <li className="flex gap-3">
//                 <span>📈</span>
//                 <div>
//                   <h4 className="font-semibold">Grow Faster</h4>
//                   <p className="text-sm text-cyan-100">
//                     Earn more as you complete more jobs.
//                   </p>
//                 </div>
//               </li>
//             </ul>
//           </div>

//           {/* FORM */}
//           <div className="lg:col-span-2 p-6 sm:p-10">
//             <h3 className="text-2xl font-bold mb-2">
//               Technician Registration
//             </h3>
//             <p className="text-gray-500 mb-6">
//               Fill your details to start receiving jobs.
//             </p>

//             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//               {["firstName", "middleName", "lastName"].map((name) => (
//                 <input
//                   key={name}
//                   name={name}
//                   placeholder={name.replace(/([A-Z])/g, " $1")}
//                   onChange={handleChange}
//                   className="input"
//                 />
//               ))}
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
//               <div className="relative">
//                 <Phone className="input-icon" />
//                 <input
//                   name="phone"
//                   placeholder="Phone number"
//                   onChange={handleChange}
//                   className="input pl-10"
//                 />
//               </div>

//               <div className="relative">
//                 <Mail className="input-icon" />
//                 <input
//                   name="email"
//                   placeholder="Email address"
//                   onChange={handleChange}
//                   className="input pl-10"
//                 />
//               </div>
//             </div>

//             <select
//               name="experienceYears"
//               onChange={handleChange}
//               className="input mt-4"
//             >
//               <option value="">Select experience</option>
//               <option value="1-3">1-3 Years</option>
//               <option value="3-5">3-5 Years</option>
//               <option value="5+">5+ Years</option>
//             </select>

//             {/* UPLOADS */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
//               <div
//                 onClick={() => document.getElementById("profilePhoto")?.click()}
//                 className="upload-box"
//               >
//                 {profilePreview ? (
//                   <img src={profilePreview} className="h-24 mx-auto rounded" />
//                 ) : (
//                   <>
//                     <Camera />
//                     <p>Upload Profile Photo</p>
//                   </>
//                 )}
//               </div>

//               <div
//                 onClick={() => document.getElementById("aadhaarPan")?.click()}
//                 className="upload-box"
//               >
//                 <CreditCard />
//                 <p>Upload Aadhaar / PAN</p>
//               </div>
//             </div>

//             <input hidden id="profilePhoto" type="file" onChange={handleProfilePhotoChange} />
//             <input hidden id="aadhaarPan" type="file" onChange={handleAadhaarPanChange} />

//             <div className="relative mt-4">
//               <Tag className="input-icon" />
//               <input
//                 name="promoCode"
//                 placeholder="Promo code (optional)"
//                 onChange={handleChange}
//                 className="input pl-10"
//               />
//             </div>

//             <button
//               onClick={handleSubmit}
//               disabled={loading}
//               className="mt-6 w-full bg-cyan-600 hover:bg-cyan-700 text-white py-3 rounded-lg font-semibold transition-all active:scale-95"
//             >
//               {loading ? "Submitting..." : "Complete Registration"}
//             </button>
//           </div>
//         </div>

//         {/* <VerificationPendingModal open={showModal} /> */}
//       </div>

//       {/* Tailwind helpers */}
//       <style jsx>{`
//         .input {
//           @apply w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:ring-2 focus:ring-cyan-500 focus:outline-none transition;
//         }
//         .input-icon {
//           @apply absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400;
//         }
//         .upload-box {
//           @apply cursor-pointer border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-cyan-500 hover:bg-cyan-50 transition;
//         }
//       `}</style>
//     </>
//   );
// }




"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { User, Phone, Mail, Award as IdCard, Contact, Edit } from "lucide-react"
import Link from "next/link"

export default function CustomerRegistrationPage() {
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-sm p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h3 className="text-blue-600 font-medium text-sm mb-2">Customer Registration</h3>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create your Account</h1>
          <p className="text-gray-600 text-sm">
            Join the marketplace for premium HVAC solutions and seamless service management.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Profile Photo Upload */}
          <div className="border border-gray-200 rounded-lg p-8">
            <div className="flex flex-col items-center">
              <div
                className={`relative ${isDragging ? "opacity-70" : ""}`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <input
                  type="file"
                  id="profile-upload"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <label htmlFor="profile-upload" className="cursor-pointer block">
                  <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center relative group hover:bg-gray-200 transition-colors">
                    {profileImage ? (
                      <img
                        src={profileImage || "/placeholder.svg"}
                        alt="Profile"
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-10 h-10 text-gray-400" />
                    )}
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center border-2 border-white">
                      <Edit className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </label>
              </div>
              <h3 className="text-gray-900 font-semibold mt-4 mb-1">Profile Photo</h3>
              <p className="text-sm text-gray-600">Click to upload or drag and drop (Optional)</p>
            </div>
          </div>

          {/* Personal Information */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                <IdCard className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-900 mb-2">
                  First Name <span className="text-red-500">*</span>
                </label>
                <Input id="firstName" type="text" placeholder="John" required className="h-11" />
              </div>

              <div>
                <label htmlFor="middleName" className="block text-sm font-medium text-gray-900 mb-2">
                  Middle Name
                </label>
                <Input id="middleName" type="text" placeholder="" className="h-11" />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-900 mb-2">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <Input id="lastName" type="text" placeholder="Doe" required className="h-11" />
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                <Contact className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Contact Details</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-900 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <Input id="phone" type="tel" placeholder="(555) 123-4567" required className="h-11 pl-10" />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <Input id="email" type="email" placeholder="john.doe@example.com" required className="h-11 pl-10" />
                </div>
              </div>
            </div>
          </div>

          {/* Terms and Conditions */}
          <p className="text-center text-sm text-gray-600">
            By registering, you agree to our{" "}
            <Link href="/terms" className="text-blue-600 hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-blue-600 hover:underline">
              Privacy Policy
            </Link>
            .
          </p>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full h-12 bg-blue-700 hover:bg-blue-800 text-white font-medium text-base rounded-lg transition-colors"
          >
            Create Account
          </Button>

          {/* Sign In Link */}
          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/signin" className="text-blue-600 hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
