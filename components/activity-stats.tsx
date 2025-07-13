"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { TrendingUp, Droplets, BarChart3, Users } from "lucide-react"

interface Token {
  marketCap: {
    usd: string
  }
  liquidity: {
    usd: string
  }
  timeframes: {
    "24h": {
      volume: string
    }
  }
  holderCount: string
}

interface ActivityStatsProps {
  tokens: Token[]
  loading: boolean
}

export function ActivityStats({ tokens, loading }: ActivityStatsProps) {
  // Calculate stats by properly extracting values from nested objects
  const calculateStats = () => {
    let totalMarketCap = 0
    let totalLiquidity = 0
    let totalVolume = 0
    let totalHolderCount = 0

    tokens.forEach((token) => {
      try {
        // Extract market cap from nested object
        if (token.marketCap?.usd) {
          const marketCapValue = Number.parseFloat(token.marketCap.usd)
          if (!isNaN(marketCapValue)) {
            totalMarketCap += marketCapValue
          }
        }

        // Extract liquidity from nested object
        if (token.liquidity?.usd) {
          const liquidityValue = Number.parseFloat(token.liquidity.usd)
          if (!isNaN(liquidityValue)) {
            totalLiquidity += liquidityValue
          }
        }

        // Extract volume from nested timeframes object
        if (token.timeframes?.["24h"]?.volume) {
          const volumeValue = Number.parseFloat(token.timeframes["24h"].volume)
          if (!isNaN(volumeValue)) {
            totalVolume += volumeValue
          }
        }

        // Extract holder count
        if (token.holderCount) {
          const holderCountValue = Number.parseInt(String(token.holderCount))
          if (!isNaN(holderCountValue)) {
            totalHolderCount += holderCountValue
          }
        }
      } catch (error) {
        console.error("Error processing token data:", error, token)
      }
    })

    return {
      totalMarketCap,
      totalLiquidity,
      totalVolume,
      totalHolderCount,
    }
  }

  const stats = calculateStats()

  const formatCurrency = (value: any): string => {
    try {
      // Handle null, undefined, or non-numeric values
      if (value === null || value === undefined || value === "" || typeof value === "object") {
        return "N/A"
      }

      // Convert to number
      const numValue = Number(value)

      // Check if it's a valid number
      if (isNaN(numValue) || !isFinite(numValue)) {
        return "N/A"
      }

      // Handle zero
      if (numValue === 0) {
        return "$0"
      }

      // Format with appropriate suffix
      if (numValue >= 1000000000) {
        return `$${Math.round(numValue / 10000000) / 100}B`
      } else if (numValue >= 1000000) {
        return `$${Math.round(numValue / 10000) / 100}M`
      } else if (numValue >= 1000) {
        return `$${Math.round(numValue / 10) / 100}K`
      } else {
        return `$${Math.round(numValue * 100) / 100}`
      }
    } catch (error) {
      console.error("Error formatting currency:", error, value)
      return "N/A"
    }
  }

  const formatNumber = (value: any): string => {
    try {
      // Handle null, undefined, or non-numeric values
      if (value === null || value === undefined || value === "" || typeof value === "object") {
        return "0"
      }

      // Convert to number
      const numValue = Number(value)

      // Check if it's a valid number
      if (isNaN(numValue) || !isFinite(numValue)) {
        return "0"
      }

      // Format with appropriate suffix
      if (numValue >= 1000000) {
        return `${Math.round(numValue / 10000) / 100}M`
      } else if (numValue >= 1000) {
        return `${Math.round(numValue / 10) / 100}K`
      } else {
        return Math.floor(numValue).toLocaleString()
      }
    } catch (error) {
      console.error("Error formatting number:", error, value)
      return "0"
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Market Cap */}
      <Card className="bg-white/5 backdrop-blur-sm border border-white/10 hover:shadow-lg transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-text-muted">Total Market Cap</p>
              {loading ? (
                <Skeleton className="h-8 w-32" />
              ) : (
                <p className="text-2xl font-bold">{formatCurrency(stats.totalMarketCap)}</p>
              )}
            </div>
            <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liquidity */}
      <Card className="bg-white/5 backdrop-blur-sm border border-white/10 hover:shadow-lg transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-text-muted">Total Liquidity</p>
              {loading ? (
                <Skeleton className="h-8 w-32" />
              ) : (
                <p className="text-2xl font-bold">{formatCurrency(stats.totalLiquidity)}</p>
              )}
            </div>
            <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center">
              <Droplets className="h-6 w-6 text-blue-500" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Volume */}
      <Card className="bg-white/5 backdrop-blur-sm border border-white/10 hover:shadow-lg transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-text-muted">Total Volume (24h)</p>
              {loading ? (
                <Skeleton className="h-8 w-32" />
              ) : (
                <p className="text-2xl font-bold">{formatCurrency(stats.totalVolume)}</p>
              )}
            </div>
            <div className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-accent" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Holders */}
      <Card className="bg-white/5 backdrop-blur-sm border border-white/10 hover:shadow-lg transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-text-muted">Total Holders</p>
              {loading ? (
                <Skeleton className="h-8 w-32" />
              ) : (
                <p className="text-2xl font-bold">{formatNumber(stats.totalHolderCount)}</p>
              )}
            </div>
            <div className="h-12 w-12 rounded-full bg-orange-500/20 flex items-center justify-center">
              <Users className="h-6 w-6 text-orange-500" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
