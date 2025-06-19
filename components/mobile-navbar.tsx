"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Music,
  User,
  Settings,
  LogOut,
  PlusCircle,
  HelpCircle,
  FileText,
  Youtube,
  Headphones,
  Wallet,
  DollarSign,
  Bell,
  Menu,
} from "lucide-react";
import { useCurrency } from "@/lib/currency-context";

export function MobileNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { currency, setCurrency } = useCurrency();
  const unreadNotificationsCount = 3; // Mock count - replace with real data

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
    <nav className="block md:hidden fixed top-0 left-0 right-0 z-50 bg-sidebar border-b border-sidebar-border">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Image 
            src="/logo.png" 
            alt="Tunewave Media Logo" 
            width={40} 
            height={40} 
            className="rounded-md object-cover" 
          />
          <span className="font-semibold text-sidebar-foreground">Tunewave Media</span>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unreadNotificationsCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {unreadNotificationsCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <div className="p-2">
                <h4 className="font-medium">Notifications</h4>
                <p className="text-sm text-muted-foreground">You have {unreadNotificationsCount} unread notifications</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/notifications" className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  View All Notifications
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Currency Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <DollarSign className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <div className="p-2">
                <h4 className="font-medium mb-2">Currency</h4>
                <Select value={currency} onValueChange={(value) => setCurrency(value as 'USD' | 'INR')}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="INR">INR (₹)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Main Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              {/* Navigation Section */}
              <div className="p-2">
                <h4 className="font-medium text-xs text-muted-foreground uppercase tracking-wider mb-2">Navigation</h4>
                
                <DropdownMenuItem asChild>
                  <Link href="/releases" className="flex items-center gap-2">
                    <Music className="h-4 w-4" />
                    <span>View All Releases</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link href="/releases/new" className="flex items-center gap-2">
                    <PlusCircle className="h-4 w-4" />
                    <span>New Release</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link href="/settings" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link href="/wallet" className="flex items-center gap-2">
                    <Wallet className="h-4 w-4" />
                    <span>Wallet</span>
                  </Link>
                </DropdownMenuItem>
              </div>

              <DropdownMenuSeparator />

              {/* Services & Support Section */}
              <div className="p-2">
                <h4 className="font-medium text-xs text-muted-foreground uppercase tracking-wider mb-2">Services & Support</h4>
                
                <DropdownMenuItem asChild>
                  <Link href="/service-request" className="flex items-center gap-2">
                    <Headphones className="h-4 w-4" />
                    <span>Service Request</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link href="/legal" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span>Legal</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link href="/connect-youtube" className="flex items-center gap-2">
                    <Youtube className="h-4 w-4" />
                    <span>Connect YouTube</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link href="/support" className="flex items-center gap-2">
                    <HelpCircle className="h-4 w-4" />
                    <span>Support</span>
                  </Link>
                </DropdownMenuItem>
              </div>

              <DropdownMenuSeparator />

              {/* Logout */}
              <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 text-destructive">
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
} 