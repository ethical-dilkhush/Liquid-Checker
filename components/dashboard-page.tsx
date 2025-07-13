"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { StatsCards } from "@/components/stats-cards"
import { LatestTokens } from "@/components/latest-tokens"
import { NewsSection } from "@/components/news-section"
import { TrendingSection } from "@/components/trending-section"
import { NotificationsPanel } from "@/components/notifications-panel"
import { NearToBond } from "@/components/near-to-bond"

export function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 p-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-500">
            Welcome to the Liquid Checker Dashboard - your unified interface for all Liquid Checker content.
          </p>
        </div>
        <StatsCards />
        <LatestTokens />
        <div className="grid gap-6 md:grid-cols-3">
          <NewsSection />
          <TrendingSection />
          <NotificationsPanel />
        </div>
        <NearToBond />
      </div>
    </DashboardLayout>
  )
}
