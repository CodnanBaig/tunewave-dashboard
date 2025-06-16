"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Send, Paperclip, X, Loader2, Clock, Phone, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

type MessageType = {
  id: number
  content: string
  sender: "user" | "support"
  timestamp: Date
  type: "text" | "file" | "quick_reply"
  attachments?: { name: string; size: number; type: string }[]
  quickReplies?: { text: string; value: string }[]
}

type ChatState = {
  stage: "initial" | "category" | "details" | "resolution"
  category?: string
  details?: string
}

export default function SupportPage() {
  const [open, setOpen] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [message, setMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [attachments, setAttachments] = useState<File[]>([])
  const [chatState, setChatState] = useState<ChatState>({ stage: "initial" })
  const [ticketSubmitted, setTicketSubmitted] = useState(false)
  const [messages, setMessages] = useState<MessageType[]>([
    {
      id: 1,
      content: "Hi there! 👋 I'm here to help. What can I assist you with today?",
      sender: "support",
      timestamp: new Date(),
      type: "text",
      quickReplies: [
        { text: "Payments", value: "payments" },
        { text: "Releases", value: "releases" },
        { text: "Account", value: "account" },
        { text: "OAC", value: "oac" },
        { text: "Content ID", value: "content_id" },
        { text: "Other", value: "other" }
      ]
    }
  ])

  const handleQuickReply = (value: string) => {
    if (value === "submit") {
      handleSubmitTicket()
      return
    }
    if (value === "close") {
      setOpen(false)
      setShowConfirmation(false)
      setTicketSubmitted(false)
      setChatState({ stage: "initial" })
      setMessages([{
        id: 1,
        content: "Hi there! 👋 I'm here to help. What can I assist you with today?",
        sender: "support",
        timestamp: new Date(),
        type: "text",
        quickReplies: [
          { text: "Payments", value: "payments" },
          { text: "Releases", value: "releases" },
          { text: "Account", value: "account" },
          { text: "OAC", value: "oac" },
          { text: "Content ID", value: "content_id" },
          { text: "Other", value: "other" }
        ]
      }])
      return
    }

    const categoryMessages: Record<string, string> = {
      payments: "I'll help you with payment-related issues. Could you please describe what specific payment issue you're experiencing?",
      releases: "I'll assist you with your release. What would you like to know about your release?",
      account: "I'll help you with your account. What account-related issue are you facing?",
      oac: "I'll help you with OAC (One Artist Connect). What specific OAC issue would you like to discuss?",
      content_id: "I'll help you with Content ID. What Content ID issue are you experiencing?",
      other: "I'll help you with your issue. Could you please describe what you need assistance with?"
    }

    setChatState({ stage: "category", category: value })
    addSupportMessage(categoryMessages[value])
  }

  const handleSubmitTicket = () => {
    setTicketSubmitted(true)
    addSupportMessage("Thank you for submitting your ticket. I've gathered all the necessary information and our team will be in touch with you shortly.", [
      { text: "Close Chat", value: "close" }
    ])
    setShowConfirmation(true)
  }

  const addSupportMessage = (content: string, quickReplies?: { text: string; value: string }[]) => {
    setIsTyping(true)
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        content,
        sender: "support",
        timestamp: new Date(),
        type: "text",
        quickReplies
      }])
      setIsTyping(false)
    }, 1000)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      if (attachments.length + newFiles.length <= 5) {
        setAttachments(prev => [...prev, ...newFiles])
      }
    }
  }

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index))
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() && attachments.length === 0) return

    const newMessage: MessageType = {
      id: messages.length + 1,
      content: message,
      sender: "user",
      timestamp: new Date(),
      type: "text",
      attachments: attachments.map(file => ({
        name: file.name,
        size: file.size,
        type: file.type
      }))
    }

    setMessages(prev => [...prev, newMessage])
    setMessage("")
    setAttachments([])

    // Simulate support response based on chat state
    if (chatState.stage === "category") {
      setTimeout(() => {
        addSupportMessage("Thank you for providing those details. I'll help you resolve this. Is there anything else you'd like to add?", [
          { text: "Submit Ticket", value: "submit" }
        ])
        setChatState(prev => ({ ...prev, stage: "details" }))
      }, 1500)
    } else if (chatState.stage === "details" && !ticketSubmitted) {
      setTimeout(() => {
        addSupportMessage("I have all the information I need. Would you like to submit your ticket now?", [
          { text: "Submit Ticket", value: "submit" }
        ])
      }, 1500)
    }
  }

  const dummyTickets = [
    {
      subject: "Urgent: Copyright Infringement Notification Regarding Your Content (741012394243)",
      tags: ["Infringment", "High Priority"],
      timeAgo: "9 hours ago",
      date: "02 Jun 2025 07:38 AM",
      ticketId: "#1748830086264",
    },
    {
      subject: "Urgent: Copyright Infringement Notification Regarding Your Content (741012394243)",
      tags: ["Infringment", "High Priority"],
      timeAgo: "9 hours ago",
      date: "02 Jun 2025 07:36 AM",
      ticketId: "#1748829973854",
    },
    {
      subject: "Urgent: Copyright Infringement Notification Regarding Your Content (741012394243)",
      tags: ["Infringment", "High Priority"],
      timeAgo: "16 days ago",
      date: "22 May 2025 09:30 PM",
      ticketId: "#1747480149891",
    },
    {
      subject: "Urgent: Copyright Infringement Notification Regarding Your Content (751451477377)",
      tags: ["Infringment", "High Priority"],
      timeAgo: "a month ago",
      date: "26 May 2025 09:49 AM",
      ticketId: "#1745126335085",
    },
  ]

  return (
    <div className="container mx-auto py-6">
      
      <h2 className="text-lg font-semibold">Support</h2>
          <p>Get help and contact support</p>
      
          <div className="flex justify-end mb-4">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setOpen(true)}>+ Create Ticket</Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl h-[600px] flex flex-col">
                <DialogHeader className="border-b pb-4">
                  <DialogTitle>Support Chat</DialogTitle>
                  <DialogDescription>Chat with our support team</DialogDescription>
                </DialogHeader>
                
                {/* Chat Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={cn(
                        "flex",
                        msg.sender === "user" ? "justify-end" : "justify-start"
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-[70%] rounded-lg px-4 py-2",
                          msg.sender === "user"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-900"
                        )}
                      >
                        <p>{msg.content}</p>
                        
                        {/* Attachments */}
                        {msg.attachments && msg.attachments.length > 0 && (
                          <div className="mt-2 space-y-2">
                            {msg.attachments.map((file, index) => (
                              <div key={index} className="flex items-center gap-2 bg-white/10 p-2 rounded">
                                <Paperclip className="h-4 w-4" />
                                <span className="text-sm truncate">{file.name}</span>
                                <span className="text-xs">({(file.size / 1024).toFixed(1)}KB)</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Quick Replies */}
                        {msg.quickReplies && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {msg.quickReplies.map((reply, index) => (
                              <Button
                                key={index}
                                variant="outline"
                                size="sm"
                                className="bg-white/10 hover:bg-white/20"
                                onClick={() => handleQuickReply(reply.value)}
                              >
                                {reply.text}
                              </Button>
                            ))}
                          </div>
                        )}

                        <span className="text-xs opacity-70 mt-1 block">
                          {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  ))}
                  
                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 rounded-lg px-4 py-2">
                        <div className="flex space-x-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="text-sm text-gray-500">Support is typing...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Message Input Area */}
                <div className="border-t p-4">
                  {/* Attachments Preview */}
                  {attachments.length > 0 && (
                    <div className="mb-2 flex flex-wrap gap-2">
                      {attachments.map((file, index) => (
                        <div key={index} className="flex items-center gap-2 bg-gray-100 p-2 rounded">
                          <Paperclip className="h-4 w-4" />
                          <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0"
                            onClick={() => removeAttachment(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder={ticketSubmitted ? "You can continue chatting while waiting for our response..." : "Type your message..."}
                        className="pr-12"
                        disabled={ticketSubmitted}
                      />
                      {!ticketSubmitted && (
                        <label className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer">
                          <Paperclip className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                          <input
                            type="file"
                            multiple
                            className="hidden"
                            onChange={handleFileSelect}
                            accept="*/*"
                          />
                        </label>
                      )}
                    </div>
                    <Button type="submit" size="icon" disabled={ticketSubmitted}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                  {!ticketSubmitted && (
                    <div className="text-xs text-gray-500 mt-1">
                      You can attach up to 5 files (5MB each)
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
          {/* Support content will go here */}
          <div className="w-full max-w-full px-2 mx-auto">
            <style>{`
              .hide-scrollbar::-webkit-scrollbar { display: none; }
              .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
            <div className="hide-scrollbar overflow-x-auto" style={{ maxWidth: '100%' }}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead>Tags</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Ticket ID</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dummyTickets.map((ticket, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium text-white-900">{ticket.subject}</TableCell>
                      <TableCell>
                        {ticket.tags.map((tag, i) => (
                          <span key={i} className={`inline-block px-2 py-1 mr-2 rounded text-xs font-semibold ${tag === "High Priority" ? "bg-red-100 text-red-600 border border-red-200" : "bg-green-100 text-green-600 border my-2 border-green-200"}`}>{tag}</span>
                        ))}
                      </TableCell>
                      <TableCell className="text-white-700">{ticket.timeAgo}</TableCell>
                      <TableCell className="text-white-700">{ticket.date}</TableCell>
                      <TableCell className="text-white-700">{ticket.ticketId}</TableCell>
                      <TableCell className="text-right">
                        <Button size="sm">OPEN</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
      
      {/* Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ticket Submitted Successfully</DialogTitle>
            <DialogDescription>
              Thank you for submitting your ticket. Here's what happens next:
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-start space-x-3">
              <Clock className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <h4 className="font-medium">Within 2 Hours</h4>
                <p className="text-sm text-gray-500">Our support team will call you to discuss your issue in detail</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Phone className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <h4 className="font-medium">Phone Call</h4>
                <p className="text-sm text-gray-500">Please keep your phone nearby for our support team's call</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle2 className="h-5 w-5 text-purple-500 mt-0.5" />
              <div>
                <h4 className="font-medium">Within 24 Hours</h4>
                <p className="text-sm text-gray-500">You will receive a resolution or update on your ticket</p>
              </div>
            </div>
          </div>
          <DialogFooter className="sm:justify-start">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setShowConfirmation(false)
                setOpen(false)
              }}
            >
              Close
            </Button>
            <Button
              type="button"
              onClick={() => {
                setShowConfirmation(false)
              }}
            >
              Continue Chat
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 