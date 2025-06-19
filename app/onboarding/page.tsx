"use client"

import { useState, useEffect } from "react"
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
  mobileNumber: string
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
  mobileNumber?: string
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
    mobileNumber: "",
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
  const [error, setError] = useState<string | null>(null)

  // Get email from URL on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const emailFromUrl = urlParams.get('email')
    
    if (emailFromUrl) {
      setFormData(prev => ({ ...prev, email: emailFromUrl }))
    }
  }, [])

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
    
    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = "Mobile number is required"
    } else if (!/^[\+]?[1-9][\d]{0,15}$/.test(formData.mobileNumber.replace(/[\s\-\(\)]/g, ''))) {
      newErrors.mobileNumber = "Please enter a valid mobile number"
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

  const handleContinue = async () => {
    if (step === 1 && validateStep1()) {
      setIsLoading(true)
      
      try {
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
        if (!apiBaseUrl) {
          throw new Error("API base URL not configured")
        }

        // Step 1: Update user with personal information
        const personalData = {
          emailAddress: formData.email,
          name: formData.fullName,
          mobileNumber: formData.mobileNumber,
          countryId: getCountryId(formData.country),
          genderId: getGenderId(formData.gender),
          DOB: formatDateForAPI(formData.dateOfBirth)
        }

        console.log("Sending personal data:", personalData)

        const response = await fetch(`${apiBaseUrl}/user/updateUser`, {
          method: 'PUT',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Client-ID': process.env.NEXT_PUBLIC_CLIENT_ID || '',
          },
          body: JSON.stringify(personalData),
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.message || `Failed to update personal information: ${response.status}`)
        }

        const data = await response.json()
        console.log("Personal info update successful:", data)
        
        setFormComplete({ ...formComplete, personalInfo: true })
        setStep(2)
      } catch (err) {
        console.error("Personal info update error:", err)
        setError(err instanceof Error ? err.message : "Failed to update personal information. Please try again.")
      } finally {
        setIsLoading(false)
      }
    } else if (step === 2 && validateStep2()) {
      setIsLoading(true)
      
      try {
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
        if (!apiBaseUrl) {
          throw new Error("API base URL not configured")
        }

        // Step 2: Update user with address details
        const addressData = {
          address: formData.address,
          city: formData.city,
          pincode: formData.pincode,
          state: formData.state,
          userType: formData.artistType === "solo" ? "Artist" : "Label"
        }

        console.log("Sending address data:", addressData)

        const response = await fetch(`${apiBaseUrl}/user/updateUser`, {
          method: 'PUT',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Client-ID': process.env.NEXT_PUBLIC_CLIENT_ID || '',
          },
          body: JSON.stringify(addressData),
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.message || `Failed to update address information: ${response.status}`)
        }

        const data = await response.json()
        console.log("Address update successful:", data)
        
        setFormComplete({ ...formComplete, addressDetails: true })
        setStep(3)
      } catch (err) {
        console.error("Address update error:", err)
        setError(err instanceof Error ? err.message : "Failed to update address information. Please try again.")
      } finally {
        setIsLoading(false)
      }
    } else if (step === 3 && validateStep3()) {
      setIsLoading(true)
      
      try {
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
        if (!apiBaseUrl) {
          throw new Error("API base URL not configured")
        }

        // Step 3: KYC Verification using FormData
        const formDataToSend = new FormData()
        
        // Add common fields
        formDataToSend.append('accountNumber', formData.accountNumber)
        formDataToSend.append('accountHolderName', formData.accountHolderName)
        formDataToSend.append('bankName', formData.bankName)
        formDataToSend.append('isIndian', formData.isIndianNational!.toString())

        // Add conditional fields based on nationality
        if (formData.isIndianNational) {
          // Indian national fields
          if (formData.ifscCode) formDataToSend.append('IFSC', formData.ifscCode)
          if (formData.aadhaarFile) formDataToSend.append('aadharCard', formData.aadhaarFile)
          if (formData.pancardFile) formDataToSend.append('panCard', formData.pancardFile)
          // Add required fields for Indian nationals with "Not Applicable"
          formDataToSend.append('bankAddress', 'Not Applicable')
          formDataToSend.append('swiftOrBicCode', 'Not Applicable')
        } else {
          // International fields
          formDataToSend.append('swiftOrBicCode', formData.swiftCode || 'Not Applicable')
          formDataToSend.append('bankAddress', formData.bankAddress || 'Not Applicable')
          if (formData.passportFile) formDataToSend.append('passportOrGovId', formData.passportFile)
        }

        console.log("Sending KYC data via FormData")

        const response = await fetch(`${apiBaseUrl}/user/KYCVerification`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Client-ID': process.env.NEXT_PUBLIC_CLIENT_ID || '',
            // Note: Don't set Content-Type header - let browser set it with boundary for FormData
          },
          body: formDataToSend,
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.message || `Failed to complete KYC verification: ${response.status}`)
        }

        const data = await response.json()
        console.log("KYC verification successful:", data)
        
        // Navigate to releases page on success
        router.push("/releases")
        setIsLoading(false)
      } catch (err) {
        console.error("KYC verification error:", err)
        setError(err instanceof Error ? err.message : "Failed to complete KYC verification. Please try again.")
      }
    }
  }

  // Helper function to handle input changes and clear errors
  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear field error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field as keyof FormErrors]
        return newErrors
      })
    }
    // Clear API error when user makes changes
    if (error) {
      setError(null)
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
                alt="Tunewave Media"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Complete Your Profile</h1>
          <p className="mt-2 text-gray-400">
            Please provide your information to continue using TuneWave
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
              {error && (
                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}
              
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="font-medium text-gray-300">
                    Full Name
                  </Label>
                  <Input
                    id="fullName"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
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
                  <Input
                    id="mobileNumber"
                    type="tel"
                    placeholder="+91-9876543210"
                    value={formData.mobileNumber}
                    onChange={(e) => handleInputChange("mobileNumber", e.target.value)}
                    className={cn(
                      "h-11 border-gray-700 bg-gray-800/50 text-gray-100 placeholder:text-gray-500 focus:border-white focus:ring focus:ring-white/20",
                      errors.mobileNumber && "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                    )}
                  />
                  {errors.mobileNumber && <p className="text-sm text-red-500 mt-1">{errors.mobileNumber}</p>}
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
                  onChange={(e) => handleInputChange("email", e.target.value)}
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
                    onValueChange={(value) => handleInputChange("country", value)}
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
                    onValueChange={(value) => handleInputChange("gender", value)}
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
                  onChange={(date: Date | null) => handleInputChange("dateOfBirth", date || undefined)}
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
                className="px-8 bg-white text-black hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleContinue}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </div>
                ) : (
                  "Continue"
                )}
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
              {error && (
                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="address" className="font-medium text-gray-300">
                  Address
                </Label>
                <textarea
                  id="address"
                  rows={3}
                  placeholder="Enter your full address..."
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
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
                    onChange={(e) => handleInputChange("city", e.target.value)}
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
                    onChange={(e) => handleInputChange("pincode", e.target.value)}
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
                  onChange={(e) => handleInputChange("state", e.target.value)}
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
                  onValueChange={(value) => handleInputChange("artistType", value)}
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
                className="px-8 bg-white text-black hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleContinue}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </div>
                ) : (
                  "Continue"
                )}
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
              {error && (
                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                  <p className="text-sm text-red-400">{error}</p>
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
                      onClick={() => handleInputChange("isIndianNational", true)}
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
                      onClick={() => handleInputChange("isIndianNational", false)}
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
                          onChange={(e) => handleInputChange("accountNumber", e.target.value)}
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
                          onChange={(e) => handleInputChange("ifscCode", e.target.value.toUpperCase())}
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
                          onChange={(e) => handleInputChange("accountHolderName", e.target.value)}
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
                          onChange={(e) => handleInputChange("bankName", e.target.value)}
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
                          onChange={(e) => handleInputChange("accountNumber", e.target.value)}
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
                          onChange={(e) => handleInputChange("swiftCode", e.target.value.toUpperCase())}
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
                          onChange={(e) => handleInputChange("accountHolderName", e.target.value)}
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
                          onChange={(e) => handleInputChange("bankName", e.target.value)}
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
                          onChange={(e) => handleInputChange("bankAddress", e.target.value)}
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
                    handleInputChange("isIndianNational", null)
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
                onClick={handleContinue}
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
