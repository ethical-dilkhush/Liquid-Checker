"use client"

import { useState } from "react"
import { Wallet, ChevronDown } from "lucide-react"
import { WalletConnector } from "@/components/wallet-connector"
import { useWallet } from "@/hooks/use-wallet"
import { cn } from "@/lib/utils"

interface ConnectWalletButtonProps {
  className?: string
}

export function ConnectWalletButton({ className }: ConnectWalletButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { account } = useWallet()

  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

  return (
    <>
      <div
        onClick={() => setIsOpen(true)}
        className={cn("cursor-pointer transition-all duration-200 hover:bg-accent-dark/20 rounded-xl", className)}
      >
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <Wallet className="h-5 w-5" />
            <span className="text-sm">{account ? formatAddress(account) : "Connect Wallet"}</span>
          </div>
          {account && (
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </div>
          )}
        </div>
      </div>
      <WalletConnector isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}
