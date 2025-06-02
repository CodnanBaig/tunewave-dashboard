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
  artistType: "Solo Artist",
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

  const handleSaveProfile = () => {
    // In a real app, this would save the profile data to the backend
    console.log("Saving profile data:", profileData)
    setIsEditing(false)
  }

  return (
    <div className="container max-w-7xl py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left column - Profile card */}
        <div className="md:w-1/3">
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
            <div className="relative px-6">
              <Avatar className="h-24 w-24 absolute -top-12 ring-4 ring-background">
                <AvatarImage src={profileData.profileImage || "/placeholder.svg"} alt={profileData.name} />
                <AvatarFallback>{profileData.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>
            <CardContent className="pt-16 pb-6">
              <h2 className="text-2xl font-bold">{profileData.name}</h2>
              <p className="text-muted-foreground">@{profileData.username}</p>

              <div className="flex flex-wrap gap-1 mt-2">
                {profileData.genres.map((genre) => (
                  <Badge
                    key={genre}
                    variant="secondary"
                    className="bg-primary/10 hover:bg-primary/20 transition-colors"
                  >
                    {genre}
                  </Badge>
                ))}
              </div>

              <div className="mt-4 space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{profileData.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{profileData.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{profileData.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Joined {format(new Date(profileData.joinDate), "MMMM yyyy")}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
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
            </CardContent>
          </Card>
        </div>

        {/* Right column - Tabs */}
        <div className="md:w-2/3">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="bank-details">Bank Details</TabsTrigger>
              <TabsTrigger value="edit-profile">Edit Profile</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">About</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{profileData.bio}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Music className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">New Release: "Summer Vibes"</p>
                      <p className="text-sm text-muted-foreground">
                        Released on {format(new Date("2023-06-15"), "MMMM d, yyyy")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Release Verified: "Midnight Dreams"</p>
                      <p className="text-sm text-muted-foreground">
                        Verified on {format(new Date("2023-08-25"), "MMMM d, yyyy")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <DollarSign className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Royalty Payment Received</p>
                      <p className="text-sm text-muted-foreground">
                        $350 received on {format(new Date("2023-09-01"), "MMMM d, yyyy")}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="bank-details" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Bank Details</CardTitle>
                  <CardDescription>Add your Indian bank account details for receiving payments</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="accountHolderName">Account Holder Name</Label>
                      <Input
                        id="accountHolderName"
                        value={profileData.bankDetails.accountHolderName}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            bankDetails: { ...profileData.bankDetails, accountHolderName: e.target.value },
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bankName">Bank Name</Label>
                      <Input
                        id="bankName"
                        value={profileData.bankDetails.bankName}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            bankDetails: { ...profileData.bankDetails, bankName: e.target.value },
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="accountNumber">Account Number</Label>
                      <Input
                        id="accountNumber"
                        value={profileData.bankDetails.accountNumber}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            bankDetails: { ...profileData.bankDetails, accountNumber: e.target.value },
                          })
                        }
                        maxLength={18}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ifscCode">IFSC Code</Label>
                      <Input
                        id="ifscCode"
                        value={profileData.bankDetails.ifscCode}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            bankDetails: { ...profileData.bankDetails, ifscCode: e.target.value.toUpperCase() },
                          })
                        }
                        maxLength={11}
                        placeholder="e.g., SBIN0001234"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="accountType">Account Type</Label>
                      <select
                        id="accountType"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={profileData.bankDetails.accountType}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            bankDetails: { ...profileData.bankDetails, accountType: e.target.value },
                          })
                        }
                      >
                        <option value="Savings">Savings Account</option>
                        <option value="Current">Current Account</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <p className="text-sm text-muted-foreground">
                    Note: Your bank details are encrypted and stored securely. We use these details only for processing your payments.
                  </p>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="edit-profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Personal Information</CardTitle>
                  <CardDescription>Update your personal details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col items-center mb-4">
                    <div className="relative mb-4">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src={profileData.profileImage || "/placeholder.svg"} alt={profileData.name} />
                        <AvatarFallback>{profileData.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute bottom-0 right-0 rounded-full h-8 w-8 bg-background shadow-sm"
                      >
                        <Upload className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">Upload a new profile picture</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      <Label htmlFor="artistType">Artist Type</Label>
                      <Input
                        id="artistType"
                        value={profileData.artistType}
                        onChange={(e) => setProfileData({ ...profileData, artistType: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      rows={4}
                      value={profileData.bio}
                      onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Social Media Links</CardTitle>
                  <CardDescription>Connect your social media accounts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="instagram" className="flex items-center gap-2">
                        <Instagram className="h-4 w-4" /> Instagram
                      </Label>
                      <Input
                        id="instagram"
                        value={profileData.socialLinks.instagram}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            socialLinks: { ...profileData.socialLinks, instagram: e.target.value },
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="youtube" className="flex items-center gap-2">
                        <Youtube className="h-4 w-4" /> YouTube
                      </Label>
                      <Input
                        id="youtube"
                        value={profileData.socialLinks.youtube}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            socialLinks: { ...profileData.socialLinks, youtube: e.target.value },
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="twitter" className="flex items-center gap-2">
                        <Twitter className="h-4 w-4" /> Twitter
                      </Label>
                      <Input
                        id="twitter"
                        value={profileData.socialLinks.twitter}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            socialLinks: { ...profileData.socialLinks, twitter: e.target.value },
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="facebook" className="flex items-center gap-2">
                        <Facebook className="h-4 w-4" /> Facebook
                      </Label>
                      <Input
                        id="facebook"
                        value={profileData.socialLinks.facebook}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            socialLinks: { ...profileData.socialLinks, facebook: e.target.value },
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="website" className="flex items-center gap-2">
                        <Globe className="h-4 w-4" /> Website
                      </Label>
                      <Input
                        id="website"
                        value={profileData.socialLinks.website}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            socialLinks: { ...profileData.socialLinks, website: e.target.value },
                          })
                        }
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={handleSaveProfile}
                    className="w-full bg-gradient-to-r from-primary to-primary/80 hover:shadow-md"
                  >
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

