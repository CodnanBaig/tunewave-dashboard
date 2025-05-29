"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Switch } from "@/components/ui/switch"
import { format, addDays } from "date-fns"
import { CalendarIcon, ArrowLeft, ArrowRight, Upload } from "lucide-react"
import { cn } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"

// Mock data for a draft release
const mockDraftRelease = {
  id: "4",
  title: "Acoustic Sessions",
  releaseDate: "2024-01-18",
  label: "Label 2",
  artwork: "/placeholder-1euab.png",
  status: "draft",
  youtubeContentId: true,
  tracks: [
    {
      id: "t1",
      name: "Mountain Echo",
      language: "English",
      genre: "Acoustic",
      subGenre: "Folk",
      mood: "Chill",
      explicit: false,
      isrc: "USRC12345678",
      artists: [
        {
          name: "Sarah Johnson",
          legalName: "Sarah Johnson",
          instagram: "https://instagram.com/sarahjohnson",
          spotify: "https://open.spotify.com/artist/123456",
          appleMusic: "https://music.apple.com/artist/123456",
          youtube: "https://youtube.com/channel/123456",
        },
      ],
    },
  ],
}

export default function EditReleasePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [releaseDate, setReleaseDate] = useState<Date>()
  const [release, setRelease] = useState(mockDraftRelease)
  const minReleaseDate = addDays(new Date(), 2)

  // In a real app, fetch the release data based on the ID
  useEffect(() => {
    // This would be an API call in a real app
    // For now, we're using mock data
    console.log(`Fetching release with ID: ${params.id}`)

    // Set the release date from the mock data
    setReleaseDate(new Date(mockDraftRelease.releaseDate))
  }, [params.id])

  const nextStep = () => {
    setStep(step + 1)
  }

  const prevStep = () => {
    setStep(step - 1)
  }

  const handleSaveChanges = () => {
    // In a real app, this would save the changes to the release
    console.log("Saving changes to release", release)
    router.push(`/releases/${params.id}`)
  }

  // Only allow editing if the release is in draft status
  if (release.status !== "draft") {
    router.push(`/releases/${params.id}`)
    return null
  }

  return (
    <div className="container max-w-3xl py-8">
      <div className="mb-8">
        <Button variant="ghost" onClick={() => router.push(`/releases/${params.id}`)} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Release
        </Button>
        <h1 className="text-3xl font-bold">Edit Release</h1>
        <p className="text-muted-foreground">Update your draft release information</p>
      </div>

      <Tabs value={`step-${step}`} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="step-1" onClick={() => setStep(1)}>
            Release Info
          </TabsTrigger>
          <TabsTrigger value="step-2" onClick={() => setStep(2)}>
            Track Details
          </TabsTrigger>
          <TabsTrigger value="step-3" onClick={() => setStep(3)}>
            Artist Info
          </TabsTrigger>
          <TabsTrigger value="step-4" onClick={() => setStep(4)}>
            Upload
          </TabsTrigger>
        </TabsList>

        <TabsContent value="step-1">
          <Card>
            <CardHeader>
              <CardTitle>Step 1: Release Information</CardTitle>
              <CardDescription>Update the basic details about your release</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="releaseName">Album/Single Name</Label>
                <Input
                  id="releaseName"
                  placeholder="Enter release name"
                  defaultValue={release.title}
                  onChange={(e) => setRelease({ ...release, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="releaseDate">Release Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !releaseDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {releaseDate ? format(releaseDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={releaseDate}
                      onSelect={setReleaseDate}
                      disabled={(date) => date < minReleaseDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <p className="text-xs text-muted-foreground">Release date must be at least 2 days from today</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="label">Label</Label>
                <Select defaultValue={release.label}>
                  <SelectTrigger id="label">
                    <SelectValue placeholder="Select label" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="label1">Label 1</SelectItem>
                    <SelectItem value="label2">Label 2</SelectItem>
                    <SelectItem value="label3">Label 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between space-y-0 pt-2">
                <Label htmlFor="youtube-content-id">YouTube Content ID</Label>
                <Switch
                  id="youtube-content-id"
                  defaultChecked={release.youtubeContentId}
                  onCheckedChange={(checked) => setRelease({ ...release, youtubeContentId: checked })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="artwork">Artwork (3000x3000 JPG/JPEG)</Label>
                <div className="flex flex-col gap-4">
                  {/* Show current artwork */}
                  <div className="w-full max-w-[200px] aspect-square relative border rounded-md overflow-hidden">
                    <Image
                      src={release.artwork || "/placeholder.svg"}
                      alt={release.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Upload new artwork */}
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="artwork-upload"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/40 hover:bg-muted/60"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-6 h-6 mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          <span className="font-semibold">Upload new artwork</span>
                        </p>
                        <p className="text-xs text-muted-foreground">JPG or JPEG (3000x3000px)</p>
                      </div>
                      <input id="artwork-upload" type="file" className="hidden" accept=".jpg,.jpeg" />
                    </label>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={nextStep}>
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="step-2">
          <Card>
            <CardHeader>
              <CardTitle>Step 2: Track Details</CardTitle>
              <CardDescription>Update information about your track</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="songName">Song Name</Label>
                <Input id="songName" placeholder="Enter song name" defaultValue={release.tracks[0].name} />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select defaultValue={release.tracks[0].language}>
                    <SelectTrigger id="language">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Hindi">Hindi</SelectItem>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="Tamil">Tamil</SelectItem>
                      <SelectItem value="Telugu">Telugu</SelectItem>
                      <SelectItem value="Punjabi">Punjabi</SelectItem>
                      <SelectItem value="Bengali">Bengali</SelectItem>
                      <SelectItem value="Marathi">Marathi</SelectItem>
                      <SelectItem value="Gujarati">Gujarati</SelectItem>
                      <SelectItem value="Kannada">Kannada</SelectItem>
                      <SelectItem value="Malayalam">Malayalam</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="genre">Genre</Label>
                  <Select defaultValue={release.tracks[0].genre}>
                    <SelectTrigger id="genre">
                      <SelectValue placeholder="Select genre" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pop">Pop</SelectItem>
                      <SelectItem value="Rock">Rock</SelectItem>
                      <SelectItem value="Hip-Hop">Hip-Hop</SelectItem>
                      <SelectItem value="R&B">R&B</SelectItem>
                      <SelectItem value="Electronic">Electronic</SelectItem>
                      <SelectItem value="Classical">Classical</SelectItem>
                      <SelectItem value="Jazz">Jazz</SelectItem>
                      <SelectItem value="Folk">Folk</SelectItem>
                      <SelectItem value="Country">Country</SelectItem>
                      <SelectItem value="Acoustic">Acoustic</SelectItem>
                      <SelectItem value="Bollywood">Bollywood</SelectItem>
                      <SelectItem value="Devotional">Devotional</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="subGenre">Sub-Genre</Label>
                  <Select defaultValue={release.tracks[0].subGenre}>
                    <SelectTrigger id="subGenre">
                      <SelectValue placeholder="Select sub-genre" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Acoustic">Acoustic</SelectItem>
                      <SelectItem value="Trap">Trap</SelectItem>
                      <SelectItem value="Indie">Indie</SelectItem>
                      <SelectItem value="Folk">Folk</SelectItem>
                      <SelectItem value="Alternative">Alternative</SelectItem>
                      <SelectItem value="EDM">EDM</SelectItem>
                      <SelectItem value="House">House</SelectItem>
                      <SelectItem value="Techno">Techno</SelectItem>
                      <SelectItem value="Ambient">Ambient</SelectItem>
                      <SelectItem value="Lo-Fi">Lo-Fi</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mood">Mood</Label>
                  <Select defaultValue={release.tracks[0].mood}>
                    <SelectTrigger id="mood">
                      <SelectValue placeholder="Select mood" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Happy">Happy</SelectItem>
                      <SelectItem value="Sad">Sad</SelectItem>
                      <SelectItem value="Romantic">Romantic</SelectItem>
                      <SelectItem value="Chill">Chill</SelectItem>
                      <SelectItem value="Energetic">Energetic</SelectItem>
                      <SelectItem value="Relaxed">Relaxed</SelectItem>
                      <SelectItem value="Angry">Angry</SelectItem>
                      <SelectItem value="Nostalgic">Nostalgic</SelectItem>
                      <SelectItem value="Hopeful">Hopeful</SelectItem>
                      <SelectItem value="Melancholic">Melancholic</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between space-y-0 pt-2">
                <Label htmlFor="explicit">Explicit Lyrics?</Label>
                <Switch id="explicit" defaultChecked={release.tracks[0].explicit} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="isrc">ISRC Code (Optional)</Label>
                <Input id="isrc" placeholder="Enter ISRC code if available" defaultValue={release.tracks[0].isrc} />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={prevStep}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
              <Button onClick={nextStep}>
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="step-3">
          <Card>
            <CardHeader>
              <CardTitle>Step 3: Artist Information</CardTitle>
              <CardDescription>Update details about all artists involved in this track</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Primary Artists Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Primary Artists</h3>
                  <Badge variant="outline">Max 3</Badge>
                </div>

                {/* Current Primary Artists */}
                <div className="space-y-3">
                  {release.tracks[0].artists.slice(0, 3).map((artist, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                      <div>
                        <p className="font-medium">{artist.name}</p>
                        <p className="text-sm text-muted-foreground">Legal Name: {artist.legalName}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>

                {/* Add Primary Artist */}
                <div className="space-y-2">
                  <Label htmlFor="primaryArtist">Add Primary Artist ({release.tracks[0].artists.length}/3)</Label>
                  <div className="flex gap-2">
                    <Select disabled={release.tracks[0].artists.length >= 3}>
                      <SelectTrigger id="primaryArtist">
                        <SelectValue placeholder="Select existing artist" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">+ Add New Artist</SelectItem>
                        <SelectItem value="Sarah Johnson">Sarah Johnson</SelectItem>
                        <SelectItem value="John Smith">John Smith</SelectItem>
                        <SelectItem value="Alex Turner">Alex Turner</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" disabled={release.tracks[0].artists.length >= 3}>
                      Add
                    </Button>
                  </div>
                  {release.tracks[0].artists.length >= 3 && (
                    <p className="text-xs text-muted-foreground mt-1">Maximum number of primary artists reached (3)</p>
                  )}
                </div>
              </div>

              {/* Featuring Artists Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Featuring Artists</h3>
                  <Badge variant="outline">Max 10 (Optional)</Badge>
                </div>

                {/* Current Featuring Artists - For demo, showing empty state */}
                <div className="p-4 border rounded-md bg-muted/40 text-center">
                  <p className="text-sm text-muted-foreground">No featuring artists added yet</p>
                </div>

                {/* Add Featuring Artist */}
                <div className="space-y-2">
                  <Label htmlFor="featuringArtist">Add Featuring Artist (0/10)</Label>
                  <div className="flex gap-2">
                    <Select>
                      <SelectTrigger id="featuringArtist">
                        <SelectValue placeholder="Select existing artist" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">+ Add New Artist</SelectItem>
                        <SelectItem value="DJ Summer">DJ Summer</SelectItem>
                        <SelectItem value="MC Beat">MC Beat</SelectItem>
                        <SelectItem value="Vocal Queen">Vocal Queen</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline">Add</Button>
                  </div>
                </div>
              </div>

              {/* Lyricists Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Lyricists</h3>

                {/* Current Lyricists - For demo, showing empty state */}
                <div className="p-4 border rounded-md bg-muted/40 text-center">
                  <p className="text-sm text-muted-foreground">No lyricists added yet</p>
                </div>

                {/* Add Lyricist */}
                <div className="space-y-2">
                  <Label htmlFor="lyricist">Add Lyricist</Label>
                  <div className="flex gap-2">
                    <Select>
                      <SelectTrigger id="lyricist">
                        <SelectValue placeholder="Select existing lyricist" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">+ Add New Lyricist</SelectItem>
                        <SelectItem value="Sarah Johnson">Sarah Johnson</SelectItem>
                        <SelectItem value="John Smith">John Smith</SelectItem>
                        <SelectItem value="Poet Master">Poet Master</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline">Add</Button>
                  </div>
                </div>
              </div>

              {/* Composers Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Composers</h3>

                {/* Current Composers - For demo, showing empty state */}
                <div className="p-4 border rounded-md bg-muted/40 text-center">
                  <p className="text-sm text-muted-foreground">No composers added yet</p>
                </div>

                {/* Add Composer */}
                <div className="space-y-2">
                  <Label htmlFor="composer">Add Composer</Label>
                  <div className="flex gap-2">
                    <Select>
                      <SelectTrigger id="composer">
                        <SelectValue placeholder="Select existing composer" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">+ Add New Composer</SelectItem>
                        <SelectItem value="Music Maestro">Music Maestro</SelectItem>
                        <SelectItem value="Melody Maker">Melody Maker</SelectItem>
                        <SelectItem value="Note Master">Note Master</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline">Add</Button>
                  </div>
                </div>
              </div>

              {/* Producers Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Producers</h3>

                {/* Current Producers - For demo, showing empty state */}
                <div className="p-4 border rounded-md bg-muted/40 text-center">
                  <p className="text-sm text-muted-foreground">No producers added yet</p>
                </div>

                {/* Add Producer */}
                <div className="space-y-2">
                  <Label htmlFor="producer">Add Producer</Label>
                  <div className="flex gap-2">
                    <Select>
                      <SelectTrigger id="producer">
                        <SelectValue placeholder="Select existing producer" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">+ Add New Producer</SelectItem>
                        <SelectItem value="Beat Master">Beat Master</SelectItem>
                        <SelectItem value="Studio Pro">Studio Pro</SelectItem>
                        <SelectItem value="Mix King">Mix King</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline">Add</Button>
                  </div>
                </div>
              </div>

              {/* Add New Artist Form */}
              <div className="space-y-4 border rounded-md p-4">
                <h3 className="text-lg font-medium">Add New Artist</h3>
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="artistName">Artist Name</Label>
                      <Input id="artistName" placeholder="Stage name" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="legalName">Legal Name</Label>
                      <Input id="legalName" placeholder="First Last" />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="instagram">Instagram URL (Optional)</Label>
                      <Input id="instagram" placeholder="https://instagram.com/username" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="spotify">Spotify URL (Optional)</Label>
                      <Input id="spotify" placeholder="https://open.spotify.com/artist/id" />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="appleMusic">Apple Music URL (Optional)</Label>
                      <Input id="appleMusic" placeholder="https://music.apple.com/artist/id" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="youtube">YouTube URL (Optional)</Label>
                      <Input id="youtube" placeholder="https://youtube.com/channel/id" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="artistRole">Role</Label>
                    <Select>
                      <SelectTrigger id="artistRole">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="primary">Primary Artist</SelectItem>
                        <SelectItem value="featuring">Featuring Artist</SelectItem>
                        <SelectItem value="lyricist">Lyricist</SelectItem>
                        <SelectItem value="composer">Composer</SelectItem>
                        <SelectItem value="producer">Producer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button className="w-full">Add Artist</Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={prevStep}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
              <Button onClick={nextStep}>
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="step-4">
          <Card>
            <CardHeader>
              <CardTitle>Step 4: Upload Track</CardTitle>
              <CardDescription>Update your track file or keep the existing one</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Current Track File</Label>
                <div className="p-4 border rounded-md bg-muted/40">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
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
                          className="text-primary"
                        >
                          <path d="M9 18V5l12-2v13"></path>
                          <circle cx="6" cy="18" r="3"></circle>
                          <circle cx="18" cy="16" r="3"></circle>
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{release.tracks[0].name}.wav</p>
                        <p className="text-xs text-muted-foreground">Uploaded on {format(new Date(), "MMM d, yyyy")}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      Replace
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="trackFile">Upload New WAV File</Label>
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="track-upload"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/40 hover:bg-muted/60"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-6 h-6 mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        <span className="font-semibold">Upload new track file</span>
                      </p>
                      <p className="text-xs text-muted-foreground">WAV file only</p>
                    </div>
                    <input id="track-upload" type="file" className="hidden" accept=".wav" />
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Any additional information about this release"
                  className="min-h-[100px]"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={prevStep}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
              <Button onClick={handleSaveChanges}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
