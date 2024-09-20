"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  FileSliders,
  Gamepad2,
  Home,
  LibraryBig,
  LogOut,
  Menu,
  Plus,
  Settings,
  User,
  X,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function SidebarAdmin() {
  const [isOpen, setIsOpen] = useState(false);

  // Toggle function for mobile sidebar
  const toggleSidebar = () => setIsOpen(!isOpen);
  return (
    <div>
      {/* Mobile Toggle Button */}
      <div className="absolute top-4 left-4 z-20 sm:hidden">
        <button
          onClick={toggleSidebar}
          className="p-2 text-primary rounded-md bg-primary-foreground focus:outline-none"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <div className="md:w-14"> 
        <TooltipProvider>
          <aside className={`fixed inset-y-0 left-0 max-md:z-30 transition-transform transform ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 z-10 w-14 flex-col border-r bg-background flex max-md:py-4`}>
            <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
              <Link
                href="/app/play"
                className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
              >
                <Gamepad2 className="h-4 w-4 transition-all group-hover:scale-110" />
              </Link>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/app/dashboard" className="sidebarTooltipLink">
                    <Home className="h-5 w-5" />
                    <span className="sr-only">Dashboard</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">Dashboard</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href="/app/fragenkatalog"
                    className="sidebarTooltipLink"
                  >
                    <LibraryBig className="h-5 w-5" />
                    <span className="sr-only">Fragen einsehen</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">Fragen einsehen</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/app/quiz_manager" className="sidebarTooltipLink">
                    <Plus className="h-5 w-5" />
                    <span className="sr-only">Quiz Erstellen</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">Quiz Erstellen</TooltipContent>
              </Tooltip>
            </nav>
            <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/app/settings" className="sidebarTooltipLink">
                    <Settings className="h-5 w-5" />
                    <span className="sr-only">Einstellungen</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">Einstellungen</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/app/profile" className="sidebarTooltipLink">
                    <User className="h-5 w-5" />
                    <span className="sr-only">Profil</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">Profil</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/logout" replace className="sidebarTooltipLink">
                    <LogOut className="h-5 w-5" />
                    <span className="sr-only">Ausloggen</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">Ausloggen</TooltipContent>
              </Tooltip>
            </nav>
          </aside>
        </TooltipProvider>
      </div>
           {/* Overlay for mobile when sidebar is open */}
           {isOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 z-20 bg-black bg-opacity-50 sm:hidden"
        />
      )}
    </div>
  );
}
