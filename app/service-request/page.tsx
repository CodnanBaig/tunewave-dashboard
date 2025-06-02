"use client"

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

export default function ServiceRequestPage() {
  const [open, setOpen] = useState(false)
  const [type, setType] = useState("")
  const [url, setUrl] = useState("")
  const [openArtistDialog, setOpenArtistDialog] = useState(false)
  const [openContentIdDialog, setOpenContentIdDialog] = useState(false)
  const [openClaimListDialog, setOpenClaimListDialog] = useState(false)
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold">Youtube Requests</h2>
      </div>
      <Tabs defaultValue="claim-list">
        <TabsList className="mb-4">
          <TabsTrigger value="claim-list">Claim List</TabsTrigger>
          <TabsTrigger value="content-id">Content ID</TabsTrigger>
          <TabsTrigger value="artist-channel">Artist Channel</TabsTrigger>
          <TabsTrigger value="channel-whitelist">Channel Whitelist</TabsTrigger>
        </TabsList>
        <TabsContent value="claim-list">
          <div className="flex items-center justify-between mb-4">
            <Input placeholder="Search this list..." className="w-72" />
            <Button onClick={() => setOpenClaimListDialog(true)}>+ Add New</Button>
          </div>
          <div className="bg-darkrounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>URL</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>CMS</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>CreatedAt</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12">
                    <div className="flex flex-col items-center justify-center">
                      <svg width="40" height="40" fill="none" viewBox="0 0 40 40" className="mb-2 text-muted-foreground"><rect width="40" height="40" rx="8" fill="#F3F4F6"/><path d="M13 18.5C13 17.1193 14.1193 16 15.5 16H24.5C25.8807 16 27 17.1193 27 18.5V25.5C27 26.8807 25.8807 28 24.5 28H15.5C14.1193 28 13 26.8807 13 25.5V18.5Z" stroke="#A1A1AA" strokeWidth="2"/><path d="M17 14V16" stroke="#A1A1AA" strokeWidth="2" strokeLinecap="round"/><path d="M23 14V16" stroke="#A1A1AA" strokeWidth="2" strokeLinecap="round"/></svg>
                      <span className="text-muted-foreground">No data</span>
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          <Dialog open={openClaimListDialog} onOpenChange={setOpenClaimListDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Claim</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block mb-1 font-medium"><span className="text-red-500 mr-1">*</span>Type</label>
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Audio">Audio</SelectItem>
                      <SelectItem value="Video">Video</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block mb-1 font-medium"><span className="text-red-500 mr-1">*</span>URL</label>
                  <Input required placeholder="Enter URL" />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={() => setOpenClaimListDialog(false)} type="button">Cancel</Button>
                <Button type="submit">Submit</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>
        <TabsContent value="content-id">
          <div className="flex items-center justify-between mb-4">
            <Input placeholder="Search this list..." className="w-72" />
            <Button onClick={() => setOpenContentIdDialog(true)}>+ Add New</Button>
          </div>
          <div className="bg-darkrounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>UPC/EAN</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Youtube URL</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>CreatedAt</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12">
                    <div className="flex flex-col items-center justify-center">
                      <svg width="40" height="40" fill="none" viewBox="0 0 40 40" className="mb-2 text-muted-foreground"><rect width="40" height="40" rx="8" fill="#F3F4F6"/><path d="M13 18.5C13 17.1193 14.1193 16 15.5 16H24.5C25.8807 16 27 17.1193 27 18.5V25.5C27 26.8807 25.8807 28 24.5 28H15.5C14.1193 28 13 26.8807 13 25.5V18.5Z" stroke="#A1A1AA" strokeWidth="2"/><path d="M17 14V16" stroke="#A1A1AA" strokeWidth="2" strokeLinecap="round"/><path d="M23 14V16" stroke="#A1A1AA" strokeWidth="2" strokeLinecap="round"/></svg>
                      <span className="text-muted-foreground">No data</span>
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          <Dialog open={openContentIdDialog} onOpenChange={setOpenContentIdDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Content ID</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block mb-1 font-medium"><span className="text-red-500 mr-1">*</span>Type</label>
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Audio">Audio</SelectItem>
                      <SelectItem value="Video">Video</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block mb-1 font-medium"><span className="text-red-500 mr-1">*</span>UPC/EAN</label>
                  <Input required placeholder="Enter UPC/EAN" />
                </div>
                <div>
                  <label className="block mb-1 font-medium"><span className="text-red-500 mr-1">*</span>Youtube URL</label>
                  <Input required placeholder="Enter Youtube URL" />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={() => setOpenContentIdDialog(false)} type="button">Cancel</Button>
                <Button type="submit">Submit</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>
        <TabsContent value="artist-channel">
          <div className="flex items-center justify-between mb-4">
            <Input placeholder="Search this list..." className="w-72" />
            <Button onClick={() => setOpenArtistDialog(true)}>+ Add New</Button>
          </div>
          <div className="bg-darkrounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Channel Link</TableHead>
                  <TableHead>Topic Link</TableHead>
                  <TableHead>UPC/EAN</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>CreatedAt</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12">
                    <div className="flex flex-col items-center justify-center">
                      <svg width="40" height="40" fill="none" viewBox="0 0 40 40" className="mb-2 text-muted-foreground"><rect width="40" height="40" rx="8" fill="#F3F4F6"/><path d="M13 18.5C13 17.1193 14.1193 16 15.5 16H24.5C25.8807 16 27 17.1193 27 18.5V25.5C27 26.8807 25.8807 28 24.5 28H15.5C14.1193 28 13 26.8807 13 25.5V18.5Z" stroke="#A1A1AA" strokeWidth="2"/><path d="M17 14V16" stroke="#A1A1AA" strokeWidth="2" strokeLinecap="round"/><path d="M23 14V16" stroke="#A1A1AA" strokeWidth="2" strokeLinecap="round"/></svg>
                      <span className="text-muted-foreground">No data</span>
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          <Dialog open={openArtistDialog} onOpenChange={setOpenArtistDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Artist Channel</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block mb-1 font-medium"> <span className="text-red-500 mr-1">*</span>Channel Link</label>
                  <Input required placeholder="Enter Channel Link" />
                </div>
                <div>
                  <label className="block mb-1 font-medium"> <span className="text-red-500 mr-1">*</span>Topic Link</label>
                  <Input required placeholder="Enter Topic Link" />
                </div>
                <div>
                  <label className="block mb-1 font-medium"> <span className="text-red-500 mr-1">*</span>UPC1</label>
                  <Input required placeholder="Enter UPC1" />
                </div>
                <div>
                  <label className="block mb-1 font-medium"> <span className="text-red-500 mr-1">*</span>UPC2</label>
                  <Input required placeholder="Enter UPC2" />
                </div>
                <div>
                  <label className="block mb-1 font-medium"> <span className="text-red-500 mr-1">*</span>UPC3</label>
                  <Input required placeholder="Enter UPC3" />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={() => setOpenArtistDialog(false)} type="button">Cancel</Button>
                <Button type="submit">Submit</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>
        <TabsContent value="channel-whitelist">
          <div className="flex items-center justify-between mb-4">
            <Input placeholder="Search this list..." className="w-72" />
            <Button onClick={() => setOpen(true)}>+ Add New</Button>
          </div>
          <div className="bg-darkrounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>URL</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>CreatedAt</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-12">
                    <div className="flex flex-col items-center justify-center">
                      <svg width="40" height="40" fill="none" viewBox="0 0 40 40" className="mb-2 text-muted-foreground"><rect width="40" height="40" rx="8" fill="#F3F4F6"/><path d="M13 18.5C13 17.1193 14.1193 16 15.5 16H24.5C25.8807 16 27 17.1193 27 18.5V25.5C27 26.8807 25.8807 28 24.5 28H15.5C14.1193 28 13 26.8807 13 25.5V18.5Z" stroke="#A1A1AA" strokeWidth="2"/><path d="M17 14V16" stroke="#A1A1AA" strokeWidth="2" strokeLinecap="round"/><path d="M23 14V16" stroke="#A1A1AA" strokeWidth="2" strokeLinecap="round"/></svg>
                      <span className="text-muted-foreground">No data</span>
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Channel Whitelist</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block mb-1 font-medium">Type</label>
                  <Select value={type} onValueChange={setType}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Facebook">Facebook</SelectItem>
                      <SelectItem value="Youtube">Youtube</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block mb-1 font-medium">URL</label>
                  <Input value={url} onChange={e => setUrl(e.target.value)} placeholder="Enter URL" />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={() => setOpen(false)} type="button">Cancel</Button>
                <Button type="submit">Submit</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>
      </Tabs>
    </div>
  )
} 