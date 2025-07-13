"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Mail, MapPin, Phone } from "lucide-react"

export function AboutContact() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      // Reset form or show success message
    }, 1500)
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-start gap-3">
            <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <h3 className="font-semibold">Email</h3>
              <p className="text-muted-foreground">info@clanker.io</p>
              <p className="text-muted-foreground">support@clanker.io</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <h3 className="font-semibold">Phone</h3>
              <p className="text-muted-foreground">+1 (555) 123-4567</p>
              <p className="text-muted-foreground">Mon-Fri, 9am-5pm EST</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <h3 className="font-semibold">Address</h3>
              <p className="text-muted-foreground">123 Blockchain Street</p>
              <p className="text-muted-foreground">San Francisco, CA 94103</p>
              <p className="text-muted-foreground">United States</p>
            </div>
          </div>

          <div className="pt-4">
            <h3 className="font-semibold mb-2">Connect With Us</h3>
            <p className="text-muted-foreground mb-4">
              Follow us on social media to stay updated with the latest news and announcements.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-primary hover:text-primary/80">
                Twitter
              </a>
              <a href="#" className="text-primary hover:text-primary/80">
                Discord
              </a>
              <a href="#" className="text-primary hover:text-primary/80">
                Telegram
              </a>
              <a href="#" className="text-primary hover:text-primary/80">
                GitHub
              </a>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Send Us a Message</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Your name" required />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="Your email" required />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" placeholder="Message subject" required />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" placeholder="Your message" className="min-h-[120px]" required />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Send Message"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
