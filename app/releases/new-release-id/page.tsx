"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, ChevronDown, ChevronUp, ExternalLink, Edit, Music } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

// Mock data for a newly created release
const mockNewRelease = {
  id: "new-release-id",
  title: "Summer Vibes EP",
  releaseDate: "2023-08-15",
  label: "Label 1",
  artwork: "/abstract-soundscape.png",
  status: "draft",
  tracks: [
    {
      id: "t1",
      name: "Sunny Days",
      language: "English",
      genre: "Pop",
      subGenre: "Indie Pop",
      mood: "Happy",
      explicit: false,
      isrc: "USRC12345678",
      artists: {
        primary: [
          {
            name: "John Smith",
            legalName: "John Smith",
            instagram: "https://instagram.com/johnsmith",
            spotify: "https://open.spotify.com/artist/123",
          },
        ],
        featuring: [
          {
            name: "DJ Summer",
            legalName: "Sarah Johnson",
            instagram: "https://instagram.com/djsummer",
            spotify: "https://open.spotify.com/artist/456",
          },
        ],
        lyricists: [
          {
            name: "Lyric Master",
            legalName: "Lisa Davis",
            instagram: "https://instagram.com/lyricmaster",
          },
        ],
        composers: [
          {
            name: "Melody Maker",
            legalName: "Michael Brown",
            spotify: "https://open.spotify.com/artist/789",
          },
        ],
        producers: [
          {
            name: "Beat Producer",
            legalName: "Brian Wilson",
            youtube: "https://youtube.com/channel/123",
          },
        ],
      },
    },
    {
      id: "t2",
      name: "Beach Party",
      language: "English",
      genre: "Dance",
      subGenre: "House",
      mood: "Energetic",
      explicit: true,
      isrc: "USRC87654321",
      artists: {
        primary: [
          {
            name: "John Smith",
            legalName: "John Smith",
            instagram: "https://instagram.com/johnsmith",
            spotify: "https://open.spotify.com/artist/123",
          },
        ],
        featuring: [],
        lyricists: [
          {
            name: "Lyric Master",
            legalName: "Lisa Davis",
            instagram: "https://instagram.com/lyricmaster",
          },
        ],
        composers: [
          {
            name: "John Smith",
            legalName: "John Smith",
            spotify: "https://open.spotify.com/artist/123",
          },
        ],
        producers: [
          {
            name: "Beat Producer",
            legalName: "Brian Wilson",
            youtube: "https://youtube.com/channel/123",
          },
        ],
      },
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

export default function NewReleasePage() {
  const router = useRouter()
  const [expandedTracks, setExpandedTracks] = useState<Record<string, boolean>>({})

  const toggleTrackExpand = (trackId: string) => {
    setExpandedTracks((prev) => ({
      ...prev,
      [trackId]: !prev[trackId],
    }))
  }

  const formattedDate = format(new Date(mockNewRelease.releaseDate), "MMMM d, yyyy")
  const canEdit = mockNewRelease.status === "draft"

  return (
    <div className="container py-8">
      <Button
        variant="ghost"
        onClick={() => router.push("/releases")}
        className="mb-6 group hover:bg-muted/60 transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Back to Releases
      </Button>

      <div className="grid gap-6 md:grid-cols-[300px_1fr]">
        <div>
          <Card className="overflow-hidden border shadow-md bg-card/50 backdrop-blur-sm">
            <div className="aspect-square relative">
              <Image
                src={mockNewRelease.artwork || "/placeholder.svg"}
                alt={mockNewRelease.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            </div>
            <CardContent className="p-4">
              <Badge
                className={cn(
                  "mb-2 font-medium shadow-sm",
                  statusColors[mockNewRelease.status as keyof typeof statusColors],
                )}
              >
                {statusLabels[mockNewRelease.status as keyof typeof statusLabels]}
              </Badge>
              <h1 className="text-2xl font-bold tracking-tight">{mockNewRelease.title}</h1>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Release Date:</span>
                  <span className="font-medium">{formattedDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Label:</span>
                  <span className="font-medium">{mockNewRelease.label}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tracks:</span>
                  <span className="font-medium">{mockNewRelease.tracks.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 space-y-3">
            <Button
              className="w-full group"
              variant="outline"
              onClick={() => router.push(`/releases/${mockNewRelease.id}/edit`)}
            >
              <Edit className="mr-2 h-4 w-4 transition-transform group-hover:rotate-12" />
              Edit Release
            </Button>

            <Button className="w-full bg-gradient-to-r from-primary to-primary/80 hover:shadow-md transition-all">
              Submit for Review
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="border shadow-md bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-4 border-b bg-muted/30">
              <CardTitle className="flex items-center gap-2">
                <Music className="h-5 w-5 text-primary" />
                Tracks
              </CardTitle>
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
                  {mockNewRelease.tracks.map((track) => (
                    <>
                      <TableRow key={track.id}>
                        <TableCell className="font-medium">{track.name}</TableCell>
                        <TableCell>{track.language}</TableCell>
                        <TableCell>{track.genre}</TableCell>
                        <TableCell>{track.explicit ? "Yes" : "No"}</TableCell>
                        <TableCell>{track.artists.primary.map((a) => a.name).join(", ")}</TableCell>
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
                            <div className="py-2 space-y-4">
                              {/* Primary Artists */}
                              <div>
                                <h4 className="font-medium mb-2">Primary Artists</h4>
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
                                    {track.artists.primary.map((artist, index) => (
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

                              {/* Featuring Artists (if any) */}
                              {track.artists.featuring.length > 0 && (
                                <div>
                                  <h4 className="font-medium mb-2">Featuring Artists</h4>
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
                                      {track.artists.featuring.map((artist, index) => (
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
                              )}

                              {/* Other Contributors */}
                              <div>
                                <h4 className="font-medium mb-2">Other Contributors</h4>
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>Name</TableHead>
                                      <TableHead>Legal Name</TableHead>
                                      <TableHead>Role</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {track.artists.lyricists.map((artist, index) => (
                                      <TableRow key={`lyricist-${index}`}>
                                        <TableCell>{artist.name}</TableCell>
                                        <TableCell>{artist.legalName}</TableCell>
                                        <TableCell>Lyricist</TableCell>
                                      </TableRow>
                                    ))}
                                    {track.artists.composers.map((artist, index) => (
                                      <TableRow key={`composer-${index}`}>
                                        <TableCell>{artist.name}</TableCell>
                                        <TableCell>{artist.legalName}</TableCell>
                                        <TableCell>Composer</TableCell>
                                      </TableRow>
                                    ))}
                                    {track.artists.producers.map((artist, index) => (
                                      <TableRow key={`producer-${index}`}>
                                        <TableCell>{artist.name}</TableCell>
                                        <TableCell>{artist.legalName}</TableCell>
                                        <TableCell>Producer</TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </div>

                              {/* Track Details */}
                              <div>
                                <h4 className="font-medium mb-2">Track Details</h4>
                                <div className="grid grid-cols-2 gap-4 p-4 bg-card/50 rounded-xl border shadow-sm">
                                  <div>
                                    <p className="text-sm text-muted-foreground mb-1">Sub-Genre</p>
                                    <p className="font-medium">{track.subGenre}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground mb-1">Mood</p>
                                    <p className="font-medium">{track.mood}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground mb-1">ISRC</p>
                                    <p className="font-medium">{track.isrc}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground mb-1">Explicit</p>
                                    <p className="font-medium">
                                      {track.explicit ? (
                                        <span className="inline-flex items-center text-red-500">Yes</span>
                                      ) : (
                                        <span className="inline-flex items-center text-green-500">No</span>
                                      )}
                                    </p>
                                  </div>
                                </div>
                              </div>
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
        </div>
      </div>
    </div>
  )
}
