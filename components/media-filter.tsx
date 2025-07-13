"use client"

import { Search, Filter } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface MediaFilterProps {
  filter: {
    type: string
    sort: string
    search: string
  }
  setFilter: (filter: any) => void
}

export function MediaFilter({ filter, setFilter }: MediaFilterProps) {
  const handleFilterChange = (key: string, value: string) => {
    setFilter({ ...filter, [key]: value })
  }

  return (
    <Card>
      <CardContent className="p-3 sm:p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by token name or symbol..."
              className="pl-8 text-sm"
              value={filter.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs sm:text-sm font-medium">Sort By:</span>
            </div>

            <Select value={filter.sort} onValueChange={(value) => handleFilterChange("sort", value)}>
              <SelectTrigger className="w-full sm:w-[180px] text-sm h-9">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">Latest</SelectItem>
                <SelectItem value="comments">Rank By Comments</SelectItem>
                <SelectItem value="votes">Rank By Votes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
