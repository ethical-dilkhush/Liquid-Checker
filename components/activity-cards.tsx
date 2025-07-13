"use client"

import React from "react"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Copy, ExternalLink, Twitter, Globe, Send, MessageSquare, Check, ChevronLeft, ChevronRight } from "lucide-react"
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

interface ActivityCardsProps {
  tokens: Token[]
  loading: boolean
  error: string | null
}

export function ActivityCards({ tokens, loading, error }: ActivityCardsProps) {
  const { toast } = useToast()
  const [currentPage, setCurrentPage] = useState(1)
  const [copied, setCopied] = useState<string | null>(null)
  const tokensPerPage = 20

  // Format currency with K, M, B suffixes - updated to handle nested API structure
  const formatCurrency = (value: any): string => {
    try {
      // Handle null, undefined, empty string, or non-existent values
      if (value === null || value === undefined || value === "" || value === "null" || value === "undefined") {
        return "N/A"
      }

      // Convert to number safely
      const numValue = Number.parseFloat(String(value))

      // Check if conversion resulted in a valid number
      if (isNaN(numValue) || !isFinite(numValue)) {
        return "N/A"
      }

      // Handle zero specifically
      if (numValue === 0) {
        return "$0"
      }

      // Handle negative values
      if (numValue < 0) {
        return "N/A"
      }

      // Format with suffixes using Math operations instead of toFixed
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

  // Extract market cap from nested structure
  const getMarketCap = (token: Token): string => {
    try {
      if (token.marketCap && token.marketCap.usd) {
        return formatCurrency(token.marketCap.usd)
      }
      return "N/A"
    } catch (error) {
      console.error("Error getting market cap:", error)
      return "N/A"
    }
  }

  // Extract liquidity from nested structure
  const getLiquidity = (token: Token): string => {
    try {
      if (token.liquidity && token.liquidity.usd) {
        return formatCurrency(token.liquidity.usd)
      }
      return "N/A"
    } catch (error) {
      console.error("Error getting liquidity:", error)
      return "N/A"
    }
  }

  // Extract volume from nested structure
  const getVolume = (token: Token): string => {
    try {
      if (token.timeframes && token.timeframes["24h"] && token.timeframes["24h"].volume) {
        return formatCurrency(token.timeframes["24h"].volume)
      }
      return "N/A"
    } catch (error) {
      console.error("Error getting volume:", error)
      return "N/A"
    }
  }

  // Get price change
  const getPriceChange = (token: Token): string => {
    try {
      if (token.timeframes && token.timeframes["24h"] && token.timeframes["24h"].priceChange) {
        const change = Number.parseFloat(token.timeframes["24h"].priceChange)
        if (!isNaN(change)) {
          return `${change > 0 ? "+" : ""}${change.toFixed(2)}%`
        }
      }
      return "N/A"
    } catch (error) {
      console.error("Error getting price change:", error)
      return "N/A"
    }
  }

  // Get price
  const getPrice = (token: Token): string => {
    try {
      if (token.price && token.price.usd) {
        const price = Number.parseFloat(token.price.usd)
        if (!isNaN(price)) {
          if (price < 0.000001) {
            return `$${price.toExponential(2)}`
          } else if (price < 0.01) {
            return `$${price.toFixed(6)}`
          } else {
            return `$${price.toFixed(4)}`
          }
        }
      }
      return "N/A"
    } catch (error) {
      console.error("Error getting price:", error)
      return "N/A"
    }
  }

  // Format progress to 2 decimal places
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

  // Format time ago
  const formatTimeAgo = (timestamp: string | number): string => {
    if (!timestamp) return "N/A"
    try {
      const now = new Date()
      // Convert to milliseconds if it's a Unix timestamp (seconds)
      const createdDate = typeof timestamp === "number" ? new Date(timestamp * 1000) : new Date(timestamp)
      const diffInSeconds = Math.floor((now.getTime() - createdDate.getTime()) / 1000)

      if (diffInSeconds < 60) {
        return `${diffInSeconds}s ago`
      } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60)
        return `${minutes}m ago`
      } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600)
        return `${hours}h ago`
      } else if (diffInSeconds < 2592000) {
        // 30 days
        const days = Math.floor(diffInSeconds / 86400)
        return `${days}d ago`
      } else if (diffInSeconds < 31536000) {
        // 365 days
        const months = Math.floor(diffInSeconds / 2592000)
        return `${months}mo ago`
      } else {
        const years = Math.floor(diffInSeconds / 31536000)
        return `${years}y ago`
      }
    } catch (error) {
      console.error("Error formatting time ago:", error)
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

  // Pagination
  const totalPages = Math.ceil(tokens.length / tokensPerPage)
  const startIndex = (currentPage - 1) * tokensPerPage
  const endIndex = startIndex + tokensPerPage
  const currentTokens = tokens.slice(startIndex, endIndex)

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1))
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i)
      }
    } else {
      // Always show first page
      pageNumbers.push(1)

      // Calculate start and end of visible pages
      let start = Math.max(2, currentPage - 1)
      let end = Math.min(totalPages - 1, currentPage + 1)

      // Adjust if at the beginning
      if (currentPage <= 3) {
        end = Math.min(totalPages - 1, 4)
      }

      // Adjust if at the end
      if (currentPage >= totalPages - 2) {
        start = Math.max(2, totalPages - 3)
      }

      // Add ellipsis after first page if needed
      if (start > 2) {
        pageNumbers.push("...")
      }

      // Add visible page numbers
      for (let i = start; i <= end; i++) {
        pageNumbers.push(i)
      }

      // Add ellipsis before last page if needed
      if (end < totalPages - 1) {
        pageNumbers.push("...")
      }

      // Always show last page
      pageNumbers.push(totalPages)
    }

    return pageNumbers
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="bg-white/5 backdrop-blur-sm border border-white/10">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <Skeleton className="h-6 w-24" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Pagination Info */}
      <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-text-muted">
        <p>
          Showing {startIndex + 1}-{Math.min(endIndex, tokens.length)} of {tokens.length} tokens
        </p>
        <p>
          Page {currentPage} of {totalPages}
        </p>
      </div>

      {/* Token Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentTokens.map((token, index) => (
          <Card
            key={`${token.id || token.address}-${index}`}
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

              {/* Token Stats - New Metrics Card Format */}
              <div className="grid grid-cols-3 gap-2">
                {/* MC (Market Cap) */}
                <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                  <div className="text-xs text-gray-400 mb-1">MC</div>
                  <div className="font-semibold text-sm">{getMarketCap(token)}</div>
                </div>

                {/* Vol (Volume) */}
                <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                  <div className="text-xs text-gray-400 mb-1">Vol</div>
                  <div className="font-semibold text-sm">{getVolume(token)}</div>
                </div>

                {/* Chg (Change) */}
                <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                  <div className="text-xs text-gray-400 mb-1">Chg</div>
                  <div
                    className={`font-semibold text-sm ${
                      getPriceChange(token).startsWith("+")
                        ? "text-green-500"
                        : getPriceChange(token).startsWith("-")
                          ? "text-red-500"
                          : "text-gray-400"
                    }`}
                  >
                    {getPriceChange(token)}
                  </div>
                </div>
              </div>

              {/* Created Date */}
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">Created:</span>
                <span className="font-medium">{formatTimeAgo(token.creationTimestamp)}</span>
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

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="h-8 w-8 bg-white/5 backdrop-blur-sm border border-white/10"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous page</span>
            </Button>

            {getPageNumbers().map((pageNumber, index) => (
              <React.Fragment key={index}>
                {pageNumber === "..." ? (
                  <span className="px-2">...</span>
                ) : (
                  <Button
                    variant={currentPage === pageNumber ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      if (typeof pageNumber === "number") {
                        setCurrentPage(pageNumber)
                        window.scrollTo({ top: 0, behavior: "smooth" })
                      }
                    }}
                    className={`h-8 w-8 ${
                      currentPage === pageNumber ? "bg-primary" : "bg-white/5 backdrop-blur-sm border border-white/10"
                    }`}
                  >
                    {pageNumber}
                  </Button>
                )}
              </React.Fragment>
            ))}

            <Button
              variant="outline"
              size="icon"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="h-8 w-8 bg-white/5 backdrop-blur-sm border border-white/10"
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next page</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
