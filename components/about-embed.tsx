import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Copy } from "lucide-react"

export function AboutEmbed() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Liquid Checker Embed API</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Integrate Liquid Checker data and widgets into your website or application using our Embed API. Choose from a
            variety of widgets including stats, charts, and feeds.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="font-semibold mb-2">Features</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Real-time data updates</li>
                <li>Customizable appearance</li>
                <li>Responsive design</li>
                <li>Multiple widget types</li>
                <li>Simple integration</li>
                <li>Comprehensive documentation</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Getting Started</h3>
              <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                <li>Sign up for an API key</li>
                <li>Choose your widgets</li>
                <li>Customize appearance</li>
                <li>Copy the embed code</li>
                <li>Paste into your website</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Widget Examples</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="stats">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="stats">Stats Widget</TabsTrigger>
              <TabsTrigger value="chart">Chart Widget</TabsTrigger>
              <TabsTrigger value="feed">Feed Widget</TabsTrigger>
            </TabsList>
            <TabsContent value="stats" className="pt-4">
              <div className="border rounded-lg p-4 mb-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Total Followers</p>
                    <p className="text-2xl font-bold">6,000</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Engagement Rate</p>
                    <p className="text-2xl font-bold">6.0%</p>
                  </div>
                </div>
              </div>
              <div className="relative">
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                  {`<script src="https://embed.liquidstats.io/widget.js" data-widget="stats" data-api-key="YOUR_API_KEY"></script>`}
                </pre>
                <Button variant="ghost" size="icon" className="absolute top-2 right-2">
                  <Copy className="h-4 w-4" />
                  <span className="sr-only">Copy code</span>
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="chart" className="pt-4">
              <div className="border rounded-lg p-4 mb-4">
                <div className="h-[200px] bg-muted/50 rounded flex items-center justify-center">
                  <p className="text-muted-foreground">Chart Widget Preview</p>
                </div>
              </div>
              <div className="relative">
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                  {`<script src="https://embed.liquidstats.io/widget.js" data-widget="chart" data-type="line" data-api-key="YOUR_API_KEY"></script>`}
                </pre>
                <Button variant="ghost" size="icon" className="absolute top-2 right-2">
                  <Copy className="h-4 w-4" />
                  <span className="sr-only">Copy code</span>
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="feed" className="pt-4">
              <div className="border rounded-lg p-4 mb-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-muted" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Liquid Checker Official</p>
                      <p className="text-xs text-muted-foreground">Latest update from Liquid Checker...</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-muted" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Community Member</p>
                      <p className="text-xs text-muted-foreground">Excited about the new features...</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                  {`<script src="https://embed.liquidstats.io/widget.js" data-widget="feed" data-count="5" data-api-key="YOUR_API_KEY"></script>`}
                </pre>
                <Button variant="ghost" size="icon" className="absolute top-2 right-2">
                  <Copy className="h-4 w-4" />
                  <span className="sr-only">Copy code</span>
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>API Documentation</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            For detailed information on how to use the Liquid Checker Embed API, including all available options and
            customization parameters, please refer to our comprehensive documentation.
          </p>
          <Button className="w-full sm:w-auto">View Documentation</Button>
        </CardContent>
      </Card>
    </div>
  )
}
