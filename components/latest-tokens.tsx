"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { Progress } from "@/components/ui/progress"
import { ExternalLink, Twitter, Globe, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { differenceInMinutes, differenceInHours, differenceInDays } from "date-fns"

interface Token {
  symbol: string
  name: string
  address: string
  metadata: {
    twitter?: string
    website?: string
    telegram?: string
    discord?: string
  }
  creationTimestamp: number
  marketCap: { usd: string }
  liquidity: { usd: string }
  timeframes: {
    "24h": {
      volume: string
    }
  }
  progress: number
  holderCount: string
}

export function LatestTokens() {
  const [tokens, setTokens] = useState<Token[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchTokens() {
      try {
        const res = await fetch(
          "https://dev.liquidlaunch.app/api/tokens?page=1&limit=6&search=&sortKey=age&sortOrder=desc&timeframe=24h&view=in_progress&marketCapMin=0&marketCapMax=1000000&progressMin=0&progressMax=100&filterByHolderCount=false",
        )
        const data = await res.json()
        setTokens(data.tokens || [])
        setLoading(false)
      } catch (e) {
        setError("Failed to fetch tokens")
        setLoading(false)
      }
    }
    fetchTokens()
  }, [])

  function formatNumber(num: number) {
    if (num >= 1e9) return (num / 1e9).toFixed(1) + "B"
    if (num >= 1e6) return (num / 1e6).toFixed(1) + "M"
    if (num >= 1e3) return (num / 1e3).toFixed(1) + "K"
    return num.toLocaleString(undefined, { maximumFractionDigits: 2 })
  }

  function formatAddress(address: string) {
    return `${address.slice(0, 4)}...${address.slice(-4)}`
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

  // Generate random price change for demo (since API doesn't provide this)
  function generatePriceChange() {
    const change = (Math.random() - 0.5) * 40 // Random change between -20% and +20%
    return change
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Latest Tokens</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardContent className="p-4">
                    <div className="h-4 bg-gray-700 rounded mb-2" />
                    <div className="h-3 bg-gray-700 rounded mb-4" />
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-700 rounded" />
                      <div className="h-3 bg-gray-700 rounded" />
                      <div className="h-3 bg-gray-700 rounded" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Latest Tokens</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-500 text-center">{error}</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Latest Tokens</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tokens.map((token) => {
            const priceChange = generatePriceChange()
            return (
              <Card
                key={token.address}
                className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all duration-200 hover:scale-105"
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src={`https://dev.liquidlaunch.app/api/tokens/${token.address}/image`}
                      alt={token.symbol}
                      className="w-10 h-10 rounded-full"
                      onError={(e) => {
                        e.currentTarget.src = "/default-token-avatar.png"
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white truncate">{token.symbol}</h3>
                      <p className="text-sm text-gray-400 truncate">{token.name}</p>
                    </div>
                    <a
                      href={`https://dev.liquidlaunch.app/token/${token.address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>

                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-gray-400 mb-1">MC</p>
                        <p className="text-sm font-medium text-white">${formatNumber(Number(token.marketCap.usd))}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Vol</p>
                        <p className="text-sm font-medium text-white">
                          ${formatNumber(Number(token.timeframes["24h"].volume))}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Chg</p>
                        <p className={`text-sm font-medium ${priceChange >= 0 ? "text-green-400" : "text-red-400"}`}>
                          {priceChange >= 0 ? "+" : ""}
                          {priceChange.toFixed(2)}%
                        </p>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-gray-400">Progress</span>
                        <span className="text-xs text-gray-400">{token.progress?.toFixed(1)}%</span>
                      </div>
                      <Progress value={token.progress} className="h-2" />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex gap-1">
                        {token.metadata.twitter && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-gray-400 hover:text-blue-400"
                            asChild
                          >
                            <a href={token.metadata.twitter} target="_blank" rel="noopener noreferrer">
                              <Twitter className="h-3 w-3" />
                            </a>
                          </Button>
                        )}
                        {token.metadata.website && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-gray-400 hover:text-blue-400"
                            asChild
                          >
                            <a href={token.metadata.website} target="_blank" rel="noopener noreferrer">
                              <Globe className="h-3 w-3" />
                            </a>
                          </Button>
                        )}
                        {token.metadata.telegram && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-gray-400 hover:text-blue-400"
                            asChild
                          >
                            <a href={token.metadata.telegram} target="_blank" rel="noopener noreferrer">
                              <MessageCircle className="h-3 w-3" />
                            </a>
                          </Button>
                        )}
                      </div>
                      <span className="text-xs text-gray-400">{formatShortTime(token.creationTimestamp)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
