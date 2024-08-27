"use client";

import SidebarAdmin from "./SidebarAdmin";
import SidebarUser from "./SidebarUser";

interface SidebarProps {
  role: string;
}

export default function Sidebar({ role }: SidebarProps) {
  return role === "admin" ? <SidebarAdmin /> : <SidebarUser />;
}
