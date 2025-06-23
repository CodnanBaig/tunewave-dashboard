"use client"

import React, { useState, useCallback, useEffect } from "react"
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

type CRBT = {
  name: string
  timing: string
}

type Track = {
  id?: number
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
  crbts: CRBT[] // Add CRBTs to track type
}

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
  metaReleaseDate: null as Date | null, // Add meta release date
  label: "",
  youtubeContentId: false,
  artwork: null as File | null,
  tracks: [] as Track[],
  albumId: null as number | null, // Add album ID after creation
}

// Initial track state
const initialTrackState: Track = {
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
  crbts: [] as CRBT[], // Initialize empty CRBTs array
}

// API response type for album creation
type AlbumCreationResponse = {
  id: number
  albumTitle: string
  releaseDate: string
  liveDate: string
  uploadedOn: string
  releaseStatusId: number
  artworkUpload: string
  ytaf: string
  labelId: number
  artworkFile: string
  clientId: number
  userId: number
  metaReleaseDate: string
}

// API response type for track creation
type TrackCreationResponse = {
  id: number
  songTitle: string
  isrc: string
  explicit: string
  albumId: number
  languageId: number
  genreId: number
  subGenreId: number
  moodId: number
  crbtName1?: string
  crbtName2?: string
  crbtTiming1?: string
  crbtTiming2?: string
}

// Function to upload artwork and get URL - Remove this since we're uploading directly with the album
const uploadArtwork = async (file: File): Promise<string> => {
  console.log("📤 Artwork will be uploaded with album creation")
  // Return empty string since artwork will be uploaded with the album
  return ""
}

// API function to create track
const createTrack = async (trackData: {
  songTitle: string
  isrc: string
  explicit: string
  albumId: number
  languageId: number
  genreId: number
  subGenreId: number
  moodId: number
  crbtName1?: string
  crbtName2?: string
  crbtTiming1?: string
  crbtTiming2?: string
}): Promise<TrackCreationResponse> => {
  console.log("🎵 Creating track with data:", trackData)
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    const response = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + '/user/addrelease1', {
      method: 'POST',
      credentials: 'include', // Include cookies for authentication
      headers: {
        'Content-Type': 'application/json',
        'Client-ID': process.env.NEXT_PUBLIC_CLIENT_ID || '',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      body: JSON.stringify(trackData),
    })
    console.log("📡 Track API Response status:", response.status)
    if (!response.ok) {
      const errorText = await response.text()
      console.error("❌ Track API Error:", errorText)
      throw new Error(`Failed to create track: ${response.status} ${errorText}`)
    }
    const result = await response.json()
    console.log("✅ Track created successfully:", result)
    return result.data || result
  } catch (error) {
    console.error("💥 Error creating track:", error)
    throw error
  }
}

// API function to add artists to release (step 3)
const addArtistsToRelease = async (
  releaseId: number,
  artistList: { artistTypeId: number; artistId: number[] }[]
) => {
  try {
    const payload = { releaseId, artistList };
    console.log("🚀 Sending payload to /user/addrelease2:", JSON.stringify(payload, null, 2));

    const response = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + '/user/addrelease2', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Client-ID': process.env.NEXT_PUBLIC_CLIENT_ID || '',
      },
      body: JSON.stringify(payload),
    })
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Failed to add artists: ${response.status} ${errorText}`)
    }
    return await response.json()
  } catch (error) {
    console.error("💥 Error adding artists:", error)
    throw error
  }
}

// Helper to build artistList payload for /user/addrelease2
const artistTypeMap = {
  primary: 1,
  featuring: 2,
  lyricist: 3,
  composer: 4,
  producer: 5,
}

const buildArtistListPayload = (track: Track) => [
  { artistTypeId: artistTypeMap.primary, artistId: track.primaryArtists.map(a => Number(a.id)) },
  { artistTypeId: artistTypeMap.featuring, artistId: track.featuringArtists.map(a => Number(a.id)) },
  { artistTypeId: artistTypeMap.lyricist, artistId: track.lyricists.map(a => Number(a.id)) },
  { artistTypeId: artistTypeMap.composer, artistId: track.composers.map(a => Number(a.id)) },
  { artistTypeId: artistTypeMap.producer, artistId: track.producers.map(a => Number(a.id)) },
].filter(item => item.artistId.length > 0)

// API function to add a new artist
const addArtist = async (artistData: {
  artistName: string,
  legalName: string,
  spotifyURL?: string,
  youtubeURL?: string,
  appleURL?: string,
  instagramURL: string
}) => {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    const response = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + '/user/addArtist', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Client-ID': process.env.NEXT_PUBLIC_CLIENT_ID || '',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      body: JSON.stringify(artistData),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to add artist: ${response.status} ${errorText}`);
    }
    const result = await response.json();
    return result.data || result;
  } catch (error) {
    console.error("\uD83D\uDCA5 Error adding artist:", error);
    throw error;
  }
};

