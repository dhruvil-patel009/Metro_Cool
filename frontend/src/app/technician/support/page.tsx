"use client"

import { useState } from "react"
import { Card, CardContent } from "@/app/components/ui/card"
import { Input } from "@/app/components/ui/input"
import { Button } from "@/app/components/ui/button"
import { Badge } from "@/app/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog"
import {
  Search, Send, MessageSquare, Phone, ChevronRight, ChevronDown,
  HelpCircle, XCircle, RefreshCw, Clock, Loader2,
  LifeBuoy, BookOpen, Shield, Headphones, Mail,
  CheckCircle2, AlertCircle, Ticket,
} from "lucide-react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-toastify"
import { cn } from "@/app/lib/utils"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"

dayjs.extend(relativeTime)

const API = process.env.NEXT_PUBLIC_API_BASE_URL!
const getToken = () =>
  typeof window === "undefined" ? "" :
  localStorage.getItem("accessToken") || localStorage.getItem("token") || ""

/* ── Types ── */
interface SupportTicket {
  id: string
  subject: string
  description: string
  category: string
  status: "open" | "in_progress" | "resolved" | "closed"
  created_at: string
}

/* ── FAQ data ── */
const faqs = [
  {
    icon: HelpCircle,
    category: "Account",
    question: "How do I update my bank details?",
    answer: "Go to your Profile page and look for the Payment Information section. You can update your bank account details there. Changes will reflect in your next payout cycle.",
  },
  {
    icon: XCircle,
    category: "Jobs",
    question: "What happens if I cancel a job?",
    answer: "You can cancel a job before arriving at the location. Frequent cancellations may impact your account rating. If you face a genuine issue, raise a support ticket and our team will review it.",
  },
  {
    icon: RefreshCw,
    category: "Technical",
    question: "The app is not syncing properly",
    answer: "Try refreshing the page or clearing your browser cache. If you're on mobile, close and reopen the app. If the issue persists, log out and log back in. Contact support if problems continue.",
  },
  {
    icon: Clock,
    category: "Schedule",
    question: "How do I change my availability?",
    answer: "Your availability is managed through the Schedule & Assignments page. You can set your working hours and toggle your online status from your Profile settings.",
  },
  {
    icon: Shield,
    category: "Payments",
    question: "When do I receive my payouts?",
    answer: "Payouts are processed weekly. Completed jobs are settled every Monday. You can view your earnings breakdown on the Earnings page. Bank transfers typically take 1-2 business days.",
  },
  {
    icon: BookOpen,
    category: "Jobs",
    question: "How do I submit a service report?",
    answer: "After completing a job, you'll be prompted to submit a service report. Include photos of the work done, parts used, and any notes for the customer. This is required to mark a job as complete.",
  },
]

/* ── Fetch tickets ── */
const fetchTickets = async (): Promise<SupportTicket[]> => {
  const res = await fetch(`${API}/support/tickets`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  })
  if (!res.ok) return []
  const json = await res.json()
  return Array.isArray(json.tickets) ? json.tickets : []
}

