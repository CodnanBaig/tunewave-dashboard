"use client"

import { cn } from "@/lib/utils"

import { useState, useEffect } from "react"
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
import { Skeleton } from "@/components/ui/skeleton"

type Release = {
  id: string
  title: string
  releaseDate: string
  artwork: string
  status: "draft" | "pending" | "under-review" | "verified" | "live" | "takedown" | "unknown"
  tracks: number
}

const statusMap: Record<string, number[]> = {
  draft: [1],
  pending: [19],
  "under-review": [2],
  verified: [15],
  live: [16],
  takedown: [17, 18],
}

const statusIdToName: Record<number, Release["status"]> = {}
for (const [name, ids] of Object.entries(statusMap)) {
  for (const id of ids) {
    statusIdToName[id] = name as Release["status"]
  }
}

export default function ReleasesPage() {
  const [viewMode, setViewMode] = useState<"list" | "card">("card")
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [releases, setReleases] = useState<Release[]>([])
  const [loading, setLoading] = useState(true)
  const [releaseCounts, setReleaseCounts] = useState({
    all: 0,
    draft: 0,
    pending: 0,
    "under-review": 0,
    verified: 0,
    live: 0,
    takedown: 0,
  })

  useEffect(() => {
    const fetchCounts = async () => {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
      const headers = {
        "Content-Type": "application/json",
        "Client-ID": process.env.NEXT_PUBLIC_CLIENT_ID || "",
        ...(token && { Authorization: `Bearer ${token}` }),
      }

      const fetchCountForStatus = async (status: string): Promise<[string, number]> => {
        const params = new URLSearchParams({ limit: "1" })

        if (statusMap[status]) {
          statusMap[status].forEach((id) => params.append("releaseStatusId", id.toString()))
        }

        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/getAlbumsByStatus?${params.toString()}`, {
            method: "GET",
            credentials: "include",
            headers,
          })

          if (!response.ok) {
            console.error(`Failed to fetch count for ${status}`)
            return [status, 0]
          }

          const data = await response.json()
          return [status, data.total || 0]
        } catch (error) {
          console.error(`Error fetching count for ${status}:`, error)
          return [status, 0]
        }
      }

      const statusesToFetch = ["draft", "pending", "under-review", "verified", "live", "takedown"]
      const countPromises = statusesToFetch.map(fetchCountForStatus)
      const individualCounts = Object.fromEntries(await Promise.all(countPromises))

      const totalCount = Object.values(individualCounts).reduce((sum, count) => sum + count, 0);

      setReleaseCounts({
        ...releaseCounts, // Keep initial state structure
        ...individualCounts,
        all: totalCount,
      })
    }

    fetchCounts()
  }, [])

  useEffect(() => {
    const fetchReleases = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams({
          page: "1",
          limit: "100",
          orderBy: "id",
          order: "DESC",
        })

        const statusIdsToFetch = 
          activeTab === 'all'
            ? Object.values(statusMap).flat()
            : statusMap[activeTab]

        if (statusIdsToFetch) {
          statusIdsToFetch.forEach((id) => params.append("releaseStatusId", id.toString()))
        }
        
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/getAlbumsByStatus?${params.toString()}`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Client-ID': process.env.NEXT_PUBLIC_CLIENT_ID || '',
            ...(token && { 'Authorization': `Bearer ${token}` }),
          },
        })
        
        if (!response.ok) {
          throw new Error(`API call failed with status: ${response.status}`)
        }
        
        const data = await response.json()
        
        // The API returns the array of albums in the 'data' property
        const fetchedReleases = (data.data || []).map((album: any) => ({
          id: album.id.toString(),
          title: album.albumTitle,
          releaseDate: album.releaseDate,
          artwork: album.artworkFileUrl, // Use the full URL from the API
          status: statusIdToName[album.releaseStatusId] || "unknown",
          tracks: 1, // Defaulting to 1 as track count is not in the album list response
        }))
        
        setReleases(fetchedReleases)
      } catch (error) {
        console.error("Failed to fetch releases:", error)
        // Handle error state, maybe show a toast notification
        setReleases([])
      } finally {
        setLoading(false)
      }
    }
    fetchReleases()
  }, [activeTab])


  // Filter releases based on active tab and search query
  const filteredReleases = releases
    .filter((release) => activeTab === "all" || release.status === activeTab)
    .filter((release) => searchQuery === "" || release.title.toLowerCase().includes(searchQuery.toLowerCase()))

  const renderSkeletons = () => (
    <div className={cn(
      "grid gap-4",
      viewMode === "card" 
        ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
        : "grid-cols-1"
    )}>
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex flex-col space-y-3">
          <Skeleton className={cn("h-[180px] w-full rounded-xl", viewMode === 'list' && 'h-16 w-16')} />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[150px]" />
            <Skeleton className="h-4 w-[100px]" />
          </div>
        </div>
      ))}
    </div>
  )

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
          {loading ? (
            renderSkeletons()
          ) : filteredReleases.length === 0 ? (
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
