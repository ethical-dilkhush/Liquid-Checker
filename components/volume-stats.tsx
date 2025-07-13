import { DollarSign, BarChart3, Droplets, LinkIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface VolumeStatsProps {
  marketCap: number
  volume: number
  liquidity: number
  closeToBond: number
  loading: boolean
}

export function VolumeStats({ marketCap, volume, liquidity, closeToBond, loading }: VolumeStatsProps) {
  // Format currency with K, M, B suffixes - with robust error handling
  const formatCurrency = (value: any) => {
    // Handle null, undefined, or empty values
    if (value === null || value === undefined || value === "") {
      return "N/A"
    }

    // Convert to number and handle conversion errors
    const numValue = Number(value)

    // Check if conversion resulted in NaN or invalid number
    if (isNaN(numValue) || !isFinite(numValue)) {
      return "N/A"
    }

    // Handle zero
    if (numValue === 0) {
      return "$0"
    }

    // Format based on value size
    try {
      if (numValue >= 1000000000) {
        return `$${(numValue / 1000000000).toFixed(2)}B`
      } else if (numValue >= 1000000) {
        return `$${(numValue / 1000000).toFixed(2)}M`
      } else if (numValue >= 1000) {
        return `$${(numValue / 1000).toFixed(2)}K`
      } else {
        return `$${numValue.toFixed(2)}`
      }
    } catch (error) {
      console.error("Error formatting currency:", error, "Value:", value)
      return "N/A"
    }
  }

  // Safe number formatting for count values
  const formatCount = (value: any) => {
    if (value === null || value === undefined || value === "") {
      return "0"
    }

    const numValue = Number(value)
    if (isNaN(numValue) || !isFinite(numValue)) {
      return "0"
    }

    return Math.floor(numValue).toString()
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
                <p className="text-2xl font-bold">{formatCurrency(marketCap)}</p>
              )}
            </div>
            <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-primary" />
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
                <p className="text-2xl font-bold">{formatCurrency(volume)}</p>
              )}
            </div>
            <div className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-accent" />
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
                <p className="text-2xl font-bold">{formatCurrency(liquidity)}</p>
              )}
            </div>
            <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center">
              <Droplets className="h-6 w-6 text-blue-500" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Close to Bond */}
      <Card className="bg-white/5 backdrop-blur-sm border border-white/10 hover:shadow-lg transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-text-muted">Close to Bond</p>
              {loading ? (
                <Skeleton className="h-8 w-32" />
              ) : (
                <p className="text-2xl font-bold">{formatCount(closeToBond)} Tokens</p>
              )}
            </div>
            <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center">
              <LinkIcon className="h-6 w-6 text-green-500" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
