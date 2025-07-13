import { Card, CardContent } from "@/components/ui/card"
import { GraduationCap, Brain, LineChart, Lightbulb } from "lucide-react"

export function AboutTeam() {
  return (
    <Card className="bg-white/5 backdrop-blur-sm border border-white/10">
      <CardContent className="p-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">Our Team</h2>
          </div>

          <p className="text-lg leading-relaxed">
            Liquid Checker is built by a dedicated team of PhD scholars with deep expertise in data science, blockchain
            systems, and real-time analytics. Our academic background drives our commitment to accuracy, transparency,
            and technical excellence.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
            <div className="flex flex-col items-center text-center p-4">
              <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-4">
                <Brain className="h-6 w-6 text-blue-500" />
              </div>
              <h3 className="font-medium mb-2">Researchers</h3>
              <p className="text-sm text-muted-foreground">Deep academic expertise in blockchain systems</p>
            </div>

            <div className="flex flex-col items-center text-center p-4">
              <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                <LineChart className="h-6 w-6 text-green-500" />
              </div>
              <h3 className="font-medium mb-2">Data Scientists</h3>
              <p className="text-sm text-muted-foreground">Turning complex data into usable insights</p>
            </div>

            <div className="flex flex-col items-center text-center p-4">
              <div className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center mb-4">
                <Lightbulb className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-medium mb-2">Problem-Solvers</h3>
              <p className="text-sm text-muted-foreground">Creating innovative solutions with purpose</p>
            </div>
          </div>

          <p className="text-lg leading-relaxed">
            We're not just developers—we're researchers, thinkers, and problem-solvers focused on turning complex
            blockchain data into usable insights. Every feature we build is backed by rigorous logic, tested
            methodology, and a clear purpose: to help users navigate the fast-moving world of liquid launches with
            clarity and confidence.
          </p>

          <p className="text-lg leading-relaxed">
            We believe real innovation happens when advanced knowledge meets real-world utility. Liquid Checker is our
            contribution to that intersection.
          </p>

          <p className="text-lg leading-relaxed">This is just the start—and we're only getting smarter.</p>

          <p className="text-lg font-medium italic mt-8">— The Liquid Checker Team</p>
        </div>
      </CardContent>
    </Card>
  )
}
