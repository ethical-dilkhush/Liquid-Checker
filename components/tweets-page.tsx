"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { TweetsFilter } from "@/components/tweets-filter"
import { TweetsAnalytics } from "@/components/tweets-analytics"
import { TweetsList } from "@/components/tweets-list"

export function TweetsPage() {
  const [filter, setFilter] = useState({
    sentiment: "all",
    date: "all",
    sort: "latest",
  })

  return (
    <DashboardLayout>
      <div className="grid gap-6 p-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Tweets</h1>
          <p className="text-gray-500">
            Explore all Liquid Checker-related tweets with sentiment analysis and engagement metrics.
          </p>
        </div>

        <TweetsFilter filter={filter} setFilter={setFilter} />
        <TweetsAnalytics />
        <TweetsList filter={filter} />
      </div>
    </DashboardLayout>
  )
}
