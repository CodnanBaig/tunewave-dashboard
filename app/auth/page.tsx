"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { ArrowRight } from "lucide-react"

export default function AuthPage() {
  const router = useRouter()
  const [step, setStep] = useState<"phone" | "otp">("phone")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [isLoading, setIsLoading] = useState(false)
  const [focusedInput, setFocusedInput] = useState<number | null>(null)

  // Add validation function
  const isValidPhoneNumber = (phone: string) => {
    // Remove any non-digit characters and check if length is exactly 10
    const digitsOnly = phone.replace(/\D/g, '')
    return digitsOnly.length === 10
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Only allow digits, +, and -
    const sanitizedValue = value.replace(/[^\d+-]/g, '')
    setPhoneNumber(sanitizedValue)
  }

  const handleSendOTP = () => {
    if (!phoneNumber) return

    setIsLoading(true)
    // In a real app, this would call an API to send OTP
    setTimeout(() => {
      console.log("Sending OTP to", phoneNumber)
      setStep("otp")
      setIsLoading(false)
    }, 1000)
  }

  const handleVerifyOTP = () => {
    if (otp.some((digit) => !digit)) return

    setIsLoading(true)
    // In a real app, this would verify the OTP
    setTimeout(() => {
      console.log("Verifying OTP", otp.join(""))
      // Redirect to onboarding page after OTP verification
      router.push("/onboarding")
    }, 1000)
  }

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(0, 1)
    }

    if (value && !/^\d+$/.test(value)) {
      return
    }

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      if (nextInput) {
        nextInput.focus()
      }
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`)
      if (prevInput) {
        prevInput.focus()
      }
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text")
    if (!/^\d+$/.test(pastedData)) return

    const digits = pastedData.slice(0, 6).split("")
    const newOtp = [...otp]

    digits.forEach((digit, index) => {
      if (index < 6) {
        newOtp[index] = digit
      }
    })

    setOtp(newOtp)
  }

  return (
    <div className="grid place-items-center min-h-screen w-full bg-gradient-to-br from-background to-background/80 p-4 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-white/5 blur-3xl"></div>
        <div className="absolute top-1/4 -left-40 h-80 w-80 rounded-full bg-white/5 blur-3xl"></div>
        <div className="absolute bottom-20 right-1/4 h-60 w-60 rounded-full bg-white/5 blur-3xl"></div>
      </div>

      <div className="w-full max-w-xl relative z-10 mx-auto">
        <Card className="border-none shadow-lg bg-card/80 backdrop-blur-sm">
          <CardHeader className="space-y-4 text-center pb-6">
            <div className="flex justify-center">
              <div className="relative w-48 h-16">
                <Image
                  src="/logo.png"
                  alt="SP Music Zone"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
            <div>
              <CardDescription className="text-muted-foreground mt-2">
                {step === "phone"
                  ? "Enter your mobile number to continue"
                  : "Enter the verification code sent to your mobile"}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 px-6">
            {step === "phone" ? (
              <div className="space-y-3">
                <Label htmlFor="phone" className="text-sm font-medium">
                  Mobile Number
                </Label>
                <div className="relative">
                  <Input
                    id="phone"
                    placeholder="+91-XXXXXXXXXX"
                    value={phoneNumber}
                    onChange={handlePhoneChange}
                    className={`pl-4 h-12 rounded-lg border-border/50 bg-background/50 focus-visible:ring-primary/20 ${
                      focusedInput === 0 ? "border-primary ring ring-primary/20" : ""
                    }`}
                    onFocus={() => setFocusedInput(0)}
                    onBlur={() => setFocusedInput(null)}
                  />
                  {phoneNumber && !isValidPhoneNumber(phoneNumber) && (
                    <p className="text-sm text-destructive mt-1">
                      Please enter a valid 10-digit phone number
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <Label htmlFor="otp" className="text-sm font-medium">
                  Verification Code
                </Label>
                <div className="flex justify-between gap-2">
                  {otp.map((digit, index) => (
                    <Input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={index === 0 ? handlePaste : undefined}
                      maxLength={1}
                      className={`w-12 h-12 text-center text-lg font-medium rounded-lg border-border/50 bg-background/50 focus-visible:ring-primary/20 ${
                        focusedInput === index ? "border-primary ring ring-primary/20" : ""
                      }`}
                      onFocus={() => setFocusedInput(index)}
                      onBlur={() => setFocusedInput(null)}
                    />
                  ))}
                </div>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-sm text-muted-foreground">Code sent to {phoneNumber}</p>
                  <Button
                    variant="link"
                    className="p-0 h-auto text-primary hover:text-primary/90"
                    onClick={() => setStep("phone")}
                  >
                    Change
                  </Button>
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="px-6 pb-6">
            <Button
              className="w-full h-12 bg-gradient-primary hover:opacity-90 transition-opacity text-white rounded-lg flex items-center justify-center gap-2 shadow-lg group"
              onClick={step === "phone" ? handleSendOTP : handleVerifyOTP}
              disabled={isLoading || (step === "phone" ? !isValidPhoneNumber(phoneNumber) : otp.some((digit) => !digit))}
            >
              {isLoading ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <span className="group-hover:text-black transition-colors">
                  {step === "phone" ? "Send Verification Code" : "Verify & Continue"}
                  <ArrowRight className="h-4 w-4 ml-1 inline" />
                </span>
              )}
            </Button>
          </CardFooter>
        </Card>

        <p className="text-center mt-6 text-sm text-muted-foreground">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  )
}
