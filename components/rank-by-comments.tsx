"use client"

import { ExternalLink, MessageCircle, ThumbsUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useEffect, useState, useCallback, useMemo } from "react"
import { CommentsDialog } from "./comments-dialog"
import { getEngagementDataForTokens, addVote, removeVote, type EngagementData } from "@/lib/engagement-service"
import { useToast } from "@/hooks/use-toast"
import { useWallet } from "@/hooks/use-wallet"

interface TokenData {
  address: string
  symbol: string
  name: string
  metadata?: {
    image_uri?: string
  }
}

interface RankByCommentsProps {
  searchQuery?: string
}

export function RankByComments({ searchQuery = "" }: RankByCommentsProps) {
  const [tokens, setTokens] = useState<TokenData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedToken, setSelectedToken] = useState<TokenData | null>(null)
  const [isCommentsOpen, setIsCommentsOpen] = useState(false)
  const [engagementData, setEngagementData] = useState<Record<string, EngagementData>>({})
  const [engagementLoading, setEngagementLoading] = useState(false)

  const { account: walletAddress } = useWallet()
  const { toast } = useToast()

  // Memoize filtered and sorted tokens
  const topCommentedTokens = useMemo(() => {
    const filtered = tokens.filter((token) => {
      if (!searchQuery) return true
      const query = searchQuery.toLowerCase()
      return token.name.toLowerCase().includes(query) || token.symbol.toLowerCase().includes(query)
    })

    return filtered
      .filter((token) => {
        const engagement = engagementData[token.address]
        return engagement && engagement.commentCount > 0
      })
      .sort((a, b) => {
        const aComments = engagementData[a.address]?.commentCount || 0
        const bComments = engagementData[b.address]?.commentCount || 0
        return bComments - aComments
      })
      .slice(0, 8)
  }, [tokens, searchQuery, engagementData])

  // Fetch tokens and engagement data
  useEffect(() => {
    let mounted = true

    async function fetchData() {
      try {
        setLoading(true)
        setError(null)

        const res = await fetch(
          "https://dev.liquidlaunch.app/api/tokens?page=1&limit=100&search=&sortKey=latestActivity&sortOrder=desc&timeframe=24h&view=in_progress&marketCapMin=0&marketCapMax=1000000&progressMin=0&progressMax=100&filterByHolderCount=false",
        )

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }

        const data = await res.json()
        const fetchedTokens = data.tokens || []

        if (mounted) {
          setTokens(fetchedTokens)

          if (fetchedTokens.length > 0) {
            setEngagementLoading(true)
            const tokenAddresses = fetchedTokens.map((token: TokenData) => token.address)
            const engagement = await getEngagementDataForTokens(tokenAddresses, walletAddress)

            if (mounted) {
              setEngagementData(engagement)
              setEngagementLoading(false)
            }
          }
          setLoading(false)
        }
      } catch (e) {
        console.error("Error fetching data:", e)
        if (mounted) {
          setError("Failed to fetch data")
          setLoading(false)
          setEngagementLoading(false)
        }
      }
    }

    fetchData()

    return () => {
      mounted = false
    }
  }, [walletAddress])

  const handleOpenComments = useCallback(
    (token: TokenData) => {
      if (!walletAddress) {
        toast({
          title: "Wallet not connected",
          description: "Please connect your wallet to view and add comments.",
          variant: "destructive",
        })
        return
      }

      setSelectedToken(token)
      setIsCommentsOpen(true)
    },
    [walletAddress, toast],
  )

  const handleVote = useCallback(
    async (token: TokenData) => {
      if (!walletAddress) {
        toast({
          title: "Wallet not connected",
          description: "Please connect your wallet to vote.",
          variant: "destructive",
        })
        return
      }

      try {
        const currentEngagement = engagementData[token.address]
        const hasVoted = currentEngagement?.userHasVoted || false

        const newEngagementItem = {
          ...currentEngagement,
          voteCount: hasVoted
            ? Math.max(0, (currentEngagement?.voteCount || 0) - 1)
            : (currentEngagement?.voteCount || 0) + 1,
          userHasVoted: !hasVoted,
        }

        setEngagementData((prev) => ({
          ...prev,
          [token.address]: newEngagementItem,
        }))

        if (hasVoted) {
          await removeVote(token.address, walletAddress)
          toast({
            title: "Vote removed",
            description: `You've removed your vote for ${token.symbol}.`,
          })
        } else {
          await addVote(token.address, walletAddress)
          toast({
            title: "Vote added",
            description: `You've voted for ${token.symbol}.`,
          })
        }
      } catch (error) {
        console.error("Error processing vote:", error)
        toast({
          title: "Error",
          description: "Could not process your vote. Please try again.",
          variant: "destructive",
        })
      }
    },
    [walletAddress, engagementData, toast],
  )

  const handleCommentAdded = useCallback(async () => {
    if (tokens.length > 0) {
      const tokenAddresses = tokens.map((token) => token.address)
      const engagement = await getEngagementDataForTokens(tokenAddresses, walletAddress)
      setEngagementData(engagement)
    }
  }, [tokens, walletAddress])

  const getTokenImage = useCallback((token: TokenData) => {
    const imageUrl = token.metadata?.image_uri
    if (!imageUrl || !/\.(png|jpe?g|gif|webp|svg)$/i.test(imageUrl)) {
      return "/default-token-avatar.png"
    }
    return imageUrl
  }, [])

  if (loading) {
    return <div className="text-center py-8 sm:py-12 text-gray-400">Loading tokens...</div>
  }

  if (error) {
    return <div className="text-center py-8 sm:py-12 text-red-500">{error}</div>
  }

  if (topCommentedTokens.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12 text-muted-foreground">
        {searchQuery ? "No matching tokens with comments found." : "No tokens with comments found."}
      </div>
    )
  }

  return (
    <>
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {topCommentedTokens.map((token) => {
          const engagement = engagementData[token.address]
          const commentCount = engagement?.commentCount || 0
          const voteCount = engagement?.voteCount || 0
          const userHasVoted = engagement?.userHasVoted || false

          return (
            <Card
              key={token.address}
              className="overflow-hidden flex flex-col group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] bg-white/5 backdrop-blur-sm border border-white/10"
            >
              <div className="w-full h-32 sm:h-40 bg-gray-900 flex items-center justify-center p-2">
                <div className="w-full h-full bg-background rounded-lg overflow-hidden border border-gray-800">
                  <img
                    src={getTokenImage(token) || "/placeholder.svg"}
                    alt={token.symbol}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      ;(e.target as HTMLImageElement).src = "/default-token-avatar.png"
                    }}
                  />
                </div>
              </div>

              <CardContent className="flex flex-col flex-1 p-3 sm:p-4">
                <div className="flex flex-col h-full">
                  <div className="flex justify-between items-center mb-1 sm:mb-2">
                    <h3 className="font-semibold text-base sm:text-lg truncate">{token.symbol}</h3>
                    <a
                      href={`https://dev.liquidlaunch.app/token/${token.address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0 ml-2"
                    >
                      <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
                    </a>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-4 line-clamp-2">{token.name}</p>
                  <div className="flex flex-row items-center gap-4 sm:gap-6 mt-auto">
                    <button
                      onClick={() => handleOpenComments(token)}
                      className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors"
                      disabled={engagementLoading}
                    >
                      <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span className="text-xs sm:text-sm font-medium">
                        {engagementLoading && !engagement ? "..." : commentCount}
                      </span>
                    </button>
                    <button
                      onClick={() => handleVote(token)}
                      className={`flex items-center gap-1 ${
                        userHasVoted ? "text-primary" : "text-muted-foreground"
                      } hover:text-primary transition-colors`}
                      disabled={engagementLoading && !engagement}
                    >
                      <ThumbsUp className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span className="text-xs sm:text-sm font-medium">
                        {engagementLoading && !engagement ? "..." : voteCount}
                      </span>
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {selectedToken && (
        <CommentsDialog
          isOpen={isCommentsOpen}
          onClose={() => setIsCommentsOpen(false)}
          tokenAddress={selectedToken.address}
          tokenSymbol={selectedToken.symbol}
          walletAddress={walletAddress}
          onCommentAdded={handleCommentAdded}
        />
      )}
    </>
  )
}
