"use client"

import { useState, useEffect } from "react"
import { ActivityStats } from "./activity-stats"
import { ActivityCards } from "./activity-cards"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
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

interface ApiResponse {
  tokens: Token[]
  totalCount: number
}

export function ActivityPage() {
  const [tokens, setTokens] = useState<Token[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchTokens = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(
        "https://dev.liquidlaunch.app/api/tokens?page=1&limit=4000&search=&sortKey=latestActivity&sortOrder=desc&timeframe=24h&view=in_progress&minHolderCount=2&marketCapMin=0&marketCapMax=1000000&progressMin=1&progressMax=100&filterByHolderCount=true",
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: ApiResponse = await response.json()
      setTokens(data.tokens || [])
    } catch (err) {
      console.error("Error fetching tokens:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch tokens")
      toast({
        title: "Error",
        description: "Failed to load activity data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTokens()
  }, [])

  const handleRefresh = () => {
    fetchTokens()
    toast({
      title: "Refreshing data",
      description: "Fetching the latest token activity data.",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Activity
            </h1>
            <p className="text-text-muted max-w-2xl">
              Track the most active tokens with real-time market data, liquidity metrics, and community engagement
              statistics. Discover trending tokens with high activity levels and growing communities.
            </p>
          </div>
          <Button
            onClick={handleRefresh}
            disabled={loading}
            className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {/* Stats Section */}
        <ActivityStats tokens={tokens} loading={loading} />

        {/* Cards Section */}
        <ActivityCards tokens={tokens} loading={loading} error={error} />
      </div>
    </div>
  )
}
