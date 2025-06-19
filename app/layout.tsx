"use client"

import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { SidebarProvider } from "@/components/ui/sidebar"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { MobileNavbar } from "@/components/mobile-navbar"
import { usePathname } from "next/navigation"
import { CurrencyProvider } from "@/lib/currency-context"

const inter = Inter({ subsets: ["latin"] })

// export const metadata: Metadata = {
//   title: "Tunewave Media - Music Distribution Dashboard",
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
      <CurrencyProvider>
        <SidebarProvider>
          <div className="flex min-h-screen w-full">
            {/* Mobile Navbar - only visible on mobile */}
            <MobileNavbar />
            
            {/* Desktop Sidebar - hidden on mobile */}
            <div className="hidden md:block">
              <DashboardSidebar />
            </div>
            
            {/* Main Content */}
            <main className="flex-1 overflow-auto md:ml-0">
              {/* Add top padding for mobile navbar */}
              <div className="pt-16 md:pt-0 min-h-full">
                {children}
              </div>
            </main>
          </div>
        </SidebarProvider>
      </CurrencyProvider>
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
