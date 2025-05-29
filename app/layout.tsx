"use client"

import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { SidebarProvider } from "@/components/ui/sidebar"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { usePathname } from "next/navigation"

const inter = Inter({ subsets: ["latin"] })

// export const metadata: Metadata = {
//   title: "SP Music Zone - Music Distribution Dashboard",
//   description: "Manage your music releases and distribution",
//     generator: 'v0.dev'
// }

function RootLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAuthPage = pathname === '/auth'
  const isOnboardingPage = pathname === '/onboarding'
  const shouldHideSidebar = isAuthPage || isOnboardingPage

  if (shouldHideSidebar) {
    return children
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <SidebarProvider>
        <div className="flex min-h-screen">
          <DashboardSidebar />
          <main className="flex-1">{children}</main>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  )
}

// Server component root layout
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  )
}
