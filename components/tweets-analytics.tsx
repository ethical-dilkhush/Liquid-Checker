import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "@/components/ui/chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function TweetsAnalytics() {
  // Mock data for engagement chart
  const engagementData = [
    { name: "Mon", likes: 240, retweets: 140, replies: 80 },
    { name: "Tue", likes: 300, retweets: 180, replies: 100 },
    { name: "Wed", likes: 280, retweets: 160, replies: 90 },
    { name: "Thu", likes: 320, retweets: 200, replies: 120 },
    { name: "Fri", likes: 400, retweets: 240, replies: 150 },
    { name: "Sat", likes: 380, retweets: 220, replies: 130 },
    { name: "Sun", likes: 450, retweets: 260, replies: 170 },
  ]

  // Mock data for sentiment chart
  const sentimentData = [
    { name: "Positive", value: 65 },
    { name: "Neutral", value: 25 },
    { name: "Negative", value: 10 },
  ]

  const COLORS = ["#10B981", "#F59E0B", "#EF4444"]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tweet Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="engagement">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
            <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
          </TabsList>
          <TabsContent value="engagement" className="pt-4">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={engagementData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="likes" fill="#1DA1F2" name="Likes" />
                  <Bar dataKey="retweets" fill="#17BF63" name="Retweets" />
                  <Bar dataKey="replies" fill="#794BC4" name="Replies" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          <TabsContent value="sentiment" className="pt-4">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sentimentData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {sentimentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
