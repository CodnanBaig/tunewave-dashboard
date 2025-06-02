"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"

export default function SupportPage() {
  const [open, setOpen] = useState(false)
  const [files, setFiles] = useState<FileList | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length <= 5) {
      setFiles(e.target.files)
    } else {
      // Optionally handle error for too many files
      setFiles(null)
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
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Ticket</DialogTitle>
                  <DialogDescription>Fill in the details below to create a new support ticket.</DialogDescription>
                </DialogHeader>
                <form className="space-y-4" onSubmit={e => { e.preventDefault(); setOpen(false); }}>
                  <div>
                    <label className="block mb-1 font-medium">Subject<span className="text-red-500">*</span></label>
                    <Input required placeholder="Subject" />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">Description<span className="text-red-500">*</span></label>
                    <Textarea required placeholder="Describe your issue..." />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">Files</label>
                    <Input type="file" multiple accept="*" onChange={handleFileChange} />
                    <div className="text-xs text-muted-foreground">Max: 5 files, 5MB each</div>
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">Priority<span className="text-red-500">*</span></label>
                    <Select required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button type="submit">Save</Button>
                  </DialogFooter>
                </form>
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
      
    </div>
  )
} 