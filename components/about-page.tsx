"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AboutClanker } from "@/components/about-clanker"
import { AboutTeam } from "@/components/about-team"
import { AboutContact } from "@/components/about-contact"
import { AboutEmbed } from "@/components/about-embed"

export function AboutPage() {
  return (
    <DashboardLayout>
      <div className="grid gap-6 p-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">About Liquid Checker</h1>
          <p className="text-gray-500">Learn about Liquid Checker's story, mission, team, and how to get in touch with us.</p>
        </div>

        <Tabs defaultValue="about" className="w-full">
          <TabsList className="grid w-full grid-cols-4 md:w-auto">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
            <TabsTrigger value="embed">Embed API</TabsTrigger>
          </TabsList>
          <TabsContent value="about" className="mt-6">
            <AboutClanker />
          </TabsContent>
          <TabsContent value="team" className="mt-6">
            <AboutTeam />
          </TabsContent>
          <TabsContent value="contact" className="mt-6">
            <AboutContact />
          </TabsContent>
          <TabsContent value="embed" className="mt-6">
            <AboutEmbed />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
