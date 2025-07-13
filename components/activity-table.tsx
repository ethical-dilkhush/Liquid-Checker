"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, ChevronRight, Copy, Twitter, Globe, MessageCircle, Hash } from "lucide-react"
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
  }
  creationTimestamp: string
  marketCap: number
  liquidity: number
  volume: number
  progress: number
  holderCount: number
}

interface ActivityTableProps {
  tokens: Token[]
}

export function ActivityTable({ tokens }: ActivityTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const { toast } = useToast()
  const tokensPerPage = 20

  const totalPages = Math.ceil(tokens.length / tokensPerPage)
  const startIndex = (currentPage - 1) * tokensPerPage
  const endIndex = startIndex + tokensPerPage
  const currentTokens = tokens.slice(startIndex, endIndex)

  const formatNumber = (num: number | null | undefined) => {
    // Handle null, undefined, or invalid numbers
    if (num === null || num === undefined || isNaN(num)) {
      return "0"
    }

    const numValue = Number(num)
    if (numValue >= 1000000) {
      return `${(numValue / 1000000).toFixed(1)}M`
    }
    if (numValue >= 1000) {
      return `${(numValue / 1000).toFixed(1)}K`
    }
    return numValue.toLocaleString()
  }

  const formatCurrency = (num: number | null | undefined) => {
    return `$${formatNumber(num)}`
  }

  const formatDate = (timestamp: string) => {
    if (!timestamp) return "N/A"
    try {
      return new Date(timestamp).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    } catch (error) {
      return "N/A"
    }
  }

  const formatProgress = (progress: number | null | undefined) => {
    if (progress === null || progress === undefined || isNaN(progress)) {
      return 0
    }
    return Math.min(Math.max(Number(progress), 0), 100)
  }

  const truncateAddress = (address: string) => {
    if (!address) return "N/A"
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const copyToClipboard = (text: string) => {
    if (!text) return
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied!",
      description: "Address copied to clipboard",
    })
  }

  const openLink = (url: string) => {
    if (!url) return
    // Ensure URL has protocol
    const fullUrl = url.startsWith("http") ? url : `https://${url}`
    window.open(fullUrl, "_blank", "noopener,noreferrer")
  }

  const getSocialLinks = (metadata: Token["metadata"]) => {
    if (!metadata) return []

    const links = []

    if (metadata.twitter) {
      links.push({
        icon: Twitter,
        url: metadata.twitter,
        label: "Twitter",
        color: "text-blue-400",
      })
    }

    if (metadata.website) {
      links.push({
        icon: Globe,
        url: metadata.website,
        label: "Website",
        color: "text-green-400",
      })
    }

    if (metadata.telegram) {
      links.push({
        icon: MessageCircle,
        url: metadata.telegram,
        label: "Telegram",
        color: "text-blue-500",
      })
    }

    if (metadata.discord) {
      links.push({
        icon: Hash,
        url: metadata.discord,
        label: "Discord",
        color: "text-purple-400",
      })
    }

    return links
  }

  return (
    <Card className="bg-white/5 backdrop-blur-sm border-white/10">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Token Activity</CardTitle>
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1}-{Math.min(endIndex, tokens.length)} of {tokens.length} tokens
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left p-4 font-medium">Token</th>
                <th className="text-left p-4 font-medium">Address</th>
                <th className="text-left p-4 font-medium">Social</th>
                <th className="text-left p-4 font-medium">Created</th>
                <th className="text-right p-4 font-medium">Market Cap</th>
                <th className="text-right p-4 font-medium">Liquidity</th>
                <th className="text-right p-4 font-medium">Volume</th>
                <th className="text-left p-4 font-medium">Progress</th>
                <th className="text-right p-4 font-medium">Holders</th>
              </tr>
            </thead>
            <tbody>
              {currentTokens.map((token, index) => (
                <tr key={token.id || index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4">
                    <div>
                      <div className="font-medium">{token.symbol || "N/A"}</div>
                      <div className="text-sm text-muted-foreground truncate max-w-[150px]">
                        {token.name || "Unknown Token"}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <code className="text-sm bg-white/10 px-2 py-1 rounded">{truncateAddress(token.address)}</code>
                      {token.address && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(token.address)}
                          className="h-6 w-6 p-0"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      {getSocialLinks(token.metadata).map((link, linkIndex) => (
                        <Button
                          key={linkIndex}
                          variant="ghost"
                          size="sm"
                          onClick={() => openLink(link.url)}
                          className={`h-6 w-6 p-0 ${link.color}`}
                          title={link.label}
                        >
                          <link.icon className="h-3 w-3" />
                        </Button>
                      ))}
                      {getSocialLinks(token.metadata).length === 0 && (
                        <span className="text-xs text-muted-foreground">No links</span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-sm">{formatDate(token.creationTimestamp)}</td>
                  <td className="p-4 text-right font-medium">{formatCurrency(token.marketCap)}</td>
                  <td className="p-4 text-right font-medium">{formatCurrency(token.liquidity)}</td>
                  <td className="p-4 text-right font-medium">{formatCurrency(token.volume)}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 min-w-[120px]">
                      <Progress value={formatProgress(token.progress)} className="flex-1" />
                      <span className="text-sm font-medium min-w-[35px]">{formatProgress(token.progress)}%</span>
                    </div>
                  </td>
                  <td className="p-4 text-right font-medium">{formatNumber(token.holderCount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum
                  if (totalPages <= 5) {
                    pageNum = i + 1
                  } else if (currentPage <= 3) {
                    pageNum = i + 1
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i
                  } else {
                    pageNum = currentPage - 2 + i
                  }

                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                      className="w-8 h-8 p-0"
                    >
                      {pageNum}
                    </Button>
                  )
                })}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
