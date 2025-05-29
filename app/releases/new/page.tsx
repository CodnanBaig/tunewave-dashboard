"use client"

import type React from "react"

import { useState, useCallback } from "react"
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
import {
  CalendarIcon,
  ArrowLeft,
  ArrowRight,
  Upload,
  Plus,
  X,
  AlertCircle,
  Music,
  FileAudio,
  CheckCircle2,
  Sparkles,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"

// Mock data for existing artists
const existingArtists = [
  { id: "1", name: "John Smith", legalName: "John Smith", role: "primary" },
  { id: "2", name: "DJ Summer", legalName: "Sarah Johnson", role: "featuring" },
  { id: "3", name: "Melody Maker", legalName: "Michael Brown", role: "composer" },
  { id: "4", name: "Lyric Master", legalName: "Lisa Davis", role: "lyricist" },
  { id: "5", name: "Beat Producer", legalName: "Brian Wilson", role: "producer" },
]

// Initial release state
const initialReleaseState = {
  title: "",
  releaseDate: null as Date | null,
  label: "",
  youtubeContentId: false,
  artwork: null as File | null,
  tracks: [] as Track[],
}

// Initial track state
const initialTrackState = {
  name: "",
  language: "",
  genre: "",
  subGenre: "",
  mood: "",
  explicit: false,
  isrc: "",
  primaryArtists: [] as Artist[],
  featuringArtists: [] as Artist[],
  lyricists: [] as Artist[],
  composers: [] as Artist[],
  producers: [] as Artist[],
  audioFile: null as File | null,
}

// Types
type Artist = {
  id: string
  name: string
  legalName: string
  instagram?: string
  spotify?: string
  appleMusic?: string
  youtube?: string
  role: string
}

type Track = {
  name: string
  language: string
  genre: string
  subGenre: string
  mood: string
  explicit: boolean
  isrc: string
  primaryArtists: Artist[]
  featuringArtists: Artist[]
  lyricists: Artist[]
  composers: Artist[]
  producers: Artist[]
  audioFile: File | null
}

export default function NewReleasePage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [release, setRelease] = useState(initialReleaseState)
  const [currentTrack, setCurrentTrack] = useState(initialTrackState)
  const [newArtist, setNewArtist] = useState<Partial<Artist>>({})
  const [newArtistRole, setNewArtistRole] = useState<string>("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showNewArtistForm, setShowNewArtistForm] = useState(false)

  const minReleaseDate = addDays(new Date(), 2)

  // Validation functions
  const validateReleaseInfo = () => {
    const newErrors: Record<string, string> = {}

    if (!release.title.trim()) {
      newErrors.title = "Album/Single name is required"
    }

    if (!release.releaseDate) {
      newErrors.releaseDate = "Release date is required"
    }

    if (!release.label) {
      newErrors.label = "Label is required"
    }

    if (!release.artwork) {
      newErrors.artwork = "Artwork is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateTrackInfo = () => {
    const newErrors: Record<string, string> = {}

    if (!currentTrack.name.trim()) {
      newErrors.trackName = "Track name is required"
    }

    if (!currentTrack.language) {
      newErrors.language = "Language is required"
    }

    if (!currentTrack.genre) {
      newErrors.genre = "Genre is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateArtistInfo = () => {
    const newErrors: Record<string, string> = {}

    if (currentTrack.primaryArtists.length === 0) {
      newErrors.primaryArtists = "At least one primary artist is required"
    }

    if (currentTrack.lyricists.length === 0) {
      newErrors.lyricists = "At least one lyricist is required"
    }

    if (currentTrack.composers.length === 0) {
      newErrors.composers = "At least one composer is required"
    }

    if (currentTrack.producers.length === 0) {
      newErrors.producers = "At least one producer is required"
    }

    // Check for overlap between primary and featuring artists
    const primaryArtistIds = currentTrack.primaryArtists.map((a) => a.id)
    const featuringArtistIds = currentTrack.featuringArtists.map((a) => a.id)

    const overlap = primaryArtistIds.filter((id) => featuringArtistIds.includes(id))
    if (overlap.length > 0) {
      newErrors.artistOverlap = "Artists cannot be both primary and featuring"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateAudioUpload = () => {
    const newErrors: Record<string, string> = {}

    if (!currentTrack.audioFile) {
      newErrors.audioFile = "Audio file is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateNewArtist = () => {
    const newErrors: Record<string, string> = {}

    if (!newArtist.name?.trim()) {
      newErrors.artistName = "Artist name is required"
    }

    if (!newArtist.legalName?.trim()) {
      newErrors.legalName = "Legal name is required"
    } else if (!isValidLegalName(newArtist.legalName)) {
      newErrors.legalName = "Legal name must be in First Last format"
    }

    if (!newArtist.instagram?.trim()) {
      newErrors.instagram = "Instagram URL is required"
    }

    if (!newArtistRole) {
      newErrors.artistRole = "Artist role is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const isValidLegalName = (name: string) => {
    // Simple validation for First Last format
    return /^[A-Za-z]+ [A-Za-z]+$/.test(name)
  }

  // Add this function after the calculateProgress function
  const isTabCompleted = useCallback((tabNumber: number) => {
    switch (tabNumber) {
      case 1:
        return Boolean(
          release.title.trim() &&
          release.releaseDate &&
          release.label &&
          release.artwork
        )
      case 2:
        return Boolean(
          currentTrack.name.trim() &&
          currentTrack.language &&
          currentTrack.genre
        )
      case 3:
        return Boolean(
          currentTrack.primaryArtists.length > 0 &&
          currentTrack.lyricists.length > 0 &&
          currentTrack.composers.length > 0 &&
          currentTrack.producers.length > 0 &&
          !errors.artistOverlap
        )
      case 4:
        return Boolean(currentTrack.audioFile)
      case 5:
        return release.tracks.length > 0
      default:
        return false
    }
  }, [release, currentTrack, errors.artistOverlap])

  // Handle next step
  const nextStep = useCallback(() => {
    if (isTabCompleted(step)) {
      setStep(step + 1)
    } else {
      // Run validation for current step to show errors
      switch (step) {
        case 1:
          validateReleaseInfo()
          break
        case 2:
          validateTrackInfo()
          break
        case 3:
          validateArtistInfo()
          break
        case 4:
          validateAudioUpload()
          break
      }
    }
  }, [step, isTabCompleted])

  // Handle previous step
  const prevStep = () => {
    setStep(step - 1)
  }

  // Handle release creation completion
  const handleCreateRelease = () => {
    // In a real app, this would submit the release to an API
    console.log("Creating release:", {
      ...release,
      tracks: [...release.tracks, currentTrack],
    })

    // Redirect to the single release view
    // In a real app, this would use the ID returned from the API
    router.push("/releases/new-release-id")
  }

  // Handle adding the current track to the release
  const addTrackToRelease = () => {
    if (validateAudioUpload()) {
      setRelease((prev) => ({
        ...prev,
        tracks: [...prev.tracks, currentTrack],
      }))

      // Reset current track for potential additional tracks
      setCurrentTrack(initialTrackState)

      // Go back to step 1 to add another track or finalize
      setStep(5)
    }
  }

  // Handle adding a new artist
  const handleAddNewArtist = () => {
    if (validateNewArtist()) {
      const artist: Artist = {
        id: `new-${Date.now()}`,
        name: newArtist.name!,
        legalName: newArtist.legalName!,
        instagram: newArtist.instagram,
        spotify: newArtist.spotify,
        appleMusic: newArtist.appleMusic,
        youtube: newArtist.youtube,
        role: newArtistRole,
      }

      // Add artist to the appropriate role array
      switch (newArtistRole) {
        case "primary":
          if (currentTrack.primaryArtists.length < 3) {
            setCurrentTrack((prev) => ({
              ...prev,
              primaryArtists: [...prev.primaryArtists, artist],
            }))
          }
          break
        case "featuring":
          if (currentTrack.featuringArtists.length < 10) {
            setCurrentTrack((prev) => ({
              ...prev,
              featuringArtists: [...prev.featuringArtists, artist],
            }))
          }
          break
        case "lyricist":
          setCurrentTrack((prev) => ({
            ...prev,
            lyricists: [...prev.lyricists, artist],
          }))
          break
        case "composer":
          setCurrentTrack((prev) => ({
            ...prev,
            composers: [...prev.composers, artist],
          }))
          break
        case "producer":
          setCurrentTrack((prev) => ({
            ...prev,
            producers: [...prev.producers, artist],
          }))
          break
      }

      // Reset new artist form
      setNewArtist({})
      setNewArtistRole("")
      setShowNewArtistForm(false)
    }
  }

  // Handle adding an existing artist
  const handleAddExistingArtist = (artistId: string, role: string) => {
    const artist = existingArtists.find((a) => a.id === artistId)

    if (!artist) return

    // Check if artist already exists in the role
    let exists = false

    switch (role) {
      case "primary":
        exists = currentTrack.primaryArtists.some((a) => a.id === artistId)
        break
      case "featuring":
        exists = currentTrack.featuringArtists.some((a) => a.id === artistId)
        break
      case "lyricist":
        exists = currentTrack.lyricists.some((a) => a.id === artistId)
        break
      case "composer":
        exists = currentTrack.composers.some((a) => a.id === artistId)
        break
      case "producer":
        exists = currentTrack.producers.some((a) => a.id === artistId)
        break
    }

    if (exists) return

    // Add artist to the appropriate role array
    const artistWithRole = { ...artist, role }

    switch (role) {
      case "primary":
        if (currentTrack.primaryArtists.length < 3) {
          setCurrentTrack((prev) => ({
            ...prev,
            primaryArtists: [...prev.primaryArtists, artistWithRole],
          }))
        }
        break
      case "featuring":
        if (currentTrack.featuringArtists.length < 10) {
          setCurrentTrack((prev) => ({
            ...prev,
            featuringArtists: [...prev.featuringArtists, artistWithRole],
          }))
        }
        break
      case "lyricist":
        setCurrentTrack((prev) => ({
          ...prev,
          lyricists: [...prev.lyricists, artistWithRole],
        }))
        break
      case "composer":
        setCurrentTrack((prev) => ({
          ...prev,
          composers: [...prev.composers, artistWithRole],
        }))
        break
      case "producer":
        setCurrentTrack((prev) => ({
          ...prev,
          producers: [...prev.producers, artistWithRole],
        }))
        break
    }
  }

  // Handle removing an artist
  const handleRemoveArtist = (artistId: string, role: string) => {
    switch (role) {
      case "primary":
        setCurrentTrack((prev) => ({
          ...prev,
          primaryArtists: prev.primaryArtists.filter((a) => a.id !== artistId),
        }))
        break
      case "featuring":
        setCurrentTrack((prev) => ({
          ...prev,
          featuringArtists: prev.featuringArtists.filter((a) => a.id !== artistId),
        }))
        break
      case "lyricist":
        setCurrentTrack((prev) => ({
          ...prev,
          lyricists: prev.lyricists.filter((a) => a.id !== artistId),
        }))
        break
      case "composer":
        setCurrentTrack((prev) => ({
          ...prev,
          composers: prev.composers.filter((a) => a.id !== artistId),
        }))
        break
      case "producer":
        setCurrentTrack((prev) => ({
          ...prev,
          producers: prev.producers.filter((a) => a.id !== artistId),
        }))
        break
    }
  }

  // Handle file uploads
  const handleArtworkUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setRelease((prev) => ({
        ...prev,
        artwork: e.target.files![0],
      }))
    }
  }

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCurrentTrack((prev) => ({
        ...prev,
        audioFile: e.target.files![0],
      }))
    }
  }

  // Add a progress calculation function
  const calculateProgress = () => {
    let progress = 0

    // Step 1 progress (25%)
    if (release.title && release.releaseDate && release.label && release.artwork) {
      progress += 25
    } else if (release.title || release.releaseDate || release.label || release.artwork) {
      progress += 10
    }

    // Step 2 progress (25%)
    if (currentTrack.name && currentTrack.language && currentTrack.genre) {
      progress += 25
    } else if (currentTrack.name || currentTrack.language || currentTrack.genre) {
      progress += 10
    }

    // Step 3 progress (25%)
    if (
      currentTrack.primaryArtists.length > 0 &&
      currentTrack.lyricists.length > 0 &&
      currentTrack.composers.length > 0 &&
      currentTrack.producers.length > 0
    ) {
      progress += 25
    } else if (
      currentTrack.primaryArtists.length > 0 ||
      currentTrack.lyricists.length > 0 ||
      currentTrack.composers.length > 0 ||
      currentTrack.producers.length > 0
    ) {
      progress += 10
    }

    // Step 4 progress (25%)
    if (currentTrack.audioFile) {
      progress += 25
    }

    return progress
  }

  return (
    <div className="container max-w-[90rem] py-8">
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => router.push("/releases")}
          className="mb-4 hover:bg-muted/60 transition-colors group"
        >
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Releases
        </Button>
        <div className="flex items-center gap-3 mb-2">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center shadow-md">
            <Music className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Create New Release</h1>
            <p className="text-muted-foreground">Complete all required information to submit your release</p>
          </div>
        </div>

        <div className="mt-6 space-y-2">
          <div className="flex justify-between text-sm">
            <span>Completion</span>
            <span className="font-medium">{calculateProgress()}%</span>
          </div>
          <Progress
            value={calculateProgress()}
            className="h-2.5 rounded-full bg-muted/60"
            indicatorClassName="bg-gradient-to-r from-primary to-primary/80"
          />
        </div>
      </div>

      <Tabs value={`step-${step}`} className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-8 p-1.5 h-auto rounded-xl bg-muted/50 backdrop-blur-sm">
          <TabsTrigger
            value="step-1"
            asChild
            className={cn(
              "flex flex-col py-3 gap-1 data-[state=active]:shadow-md data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 rounded-lg transition-all duration-200",
              step > 1 && "data-[state=inactive]:text-green-600 dark:data-[state=inactive]:text-green-400",
            )}
          >
            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full h-full"
            >
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-muted mx-auto">
                {step > 1 ? <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" /> : "1"}
              </span>
              <span>Release Info</span>
            </button>
          </TabsTrigger>
          <TabsTrigger
            value="step-2"
            asChild
            className={cn(
              "flex flex-col py-3 gap-1 data-[state=active]:shadow-md data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 rounded-lg transition-all duration-200",
              step > 2 && "data-[state=inactive]:text-green-600 dark:data-[state=inactive]:text-green-400",
              !isTabCompleted(1) && "opacity-50 cursor-not-allowed"
            )}
          >
            <button
              type="button"
              onClick={() => {
                if (isTabCompleted(1)) {
                  setStep(2)
                } else {
                  validateReleaseInfo()
                }
              }}
              disabled={!isTabCompleted(1)}
              className="w-full h-full disabled:cursor-not-allowed"
            >
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-muted mx-auto">
                {step > 2 ? <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" /> : "2"}
              </span>
              <span>Track Details</span>
            </button>
          </TabsTrigger>
          <TabsTrigger
            value="step-3"
            asChild
            className={cn(
              "flex flex-col py-3 gap-1 data-[state=active]:shadow-md data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 rounded-lg transition-all duration-200",
              step > 3 && "data-[state=inactive]:text-green-600 dark:data-[state=inactive]:text-green-400",
              !isTabCompleted(2) && "opacity-50 cursor-not-allowed"
            )}
          >
            <button
              type="button"
              onClick={() => {
                if (isTabCompleted(2)) {
                  setStep(3)
                } else {
                  validateTrackInfo()
                }
              }}
              disabled={!isTabCompleted(2)}
              className="w-full h-full disabled:cursor-not-allowed"
            >
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-muted mx-auto">
                {step > 3 ? <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" /> : "3"}
              </span>
              <span>Artist Info</span>
            </button>
          </TabsTrigger>
          <TabsTrigger
            value="step-4"
            asChild
            className={cn(
              "flex flex-col py-3 gap-1 data-[state=active]:shadow-md data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 rounded-lg transition-all duration-200",
              step > 4 && "data-[state=inactive]:text-green-600 dark:data-[state=inactive]:text-green-400",
              !isTabCompleted(3) && "opacity-50 cursor-not-allowed"
            )}
          >
            <button
              type="button"
              onClick={() => {
                if (isTabCompleted(3)) {
                  setStep(4)
                } else {
                  validateArtistInfo()
                }
              }}
              disabled={!isTabCompleted(3)}
              className="w-full h-full disabled:cursor-not-allowed"
            >
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-muted mx-auto">
                {step > 4 ? <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" /> : "4"}
              </span>
              <span>Upload</span>
            </button>
          </TabsTrigger>
          <TabsTrigger
            value="step-5"
            asChild
            className={cn(
              "flex flex-col py-3 gap-1 data-[state=active]:shadow-md data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 rounded-lg transition-all duration-200",
              !isTabCompleted(4) && "opacity-50 cursor-not-allowed"
            )}
          >
            <button
              type="button"
              onClick={() => {
                if (isTabCompleted(4)) {
                  setStep(5)
                } else {
                  validateAudioUpload()
                }
              }}
              disabled={!isTabCompleted(4)}
              className="w-full h-full disabled:cursor-not-allowed"
            >
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-muted mx-auto">5</span>
              <span>Review</span>
            </button>
          </TabsTrigger>
        </TabsList>

        {/* Step 1: Release Information */}
        <TabsContent value="step-1" className="mt-0">
          <Card className="border shadow-sm overflow-hidden bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-4 border-b bg-muted/30">
              <CardTitle className="flex items-center gap-2 text-xl">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-primary to-primary/80 text-primary-foreground text-sm">
                  1
                </span>
                Release Information
              </CardTitle>
              <CardDescription>Enter the basic details about your release</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-3">
                <Label htmlFor="releaseName" className="text-base">
                  Album/Single Name
                </Label>
                <Input
                  id="releaseName"
                  placeholder="Enter release name"
                  value={release.title}
                  onChange={(e) => setRelease({ ...release, title: e.target.value })}
                  className={cn(
                    "h-11 text-base transition-all",
                    errors.title ? "border-red-500 focus-visible:ring-red-300" : "focus-visible:ring-primary/20",
                  )}
                />
                {errors.title && <p className="text-xs text-red-500 font-medium">{errors.title}</p>}
              </div>

              <div className="space-y-3">
                <Label htmlFor="releaseDate" className="text-base">
                  Release Date
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal h-11 text-base transition-all",
                        !release.releaseDate && "text-muted-foreground",
                        errors.releaseDate
                          ? "border-red-500 focus-visible:ring-red-300"
                          : "focus-visible:ring-primary/20",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-5 w-5" />
                      {release.releaseDate ? format(release.releaseDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={release.releaseDate || undefined}
                      onSelect={(date) => setRelease({ ...release, releaseDate: date })}
                      disabled={(date) => date < minReleaseDate}
                      initialFocus
                      className="rounded-md border"
                    />
                  </PopoverContent>
                </Popover>
                <p className="text-xs text-muted-foreground">Release date must be at least 2 days from today</p>
                {errors.releaseDate && <p className="text-xs text-red-500 font-medium">{errors.releaseDate}</p>}
              </div>

              <div className="space-y-3">
                <Label htmlFor="label" className="text-base">
                  Label
                </Label>
                <Select value={release.label} onValueChange={(value) => setRelease({ ...release, label: value })}>
                  <SelectTrigger
                    id="label"
                    className={cn(
                      "h-11 text-base transition-all",
                      errors.label ? "border-red-500 focus-visible:ring-red-300" : "focus-visible:ring-primary/20",
                    )}
                  >
                    <SelectValue placeholder="Select label" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="label1">Label 1</SelectItem>
                    <SelectItem value="label2">Label 2</SelectItem>
                    <SelectItem value="label3">Label 3</SelectItem>
                  </SelectContent>
                </Select>
                {errors.label && <p className="text-xs text-red-500 font-medium">{errors.label}</p>}
              </div>

              <div className="flex items-center justify-between space-y-0 pt-2 border-t">
                <Label htmlFor="youtube-content-id" className="text-base">
                  YouTube Content ID
                </Label>
                <Switch
                  id="youtube-content-id"
                  checked={release.youtubeContentId}
                  onCheckedChange={(checked) => setRelease({ ...release, youtubeContentId: checked })}
                  className="scale-110 data-[state=checked]:bg-primary"
                />
              </div>

              <div className="space-y-3 pt-2">
                <Label htmlFor="artwork" className="text-base">
                  Artwork (3000x3000 JPG/JPEG)
                </Label>
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="artwork-upload"
                    className={cn(
                      "flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-xl cursor-pointer bg-muted/30 hover:bg-muted/50 transition-colors",
                      errors.artwork && "border-red-500",
                    )}
                  >
                    {release.artwork ? (
                      <div className="flex flex-col items-center justify-center">
                        <div className="relative w-40 h-40 mb-2 rounded-xl overflow-hidden shadow-lg">
                          <img
                            src={URL.createObjectURL(release.artwork) || "/placeholder.svg"}
                            alt="Artwork preview"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                        </div>
                        <p className="text-sm text-muted-foreground">{release.artwork.name}</p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2 hover:bg-destructive/10 hover:text-destructive hover:border-destructive transition-colors"
                          onClick={(e) => {
                            e.preventDefault()
                            setRelease({ ...release, artwork: null })
                          }}
                        >
                          Change
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <div className="w-16 h-16 mb-2 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                          <Upload className="w-8 h-8 text-primary" />
                        </div>
                        <p className="mb-2 text-sm text-center">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground">JPG or JPEG (3000x3000px)</p>
                      </div>
                    )}
                    <input
                      id="artwork-upload"
                      type="file"
                      className="hidden"
                      accept=".jpg,.jpeg"
                      onChange={handleArtworkUpload}
                    />
                  </label>
                </div>
                {errors.artwork && <p className="text-xs text-red-500 font-medium">{errors.artwork}</p>}
              </div>
            </CardContent>
            <CardFooter className="flex justify-end pt-6 border-t bg-muted/30">
              <Button
                onClick={nextStep}
                size="lg"
                className="gap-2 transition-all hover:gap-3 bg-gradient-to-r from-primary to-primary/80 hover:shadow-md"
              >
                Next
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Step 2: Track Details */}
        <TabsContent value="step-2" className="mt-0">
          <Card className="border-2 shadow-sm">
            <CardHeader className="pb-4 border-b">
              <CardTitle className="flex items-center gap-2 text-xl">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm">
                  2
                </span>
                Track Details
              </CardTitle>
              <CardDescription>Enter information about your track</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-3">
                <Label htmlFor="songName" className="text-base">
                  Song Name
                </Label>
                <Input
                  id="songName"
                  placeholder="Enter song name"
                  value={currentTrack.name}
                  onChange={(e) => setCurrentTrack({ ...currentTrack, name: e.target.value })}
                  className={cn(
                    "h-11 text-base transition-all",
                    errors.trackName ? "border-red-500 focus-visible:ring-red-300" : "focus-visible:ring-primary/20",
                  )}
                />
                {errors.trackName && <p className="text-xs text-red-500 font-medium">{errors.trackName}</p>}
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-3">
                  <Label htmlFor="language" className="text-base">
                    Language
                  </Label>
                  <Select
                    value={currentTrack.language}
                    onValueChange={(value) => setCurrentTrack({ ...currentTrack, language: value })}
                  >
                    <SelectTrigger
                      id="language"
                      className={cn(
                        "h-11 text-base transition-all",
                        errors.language ? "border-red-500 focus-visible:ring-red-300" : "focus-visible:ring-primary/20",
                      )}
                    >
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
                  {errors.language && <p className="text-xs text-red-500 font-medium">{errors.language}</p>}
                </div>

                <div className="space-y-3">
                  <Label htmlFor="genre" className="text-base">
                    Genre
                  </Label>
                  <Select
                    value={currentTrack.genre}
                    onValueChange={(value) => setCurrentTrack({ ...currentTrack, genre: value })}
                  >
                    <SelectTrigger
                      id="genre"
                      className={cn(
                        "h-11 text-base transition-all",
                        errors.genre ? "border-red-500 focus-visible:ring-red-300" : "focus-visible:ring-primary/20",
                      )}
                    >
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
                  {errors.genre && <p className="text-xs text-red-500 font-medium">{errors.genre}</p>}
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-3">
                  <Label htmlFor="subGenre" className="text-base">
                    Sub-Genre
                  </Label>
                  <Select
                    value={currentTrack.subGenre}
                    onValueChange={(value) => setCurrentTrack({ ...currentTrack, subGenre: value })}
                  >
                    <SelectTrigger
                      id="subGenre"
                      className="h-11 text-base transition-all focus-visible:ring-primary/20"
                    >
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

                <div className="space-y-3">
                  <Label htmlFor="mood" className="text-base">
                    Mood
                  </Label>
                  <Select
                    value={currentTrack.mood}
                    onValueChange={(value) => setCurrentTrack({ ...currentTrack, mood: value })}
                  >
                    <SelectTrigger id="mood" className="h-11 text-base transition-all focus-visible:ring-primary/20">
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

              <div className="flex items-center justify-between space-y-0 pt-4 border-t">
                <Label htmlFor="explicit" className="text-base">
                  Explicit Lyrics?
                </Label>
                <Switch
                  id="explicit"
                  checked={currentTrack.explicit}
                  onCheckedChange={(checked) => setCurrentTrack({ ...currentTrack, explicit: checked })}
                  className="scale-110 data-[state=checked]:bg-primary"
                />
              </div>

              <div className="space-y-3 pt-2">
                <Label htmlFor="isrc" className="text-base">
                  ISRC Code <span className="text-muted-foreground">(Optional)</span>
                </Label>
                <Input
                  id="isrc"
                  placeholder="Enter ISRC code if available"
                  value={currentTrack.isrc}
                  onChange={(e) => setCurrentTrack({ ...currentTrack, isrc: e.target.value })}
                  className="h-11 text-base transition-all focus-visible:ring-primary/20"
                />
                <p className="text-xs text-muted-foreground">
                  International Standard Recording Code uniquely identifies your recording
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between pt-6 border-t">
              <Button variant="outline" onClick={prevStep} size="lg" className="gap-2 transition-all hover:gap-3">
                <ArrowLeft className="h-4 w-4" />
                Previous
              </Button>
              <Button onClick={nextStep} size="lg" className="gap-2 transition-all hover:gap-3">
                Next
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Step 3: Artist Information */}
        <TabsContent value="step-3" className="mt-0">
          <Card className="border-2 shadow-sm">
            <CardHeader className="pb-4 border-b">
              <CardTitle className="flex items-center gap-2 text-xl">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm">
                  3
                </span>
                Artist Information
              </CardTitle>
              <CardDescription>Add details about all artists involved in this track</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {errors.artistOverlap && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{errors.artistOverlap}</AlertDescription>
                </Alert>
              )}

              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-8">
                  {/* Primary Artists Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium flex items-center gap-2">
                        <span className="w-2 h-6 bg-primary rounded-sm"></span>
                        Primary Artists
                      </h3>
                      <Badge variant="outline" className="font-semibold">
                        Max 3
                      </Badge>
                    </div>

                    {/* Current Primary Artists */}
                    <div className="space-y-3">
                      {currentTrack.primaryArtists.length > 0 ? (
                        currentTrack.primaryArtists.map((artist, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-4 border rounded-md bg-card hover:bg-accent/50 transition-colors"
                          >
                            <div>
                              <p className="font-medium">{artist.name}</p>
                              <p className="text-sm text-muted-foreground">Legal Name: {artist.legalName}</p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRemoveArtist(artist.id, "primary")}
                              className="hover:bg-destructive/10 hover:text-destructive hover:border-destructive transition-colors"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))
                      ) : (
                        <div className="p-6 border rounded-md bg-muted/40 text-center">
                          <p className="text-sm text-muted-foreground">No primary artists added yet</p>
                        </div>
                      )}
                    </div>

                    {/* Add Primary Artist */}
                    <div className="space-y-3">
                      <Label className="text-base">Add Primary Artist ({currentTrack.primaryArtists.length}/3)</Label>
                      <div className="flex gap-2">
                        <Select
                          disabled={currentTrack.primaryArtists.length >= 3}
                          onValueChange={(value) => {
                            if (value === "new") {
                              setNewArtistRole("primary")
                              setShowNewArtistForm(true)
                            } else {
                              handleAddExistingArtist(value, "primary")
                            }
                          }}
                        >
                          <SelectTrigger className="h-11 text-base transition-all focus-visible:ring-primary/20">
                            <SelectValue placeholder="Select or add artist" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new" className="font-medium text-primary">
                              + Add New Artist
                            </SelectItem>
                            <Separator className="my-2" />
                            {existingArtists.map((artist) => (
                              <SelectItem key={artist.id} value={artist.id}>
                                {artist.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      {errors.primaryArtists && (
                        <p className="text-xs text-red-500 font-medium">{errors.primaryArtists}</p>
                      )}
                    </div>
                  </div>

                  {/* Featuring Artists Section */}
                  <div className="space-y-4 pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium flex items-center gap-2">
                        <span className="w-2 h-6 bg-blue-500 rounded-sm"></span>
                        Featuring Artists
                      </h3>
                      <Badge variant="outline" className="font-semibold">
                        Max 10 (Optional)
                      </Badge>
                    </div>

                    {/* Current Featuring Artists */}
                    <div className="space-y-3">
                      {currentTrack.featuringArtists.length > 0 ? (
                        currentTrack.featuringArtists.map((artist, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-4 border rounded-md bg-card hover:bg-accent/50 transition-colors"
                          >
                            <div>
                              <p className="font-medium">{artist.name}</p>
                              <p className="text-sm text-muted-foreground">Legal Name: {artist.legalName}</p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRemoveArtist(artist.id, "featuring")}
                              className="hover:bg-destructive/10 hover:text-destructive hover:border-destructive transition-colors"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))
                      ) : (
                        <div className="p-6 border rounded-md bg-muted/40 text-center">
                          <p className="text-sm text-muted-foreground">No featuring artists added yet</p>
                        </div>
                      )}
                    </div>

                    {/* Add Featuring Artist */}
                    <div className="space-y-3">
                      <Label className="text-base">
                        Add Featuring Artist ({currentTrack.featuringArtists.length}/10)
                      </Label>
                      <div className="flex gap-2">
                        <Select
                          disabled={currentTrack.featuringArtists.length >= 10}
                          onValueChange={(value) => {
                            if (value === "new") {
                              setNewArtistRole("featuring")
                              setShowNewArtistForm(true)
                            } else {
                              handleAddExistingArtist(value, "featuring")
                            }
                          }}
                        >
                          <SelectTrigger className="h-11 text-base transition-all focus-visible:ring-primary/20">
                            <SelectValue placeholder="Select or add artist" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new" className="font-medium text-primary">
                              + Add New Artist
                            </SelectItem>
                            <Separator className="my-2" />
                            {existingArtists.map((artist) => (
                              <SelectItem key={artist.id} value={artist.id}>
                                {artist.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Lyricists Section */}
                  <div className="space-y-4 pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium flex items-center gap-2">
                        <span className="w-2 h-6 bg-yellow-500 rounded-sm"></span>
                        Lyricists
                      </h3>
                      <Badge variant="secondary" className="font-semibold">
                        Required
                      </Badge>
                    </div>

                    {/* Current Lyricists */}
                    <div className="space-y-3">
                      {currentTrack.lyricists.length > 0 ? (
                        currentTrack.lyricists.map((artist, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-4 border rounded-md bg-card hover:bg-accent/50 transition-colors"
                          >
                            <div>
                              <p className="font-medium">{artist.name}</p>
                              <p className="text-sm text-muted-foreground">Legal Name: {artist.legalName}</p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRemoveArtist(artist.id, "lyricist")}
                              className="hover:bg-destructive/10 hover:text-destructive hover:border-destructive transition-colors"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))
                      ) : (
                        <div className="p-6 border rounded-md bg-muted/40 text-center">
                          <p className="text-sm text-muted-foreground">No lyricists added yet</p>
                        </div>
                      )}
                    </div>

                    {/* Add Lyricist */}
                    <div className="space-y-3">
                      <Label className="text-base">Add Lyricist</Label>
                      <div className="flex gap-2">
                        <Select
                          onValueChange={(value) => {
                            if (value === "new") {
                              setNewArtistRole("lyricist")
                              setShowNewArtistForm(true)
                            } else {
                              handleAddExistingArtist(value, "lyricist")
                            }
                          }}
                          className={cn(errors.lyricists ? "border-red-500 focus-visible:ring-red-300" : "")}
                        >
                          <SelectTrigger className="h-11 text-base transition-all focus-visible:ring-primary/20">
                            <SelectValue placeholder="Select or add lyricist" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new" className="font-medium text-primary">
                              + Add New Lyricist
                            </SelectItem>
                            <Separator className="my-2" />
                            {existingArtists.map((artist) => (
                              <SelectItem key={artist.id} value={artist.id}>
                                {artist.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      {errors.lyricists && <p className="text-xs text-red-500 font-medium">{errors.lyricists}</p>}
                    </div>
                  </div>

                  {/* Composers Section */}
                  <div className="space-y-4 pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium flex items-center gap-2">
                        <span className="w-2 h-6 bg-green-500 rounded-sm"></span>
                        Composers
                      </h3>
                      <Badge variant="secondary" className="font-semibold">
                        Required
                      </Badge>
                    </div>

                    {/* Current Composers */}
                    <div className="space-y-3">
                      {currentTrack.composers.length > 0 ? (
                        currentTrack.composers.map((artist, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-4 border rounded-md bg-card hover:bg-accent/50 transition-colors"
                          >
                            <div>
                              <p className="font-medium">{artist.name}</p>
                              <p className="text-sm text-muted-foreground">Legal Name: {artist.legalName}</p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRemoveArtist(artist.id, "composer")}
                              className="hover:bg-destructive/10 hover:text-destructive hover:border-destructive transition-colors"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))
                      ) : (
                        <div className="p-6 border rounded-md bg-muted/40 text-center">
                          <p className="text-sm text-muted-foreground">No composers added yet</p>
                        </div>
                      )}
                    </div>

                    {/* Add Composer */}
                    <div className="space-y-3">
                      <Label className="text-base">Add Composer</Label>
                      <div className="flex gap-2">
                        <Select
                          onValueChange={(value) => {
                            if (value === "new") {
                              setNewArtistRole("composer")
                              setShowNewArtistForm(true)
                            } else {
                              handleAddExistingArtist(value, "composer")
                            }
                          }}
                        >
                          <SelectTrigger className="h-11 text-base transition-all focus-visible:ring-primary/20">
                            <SelectValue placeholder="Select or add composer" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new" className="font-medium text-primary">
                              + Add New Composer
                            </SelectItem>
                            <Separator className="my-2" />
                            {existingArtists.map((artist) => (
                              <SelectItem key={artist.id} value={artist.id}>
                                {artist.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      {errors.composers && <p className="text-xs text-red-500 font-medium">{errors.composers}</p>}
                    </div>
                  </div>

                  {/* Producers Section */}
                  <div className="space-y-4 pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium flex items-center gap-2">
                        <span className="w-2 h-6 bg-red-500 rounded-sm"></span>
                        Producers
                      </h3>
                      <Badge variant="secondary" className="font-semibold">
                        Required
                      </Badge>
                    </div>

                    {/* Current Producers */}
                    <div className="space-y-3">
                      {currentTrack.producers.length > 0 ? (
                        currentTrack.producers.map((artist, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-4 border rounded-md bg-card hover:bg-accent/50 transition-colors"
                          >
                            <div>
                              <p className="font-medium">{artist.name}</p>
                              <p className="text-sm text-muted-foreground">Legal Name: {artist.legalName}</p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRemoveArtist(artist.id, "producer")}
                              className="hover:bg-destructive/10 hover:text-destructive hover:border-destructive transition-colors"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))
                      ) : (
                        <div className="p-6 border rounded-md bg-muted/40 text-center">
                          <p className="text-sm text-muted-foreground">No producers added yet</p>
                        </div>
                      )}
                    </div>

                    {/* Add Producer */}
                    <div className="space-y-3">
                      <Label className="text-base">Add Producer</Label>
                      <div className="flex gap-2">
                        <Select
                          onValueChange={(value) => {
                            if (value === "new") {
                              setNewArtistRole("producer")
                              setShowNewArtistForm(true)
                            } else {
                              handleAddExistingArtist(value, "producer")
                            }
                          }}
                          className={cn(errors.producers ? "border-red-500 focus-visible:ring-red-300" : "")}
                        >
                          <SelectTrigger className="h-11 text-base transition-all focus-visible:ring-primary/20">
                            <SelectValue placeholder="Select or add producer" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new" className="font-medium text-primary">
                              + Add New Producer
                            </SelectItem>
                            <Separator className="my-2" />
                            {existingArtists.map((artist) => (
                              <SelectItem key={artist.id} value={artist.id}>
                                {artist.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      {errors.producers && <p className="text-xs text-red-500 font-medium">{errors.producers}</p>}
                    </div>
                  </div>
                </div>
              </ScrollArea>

              {/* Add New Artist Dialog */}
              <Dialog open={showNewArtistForm} onOpenChange={setShowNewArtistForm}>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle className="text-xl">
                      Add New{" "}
                      {newArtistRole === "primary"
                        ? "Primary Artist"
                        : newArtistRole === "featuring"
                          ? "Featuring Artist"
                          : newArtistRole === "lyricist"
                            ? "Lyricist"
                            : newArtistRole === "composer"
                              ? "Composer"
                              : "Producer"}
                    </DialogTitle>
                    <DialogDescription>Enter the details for the new artist</DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="artistName">Artist Name</Label>
                        <Input
                          id="artistName"
                          placeholder="Stage name"
                          value={newArtist.name || ""}
                          onChange={(e) => setNewArtist({ ...newArtist, name: e.target.value })}
                          className={cn(
                            "h-10 transition-all",
                            errors.artistName
                              ? "border-red-500 focus-visible:ring-red-300"
                              : "focus-visible:ring-primary/20",
                          )}
                        />
                        {errors.artistName && <p className="text-xs text-red-500 font-medium">{errors.artistName}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="legalName">Legal Name</Label>
                        <Input
                          id="legalName"
                          placeholder="First Last"
                          value={newArtist.legalName || ""}
                          onChange={(e) => setNewArtist({ ...newArtist, legalName: e.target.value })}
                          className={cn(
                            "h-10 transition-all",
                            errors.legalName
                              ? "border-red-500 focus-visible:ring-red-300"
                              : "focus-visible:ring-primary/20",
                          )}
                        />
                        {errors.legalName && <p className="text-xs text-red-500 font-medium">{errors.legalName}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="instagram">
                          Instagram URL <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="instagram"
                          placeholder="https://instagram.com/username"
                          value={newArtist.instagram || ""}
                          onChange={(e) => setNewArtist({ ...newArtist, instagram: e.target.value })}
                          className={cn(
                            "h-10 transition-all",
                            errors.instagram
                              ? "border-red-500 focus-visible:ring-red-300"
                              : "focus-visible:ring-primary/20",
                          )}
                        />
                        {errors.instagram && <p className="text-xs text-red-500 font-medium">{errors.instagram}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="spotify">
                          Spotify URL <span className="text-muted-foreground">(Optional)</span>
                        </Label>
                        <Input
                          id="spotify"
                          placeholder="https://open.spotify.com/artist/id"
                          value={newArtist.spotify || ""}
                          onChange={(e) => setNewArtist({ ...newArtist, spotify: e.target.value })}
                          className="h-10 transition-all focus-visible:ring-primary/20"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="appleMusic">
                          Apple Music URL <span className="text-muted-foreground">(Optional)</span>
                        </Label>
                        <Input
                          id="appleMusic"
                          placeholder="https://music.apple.com/artist/id"
                          value={newArtist.appleMusic || ""}
                          onChange={(e) => setNewArtist({ ...newArtist, appleMusic: e.target.value })}
                          className="h-10 transition-all focus-visible:ring-primary/20"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="youtube">
                          YouTube URL <span className="text-muted-foreground">(Optional)</span>
                        </Label>
                        <Input
                          id="youtube"
                          placeholder="https://youtube.com/channel/id"
                          value={newArtist.youtube || ""}
                          onChange={(e) => setNewArtist({ ...newArtist, youtube: e.target.value })}
                          className="h-10 transition-all focus-visible:ring-primary/20"
                        />
                      </div>
                    </div>
                  </div>

                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button onClick={handleAddNewArtist}>Add Artist</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
            <CardFooter className="flex justify-between pt-6 border-t">
              <Button variant="outline" onClick={prevStep} size="lg" className="gap-2 transition-all hover:gap-3">
                <ArrowLeft className="h-4 w-4" />
                Previous
              </Button>
              <Button onClick={nextStep} size="lg" className="gap-2 transition-all hover:gap-3">
                Next
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Step 4: Upload Track */}
        <TabsContent value="step-4" className="mt-0">
          <Card className="border-2 shadow-sm">
            <CardHeader className="pb-4 border-b">
              <CardTitle className="flex items-center gap-2 text-xl">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm">
                  4
                </span>
                Upload Track
              </CardTitle>
              <CardDescription>Upload your track file in WAV format</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-3">
                <Label htmlFor="trackFile" className="text-base">
                  Upload WAV File
                </Label>
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="track-upload"
                    className={cn(
                      "flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-xl cursor-pointer bg-muted/30 hover:bg-muted/50 transition-colors",
                      errors.audioFile && "border-red-500",
                    )}
                  >
                    {currentTrack.audioFile ? (
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-16 h-16 mb-4 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                          <FileAudio className="w-8 h-8 text-primary" />
                        </div>
                        <p className="text-base font-medium">{currentTrack.audioFile.name}</p>
                        <p className="text-sm text-muted-foreground mb-3">
                          {(currentTrack.audioFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="hover:bg-destructive/10 hover:text-destructive hover:border-destructive transition-colors"
                          onClick={(e) => {
                            e.preventDefault()
                            setCurrentTrack({ ...currentTrack, audioFile: null })
                          }}
                        >
                          Change
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <div className="w-16 h-16 mb-4 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                          <Upload className="w-8 h-8 text-primary" />
                        </div>
                        <p className="mb-2 text-base text-center">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-sm text-muted-foreground">WAV file only</p>
                      </div>
                    )}
                    <input
                      id="track-upload"
                      type="file"
                      className="hidden"
                      accept=".wav"
                      onChange={handleAudioUpload}
                    />
                  </label>
                </div>
                {errors.audioFile && <p className="text-xs text-red-500 font-medium">{errors.audioFile}</p>}
              </div>

              <div className="space-y-3 pt-2">
                <Label htmlFor="notes" className="text-base">
                  Additional Notes <span className="text-muted-foreground">(Optional)</span>
                </Label>
                <Textarea
                  id="notes"
                  placeholder="Any additional information about this track"
                  className="min-h-[120px] transition-all focus-visible:ring-primary/20"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between pt-6 border-t">
              <Button variant="outline" onClick={prevStep} size="lg" className="gap-2 transition-all hover:gap-3">
                <ArrowLeft className="h-4 w-4" />
                Previous
              </Button>
              <Button onClick={addTrackToRelease} size="lg" className="gap-2">
                Add Track
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Step 5: Review and Submit */}
        <TabsContent value="step-5" className="mt-0">
          <Card className="border-2 shadow-sm">
            <CardHeader className="pb-4 border-b">
              <CardTitle className="flex items-center gap-2 text-xl">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm">
                  5
                </span>
                Review and Submit
              </CardTitle>
              <CardDescription>Review your release information before submitting</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 pt-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <span className="w-2 h-6 bg-primary rounded-sm"></span>
                  Release Information
                </h3>
                <div className="grid grid-cols-2 gap-6 p-5 border rounded-md bg-card/50">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Album/Single Name</p>
                    <p className="font-medium text-base">{release.title || "Not set"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Release Date</p>
                    <p className="font-medium text-base">
                      {release.releaseDate ? format(release.releaseDate, "MMMM d, yyyy") : "Not set"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Label</p>
                    <p className="font-medium text-base">{release.label || "Not set"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">YouTube Content ID</p>
                    <p className="font-medium text-base">{release.youtubeContentId ? "Yes" : "No"}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground mb-2">Artwork</p>
                    {release.artwork && (
                      <div className="w-32 h-32 relative rounded-md overflow-hidden shadow-md">
                        <img
                          src={URL.createObjectURL(release.artwork) || "/placeholder.svg"}
                          alt="Artwork preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <span className="w-2 h-6 bg-blue-500 rounded-sm"></span>
                    Tracks
                  </h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setStep(2)}
                    className="gap-1 hover:gap-2 transition-all"
                  >
                    <Plus className="h-4 w-4" />
                    Add Another Track
                  </Button>
                </div>

                {release.tracks.length > 0 ? (
                  <div className="space-y-6">
                    {release.tracks.map((track, index) => (
                      <div key={index} className="p-5 border rounded-md space-y-5 bg-card/50 shadow-sm">
                        <div className="flex justify-between items-center border-b pb-3">
                          <h4 className="font-medium text-lg flex items-center gap-2">
                            <FileAudio className="h-5 w-5 text-primary" />
                            {track.name}
                          </h4>
                          <Badge variant={track.explicit ? "destructive" : "outline"} className="font-medium">
                            {track.explicit ? "Explicit" : "Clean"}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground mb-1">Language</p>
                            <p className="font-medium">{track.language}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground mb-1">Genre</p>
                            <p className="font-medium">{track.genre}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground mb-1">Sub-Genre</p>
                            <p className="font-medium">{track.subGenre || "Not specified"}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground mb-1">Mood</p>
                            <p className="font-medium">{track.mood || "Not specified"}</p>
                          </div>
                          {track.isrc && (
                            <div className="col-span-2">
                              <p className="text-muted-foreground mb-1">ISRC</p>
                              <p className="font-medium">{track.isrc}</p>
                            </div>
                          )}
                        </div>

                        <div className="space-y-3 border-t pt-3">
                          <p className="font-medium">Artists</p>
                          <div className="space-y-3">
                            <div>
                              <p className="text-sm text-muted-foreground mb-1">Primary Artists</p>
                              <p className="font-medium">{track.primaryArtists.map((a) => a.name).join(", ")}</p>
                            </div>
                            {track.featuringArtists.length > 0 && (
                              <div>
                                <p className="text-sm text-muted-foreground mb-1">Featuring</p>
                                <p className="font-medium">{track.featuringArtists.map((a) => a.name).join(", ")}</p>
                              </div>
                            )}
                            {track.lyricists.length > 0 && (
                              <div>
                                <p className="text-sm text-muted-foreground mb-1">Lyricists</p>
                                <p className="font-medium">{track.lyricists.map((a) => a.name).join(", ")}</p>
                              </div>
                            )}
                            {track.composers.length > 0 && (
                              <div>
                                <p className="text-sm text-muted-foreground mb-1">Composers</p>
                                <p className="font-medium">{track.composers.map((a) => a.name).join(", ")}</p>
                              </div>
                            )}
                            {track.producers.length > 0 && (
                              <div>
                                <p className="text-sm text-muted-foreground mb-1">Producers</p>
                                <p className="font-medium">{track.producers.map((a) => a.name).join(", ")}</p>
                              </div>
                            )}
                          </div>
                        </div>

                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Audio File</p>
                          <p className="flex items-center font-medium">
                            <FileAudio className="h-4 w-4 mr-2 text-primary" />
                            {track.audioFile?.name}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-10 border rounded-md bg-muted/40 text-center">
                    <p className="text-muted-foreground mb-4">No tracks added yet</p>
                    <Button variant="outline" onClick={() => setStep(2)} className="gap-2 hover:gap-3 transition-all">
                      <Plus className="h-4 w-4" />
                      Add Track
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between pt-6 border-t">
              <Button
                variant="outline"
                onClick={() => setStep(4)}
                size="lg"
                className="gap-2 transition-all hover:gap-3"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <Button
                onClick={handleCreateRelease}
                disabled={release.tracks.length === 0}
                size="lg"
                className="gap-2 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 hover:shadow-md transition-all"
              >
                <Sparkles className="h-4 w-4" />
                Create Release
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
