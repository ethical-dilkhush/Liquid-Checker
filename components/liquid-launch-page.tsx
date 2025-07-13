"use client"
import { Twitter, Send, FileText, BookOpen, TrendingUp, Repeat, Rocket, Download } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"
import { toast } from "sonner"

// Initialize Supabase client with the provided credentials
const supabaseUrl = "https://cumyphiqdlvdqxyjrevr.supabase.co"
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1bXlwaGlxZGx2ZHF4eWpyZXZyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTE0MjY2NiwiZXhwIjoyMDY0NzE4NjY2fQ.cRPnUigJyP7G0STJ-itew76zyEKut0ewUU6znGy_vk4"
const supabase = createClient(supabaseUrl, supabaseKey)

interface BrandingAsset {
  name: string
  url: string
}

export function LiquidLaunchPage() {
  const [brandingAssets, setBrandingAssets] = useState<BrandingAsset[]>([])
  const [loading, setLoading] = useState(true)

  const socialLinks = [
    {
      name: "Twitter",
      icon: Twitter,
      url: "https://x.com/LiquidLaunchHL",
      color: "bg-blue-500",
    },
    {
      name: "Discord",
      icon: ({ className }: { className?: string }) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className} fill="currentColor">
          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
        </svg>
      ),
      url: "https://discord.com/invite/liquidlaunch",
      color: "bg-indigo-600",
    },
    {
      name: "Telegram",
      icon: Send,
      url: "https://discord.com/invite/liquidlaunch",
      color: "bg-sky-500",
    },
    {
      name: "Liquid Swap",
      icon: Repeat,
      url: "https://liqd.ag/",
      color: "bg-green-500",
    },
    {
      name: "Liquid Launch",
      icon: Rocket,
      url: "https://dev.liquidlaunch.app/tokens",
      color: "bg-purple-500",
    },
    {
      name: "Medium",
      icon: BookOpen,
      url: "https://medium.com/@liquidlaunch/a-new-era-for-hyperliquid-the-liqd-vision-comes-to-life-d5bba8d164b8",
      color: "bg-yellow-600",
    },
    {
      name: "Liquid Docs",
      icon: FileText,
      url: "https://liquidlaunch.gitbook.io/liquidlaunch",
      color: "bg-pink-500",
    },
    {
      name: "HyperLiquid Spot",
      icon: TrendingUp,
      url: "https://app.hyperliquid.xyz/trade/0xa043053570d42d6f553896820dfd42b6",
      color: "bg-red-500",
    },
  ]

  useEffect(() => {
    fetchBrandingAssets()
  }, [])

  // Function to list all images in the bucket - using your provided code
  const listImages = async (bucketName: string) => {
    const { data, error } = await supabase.storage.from(bucketName).list("", {
      limit: 100, // Adjust the limit as needed
      offset: 0,
    })

    if (error) {
      console.error("Error listing images:", error)
      return []
    }

    return data || []
  }

  // Function to get public URLs for the images - using your provided code
  const getImageUrls = async (bucketName: string, images: any[]) => {
    return images.map((image) => {
      const { data } = supabase.storage.from(bucketName).getPublicUrl(image.name)
      return {
        name: image.name,
        url: data.publicUrl,
      }
    })
  }

  const fetchBrandingAssets = async () => {
    try {
      setLoading(true)
      const bucketName = "liquidbranding"

      // Using the functions from your provided code
      const images = await listImages(bucketName)
      const assets = await getImageUrls(
        bucketName,
        images.filter((img) => img.name !== ".emptyFolderPlaceholder"),
      )

      setBrandingAssets(assets)
    } catch (error) {
      console.error("Error fetching branding assets:", error)
      toast.error("Failed to load branding assets")
    } finally {
      setLoading(false)
    }
  }

  const downloadAsset = async (asset: BrandingAsset) => {
    try {
      const response = await fetch(asset.url)
      const blob = await response.blob()

      // Create download link
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = asset.name
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast.success(`Downloaded ${asset.name}`)
    } catch (error) {
      console.error("Download error:", error)
      toast.error("Failed to download asset")
    }
  }

  const isImageFile = (filename: string) => {
    const imageExtensions = ["jpg", "jpeg", "png", "gif", "svg", "webp"]
    const extension = filename.split(".").pop()?.toLowerCase()
    return extension ? imageExtensions.includes(extension) : false
  }

  // Format the file name: remove extension and convert to uppercase
  const formatFileName = (filename: string) => {
    // Remove file extension (everything after the last dot)
    const nameWithoutExtension = filename.split(".").slice(0, -1).join(".")
    // Convert to uppercase
    return nameWithoutExtension.toUpperCase()
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Liquid Launch
        </h1>
        <p className="text-muted-foreground">
          Connect with Liquid Launch across various platforms and access resources
        </p>
      </div>

      {/* Social Links Section - Updated to match dashboard stats design */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Social Media & Resources</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {socialLinks.map((link) => (
            <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer" className="block">
              <Card className="bg-white/5 backdrop-blur-sm border border-white/10 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">{link.name}</p>
                      <p className="text-lg font-medium">Visit</p>
                    </div>
                    <div className={`h-12 w-12 rounded-full ${link.color} flex items-center justify-center`}>
                      <link.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>
      </div>

      {/* Branding Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Liquid Branding</h2>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="border border-white/10 bg-white/5 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="animate-pulse">
                    <div className="bg-gray-300 h-32 rounded mb-4"></div>
                    <div className="bg-gray-300 h-4 rounded mb-2"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : brandingAssets.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" id="image-container">
            {brandingAssets.map((asset) => (
              <Card
                key={asset.name}
                className="border border-white/10 bg-white/5 backdrop-blur-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
              >
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {/* Image Preview */}
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      {isImageFile(asset.name) ? (
                        <img
                          src={asset.url || "/placeholder.svg"}
                          alt={formatFileName(asset.name)}
                          className="w-full h-full object-cover"
                          style={{ width: "100%", margin: "0" }}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.style.display = "none"
                            target.nextElementSibling?.classList.remove("hidden")
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                          <div className="text-center">
                            <FileText className="h-8 w-8 mx-auto text-gray-500 mb-2" />
                            <span className="text-xs font-medium text-gray-600">
                              {asset.name.split(".").pop()?.toUpperCase() || "FILE"}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* File Info - Now showing name without extension and in uppercase */}
                    <div>
                      <h3 className="font-medium text-sm truncate" title={formatFileName(asset.name)}>
                        {formatFileName(asset.name)}
                      </h3>
                    </div>

                    {/* Download Button */}
                    <Button onClick={() => downloadAsset(asset)} size="sm" className="w-full" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border border-white/10 bg-white/5 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="text-center py-8">
                <Download className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No branding assets found in the liquidbranding bucket.</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
