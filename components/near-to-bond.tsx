"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { ExternalLink, Twitter, Globe, Send, MessageSquare, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

interface Token {
  id: string
  symbol: string
  name: string
  address: string
  metadata: {
    twitter?: string
    website?: string
    telegram?: string
    discord?: string
    description?: string
    image_uri?: string
  }
  creationTimestamp: string | number
  marketCap: {
    usd: string
  }
  liquidity: {
    usd: string
  }
  timeframes: {
    "24h": {
      volume: string
      priceChange: string
    }
  }
  progress: number
  holderCount: string
  price: {
    usd: string
  }
}

export function NearToBond() {
  const { toast } = useToast()
  const [tokens, setTokens] = useState<Token[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => {
    async function fetchTokens() {
      try {
        const res = await fetch(
          "https://dev.liquidlaunch.app/api/tokens?page=1&limit=4000&search=&sortKey=age&sortOrder=desc&timeframe=24h&view=in_progress&marketCapMin=0&marketCapMax=1000000&progressMin=0&progressMax=100&filterByHolderCount=false",
        )
        const data = await res.json()
        // Filter tokens with progress > 50% and sort by progress descending
        const filteredTokens = (data.tokens || [])
          .filter((token: Token) => {
            const progress = token.progress > 50
            const marketCap = token.marketCap?.usd && Number.parseFloat(String(token.marketCap.usd)) > 0
            const volume =
              token.timeframes?.["24h"]?.volume && Number.parseFloat(String(token.timeframes["24h"].volume)) > 0

            return progress && marketCap && volume
          })
          .sort((a: Token, b: Token) => b.progress - a.progress)
        setTokens(filteredTokens.slice(0, 6)) // Show top 6 tokens
        setLoading(false)
      } catch (e) {
        setError("Failed to fetch tokens")
        setLoading(false)
      }
    }
    fetchTokens()
  }, [])

  const formatCurrency = (value: any): string => {
    try {
      if (value === null || value === undefined || value === "" || value === "null" || value === "undefined") {
        return "N/A"
      }

      const numValue = Number.parseFloat(String(value))

      if (isNaN(numValue) || !isFinite(numValue)) {
        return "N/A"
      }

      if (numValue === 0) {
        return "$0"
      }

      if (numValue < 0) {
        return "N/A"
      }

      if (numValue >= 1000000000) {
        const billions = Math.round((numValue / 1000000000) * 100) / 100
        return `$${billions}B`
      } else if (numValue >= 1000000) {
        const millions = Math.round((numValue / 1000000) * 100) / 100
        return `$${millions}M`
      } else if (numValue >= 1000) {
        const thousands = Math.round((numValue / 1000) * 100) / 100
        return `$${thousands}K`
      } else {
        const rounded = Math.round(numValue * 100) / 100
        return `$${rounded}`
      }
    } catch (error) {
      console.error("Error formatting currency:", error, "Value:", value)
      return "N/A"
    }
  }

  const formatProgress = (progress: number): string => {
    try {
      if (progress === null || progress === undefined || isNaN(progress)) {
        return "0.00"
      }
      return (Math.round(progress * 100) / 100).toString()
    } catch (error) {
      return "0.00"
    }
  }

  // Format date - handle both string and number timestamps
  const formatDate = (timestamp: string | number) => {
    if (!timestamp) return "N/A"
    try {
      // Convert to milliseconds if it's a Unix timestamp (seconds)
      const date = typeof timestamp === "number" ? new Date(timestamp * 1000) : new Date(timestamp)

      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    } catch (error) {
      return "N/A"
    }
  }

  // Format holder count
  const formatNumber = (value: any): string => {
    try {
      if (value === null || value === undefined || value === "" || typeof value === "object") {
        return "0"
      }

      const numValue = Number(value)
      if (isNaN(numValue) || !isFinite(numValue)) {
        return "0"
      }

      if (numValue >= 1000000) {
        return `${Math.round(numValue / 10000) / 100}M`
      } else if (numValue >= 1000) {
        return `${Math.round(numValue / 10) / 100}K`
      } else {
        return Math.floor(numValue).toLocaleString()
      }
    } catch (error) {
      return "0"
    }
  }

  const truncateAddress = (address: string) => {
    if (!address) return "N/A"
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(text)
    toast({
      title: "Copied!",
      description: "Address copied to clipboard",
    })
    setTimeout(() => setCopied(null), 2000)
  }

  const redirectToToken = (address: string) => {
    window.open(`https://dev.liquidlaunch.app/token/${address}`, "_blank")
  }

  if (loading) {
    return (
      <Card className="bg-white/5 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle>Near to Bond</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 space-y-4 animate-pulse"
              >
                <div className="flex items-start gap-3">
                  <div className="h-12 w-12 bg-gray-700/40 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-5 w-20 bg-gray-700/40 rounded" />
                    <div className="h-4 w-32 bg-gray-700/40 rounded" />
                  </div>
                  <div className="h-6 w-24 bg-gray-700/40 rounded" />
                </div>
                <div className="flex gap-2">
                  <div className="h-8 w-8 bg-gray-700/40 rounded-full" />
                  <div className="h-8 w-8 bg-gray-700/40 rounded-full" />
                  <div className="h-8 w-8 bg-gray-700/40 rounded-full" />
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-full bg-gray-700/40 rounded" />
                  <div className="h-4 w-3/4 bg-gray-700/40 rounded" />
                  <div className="h-4 w-1/2 bg-gray-700/40 rounded" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="bg-white/5 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle>Near to Bond</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center p-8">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (tokens.length === 0) {
    return (
      <Card className="bg-white/5 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle>Near to Bond</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center p-8">
            <p className="text-text-muted">No tokens near to bond found</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white/5 backdrop-blur-sm border border-white/10">
      <CardHeader>
        <CardTitle>Near to Bond</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tokens.map((token, index) => (
            <Card
              key={`${token.address}-${index}`}
              className="bg-white/5 backdrop-blur-sm border border-white/10 hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
            >
              <CardContent className="p-6 space-y-4">
                {/* Token Header with Image at Top Left */}
                <div className="flex items-start gap-3">
                  {/* Token Image - Top Left */}
                  <div className="relative w-12 h-12 rounded-full overflow-hidden bg-white/10 flex items-center justify-center flex-shrink-0">
                    {token.metadata?.image_uri ? (
                      <img
                        src={token.metadata.image_uri || "/placeholder.svg"}
                        alt={`${token.symbol} logo`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = "none"
                          const fallback = target.nextElementSibling as HTMLElement
                          if (fallback) fallback.style.display = "flex"
                        }}
                      />
                    ) : null}
                    <div
                      className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white/70"
                      style={{ display: token.metadata?.image_uri ? "none" : "flex" }}
                    >
                      {token.symbol.charAt(0)}
                    </div>
                  </div>

                  {/* Token Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg truncate">{token.symbol || "N/A"}</h3>
                    <p className="text-sm text-text-muted truncate">{token.name || "Unknown Token"}</p>
                  </div>

                  {/* Address Section */}
                  <div className="flex items-center gap-1 bg-white/10 rounded-md px-2 py-1">
                    <button
                      onClick={() => redirectToToken(token.address)}
                      className="text-xs text-text-muted hover:text-primary flex items-center gap-1 cursor-pointer"
                      aria-label="View token page"
                    >
                      {truncateAddress(token.address)}
                      <ExternalLink className="h-3 w-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        copyToClipboard(token.address)
                      }}
                      className="text-xs text-text-muted hover:text-primary flex items-center gap-1 ml-1"
                      aria-label="Copy address"
                    >
                      {copied === token.address ? (
                        <Check className="h-3 w-3 text-green-500" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex flex-wrap gap-2">
                  {token.metadata?.twitter && (
                    <a
                      href={
                        token.metadata.twitter.startsWith("http")
                          ? token.metadata.twitter
                          : `https://${token.metadata.twitter}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-white/10 rounded-full hover:bg-primary/20 transition-colors"
                      aria-label="Twitter"
                    >
                      <Twitter className="h-4 w-4" />
                    </a>
                  )}
                  {token.metadata?.website && (
                    <a
                      href={
                        token.metadata.website.startsWith("http")
                          ? token.metadata.website
                          : `https://${token.metadata.website}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-white/10 rounded-full hover:bg-primary/20 transition-colors"
                      aria-label="Website"
                    >
                      <Globe className="h-4 w-4" />
                    </a>
                  )}
                  {token.metadata?.telegram && (
                    <a
                      href={
                        token.metadata.telegram.startsWith("http")
                          ? token.metadata.telegram
                          : `https://${token.metadata.telegram}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-white/10 rounded-full hover:bg-primary/20 transition-colors"
                      aria-label="Telegram"
                    >
                      <Send className="h-4 w-4" />
                    </a>
                  )}
                  {token.metadata?.discord && (
                    <a
                      href={
                        token.metadata.discord.startsWith("http")
                          ? token.metadata.discord
                          : `https://${token.metadata.discord}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-white/10 rounded-full hover:bg-primary/20 transition-colors"
                      aria-label="Discord"
                    >
                      <MessageSquare className="h-4 w-4" />
                    </a>
                  )}
                </div>

                {/* Description */}
                {token.metadata?.description && (
                  <p className="text-xs text-text-muted line-clamp-2">{token.metadata.description}</p>
                )}

                {/* Metrics in Card Format */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-gray-800/50 rounded-lg p-2">
                    <div className="text-xs text-gray-400 mb-1">MC</div>
                    <div className="font-semibold text-sm">{formatCurrency(token.marketCap?.usd)}</div>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-2">
                    <div className="text-xs text-gray-400 mb-1">Vol</div>
                    <div className="font-semibold text-sm">{formatCurrency(token.timeframes?.["24h"]?.volume)}</div>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-2">
                    <div className="text-xs text-gray-400 mb-1">Chg</div>
                    <div
                      className={`font-semibold text-sm ${Number(token.timeframes?.["24h"]?.priceChange) >= 0 ? "text-green-500" : "text-red-500"}`}
                    >
                      {Number(token.timeframes?.["24h"]?.priceChange).toFixed(2)}%
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-text-muted">Progress:</span>
                    <span className="font-medium">{formatProgress(token.progress)}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-1.5">
                    <div
                      className="bg-primary h-1.5 rounded-full"
                      style={{ width: `${formatProgress(token.progress)}%` }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
