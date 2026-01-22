"use client"

import { useState } from "react"
import { AppLayout } from "@/app/components/ui/app-layout"
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
import { Search, Send, MessageSquare, Phone, ChevronRight, HelpCircle, XCircle, RefreshCw, Clock } from "lucide-react"

interface Ticket {
  id: string
  subject: string
  date: string
  status: "in-progress" | "resolved" | "pending"
}

const commonQuestions = [
  {
    icon: HelpCircle,
    question: "How do I update my bank details?",
    answer:
      "You can update your bank details in the Profile section under Payment Information. Make sure to verify your new details.",
  },
  {
    icon: XCircle,
    question: "What is the job cancellation policy?",
    answer:
      "Jobs can be cancelled up to 2 hours before the scheduled time without penalty. Late cancellations may affect your rating.",
  },
  {
    icon: RefreshCw,
    question: "Troubleshooting app sync errors",
    answer:
      "Try logging out and back in. If the issue persists, clear app cache or reinstall the app. Contact support if problems continue.",
  },
  {
    icon: Clock,
    question: "Changing my availability schedule",
    answer: "Go to Profile > Availability Status to toggle your online status and set your working hours for the week.",
  },
]

const recentTickets: Ticket[] = [
  { id: "#2849", subject: "Payment discrepancy - Oct", date: "Oct 24, 2023", status: "in-progress" },
  { id: "#2801", subject: "App crashing on login", date: "Oct 10, 2023", status: "resolved" },
  { id: "#2795", subject: "Verification documents", date: "Sep 28, 2023", status: "resolved" },
]

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedQuestion, setSelectedQuestion] = useState<number | null>(null)
  const [showTicketDialog, setShowTicketDialog] = useState(false)
  const [ticketSubject, setTicketSubject] = useState("")
  const [ticketDescription, setTicketDescription] = useState("")

  const handleSubmitTicket = () => {
    console.log("[v0] Submitting ticket:", { ticketSubject, ticketDescription })
    setShowTicketDialog(false)
    setTicketSubject("")
    setTicketDescription("")
  }

  const handleStartChat = () => {
    console.log("[v0] Starting chat support")
    alert("Chat support would open here")
  }

  const handleCallNow = () => {
    console.log("[v0] Initiating phone call")
    window.location.href = "tel:1-800-8324-4357"
  }

  const getStatusColor = (status: Ticket["status"]) => {
    switch (status) {
      case "in-progress":
        return "bg-yellow-100 text-yellow-700 border-yellow-200"
      case "resolved":
        return "bg-green-100 text-green-700 border-green-200"
      case "pending":
        return "bg-gray-100 text-gray-700 border-gray-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  const getStatusText = (status: Ticket["status"]) => {
    switch (status) {
      case "in-progress":
        return "In Progress"
      case "resolved":
        return "Resolved"
      case "pending":
        return "Pending"
      default:
        return status
    }
  }

  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-50 p-6 lg:p-8 animate-in fade-in duration-500">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header Section */}
          <div className="space-y-3 animate-in slide-in-from-top-4 duration-500">
            <h1 className="text-4xl font-bold text-gray-900">Support Center</h1>
            <p className="text-gray-600 text-lg">Need assistance with a job or payment? We are here to help.</p>
          </div>

          {/* Search Bar */}
          <div className="relative animate-in slide-in-from-top-4 duration-500 delay-100">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search for articles, guides, or troubleshooting..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 text-base shadow-sm border-gray-200 focus:border-cyan-500 focus:ring-cyan-500/20 rounded-lg"
            />
          </div>

          {/* Support Options Cards */}
          <div className="grid gap-6 md:grid-cols-3 animate-in slide-in-from-bottom-4 duration-500 delay-200">
            {/* Raise a Ticket */}
            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer border-gray-200">
              <CardContent className="pt-6 space-y-4">
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <Send className="h-6 w-6 text-blue-600" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-xl text-gray-900">Raise a Ticket</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Describe your issue in detail and we'll get back to you via email. Best for non-urgent queries.
                  </p>
                </div>
                <Button
                  onClick={() => setShowTicketDialog(true)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all"
                >
                  <Send className="h-4 w-4" />
                  Submit Request
                </Button>
              </CardContent>
            </Card>

            {/* Chat Support */}
            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer border-gray-200 relative">
              <div className="absolute top-4 right-4">
                <Badge className="bg-green-100 text-green-700 border-green-200 gap-1.5">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  Online
                </Badge>
              </div>
              <CardContent className="pt-6 space-y-4">
                <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                  <MessageSquare className="h-6 w-6 text-green-600" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-xl text-gray-900">Chat Support</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Talk to a support agent now. Typical wait time is less than 2 minutes.
                  </p>
                </div>
                <Button
                  onClick={handleStartChat}
                  variant="outline"
                  className="w-full border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all bg-transparent"
                >
                  <MessageSquare className="h-4 w-4" />
                  Start Chat
                </Button>
              </CardContent>
            </Card>

            {/* Phone Support */}
            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer border-gray-200">
              <CardContent className="pt-6 space-y-4">
                <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                  <Phone className="h-6 w-6 text-orange-600" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-xl text-gray-900">Phone Support</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Urgent issue regarding safety or access? Reach us immediately.
                  </p>
                </div>
                <div className="text-center py-2">
                  <p className="text-2xl font-bold text-gray-900 tracking-tight">1-800-TECH-HELP</p>
                </div>
                <Button
                  onClick={handleCallNow}
                  variant="outline"
                  className="w-full border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all bg-transparent"
                >
                  <Phone className="h-4 w-4" />
                  Call Now
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Common Questions & Recent Tickets */}
          <div className="grid gap-6 lg:grid-cols-2 animate-in slide-in-from-bottom-4 duration-500 delay-300">
            {/* Common Questions */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Common Questions</h2>
                <Button variant="link" className="text-cyan-600 hover:text-cyan-700">
                  View all
                </Button>
              </div>
              <Card className="border-gray-200">
                <CardContent className="p-0">
                  <div className="divide-y divide-gray-200">
                    {commonQuestions.map((item, index) => {
                      const Icon = item.icon
                      return (
                        <button
                          key={index}
                          onClick={() => setSelectedQuestion(selectedQuestion === index ? null : index)}
                          className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                              <Icon className="h-4 w-4 text-gray-600" />
                            </div>
                            <span className="text-gray-900 font-medium text-left">{item.question}</span>
                          </div>
                          <ChevronRight
                            className={`h-5 w-5 text-gray-400 transition-transform ${
                              selectedQuestion === index ? "rotate-90" : ""
                            }`}
                          />
                        </button>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Tickets */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Recent Tickets</h2>
                <Button variant="link" className="text-cyan-600 hover:text-cyan-700">
                  View history
                </Button>
              </div>
              <Card className="border-gray-200">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200 bg-gray-50">
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            ID
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Subject
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {recentTickets.map((ticket, index) => (
                          <tr
                            key={ticket.id}
                            className="hover:bg-gray-50 transition-colors cursor-pointer"
                            style={{ animationDelay: `${index * 50}ms` }}
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                              {ticket.id}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">{ticket.subject}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{ticket.date}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge className={getStatusColor(ticket.status)}>{getStatusText(ticket.status)}</Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-8 border-t border-gray-200 text-sm text-gray-600 animate-in fade-in duration-500 delay-500">
            <p>©2026 Tech Portal Inc. All rights reserved.</p>
            <div className="flex gap-6">
              <Button variant="link" className="text-gray-600 hover:text-gray-900 h-auto p-0">
                Privacy Policy
              </Button>
              <Button variant="link" className="text-gray-600 hover:text-gray-900 h-auto p-0">
                Terms of Service
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Ticket Dialog */}
      <Dialog open={showTicketDialog} onOpenChange={setShowTicketDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Submit a Support Ticket</DialogTitle>
            <DialogDescription>Describe your issue and we'll get back to you within 24 hours.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="subject" className="text-sm font-medium text-gray-900">
                Subject
              </label>
              <Input
                id="subject"
                placeholder="Brief description of your issue"
                value={ticketSubject}
                onChange={(e) => setTicketSubject(e.target.value)}
                className="border-gray-300"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium text-gray-900">
                Description
              </label>
              <textarea
                id="description"
                rows={5}
                placeholder="Provide detailed information about your issue..."
                value={ticketDescription}
                onChange={(e) => setTicketDescription(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-cyan-500 focus:ring-cyan-500/20 focus:ring-[3px] outline-none transition-all"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTicketDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmitTicket}
              disabled={!ticketSubject || !ticketDescription}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Send className="h-4 w-4" />
              Submit Ticket
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  )
}
