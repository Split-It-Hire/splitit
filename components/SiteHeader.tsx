"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Phone } from "lucide-react";

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span
              className="text-2xl font-extrabold tracking-tight uppercase"
              style={{
                fontFamily: "var(--font-barlow), sans-serif",
                color: "#245824",
              }}
            >
              Split It
            </span>
            <span
              className="text-sm font-semibold text-gray-500 hidden sm:block"
              style={{ fontFamily: "var(--font-inter), sans-serif" }}
            >
              Gold Coast
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-700">
            <Link href="/#pricing" className="hover:text-green-800 transition-colors">
              Pricing
            </Link>
            <Link href="/#how-it-works" className="hover:text-green-800 transition-colors">
              How It Works
            </Link>
            <Link href="/#faq" className="hover:text-green-800 transition-colors">
              FAQ
            </Link>
            <Link href="/terms" className="hover:text-green-800 transition-colors">
              Terms
            </Link>
          </nav>

          {/* CTA + mobile toggle */}
          <div className="flex items-center gap-3">
            <a
              href="tel:+61400000000"
              className="hidden sm:flex items-center gap-1 text-sm text-gray-600 hover:text-green-800 transition-colors"
            >
              <Phone size={14} />
              <span>0400 000 000</span>
            </a>
            <Link
              href="/book"
              className="bg-green-700 hover:bg-green-800 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              Book Now
            </Link>
            <button
              className="md:hidden p-1 text-gray-600"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 pb-4">
          <nav className="flex flex-col gap-1 pt-3">
            {[
              { href: "/#pricing", label: "Pricing" },
              { href: "/#how-it-works", label: "How It Works" },
              { href: "/#faq", label: "FAQ" },
              { href: "/terms", label: "Terms of Hire" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="py-2 text-gray-700 font-medium hover:text-green-800 transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <a
              href="tel:+61400000000"
              className="py-2 text-gray-600 flex items-center gap-2"
            >
              <Phone size={14} />
              0400 000 000
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
