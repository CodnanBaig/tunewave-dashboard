"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, ChevronDown, ChevronUp, ExternalLink, Edit, AlertTriangle, Music } from "lucide-react"
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
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"

// Define types for our data structures
interface Artist {
  name: string
  legalName: string
  instagram?: string
  spotify?: string
  youtube?: string
}

interface AlbumArtist {
  id: number
  artistName: string
}

interface Track {
  id: string
  name: string
  language: string
  genre: string
  subGenre?: string
  mood?: string
  explicit: boolean
  isrc?: string
  artists: {
    primary: Artist[]
    featuring: Artist[]
    lyricists: Artist[]
    composers: Artist[]
    producers: Artist[]
  }
}

interface Release {
  id: string
  title: string
  releaseDate: string
  label: string
  artwork: string
  status: "draft" | "pending" | "under-review" | "verified" | "live" | "takedown"
  tracks: Track[]
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

export default function ReleasePage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [release, setRelease] = useState<Release | null>(null)
  const [albumArtists, setAlbumArtists] = useState<AlbumArtist[]>([])
  const [album, setAlbum] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedTracks, setExpandedTracks] = useState<Record<string, boolean>>({})
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false)
  const [albumId, setAlbumId] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const fetchReleaseData = async () => {
      if (!id) {
        setError("No release ID provided.")
        setLoading(false)
        return
      }

      const fetchRelease = async () => {
        try {
          const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
          const userId = typeof window !== 'undefined' ? localStorage.getItem('id') : null
          
          // Debug environment variables and auth
          console.log("🔍 Debug Info:", {
            apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
            clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
            hasToken: !!token,
            userId: userId,
            releaseId: id
          })
          
          // Try to fetch with admin endpoint first
          let response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/getreleasebyid?id=${id}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
              'Client-ID': process.env.NEXT_PUBLIC_CLIENT_ID || '',
              ...(token && { 'Authorization': `Bearer ${token}` }),
            },
          })

          // If admin endpoint fails, try user-specific endpoint
          if (response.status === 422 && userId) {
            console.log("Admin access denied, trying user-specific endpoint...")
            response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/getreleasebyid?id=${id}&userId=${userId}`, {
              method: 'GET',
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json',
                'Client-ID': process.env.NEXT_PUBLIC_CLIENT_ID || '',
                ...(token && { 'Authorization': `Bearer ${token}` }),
              },
            })
          }

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            console.error("API Error Response:", {
              status: response.status,
              statusText: response.statusText,
              errorData,
            })
            // Check for the specific error and customize the message
            if (errorData.error?.includes("Cannot read properties of null (reading 'labelId')")) {
              throw new Error("There seems to be an issue with this release's data, specifically with its label information. Please contact support if this issue persists.")
            }
            throw new Error(errorData.message || `Request failed with status ${response.status}`)
          }

          const data = await response.json()
          
          // Debug: Log the raw data structure
          console.log("Raw backend data:", data)
          console.log("Response status:", response.status)
          console.log("Response headers:", Object.fromEntries(response.headers.entries()))
          
          const releaseData = data.release || data.data || data
          
          if (Array.isArray(releaseData) && releaseData.length > 0) {
            const backendReleases = releaseData
            const firstRelease = backendReleases[0]
            const album = firstRelease.album
            setAlbum(album)
            const albumId = firstRelease.albumId
            setAlbumId(albumId)
            
            // Debug: Log album release status ID
            console.log("Album Release Status ID:", album.releaseStatusId)
            
            const transformedRelease: Release = {
              id: firstRelease.id,
              title: album?.albumTitle || firstRelease.songTitle || "Untitled",
              releaseDate: album?.releaseDate || firstRelease.createdAt || new Date().toISOString(),
              label: album?.label?.labelName || "Unknown Label",
              artwork: album?.artworkFile || album?.artworkUpload || "/placeholder.svg",
              status: mapBackendStatusIdToFrontend(album?.releaseStatusId),
              tracks: transformTracks(backendReleases)
            }
            
            setRelease(transformedRelease)

            if (albumId) {
              // Fetch artists after fetching release
              try {
                const artistsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/getAllArtistFromAlbumId?albumId=${albumId}`, {
                  method: 'GET',
                  credentials: 'include',
                  headers: {
                    'Content-Type': 'application/json',
                    'Client-ID': process.env.NEXT_PUBLIC_CLIENT_ID || '',
                    ...(token && { 'Authorization': `Bearer ${token}` }),
                  },
                });

                if (artistsResponse.ok) {
                  const artistsData = await artistsResponse.json();
                  if (artistsData && artistsData.artists) {
                    setAlbumArtists(artistsData.artists.map((item: any) => item.artist));
                  }
                } else {
                  console.error("Failed to fetch album artists. Status:", artistsResponse.status);
                }
              } catch (err) {
                console.error("Error fetching album artists:", err);
              }
            }
          } else {
            setError("Release not found")
          }
        } catch (err) {
          console.error("Error fetching release:", err)
          setError(err instanceof Error ? err.message : "An unknown error occurred")
        }
      }
      
      setLoading(true);
      await fetchRelease();
      setLoading(false);
    }

    fetchReleaseData()
  }, [id])

  // Helper function to transform backend status ID to frontend status
  const mapBackendStatusIdToFrontend = (backendStatusId?: number): Release['status'] => {
    if (!backendStatusId) return 'draft'

    // Based on the status table image
    if (backendStatusId === 1) return 'draft'
    if (backendStatusId === 2) return 'under-review'
    if (backendStatusId >= 3 && backendStatusId <= 5) return 'takedown' // Rejected statuses
    if (backendStatusId >= 6 && backendStatusId <= 14) return 'pending' // Correction Required statuses
    if (backendStatusId === 15) return 'verified'
    if (backendStatusId === 16) return 'live'
    if (backendStatusId >= 17 && backendStatusId <= 18) return 'takedown' // Takedown statuses
    if (backendStatusId === 19) return 'pending'

    return 'draft' // Default fallback
  }

  // Helper function to transform tracks data
  const transformTracks = (backendReleases: any[]): Track[] => {
    const tracks: Track[] = []
    
    if (!Array.isArray(backendReleases)) {
      console.warn("backendReleases is not an array:", backendReleases)
      return tracks
    }
    
    backendReleases.forEach(backendRelease => {
      if (!backendRelease) {
        console.warn("Skipping null/undefined backendRelease")
        return
      }
      
      const artists: Track['artists'] = {
        primary: [],
        featuring: [],
        lyricists: [],
        composers: [],
        producers: []
      };

      if (backendRelease.releaseArtist && Array.isArray(backendRelease.releaseArtist)) {
        backendRelease.releaseArtist.forEach((ra: any) => {
          if (!ra.artist || !ra.artistType) return;
          
          const artist: Artist = {
            name: ra.artist.artistName || "Unknown Artist",
            legalName: ra.artist.legalName || ra.artist.artistName || "Unknown Artist",
            instagram: ra.artist.instagramURL || undefined,
            spotify: ra.artist.spotifyURL || undefined,
            youtube: ra.artist.youtubeURL || undefined
          };

          switch(ra.artistType.artistTypeName) {
            case 'Primary Artist':
              artists.primary.push(artist);
              break;
            case 'Featuring Artist':
              artists.featuring.push(artist);
              break;
            case 'Lyricist':
              artists.lyricists.push(artist);
              break;
            case 'Composer':
              artists.composers.push(artist);
              break;
            case 'Producer':
              artists.producers.push(artist);
              break;
          }
        });
      }

      const track: Track = {
        id: backendRelease.id?.toString() || `track-${Date.now()}`,
        name: backendRelease.songTitle || "Untitled Track",
        language: backendRelease.language?.languageName || "Unknown",
        genre: backendRelease.genre?.genreName || "Unknown",
        subGenre: backendRelease.subGenre?.subGenreName || undefined,
        mood: backendRelease.mood?.moodName || undefined,
        explicit: backendRelease.explicit === "YES",
        isrc: backendRelease.isrc || undefined,
        artists: artists
      }
      tracks.push(track)
    })
    return tracks
  }

  // Helper function to transform artists
  const transformArtists = (artists: any[]): Artist[] => {
    if (!Array.isArray(artists)) {
      console.warn("artists is not an array:", artists)
      return []
    }
    
    return artists
      .filter(artist => artist && typeof artist === 'object')
      .map(artist => ({
        name: artist.artistName || "Unknown Artist",
        legalName: artist.legalName || artist.artistName || "Unknown Artist",
        instagram: artist.instagramURL || undefined,
        spotify: artist.spotifyURL || undefined,
        youtube: artist.youtubeURL || undefined
      }))
  }

  const toggleTrackExpand = (trackId: string) => {
    setExpandedTracks((prev) => ({
      ...prev,
      [trackId]: !prev[trackId],
    }))
  }

  const handleSubmitForReview = async () => {
    if (!albumId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Cannot submit for review: Album ID is missing.",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/updateAlbumReleaseStatus`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Client-ID": process.env.NEXT_PUBLIC_CLIENT_ID || "",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          albumId: albumId,
          releaseStatusId: 2, // "Under Review"
          remark: "Submitted for review",
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `API request failed with status ${response.status}`)
      }

      toast({
        title: "Success",
        description: "Release submitted for review successfully!",
      })

      if (release) {
        setRelease({ ...release, status: "under-review" })
      }
      if (album) {
        setAlbum({ ...album, releaseStatusId: 2 })
      }
    } catch (err) {
      console.error("Error submitting for review:", err)
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: err instanceof Error ? err.message : "An unknown error occurred.",
      })
    } finally {
      setIsSubmitting(false)
      setIsSubmitDialogOpen(false)
    }
  }

  if (loading) {
    return <ReleasePageSkeleton />
  }

  if (error) {
    return (
      <div className="container py-8">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!release) {
    return (
      <div className="container py-8 text-center">
        <p>Release not found.</p>
      </div>
    )
  }

  const formattedDate = format(new Date(release.releaseDate), "MMMM d, yyyy")
  const canEdit = album?.releaseStatusId == 1
  const canSubmit = album?.releaseStatusId == 1

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
                src={`https://api.tunewavemedia.in${release.artwork}` || "/placeholder.svg"}
                alt={release.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            </div>
            <CardContent className="p-4">
              <Badge
                className={cn(
                  "mb-2 font-medium shadow-sm",
                  statusColors[release.status as keyof typeof statusColors],
                )}
              >
                {statusLabels[release.status as keyof typeof statusLabels]}
              </Badge>
              <h1 className="text-2xl font-bold tracking-tight">{release.title}</h1>
              {albumArtists.length > 0 && (
                <p className="text-sm text-muted-foreground font-medium mt-1">
                  by {albumArtists.map((artist) => artist.artistName).join(", ")}
                </p>
              )}
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Release Date:</span>
                  <span className="font-medium">{formattedDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Label:</span>
                  <span className="font-medium">{release.label}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tracks:</span>
                  <span className="font-medium">{release.tracks.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 space-y-3">
            {canEdit && (
              <Button
                className="w-full group"
                variant="outline"
                onClick={() => router.push(`/releases/${release.id}/edit`)}
              >
                <Edit className="mr-2 h-4 w-4 transition-transform group-hover:rotate-12" />
                Edit Release
              </Button>
            )}

            {canSubmit && (
              <Dialog open={isSubmitDialogOpen} onOpenChange={setIsSubmitDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full bg-gradient-to-r from-primary to-primary/80 hover:shadow-md transition-all">
                    Submit for Review
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Confirm Submission</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to submit this release? Once submitted for review, it cannot be edited.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="mt-4">
                    <DialogClose asChild>
                      <Button variant="outline" disabled={isSubmitting}>Cancel</Button>
                    </DialogClose>
                    <Button onClick={handleSubmitForReview} disabled={isSubmitting}>
                      {isSubmitting ? "Submitting..." : "Confirm & Submit"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
            {!canSubmit && album && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Release Submitted</AlertTitle>
                <AlertDescription>This release is currently under review.</AlertDescription>
              </Alert>
            )}
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
                  {release.tracks.map((track) => (
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
                            <div className="p-4 space-y-4">
                              {/* Primary Artists */}
                              <div>
                                <h4 className="font-medium mb-2">Primary Artists</h4>
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>Artist Name</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {track.artists.primary.map((artist, index) => (
                                      <TableRow key={`primary-${index}`}>
                                        <TableCell>{artist.name}</TableCell>
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
                                        <TableRow key={`featuring-${index}`}>
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
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                       <TableRow>
                          <TableCell colSpan={6} className="p-0 border-none">
                            <div className="p-4 space-y-4">
                              {/* Track Details */}
                              <div>
                                <h4 className="font-medium mb-2">Track Details</h4>
                                <div className="grid grid-cols-2 gap-4 p-4 bg-card/50 rounded-xl border shadow-sm">
                                  <div>
                                    <p className="text-sm text-muted-foreground mb-1">Sub-Genre</p>
                                    <p className="font-medium">{track.subGenre || "N/A"}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground mb-1">Mood</p>
                                    <p className="font-medium">{track.mood || "N/A"}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground mb-1">ISRC</p>
                                    <p className="font-medium">{track.isrc || "N/A"}</p>
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

function ReleasePageSkeleton() {
  return (
    <div className="container py-8">
      <div className="mb-6">
        <Skeleton className="h-9 w-32" />
      </div>
      <div className="grid gap-6 md:grid-cols-[300px_1fr]">
        <div>
          <Card>
            <Skeleton className="aspect-square w-full" />
            <CardContent className="p-4">
              <Skeleton className="h-6 w-24 mb-2" />
              <Skeleton className="h-8 w-4/5 mb-4" />
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-5 w-24" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-5 w-28" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-5 w-14" />
                  <Skeleton className="h-5 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="mt-6 space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-7 w-32" />
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead><Skeleton className="h-5 w-24" /></TableHead>
                    <TableHead><Skeleton className="h-5 w-20" /></TableHead>
                    <TableHead><Skeleton className="h-5 w-16" /></TableHead>
                    <TableHead><Skeleton className="h-5 w-16" /></TableHead>
                    <TableHead><Skeleton className="h-5 w-28" /></TableHead>
                    <TableHead><Skeleton className="h-5 w-8" /></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...Array(3)].map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-12" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-36" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                    </TableRow>
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
