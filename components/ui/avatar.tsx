"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string
  alt?: string
  fallback?: React.ReactNode
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt = "", fallback, ...props }, ref) => {
    const [hasError, setHasError] = React.useState(false)

    return (
      <div
        ref={ref}
        className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className)}
        {...props}
      >
        {src && !hasError ? (
          <img
            src={src || "/placeholder.svg"}
            alt={alt}
            className="aspect-square h-full w-full"
            onError={() => setHasError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded-full bg-muted">{fallback}</div>
        )}
      </div>
    )
  },
)
Avatar.displayName = "Avatar"

const AvatarImage = ({ src, alt = "", className, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => {
  return (
    <img
      src={src || "/placeholder.svg"}
      alt={alt}
      className={cn("aspect-square h-full w-full", className)}
      {...props}
    />
  )
}
AvatarImage.displayName = "AvatarImage"

const AvatarFallback = ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={cn("flex h-full w-full items-center justify-center rounded-full bg-muted", className)} {...props}>
      {children}
    </div>
  )
}
AvatarFallback.displayName = "AvatarFallback"

export { Avatar, AvatarImage, AvatarFallback }
