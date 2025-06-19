"use client"

import { Badge } from "@/components/ui/badge"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import {
  Bell,
  CreditCard,
  Lock,
  Globe,
  Smartphone,
  Mail,
  Shield,
  Key,
  Trash2,
  AlertTriangle,
  DollarSign,
  Wallet,
  Languages,
  Moon,
  Sun,
  Laptop,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useCurrency } from "@/lib/currency-context"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("account")
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    releaseUpdates: true,
    paymentNotifications: true,
    marketingEmails: false,
    newFeatures: true,
  })
  const [accountSettings, setAccountSettings] = useState({
    language: "english",
    theme: "system",
    twoFactorAuth: false,
    autoSave: true,
  })
  const [paymentSettings, setPaymentSettings] = useState({
    defaultPaymentMethod: "bank",
    currency: "usd",
    autoWithdraw: false,
    withdrawThreshold: 50,
  })
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const { currency, setCurrency, formatAmount } = useCurrency()

  const handleSaveSettings = () => {
    // In a real app, this would save the settings to the backend
    console.log("Saving settings:", {
      notificationSettings,
      accountSettings,
      paymentSettings,
    })
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 max-w-7xl">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
          Settings
        </h1>
        <p className="text-muted-foreground mt-1 text-sm sm:text-base">Manage your account preferences and settings</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 mb-6 sm:mb-8">
          <TabsTrigger value="account" className="flex items-center gap-2 text-xs sm:text-sm">
            <Globe className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>Account</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2 text-xs sm:text-sm">
            <Bell className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>Notifications</span>
          </TabsTrigger>
          {/* <TabsTrigger value="payment" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            <span>Payment</span>
          </TabsTrigger> */}
          <TabsTrigger value="security" className="flex items-center gap-2 text-xs sm:text-sm">
            <Lock className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>Security</span>
          </TabsTrigger>
        </TabsList>

        {/* Account Settings */}
        <TabsContent value="account" className="space-y-4 sm:space-y-6">
          <Card className="border shadow-sm overflow-hidden bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                <Globe className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                General Settings
              </CardTitle>
              <CardDescription>Manage your account preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select
                  value={accountSettings.language}
                  onValueChange={(value) => setAccountSettings({ ...accountSettings, language: value })}
                >
                  <SelectTrigger id="language" className="w-full">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="hindi">Hindi</SelectItem>
                    <SelectItem value="spanish">Spanish</SelectItem>
                    <SelectItem value="french">French</SelectItem>
                    <SelectItem value="german">German</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Theme</Label>
                <RadioGroup
                  value={accountSettings.theme}
                  onValueChange={(value) => setAccountSettings({ ...accountSettings, theme: value })}
                  className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="light" id="light" />
                    <Label htmlFor="light" className="flex items-center gap-1 cursor-pointer text-sm">
                      <Sun className="h-3 w-3 sm:h-4 sm:w-4" /> Light
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="dark" id="dark" />
                    <Label htmlFor="dark" className="flex items-center gap-1 cursor-pointer text-sm">
                      <Moon className="h-3 w-3 sm:h-4 sm:w-4" /> Dark
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="system" id="system" />
                    <Label htmlFor="system" className="flex items-center gap-1 cursor-pointer text-sm">
                      <Laptop className="h-3 w-3 sm:h-4 sm:w-4" /> System
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="flex items-center justify-between space-y-0 pt-2">
                <div className="space-y-0.5 flex-1 pr-4">
                  <Label htmlFor="auto-save">Auto Save</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically save your changes while editing releases
                  </p>
                </div>
                <Switch
                  id="auto-save"
                  checked={accountSettings.autoSave}
                  onCheckedChange={(checked) => setAccountSettings({ ...accountSettings, autoSave: checked })}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border shadow-sm overflow-hidden bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                <Languages className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                Display Settings
              </CardTitle>
              <CardDescription>Customize how information is displayed</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              <div className="space-y-2">
                <Label htmlFor="date-format">Date Format</Label>
                <Select defaultValue="mdy">
                  <SelectTrigger id="date-format" className="w-full">
                    <SelectValue placeholder="Select date format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                    <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                    <SelectItem value="ymd">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="time-format">Time Format</Label>
                <Select defaultValue="12h">
                  <SelectTrigger id="time-format" className="w-full">
                    <SelectValue placeholder="Select time format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12h">12-hour (AM/PM)</SelectItem>
                    <SelectItem value="24h">24-hour</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-4 sm:space-y-6">
          <Card className="border shadow-sm overflow-hidden bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                Email Notifications
              </CardTitle>
              <CardDescription>Manage your email notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              <div className="flex items-center justify-between space-y-0">
                <div className="space-y-0.5 flex-1 pr-4">
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={notificationSettings.emailNotifications}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({ ...notificationSettings, emailNotifications: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between space-y-0">
                <div className="space-y-0.5 flex-1 pr-4">
                  <Label htmlFor="release-updates">Release Updates</Label>
                  <p className="text-sm text-muted-foreground">Get notified about release status changes</p>
                </div>
                <Switch
                  id="release-updates"
                  checked={notificationSettings.releaseUpdates}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({ ...notificationSettings, releaseUpdates: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between space-y-0">
                <div className="space-y-0.5 flex-1 pr-4">
                  <Label htmlFor="payment-notifications">Payment Notifications</Label>
                  <p className="text-sm text-muted-foreground">Get notified about payments and royalties</p>
                </div>
                <Switch
                  id="payment-notifications"
                  checked={notificationSettings.paymentNotifications}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({ ...notificationSettings, paymentNotifications: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between space-y-0">
                <div className="space-y-0.5 flex-1 pr-4">
                  <Label htmlFor="marketing-emails">Marketing Emails</Label>
                  <p className="text-sm text-muted-foreground">Receive promotional emails and updates</p>
                </div>
                <Switch
                  id="marketing-emails"
                  checked={notificationSettings.marketingEmails}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({ ...notificationSettings, marketingEmails: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between space-y-0">
                <div className="space-y-0.5 flex-1 pr-4">
                  <Label htmlFor="new-features">New Features</Label>
                  <p className="text-sm text-muted-foreground">Get notified about new platform features</p>
                </div>
                <Switch
                  id="new-features"
                  checked={notificationSettings.newFeatures}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({ ...notificationSettings, newFeatures: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border shadow-sm overflow-hidden bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                <Smartphone className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                Push Notifications
              </CardTitle>
              <CardDescription>Manage your push notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              <div className="flex items-center justify-between space-y-0">
                <div className="space-y-0.5 flex-1 pr-4">
                  <Label htmlFor="push-notifications">Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications on your device</p>
                </div>
                <Switch
                  id="push-notifications"
                  checked={notificationSettings.pushNotifications}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({ ...notificationSettings, pushNotifications: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-4 sm:space-y-6">
          <Card className="border shadow-sm overflow-hidden bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                Security Settings
              </CardTitle>
              <CardDescription>Manage your account security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              <div className="flex items-center justify-between space-y-0">
                <div className="space-y-0.5 flex-1 pr-4">
                  <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                </div>
                <Switch
                  id="two-factor"
                  checked={accountSettings.twoFactorAuth}
                  onCheckedChange={(checked) =>
                    setAccountSettings({ ...accountSettings, twoFactorAuth: checked })
                  }
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input id="current-password" type="password" placeholder="Enter current password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" placeholder="Enter new password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input id="confirm-password" type="password" placeholder="Confirm new password" />
                </div>
                <Button className="w-full sm:w-auto">Change Password</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border shadow-sm overflow-hidden bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                <Trash2 className="h-4 w-4 sm:h-5 sm:w-5 text-destructive" />
                Danger Zone
              </CardTitle>
              <CardDescription>Irreversible and destructive actions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Warning</AlertTitle>
                <AlertDescription>
                  Once you delete your account, there is no going back. Please be certain.
                </AlertDescription>
              </Alert>

              <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogTrigger asChild>
                  <Button variant="destructive" className="w-full sm:w-auto">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Account
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                      This action cannot be undone. This will permanently delete your account and remove all your data
                      from our servers.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button variant="destructive">Delete Account</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-8 flex justify-end">
        <Button onClick={handleSaveSettings} className="w-full sm:w-auto">
          Save Changes
        </Button>
      </div>
    </div>
  )
}
