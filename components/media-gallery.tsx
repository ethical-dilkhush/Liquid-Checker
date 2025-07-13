"use client"

import { ExternalLink, MessageCircle, ThumbsUp, ChevronLeft, ChevronRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useEffect, useState, useRef, useMemo, useCallback } from "react"
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

interface MediaGalleryProps {
  searchQuery?: string
}

const TOKENS_PER_PAGE = 16

export function MediaGallery({ searchQuery = "" }: MediaGalleryProps) {
  const [allTokens, setAllTokens] = useState<TokenData[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedToken, setSelectedToken] = useState<TokenData | null>(null)
  const [isCommentsOpen, setIsCommentsOpen] = useState(false)
  const [engagementData, setEngagementData] = useState<Record<string, EngagementData>>({})
  const [engagementLoading, setEngagementLoading] = useState(false)

  const isMountedRef = useRef(true)
  const engagementCacheRef = useRef<Record<string, EngagementData>>({})

  const { account: walletAddress } = useWallet()
  const { toast } = useToast()

  // Memoize filtered tokens to prevent unnecessary recalculations
  const filteredTokens = useMemo(() => {
    if (!searchQuery) return allTokens
    const query = searchQuery.toLowerCase()
    return allTokens.filter(
      (token) => token.name.toLowerCase().includes(query) || token.symbol.toLowerCase().includes(query),
    )
  }, [allTokens, searchQuery])

  // Memoize pagination values
  const paginationData = useMemo(() => {
    const totalPages = Math.ceil(filteredTokens.length / TOKENS_PER_PAGE)
    const startIndex = (currentPage - 1) * TOKENS_PER_PAGE
    const endIndex = startIndex + TOKENS_PER_PAGE
    const currentTokens = filteredTokens.slice(startIndex, endIndex)

    return { totalPages, startIndex, endIndex, currentTokens }
  }, [filteredTokens, currentPage])

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  // Fetch all tokens once
  useEffect(() => {
    let mounted = true

    async function fetchAllTokens() {
      try {
        setLoading(true)
        setError(null)

        const res = await fetch(
          "https://dev.liquidlaunch.app/api/tokens?page=1&limit=4000&search=&sortKey=latestActivity&sortOrder=desc&timeframe=24h&view=in_progress&marketCapMin=0&marketCapMax=1000000&progressMin=0&progressMax=100&filterByHolderCount=false",
        )

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }

        const data = await res.json()
        const fetchedTokens = data.tokens || []

        if (mounted) {
          setAllTokens(fetchedTokens)
          setLoading(false)
        }
      } catch (e) {
        console.error("Error fetching tokens:", e)
        if (mounted) {
          setError("Failed to fetch tokens")
          setLoading(false)
        }
      }
    }

    fetchAllTokens()

    return () => {
      mounted = false
    }
  }, [])

  // Fetch engagement data for current page tokens
  useEffect(() => {
    let mounted = true

    async function fetchEngagementData() {
      const { currentTokens } = paginationData
      if (currentTokens.length === 0) return

      try {
        setEngagementLoading(true)
        const tokenAddresses = currentTokens.map((token) => token.address)

        // Check cache first
        const cachedData: Record<string, EngagementData> = {}
        const uncachedAddresses: string[] = []

        tokenAddresses.forEach((address) => {
          if (engagementCacheRef.current[address]) {
            cachedData[address] = engagementCacheRef.current[address]
          } else {
            uncachedAddresses.push(address)
          }
        })

        // Set cached data immediately if available
        if (mounted && Object.keys(cachedData).length > 0) {
          setEngagementData(cachedData)
        }

        // Fetch uncached data
        if (uncachedAddresses.length > 0) {
          const newEngagement = await getEngagementDataForTokens(uncachedAddresses, walletAddress)

          if (mounted) {
            // Update cache
            engagementCacheRef.current = { ...engagementCacheRef.current, ...newEngagement }
            // Merge with existing data
            setEngagementData((prev) => ({ ...prev, ...newEngagement }))
          }
        }
      } catch (error) {
        console.error("Error fetching engagement data:", error)
        if (mounted) {
          toast({
            title: "Error loading engagement data",
            description: "Could not load comments and votes. Please try again.",
            variant: "destructive",
          })
        }
      } finally {
        if (mounted) {
          setEngagementLoading(false)
        }
      }
    }

    fetchEngagementData()

    return () => {
      mounted = false
    }
  }, [currentPage, paginationData.currentTokens.length, walletAddress, toast])

  // Clear cache when wallet changes
  useEffect(() => {
    engagementCacheRef.current = {}
    setEngagementData({})
  }, [walletAddress])

  const handlePageChange = useCallback(
    (newPage: number) => {
      const { totalPages } = paginationData
      if (newPage >= 1 && newPage <= totalPages) {
        setCurrentPage(newPage)
        window.scrollTo({ top: 0, behavior: "smooth" })
      }
    },
    [paginationData],
  )

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

        // Optimistic update
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

        engagementCacheRef.current[token.address] = newEngagementItem

        // Make API call
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

  const handleCommentAdded = useCallback(() => {
    // Simple refresh - just clear cache for current tokens
    const { currentTokens } = paginationData
    currentTokens.forEach((token) => {
      delete engagementCacheRef.current[token.address]
    })
    setEngagementData({})
  }, [paginationData])

  const getTokenImage = useCallback((token: TokenData) => {
    const imageUrl = token.metadata?.image_uri
    if (!imageUrl || !/\.(png|jpe?g|gif|webp|svg)$/i.test(imageUrl)) {
      return "/default-token-avatar.png"
    }
    return imageUrl
  }, [])

  // Generate page numbers for pagination
  const getPageNumbers = useCallback(() => {
    const { totalPages } = paginationData
    const pages = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i)
        }
        pages.push("...")
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1)
        pages.push("...")
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        pages.push(1)
        pages.push("...")
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i)
        }
        pages.push("...")
        pages.push(totalPages)
      }
    }

    return pages
  }, [paginationData, currentPage])

  if (loading) {
    return <div className="text-center py-8 sm:py-12 text-gray-400">Loading tokens...</div>
  }

  if (error) {
    return <div className="text-center py-8 sm:py-12 text-red-500">{error}</div>
  }

  if (filteredTokens.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12 text-muted-foreground">
        {searchQuery ? "No tokens match your search." : "No tokens found."}
      </div>
    )
  }

  const { totalPages, startIndex, endIndex, currentTokens } = paginationData

  return (
    <>
      {/* Header with pagination info */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-2">
        <div className="text-xs sm:text-sm text-muted-foreground">
          Showing {startIndex + 1}-{Math.min(endIndex, filteredTokens.length)} of {filteredTokens.length} tokens
        </div>
        <div className="text-xs sm:text-sm text-muted-foreground">
          Page {currentPage} of {totalPages}
        </div>
      </div>

      {/* Token Grid */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {currentTokens.map((token) => {
          const engagement = engagementData[token.address]
          const commentCount = engagement?.commentCount || 0
          const voteCount = engagement?.voteCount || 0
          const userHasVoted = engagement?.userHasVoted || false

          return (
            <Card
              key={token.address}
              className="overflow-hidden flex flex-col group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] bg-white/5 backdrop-blur-sm border border-white/10"
            >
              {/* Square Image at the top */}
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

              {/* Details below */}
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
                      className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
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

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-1 sm:gap-2 mt-6 sm:mt-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center gap-1 text-xs sm:text-sm h-8 sm:h-9"
          >
            <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Previous</span>
          </Button>

          <div className="flex items-center gap-1">
            {getPageNumbers().map((page, index) => (
              <div key={index}>
                {page === "..." ? (
                  <span className="px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm text-muted-foreground">...</span>
                ) : (
                  <Button
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(page as number)}
                    className="min-w-[32px] sm:min-w-[40px] h-8 sm:h-9 text-xs sm:text-sm p-0"
                  >
                    {page}
                  </Button>
                )}
              </div>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="flex items-center gap-1 text-xs sm:text-sm h-8 sm:h-9"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </div>
      )}

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
