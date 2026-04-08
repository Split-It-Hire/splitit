"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Calendar, Settings, LogOut, List, BookOpen } from "lucide-react";

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin/login");
  }

  const links = [
    { href: "/admin", label: "Dashboard", icon: <LayoutDashboard size={16} /> },
    { href: "/admin/bookings", label: "Bookings", icon: <List size={16} /> },
    { href: "/admin/calendar", label: "Calendar", icon: <Calendar size={16} /> },
    { href: "/admin/wiki", label: "Wiki", icon: <BookOpen size={16} /> },
    { href: "/admin/settings", label: "Settings", icon: <Settings size={16} /> },
  ];

  return (
    <nav className="bg-green-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
        <div className="flex items-center gap-1">
          <span
            className="text-lg font-extrabold uppercase tracking-tight mr-4"
            style={{ fontFamily: "var(--font-barlow), sans-serif" }}
          >
            Admin
          </span>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === link.href
                  ? "bg-green-700 text-white"
                  : "text-green-200 hover:text-white hover:bg-green-700"
              }`}
            >
              {link.icon}
              <span className="hidden sm:inline">{link.label}</span>
            </Link>
          ))}
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-1.5 text-green-200 hover:text-white text-sm transition-colors"
        >
          <LogOut size={15} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </nav>
  );
}
