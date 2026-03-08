"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Menu, X, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProjectsOpen, setIsProjectsOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-slate-950/80 backdrop-blur-xl border-b border-white/10 shadow-lg"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <motion.div
              className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
              whileHover={{ scale: 1.05 }}
            >
              AH Labs
            </motion.div>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-white/80 hover:text-white transition-colors"
            >
              Home
            </Link>

            <div
              className="relative"
              onMouseEnter={() => setIsProjectsOpen(true)}
              onMouseLeave={() => setIsProjectsOpen(false)}
            >
              <Link
                href="/projects"
                className="flex items-center space-x-1 text-white/80 hover:text-white transition-colors py-2 px-3 -mx-3 rounded-lg hover:bg-white/5 min-w-[100px]"
              >
                <span>Projects</span>
                <ChevronDown className="w-4 h-4" />
              </Link>

              {isProjectsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full left-0 mt-2 w-48 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-lg shadow-xl overflow-hidden"
                >
                  <Link
                    href="/projects/chattybot"
                    className="block px-4 py-3 text-white/80 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    ChattyBot
                  </Link>
                  <Link
                    href="/projects/drone"
                    className="block px-4 py-3 text-white/80 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    Drone Systems
                  </Link>
                </motion.div>
              )}
            </div>

            <Link
              href="/about"
              className="text-white/80 hover:text-white transition-colors"
            >
              About
            </Link>

            <Link
              href="/contact"
              className="text-white/80 hover:text-white transition-colors"
            >
              Contact
            </Link>

            <Link
              href="/contact"
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all"
            >
              Work With Us
            </Link>
          </div>

          <button
            className="md:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="md:hidden bg-slate-950/95 backdrop-blur-xl border-b border-white/10"
        >
          <div className="px-4 py-4 space-y-3">
            <Link
              href="/"
              className="block text-white/80 hover:text-white transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/projects"
              className="block text-white/80 hover:text-white transition-colors py-2 font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Projects
            </Link>
            <Link
              href="/projects/chattybot"
              className="block text-white/80 hover:text-white transition-colors py-2 pl-4"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              ChattyBot
            </Link>
            <Link
              href="/projects/drone"
              className="block text-white/80 hover:text-white transition-colors py-2 pl-4"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Drone Systems
            </Link>
            <Link
              href="/about"
              className="block text-white/80 hover:text-white transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/contact"
              className="block text-white/80 hover:text-white transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <Link
              href="/contact"
              className="block px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-semibold text-center"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Work With Us
            </Link>
          </div>
        </motion.div>
      )}
    </nav>
  )
}
