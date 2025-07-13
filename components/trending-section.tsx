"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { ExternalLink, Twitter, Globe, MessageCircle, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { differenceInMinutes, differenceInHours, differenceInDays } from "date-fns"

export function TrendingSection() {
  const [token, setToken] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchToken() {
      try {
        const res = await fetch(
          "https://dev.liquidlaunch.app/api/tokens?page=1&limit=4000&search=&sortKey=age&sortOrder=desc&timeframe=24h&view=in_progress&marketCapMin=0&marketCapMax=1000000&progressMin=0&progressMax=100&filterByHolderCount=false",
        )
        const data = await res.json()
        const tokens = data.tokens || []
        const highest = tokens.reduce(
          (max: any, t: any) =>
            Number(t.timeframes?.["24h"]?.volume || 0) > Number(max.timeframes?.["24h"]?.volume || 0) ? t : max,
          tokens[0],
        )
        setToken(highest)
        setLoading(false)
      } catch (e) {
        setError("Failed to fetch token")
        setLoading(false)
      }
    }
    fetchToken()
  }, [])

  function formatNumber(num: number) {
    if (num >= 1e9) return (num / 1e9).toFixed(2) + "B"
    if (num >= 1e6) return (num / 1e6).toFixed(2) + "M"
    if (num >= 1e3) return (num / 1e3).toFixed(2) + "K"
    return num.toLocaleString(undefined, { maximumFractionDigits: 2 })
  }

  function formatShortTime(timestamp: number) {
    const now = Date.now()
    const date = timestamp * 1000
    const diffMins = differenceInMinutes(now, date)
    if (diffMins < 1) return "0m ago"
    if (diffMins < 60) return `${diffMins}m ago`
    const diffHours = differenceInHours(now, date)
    if (diffHours < 24) return `${diffHours}h ago`
    const diffDays = differenceInDays(now, date)
    return `${diffDays}d ago`
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Highest Volume</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-12 bg-gray-700/40 rounded animate-pulse" />
        </CardContent>
      </Card>
    )
  }

  if (error || !token) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Highest Volume</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-500 text-center">{error || "No data"}</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Volume (24 Hour)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Token Header with Image */}
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
              {token.metadata?.image_uri ? (
                <img
                  src={token.metadata.image_uri || "/placeholder.svg"}
                  alt={token.symbol}
                  className="w-full h-full object-cover rounded-full"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = "none"
                    const fallback = target.nextElementSibling as HTMLElement
                    if (fallback) fallback.style.display = "flex"
                  }}
                />
              ) : null}
              <div
                className="w-full h-full flex items-center justify-center text-sm font-bold"
                style={{ display: token.metadata?.image_uri ? "none" : "flex" }}
              >
                {token.symbol?.[0] || "?"}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 text-lg font-bold">
                {token.symbol} <span className="text-gray-400 font-normal truncate">{token.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={`https://dev.liquidlaunch.app/token/${token.address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
                >
                  {token.address.slice(0, 4)}...{token.address.slice(-4)} <ExternalLink className="w-3 h-3" />
                </a>
                {token.metadata?.twitter && (
                  <Button variant="ghost" size="icon" className="h-6 w-6" asChild>
                    <a href={token.metadata.twitter} target="_blank" rel="noopener noreferrer">
                      <Twitter className="h-4 w-4" />
                    </a>
                  </Button>
                )}
                {token.metadata?.website && (
                  <Button variant="ghost" size="icon" className="h-6 w-6" asChild>
                    <a href={token.metadata.website} target="_blank" rel="noopener noreferrer">
                      <Globe className="h-4 w-4" />
                    </a>
                  </Button>
                )}
                {token.metadata?.telegram && (
                  <Button variant="ghost" size="icon" className="h-6 w-6" asChild>
                    <a href={token.metadata.telegram} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="h-4 w-4" />
                    </a>
                  </Button>
                )}
                {token.metadata?.discord && (
                  <Button variant="ghost" size="icon" className="h-6 w-6" asChild>
                    <a href={token.metadata.discord} target="_blank" rel="noopener noreferrer">
                      <User className="h-4 w-4" />
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Metrics in Card Format */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-800/50 rounded-lg p-3">
              <div className="text-xs text-gray-400 mb-1">MC</div>
              <div className="font-semibold">${formatNumber(Number(token.marketCap?.usd))}</div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-3">
              <div className="text-xs text-gray-400 mb-1">Vol</div>
              <div className="font-semibold">${formatNumber(Number(token.timeframes?.["24h"]?.volume))}</div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-3">
              <div className="text-xs text-gray-400 mb-1">Chg</div>
              <div
                className={`font-semibold ${Number(token.timeframes?.["24h"]?.priceChange) >= 0 ? "text-green-500" : "text-red-500"}`}
              >
                {Number(token.timeframes?.["24h"]?.priceChange).toFixed(2)}%
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="text-xs text-gray-400">
            Created: {formatShortTime(token.creationTimestamp)} • Progress: {token.progress?.toFixed(2)}%
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
