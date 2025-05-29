"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, ChevronDown, ChevronUp, ExternalLink, Edit, AlertTriangle } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Mock data for a single release
const mockRelease = {
  id: "1",
  title: "Summer Vibes",
  releaseDate: "2023-06-15",
  label: "SP Music Zone",
  artwork: "/placeholder-ko8hn.png",
  status: "draft",
  tracks: [
    {
      id: "t1",
      name: "Sunny Days",
      language: "English",
      genre: "Pop",
      explicit: false,
      artists: [
        {
          name: "John Smith",
          legalName: "John Smith",
          instagram: "https://instagram.com/johnsmith",
          spotify: "https://open.spotify.com/artist/123",
        },
        {
          name: "DJ Summer",
          legalName: "Sarah Johnson",
          instagram: "https://instagram.com/djsummer",
          spotify: "https://open.spotify.com/artist/456",
        },
      ],
    },
    {
      id: "t2",
      name: "Beach Party",
      language: "English",
      genre: "Dance",
      explicit: true,
      artists: [
        {
          name: "John Smith",
          legalName: "John Smith",
          instagram: "https://instagram.com/johnsmith",
          spotify: "https://open.spotify.com/artist/123",
        },
      ],
    },
  ],
}

const statusColors = {
  draft: "bg-muted text-muted-foreground",
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  "under-review": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  verified: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  live: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  takedown: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
}

const statusLabels = {
  draft: "Draft",
  pending: "Pending",
  "under-review": "Under Review",
  verified: "Verified",
  live: "Live",
  takedown: "Takedown",
}

export default function ReleasePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [expandedTracks, setExpandedTracks] = useState<Record<string, boolean>>({})
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false)
  const [releaseStatus, setReleaseStatus] = useState(mockRelease.status)

  const toggleTrackExpand = (trackId: string) => {
    setExpandedTracks((prev) => ({
      ...prev,
      [trackId]: !prev[trackId],
    }))
  }

  const handleSubmitForReview = () => {
    // In a real app, this would call an API to update the status
    console.log("Submitting release for review")
    setReleaseStatus("pending")
    setIsSubmitDialogOpen(false)
  }

  const formattedDate = format(new Date(mockRelease.releaseDate), "MMMM d, yyyy")
  const canEdit = releaseStatus === "draft"
  const canSubmit = releaseStatus === "draft"

  return (
    <div className="container py-8">
      <Button variant="ghost" onClick={() => router.push("/releases")} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Releases
      </Button>

      <div className="grid gap-6 md:grid-cols-[300px_1fr]">
        <div>
          <Card>
            <div className="aspect-square relative">
              <Image
                src={mockRelease.artwork || "/placeholder.svg"}
                alt={mockRelease.title}
                fill
                className="object-cover"
              />
            </div>
            <CardContent className="p-4">
              <Badge className={cn("mb-2", statusColors[releaseStatus as keyof typeof statusColors])}>
                {statusLabels[releaseStatus as keyof typeof statusLabels]}
              </Badge>
              <h1 className="text-2xl font-bold">{mockRelease.title}</h1>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Release Date:</span>
                  <span>{formattedDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Label:</span>
                  <span>{mockRelease.label}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tracks:</span>
                  <span>{mockRelease.tracks.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 space-y-3">
            {canEdit && (
              <Button className="w-full" variant="outline" onClick={() => router.push(`/releases/${params.id}/edit`)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Release
              </Button>
            )}

            {canSubmit && (
              <Dialog open={isSubmitDialogOpen} onOpenChange={setIsSubmitDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full">Submit for Review</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Submit Release for Review</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to submit this release for review? Once submitted, you won't be able to make
                      further changes.
                    </DialogDescription>
                  </DialogHeader>

                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Important</AlertTitle>
                    <AlertDescription>
                      Please ensure all information is correct. After submission, the release will be reviewed by our
                      team.
                    </AlertDescription>
                  </Alert>

                  <DialogFooter className="mt-4">
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button onClick={handleSubmitForReview}>Submit</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}

            {releaseStatus === "pending" && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Under Review</AlertTitle>
                <AlertDescription>
                  Your release is being reviewed by our team. This process typically takes 1-2 business days.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tracks</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Track Name</TableHead>
                    <TableHead>Language</TableHead>
                    <TableHead>Genre</TableHead>
                    <TableHead>Explicit</TableHead>
                    <TableHead>Artists</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockRelease.tracks.map((track) => (
                    <>
                      <TableRow key={track.id}>
                        <TableCell className="font-medium">{track.name}</TableCell>
                        <TableCell>{track.language}</TableCell>
                        <TableCell>{track.genre}</TableCell>
                        <TableCell>{track.explicit ? "Yes" : "No"}</TableCell>
                        <TableCell>{track.artists.map((a) => a.name).join(", ")}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" onClick={() => toggleTrackExpand(track.id)}>
                            {expandedTracks[track.id] ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                      {expandedTracks[track.id] && (
                        <TableRow className="bg-muted/50">
                          <TableCell colSpan={6}>
                            <div className="py-2">
                              <h4 className="font-medium mb-2">Artist Details</h4>
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Artist Name</TableHead>
                                    <TableHead>Legal Name</TableHead>
                                    <TableHead>Instagram</TableHead>
                                    <TableHead>Spotify</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {track.artists.map((artist, index) => (
                                    <TableRow key={index}>
                                      <TableCell>{artist.name}</TableCell>
                                      <TableCell>{artist.legalName}</TableCell>
                                      <TableCell>
                                        {artist.instagram && (
                                          <a
                                            href={artist.instagram}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center text-primary hover:underline"
                                          >
                                            View <ExternalLink className="ml-1 h-3 w-3" />
                                          </a>
                                        )}
                                      </TableCell>
                                      <TableCell>
                                        {artist.spotify && (
                                          <a
                                            href={artist.spotify}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center text-primary hover:underline"
                                          >
                                            View <ExternalLink className="ml-1 h-3 w-3" />
                                          </a>
                                        )}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {releaseStatus !== "draft" && (
            <Card>
              <CardHeader>
                <CardTitle>Release Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <div className="w-0.5 h-16 bg-border"></div>
                    </div>
                    <div>
                      <h3 className="font-medium">Draft Created</h3>
                      <p className="text-sm text-muted-foreground">{format(new Date("2023-12-15"), "MMMM d, yyyy")}</p>
                      <p className="text-sm mt-1">Initial release draft was created</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <div className={cn("w-0.5 h-16 bg-border", releaseStatus === "pending" && "opacity-30")}></div>
                    </div>
                    <div>
                      <h3 className="font-medium">Submitted for Review</h3>
                      <p className="text-sm text-muted-foreground">{format(new Date(), "MMMM d, yyyy")}</p>
                      <p className="text-sm mt-1">Release submitted for review by our team</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div
                        className={cn(
                          "w-8 h-8 rounded-full border flex items-center justify-center",
                          releaseStatus !== "pending"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground",
                        )}
                      >
                        {releaseStatus !== "pending" ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        ) : (
                          <span>3</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <h3 className={cn("font-medium", releaseStatus === "pending" && "text-muted-foreground")}>
                        Verification Complete
                      </h3>
                      <p className="text-sm text-muted-foreground">Pending</p>
                      <p className={cn("text-sm mt-1", releaseStatus === "pending" && "text-muted-foreground")}>
                        Release verification and quality check
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
