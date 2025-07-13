import { supabase } from "./supabase"

export interface Comment {
  id: string
  token_address: string
  comment: string
  wallet_address: string
  created_at: string
}

export interface Vote {
  id: string
  token_address: string
  wallet_address: string
  created_at: string
}

export interface EngagementData {
  commentCount: number
  voteCount: number
  userHasVoted: boolean
}

// Optimized function to get all engagement data for multiple tokens at once
export async function getEngagementDataForTokens(
  tokenAddresses: string[],
  walletAddress?: string,
): Promise<Record<string, EngagementData>> {
  try {
    // Fetch all comment counts in parallel
    const commentCountsPromise = supabase
      .from("engagement_comments")
      .select("token_address")
      .in("token_address", tokenAddresses)

    // Fetch all vote counts in parallel
    const voteCountsPromise = supabase
      .from("engagement_votes")
      .select("token_address")
      .in("token_address", tokenAddresses)

    // Fetch user votes if wallet is connected
    const userVotesPromise = walletAddress
      ? supabase
          .from("engagement_votes")
          .select("token_address")
          .in("token_address", tokenAddresses)
          .eq("wallet_address", walletAddress)
      : Promise.resolve({ data: [], error: null })

    // Execute all queries in parallel
    const [commentsResult, votesResult, userVotesResult] = await Promise.all([
      commentCountsPromise,
      voteCountsPromise,
      userVotesPromise,
    ])

    if (commentsResult.error) throw commentsResult.error
    if (votesResult.error) throw votesResult.error
    if (userVotesResult.error) throw userVotesResult.error

    // Count comments per token
    const commentCounts: Record<string, number> = {}
    commentsResult.data?.forEach((comment) => {
      commentCounts[comment.token_address] = (commentCounts[comment.token_address] || 0) + 1
    })

    // Count votes per token
    const voteCounts: Record<string, number> = {}
    votesResult.data?.forEach((vote) => {
      voteCounts[vote.token_address] = (voteCounts[vote.token_address] || 0) + 1
    })

    // Track user votes
    const userVotes = new Set(userVotesResult.data?.map((vote) => vote.token_address) || [])

    // Build result object
    const result: Record<string, EngagementData> = {}
    tokenAddresses.forEach((address) => {
      result[address] = {
        commentCount: commentCounts[address] || 0,
        voteCount: voteCounts[address] || 0,
        userHasVoted: userVotes.has(address),
      }
    })

    return result
  } catch (error) {
    console.error("Error fetching engagement data:", error)
    throw error
  }
}

export async function getComments(tokenAddress: string): Promise<Comment[]> {
  const { data, error } = await supabase
    .from("engagement_comments")
    .select("*")
    .eq("token_address", tokenAddress)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching comments:", error)
    throw error
  }

  return data || []
}

export async function addComment(tokenAddress: string, comment: string, walletAddress: string): Promise<Comment> {
  const { data, error } = await supabase
    .from("engagement_comments")
    .insert([{ token_address: tokenAddress, comment, wallet_address: walletAddress }])
    .select()
    .single()

  if (error) {
    console.error("Error adding comment:", error)
    throw error
  }

  return data
}

export async function addVote(tokenAddress: string, walletAddress: string): Promise<void> {
  const { error } = await supabase
    .from("engagement_votes")
    .insert([{ token_address: tokenAddress, wallet_address: walletAddress }])

  if (error) {
    console.error("Error adding vote:", error)
    throw error
  }
}

export async function removeVote(tokenAddress: string, walletAddress: string): Promise<void> {
  const { error } = await supabase
    .from("engagement_votes")
    .delete()
    .eq("token_address", tokenAddress)
    .eq("wallet_address", walletAddress)

  if (error) {
    console.error("Error removing vote:", error)
    throw error
  }
}
