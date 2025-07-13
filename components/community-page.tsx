"use client"

import type React from "react"

import { useState, useRef } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { CommunityProfiles } from "@/components/community-profiles"
import { motion, AnimatePresence } from "framer-motion"
import { BondedStatsCards } from "./community-stats"
import { X, Globe, Twitter, MessageCircle, User } from "lucide-react"

interface Profile {
  name: string
  avatar: string
  address: string
  symbol?: string
  metadata?: {
    website?: string
    twitter?: string
    discord?: string
    telegram?: string
    image_uri?: string
    description?: string
  }
}

export function CommunityPage() {
  const [selectedStats, setSelectedStats] = useState<any | null>(null)
  const [loadingStats, setLoadingStats] = useState(false)
  const [errorStats, setErrorStats] = useState<string | null>(null)
  const modalRef = useRef<HTMLDivElement>(null)

  const handleProfileSelect = async (profile: Profile) => {
    setErrorStats(null)
    setSelectedStats({ loading: true, token: { ...profile } })
    setLoadingStats(true)
    try {
      const res = await fetch(`https://dev.liquidlaunch.app/api/tokens/stats?address=${profile.address}`)
      if (!res.ok) throw new Error("Failed to fetch stats")
      const data = await res.json()
      setSelectedStats({ ...data, ...profile, loading: false })
    } catch (e) {
      setErrorStats("Failed to fetch token details")
      setSelectedStats({ ...profile, loading: false })
    } finally {
      setLoadingStats(false)
    }
  }

  // Close modal on outside click
  const handleModalOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && e.target === modalRef.current) {
      setSelectedStats(null)
    }
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="grid gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold gradient-text">Bonded Tokens</h1>
            <p className="text-text-secondary">
              Explore stats for all bonded tokens on Liquid Checker. These metrics reflect the current state of the bonded
              token ecosystem.
            </p>
          </div>
          <BondedStatsCards />
          <div className="space-y-6">
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-bold gradient-text">Graduated</h2>
              <p className="text-text-secondary">
                Tokens that have successfully completed the bonding process and graduated to full trading status.
              </p>
            </div>
            <CommunityProfiles onProfileSelect={handleProfileSelect} onTabChange={() => {}} />
          </div>
        </div>
        <AnimatePresence>
          {selectedStats && (
            <motion.div
              ref={modalRef}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleModalOverlayClick}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="relative bg-black rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl border-2 border-black"
              >
                <button
                  className="absolute top-4 right-4 flex items-center justify-center w-9 h-9 rounded-full text-white hover:text-primary transition-colors"
                  onClick={() => setSelectedStats(null)}
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
                {selectedStats.loading ? (
                  <div className="flex flex-col items-center justify-center min-h-[200px]">
                    <div className="w-20 h-20 rounded-full bg-gray-700/40 animate-pulse mb-4" />
                    <div className="h-6 w-32 bg-gray-700/40 rounded mb-2 animate-pulse" />
                  </div>
                ) : errorStats ? (
                  <div className="text-red-500 text-center min-h-[200px] flex items-center justify-center">
                    {errorStats}
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-4">
                    <img
                      src={selectedStats.token?.metadata?.image_uri || "/placeholder.svg"}
                      alt={selectedStats.token?.symbol}
                      className="h-20 w-20 rounded-full object-cover"
                    />
                    <h2 className="text-xl font-bold text-primary">{selectedStats.token?.symbol}</h2>
                    <div className="w-full text-center">
                      <a
                        href={`https://dev.liquidlaunch.app/token/${selectedStats.token?.address}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary underline break-all hover:text-primary/80 transition-colors"
                      >
                        {selectedStats.token?.address}
                      </a>
                      <div className="text-lg font-bold mt-2">{selectedStats.token?.name}</div>
                    </div>
                    <div className="flex flex-wrap gap-2 justify-center mt-2">
                      {selectedStats.token?.metadata?.website && (
                        <a
                          href={selectedStats.token.metadata.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-background hover:bg-primary/10 text-primary transition-colors"
                          title="Website"
                        >
                          <Globe className="h-5 w-5" />
                        </a>
                      )}
                      {selectedStats.token?.metadata?.twitter && (
                        <a
                          href={selectedStats.token.metadata.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-background hover:bg-primary/10 text-primary transition-colors"
                          title="Twitter"
                        >
                          <Twitter className="h-5 w-5" />
                        </a>
                      )}
                      {selectedStats.token?.metadata?.telegram && (
                        <a
                          href={selectedStats.token.metadata.telegram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-background hover:bg-primary/10 text-primary transition-colors"
                          title="Telegram"
                        >
                          <MessageCircle className="h-5 w-5" />
                        </a>
                      )}
                      {selectedStats.token?.metadata?.discord && (
                        <a
                          href={selectedStats.token.metadata.discord}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-background hover:bg-primary/10 text-primary transition-colors"
                          title="Discord"
                        >
                          <User className="h-5 w-5" />
                        </a>
                      )}
                    </div>
                    {selectedStats.token?.metadata?.description && (
                      <div className="text-sm text-gray-400 mt-2 text-center">
                        {selectedStats.token.metadata.description}
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  )
}
