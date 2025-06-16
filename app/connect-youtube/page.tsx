"use client";

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Youtube, AlertCircle, CheckCircle2 } from "lucide-react"
import { useCurrency } from "@/lib/currency-context"

export default function ConnectYouTubePage() {
  const [channelUrl, setChannelUrl] = useState("")
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { formatAmount } = useCurrency()

  return (
    <div className="container max-w-4xl py-8">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Youtube className="h-5 w-5 text-red-500" />
              Connect YouTube Channel
            </CardTitle>
            <CardDescription>
              Connect your YouTube channel to start monetizing your music content
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>Channel has at least 1,000 subscribers</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>Channel has at least 4,000 watch hours in the last 12 months</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>Channel has at least {formatAmount(100)} in lifetime revenue</span>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <Label htmlFor="channel-url">YouTube Channel URL</Label>
              <Input
                id="channel-url"
                placeholder="https://www.youtube.com/c/yourchannel"
                value={channelUrl}
                onChange={(e) => setChannelUrl(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Enter your YouTube channel URL to verify eligibility
              </p>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleConnect}
              disabled={!channelUrl || isConnecting}
              className="w-full"
            >
              {isConnecting ? "Connecting..." : "Connect Channel"}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Requirements</CardTitle>
            <CardDescription>What you need to connect your YouTube channel</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">Channel Requirements</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>At least 1,000 subscribers</li>
                <li>At least 4,000 watch hours in the last 12 months</li>
                <li>At least {formatAmount(100)} in lifetime revenue</li>
                <li>No active community guidelines strikes</li>
                <li>AdSense account linked to your channel</li>
              </ul>
            </div>

            <Separator />

            <div className="space-y-2">
              <h4 className="font-medium">Content Requirements</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Original music content</li>
                <li>No copyright strikes</li>
                <li>No reused content</li>
                <li>No misleading metadata</li>
                <li>No spam or deceptive practices</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
