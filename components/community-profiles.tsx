import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface Profile {
  name: string
  avatar: string
  address: string
  symbol?: string
}

interface CommunityProfilesProps {
  onProfileSelect: (profile: Profile) => void
  onTabChange: (value: string) => void
}

export function CommunityProfiles({ onProfileSelect, onTabChange }: CommunityProfilesProps) {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProfiles() {
      try {
        const res = await fetch(
          "https://dev.liquidlaunch.app/api/tokens?view=bonded&search=&sortKey=latestActivity&sortOrder=desc&timeframe=24h&minHolderCount=2&marketCapMin=0&marketCapMax=1000000&progressMin=1&progressMax=100&filterByHolderCount=true"
        )
        const data = await res.json()
        const tokens = data.tokens || []
        
        // Transform tokens into profiles
        const transformedProfiles = tokens.map((token: any) => ({
          name: token.name,
          avatar: token.metadata?.image_uri || token.metadata?.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${token.symbol}`,
          address: token.address,
          symbol: token.symbol,
        }))
        console.log("Transformed profiles:", transformedProfiles)
        
        setProfiles(transformedProfiles)
        setLoading(false)
      } catch (e) {
        setError("Failed to fetch profiles")
        setLoading(false)
      }
    }
    fetchProfiles()
  }, [])

  const handleProfileClick = (profile: Profile) => {
    onProfileSelect(profile)
    onTabChange("info")
  }

  if (loading) {
    return (
      <div className="grid gap-8 grid-cols-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="h-24 w-24 rounded-full bg-gray-700/40 animate-pulse" />
            <div className="h-6 w-32 bg-gray-700/40 rounded mt-4 animate-pulse" />
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>
  }

  return (
    <div className="grid gap-8 grid-cols-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {profiles.map((profile, index) => (
        <motion.div
          key={profile.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="flex flex-col items-center cursor-pointer"
          onClick={() => handleProfileClick(profile)}
        >
          <motion.div 
            className="relative"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="absolute inset-0 bg-accent-light rounded-full blur-md opacity-50" />
            <div className="relative h-24 w-24 rounded-full p-1 bg-accent-light">
              <div className="h-full w-full rounded-full overflow-hidden bg-secondary-light">
                <img
                  src={profile.avatar}
                  alt={profile.symbol || profile.name}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.symbol}`;
                  }}
                />
              </div>
            </div>
          </motion.div>
          <span className="mt-4 text-lg font-medium text-primary">{profile.symbol}</span>
        </motion.div>
      ))}
    </div>
  )
}
