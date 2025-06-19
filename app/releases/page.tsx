"use client"

import { cn } from "@/lib/utils"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Toggle } from "@/components/ui/toggle"
import { PlusCircle, List, Grid, Music, Search } from "lucide-react"
import { ReleaseCard } from "@/components/release-card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Mock data for releases
const mockReleases = [
  {
    id: "1",
    title: "Summer Vibes",
    releaseDate: "2023-06-15",
    artwork: "/placeholder-ko8hn.png",
    status: "live",
    tracks: 2,
  },
  {
    id: "2",
    title: "Midnight Dreams",
    releaseDate: "2023-08-22",
    artwork: "/midnight-dreams-album-cover.png",
    status: "pending",
    tracks: 1,
  },
  {
    id: "3",
    title: "Urban Echoes",
    releaseDate: "2023-10-05",
    artwork: "/placeholder-szg6c.png",
    status: "under-review",
    tracks: 3,
  },
  {
    id: "4",
    title: "Acoustic Sessions",
    releaseDate: "2024-01-18",
    artwork: "/placeholder-1euab.png",
    status: "draft",
    tracks: 1,
  },
  {
    id: "5",
    title: "Electric Pulse",
    releaseDate: "2024-03-30",
    artwork: "/placeholder-wipqs.png",
    status: "verified",
    tracks: 4,
  },
  {
    id: "6",
    title: "Retro Classics",
    releaseDate: "2024-05-10",
    artwork: "/placeholder-kn2nr.png",
    status: "takedown",
    tracks: 2,
  },
]

export default function ReleasesPage() {
  const [viewMode, setViewMode] = useState<"list" | "card">("card")
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  // Filter releases based on active tab and search query
  const filteredReleases = mockReleases
    .filter((release) => activeTab === "all" || release.status === activeTab)
    .filter((release) => searchQuery === "" || release.title.toLowerCase().includes(searchQuery.toLowerCase()))

  // Count releases by status
  const releaseCounts = {
    all: mockReleases.length,
    draft: mockReleases.filter((r) => r.status === "draft").length,
    pending: mockReleases.filter((r) => r.status === "pending").length,
    "under-review": mockReleases.filter((r) => r.status === "under-review").length,
    verified: mockReleases.filter((r) => r.status === "verified").length,
    live: mockReleases.filter((r) => r.status === "live").length,
    takedown: mockReleases.filter((r) => r.status === "takedown").length,
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 max-w-7xl">
      <div className="mb-6 sm:mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
              Manage Releases
            </h1>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">Create, track, and manage your music releases</p>
          </div>
          <Button
            size="lg"
            className="bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90 shadow-md transition-all duration-300 hover:shadow-lg w-full sm:w-auto"
            asChild
          >
            <Link href="/releases/new" className="gap-2">
              <PlusCircle className="h-4 w-4" />
              Add New Release
            </Link>
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search releases..."
              className="pl-10 border-muted bg-background/70 focus-visible:ring-1 focus-visible:ring-primary w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-center sm:justify-end gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Toggle
                    pressed={viewMode === "list"}
                    onPressedChange={() => setViewMode("list")}
                    aria-label="List view"
                    className="data-[state=on]:bg-muted"
                  >
                    <List className="h-4 w-4" />
                  </Toggle>
                </TooltipTrigger>
                <TooltipContent>
                  <p>List view</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Toggle
                    pressed={viewMode === "card"}
                    onPressedChange={() => setViewMode("card")}
                    aria-label="Card view"
                    className="data-[state=on]:bg-muted"
                  >
                    <Grid className="h-4 w-4" />
                  </Toggle>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Card view</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
        <div className="relative mb-6 border-b">
          <TabsList className="relative w-full h-auto flex-nowrap overflow-x-auto py-1 justify-start rounded-none bg-transparent space-x-2">
            <TabsTrigger
              value="all"
              className="h-9 rounded-md data-[state=active]:shadow-sm data-[state=active]:bg-background relative whitespace-nowrap"
            >
              All Releases
              <Badge variant="outline" className="ml-2 bg-primary/10 border-0">
                {releaseCounts.all}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="draft"
              className="h-9 rounded-md data-[state=active]:shadow-sm data-[state=active]:bg-background relative whitespace-nowrap"
            >
              Draft
              <Badge variant="outline" className="ml-2 bg-primary/10 border-0">
                {releaseCounts.draft}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="pending"
              className="h-9 rounded-md data-[state=active]:shadow-sm data-[state=active]:bg-background relative whitespace-nowrap"
            >
              Pending
              <Badge variant="outline" className="ml-2 bg-primary/10 border-0">
                {releaseCounts.pending}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="under-review"
              className="h-9 rounded-md data-[state=active]:shadow-sm data-[state=active]:bg-background relative whitespace-nowrap"
            >
              Under Review
              <Badge variant="outline" className="ml-2 bg-primary/10 border-0">
                {releaseCounts["under-review"]}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="verified"
              className="h-9 rounded-md data-[state=active]:shadow-sm data-[state=active]:bg-background relative whitespace-nowrap"
            >
              Verified
              <Badge variant="outline" className="ml-2 bg-primary/10 border-0">
                {releaseCounts.verified}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="live"
              className="h-9 rounded-md data-[state=active]:shadow-sm data-[state=active]:bg-background relative whitespace-nowrap"
            >
              Live
              <Badge variant="outline" className="ml-2 bg-primary/10 border-0">
                {releaseCounts.live}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="takedown"
              className="h-9 rounded-md data-[state=active]:shadow-sm data-[state=active]:bg-background relative whitespace-nowrap"
            >
              Takedown
              <Badge variant="outline" className="ml-2 bg-primary/10 border-0">
                {releaseCounts.takedown}
              </Badge>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value={activeTab} className="mt-0">
          {filteredReleases.length === 0 ? (
            <div className="text-center py-12">
              <Music className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No releases found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery ? "Try adjusting your search terms" : "Get started by creating your first release"}
              </p>
              {!searchQuery && (
                <Button asChild>
                  <Link href="/releases/new">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Release
                  </Link>
                </Button>
              )}
            </div>
          ) : (
            <div className={cn(
              "grid gap-4",
              viewMode === "card" 
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
                : "grid-cols-1"
            )}>
              {filteredReleases.map((release) => (
                <ReleaseCard key={release.id} release={release} viewMode={viewMode} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
