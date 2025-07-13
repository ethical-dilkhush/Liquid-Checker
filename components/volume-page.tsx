"use client"

import { useState, useEffect } from "react"
import { VolumeStats } from "./volume-stats"
import { VolumeCards } from "./volume-cards"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Token {
  address: string
  symbol: string
  name: string
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
  metadata?: {
    twitter?: string
    website?: string
    telegram?: string
    discord?: string
    description?: string
    image_uri?: string
  }
  creationTimestamp: number
  holderCount: string
}

interface ApiResponse {
  tokens: Token[]
  totalCount: number
}

export function VolumePage() {
  const [tokens, setTokens] = useState<Token[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  // Calculate stats from tokens
  const calculateStats = (tokens: Token[]) => {
    let totalMarketCap = 0
    let totalVolume = 0
    let totalLiquidity = 0
    let closeToBond = 0

    tokens.forEach((token) => {
      // Parse marketCap.usd
      const marketCap = Number.parseFloat(token.marketCap?.usd || "0")
      if (!isNaN(marketCap)) {
        totalMarketCap += marketCap
      }

      // Parse liquidity.usd
      const liquidity = Number.parseFloat(token.liquidity?.usd || "0")
      if (!isNaN(liquidity)) {
        totalLiquidity += liquidity
      }

      // Parse volume from timeframes.24h.volume
      const volume = Number.parseFloat(token.timeframes?.["24h"]?.volume || "0")
      if (!isNaN(volume)) {
        totalVolume += volume
      }

      // Count tokens with progress > 50
      if (token.progress && token.progress > 50) {
        closeToBond++
      }
    })

    return {
      marketCap: totalMarketCap,
      volume: totalVolume,
      liquidity: totalLiquidity,
      closeToBond,
    }
  }

  const fetchTokens = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(
        "https://dev.liquidlaunch.app/api/tokens?page=1&limit=2000&search=&sortKey=volume&sortOrder=desc&timeframe=24h&view=in_progress&marketCapMin=0&marketCapMax=1000000&progressMin=0&progressMax=100&filterByHolderCount=false",
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: ApiResponse = await response.json()

      if (data.tokens && Array.isArray(data.tokens)) {
        setTokens(data.tokens)
      } else {
        throw new Error("Invalid API response format")
      }
    } catch (err) {
      console.error("Error fetching tokens:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch tokens")
      toast({
        title: "Error",
        description: "Failed to fetch volume data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTokens()
  }, [])

  const stats = calculateStats(tokens)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Volume
            </h1>
            <p className="text-text-muted max-w-2xl">
              Track token volume and market performance with real-time data. Discover high-volume tokens and analyze
              market trends across the ecosystem.
            </p>
          </div>
          <Button
            onClick={fetchTokens}
            disabled={loading}
            className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {/* Stats */}
        <VolumeStats
          marketCap={stats.marketCap}
          volume={stats.volume}
          liquidity={stats.liquidity}
          closeToBond={stats.closeToBond}
          loading={loading}
        />

        {/* Token Cards */}
        <VolumeCards tokens={tokens} loading={loading} error={error} />
      </div>
    </div>
  )
}
