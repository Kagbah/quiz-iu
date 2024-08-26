"use client";
import Link from "next/link";
import { Gamepad2, LineChart, LogOut, Settings, User } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider, // Importiere den TooltipProvider
} from "@/components/ui/tooltip";

export default async function SidebarUser() {
  return (
    <div className="w-14">
      <TooltipProvider>
        <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
          <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
            <Link
              href="#"
              className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
            >
              <Gamepad2 className="h-4 w-4 transition-all group-hover:scale-110" />
            </Link>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="#" className="sidebarTooltipLink">
                  <LineChart className="h-5 w-5" />
                  <span className="sr-only">Dashboard</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Dashboard</TooltipContent>
            </Tooltip>
          </nav>
          <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="#" className="sidebarTooltipLink">
                  <Settings className="h-5 w-5" />
                  <span className="sr-only">Einstellungen</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Einstellungen</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="#" className="sidebarTooltipLink">
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
  );
}
