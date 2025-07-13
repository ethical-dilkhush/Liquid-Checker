"use client"

import { Search, Filter } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface TweetsFilterProps {
  filter: {
    sentiment: string
    date: string
    sort: string
  }
  setFilter: (filter: any) => void
}

export function TweetsFilter({ filter, setFilter }: TweetsFilterProps) {
  const handleFilterChange = (key: string, value: string) => {
    setFilter({ ...filter, [key]: value })
  }

  const handleReset = () => {
    setFilter({
      sentiment: "all",
      date: "all",
      sort: "latest",
    })
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search tweets..." className="pl-8" />
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filters:</span>
            </div>

            <Select value={filter.sentiment} onValueChange={(value) => handleFilterChange("sentiment", value)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Sentiment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sentiments</SelectItem>
                <SelectItem value="positive">Positive</SelectItem>
                <SelectItem value="neutral">Neutral</SelectItem>
                <SelectItem value="negative">Negative</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filter.date} onValueChange={(value) => handleFilterChange("date", value)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filter.sort} onValueChange={(value) => handleFilterChange("sort", value)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">Latest</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="engagement">Highest Engagement</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm" onClick={handleReset}>
              Reset
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
