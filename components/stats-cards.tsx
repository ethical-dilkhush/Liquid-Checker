"use client"

import { Users, BarChart3, Droplets, Coins, DollarSign, TrendingUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"

export function StatsCards() {
  const [stats, setStats] = useState({
    totalTokens: 0,
    totalMarketCap: 0,
    totalLiquidity: 0,
    totalVolume: 0,
    totalPriceChange: 0,
    totalHolders: 0,
    loading: true,
    error: null as null | string,
  })

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch(
          "https://dev.liquidlaunch.app/api/tokens?page=1&limit=4000&search=&sortKey=age&sortOrder=desc&timeframe=24h&view=in_progress&marketCapMin=0&marketCapMax=1000000&progressMin=0&progressMax=100&filterByHolderCount=false",
        )
        const data = await res.json()
        const tokens = data.tokens || []
        let totalMarketCap = 0
        let totalLiquidity = 0
        let totalVolume = 0
        let totalPriceChange = 0
        let totalHolders = 0
        tokens.forEach((token: any) => {
          totalMarketCap += Number(token.marketCap?.usd || 0)
          totalLiquidity += Number(token.liquidity?.usd || 0)
          totalVolume += Number(token.timeframes?.["24h"]?.volume || 0)
          totalPriceChange += Number(token.timeframes?.["24h"]?.priceChange || 0)
          totalHolders += Number(token.holderCount || 0)
        })
        setStats({
          totalTokens: tokens.length,
          totalMarketCap,
          totalLiquidity,
          totalVolume,
          totalPriceChange,
          totalHolders,
          loading: false,
          error: null,
        })
      } catch (e) {
        setStats((s) => ({ ...s, loading: false, error: "Failed to fetch stats" }))
      }
    }
    fetchStats()
  }, [])

  function formatNumber(num: number) {
    if (num >= 1e9) return (num / 1e9).toFixed(2) + "b"
    if (num >= 1e6) return (num / 1e6).toFixed(2) + "m"
    if (num >= 1e3) return (num / 1e3).toFixed(2) + "k"
    return num.toLocaleString(undefined, { maximumFractionDigits: 2 })
  }

  const statCards = [
    {
      label: "Total Tokens",
      value: stats.totalTokens.toLocaleString(),
      icon: Coins,
      color: "text-primary",
      bgColor: "bg-primary/20",
    },
    {
      label: "Total Market Cap",
      value: `$${formatNumber(stats.totalMarketCap)}`,
      icon: DollarSign,
      color: "text-primary",
      bgColor: "bg-primary/20",
    },
    {
      label: "Total Liquidity",
      value: `$${formatNumber(stats.totalLiquidity)}`,
      icon: Droplets,
      color: "text-blue-500",
      bgColor: "bg-blue-500/20",
    },
    {
      label: "Total Volume (24h)",
      value: `$${formatNumber(stats.totalVolume)}`,
      icon: BarChart3,
      color: "text-accent",
      bgColor: "bg-accent/20",
    },
    {
      label: "Price Changes (24h)",
      value: `${stats.totalPriceChange.toLocaleString(undefined, { maximumFractionDigits: 2 })}%`,
      icon: TrendingUp,
      color: stats.totalPriceChange >= 0 ? "text-green-500" : "text-red-500",
      bgColor: stats.totalPriceChange >= 0 ? "bg-green-500/20" : "bg-red-500/20",
    },
    {
      label: "Total Holders",
      value: stats.totalHolders.toLocaleString(),
      icon: Users,
      color: "text-green-500",
      bgColor: "bg-green-500/20",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {stats.loading ? (
        // Loading skeletons
        Array.from({ length: 6 }).map((_, i) => (
          <Card
            key={i}
            className="bg-white/5 backdrop-blur-sm border border-white/10 hover:shadow-lg transition-all duration-300"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-32" />
                </div>
                <Skeleton className="h-12 w-12 rounded-full" />
              </div>
            </CardContent>
          </Card>
        ))
      ) : stats.error ? (
        <div className="col-span-full text-center text-red-500">{stats.error}</div>
      ) : (
        // Actual stats cards
        statCards.map((card) => {
          const IconComponent = card.icon
          return (
            <Card
              key={card.label}
              className="bg-white/5 backdrop-blur-sm border border-white/10 hover:shadow-lg transition-all duration-300"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-text-muted">{card.label}</p>
                    <p className="text-2xl font-bold">{card.value}</p>
                  </div>
                  <div className={`h-12 w-12 rounded-full ${card.bgColor} flex items-center justify-center`}>
                    <IconComponent className={`h-6 w-6 ${card.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })
      )}
    </div>
  )
}
