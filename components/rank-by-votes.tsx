"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { ExternalLink, MessageCircle, ThumbsUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { CommentsDialog } from "./comments-dialog"
import { addVote, getEngagementDataForTokens, removeVote, type EngagementData } from "@/lib/engagement-service"
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

interface RankByVotesProps {
  searchQuery?: string
}

export function RankByVotes({ searchQuery = "" }: RankByVotesProps) {
  /* ------------------------- local state ------------------------- */
  const [tokens, setTokens] = useState<TokenData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  /* engagement */
  const [engagementData, setEngagementData] = useState<Record<string, EngagementData>>({})
  const [engagementLoading, setEngagementLoading] = useState(false)

  /* comments modal */
  const [selectedToken, setSelectedToken] = useState<TokenData | null>(null)
  const [isCommentsOpen, setIsCommentsOpen] = useState(false)

  /* wallet & toast */
  const { account: walletAddress } = useWallet()
  const { toast } = useToast()

  /* ------------------------- derived data ------------------------ */
  const filteredTokens = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    return tokens.filter((t) => (q ? t.name.toLowerCase().includes(q) || t.symbol.toLowerCase().includes(q) : true))
  }, [tokens, searchQuery])

  const topVotedTokens = useMemo(() => {
    return filteredTokens
      .filter((t) => engagementData[t.address]?.voteCount > 0)
      .sort((a, b) => (engagementData[b.address]?.voteCount || 0) - (engagementData[a.address]?.voteCount || 0))
      .slice(0, 8)
  }, [filteredTokens, engagementData])

  /* ------------------------- effects ----------------------------- */
  useEffect(() => {
    let mounted = true

    async function fetchData() {
      try {
        setLoading(true)
        const res = await fetch(
          "https://dev.liquidlaunch.app/api/tokens?page=1&limit=100&search=&sortKey=latestActivity&sortOrder=desc&timeframe=24h&view=in_progress&marketCapMin=0&marketCapMax=1000000&progressMin=0&progressMax=100&filterByHolderCount=false",
        )

        if (!res.ok) throw new Error(`HTTP ${res.status}`)

        const data = await res.json()
        const fetched = (data.tokens || []) as TokenData[]

        if (!mounted) return
        setTokens(fetched)

        if (fetched.length) {
          setEngagementLoading(true)
          const addrs = fetched.map((t) => t.address)
          const engagement = await getEngagementDataForTokens(addrs, walletAddress)
          if (mounted) setEngagementData(engagement)
        }
      } catch (err) {
        console.error(err)
        if (mounted) setError("Failed to fetch data")
      } finally {
        if (mounted) {
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

  /* ------------------------- handlers ---------------------------- */
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
        const current = engagementData[token.address]
        const hasVoted = current?.userHasVoted ?? false
        const newCount = hasVoted ? Math.max(0, (current?.voteCount || 0) - 1) : (current?.voteCount || 0) + 1

        setEngagementData((prev) => ({
          ...prev,
          [token.address]: { ...current, voteCount: newCount, userHasVoted: !hasVoted },
        }))

        if (hasVoted) {
          await removeVote(token.address, walletAddress)
          toast({ title: "Vote removed", description: `Removed your vote for ${token.symbol}.` })
        } else {
          await addVote(token.address, walletAddress)
          toast({ title: "Vote added", description: `Voted for ${token.symbol}.` })
        }
      } catch {
        toast({
          title: "Error",
          description: "Could not process your vote. Please try again.",
          variant: "destructive",
        })
      }
    },
    [walletAddress, engagementData, toast],
  )

  /* ------------------------- helpers ---------------------------- */
  const getTokenImage = (t: TokenData) => {
    const url = t.metadata?.image_uri || ""
    return /\.(png|jpe?g|gif|webp|svg)$/i.test(url) ? url : "/default-token-avatar.png"
  }

  /* ------------------------- render ----------------------------- */
  if (loading) return <p className="py-12 text-center text-gray-400">Loading tokens…</p>
  if (error) return <p className="py-12 text-center text-red-500">{error}</p>
  if (!topVotedTokens.length)
    return (
      <p className="py-12 text-center text-muted-foreground">
        {searchQuery ? "No matching tokens with votes." : "No tokens with votes yet."}
      </p>
    )

  return (
    <>
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {topVotedTokens.map((t) => {
          const e = engagementData[t.address] || { voteCount: 0, commentCount: 0, userHasVoted: false }

          return (
            <Card
              key={t.address}
              className="flex flex-col overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
            >
              <div className="h-32 sm:h-40 w-full bg-gray-900 p-2 flex items-center justify-center">
                <div className="h-full w-full rounded-lg overflow-hidden border border-gray-800">
                  <img
                    src={getTokenImage(t) || "/placeholder.svg"}
                    alt={t.symbol}
                    className="h-full w-full object-cover"
                    onError={(ev) => ((ev.target as HTMLImageElement).src = "/default-token-avatar.png")}
                  />
                </div>
              </div>

              <CardContent className="flex flex-col flex-1 p-3 sm:p-4">
                <div className="flex justify-between items-center mb-1 sm:mb-2">
                  <h3 className="truncate font-semibold text-base sm:text-lg">{t.symbol}</h3>
                  <a
                    href={`https://dev.liquidlaunch.app/token/${t.address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 flex-shrink-0 text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
                  </a>
                </div>

                <p className="mb-2 sm:mb-4 line-clamp-2 text-xs sm:text-sm text-muted-foreground">{t.name}</p>

                <div className="mt-auto flex items-center gap-4 sm:gap-6">
                  <button
                    onClick={() => handleOpenComments(t)}
                    disabled={engagementLoading}
                    className="flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="text-xs sm:text-sm font-medium">{engagementLoading ? "…" : e.commentCount}</span>
                  </button>

                  <button
                    onClick={() => handleVote(t)}
                    disabled={engagementLoading}
                    className={`flex items-center gap-1 ${
                      e.userHasVoted ? "text-primary" : "text-purple-400"
                    } transition-colors hover:text-primary`}
                  >
                    <ThumbsUp className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="text-xs sm:text-sm font-medium">{engagementLoading ? "…" : e.voteCount}</span>
                  </button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* comments modal */}
      {selectedToken && (
        <CommentsDialog
          isOpen={isCommentsOpen}
          onClose={() => setIsCommentsOpen(false)}
          tokenAddress={selectedToken.address}
          tokenSymbol={selectedToken.symbol}
          walletAddress={walletAddress}
          onCommentAdded={async () => {
            const addresses = tokens.map((tk) => tk.address)
            const updated = await getEngagementDataForTokens(addresses, walletAddress)
            setEngagementData(updated)
          }}
        />
      )}
    </>
  )
}
