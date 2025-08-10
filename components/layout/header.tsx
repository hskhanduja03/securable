"use client";

import React, { useState } from "react";
import {
  Bell,
  Search,
  Globe,
  Sun,
  RotateCcw,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NotificationsPopover } from "../ui/notifications-popover";
import { SearchDialog } from "../ui/search-dialog";
import { useAuth } from "@/context/AuthContext";

export function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const {name, email} = useAuth();

  const handleSignOut = async () => {
    try {
      const response = await fetch("/api/auth/signout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        localStorage.removeItem("accessToken");
        window.location.href = "/auth/signin";
      } else {
        console.error("Sign Out failed");
      }
    } catch (error) {
      console.error("An unexpected error occurred during signout:", error);
    }
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex-1" />

          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-500 hover:text-gray-700"
            >
              <RotateCcw className="w-5 h-5" />
            </Button>

            <NotificationsPopover>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <Bell className="w-5 h-5" />
              </Button>
            </NotificationsPopover>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-9 w-9 rounded-full p-0 overflow-hidden"
                  aria-label="User menu"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarImage
                      src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400"
                      alt={name as string}
                    />
                    <AvatarFallback>JC</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-md p-2"
                align="end"
                forceMount
              >
                <DropdownMenuLabel className="px-3 py-2">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {name}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {email}
                    </span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-100 ">
                  <User className="w-4 h-4 text-gray-600" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-100 ">
                  <Settings className="w-4 h-4 text-gray-600" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="flex items-center gap-2 px-3 py-2 cursor-pointer text-red-600 hover:bg-gray-100 hover:text-red-400"
                >
                  <LogOut className="w-4 h-4 " />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
