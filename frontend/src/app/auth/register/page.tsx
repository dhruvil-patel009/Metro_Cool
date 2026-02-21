"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify"

import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import {
  User,
  Phone,
  Mail,
  Award as IdCard,
  Contact,
  Edit,
} from "lucide-react";

export default function CustomerRegistrationPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    mpin: "",
    confirmMpin: "",
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🔹 Handle text inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 Handle image select
  const handleImageChange = (file: File) => {
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageChange(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleImageChange(file);
  };

  // 🔹 Submit register
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.firstName || !form.lastName || !form.phone || !form.email) {
      toast.error("Please fill all required fields");
      return;
    }

    if (form.mpin !== form.confirmMpin) {
      toast.error("MPIN does not match");
      return;
    }

    if (!/^\d{4}$/.test(form.mpin)) {
      toast.error("MPIN must be exactly 4 digits");
      return;
    }
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("role", "user");
      formData.append("firstName", form.firstName);
      formData.append("lastName", form.lastName);
      formData.append("phone", form.phone);
      formData.append("email", form.email);
      formData.append("mpin", form.mpin);

      if (imageFile) {
        formData.append("profile_photo", imageFile); // MUST MATCH BACKEND
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/register`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Registration failed");
        return;
      }

      toast.success("Registered successfully ✅");
      router.push("/auth/login");
    } catch (error) {
      console.error(error);
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-sm p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h3 className="text-blue-600 font-medium text-sm mb-2">
            Customer Registration
          </h3>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create your Account
          </h1>
          <p className="text-gray-600 text-sm">
            Join the marketplace for premium AC solutions.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Profile Photo */}
          <div className="border border-gray-200 rounded-lg p-8">
            <div className="flex flex-col items-center">
              <div
                className={`relative ${isDragging ? "opacity-70" : ""}`}
                onDrop={handleDrop}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
              >
                <input
                  type="file"
                  accept="image/*"
                  id="profile-upload"
                  className="hidden"
                  onChange={handleFileInput}
                />

                <label htmlFor="profile-upload" className="cursor-pointer">
                  <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center relative hover:bg-gray-200 transition">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
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
              <p className="text-sm text-gray-600 mt-3">
                Click or drag image (optional)
              </p>
            </div>
          </div>

          {/* Personal Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                <IdCard className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-lg font-semibold">Personal Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                name="firstName"
                placeholder="First Name"
                value={form.firstName}
                onChange={handleChange}
                required
              />
              <Input
                name="lastName"
                placeholder="Last Name"
                value={form.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                <Contact className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-lg font-semibold">Contact Details</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                name="phone"
                placeholder="Phone Number"
                value={form.phone}
                onChange={handleChange}
                required
              />
              <Input
                name="email"
                type="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div>
  <div className="flex items-center gap-2 mb-4">
    <h2 className="text-lg font-semibold">Security</h2>
  </div>

  <div className="grid grid-cols-2 gap-4">
    <Input
      name="mpin"
      type="password"
      maxLength={4}
      placeholder="Enter 4-digit MPIN"
      value={form.mpin}
      onChange={handleChange}
      required
    />

    <Input
      name="confirmMpin"
      type="password"
      maxLength={4}
      placeholder="Confirm MPIN"
      value={form.confirmMpin}
      onChange={handleChange}
      required
    />
  </div>
</div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-blue-700 hover:bg-blue-800 text-white"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </Button>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-blue-600 hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
