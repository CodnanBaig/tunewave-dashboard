"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { ArrowRight, Mail, Lock } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AuthPage() {
  const router = useRouter()
  const [authMethod, setAuthMethod] = useState<"email-password" | "email-otp">("email-password")
  const [step, setStep] = useState<"email" | "otp" | "password">("email")
  
  // Email/Password state
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  
  // Email OTP state
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  
  const [isLoading, setIsLoading] = useState(false)
  const [focusedInput, setFocusedInput] = useState<number | null>(null)

  // Validation functions
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const isValidPassword = (password: string) => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(password)
  }

  const handleEmailSubmit = () => {
    if (!isValidEmail(email)) return

    setIsLoading(true)
    if (authMethod === "email-password") {
      // In a real app, this would check if user exists
      setStep("password")
      setIsLoading(false)
    } else {
      // Send OTP
      setTimeout(() => {
        console.log("Sending OTP to", email)
        setStep("otp")
        setIsLoading(false)
      }, 1000)
    }
  }

  const handlePasswordSubmit = () => {
    if (!isValidPassword(password)) return
    if (password !== confirmPassword) return

    setIsLoading(true)
    // In a real app, this would register/login the user
    setTimeout(() => {
      console.log("Registering with email/password", { email, password })
      router.push("/onboarding")
    }, 1000)
  }

  const handleVerifyOTP = () => {
    if (otp.some((digit) => !digit)) return

    setIsLoading(true)
    // In a real app, this would verify the OTP
    setTimeout(() => {
      console.log("Verifying OTP", otp.join(""))
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
            <Tabs defaultValue="email-password" className="w-full" onValueChange={(value) => {
              setAuthMethod(value as "email-password" | "email-otp")
              setStep("email")
            }}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="email-password">Email & Password</TabsTrigger>
                <TabsTrigger value="email-otp">Email OTP</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>

          <CardContent className="space-y-4 px-6">
            {step === "email" && (
              <div className="space-y-3">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`pl-4 h-12 rounded-lg border-border/50 bg-background/50 focus-visible:ring-primary/20 ${
                      focusedInput === 0 ? "border-primary ring ring-primary/20" : ""
                    }`}
                    onFocus={() => setFocusedInput(0)}
                    onBlur={() => setFocusedInput(null)}
                  />
                  {email && !isValidEmail(email) && (
                    <p className="text-sm text-destructive mt-1">
                      Please enter a valid email address
                    </p>
                  )}
                </div>
              </div>
            )}

            {step === "password" && (
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 rounded-lg border-border/50 bg-background/50"
                  />
                  {password && !isValidPassword(password) && (
                    <p className="text-sm text-destructive mt-1">
                      Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium">
                    Confirm Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-12 rounded-lg border-border/50 bg-background/50"
                  />
                  {confirmPassword && password !== confirmPassword && (
                    <p className="text-sm text-destructive mt-1">
                      Passwords do not match
                    </p>
                  )}
                </div>
              </div>
            )}

            {step === "otp" && (
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
                  <p className="text-sm text-muted-foreground">Code sent to {email}</p>
                  <Button
                    variant="link"
                    className="p-0 h-auto text-primary hover:text-primary/90"
                    onClick={() => setStep("email")}
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
              onClick={
                step === "email" 
                  ? handleEmailSubmit 
                  : step === "password" 
                    ? handlePasswordSubmit 
                    : handleVerifyOTP
              }
              disabled={
                isLoading || 
                (step === "email" 
                  ? !isValidEmail(email)
                  : step === "password"
                    ? !isValidPassword(password) || password !== confirmPassword
                    : otp.some((digit) => !digit))
              }
            >
              {isLoading ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <span className="group-hover:text-black transition-colors">
                  {step === "email" 
                    ? "Continue" 
                    : step === "password" 
                      ? "Create Account" 
                      : "Verify & Continue"}
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
