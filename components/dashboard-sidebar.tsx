"use client";

import { Home, Music, User, Settings, LogOut, PlusCircle, HelpCircle, FileText, Youtube, Headphones, Wallet, DollarSign, Bell } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarTrigger,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useCurrency } from "@/lib/currency-context";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isReleasesOpen, setIsReleasesOpen] = useState(false);
  const { currency, setCurrency } = useCurrency();
  // This would typically come from your backend/API or a notification context
  const unreadNotificationsCount = 3; // Mock count - replace with real data

  const isActive = (path: string) => {
    return pathname === path;
  };

  const handleLogout = async () => {
    try {
      // Make a request to the logout API endpoint
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/logout`, {
        method: 'POST',
        credentials: 'include', // Include cookies for authentication
        headers: {
          'Content-Type': 'application/json',
          'Client-ID': process.env.NEXT_PUBLIC_CLIENT_ID || '',
        },
      });

      if (response.ok) {
        // Redirect to login page after successful logout
        router.push('/auth');
      } else {
        console.error('Logout failed');
        // You might want to show a toast notification here
      }
    } catch (error) {
      console.error('Error during logout:', error);
      // You might want to show a toast notification here
    }
  };

  return (
    <Sidebar variant="sidebar" collapsible="icon" side="left" className="hidden md:block">
      <SidebarHeader className="flex flex-row justify-between items-center gap-3 px-4 py-3">
        <Image 
          src="/logo.png" 
          alt="SP Music Zone Logo" 
          width={100} 
          height={100} 
          className="w-20 h-20 sm:w-14 sm:h-14 md:w-20 md:h-20 object-cover" 
        />
        <SidebarTrigger />
      </SidebarHeader>
      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel className="px-2 text-xs font-medium text-muted-foreground">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/")}>
                  <Link href="/">
                    <Home />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem> */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={isActive("/releases") || isActive("/releases/new")}
                  tooltip="Releases"
                  onClick={() => setIsReleasesOpen((open) => !open)}
                  style={{ cursor: 'pointer' }}
                >
                  <Music className="h-4 w-4" />
                  <span>Releases</span>
                </SidebarMenuButton>
                {isReleasesOpen && (
                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild isActive={isActive("/releases")}> 
                        <Link href="/releases">View All Releases</Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild isActive={isActive("/releases/new")}> 
                        <Link href="/releases/new">New Release</Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                )}
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/profile")}
                  tooltip="Profile"
                >
                  <Link href="/profile">
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/settings")}
                  tooltip="Settings"
                >
                  <Link href="/settings">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/wallet")}
                  tooltip="Wallet"
                >
                  <Link href="/wallet">
                    <Wallet className="h-4 w-4" />
                    <span>Wallet</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/notifications")}
                  tooltip="Notifications"
                >
                  <Link href="/notifications" className="flex items-center gap-2">
                    <span className="relative">
                      <Bell className="h-4 w-4" />
                      {unreadNotificationsCount > 0 && (
                        <Badge
                          variant="destructive"
                          className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                        >
                          {unreadNotificationsCount}
                        </Badge>
                      )}
                    </span>
                    <span>Notifications</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel className="px-2 text-xs font-medium text-muted-foreground">Services & Support</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/service-request")}
                  tooltip="Service Request"
                >
                  <Link href="/service-request">
                    <Headphones className="h-4 w-4" />
                    <span>Service Request</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/legal")}
                  tooltip="Legal"
                >
                  <Link href="/legal">
                    <FileText className="h-4 w-4" />
                    <span>Legal</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/connect-youtube")}
                  tooltip="Connect YouTube"
                >
                  <Link href="/connect-youtube">
                    <Youtube className="h-4 w-4" />
                    <span>Connect YouTube</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/support")}
                  tooltip="Support"
                >
                  <Link href="/support">
                    <HelpCircle className="h-4 w-4" />
                    <span>Support</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <Select value={currency} onValueChange={(value) => setCurrency(value as 'USD' | 'INR')}>
              <SelectTrigger className="h-8 w-[100px]">
                <SelectValue placeholder="Currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD ($)</SelectItem>
                <SelectItem value="INR">INR (₹)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleLogout}
            className="w-full justify-start gap-2"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
