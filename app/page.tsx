import { redirect } from "next/navigation"

export default function Home() {
  // In a real app, check if user is authenticated
  // If not, redirect to auth page
  const isAuthenticated = false

  if (!isAuthenticated) {
    redirect("/auth")
  }

  // If authenticated but profile not complete, redirect to onboarding
  const isProfileComplete = false

  if (!isProfileComplete) {
    redirect("/onboarding")
  }

  // Otherwise redirect directly to releases page
  redirect("/releases")
}
