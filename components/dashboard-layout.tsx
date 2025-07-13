"use client"

import React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  LinkIcon,
  MessageCircle,
  Info,
  Menu,
  ChevronLeft,
  BarChart3,
  Wallet,
  Activity,
  Droplets,
  PieChart,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { ConnectWalletButton } from "@/components/connect-wallet-button"
import Image from "next/image"

interface DashboardLayoutProps {
  children: React.ReactNode
}

type Route = {
  href?: string
  label: string
  icon: React.ElementType
  active?: boolean
  type: "link"
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const routes: Route[] = [
    {
      href: "/",
      label: "Dashboard",
      icon: Home,
      active: pathname === "/",
      type: "link",
    },
    {
      href: "/bonded",
      label: "Bonded",
      icon: LinkIcon,
      active: pathname === "/bonded",
      type: "link",
    },
    {
      href: "/engagement",
      label: "Engagement",
      icon: MessageCircle,
      active: pathname === "/engagement",
      type: "link",
    },
    {
      href: "/activity",
      label: "Activity",
      icon: Activity,
      active: pathname === "/activity",
      type: "link",
    },
    {
      href: "/liquid-launch",
      label: "Liquid Launch",
      icon: Droplets,
      active: pathname === "/liquid-launch",
      type: "link",
    },
    {
      href: "/volume",
      label: "Volume",
      icon: BarChart3,
      active: pathname === "/volume",
      type: "link",
    },
    {
      href: "/quick-stats",
      label: "Quick Stats",
      icon: PieChart,
      active: pathname === "/quick-stats",
      type: "link",
    },
    {
      href: "#",
      label: "Connect Wallet",
      icon: Wallet,
      active: false,
      type: "link",
    },
    {
      href: "/about",
      label: "About",
      icon: Info,
      active: pathname === "/about",
      type: "link",
    },
  ]

  if (!isMounted) {
    return null
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 z-50 w-64 flex-col bg-surface shadow-2xl rounded-r-2xl">
        <div className="flex h-20 items-center justify-between px-4 py-4">
          <div className="flex flex-row items-center whitespace-nowrap">
            <div className="relative h-12 w-12 mr-1">
              <Image fill alt="Liquid Checker Logo" src="/liquid-stats-logo.png" className="object-contain" />
            </div>
            <span className="ml-3 text-2xl font-bold text-text-primary whitespace-nowrap">LiquidChecker</span>
          </div>
        </div>
        <div className="flex-1 overflow-auto py-4">
          <nav className="grid items-start gap-2 px-3">
            {routes.map((route, index) => (
              <React.Fragment key={`${route.href}-${index}`}>
                {route.label === "Connect Wallet" ? (
                  <ConnectWalletButton className="flex items-center gap-3 py-3 px-3 rounded-xl relative group transition-all duration-300 hover:bg-accent-dark/20 text-text-primary hover:text-accent cursor-pointer" />
                ) : (
                  <Link href={route.href || "#"}>
                    <div
                      className={cn(
                        "flex items-center gap-3 py-3 px-3 rounded-xl relative group transition-all duration-300",
                        route.active ? "shadow-md" : "hover:bg-accent-dark/20 text-text-primary hover:text-accent",
                      )}
                      style={route.active ? { backgroundColor: "#7CFFE3", color: "#000000" } : {}}
                    >
                      <route.icon
                        className={cn(
                          "h-5 w-5 transition-colors",
                          route.active ? "" : "text-text-muted group-hover:text-accent",
                        )}
                        style={route.active ? { color: "#000000" } : {}}
                      />
                      <span
                        className={cn(
                          "text-sm transition-colors",
                          route.active ? "font-medium" : "group-hover:text-accent",
                        )}
                        style={route.active ? { color: "#000000" } : {}}
                      >
                        {route.label}
                      </span>
                    </div>
                  </Link>
                )}
              </React.Fragment>
            ))}
          </nav>
        </div>
      </aside>

      {/* Hamburger menu for mobile */}
      <button
        className="fixed top-4 right-4 z-50 lg:hidden rounded-xl p-2"
        style={{ color: "#18C27C" }}
        onClick={() => setSidebarOpen(true)}
        aria-label="Open sidebar menu"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Mobile Sidebar Drawer */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 z-40 bg-black/40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
            />
            {/* Drawer */}
            <motion.aside
              initial={{ x: 300 }}
              animate={{ x: 0 }}
              exit={{ x: 300 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 h-full w-64 bg-surface shadow-2xl rounded-l-2xl z-50 flex flex-col lg:hidden"
            >
              <div className="flex h-20 items-center justify-between px-4 py-4">
                <div className="flex flex-row items-center whitespace-nowrap">
                  <div className="relative h-12 w-12 mr-1">
                    <Image fill alt="Liquid Checker Logo" src="/liquid-stats-logo.png" className="object-contain" />
                  </div>
                  <span className="ml-3 text-2xl font-bold text-text-primary whitespace-nowrap">Liquid Checker</span>
                </div>
                <button
                  className="p-2 hover:bg-accent-dark/20 rounded-lg transition-colors"
                  onClick={() => setSidebarOpen(false)}
                  aria-label="Close sidebar menu"
                >
                  <ChevronLeft className="h-6 w-6 text-text-primary" />
                </button>
              </div>
              <div className="flex-1 overflow-auto py-4">
                <nav className="grid items-start gap-2 px-3">
                  {routes.map((route, index) => (
                    <React.Fragment key={`${route.href}-${index}`}>
                      {route.label === "Connect Wallet" ? (
                        <ConnectWalletButton className="flex items-center gap-3 py-3 px-3 rounded-xl relative group transition-all duration-300 hover:bg-accent-dark/20 text-text-primary hover:text-accent cursor-pointer" />
                      ) : (
                        <Link href={route.href || "#"}>
                          <div
                            className={cn(
                              "flex items-center gap-3 py-3 px-3 rounded-xl relative group transition-all duration-300",
                              route.active
                                ? "shadow-md"
                                : "hover:bg-accent-dark/20 text-text-primary hover:text-accent",
                            )}
                            style={route.active ? { backgroundColor: "#7CFFE3", color: "#000000" } : {}}
                          >
                            <route.icon
                              className={cn(
                                "h-5 w-5 transition-colors",
                                route.active ? "" : "text-text-muted group-hover:text-accent",
                              )}
                              style={route.active ? { color: "#000000" } : {}}
                            />
                            <span
                              className={cn(
                                "text-sm transition-colors",
                                route.active ? "font-medium" : "group-hover:text-accent",
                              )}
                              style={route.active ? { color: "#000000" } : {}}
                            >
                              {route.label}
                            </span>
                          </div>
                        </Link>
                      )}
                    </React.Fragment>
                  ))}
                </nav>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main className="flex-1 min-h-screen bg-background p-2 lg:p-8 w-full ml-0 lg:ml-64 transition-all duration-300">
        <div className="max-w-7xl mx-auto w-full">{children}</div>
      </main>
    </div>
  )
}

// Add default export as well for compatibility
export default DashboardLayout