// API function to upload artwork for a release
const uploadArtworkApi = async (releaseId: number, artworkFile: File) => {
  const formData = new FormData()
  formData.append("releaseId", releaseId.toString())
  formData.append("artworkFile", artworkFile)

  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
    const response = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + "/user/uploadartwork", {
      method: "PUT",
      credentials: "include",
      headers: {
        "Client-ID": process.env.NEXT_PUBLIC_CLIENT_ID || "",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Failed to upload artwork: ${response.status} ${errorText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("💥 Error uploading artwork:", error)
    throw error
  }
}

// API function to upload audio file for a release
const uploadAudio = async (releaseId: number, audioFile: File) => {
  const formData = new FormData()
  formData.append("releaseId", releaseId.toString())
  formData.append("audioFile", audioFile)

  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
    const response = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + "/user/uploadaudio", {
      method: "PUT",
      credentials: "include",
      headers: {
        "Client-ID": process.env.NEXT_PUBLIC_CLIENT_ID || "",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Failed to upload audio: ${response.status} ${errorText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("💥 Error uploading audio:", error)
    throw error
  }
}

export default function NewReleasePage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [release, setRelease] = useState(initialReleaseState)
  const [currentTrack, setCurrentTrack] = useState<Track>(initialTrackState)
  const [newArtist, setNewArtist] = useState<Partial<Artist>>({})
  const [newArtistRole, setNewArtistRole] = useState<string>("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showNewArtistForm, setShowNewArtistForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Dynamic lists from backend
  const [languages, setLanguages] = useState<{ id: number; languageName: string }[]>([])
  const [genres, setGenres] = useState<{ id: number; genreName: string }[]>([])
  const [subGenres, setSubGenres] = useState<{ id: number; subGenreName: string; genreId: number; genre: { id: number; genreName: string } }[]>([])
  const [moods, setMoods] = useState<{ id: number; moodName: string }[]>([])
  const [labels, setLabels] = useState<{ id: number; labelName: string }[]>([])

  // State for all artists fetched from backend
  const [allArtists, setAllArtists] = useState<Artist[]>([]);

  // Use state for userId to ensure client-only access
  const [userId, setUserId] = useState<string | null>(null);

  // Set userId from localStorage on client
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUserId(localStorage.getItem('id'));
    }
  }, []);

  useEffect(() => {
    // Helper to fetch and set list
    const fetchList = async (endpoint: string, property: string, setter: (data: any) => void) => {
      try {
        const res = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + endpoint, {
          credentials: 'include',
          headers: { 
            'Client-ID': process.env.NEXT_PUBLIC_CLIENT_ID || '',
          },
        })
        
        if (!res.ok) {
          console.error(`Failed to fetch ${endpoint}:`, res.status, res.statusText)
          return
        }
        
        const data = await res.json()
        // Log the raw data for debugging
        console.log(`==== RAW DATA for ${endpoint} ====`, data)
        // Extract the correct property from the response
        const listData = Array.isArray(data[property]) ? data[property] : []
        console.log(`📋 Fetched ${endpoint}:`, listData)
        setter(listData)
      } catch (e) {
        console.error(`Failed to fetch ${endpoint}:`, e)
        // Set empty array on error to prevent mapping issues
        setter([])
      }
    }

    // Helper to fetch labels and ensure "Tunewave" is always an option
    const fetchLabels = async () => {
      try {
        const res = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + '/user/getlabel', {
          credentials: 'include',
          headers: {
            'Client-ID': process.env.NEXT_PUBLIC_CLIENT_ID || '',
          },
        })

        if (!res.ok) {
          console.error(`Failed to fetch labels:`, res.status, res.statusText)
          setLabels([{ id: 1, labelName: 'Tunewave' }]); // Default to Tunewave on failure
          return
        }

        const data = await res.json()
        console.log(`==== RAW DATA for /user/getlabel ====`, data)
        const listData = Array.isArray(data.labels) ? data.labels : []

        const tunewaveExists = listData.some(
            (label: any) => label.labelName.toLowerCase() === 'tunewave'
        );

        if (!tunewaveExists) {
          setLabels([{ id: 1, labelName: 'Tunewave' }, ...listData]);
        } else {
          setLabels(listData);
        }
      } catch (e) {
        console.error(`Failed to fetch labels:`, e)
        setLabels([{ id: 1, labelName: 'Tunewave' }]); // Default to Tunewave on error
      }
    }

    // Helper to fetch artists
    const fetchArtists = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/getArtist`,
          {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
              'Client-ID': process.env.NEXT_PUBLIC_CLIENT_ID || '',
            },
          }
        );
        if (!response.ok) throw new Error('Failed to fetch artists');
        const data = await response.json();
        console.log(`==== RAW DATA for /user/getArtist ====`, data)
        setAllArtists(
          Array.isArray(data.artists)
            ? data.artists.map((a: any) => ({
                id: String(a.id),
                name: a.artistName,
                legalName: a.legalName,
                instagram: a.instagramURL,
                spotify: a.spotifyURL,
                appleMusic: a.appleURL,
                youtube: a.youtubeURL,
                role: '', // role is set when selected
              }))
            : []
        )
        console.log(`📋 Fetched /user/getArtist:`, data.artists)
      } catch (e) {
        console.error(`Failed to fetch /user/getArtist:`, e)
        setAllArtists([])
      }
    }
    
    fetchList('/user/getlanguage', 'languages', setLanguages)
    fetchList('/user/getgenre', 'genre', setGenres)
    fetchList('/user/getsubgenre', 'subGenre', setSubGenres)
    fetchList('/user/getmood', 'moods', setMoods)
    fetchLabels()
    fetchArtists() // Add artists fetch here
    console.log(userId);
  }, [])

  const minReleaseDate = addDays(new Date(), 2)

  // API function to create album
  const createAlbum = async (albumData: {
    albumTitle: string
    releaseDate: string
    liveDate: string
    uploadedOn: string
    releaseStatusId: number
    ytaf: string
    labelId: number
    clientId: number
    userId: number
    metaReleaseDate?: string // Make optional
    remark?: string
  }): Promise<AlbumCreationResponse> => {
    console.log("🚀 Creating album with data:", albumData)
    
    try {
      // Create FormData for multipart upload
      const formData = new FormData()
      
      // Add the artwork file
      if (release.artwork) {
        formData.append('artworkFile', release.artwork)
      }
      
      // Add other fields as form data
      formData.append('albumTitle', albumData.albumTitle)
      formData.append('releaseDate', albumData.releaseDate)
      formData.append('liveDate', albumData.liveDate)
      formData.append('releaseStatusId', albumData.releaseStatusId.toString())
      formData.append('ytaf', albumData.ytaf)
      formData.append('labelId', albumData.labelId.toString())
      // Only append metaReleaseDate if it is a valid date string
      if (albumData.metaReleaseDate) {
        formData.append('metaReleaseDate', albumData.metaReleaseDate)
      }
      
      // Add optional fields if they exist
      if (albumData.remark) {
        formData.append('remark', albumData.remark)
      }

      console.log("📤 FormData YTAF value:", albumData.ytaf, "Type:", typeof albumData.ytaf, "Length:", albumData.ytaf.length)

      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
      const response = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + '/user/addAlbum', {
        method: 'POST',
        credentials: 'include', // Include cookies for authentication
        headers: {
          'Client-ID': process.env.NEXT_PUBLIC_CLIENT_ID || '',
          ...(token && { 'Authorization': `Bearer ${token}` }),
          // Don't set Content-Type for FormData, let the browser set it with boundary
        },
        body: formData,
      })

      console.log("📡 API Response status:", response.status)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error("❌ API Error:", errorText)
        throw new Error(`Failed to create album: ${response.status} ${errorText}`)
      }

      const result = await response.json()
      console.log("✅ Album created successfully:", result)
      return result.data // Return the data property from the response
    } catch (error) {
      console.error("💥 Error creating album:", error)
      throw error
    }
  }

  // Validation functions
  const validateReleaseInfo = () => {
    const newErrors: Record<string, string> = {}

    if (!release.title.trim()) {
      newErrors.title = "Album/Single name is required"
    }

    if (!release.releaseDate) {
      newErrors.releaseDate = "Release date is required"
    }

    if (release.metaReleaseDate && release.metaReleaseDate > release.releaseDate!) {
      newErrors.metaReleaseDate = "Meta release date cannot be after the actual release date"
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

    // Validate CRBTs
    if (currentTrack.crbts.length > 0) {
      currentTrack.crbts.forEach((crbt, index) => {
        if (!crbt.name.trim()) {
          newErrors[`crbtName${index}`] = "CRBT name is required"
        }
        if (!crbt.timing.trim()) {
          newErrors[`crbtTiming${index}`] = "CRBT timing is required"
        }
        // Validate timing format (MM:SS)
        if (crbt.timing.trim() && !/^\d{2}:\d{2}$/.test(crbt.timing.trim())) {
          newErrors[`crbtTiming${index}`] = "Timing must be in MM:SS format"
        }
      })
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
          release.artwork &&
          (!release.metaReleaseDate || release.metaReleaseDate <= release.releaseDate)
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

  // Handle next step with album creation for step 1
  const nextStep = useCallback(async () => {
    if (step === 1) {
      if (validateReleaseInfo()) {
        setIsSubmitting(true)
        try {
          console.log("🎵 Starting album creation process...")
          
          // Prepare album data
          const albumData = {
            albumTitle: release.title,
            releaseDate: release.releaseDate ? format(release.releaseDate, 'yyyy-MM-dd') : '',
            liveDate: release.releaseDate ? format(release.releaseDate, 'yyyy-MM-dd') : '',
            uploadedOn: format(new Date(), 'yyyy-MM-dd'),
            releaseStatusId: 1, // Default status - adjust as needed
            ytaf: release.youtubeContentId ? "YES" : "NO", // Convert boolean to ENUM values
            labelId: parseInt(release.label) || 1, // Convert label to ID - adjust mapping as needed
            clientId: 1, // Default client ID - adjust as needed
            userId: userId ? parseInt(userId) : 0, // Use userId from state
            metaReleaseDate: release.metaReleaseDate ? format(release.metaReleaseDate, 'yyyy-MM-dd') : undefined,
            remark: undefined // Optional remark field
          }

          console.log("📋 Prepared album data:", albumData)
          console.log("🔍 YTAF value:", albumData.ytaf, "Length:", albumData.ytaf.length)

          // Create album via API
          const albumResponse = await createAlbum(albumData)
          
          // Update release state with album ID
          setRelease(prev => ({
            ...prev,
            albumId: albumResponse.id
          }))

          console.log("🎉 Album created with ID:", albumResponse.id)
          console.log("📊 Moving to next step...")
          console.log("🔍 Current release state:", { ...release, albumId: albumResponse.id })
          
          setStep(2)
        } catch (error) {
          console.error("💥 Failed to create album:", error)
          // You might want to show an error message to the user here
          setErrors({ submit: error instanceof Error ? error.message : 'Failed to create album' })
        } finally {
          setIsSubmitting(false)
        }
      } else {
        console.log("❌ Validation failed for step 1")
      }
    } else if (step === 2) {
      if (validateTrackInfo()) {
        setIsSubmitting(true)
        try {
          console.log("🎵 Starting track creation process...")
          
          if (!release.albumId) {
            throw new Error("Album ID is required to create track")
          }

          console.log("🎵 Creating track for album ID:", release.albumId)

          // Prepare track data
          const trackData = {
            songTitle: currentTrack.name,
            isrc: currentTrack.isrc || "",
            explicit: currentTrack.explicit ? "YES" : "NO",
            albumId: release.albumId,
            languageId: Array.isArray(languages) && languages.find(l => l.languageName === currentTrack.language)?.id || 1,
            genreId: Array.isArray(genres) && genres.find(g => g.genreName === currentTrack.genre)?.id || 1,
            subGenreId: Array.isArray(subGenres) && subGenres.find(sg => sg.subGenreName === currentTrack.subGenre && sg.genre.genreName === currentTrack.genre)?.id || 1,
            moodId: Array.isArray(moods) && moods.find(m => m.moodName === currentTrack.mood)?.id || 1,
            crbtName1: currentTrack.crbts[0]?.name || undefined,
            crbtName2: currentTrack.crbts[1]?.name || undefined,
            crbtTiming1: currentTrack.crbts[0]?.timing || undefined,
            crbtTiming2: currentTrack.crbts[1]?.timing || undefined,
          }

          console.log("📋 Prepared track data:", trackData)

          // Create track via API
          const trackResponse = await createTrack(trackData)
          
          console.log("🎉 Track created with ID:", trackResponse.id)
          console.log("📊 Moving to next step...")
          
          setCurrentTrack(prev => ({
            ...prev,
            id: trackResponse.id
          }))

          setStep(3)
        } catch (error) {
          console.error("💥 Failed to create track:", error)
          setErrors({ submit: error instanceof Error ? error.message : 'Failed to create track' })
        } finally {
          setIsSubmitting(false)
        }
      } else {
        console.log("❌ Validation failed for step 2")
      }
    } else if (step === 3) {
      if (validateArtistInfo()) {
        setIsSubmitting(true)
        try {
          if (!currentTrack.id) throw new Error("Track ID is required")
          const artistList = buildArtistListPayload(currentTrack)
          await addArtistsToRelease(currentTrack.id, artistList)
          setStep(4)
        } catch (error) {
          setErrors({ submit: error instanceof Error ? error.message : "Failed to add artists" })
        } finally {
          setIsSubmitting(false)
        }
      } else {
        // validation error
      }
    } else if (isTabCompleted(step)) {
      setStep(step + 1)
    } else {
      // Run validation for current step to show errors
      switch (step) {
        case 3:
          validateArtistInfo()
          break
        case 4:
          validateAudioUpload()
          break
      }
    }
  }, [step, isTabCompleted, release, currentTrack, languages, genres, subGenres, moods])

  // Handle previous step
  const prevStep = () => {
    setStep(step - 1)
  }

  // Handle release creation completion
  const handleCreateRelease = () => {
    // In a real app, this would submit the release to an API
    console.log("🎵 Final release data:", {
      ...release,
      tracks: release.tracks,
    })

    // Redirect to the single release view using the first track's ID
    if (release.tracks.length > 0 && release.tracks[0].id) {
      const trackId = release.tracks[0].id
      console.log("🚀 Redirecting to release page with track ID:", trackId)
      router.push(`/releases/${trackId}`)
    } else {
      console.error("No track ID found, cannot redirect.")
      // Optionally, show an error to the user
      setErrors({ submit: "Could not finalize release, no track ID available." })
    }
  }

  // Handle adding the current track to the release
  const addTrackToRelease = async () => {
    if (validateAudioUpload()) {
      setIsSubmitting(true)
      try {
        if (!currentTrack.id || !currentTrack.audioFile) {
          throw new Error("Track ID and audio file are required")
        }
        await uploadAudio(currentTrack.id, currentTrack.audioFile)
        setRelease((prev) => ({
          ...prev,
          tracks: [...prev.tracks, currentTrack],
        }))

        // Reset current track for potential additional tracks
        setCurrentTrack(initialTrackState)

        // Go to step 5 to review
        setStep(5)
      } catch (error) {
        console.error("💥 Failed to upload audio:", error)
        setErrors({ submit: error instanceof Error ? error.message : 'Failed to upload audio' })
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  // Handle adding a new artist
  const handleAddNewArtist = async () => {
    if (validateNewArtist()) {
      setIsSubmitting(true);
      try {
        const apiArtist = await addArtist({
          artistName: newArtist.name!,
          legalName: newArtist.legalName!,
          spotifyURL: newArtist.spotify,
          youtubeURL: newArtist.youtube,
          appleURL: newArtist.appleMusic,
          instagramURL: newArtist.instagram!,
        });

        const artist: Artist = {
          id: String(apiArtist.id),
          name: apiArtist.artistName,
          legalName: apiArtist.legalName,
          instagram: apiArtist.instagramURL,
          spotify: apiArtist.spotifyURL,
          appleMusic: apiArtist.appleURL,
          youtube: apiArtist.youtubeURL,
          role: newArtistRole,
        };

        // Add the new artist to the allArtists list
        setAllArtists(prev => [...prev, artist]);

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
      } catch (error) {
        setErrors({ submit: error instanceof Error ? error.message : 'Failed to add artist' });
      } finally {
        setIsSubmitting(false);
      }
    }
  }

  // Handle adding an existing artist
  const handleAddExistingArtist = (artistId: string, role: string) => {
    const artist = allArtists.find((a) => a.id === artistId)

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

  // Refetch artists when step 3 is active to ensure the list is fresh
  useEffect(() => {
    console.log(`Artist fetch check: step=${step}, userId=${userId}`);
    if (step === 3 && userId) {
      console.log("Step 3 reached, artists already fetched in main useEffect");
    }
  }, [step, userId]);

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

      {/* Show API error if any */}
      {errors.submit && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{errors.submit}</AlertDescription>
        </Alert>
      )}

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

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-3">
                  <Label htmlFor="releaseDate" className="text-base">
                    Release Date <span className="text-red-500">*</span>
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
                        selected={release.releaseDate ? new Date(release.releaseDate) : undefined}
                        onSelect={(date) => setRelease({ ...release, releaseDate: date || null})}
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
                  <Label htmlFor="metaReleaseDate" className="text-base">
                    Meta Release Date <span className="text-muted-foreground">(Optional)</span>
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal h-11 text-base transition-all",
                          !release.metaReleaseDate && "text-muted-foreground",
                          errors.metaReleaseDate
                            ? "border-red-500 focus-visible:ring-red-300"
                            : "focus-visible:ring-primary/20",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-5 w-5" />
                        {release.metaReleaseDate ? format(release.metaReleaseDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={release.metaReleaseDate ? new Date(release.metaReleaseDate) : undefined}
                        onSelect={(date) => setRelease({ ...release, metaReleaseDate: date || null})}
                        disabled={(date) => date > (release.releaseDate || new Date())}
                        initialFocus
                        className="rounded-md border"
                      />
                    </PopoverContent>
                  </Popover>
                  <p className="text-xs text-muted-foreground">
                    Optional date for metadata purposes. Cannot be after the actual release date.
                  </p>
                  {errors.metaReleaseDate && <p className="text-xs text-red-500 font-medium">{errors.metaReleaseDate}</p>}
                </div>
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
                    {labels.map((label) => (
                      <SelectItem key={label.id} value={String(label.id)}>{label.labelName}</SelectItem>
                    ))}
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
                disabled={isSubmitting}
                size="lg"
                className="gap-2 transition-all hover:gap-3 bg-gradient-to-r from-primary to-primary/80 hover:shadow-md"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Creating Album...
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
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
                      {Array.isArray(languages) && languages.map(lang => (
                        <SelectItem key={lang.id} value={lang.languageName}>{lang.languageName}</SelectItem>
                      ))}
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
                    onValueChange={(value) => setCurrentTrack({ ...currentTrack, genre: value, subGenre: "" })}
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
                      {Array.isArray(genres) && genres.map(genre => (
                        <SelectItem key={genre.id} value={genre.genreName}>{genre.genreName}</SelectItem>
                      ))}
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
                      disabled={!currentTrack.genre}
                    >
                      <SelectValue placeholder={currentTrack.genre ? "Select sub-genre" : "Select genre first"} />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.isArray(subGenres) && subGenres
                        .filter(sg => !currentTrack.genre || sg.genre.genreName === currentTrack.genre)
                        .map(subGenre => (
                          <SelectItem key={subGenre.id} value={subGenre.subGenreName}>{subGenre.subGenreName}</SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  {!currentTrack.genre && (
                    <p className="text-xs text-muted-foreground">Please select a genre first</p>
                  )}
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
                      {Array.isArray(moods) && moods.map(mood => (
                        <SelectItem key={mood.id} value={mood.moodName}>{mood.moodName}</SelectItem>
                      ))}
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

              {/* CRBT Section */}
              <div className="space-y-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <span className="w-2 h-6 bg-purple-500 rounded-sm"></span>
                    CRBTs
                  </h3>
                  <Badge variant="outline" className="font-semibold">
                    Max 2
                  </Badge>
                </div>

                {/* Current CRBTs */}
                <div className="space-y-3">
                  {currentTrack.crbts.length > 0 ? (
                    currentTrack.crbts.map((crbt, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 border rounded-md bg-card hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex-1 grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm text-muted-foreground">CRBT Name</Label>
                            <Input
                              value={crbt.name}
                              onChange={(e) => {
                                const newCrbts = [...currentTrack.crbts]
                                newCrbts[index] = { ...crbt, name: e.target.value }
                                setCurrentTrack({ ...currentTrack, crbts: newCrbts })
                              }}
                              className={cn(
                                "h-9 mt-1",
                                errors[`crbtName${index}`] ? "border-red-500 focus-visible:ring-red-300" : "focus-visible:ring-primary/20"
                              )}
                              placeholder="Enter CRBT name"
                            />
                            {errors[`crbtName${index}`] && (
                              <p className="text-xs text-red-500 font-medium mt-1">{errors[`crbtName${index}`]}</p>
                            )}
                          </div>
                          <div>
                            <Label className="text-sm text-muted-foreground">Timing (MM:SS)</Label>
                            <Input
                              value={crbt.timing}
                              onChange={(e) => {
                                const newCrbts = [...currentTrack.crbts]
                                newCrbts[index] = { ...crbt, timing: e.target.value }
                                setCurrentTrack({ ...currentTrack, crbts: newCrbts })
                              }}
                              className={cn(
                                "h-9 mt-1",
                                errors[`crbtTiming${index}`] ? "border-red-500 focus-visible:ring-red-300" : "focus-visible:ring-primary/20"
                              )}
                              placeholder="00:00"
                            />
                            {errors[`crbtTiming${index}`] && (
                              <p className="text-xs text-red-500 font-medium mt-1">{errors[`crbtTiming${index}`]}</p>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newCrbts = currentTrack.crbts.filter((_, i) => i !== index)
                            setCurrentTrack({ ...currentTrack, crbts: newCrbts })
                          }}
                          className="ml-4 hover:bg-destructive/10 hover:text-destructive hover:border-destructive transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 border rounded-md bg-muted/40 text-center">
                      <p className="text-sm text-muted-foreground">No CRBTs added yet</p>
                    </div>
                  )}
                </div>

                {/* Add CRBT Button */}
                {currentTrack.crbts.length < 2 && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setCurrentTrack({
                        ...currentTrack,
                        crbts: [...currentTrack.crbts, { name: "", timing: "" }]
                      })
                    }}
                    className="w-full gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add CRBT
                  </Button>
                )}
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
                            {allArtists.map((artist) => (
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
                            {allArtists.map((artist) => (
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
                        >
                          <SelectTrigger className={cn(
                            "h-11 text-base transition-all focus-visible:ring-primary/20",
                            errors.lyricists && "border-red-500 focus-visible:ring-red-300"
                          )}>
                            <SelectValue placeholder="Select or add lyricist" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new" className="font-medium text-primary">
                              + Add New Lyricist
                            </SelectItem>
                            <Separator className="my-2" />
                            {allArtists.map((artist) => (
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
                            {allArtists.map((artist) => (
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
                        >
                          <SelectTrigger className={cn(
                            "h-11 text-base transition-all focus-visible:ring-primary/20",
                            errors.producers && "border-red-500 focus-visible:ring-red-300"
                          )}>
                            <SelectValue placeholder="Select or add producer" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new" className="font-medium text-primary">
                              + Add New Producer
                            </SelectItem>
                            <Separator className="my-2" />
                            {allArtists.map((artist) => (
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
                Upload
              </CardTitle>
              <CardDescription>Upload your track</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-3">
                <Label htmlFor="audioFile" className="text-base">
                  Audio File
                </Label>
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="audio-upload"
                    className={cn(
                      "flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-xl cursor-pointer bg-muted/30 hover:bg-muted/50 transition-colors",
                      errors.audioFile && "border-red-500",
                    )}
                  >
                    {currentTrack.audioFile ? (
                      <div className="flex flex-col items-center justify-center">
                        <div className="relative w-40 h-40 mb-2 rounded-xl overflow-hidden shadow-lg">
                          <img
                            src={URL.createObjectURL(currentTrack.audioFile) || "/placeholder.svg"}
                            alt="Audio preview"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                        </div>
                        <p className="text-sm text-muted-foreground">{currentTrack.audioFile.name}</p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2 hover:bg-destructive/10 hover:text-destructive hover:border-destructive transition-colors"
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
                        <div className="w-16 h-16 mb-2 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                          <FileAudio className="w-8 h-8 text-primary" />
                        </div>
                        <p className="mb-2 text-sm text-center">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground">MP3 or WAV (up to 10 minutes)</p>
                      </div>
                    )}
                    <input
                      id="audio-upload"
                      type="file"
                      className="hidden"
                      accept=".mp3,.wav"
                      onChange={handleAudioUpload}
                    />
                  </label>
                </div>
                {errors.audioFile && <p className="text-xs text-red-500 font-medium">{errors.audioFile}</p>}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between pt-6 border-t">
              <Button variant="outline" onClick={prevStep} size="lg" className="gap-2 transition-all hover:gap-3">
                <ArrowLeft className="h-4 w-4" />
                Previous
              </Button>
              <Button onClick={addTrackToRelease} size="lg" className="gap-2" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Adding Track...
                  </>
                ) : (
                  "Add Track"
                )}
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
              <CardDescription>Review your release before submission</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="rounded-xl border bg-card/50 p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 rounded-lg overflow-hidden shadow-md">
                    {release.artwork && (
                      <img
                        src={URL.createObjectURL(release.artwork)}
                        alt="Artwork"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{release.title}</h3>
                    <p className="text-muted-foreground">{release.label}</p>
                    {release.releaseDate && (
                      <p className="text-sm text-muted-foreground">
                        Releasing on: {format(release.releaseDate, "MMMM d, yyyy")}
                      </p>
                    )}
                  </div>
                </div>
                <Separator />
                <div>
                  <h4 className="font-medium mb-2">Tracks</h4>
                  <div className="space-y-2">
                    {release.tracks.map((track, index) => (
                      <div key={index} className="flex justify-between items-center p-2 rounded-md bg-muted/50">
                        <p>{track.name}</p>
                        <Badge variant="outline">{track.genre}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between pt-6 border-t">
              <Button variant="outline" onClick={prevStep} size="lg" className="gap-2 transition-all hover:gap-3">
                <ArrowLeft className="h-4 w-4" />
                Previous
              </Button>
              <Button onClick={handleCreateRelease} size="lg" className="gap-2 transition-all hover:gap-3 bg-gradient-to-r from-green-500 to-green-600 text-white hover:shadow-lg">
                <Sparkles className="h-4 w-4" />
                Submit Release
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
