"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { Loader2 } from "lucide-react"

const COLORS = ["#60A5FA", "#F472B6", "#A3E635", "#C084FC", "#34D399", "#FBBF24"]

export function DashboardPieChart() {
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
          totalPriceChange: Math.abs(totalPriceChange),
          totalHolders,
          loading: false,
          error: null,
        })
      } catch (e) {
        console.error("Error fetching dashboard stats:", e)
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

  if (stats.loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Market Sentiment</CardTitle>
          <CardDescription className="text-sm sm:text-base">
            The data displayed in the Stats section of the dashboard is now also visualized in a pie chart format for
            better clarity and insights.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-48 sm:h-64">
          <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin" />
        </CardContent>
      </Card>
    )
  }

  if (stats.error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Market Sentiment</CardTitle>
          <CardDescription className="text-sm sm:text-base">
            The data displayed in the Stats section of the dashboard is now also visualized in a pie chart format for
            better clarity and insights.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-48 sm:h-64">
          <div className="text-red-500 text-sm sm:text-base">{stats.error}</div>
        </CardContent>
      </Card>
    )
  }

  const data = [
    {
      name: "Total Tokens",
      value: stats.totalTokens * 1000,
      actualValue: stats.totalTokens,
      formattedValue: stats.totalTokens.toLocaleString(),
    },
    {
      name: "Total Market Cap",
      value: stats.totalMarketCap,
      actualValue: stats.totalMarketCap,
      formattedValue: `$${formatNumber(stats.totalMarketCap)}`,
    },
    {
      name: "Total Liquidity",
      value: stats.totalLiquidity,
      actualValue: stats.totalLiquidity,
      formattedValue: `$${formatNumber(stats.totalLiquidity)}`,
    },
    {
      name: "Total Volume (24h)",
      value: stats.totalVolume,
      actualValue: stats.totalVolume,
      formattedValue: `$${formatNumber(stats.totalVolume)}`,
    },
    {
      name: "Price Changes (24h)",
      value: stats.totalPriceChange * 10000,
      actualValue: stats.totalPriceChange,
      formattedValue: `${stats.totalPriceChange.toLocaleString(undefined, { maximumFractionDigits: 2 })}%`,
    },
    {
      name: "Total Holders",
      value: stats.totalHolders,
      actualValue: stats.totalHolders,
      formattedValue: stats.totalHolders.toLocaleString(),
    },
  ]

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">Market Sentiment</CardTitle>
        <CardDescription className="text-sm sm:text-base">
          The data displayed in the Stats section of the dashboard is now also visualized in a pie chart format for
          better clarity and insights.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-3 sm:p-6">
        {/* Mobile Layout - Stacked */}
        <div className="flex flex-col lg:hidden space-y-4">
          <div className="w-full h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={false}
                  outerRadius="80%"
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any, name: string, props: any) => [props.payload.formattedValue, name]}
                  isAnimationActive={false}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Mobile Legend - Grid Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
            {data.map((entry, index) => (
              <div key={entry.name} className="flex items-center space-x-2 p-2 rounded-lg bg-muted/20">
                <div
                  className="w-3 h-3 sm:w-4 sm:h-4 rounded-sm flex-shrink-0"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <div className="flex-1 min-w-0">
                  <span className="text-xs sm:text-sm font-medium block truncate">{entry.name}</span>
                  <span className="text-xs text-muted-foreground block truncate">{entry.formattedValue}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Layout - Side by Side */}
        <div className="hidden lg:flex items-center justify-between">
          <div className="flex-1 max-w-md">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any, name: string, props: any) => [props.payload.formattedValue, name]}
                  isAnimationActive={false}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Desktop Legend */}
          <div className="flex flex-col space-y-3 ml-6 flex-shrink-0">
            {data.map((entry, index) => (
              <div key={entry.name} className="flex items-center space-x-2">
                <div
                  className="w-4 h-4 rounded-sm flex-shrink-0"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-sm font-medium">{entry.name}</span>
                <span className="text-xs text-muted-foreground">{entry.formattedValue}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
