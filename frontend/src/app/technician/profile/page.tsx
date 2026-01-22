"use client"

import { useState } from "react"
import { Card } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { Badge } from "@/app/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar"
import { Switch } from "@/app/components/ui/switch"
import { Input } from "@/app/components/ui/input"
import { Textarea } from "@/app/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/app/components/ui/dialog"
import { Label } from "@/app/components/ui/label"
import { MapPin, Calendar, CheckCircle2, Star, Wifi, Plus, X, Truck, BadgeCheck } from "lucide-react"

export default function ProfilePage() {
  const [isOnline, setIsOnline] = useState(true)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isAddSkillDialogOpen, setIsAddSkillDialogOpen] = useState(false)
  const [newSkill, setNewSkill] = useState("")

  const [profileData, setProfileData] = useState({
    fullName: "Alex Technician",
    email: "alex.tech@example.com",
    phone: "+1 (555) 123-4567",
    zipCode: "98101",
    address: "1234 Technology Blvd, Suite 100, Seattle, WA",
    bio: "Specializing in commercial AC systems with over 10 years of experience. Certified for all major brands and emergency repair protocols.",
  })

  const [skills, setSkills] = useState([
    "AC Repair",
    "Electrical Wiring",
    "Preventative Maintenance",
    "OSHA Certified",
    "Customer Service",
  ])

  const handleSaveProfile = () => {
    setIsEditDialogOpen(false)
  }

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()])
      setNewSkill("")
      setIsAddSkillDialogOpen(false)
    }
  }

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100/50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-slate-900">My Profile</h1>
          <p className="text-slate-600 mt-1">Manage your personal information, skills, and availability status.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header Card */}
            <Card className="p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 animate-slide-up">
              <div className="flex items-start gap-6">
                <div className="relative group">
                  <Avatar className="w-24 h-24 border-4 border-white shadow-lg ring-2 ring-slate-100 transition-transform duration-300 group-hover:scale-105">
                    <AvatarImage src="https://github.com/shadcn.png" alt="Alex Technician" />
                    <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-cyan-500 to-blue-600 text-white">
                      AT
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-green-500 rounded-full border-4 border-white shadow-md animate-pulse" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-2xl font-bold text-slate-900">Alex Technician</h2>
                    <BadgeCheck className="w-6 h-6 text-blue-500" />
                  </div>
                  <p className="text-slate-600 font-medium mb-3">Senior AC Specialist</p>
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" />
                      <span>Seattle, WA</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      <span>Member since 2021</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Personal Information */}
            <Card className="p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 animate-slide-up delay-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-900">Personal Information</h3>
                <Button
                  onClick={() => setIsEditDialogOpen(true)}
                  variant="ghost"
                  size="sm"
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-all duration-200"
                >
                  Edit Details
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">Full Name</Label>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-900">
                    {profileData.fullName}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">Email Address</Label>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-900">
                    {profileData.email}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">Phone Number</Label>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-900">
                    {profileData.phone}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">Zip Code</Label>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-900">
                    {profileData.zipCode}
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label className="text-sm font-medium text-slate-700">Address</Label>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-900">
                    {profileData.address}
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label className="text-sm font-medium text-slate-700">Bio</Label>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-900 min-h-[80px]">
                    {profileData.bio}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Stats & Settings */}
          <div className="lg:col-span-1 space-y-6">
            {/* Jobs Completed */}
            <Card className="p-6 border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-slide-up delay-200">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 bg-blue-50 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-slate-600">Jobs Completed</span>
              </div>
              <div className="text-3xl font-bold text-slate-900">1,248</div>
            </Card>

            {/* Rating */}
            <Card className="p-6 border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-slide-up delay-250">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 bg-amber-50 rounded-lg">
                  <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                </div>
                <span className="text-sm font-medium text-slate-600">Rating</span>
              </div>
              <div className="text-3xl font-bold text-slate-900">4.9/5.0</div>
            </Card>

            {/* Availability Status */}
            <Card className="p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 animate-slide-up delay-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900">Availability Status</h3>
                <Switch checked={isOnline} onCheckedChange={setIsOnline} className="data-[state=checked]:bg-blue-600" />
              </div>
              <p className="text-sm text-slate-600 mb-4">Go online to receive jobs.</p>

              {isOnline && (
                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg animate-fade-in">
                  <Wifi className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-700">You are currently Online</span>
                </div>
              )}
            </Card>

            {/* Skills & Certs */}
            <Card className="p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 animate-slide-up delay-350">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900">Skills & Certs</h3>
                <Button
                  onClick={() => setIsAddSkillDialogOpen(true)}
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-all duration-200"
                >
                  <Plus className="w-5 h-5" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="px-3 py-2 text-sm font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-all duration-200 group animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {skill}
                    <button
                      onClick={() => handleRemoveSkill(skill)}
                      className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </Card>

            {/* Vehicle Information */}
            <Card className="p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 animate-slide-up delay-400">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Vehicle Information</h3>
              <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg">
                <div className="p-3 bg-white rounded-lg shadow-sm">
                  <Truck className="w-6 h-6 text-slate-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-900 mb-1">Ford Transit Connect</h4>
                  <p className="text-sm text-slate-600 mb-2">White • 2022 Model</p>
                  <div className="inline-flex items-center px-3 py-1 bg-slate-200 rounded-md">
                    <span className="text-xs font-mono font-semibold text-slate-700">WA-882-KL</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Profile Details</DialogTitle>
            <DialogDescription>Update your personal information below.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={profileData.fullName}
                  onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zipCode">Zip Code</Label>
                <Input
                  id="zipCode"
                  value={profileData.zipCode}
                  onChange={(e) => setProfileData({ ...profileData, zipCode: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={profileData.address}
                onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                rows={4}
                value={profileData.bio}
                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveProfile} className="bg-blue-600 hover:bg-blue-700">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Skill Dialog */}
      <Dialog open={isAddSkillDialogOpen} onOpenChange={setIsAddSkillDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Skill</DialogTitle>
            <DialogDescription>Enter a new skill or certification to add to your profile.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-2">
              <Label htmlFor="newSkill">Skill Name</Label>
              <Input
                id="newSkill"
                placeholder="e.g., Fire Safety Training"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddSkill()}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddSkillDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddSkill} className="bg-blue-600 hover:bg-blue-700">
              Add Skill
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.4s ease-out forwards;
          opacity: 0;
        }

        .animate-slide-up {
          animation: slide-up 0.5s ease-out forwards;
          opacity: 0;
        }

        .delay-100 {
          animation-delay: 100ms;
        }

        .delay-200 {
          animation-delay: 200ms;
        }

        .delay-250 {
          animation-delay: 250ms;
        }

        .delay-300 {
          animation-delay: 300ms;
        }

        .delay-350 {
          animation-delay: 350ms;
        }

        .delay-400 {
          animation-delay: 400ms;
        }
      `}</style>
    </div>
  )
}
