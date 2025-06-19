"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Music,
  DollarSign,
  Upload,
  Instagram,
  Youtube,
  Twitter,
  Facebook,
  Globe,
  Edit,
  CheckCircle2,
} from "lucide-react"
import { format } from "date-fns"
import { useCurrency } from "@/lib/currency-context"

// Mock user data
const userData = {
  name: "John Smith",
  username: "johnsmith",
  email: "john.smith@example.com",
  phone: "+91 9876543210",
  location: "Mumbai, India",
  joinDate: "2023-01-15",
  bio: "Electronic music producer and DJ with over 5 years of experience. Specializing in house and techno music.",
  profileImage: "/placeholder-wipqs.png",
  artistType: "Artist",
  genres: ["Electronic", "House", "Techno"],
  socialLinks: {
    instagram: "https://instagram.com/johnsmith",
    youtube: "https://youtube.com/johnsmith",
    twitter: "https://twitter.com/johnsmith",
    facebook: "https://facebook.com/johnsmith",
    website: "https://johnsmith.com",
  },
  bankDetails: {
    accountHolderName: "John Smith",
    bankName: "State Bank of India",
    accountNumber: "1234567890",
    ifscCode: "SBIN0001234",
    accountType: "Savings",
  },
  stats: {
    totalReleases: 12,
    totalTracks: 28,
    totalStreams: 1250000,
    totalRevenue: 8500,
  },
}

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState(userData)
  const [activeTab, setActiveTab] = useState("overview")
  const { formatAmount } = useCurrency()

  const handleSaveProfile = () => {
    // In a real app, this would save the profile data to the backend
    console.log("Saving profile data:", profileData)
    setIsEditing(false)
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 max-w-7xl">
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Left column - Profile card */}
        <div className="lg:w-1/3">
          <Card className="border shadow-sm overflow-hidden bg-card/50 backdrop-blur-sm">
            <div className="relative h-32 bg-gradient-to-r from-primary/20 to-primary/40">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm hover:bg-background/90 z-10"
                onClick={() => setIsEditing(!isEditing)}
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>
            <div className="relative px-4 sm:px-6">
              <Avatar className="h-20 w-20 sm:h-24 sm:w-24 absolute -top-10 sm:-top-12 ring-4 ring-background">
                <AvatarImage src={profileData.profileImage || "/placeholder.svg"} alt={profileData.name} />
                <AvatarFallback>{profileData.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>
            <CardContent className="pt-12 sm:pt-16 pb-6">
              <h2 className="text-xl sm:text-2xl font-bold">{profileData.name}</h2>
              <p className="text-muted-foreground text-sm sm:text-base">@{profileData.username}</p>

              <div className="flex flex-wrap gap-1 mt-2">
                {profileData.genres.map((genre) => (
                  <Badge
                    key={genre}
                    variant="secondary"
                    className="bg-primary/10 hover:bg-primary/20 transition-colors text-xs"
                  >
                    {genre}
                  </Badge>
                ))}
              </div>

              <div className="mt-4 space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="truncate">{profileData.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span>{profileData.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="truncate">{profileData.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span>Joined {format(new Date(profileData.joinDate), "MMMM yyyy")}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span>{profileData.artistType}</span>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between">
                <a
                  href={profileData.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a
                  href={profileData.socialLinks.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Youtube className="h-5 w-5" />
                </a>
                <a
                  href={profileData.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Twitter className="h-5 w-5" />
                </a>
                <a
                  href={profileData.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a
                  href={profileData.socialLinks.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Globe className="h-5 w-5" />
                </a>
              </div>

              <CardContent className="pt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Total Releases</p>
                    <p className="text-xl sm:text-2xl font-bold">{profileData.stats.totalReleases}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Total Tracks</p>
                    <p className="text-xl sm:text-2xl font-bold">{profileData.stats.totalTracks}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Total Streams</p>
                    <p className="text-xl sm:text-2xl font-bold">{profileData.stats.totalStreams.toLocaleString()}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Total Revenue</p>
                    <p className="text-xl sm:text-2xl font-bold">{formatAmount(profileData.stats.totalRevenue)}</p>
                  </div>
                </div>
              </CardContent>
            </CardContent>
          </Card>
        </div>

        {/* Right column - Tabs content */}
        <div className="lg:flex-1">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="edit">Edit Profile</TabsTrigger>
              <TabsTrigger value="banking">Banking</TabsTrigger>
              <TabsTrigger value="social">Social</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>About</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{profileData.bio}</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="edit" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Edit Profile</CardTitle>
                  <CardDescription>Update your profile information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        value={profileData.username}
                        onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={profileData.location}
                      onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={profileData.bio}
                      onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                      rows={4}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleSaveProfile} className="w-full sm:w-auto">
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="banking" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Banking Information</CardTitle>
                  <CardDescription>Manage your payment details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="accountHolder">Account Holder Name</Label>
                      <Input
                        id="accountHolder"
                        value={profileData.bankDetails.accountHolderName}
                        readOnly
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bankName">Bank Name</Label>
                      <Input
                        id="bankName"
                        value={profileData.bankDetails.bankName}
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="accountNumber">Account Number</Label>
                      <Input
                        id="accountNumber"
                        value={profileData.bankDetails.accountNumber}
                        readOnly
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ifscCode">IFSC Code</Label>
                      <Input
                        id="ifscCode"
                        value={profileData.bankDetails.ifscCode}
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accountType">Account Type</Label>
                    <Input
                      id="accountType"
                      value={profileData.bankDetails.accountType}
                      readOnly
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="social" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Social Media Links</CardTitle>
                  <CardDescription>Connect your social media accounts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="instagram">Instagram</Label>
                    <Input
                      id="instagram"
                      value={profileData.socialLinks.instagram}
                      onChange={(e) => setProfileData({
                        ...profileData,
                        socialLinks: { ...profileData.socialLinks, instagram: e.target.value }
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="youtube">YouTube</Label>
                    <Input
                      id="youtube"
                      value={profileData.socialLinks.youtube}
                      onChange={(e) => setProfileData({
                        ...profileData,
                        socialLinks: { ...profileData.socialLinks, youtube: e.target.value }
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="twitter">Twitter</Label>
                    <Input
                      id="twitter"
                      value={profileData.socialLinks.twitter}
                      onChange={(e) => setProfileData({
                        ...profileData,
                        socialLinks: { ...profileData.socialLinks, twitter: e.target.value }
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="facebook">Facebook</Label>
                    <Input
                      id="facebook"
                      value={profileData.socialLinks.facebook}
                      onChange={(e) => setProfileData({
                        ...profileData,
                        socialLinks: { ...profileData.socialLinks, facebook: e.target.value }
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={profileData.socialLinks.website}
                      onChange={(e) => setProfileData({
                        ...profileData,
                        socialLinks: { ...profileData.socialLinks, website: e.target.value }
                      })}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleSaveProfile} className="w-full sm:w-auto">
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}


