"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { CalendarIcon, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

interface FormData {
  fullName: string
  email: string
  country: string
  gender: string
  dateOfBirth: Date | undefined
  genres: string[]
  artistType: string
  experience: string
  bio: string
}

interface FormErrors {
  fullName?: string
  email?: string
  country?: string
  gender?: string
  dateOfBirth?: string
  genres?: string
  artistType?: string
  experience?: string
  bio?: string
}

export default function OnboardingPage() {
  const router = useRouter()
  const [date, setDate] = useState<Date>()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    country: "",
    gender: "",
    dateOfBirth: undefined,
    genres: [],
    artistType: "",
    experience: "",
    bio: "",
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [formComplete, setFormComplete] = useState({
    personalInfo: false,
    preferences: false,
  })

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const validateStep1 = () => {
    const newErrors: FormErrors = {}
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required"
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email"
    }
    
    if (!formData.country) {
      newErrors.country = "Country is required"
    }
    
    if (!formData.gender) {
      newErrors.gender = "Gender is required"
    }
    
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = () => {
    const newErrors: FormErrors = {}
    
    if (formData.genres.length === 0) {
      newErrors.genres = "Please select at least one genre"
    }
    
    if (!formData.artistType) {
      newErrors.artistType = "Artist type is required"
    }
    
    if (!formData.experience) {
      newErrors.experience = "Experience level is required"
    }
    
    if (!formData.bio.trim()) {
      newErrors.bio = "Artist bio is required"
    } else if (formData.bio.trim().length < 50) {
      newErrors.bio = "Bio must be at least 50 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSaveProfile = () => {
    if (validateStep2()) {
      // In a real app, this would save the profile data
      console.log("Saving profile", formData)
      router.push("/releases")
    }
  }

  const handleContinue = () => {
    if (validateStep1()) {
      setFormComplete({ ...formComplete, personalInfo: true })
      setStep(2)
    }
  }

  const steps = [
    { id: 1, name: "Personal Information" },
    { id: 2, name: "Music Preferences" },
  ]

  return (
    <div className="grid place-items-center min-h-screen w-full bg-gradient-to-br from-gray-950 via-gray-900 to-black p-4 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-white/5 blur-3xl"></div>
        <div className="absolute top-1/4 -left-40 h-80 w-80 rounded-full bg-white/5 blur-3xl"></div>
        <div className="absolute bottom-20 right-1/4 h-60 w-60 rounded-full bg-white/5 blur-3xl"></div>
      </div>

      <div className="w-full max-w-4xl relative z-10 mx-auto">
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="relative w-48 h-16">
              <Image
                src="/SP Music Zone Logo.png"
                alt="SP Music Zone"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Complete Your Profile</h1>
          <p className="mt-2 text-gray-400">
            Please provide your information to continue using SP Music Zone
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-2">
            {steps.map((s, i) => (
              <div key={s.id} className="flex items-center">
                {i > 0 && <div className={`h-0.5 w-10 ${step > i ? "bg-white" : "bg-gray-700"}`} />}
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 
                    ${step >= s.id ? "border-white bg-white/10 text-white" : "border-gray-700 text-gray-500"}`}
                >
                  {formComplete[s.id === 1 ? "personalInfo" : "preferences"] ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    s.id
                  )}
                </div>
                {i < steps.length - 1 && (
                  <div className={`h-0.5 w-10 ${step > i + 1 ? "bg-white" : "bg-gray-700"}`} />
                )}
              </div>
            ))}
          </div>
          <div className="mt-2 flex justify-center">
            <span className="text-sm font-medium text-gray-300">{steps.find((s) => s.id === step)?.name}</span>
          </div>
        </div>

        {step === 1 && (
          <Card className="border border-gray-800 shadow-2xl bg-gray-900/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl text-white">Personal Information</CardTitle>
              <CardDescription className="text-gray-400">Enter your basic details to complete your profile</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="font-medium text-gray-300">
                    Full Name
                  </Label>
                  <Input
                    id="fullName"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className={cn(
                      "h-11 border-gray-700 bg-gray-800/50 text-gray-100 placeholder:text-gray-500 focus:border-white focus:ring focus:ring-white/20",
                      errors.fullName && "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                    )}
                  />
                  {errors.fullName && <p className="text-sm text-red-500 mt-1">{errors.fullName}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mobileNumber" className="font-medium text-gray-300">
                    Mobile Number
                  </Label>
                  <Input id="mobileNumber" value="+91-9876543210" disabled className="h-11 bg-gray-800/50 text-gray-400" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="font-medium text-gray-300">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john.doe@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={cn(
                    "h-11 border-gray-700 bg-gray-800/50 text-gray-100 placeholder:text-gray-500 focus:border-white focus:ring focus:ring-white/20",
                    errors.email && "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                  )}
                />
                {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="country" className="font-medium text-gray-300">
                    Country
                  </Label>
                  <Select
                    value={formData.country}
                    onValueChange={(value) => setFormData({ ...formData, country: value })}
                  >
                    <SelectTrigger 
                      id="country" 
                      className={cn(
                        "h-11 border-gray-700 bg-gray-800/50 text-gray-100",
                        errors.country && "border-red-500"
                      )}
                    >
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent className="border-gray-800">
                      <SelectItem value="india">India</SelectItem>
                      <SelectItem value="us">United States</SelectItem>
                      <SelectItem value="uk">United Kingdom</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.country && <p className="text-sm text-red-500 mt-1">{errors.country}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender" className="font-medium text-gray-300">
                    Gender
                  </Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) => setFormData({ ...formData, gender: value })}
                  >
                    <SelectTrigger 
                      id="gender" 
                      className={cn(
                        "h-11 border-gray-700 bg-gray-800/50 text-gray-100",
                        errors.gender && "border-red-500"
                      )}
                    >
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent className=" border-gray-800">
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="prefer-not-to-say">Prefer Not To Say</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.gender && <p className="text-sm text-red-500 mt-1">{errors.gender}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dob" className="font-medium text-gray-300">
                  Date of Birth
                </Label>
                <DatePicker
                  selected={formData.dateOfBirth || null}
                  onChange={(date: Date | null) => setFormData({ ...formData, dateOfBirth: date || undefined })}
                  dateFormat="dd/MM/yyyy"
                  showYearDropdown
                  showMonthDropdown
                  dropdownMode="select"
                  yearDropdownItemNumber={100}
                  scrollableYearDropdown
                  maxDate={new Date()}
                  minDate={new Date(1900, 0, 1)}
                  placeholderText="Select date of birth"
                  className={cn(
                    "w-full rounded-md border border-gray-700 bg-gray-800/50 p-3 text-sm text-gray-100 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white",
                    errors.dateOfBirth && "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                  )}
                  wrapperClassName="w-full"
                  popperClassName=" !border-gray-800 !text-gray-100"
                  popperPlacement="bottom-start"
                />
                {errors.dateOfBirth && <p className="text-sm text-red-500 mt-1">{errors.dateOfBirth}</p>}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t border-gray-800 bg-gray-900/50 p-6">
              <Button variant="outline" disabled className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white">
                Back
              </Button>
              <Button
                className="px-8 bg-white text-black hover:bg-gray-100"
                onClick={handleContinue}
              >
                Continue
              </Button>
            </CardFooter>
          </Card>
        )}

        {step === 2 && (
          <Card className="border border-gray-800 shadow-2xl bg-gray-900/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl text-white">Music Preferences</CardTitle>
              <CardDescription className="text-gray-400">Tell us about your music preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="genres" className="font-medium text-gray-300">
                  Favorite Genres
                </Label>
                <Select
                  value={formData.genres[0]}
                  onValueChange={(value) => setFormData({ ...formData, genres: [value] })}
                >
                  <SelectTrigger 
                    id="genres" 
                    className={cn(
                      "h-11 border-gray-700 bg-gray-800/50 text-gray-100",
                      errors.genres && "border-red-500"
                    )}
                  >
                    <SelectValue placeholder="Select genres" />
                  </SelectTrigger>
                  <SelectContent className="border-gray-800">
                    <SelectItem value="pop">Pop</SelectItem>
                    <SelectItem value="rock">Rock</SelectItem>
                    <SelectItem value="hiphop">Hip Hop</SelectItem>
                    <SelectItem value="electronic">Electronic</SelectItem>
                    <SelectItem value="classical">Classical</SelectItem>
                    <SelectItem value="jazz">Jazz</SelectItem>
                    <SelectItem value="folk">Folk</SelectItem>
                  </SelectContent>
                </Select>
                {errors.genres && <p className="text-sm text-red-500 mt-1">{errors.genres}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="artist-type" className="font-medium text-gray-300">
                  Artist Type
                </Label>
                <Select
                  value={formData.artistType}
                  onValueChange={(value) => setFormData({ ...formData, artistType: value })}
                >
                  <SelectTrigger 
                    id="artist-type" 
                    className={cn(
                      "h-11 border-gray-700 bg-gray-800/50 text-gray-100",
                      errors.artistType && "border-red-500"
                    )}
                  >
                    <SelectValue placeholder="Select artist type" />
                  </SelectTrigger>
                  <SelectContent className="border-gray-800">
                    <SelectItem value="solo">Solo Artist</SelectItem>
                    <SelectItem value="band">Band</SelectItem>
                    <SelectItem value="producer">Producer</SelectItem>
                    <SelectItem value="composer">Composer</SelectItem>
                    <SelectItem value="dj">DJ</SelectItem>
                  </SelectContent>
                </Select>
                {errors.artistType && <p className="text-sm text-red-500 mt-1">{errors.artistType}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience" className="font-medium text-gray-300">
                  Music Experience
                </Label>
                <Select
                  value={formData.experience}
                  onValueChange={(value) => setFormData({ ...formData, experience: value })}
                >
                  <SelectTrigger 
                    id="experience" 
                    className={cn(
                      "h-11 border-gray-700 bg-gray-800/50 text-gray-100",
                      errors.experience && "border-red-500"
                    )}
                  >
                    <SelectValue placeholder="Select experience level" />
                  </SelectTrigger>
                  <SelectContent className="border-gray-800">
                    <SelectItem value="beginner">Beginner (0-2 years)</SelectItem>
                    <SelectItem value="intermediate">Intermediate (3-5 years)</SelectItem>
                    <SelectItem value="advanced">Advanced (5-10 years)</SelectItem>
                    <SelectItem value="professional">Professional (10+ years)</SelectItem>
                  </SelectContent>
                </Select>
                {errors.experience && <p className="text-sm text-red-500 mt-1">{errors.experience}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio" className="font-medium text-gray-300">
                  Artist Bio
                </Label>
                <textarea
                  id="bio"
                  rows={4}
                  placeholder="Tell us about yourself as an artist..."
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className={cn(
                    "w-full rounded-md border border-gray-700 bg-gray-800/50 p-3 text-sm text-gray-100 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white",
                    errors.bio && "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                  )}
                />
                {errors.bio && <p className="text-sm text-red-500 mt-1">{errors.bio}</p>}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t border-gray-800 bg-gray-900/50 p-6">
              <Button 
                variant="outline" 
                onClick={() => setStep(1)} 
                className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
              >
                Back
              </Button>
              <Button
                className="px-8 bg-white text-black hover:bg-gray-100"
                onClick={handleSaveProfile}
              >
                Complete Profile
              </Button>
            </CardFooter>
          </Card>
        )}

        <div className="mt-6 text-center text-sm text-gray-500">
          By continuing, you agree to our{" "}
          <a href="#" className="text-white hover:text-gray-300">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-white hover:text-gray-300">
            Privacy Policy
          </a>
        </div>
      </div>
    </div>
  )
}
