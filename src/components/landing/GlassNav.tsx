"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export function GlassNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 h-16">
        <div className="container mx-auto h-full flex items-center justify-between px-6">
          <Link
            href="/"
            className="flex items-center gap-3 font-bold text-xl tracking-wide text-gray-900"
          >
            <span className="tracking-wide">Custodia</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-sm font-medium text-gray-700 hover:text-teal-700 transition-colors"
            >
              Home
            </Link>
            <Link
              href="#features"
              className="text-sm font-medium text-gray-700 hover:text-teal-700 transition-colors"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm font-medium text-gray-700 hover:text-teal-700 transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="/login"
              className="text-sm font-medium text-gray-700 hover:text-teal-700 transition-colors"
            >
              Sign In
            </Link>
            <Link href="/login">
              <Button className="bg-teal-600 hover:bg-teal-700">
                Get Started
              </Button>
            </Link>
          </div>

          <button
            className="md:hidden text-gray-700 hover:text-gray-900 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden bg-white"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="absolute top-16 left-0 right-0 border-b border-gray-200 bg-white p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <Link
              href="/"
              className="block text-gray-900 hover:text-teal-700 transition-colors font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="#features"
              className="block text-gray-900 hover:text-teal-700 transition-colors font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="block text-gray-900 hover:text-teal-700 transition-colors font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              How It Works
            </Link>
            <Link
              href="/login"
              className="block text-gray-900 hover:text-teal-700 transition-colors font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Sign In
            </Link>
            <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full mt-4 bg-teal-600 hover:bg-teal-700">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
