"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { MediaFilter } from "./media-filter"
import { MediaGallery } from "./media-gallery"
import { RankByComments } from "./rank-by-comments"
import { RankByVotes } from "./rank-by-votes"

export function MediaPage() {
  const [filter, setFilter] = useState({
    type: "all",
    sort: "latest",
    search: "",
  })

  return (
    <DashboardLayout>
      <div className="grid gap-6 p-4 sm:p-6">
        {/* Header - Left aligned */}
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl sm:text-3xl font-bold">Community Engagement</h1>
          <p className="text-sm sm:text-base text-gray-500">
            Like and comment on tokens to help others easily spot the best ones.
          </p>
        </div>

        {/* Filter */}
        <MediaFilter filter={filter} setFilter={setFilter} />

        {/* Rank By Comments Section - Show only when filter is set to comments */}
        {filter.sort === "comments" && (
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col gap-1 sm:gap-2">
              <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                Rank By Comments
              </h2>
              <p className="text-xs sm:text-sm text-gray-500">
                Tokens generating the most discussion and community engagement
              </p>
            </div>
            <RankByComments searchQuery={filter.search} />
          </div>
        )}

        {/* Rank By Votes Section - Show only when filter is set to votes */}
        {filter.sort === "votes" && (
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col gap-1 sm:gap-2">
              <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                Rank By Votes
              </h2>
              <p className="text-xs sm:text-sm text-gray-500">Most liked and supported tokens by the community</p>
            </div>
            <RankByVotes searchQuery={filter.search} />
          </div>
        )}

        {/* All Tokens Section - Show when filter is not comments or votes */}
        {filter.sort !== "comments" && filter.sort !== "votes" && (
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col gap-1 sm:gap-2">
              <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                All Tokens
              </h2>
              <p className="text-xs sm:text-sm text-gray-500">
                Browse all available tokens and engage with the community
              </p>
            </div>
            <MediaGallery searchQuery={filter.search} />
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
