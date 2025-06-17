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
  address: string
  city: string
  pincode: string
  state: string
  artistType: string
  experience: string
  isIndianNational: boolean | null
  pancardFile: File | null
  aadhaarFile: File | null
  passportFile: File | null
  accountNumber: string
  ifscCode: string
  swiftCode: string
  accountHolderName: string
  bankName: string
  bankAddress: string
}

interface FormErrors {
  fullName?: string
  email?: string
  country?: string
  gender?: string
  dateOfBirth?: string
  address?: string
  city?: string
  pincode?: string
  state?: string
  artistType?: string
  experience?: string
  isIndianNational?: string
  pancardFile?: string
  aadhaarFile?: string
  passportFile?: string
  accountNumber?: string
  ifscCode?: string
  swiftCode?: string
  accountHolderName?: string
  bankName?: string
  bankAddress?: string
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
    address: "",
    city: "",
    pincode: "",
    state: "",
    artistType: "",
    experience: "",
    isIndianNational: null,
    pancardFile: null,
    aadhaarFile: null,
    passportFile: null,
    accountNumber: "",
    ifscCode: "",
    swiftCode: "",
    accountHolderName: "",
    bankName: "",
    bankAddress: "",
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [formComplete, setFormComplete] = useState({
    personalInfo: false,
    addressDetails: false,
    kycDetails: false,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)

  // Helper function to convert country name to ID
  const getCountryId = (country: string): number => {
    const countryMap: { [key: string]: number } = {
      "india": 1,
      "us": 2,
      "uk": 3,
      "other": 4
    }
    return countryMap[country] || 1
  }

  // Helper function to convert gender to ID
  const getGenderId = (gender: string): number => {
    const genderMap: { [key: string]: number } = {
      "male": 1,
      "female": 2,
      "other": 3,
      "prefer-not-to-say": 4
    }
    return genderMap[gender] || 1
  }

  // Helper function to format date for API
  const formatDateForAPI = (date: Date | undefined): string => {
    if (!date) return ""
    return date.toISOString().split('T')[0] // Format as YYYY-MM-DD
  }

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
    
    if (!formData.address.trim()) {
      newErrors.address = "Address is required"
    }
    
    if (!formData.city.trim()) {
      newErrors.city = "City is required"
    }
    
    if (!formData.pincode.trim()) {
      newErrors.pincode = "Pincode is required"
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = "Please enter a valid 6-digit pincode"
    }
    
    if (!formData.state.trim()) {
      newErrors.state = "State is required"
    }
    
    if (!formData.artistType) {
      newErrors.artistType = "User type is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep3 = () => {
    const newErrors: FormErrors = {}
    
    if (formData.isIndianNational === null) {
      newErrors.isIndianNational = "Please select your nationality"
      setErrors(newErrors)
      return false
    }

    if (formData.isIndianNational) {
      // Validate Indian KYC documents
      if (!formData.pancardFile) {
        newErrors.pancardFile = "PAN Card is required"
      }
      if (!formData.aadhaarFile) {
        newErrors.aadhaarFile = "Aadhaar Card is required"
      }
      
      // Validate Indian bank details
      if (!formData.accountNumber.trim()) {
        newErrors.accountNumber = "Account number is required"
      }
      if (!formData.ifscCode.trim()) {
        newErrors.ifscCode = "IFSC code is required"
      } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifscCode)) {
        newErrors.ifscCode = "Please enter a valid IFSC code"
      }
      if (!formData.accountHolderName.trim()) {
        newErrors.accountHolderName = "Account holder name is required"
      }
      if (!formData.bankName.trim()) {
        newErrors.bankName = "Bank name is required"
      }
    } else {
      // Validate International KYC documents
      if (!formData.passportFile) {
        newErrors.passportFile = "Passport or Government ID is required"
      }
      
      // Validate International bank details
      if (!formData.accountNumber.trim()) {
        newErrors.accountNumber = "Account number is required"
      }
      if (!formData.swiftCode.trim()) {
        newErrors.swiftCode = "SWIFT/BIC code is required"
      } else if (!/^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(formData.swiftCode)) {
        newErrors.swiftCode = "Please enter a valid SWIFT/BIC code"
      }
      if (!formData.accountHolderName.trim()) {
        newErrors.accountHolderName = "Account holder name is required"
      }
      if (!formData.bankName.trim()) {
        newErrors.bankName = "Bank name is required"
      }
      if (!formData.bankAddress.trim()) {
        newErrors.bankAddress = "Bank address is required"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSaveProfile = async () => {
    if (validateStep3()) {
      setIsLoading(true)
      setApiError(null)

      try {
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
        if (!apiBaseUrl) {
          throw new Error("API base URL not configured")
        }

        // Step 1: Complete Profile
        const profileData = {
          emailAddress: formData.email,
          password: "", // This should come from the auth step, but for now we'll leave it empty
          name: formData.fullName,
          mobileNumber: "+91-9876543210", // This is hardcoded in the UI, should be dynamic
          countryId: getCountryId(formData.country),
          genderId: getGenderId(formData.gender),
          DOB: formatDateForAPI(formData.dateOfBirth),
          address: formData.address,
          city: formData.city,
          pincode: formData.pincode,
          state: formData.state,
          userType: formData.artistType === "solo" ? "Artist" : "Label"
        }

        console.log("Sending profile data:", profileData)

        const profileResponse = await fetch(`${apiBaseUrl}/tunewave/completeProfile`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Client-ID': process.env.NEXT_PUBLIC_CLIENT_ID || '',
          },
          body: JSON.stringify(profileData),
        })

        if (!profileResponse.ok) {
          const errorData = await profileResponse.json().catch(() => ({}))
          throw new Error(errorData.message || `Profile completion failed: ${profileResponse.status}`)
        }

        const profileResult = await profileResponse.json()
        console.log("Profile completion successful:", profileResult)

        // Step 2: KYC Verification
        const kycData = {
          accountNumber: formData.accountNumber,
          IFSC: formData.isIndianNational ? formData.ifscCode : "",
          accountHolderName: formData.accountHolderName,
          bankName: formData.bankName,
          bankAddress: formData.isIndianNational ? "" : formData.bankAddress,
          swiftOrBicCode: formData.isIndianNational ? "" : formData.swiftCode,
          isIndian: formData.isIndianNational,
          aadharCard: formData.isIndianNational && formData.aadhaarFile ? await fileToBase64(formData.aadhaarFile) : "",
          panCard: formData.isIndianNational && formData.pancardFile ? await fileToBase64(formData.pancardFile) : "",
          passportOrGovId: !formData.isIndianNational && formData.passportFile ? await fileToBase64(formData.passportFile) : ""
        }

        console.log("Sending KYC data:", { ...kycData, aadharCard: "base64_data", panCard: "base64_data", passportOrGovId: "base64_data" })

        const kycResponse = await fetch(`${apiBaseUrl}/tunewave/KYCVerification`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Client-ID': process.env.NEXT_PUBLIC_CLIENT_ID || '',
          },
          body: JSON.stringify(kycData),
        })

        if (!kycResponse.ok) {
          const errorData = await kycResponse.json().catch(() => ({}))
          throw new Error(errorData.message || `KYC verification failed: ${kycResponse.status}`)
        }

        const kycResult = await kycResponse.json()
        console.log("KYC verification successful:", kycResult)
        
        // Navigate to releases page on success
        router.push("/releases")
      } catch (err) {
        console.error("Profile/KYC completion error:", err)
        setApiError(err instanceof Error ? err.message : "Profile completion failed. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }
  }

  // Helper function to convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        const base64String = reader.result as string
        // Remove the data URL prefix (e.g., "data:application/pdf;base64,")
        const base64 = base64String.split(',')[1]
        resolve(base64)
      }
      reader.onerror = error => reject(error)
    })
  }

  const handleContinue = () => {
    if (step === 1 && validateStep1()) {
      setFormComplete({ ...formComplete, personalInfo: true })
      setStep(2)
    } else if (step === 2 && validateStep2()) {
      setFormComplete({ ...formComplete, addressDetails: true })
      setStep(3)
    }
  }

  const steps = [
    { id: 1, name: "Personal Information" },
    { id: 2, name: "Address Details" },
    { id: 3, name: "KYC Verification" },
  ]

  const handleFileChange = (field: keyof FormData, file: File | null) => {
    setFormData({ ...formData, [field]: file })
  }

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
            <div className="relative w-52 h-16">
              <Image
                src="/logo.png"
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
                  {formComplete[s.id === 1 ? "personalInfo" : s.id === 2 ? "addressDetails" : "kycDetails"] ? (
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
              <CardTitle className="text-2xl text-white">Address Details</CardTitle>
              <CardDescription className="text-gray-400">Please provide your address information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="address" className="font-medium text-gray-300">
                  Address
                </Label>
                <textarea
                  id="address"
                  rows={3}
                  placeholder="Enter your full address..."
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className={cn(
                    "w-full rounded-md border border-gray-700 bg-gray-800/50 p-3 text-sm text-gray-100 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white",
                    errors.address && "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                  )}
                />
                {errors.address && <p className="text-sm text-red-500 mt-1">{errors.address}</p>}
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="city" className="font-medium text-gray-300">
                    City
                  </Label>
                  <Input
                    id="city"
                    placeholder="Enter your city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className={cn(
                      "h-11 border-gray-700 bg-gray-800/50 text-gray-100 placeholder:text-gray-500 focus:border-white focus:ring focus:ring-white/20",
                      errors.city && "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                    )}
                  />
                  {errors.city && <p className="text-sm text-red-500 mt-1">{errors.city}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pincode" className="font-medium text-gray-300">
                    Pincode
                  </Label>
                  <Input
                    id="pincode"
                    placeholder="Enter 6-digit pincode"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    className={cn(
                      "h-11 border-gray-700 bg-gray-800/50 text-gray-100 placeholder:text-gray-500 focus:border-white focus:ring focus:ring-white/20",
                      errors.pincode && "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                    )}
                  />
                  {errors.pincode && <p className="text-sm text-red-500 mt-1">{errors.pincode}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="state" className="font-medium text-gray-300">
                  State
                </Label>
                <Input
                  id="state"
                  placeholder="Enter your state"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className={cn(
                    "h-11 border-gray-700 bg-gray-800/50 text-gray-100 placeholder:text-gray-500 focus:border-white focus:ring focus:ring-white/20",
                    errors.state && "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                  )}
                />
                {errors.state && <p className="text-sm text-red-500 mt-1">{errors.state}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="artist-type" className="font-medium text-gray-300">
                  User Type
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
                    <SelectItem value="solo">Artist</SelectItem>
                    <SelectItem value="label">Label</SelectItem>
                  </SelectContent>
                </Select>
                {errors.artistType && <p className="text-sm text-red-500 mt-1">{errors.artistType}</p>}
              </div>

              {/* <div className="space-y-2">
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
              </div> */}
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
                onClick={handleContinue}
              >
                Continue
              </Button>
            </CardFooter>
          </Card>
        )}

        {step === 3 && (
          <Card className="border border-gray-800 shadow-2xl bg-gray-900/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl text-white">KYC Verification</CardTitle>
              <CardDescription className="text-gray-400">
                Please provide your verification documents and bank details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {apiError && (
                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                  <p className="text-sm text-red-400">{apiError}</p>
                </div>
              )}
              
              {formData.isIndianNational === null ? (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white">Are you an Indian National?</h3>
                  <div className="flex gap-4">
                    <Button
                      variant={formData.isIndianNational === true ? "default" : "outline"}
                      className={cn(
                        "flex-1 h-12",
                        formData.isIndianNational === true
                          ? "bg-white text-black hover:bg-gray-100"
                          : "border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                      )}
                      onClick={() => setFormData({ ...formData, isIndianNational: true })}
                    >
                      Yes
                    </Button>
                    <Button
                      variant={formData.isIndianNational === false ? "default" : "outline"}
                      className={cn(
                        "flex-1 h-12",
                        formData.isIndianNational === false
                          ? "bg-white text-black hover:bg-gray-100"
                          : "border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                      )}
                      onClick={() => setFormData({ ...formData, isIndianNational: false })}
                    >
                      No
                    </Button>
                  </div>
                  {errors.isIndianNational && (
                    <p className="text-sm text-red-500 mt-1">{errors.isIndianNational}</p>
                  )}
                </div>
              ) : formData.isIndianNational ? (
                <>
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-white">Indian KYC Documents</h3>
                    <div className="space-y-2">
                      <Label htmlFor="pancard" className="font-medium text-gray-300">
                        PAN Card
                      </Label>
                      <Input
                        id="pancard"
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileChange("pancardFile", e.target.files?.[0] || null)}
                        className={cn(
                          "h-11 border-gray-700 bg-gray-800/50 text-gray-100 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-white/10 file:text-white hover:file:bg-white/20",
                          errors.pancardFile && "border-red-500"
                        )}
                      />
                      {errors.pancardFile && <p className="text-sm text-red-500 mt-1">{errors.pancardFile}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="aadhaar" className="font-medium text-gray-300">
                        Aadhaar Card
                      </Label>
                      <Input
                        id="aadhaar"
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileChange("aadhaarFile", e.target.files?.[0] || null)}
                        className={cn(
                          "h-11 border-gray-700 bg-gray-800/50 text-gray-100 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-white/10 file:text-white hover:file:bg-white/20",
                          errors.aadhaarFile && "border-red-500"
                        )}
                      />
                      {errors.aadhaarFile && <p className="text-sm text-red-500 mt-1">{errors.aadhaarFile}</p>}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-white">Indian Bank Details</h3>
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="accountNumber" className="font-medium text-gray-300">
                          Account Number
                        </Label>
                        <Input
                          id="accountNumber"
                          value={formData.accountNumber}
                          onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                          className={cn(
                            "h-11 border-gray-700 bg-gray-800/50 text-gray-100",
                            errors.accountNumber && "border-red-500"
                          )}
                        />
                        {errors.accountNumber && <p className="text-sm text-red-500 mt-1">{errors.accountNumber}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="ifscCode" className="font-medium text-gray-300">
                          IFSC Code
                        </Label>
                        <Input
                          id="ifscCode"
                          value={formData.ifscCode}
                          onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value.toUpperCase() })}
                          className={cn(
                            "h-11 border-gray-700 bg-gray-800/50 text-gray-100",
                            errors.ifscCode && "border-red-500"
                          )}
                        />
                        {errors.ifscCode && <p className="text-sm text-red-500 mt-1">{errors.ifscCode}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="accountHolderName" className="font-medium text-gray-300">
                          Account Holder Name
                        </Label>
                        <Input
                          id="accountHolderName"
                          value={formData.accountHolderName}
                          onChange={(e) => setFormData({ ...formData, accountHolderName: e.target.value })}
                          className={cn(
                            "h-11 border-gray-700 bg-gray-800/50 text-gray-100",
                            errors.accountHolderName && "border-red-500"
                          )}
                        />
                        {errors.accountHolderName && <p className="text-sm text-red-500 mt-1">{errors.accountHolderName}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bankName" className="font-medium text-gray-300">
                          Bank Name
                        </Label>
                        <Input
                          id="bankName"
                          value={formData.bankName}
                          onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                          className={cn(
                            "h-11 border-gray-700 bg-gray-800/50 text-gray-100",
                            errors.bankName && "border-red-500"
                          )}
                        />
                        {errors.bankName && <p className="text-sm text-red-500 mt-1">{errors.bankName}</p>}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-white">International KYC Documents</h3>
                    <div className="space-y-2">
                      <Label htmlFor="passport" className="font-medium text-gray-300">
                        Passport or Government ID
                      </Label>
                      <Input
                        id="passport"
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileChange("passportFile", e.target.files?.[0] || null)}
                        className={cn(
                          "h-11 border-gray-700 bg-gray-800/50 text-gray-100 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-white/10 file:text-white hover:file:bg-white/20",
                          errors.passportFile && "border-red-500"
                        )}
                      />
                      {errors.passportFile && <p className="text-sm text-red-500 mt-1">{errors.passportFile}</p>}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-white">International Bank Details</h3>
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="accountNumber" className="font-medium text-gray-300">
                          Account Number
                        </Label>
                        <Input
                          id="accountNumber"
                          value={formData.accountNumber}
                          onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                          className={cn(
                            "h-11 border-gray-700 bg-gray-800/50 text-gray-100",
                            errors.accountNumber && "border-red-500"
                          )}
                        />
                        {errors.accountNumber && <p className="text-sm text-red-500 mt-1">{errors.accountNumber}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="swiftCode" className="font-medium text-gray-300">
                          SWIFT/BIC Code
                        </Label>
                        <Input
                          id="swiftCode"
                          value={formData.swiftCode}
                          onChange={(e) => setFormData({ ...formData, swiftCode: e.target.value.toUpperCase() })}
                          className={cn(
                            "h-11 border-gray-700 bg-gray-800/50 text-gray-100",
                            errors.swiftCode && "border-red-500"
                          )}
                        />
                        {errors.swiftCode && <p className="text-sm text-red-500 mt-1">{errors.swiftCode}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="accountHolderName" className="font-medium text-gray-300">
                          Account Holder Name
                        </Label>
                        <Input
                          id="accountHolderName"
                          value={formData.accountHolderName}
                          onChange={(e) => setFormData({ ...formData, accountHolderName: e.target.value })}
                          className={cn(
                            "h-11 border-gray-700 bg-gray-800/50 text-gray-100",
                            errors.accountHolderName && "border-red-500"
                          )}
                        />
                        {errors.accountHolderName && <p className="text-sm text-red-500 mt-1">{errors.accountHolderName}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bankName" className="font-medium text-gray-300">
                          Bank Name
                        </Label>
                        <Input
                          id="bankName"
                          value={formData.bankName}
                          onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                          className={cn(
                            "h-11 border-gray-700 bg-gray-800/50 text-gray-100",
                            errors.bankName && "border-red-500"
                          )}
                        />
                        {errors.bankName && <p className="text-sm text-red-500 mt-1">{errors.bankName}</p>}
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="bankAddress" className="font-medium text-gray-300">
                          Bank Address
                        </Label>
                        <textarea
                          id="bankAddress"
                          rows={3}
                          value={formData.bankAddress}
                          onChange={(e) => setFormData({ ...formData, bankAddress: e.target.value })}
                          className={cn(
                            "w-full rounded-md border border-gray-700 bg-gray-800/50 p-3 text-sm text-gray-100 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white",
                            errors.bankAddress && "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                          )}
                        />
                        {errors.bankAddress && <p className="text-sm text-red-500 mt-1">{errors.bankAddress}</p>}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
            <CardFooter className="flex justify-between border-t border-gray-800 bg-gray-900/50 p-6">
              <Button 
                variant="outline" 
                onClick={() => {
                  if (formData.isIndianNational !== null) {
                    setFormData({ ...formData, isIndianNational: null })
                  } else {
                    setStep(2)
                  }
                }}
                disabled={isLoading}
                className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
              >
                Back
              </Button>
              <Button
                className="px-8 bg-white text-black hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleSaveProfile}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    Completing...
                  </div>
                ) : (
                  "Complete Profile"
                )}
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