export default function SupportPage() {
  const qc = useQueryClient()
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [showTicketDialog, setShowTicketDialog] = useState(false)
  const [ticketSubject, setTicketSubject] = useState("")
  const [ticketDescription, setTicketDescription] = useState("")
  const [ticketCategory, setTicketCategory] = useState("general")
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null)

  /* ── Data ── */
  const { data: tickets = [], isLoading } = useQuery({
    queryKey: ["support-tickets"],
    queryFn: fetchTickets,
    staleTime: 30_000,
  })

  /* ── Create ticket mutation ── */
  const createTicketMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`${API}/support/tickets`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject: ticketSubject,
          description: ticketDescription,
          category: ticketCategory,
        }),
      })
      if (!res.ok) throw new Error("Failed to create ticket")
      return res.json()
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["support-tickets"] })
      setShowTicketDialog(false)
      setTicketSubject("")
      setTicketDescription("")
      setTicketCategory("general")
      setShowSuccessMessage(true)
      setTimeout(() => setShowSuccessMessage(false), 5000)
      toast.success("Ticket submitted successfully!")
    },
    onError: () => toast.error("Failed to submit ticket. Please try again."),
  })

  /* ── Filtered FAQs ── */
  const filteredFaqs = searchQuery
    ? faqs.filter(f =>
        f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : faqs

  /* ── Status helpers ── */
  const statusConfig: Record<string, { label: string; color: string; icon: typeof CheckCircle2 }> = {
    open:        { label: "Open",        color: "bg-amber-100 text-amber-700 border-amber-200",    icon: AlertCircle },
    in_progress: { label: "In Progress", color: "bg-blue-100 text-blue-700 border-blue-200",      icon: Clock },
    resolved:    { label: "Resolved",    color: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: CheckCircle2 },
    closed:      { label: "Closed",      color: "bg-slate-100 text-slate-600 border-slate-200",   icon: XCircle },
  }

  const handleCallNow = () => {
    window.location.href = "tel:+918324435700"
  }

  const handleEmailSupport = () => {
    window.location.href = "mailto:support@metrocool.com?subject=Technician Support Request"
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 px-2 sm:px-0">

      {/* ── Header ── */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-100 rounded-xl">
            <LifeBuoy className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900">Support Center</h1>
            <p className="text-slate-500 font-medium text-sm sm:text-base">
              Get help with jobs, payments, or account issues
            </p>
          </div>
        </div>
      </div>

      {/* ── Search ── */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
        <Input
          type="text"
          placeholder="Search FAQs, topics, or describe your issue..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-12 h-12 sm:h-14 text-sm sm:text-base bg-white shadow-sm border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl sm:rounded-2xl"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            ✕
          </button>
        )}
      </div>

      {/* ── Contact Options ── */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {/* Raise Ticket */}
        <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-slate-200 overflow-hidden">
          <CardContent className="p-5 sm:p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <Ticket className="h-5 w-5 text-blue-600" />
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase">24h response</span>
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900">Raise a Ticket</h3>
              <p className="text-slate-500 text-sm mt-1 leading-relaxed">
                Describe your issue in detail. Our team will respond within 24 hours.
              </p>
            </div>
            <Button
              onClick={() => setShowTicketDialog(true)}
              className="w-full bg-blue-600 cursor-pointer hover:bg-blue-700 text-white font-bold rounded-xl h-11"
            >
              <Send className="h-4 w-4 mr-2" />
              Submit Ticket
            </Button>
          </CardContent>
        </Card>

        {/* Phone Support */}
        <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-slate-200 overflow-hidden">
          <CardContent className="p-5 sm:p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div className="w-11 h-11 rounded-xl bg-emerald-100 flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                <Phone className="h-5 w-5 text-emerald-600" />
              </div>
              <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 gap-1 text-[10px] font-bold">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                Available
              </Badge>
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900">Phone Support</h3>
              <p className="text-slate-500 text-sm mt-1 leading-relaxed">
                Urgent issues? Call us directly for immediate assistance.
              </p>
            </div>
            <Button
              onClick={handleCallNow}
              variant="outline"
              className="w-full border-slate-200 hover:bg-emerald-50 hover:border-emerald-300 cursor-pointer font-bold rounded-xl h-11 bg-transparent"
            >
              <Phone className="h-4 w-4 mr-2" />
              +91 832-443-5700
            </Button>
          </CardContent>
        </Card>

        {/* Email Support */}
        <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-slate-200 overflow-hidden sm:col-span-2 lg:col-span-1">
          <CardContent className="p-5 sm:p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div className="w-11 h-11 rounded-xl bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                <Mail className="h-5 w-5 text-purple-600" />
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase">48h response</span>
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900">Email Support</h3>
              <p className="text-slate-500 text-sm mt-1 leading-relaxed">
                Send us a detailed email with screenshots or attachments.
              </p>
            </div>
            <Button
              onClick={handleEmailSupport}
              variant="outline"
              className="w-full border-slate-200 hover:bg-purple-50 hover:border-purple-300 cursor-pointer font-bold rounded-xl h-11 bg-transparent"
            >
              <Mail className="h-4 w-4 mr-2" />
              Email Us
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* ── Success Banner ── */}
      {showSuccessMessage && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3 animate-in slide-in-from-top-2 duration-300">
          <div className="w-9 h-9 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-emerald-800">Ticket Submitted Successfully!</p>
            <p className="text-xs text-emerald-600 mt-0.5">Our team will review your ticket and respond within 24 hours.</p>
          </div>
          <button onClick={() => setShowSuccessMessage(false)} className="text-emerald-400 hover:text-emerald-600">
            ✕
          </button>
        </div>
      )}

      {/* ── FAQs + Tickets Grid ── */}
      <div className="grid gap-6 lg:grid-cols-5">

        {/* FAQs — wider */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-500" />
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-2">
            {filteredFaqs.length === 0 && (
              <Card className="border-slate-200">
                <CardContent className="py-10 text-center text-slate-400">
                  <Search className="w-8 h-8 mx-auto mb-2 text-slate-200" />
                  <p className="font-medium">No results found for "{searchQuery}"</p>
                  <p className="text-sm mt-1">Try a different search term or raise a ticket</p>
                </CardContent>
              </Card>
            )}

            {filteredFaqs.map((faq, index) => {
              const Icon = faq.icon
              const isOpen = expandedFaq === index
              return (
                <Card key={index} className={cn(
                  "border-slate-200 transition-all overflow-hidden",
                  isOpen && "ring-1 ring-blue-200 shadow-sm"
                )}>
                  <button
                    onClick={() => setExpandedFaq(isOpen ? null : index)}
                    className="w-full p-4 sm:p-5 flex items-center gap-3 sm:gap-4 text-left hover:bg-slate-50/50 transition-colors"
                  >
                    <div className={cn(
                      "w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                      isOpen ? "bg-blue-100" : "bg-slate-100"
                    )}>
                      <Icon className={cn("h-4 w-4", isOpen ? "text-blue-600" : "text-slate-500")} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-900 text-sm sm:text-base">{faq.question}</p>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{faq.category}</span>
                    </div>
                    <ChevronDown className={cn(
                      "w-5 h-5 text-slate-400 transition-transform shrink-0",
                      isOpen && "rotate-180 text-blue-500"
                    )} />
                  </button>
                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-0">
                      <div className="pl-12 sm:pl-13 text-sm text-slate-600 leading-relaxed bg-blue-50/50 rounded-xl p-4 border border-blue-100/50">
                        {faq.answer}
                      </div>
                    </div>
                  )}
                </Card>
              )
            })}
          </div>
        </div>

        {/* Recent Tickets */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Headphones className="w-5 h-5 text-blue-500" />
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">My Tickets</h2>
            </div>
            {tickets.length > 0 && (
              <span className="text-xs bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded-full">
                {tickets.length}
              </span>
            )}
          </div>

          <Card className="border-slate-200">
            <CardContent className="p-0">
              {isLoading && (
                <div className="py-12 flex flex-col items-center gap-2 text-slate-400">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <p className="text-sm font-medium">Loading tickets…</p>
                </div>
              )}

              {!isLoading && tickets.length === 0 && (
                <div className="py-12 flex flex-col items-center gap-3 text-slate-400">
                  <Ticket className="w-8 h-8 text-slate-200" />
                  <div className="text-center">
                    <p className="font-medium text-sm">No tickets yet</p>
                    <p className="text-xs mt-0.5">Submit a ticket if you need help</p>
                  </div>
                  <Button
                    onClick={() => setShowTicketDialog(true)}
                    size="sm"
                    variant="outline"
                    className="mt-2 text-blue-600 border-blue-200 hover:bg-blue-50 bg-transparent cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5 mr-1.5" />
                    New Ticket
                  </Button>
                </div>
              )}

              {!isLoading && tickets.length > 0 && (
                <div className="divide-y divide-slate-100">
                  {tickets.slice(0, 8).map((ticket) => {
                    const cfg = statusConfig[ticket.status] || statusConfig.open
                    const StatusIcon = cfg.icon

                    // Left border color based on status
                    const borderColor: Record<string, string> = {
                      open: "border-l-amber-400",
                      in_progress: "border-l-blue-500",
                      resolved: "border-l-emerald-500",
                      closed: "border-l-slate-400",
                    }

                    return (
                      <button
                        key={ticket.id}
                        onClick={() => setSelectedTicket(ticket)}
                        className={cn(
                          "w-full p-4 hover:bg-slate-50/50 transition-colors text-left border-l-4",
                          borderColor[ticket.status] || "border-l-slate-300"
                        )}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h4 className="text-sm font-semibold text-slate-900 line-clamp-1 flex-1">
                            {ticket.subject}
                          </h4>
                          <Badge className={cn("text-[10px] font-bold px-2 py-0.5 rounded-lg border shrink-0", cfg.color)}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {cfg.label}
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-2 mb-2">{ticket.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-semibold text-slate-400 uppercase">
                            {ticket.category}
                          </span>
                          <span className="text-[11px] text-slate-400 font-medium">
                            {dayjs(ticket.created_at).fromNow()}
                          </span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ── Ticket Dialog ── */}
      <Dialog open={showTicketDialog} onOpenChange={setShowTicketDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Ticket className="w-5 h-5 text-blue-500" />
              Submit a Support Ticket
            </DialogTitle>
            <DialogDescription>
              Describe your issue and our team will respond within 24 hours.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Category */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Category</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { v: "general",  l: "General" },
                  { v: "payment",  l: "Payment" },
                  { v: "job",      l: "Job Issue" },
                  { v: "account",  l: "Account" },
                  { v: "technical",l: "Technical" },
                ].map(({ v, l }) => (
                  <button
                    key={v}
                    onClick={() => setTicketCategory(v)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-bold border transition-all",
                      ticketCategory === v
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-slate-600 border-slate-200 hover:border-blue-300"
                    )}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            {/* Subject */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Subject</label>
              <Input
                placeholder="Brief description of your issue"
                value={ticketSubject}
                onChange={(e) => setTicketSubject(e.target.value)}
                className="border-slate-200 h-11"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Description</label>
              <textarea
                rows={5}
                placeholder="Provide detailed information about your issue. Include any relevant job IDs, dates, or error messages..."
                value={ticketDescription}
                onChange={(e) => setTicketDescription(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500/20 focus:ring-[3px] outline-none transition-all resize-none"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowTicketDialog(false)} className="bg-transparent">
              Cancel
            </Button>
            <Button
              onClick={() => createTicketMutation.mutate()}
              disabled={!ticketSubject.trim() || !ticketDescription.trim() || createTicketMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700 font-bold"
            >
              {createTicketMutation.isPending
                ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Submitting…</>
                : <><Send className="w-4 h-4 mr-2" />Submit Ticket</>
              }
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Ticket Detail Dialog ── */}
      <Dialog open={!!selectedTicket} onOpenChange={(open) => !open && setSelectedTicket(null)}>
        <DialogContent className="sm:max-w-lg">
          {selectedTicket && (() => {
            const cfg = statusConfig[selectedTicket.status] || statusConfig.open
            const StatusIcon = cfg.icon
            return (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-lg">
                    <Ticket className="w-5 h-5 text-blue-500" />
                    Ticket Details
                  </DialogTitle>
                  <DialogDescription className="sr-only">View your support ticket details</DialogDescription>
                </DialogHeader>
                <div className="space-y-5 py-4">
                  {/* Status + Category */}
                  <div className="flex items-center gap-3 flex-wrap">
                    <Badge className={cn("text-xs font-bold px-3 py-1 rounded-lg border", cfg.color)}>
                      <StatusIcon className="w-3.5 h-3.5 mr-1.5" />
                      {cfg.label}
                    </Badge>
                    <Badge className="bg-slate-100 text-slate-600 border-slate-200 text-xs font-bold px-3 py-1 rounded-lg capitalize">
                      {selectedTicket.category}
                    </Badge>
                  </div>

                  {/* Subject */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Subject</label>
                    <p className="text-base font-semibold text-slate-900">{selectedTicket.subject}</p>
                  </div>

                  {/* Description */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Description</label>
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                      <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{selectedTicket.description}</p>
                    </div>
                  </div>

                  {/* Meta info */}
                  <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ticket ID</label>
                      <p className="text-xs font-mono text-slate-600 mt-0.5">{selectedTicket.id.slice(0, 8)}…</p>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Submitted</label>
                      <p className="text-xs text-slate-600 mt-0.5">
                        {dayjs(selectedTicket.created_at).format("MMM D, YYYY • h:mm A")}
                      </p>
                    </div>
                  </div>

                  {/* Status note */}
                  {selectedTicket.status === "open" && (
                    <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <p className="text-xs text-amber-700 leading-relaxed">
                        Your ticket is being reviewed. Our support team will respond within 24 hours.
                      </p>
                    </div>
                  )}
                  {selectedTicket.status === "in_progress" && (
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex items-start gap-2">
                      <Clock className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                      <p className="text-xs text-blue-700 leading-relaxed">
                        Our team is actively working on your issue. You'll receive an update soon.
                      </p>
                    </div>
                  )}
                  {selectedTicket.status === "resolved" && (
                    <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <p className="text-xs text-emerald-700 leading-relaxed">
                        This ticket has been resolved. If you still face issues, submit a new ticket.
                      </p>
                    </div>
                  )}
                  {selectedTicket.status === "closed" && (
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                      <p className="text-xs text-slate-600 leading-relaxed">
                        This ticket has been closed. If you need further assistance, please submit a new ticket.
                      </p>
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setSelectedTicket(null)} className="bg-transparent">
                    Close
                  </Button>
                </DialogFooter>
              </>
            )
          })()}
        </DialogContent>
      </Dialog>
    </div>
  )
}
