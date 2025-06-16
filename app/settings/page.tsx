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
    <div className="container max-w-[90rem] py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
          Settings
        </h1>
        <p className="text-muted-foreground mt-1">Manage your account preferences and settings</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="account" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <span>Account</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span>Notifications</span>
          </TabsTrigger>
          {/* <TabsTrigger value="payment" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            <span>Payment</span>
          </TabsTrigger> */}
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            <span>Security</span>
          </TabsTrigger>
        </TabsList>

        {/* Account Settings */}
        <TabsContent value="account" className="space-y-6">
          <Card className="border shadow-sm overflow-hidden bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                General Settings
              </CardTitle>
              <CardDescription>Manage your account preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
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
                  className="flex space-x-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="light" id="light" />
                    <Label htmlFor="light" className="flex items-center gap-1 cursor-pointer">
                      <Sun className="h-4 w-4" /> Light
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="dark" id="dark" />
                    <Label htmlFor="dark" className="flex items-center gap-1 cursor-pointer">
                      <Moon className="h-4 w-4" /> Dark
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="system" id="system" />
                    <Label htmlFor="system" className="flex items-center gap-1 cursor-pointer">
                      <Laptop className="h-4 w-4" /> System
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="flex items-center justify-between space-y-0 pt-2">
                <div className="space-y-0.5">
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
              <CardTitle className="text-xl flex items-center gap-2">
                <Languages className="h-5 w-5 text-primary" />
                Display Settings
              </CardTitle>
              <CardDescription>Customize how information is displayed</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="date-format">Date Format</Label>
                <Select defaultValue="mdy">
                  <SelectTrigger id="date-format" className="w-full">
                    <SelectValue placeholder="Select date format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                    <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                    <SelectItem value="ymd">YYYY/MM/DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select defaultValue="ist">
                  <SelectTrigger id="timezone" className="w-full">
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ist">India Standard Time (IST)</SelectItem>
                    <SelectItem value="utc">Coordinated Universal Time (UTC)</SelectItem>
                    <SelectItem value="est">Eastern Standard Time (EST)</SelectItem>
                    <SelectItem value="pst">Pacific Standard Time (PST)</SelectItem>
                    <SelectItem value="gmt">Greenwich Mean Time (GMT)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Default View</Label>
                <RadioGroup defaultValue="card" className="flex space-x-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="cursor-pointer">
                      Card
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="list" id="list" />
                    <Label htmlFor="list" className="cursor-pointer">
                      List
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>

          <Card className="border shadow-sm overflow-hidden bg-card/50 backdrop-blur-sm border-destructive/10">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2 text-destructive">
                <Trash2 className="h-5 w-5" />
                Danger Zone
              </CardTitle>
              <CardDescription>Irreversible account actions</CardDescription>
            </CardHeader>
            <CardContent>
              <Alert variant="destructive" className="border-destructive/20 bg-destructive/5">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Warning</AlertTitle>
                <AlertDescription>
                  Deleting your account will permanently remove all your data, including releases, tracks, and payment
                  history.
                </AlertDescription>
              </Alert>
            </CardContent>
            <CardFooter>
              <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogTrigger asChild>
                  <Button variant="destructive" className="w-full">
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
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="confirm">Type "DELETE" to confirm</Label>
                      <Input id="confirm" placeholder="DELETE" />
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button variant="destructive">Delete Account</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="border shadow-sm overflow-hidden bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                Email Notifications
              </CardTitle>
              <CardDescription>Manage your email notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between space-y-0">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive email notifications for important updates</p>
                </div>
                <Switch
                  checked={notificationSettings.emailNotifications}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({ ...notificationSettings, emailNotifications: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between space-y-0">
                <div className="space-y-0.5">
                  <Label>Release Updates</Label>
                  <p className="text-sm text-muted-foreground">Get notified when your releases change status</p>
                </div>
                <Switch
                  checked={notificationSettings.releaseUpdates}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({ ...notificationSettings, releaseUpdates: checked })
                  }
                  disabled={!notificationSettings.emailNotifications}
                />
              </div>

              <div className="flex items-center justify-between space-y-0">
                <div className="space-y-0.5">
                  <Label>Payment Notifications</Label>
                  <p className="text-sm text-muted-foreground">Get notified about payments and royalties</p>
                </div>
                <Switch
                  checked={notificationSettings.paymentNotifications}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({ ...notificationSettings, paymentNotifications: checked })
                  }
                  disabled={!notificationSettings.emailNotifications}
                />
              </div>

              <div className="flex items-center justify-between space-y-0">
                <div className="space-y-0.5">
                  <Label>Marketing Emails</Label>
                  <p className="text-sm text-muted-foreground">Receive promotional emails and offers</p>
                </div>
                <Switch
                  checked={notificationSettings.marketingEmails}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({ ...notificationSettings, marketingEmails: checked })
                  }
                  disabled={!notificationSettings.emailNotifications}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border shadow-sm overflow-hidden bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Smartphone className="h-5 w-5 text-primary" />
                Push Notifications
              </CardTitle>
              <CardDescription>Manage your push notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between space-y-0">
                <div className="space-y-0.5">
                  <Label>Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive push notifications on your devices</p>
                </div>
                <Switch
                  checked={notificationSettings.pushNotifications}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({ ...notificationSettings, pushNotifications: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between space-y-0">
                <div className="space-y-0.5">
                  <Label>New Features</Label>
                  <p className="text-sm text-muted-foreground">Get notified about new platform features</p>
                </div>
                <Switch
                  checked={notificationSettings.newFeatures}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({ ...notificationSettings, newFeatures: checked })
                  }
                  disabled={!notificationSettings.pushNotifications}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleSaveSettings}
                className="w-full bg-gradient-to-r from-primary to-primary/80 hover:shadow-md"
              >
                Save Notification Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Payment Settings */}
        <TabsContent value="payment" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Settings</CardTitle>
              <CardDescription>Manage your payment preferences and withdrawal settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Default Currency</Label>
                    <p className="text-sm text-muted-foreground">Select your preferred currency for payments</p>
                  </div>
                  <Select
                    value={currency}
                    onValueChange={(value) => setCurrency(value as 'USD' | 'INR')}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="INR">INR (₹)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Withdrawal Threshold</Label>
                      <p className="text-sm text-muted-foreground">Minimum amount required for withdrawal</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={paymentSettings.withdrawThreshold}
                        onChange={(e) =>
                          setPaymentSettings({
                            ...paymentSettings,
                            withdrawThreshold: Number(e.target.value),
                          })
                        }
                        className="w-[180px]"
                      />
                      <span className="text-sm text-muted-foreground">
                        {currency === 'USD' ? 'USD' : 'INR'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Auto Withdrawal</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically withdraw when balance reaches {formatAmount(paymentSettings.withdrawThreshold)}
                      </p>
                    </div>
                    <Switch
                      checked={paymentSettings.autoWithdraw}
                      onCheckedChange={(checked) =>
                        setPaymentSettings({ ...paymentSettings, autoWithdraw: checked })
                      }
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card className="border shadow-sm overflow-hidden bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Key className="h-5 w-5 text-primary" />
                Password
              </CardTitle>
              <CardDescription>Update your password</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input id="confirm-password" type="password" />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Update Password</Button>
            </CardFooter>
          </Card>

          <Card className="border shadow-sm overflow-hidden bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Two-Factor Authentication
              </CardTitle>
              <CardDescription>Enhance your account security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between space-y-0">
                <div className="space-y-0.5">
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                </div>
                <Switch
                  checked={accountSettings.twoFactorAuth}
                  onCheckedChange={(checked) => setAccountSettings({ ...accountSettings, twoFactorAuth: checked })}
                />
              </div>

              {accountSettings.twoFactorAuth && (
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="text-sm font-medium">Verification Methods</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="sms" className="rounded border-gray-300" defaultChecked />
                      <Label htmlFor="sms" className="flex items-center gap-2 cursor-pointer">
                        <Smartphone className="h-4 w-4" /> SMS Verification
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="email-auth" className="rounded border-gray-300" defaultChecked />
                      <Label htmlFor="email-auth" className="flex items-center gap-2 cursor-pointer">
                        <Mail className="h-4 w-4" /> Email Verification
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="authenticator" className="rounded border-gray-300" />
                      <Label htmlFor="authenticator" className="flex items-center gap-2 cursor-pointer">
                        <Shield className="h-4 w-4" /> Authenticator App
                      </Label>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border shadow-sm overflow-hidden bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" />
                Login Sessions
              </CardTitle>
              <CardDescription>Manage your active sessions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 border rounded-md">
                  <div className="space-y-1">
                    <p className="font-medium">Current Session</p>
                    <p className="text-xs text-muted-foreground">Mumbai, India • Chrome on Windows</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Active</Badge>
                </div>
                <div className="flex justify-between items-center p-3 border rounded-md">
                  <div className="space-y-1">
                    <p className="font-medium">Mobile App</p>
                    <p className="text-xs text-muted-foreground">Mumbai, India • Android App</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Active</Badge>
                </div>
                <div className="flex justify-between items-center p-3 border rounded-md">
                  <div className="space-y-1">
                    <p className="font-medium">Unknown Device</p>
                    <p className="text-xs text-muted-foreground">Delhi, India • Safari on macOS</p>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                    7 days ago
                  </Badge>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Log Out All Other Sessions
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
