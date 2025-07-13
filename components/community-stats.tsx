"use client"

import { Card, CardContent } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { Coins, TrendingUp, DollarSign, Users } from "lucide-react"

export function BondedStatsCards() {
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
          "https://dev.liquidlaunch.app/api/tokens?view=bonded&search=&sortKey=latestActivity&sortOrder=desc&timeframe=24h&minHolderCount=2&marketCapMin=0&marketCapMax=1000000&progressMin=1&progressMax=100&filterByHolderCount=true",
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
      label: "Total Bonded Token",
      value: stats.totalTokens.toLocaleString(),
      icon: Coins,
      color: "text-primary",
      bgColor: "bg-primary/20",
    },
    {
      label: "Total Market Cap",
      value: `$${formatNumber(stats.totalMarketCap)}`,
      icon: TrendingUp,
      color: "text-primary",
      bgColor: "bg-primary/20",
    },
    {
      label: "Total Liquidity",
      value: `$${formatNumber(stats.totalLiquidity)}`,
      icon: DollarSign,
      color: "text-blue-500",
      bgColor: "bg-blue-500/20",
    },
    {
      label: "Total Holders",
      value: stats.totalHolders.toLocaleString(),
      icon: Users,
      color: "text-green-500",
      bgColor: "bg-green-500/20",
    },
  ]

  if (stats.loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="backdrop-blur-sm bg-white/10 border-white/10">
            <CardContent className="flex items-center justify-between p-6 animate-pulse">
              <div className="flex-1">
                <div className="h-3 w-24 bg-gray-700/40 rounded mb-2" />
                <div className="h-7 w-20 bg-gray-700/60 rounded" />
              </div>
              <div className="w-12 h-12 bg-gray-700/40 rounded-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (stats.error) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="col-span-4 text-center text-red-500">{stats.error}</div>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {statCards.map((card) => {
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
      })}
    </div>
  )
}
