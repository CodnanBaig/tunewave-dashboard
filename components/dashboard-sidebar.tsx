"use client";

import { Home, Music, User, Settings, LogOut, PlusCircle, HelpCircle, FileText, Youtube, Headphones, Wallet, DollarSign, Bell, ChevronDown } from "lucide-react";
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
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useCurrency } from "@/lib/currency-context";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isReleasesOpen, setIsReleasesOpen] = useState(pathname.startsWith('/releases'));
  const { currency, setCurrency } = useCurrency();
  const unreadNotificationsCount = 3; 

  const isActive = (path: string) => {
    return pathname === path;
  };

  const handleLogout = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Client-ID': process.env.NEXT_PUBLIC_CLIENT_ID || '',
        },
      });

      if (response.ok) {
        router.push('/auth');
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <Sidebar variant="sidebar" collapsible="icon" side="left" className="hidden md:block border-r">
      <SidebarHeader className="flex items-center justify-between gap-3 px-3 h-18 border-b">
        <Link href="/releases" className="flex items-center gap-2 flex-1">
            <Image 
              src="/logo.png" 
              alt="Tunewave Logo" 
              width={70} 
              height={70} 
              className="w-15 h-15 object-contain rounded-md" 
            />
            
        </Link>
        <SidebarTrigger />
      </SidebarHeader>

      <SidebarContent className="flex-1 p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={pathname.startsWith("/releases")}
              tooltip="Releases"
              onClick={() => setIsReleasesOpen((open) => !open)}
              className="w-full justify-between"
            >
              <div className="flex items-center gap-3">
                <Music className="h-5 w-5" />
                <span className="group-data-[state=collapsed]:hidden">Releases</span>
              </div>
              <ChevronDown className={`h-4 w-4 transition-transform group-data-[state=collapsed]:hidden ${isReleasesOpen ? 'rotate-180' : ''}`} />
            </SidebarMenuButton>
            {isReleasesOpen && (
              <SidebarMenuSub className="pl-6 mt-1 space-y-1">
                 <SidebarMenuSubItem>
                  <SidebarMenuSubButton asChild isActive={isActive("/releases")} className="h-8"> 
                    <Link href="/releases">View All</Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton asChild isActive={isActive("/releases/new")} className="h-8"> 
                    <Link href="/releases/new">New Release</Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              </SidebarMenuSub>
            )}
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/profile")} tooltip="Profile">
              <Link href="/profile" className="flex items-center gap-3">
                <User className="h-5 w-5" />
                <span className="group-data-[state=collapsed]:hidden">Profile</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/settings")} tooltip="Settings">
              <Link href="/settings" className="flex items-center gap-3">
                <Settings className="h-5 w-5" />
                <span className="group-data-[state=collapsed]:hidden">Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/wallet")} tooltip="Wallet">
              <Link href="/wallet" className="flex items-center gap-3">
                <Wallet className="h-5 w-5" />
                <span className="group-data-[state=collapsed]:hidden">Wallet</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/notifications")} tooltip="Notifications">
              <Link href="/notifications" className="flex items-center justify-between w-full gap-3">
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5" />
                  <span className="group-data-[state=collapsed]:hidden">Notifications</span>
                </div>
                {unreadNotificationsCount > 0 && (
                  <Badge variant="destructive" className="h-5 w-5 flex items-center justify-center p-0 group-data-[state=collapsed]:-right-1 group-data-[state=collapsed]:-top-1 group-data-[state=collapsed]:absolute">
                    {unreadNotificationsCount}
                  </Badge>
                )}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarSeparator className="my-2"/>

          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/service-request")} tooltip="Service Request">
              <Link href="/service-request" className="flex items-center gap-3">
                <Headphones className="h-5 w-5" />
                <span className="group-data-[state=collapsed]:hidden">Service Request</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/legal")} tooltip="Legal">
              <Link href="/legal" className="flex items-center gap-3">
                <FileText className="h-5 w-5" />
                <span className="group-data-[state=collapsed]:hidden">Legal</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/connect-youtube")} tooltip="Connect YouTube">
              <Link href="/connect-youtube" className="flex items-center gap-3">
                <Youtube className="h-5 w-5" />
                <span className="group-data-[state=collapsed]:hidden">Connect YouTube</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/support")} tooltip="Support">
              <Link href="/support" className="flex items-center gap-3">
                <HelpCircle className="h-5 w-5" />
                <span className="group-data-[state=collapsed]:hidden">Support</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-2 border-t">
        <div className="flex flex-col gap-2">
          <Select value={currency} onValueChange={(value) => setCurrency(value as 'USD' | 'INR')}>
            <Tooltip>
              <TooltipTrigger asChild>
                <SelectTrigger className="w-full justify-start gap-3 h-9 px-3 group-data-[state=collapsed]:w-9 group-data-[state=collapsed]:justify-center group-data-[state=collapsed]:px-0">
                  <DollarSign className="h-5 w-5" />
                  <div className="group-data-[state=collapsed]:hidden flex justify-between w-full">
                    <SelectValue placeholder="Currency" />
                  </div>
                </SelectTrigger>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Currency</p>
              </TooltipContent>
            </Tooltip>
            <SelectContent>
              <SelectItem value="USD">USD ($)</SelectItem>
              <SelectItem value="INR">INR (₹)</SelectItem>
            </SelectContent>
          </Select>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                onClick={handleLogout}
                className="w-full justify-start gap-3 h-9 px-3 group-data-[state=collapsed]:w-9 group-data-[state=collapsed]:justify-center group-data-[state=collapsed]:px-0"
              >
                <LogOut className="h-5 w-5" />
                <span className="group-data-[state=collapsed]:hidden">Logout</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Logout</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
