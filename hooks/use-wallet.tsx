"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { toast } from "@/hooks/use-toast"

interface WalletContextType {
  account: string | null
  isConnecting: boolean
  isMetaMaskInstalled: boolean
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)

  // Check if MetaMask is installed
  const isMetaMaskInstalled = typeof window !== "undefined" && window.ethereum !== undefined

  // Check for existing connection on component mount
  useEffect(() => {
    const checkConnection = async () => {
      if (isMetaMaskInstalled) {
        try {
          const accounts = await window.ethereum.request({ method: "eth_accounts" })
          if (accounts && accounts.length > 0) {
            setAccount(accounts[0])
          }
        } catch (err) {
          console.error("Failed to get accounts", err)
        }
      }
    }

    checkConnection()
  }, [isMetaMaskInstalled])

  // Handle MetaMask account changes
  useEffect(() => {
    if (isMetaMaskInstalled) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          // User disconnected from MetaMask
          setAccount(null)
          toast({
            title: "Wallet Disconnected",
            description: "Your wallet has been disconnected.",
          })
        } else {
          // Account changed
          setAccount(accounts[0])
        }
      }

      const handleChainChanged = () => {
        // Reload the page when chain changes
        window.location.reload()
      }

      window.ethereum.on("accountsChanged", handleAccountsChanged)
      window.ethereum.on("chainChanged", handleChainChanged)

      return () => {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
        window.ethereum.removeListener("chainChanged", handleChainChanged)
      }
    }
  }, [isMetaMaskInstalled])

  const connectWallet = async () => {
    setIsConnecting(true)

    try {
      if (!isMetaMaskInstalled) {
        throw new Error("MetaMask is not installed. Please install MetaMask to connect your wallet.")
      }

      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
      setAccount(accounts[0])
      toast({
        title: "Wallet Connected",
        description: "Your wallet has been successfully connected.",
      })
    } catch (err: any) {
      console.error("Failed to connect wallet", err)
      toast({
        title: "Connection Failed",
        description: err.message || "Failed to connect wallet. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnectWallet = () => {
    setAccount(null)
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected from this app.",
    })
  }

  return (
    <WalletContext.Provider
      value={{
        account,
        isConnecting,
        isMetaMaskInstalled,
        connectWallet,
        disconnectWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider")
  }
  return context
}
