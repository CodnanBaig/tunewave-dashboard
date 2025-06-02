"use client";

import { Home, Music, User, Settings, LogOut, PlusCircle, HelpCircle, FileText, Youtube, Headphones, Wallet } from "lucide-react";
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

export function DashboardSidebar() {
  const pathname = usePathname();
  const [isReleasesOpen, setIsReleasesOpen] = useState(false);

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
      <SidebarFooter>
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2"
        >
          <LogOut className="h-4 w-4" />
          <Link href="/" className="group-data-[collapsible=icon]:hidden">Logout</Link>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
