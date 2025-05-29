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
    <div className="container max-w-[1440px] py-8">
      <div className="mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
              Manage Releases
            </h1>
            <p className="text-muted-foreground mt-1">Create, track, and manage your music releases</p>
          </div>
          <Button
            size="lg"
            className="bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90 shadow-md transition-all duration-300 hover:shadow-lg"
            asChild
          >
            <Link href="/releases/new" className="gap-2">
              <PlusCircle className="h-4 w-4" />
              Add New Release
            </Link>
          </Button>
        </div>

        <div className="flex items-center gap-3 sm:gap-4 flex-wrap sm:flex-nowrap">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search releases..."
              className="pl-10 border-muted bg-background/70 focus-visible:ring-1 focus-visible:ring-primary w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 ml-auto">
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
              className="h-9 rounded-md data-[state=active]:shadow-sm data-[state=active]:bg-background relative"
            >
              All Releases
              <Badge variant="outline" className="ml-2 bg-primary/10 border-0">
                {releaseCounts.all}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="draft"
              className="h-9 rounded-md data-[state=active]:shadow-sm data-[state=active]:bg-background relative"
            >
              Draft
              <Badge variant="outline" className="ml-2 bg-primary/10 border-0">
                {releaseCounts.draft}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="pending"
              className="h-9 rounded-md data-[state=active]:shadow-sm data-[state=active]:bg-background relative"
            >
              Pending
              <Badge variant="outline" className="ml-2 bg-primary/10 border-0">
                {releaseCounts.pending}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="under-review"
              className="h-9 rounded-md data-[state=active]:shadow-sm data-[state=active]:bg-background relative"
            >
              Under Review
              <Badge variant="outline" className="ml-2 bg-primary/10 border-0">
                {releaseCounts["under-review"]}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="verified"
              className="h-9 rounded-md data-[state=active]:shadow-sm data-[state=active]:bg-background relative"
            >
              Verified
              <Badge variant="outline" className="ml-2 bg-primary/10 border-0">
                {releaseCounts.verified}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="live"
              className="h-9 rounded-md data-[state=active]:shadow-sm data-[state=active]:bg-background relative"
            >
              Live
              <Badge variant="outline" className="ml-2 bg-primary/10 border-0">
                {releaseCounts.live}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="takedown"
              className="h-9 rounded-md data-[state=active]:shadow-sm data-[state=active]:bg-background relative"
            >
              Takedown
              <Badge variant="outline" className="ml-2 bg-primary/10 border-0">
                {releaseCounts.takedown}
              </Badge>
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground hidden sm:inline">
              {filteredReleases.length} {filteredReleases.length === 1 ? "release" : "releases"} found
            </span>
          </div>
          <Select defaultValue="date-desc">
            <SelectTrigger className="w-[200px] border-muted focus:ring-1 focus:ring-primary">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="title-asc">Release Title (A-Z)</SelectItem>
              <SelectItem value="title-desc">Release Title (Z-A)</SelectItem>
              <SelectItem value="date-desc">Release Date (Newest)</SelectItem>
              <SelectItem value="date-asc">Release Date (Oldest)</SelectItem>
              <SelectItem value="tracks-desc">Tracks (Most)</SelectItem>
              <SelectItem value="tracks-asc">Tracks (Least)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <TabsContent value={activeTab} className="mt-0">
          {filteredReleases.length === 0 ? (
            <Card className="border border-dashed bg-muted/30">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="rounded-full bg-primary/10 p-4 mb-4">
                  <Music className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">No releases found</h3>
                <p className="text-muted-foreground text-center mb-6 max-w-md">
                  {searchQuery
                    ? "No releases match your search criteria. Try adjusting your search."
                    : activeTab === "all"
                      ? "You haven't created any releases yet. Start by adding a new release."
                      : `You don't have any releases with "${activeTab}" status.`}
                </p>
                <Button asChild className="bg-gradient-to-r from-primary to-purple-500 shadow-md">
                  <Link href="/releases/new" className="gap-2">
                    <PlusCircle className="h-4 w-4" />
                    Add New Release
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div
              className={cn(
                "grid gap-6",
                viewMode === "card"
                  ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
                  : "grid-cols-1",
              )}
            >
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
