"use client"
import { DashboardLayout } from "@/components/dashboard-layout"
import { DashboardPieChart } from "@/components/dashboard-pie-chart"
import { BondedPieChart } from "@/components/bonded-pie-chart"
import { ActivityPieChart } from "@/components/activity-pie-chart"
import { VolumePieChart } from "@/components/volume-pie-chart"

export function QuickStatsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-text-primary">Quick Stats</h1>
          <p className="text-text-muted">
            Comprehensive visual overview of all key metrics across the platform in pie chart format for better clarity
            and insights.
          </p>
        </div>

        {/* Pie Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <DashboardPieChart />
          <BondedPieChart />
          <ActivityPieChart />
          <VolumePieChart />
        </div>
      </div>
    </DashboardLayout>
  )
}
