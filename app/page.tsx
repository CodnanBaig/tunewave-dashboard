import { redirect } from "next/navigation"

export default function Home() {
  // In a real app, check if user is authenticated
  // If not, redirect to auth page
  const isAuthenticated = false

  if (!isAuthenticated) {
    redirect("/auth")
  }

  // Redirect directly to releases page if authenticated
  redirect("/releases")
}
