"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Edit, Music, Calendar } from "lucide-react"

type Release = {
  id: string
  title: string
  releaseDate: string
  artwork: string
  status: string
  tracks: number
}

type ReleaseCardProps = {
  release: Release
  viewMode: "list" | "card"
}

const statusColors = {
  draft: "bg-muted text-muted-foreground",
  pending:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800",
  "under-review": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 border-blue-200 dark:border-blue-800",
  verified: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 border-green-200 dark:border-green-800",
  live: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 border-purple-200 dark:border-purple-800",
  takedown: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 border-red-200 dark:border-red-800",
}

const statusLabels = {
  draft: "Draft",
  pending: "Pending",
  "under-review": "Under Review",
  verified: "Verified",
  live: "Live",
  takedown: "Takedown",
}

export function ReleaseCard({ release, viewMode }: ReleaseCardProps) {
  const formattedDate = format(new Date(release.releaseDate), "MMM d, yyyy")
  const isDraft = release.status === "draft"

  if (viewMode === "list") {
    return (
      <Card className="overflow-hidden transition-all duration-200 hover:shadow-md hover:bg-accent/20 group">
        <div className="flex items-center">
          <div className="h-20 w-20 flex-shrink-0 relative overflow-hidden">
            <Image
              src={release.artwork || "/placeholder.svg?height=80&width=80&query=music"}
              alt={release.title}
              width={80}
              height={80}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="ghost" size="icon" className="h-8 w-8 bg-white/20 backdrop-blur-sm text-white" asChild>
                <Link href={`/releases/${release.id}`}>
                  <span className="sr-only">View</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 12h16" />
                    <path d="M13 5l7 7-7 7" />
                  </svg>
                </Link>
              </Button>
            </div>
          </div>
          <CardContent className="flex flex-1 items-center justify-between p-4">
            <div>
              <Link href={`/releases/${release.id}`} className="font-medium hover:text-primary transition-colors">
                {release.title}
              </Link>
              <div className="flex items-center mt-1 gap-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{formattedDate}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Music className="h-3 w-3" />
                  <span>
                    {release.tracks} {release.tracks === 1 ? "track" : "tracks"}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className={cn("border px-2.5 py-0.5", statusColors[release.status as keyof typeof statusColors])}>
                {statusLabels[release.status as keyof typeof statusLabels]}
              </Badge>
              {isDraft && (
                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10 hover:text-primary" asChild>
                  <Link href={`/releases/${release.id}/edit`}>
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Link>
                </Button>
              )}
            </div>
          </CardContent>
        </div>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md hover:-translate-y-1 group">
      <div className="relative">
        <Link href={`/releases/${release.id}`} className="block">
          <div className="aspect-square relative">
            <Image
              src={release.artwork || "/placeholder.svg?height=300&width=300&query=music"}
              alt={release.title}
              fill
              className="object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
              <div className="w-full">
                <div className="flex gap-2 mb-2">
                  <Badge className={cn("border", statusColors[release.status as keyof typeof statusColors])}>
                    {statusLabels[release.status as keyof typeof statusLabels]}
                  </Badge>
                </div>
                <Button
                  variant="default"
                  size="sm"
                  className="w-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 hover:text-white"
                >
                  View Details
                </Button>
              </div>
            </div>
          </div>
          <CardContent className="p-4">
            <h3 className="font-medium truncate text-base">{release.title}</h3>
            <div className="flex items-center mt-1 gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center gap-1">
                <Music className="h-3 w-3" />
                <span>
                  {release.tracks} {release.tracks === 1 ? "track" : "tracks"}
                </span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-0 px-4 pb-4 flex justify-between items-center">
            <Badge className={cn("border", statusColors[release.status as keyof typeof statusColors])}>
              {statusLabels[release.status as keyof typeof statusLabels]}
            </Badge>
            {isDraft && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 hover:bg-primary/10 hover:text-primary"
                asChild
              >
                <Link href={`/releases/${release.id}/edit`} onClick={(e) => e.stopPropagation()}>
                  <Edit className="h-3 w-3" />
                  <span className="sr-only">Edit</span>
                </Link>
              </Button>
            )}
          </CardFooter>
        </Link>
      </div>
    </Card>
  )
}
