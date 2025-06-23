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
  const [isLogin, setIsLogin] = useState(true)
  
  // Email/Password state
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  
  // Email OTP state
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  
  const [isLoading, setIsLoading] = useState(false)
  const [focusedInput, setFocusedInput] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Validation functions
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const isValidPassword = (password: string) => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)
  }

  const handleEmailSubmit = async () => {
    if (!isValidEmail(email)) return

    setIsLoading(true)
    setError(null)
    
    if (authMethod === "email-password") {
      // For email-password, validate password and submit both email and password
      if (!password) {
        setError("Password is required")
        setIsLoading(false)
        return
      }
      
      if (!isLogin && !isValidPassword(password)) {
        setError("Password must be at least 8 characters with 1 uppercase, 1 lowercase, 1 number, and 1 special character (@$!%*?&)")
        setIsLoading(false)
        return
      }
      
      if (!isLogin && password !== confirmPassword) {
        setError("Passwords do not match")
        setIsLoading(false)
        return
      }

      try {
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
        if (!apiBaseUrl) {
          throw new Error("API base URL not configured")
        }

        const endpoint = isLogin ? 'user/loginEmailPass' : 'user/registerEmailPass'
        const response = await fetch(`${apiBaseUrl}/${endpoint}`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Client-ID': process.env.NEXT_PUBLIC_CLIENT_ID || '',
          },
          body: JSON.stringify({
            emailAddress: email,
            password,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.message || `${isLogin ? 'Login' : 'Registration'} failed: ${response.status}`)
        }

        const data = await response.json()
        console.log(`${isLogin ? 'Login' : 'Registration'} successful:`, data)
        
        if (isLogin) {
          // Store user info and token in localStorage
          if (data.user && data.token) {
            localStorage.setItem('id', data.user.id);
            localStorage.setItem('token', data.token);
            localStorage.setItem('roleId', data.user.roleId);
          }
          // Navigate to releases page for login
          router.push("/releases")
        } else {
          // Navigate to onboarding for registration
          router.push(`/onboarding?email=${encodeURIComponent(email)}`)
        }
      } catch (err) {
        console.error(`${isLogin ? 'Login' : 'Registration'} error:`, err)
        setError(err instanceof Error ? err.message : `${isLogin ? 'Login' : 'Registration'} failed. Please try again.`)
      } finally {
        setIsLoading(false)
      }
    } else {
      // Send OTP - simulate API call
      setTimeout(() => {
        console.log("OTP sent to:", email)
        setStep("otp")
        setIsLoading(false)
      }, 1000)
    }
  }

  const handleVerifyOTP = async () => {
    if (otp.some((digit) => !digit)) return

    setIsLoading(true)
    setError(null)

    // Simulate OTP verification
    setTimeout(() => {
      console.log("OTP verification:", otp.join(""))
      router.push("/onboarding")
      setIsLoading(false)
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

  const toggleAuthMode = () => {
    setIsLogin(!isLogin)
    setPassword("")
    setConfirmPassword("")
    setError(null)
    setStep("email")
  }

  const handleResendOTP = async () => {
    setIsLoading(true)
    setError(null)

    // Simulate resend OTP
    setTimeout(() => {
      console.log("OTP resent to:", email)
      setOtp(["", "", "", "", "", ""])
      setIsLoading(false)
    }, 1000)
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
                  alt="Tunewave Media"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
            <Tabs defaultValue="email-password" className="w-full" onValueChange={(value) => {
              setAuthMethod(value as "email-password" | "email-otp")
              setStep("email")
              setEmail("")
              setPassword("")
              setConfirmPassword("")
              setOtp(["", "", "", "", "", ""])
              setError(null)
            }}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="email-password">Email & Password</TabsTrigger>
                <TabsTrigger value="email-otp">Email OTP</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>

          <CardContent className="space-y-4 px-6">
            {authMethod === "email-password" ? (
              // Email & Password tab - show both fields on same page
              <div className="space-y-4">
                {error && (
                  <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                    <p className="text-sm text-destructive">{error}</p>
                  </div>
                )}
                <div className="space-y-2">
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

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder={isLogin ? "Enter your password" : "Enter your password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 rounded-lg border-border/50 bg-background/50"
                  />
                  {!isLogin && password && !isValidPassword(password) && (
                    <p className="text-sm text-destructive mt-1">
                      Password must be at least 8 characters with 1 uppercase, 1 lowercase, 1 number, and 1 special character (@$!%*?&)
                    </p>
                  )}
                </div>

                {!isLogin && (
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
                )}
              </div>
            ) : step === "email" ? (
              // Email OTP tab - email step
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
            ) : step === "otp" ? (
              // Email OTP tab - OTP step
              <div className="space-y-3">
                {error && (
                  <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                    <p className="text-sm text-destructive">{error}</p>
                  </div>
                )}
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
                    onClick={handleResendOTP}
                    disabled={isLoading}
                  >
                    Resend Code
                  </Button>
                </div>
              </div>
            ) : null}
          </CardContent>

          <CardFooter className="px-6 pb-6">
            <Button
              className="w-full h-12 bg-gradient-primary hover:opacity-90 transition-opacity text-white rounded-lg flex items-center justify-center gap-2 shadow-lg group"
              onClick={
                authMethod === "email-password" 
                  ? handleEmailSubmit 
                  : step === "email" 
                    ? handleEmailSubmit 
                    : handleVerifyOTP
              }
              disabled={
                isLoading || 
                (authMethod === "email-password"
                  ? !isValidEmail(email) || !password || 
                    (!isLogin && (!isValidPassword(password) || password !== confirmPassword))
                  : step === "email" 
                    ? !isValidEmail(email)
                    : otp.some((digit) => !digit))
              }
            >
              {isLoading ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <span className="group-hover:text-black transition-colors">
                  {authMethod === "email-password"
                    ? isLogin ? "Login" : "Create Account"
                    : step === "email" 
                      ? "Continue" 
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

        <p className="text-center mt-6 text-sm text-muted-foreground">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <Button
            variant="link"
            className="p-0 h-auto text-primary hover:text-primary/90"
            onClick={toggleAuthMode}
          >
            {isLogin ? "Create Account" : "Login"}
          </Button>
        </p>
      </div>
    </div>
  )
}
