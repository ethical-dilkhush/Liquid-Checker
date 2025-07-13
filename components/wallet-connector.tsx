"use client"

import { useState } from "react"
import { Wallet, ExternalLink, Copy, Check, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { useWallet } from "@/hooks/use-wallet"

interface WalletConnectorProps {
  isOpen: boolean
  onClose: () => void
}

export function WalletConnector({ isOpen, onClose }: WalletConnectorProps) {
  const { account, isConnecting, isMetaMaskInstalled, connectWallet, disconnectWallet } = useWallet()
  const [hasCopied, setHasCopied] = useState(false)

  const copyAddress = () => {
    if (account) {
      navigator.clipboard.writeText(account)
      setHasCopied(true)
      setTimeout(() => setHasCopied(false), 2000)
    }
  }

  const openEtherscan = () => {
    if (account) {
      window.open(`https://etherscan.io/address/${account}`, "_blank")
    }
  }

  const handleDisconnect = () => {
    disconnectWallet()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            {account ? "Wallet Connected" : "Connect Wallet"}
          </DialogTitle>
          <DialogDescription>
            {account
              ? "Your wallet is connected. You can view your address or disconnect below."
              : "Connect your wallet to access blockchain features."}
          </DialogDescription>
        </DialogHeader>

        {!account ? (
          <div className="flex flex-col gap-4">
            {!isMetaMaskInstalled && (
              <div className="bg-yellow-500/10 border border-yellow-500/50 text-yellow-500 rounded-md p-3 text-sm flex items-start gap-2">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">MetaMask not detected</p>
                  <p className="text-xs mt-1">
                    Please install MetaMask to connect your wallet.{" "}
                    <a
                      href="https://metamask.io/download/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:no-underline"
                    >
                      Download here
                    </a>
                  </p>
                </div>
              </div>
            )}

            <Button
              onClick={connectWallet}
              disabled={isConnecting || !isMetaMaskInstalled}
              className="w-full flex items-center justify-center gap-2"
            >
              <img src="/metamask-fox.svg" alt="MetaMask" className="h-5 w-5" />
              {isConnecting ? "Connecting..." : "Connect with MetaMask"}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium">Connected Address</div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={copyAddress} title="Copy address">
                      {hasCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={openEtherscan}
                      title="View on Etherscan"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="font-mono text-sm break-all bg-muted p-2 rounded">{account}</div>
              </CardContent>
            </Card>

            <div className="bg-blue-500/10 border border-blue-500/50 text-blue-500 rounded-md p-3 text-sm">
              <p className="text-xs">
                <strong>Note:</strong> To fully disconnect, you may also need to disconnect this site from your MetaMask
                wallet settings.
              </p>
            </div>

            <Button variant="outline" className="w-full" onClick={handleDisconnect}>
              Disconnect Wallet
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
