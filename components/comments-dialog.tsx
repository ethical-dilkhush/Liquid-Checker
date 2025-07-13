"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { type Comment, addComment, getComments } from "@/lib/engagement-service"
import { Loader2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { useToast } from "@/hooks/use-toast"

interface CommentsDialogProps {
  isOpen: boolean
  onClose: () => void
  tokenAddress: string
  tokenSymbol: string
  walletAddress: string | null
  onCommentAdded?: () => void
}

export function CommentsDialog({
  isOpen,
  onClose,
  tokenAddress,
  tokenSymbol,
  walletAddress,
  onCommentAdded,
}: CommentsDialogProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  // Format wallet address for display
  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

  // Load comments when dialog opens
  useEffect(() => {
    if (isOpen && tokenAddress) {
      loadComments()
    }
  }, [isOpen, tokenAddress])

  const loadComments = async () => {
    setIsLoading(true)
    try {
      const fetchedComments = await getComments(tokenAddress)
      setComments(fetchedComments)
    } catch (error) {
      toast({
        title: "Error loading comments",
        description: "Could not load comments. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return
    if (!walletAddress) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to comment.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const comment = await addComment(tokenAddress, newComment, walletAddress)
      setComments([comment, ...comments])
      setNewComment("")
      toast({
        title: "Comment added",
        description: "Your comment has been added successfully.",
      })
      // Notify parent component that a comment was added
      onCommentAdded?.()
    } catch (error) {
      toast({
        title: "Error adding comment",
        description: "Could not add your comment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Comments for {tokenSymbol}</DialogTitle>
          <DialogDescription>
            Join the conversation about {tokenSymbol}. Share your thoughts and insights.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto my-4 space-y-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.id} className="border rounded-lg p-3 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-sm">{formatAddress(comment.wallet_address)}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                  </span>
                </div>
                <p className="text-sm">{comment.comment}</p>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">No comments yet. Be the first to comment!</div>
          )}
        </div>

        <div className="space-y-2">
          <Textarea
            placeholder={walletAddress ? "Add your comment..." : "Connect wallet to comment"}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            disabled={!walletAddress || isSubmitting}
            className="resize-none"
          />
          <div className="flex justify-end">
            <Button onClick={handleSubmitComment} disabled={!walletAddress || !newComment.trim() || isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSubmitting ? "Submitting..." : "Submit Comment"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
