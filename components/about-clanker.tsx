import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

export function AboutClanker() {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold mb-4">Our Story</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Liquid Checker was born from a simple yet powerful idea: no one else offers a dedicated dashboard that compiles all real-time LiquidLaunch data, totals for tokens, market cap, liquidity, volume, price changes, holders, bonded stats, and more, into a single, interactive hub. 
                </p>
                <p>
                  Starting as a coder-driven passion project, it evolved into a complete platform where anyone can visualize on-chain activity, like and comment on tokens, and track growth through easy-to-read graphs. We built it because crypto deserves transparency, and users deserve clarity.
                </p>
                
              </div>
            </div>
            <div className="flex items-center justify-center">
              <Image
                src="/liquid-stats-story.png"
                alt="Liquid Checker Logo"
                width={400}
                height={400}
                className="rounded-lg"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              To empower every crypto user. whether trader, developer, or newcomer, with instant access to comprehensive launch data. We turn fragmented metrics into actionable insights, nurture meaningful interaction around emerging tokens, and build a vibrant hub where real-time data meets active engagement. Our goal is to foster smarter decision-making and deeper participation in the liquid‑launch ecosystem.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold mb-4">Our Values</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Innovation</h3>
              <p className="text-muted-foreground">
               We’re always pushing the boundaries—adding new charts, dashboards, and user tools. Our ethos: keep evolving to stay ahead, ensuring users discover what others can’t.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Transparency</h3>
              <p className="text-muted-foreground">
                All data on Liquid Stats is sourced directly on‑chain. No aggregation behind closed doors—just open, verifiable metrics you can trust.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Community</h3>
              <p className="text-muted-foreground">
                Users shape the platform. With likes, comments, and engagement features, Liquid Stats is more than data—it’s a two‑way street powered by users' voices.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Accessibility</h3>
              <p className="text-muted-foreground">
                We break down complex metrics into clean visuals and intuitive interfaces. Whether you're a crypto veteran or just getting started, our dashboard is built for you.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Security</h3>
              <p className="text-muted-foreground">
                We combine robust tech and best practices to protect data accuracy and guard against tampering—while still keeping everything visible on-chain.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Sustainability</h3>
              <p className="text-muted-foreground">
                Liquid Stats is designed to grow with the ecosystem—built for scalability and efficiency, ensuring long-term performance and impact.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
