"use client";

import { Home, Music, User, Settings, LogOut, PlusCircle, HelpCircle, FileText, Youtube, Headphones, Wallet, DollarSign, Bell } from "lucide-react";
import { usePathname } from "next/navigation";
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
  const [isReleasesOpen, setIsReleasesOpen] = useState(false);
  const { currency, setCurrency } = useCurrency();
  // This would typically come from your backend/API or a notification context
  const unreadNotificationsCount = 3; // Mock count - replace with real data

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <Sidebar variant="sidebar" collapsible="icon" side="left">
      <SidebarHeader className="flex flex-row justify-between items-center gap-3 px-4 py-3">
        <Image src="/logo.png" alt="SP Music Zone Logo" width={80} height={80} className="rounded-md" />
        <SidebarTrigger />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
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
                  <Music />
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
                    <User />
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
                    <Settings />
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
                    <Wallet />
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
                      <Bell />
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
          <SidebarGroupLabel>Services & Support</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/service-request")}
                  tooltip="Service Request"
                >
                  <Link href="/service-request">
                    <Headphones />
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
                    <FileText />
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
                    <Youtube />
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
                    <HelpCircle />
                    <span>Support</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
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
      </SidebarFooter>
    </Sidebar>
  );
}
