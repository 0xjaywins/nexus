"use client"

import { useState } from "react"
import { X, Check, AlertTriangle } from "lucide-react"
import { GlassmorphicCard } from "../ui/glassmorphic-card"
import { NeonInput } from "../ui/neon-input"
import { CyberpunkButton } from "../ui/cyberpunk-button"


interface ImportTokenModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ImportTokenModal({ isOpen, onClose }: ImportTokenModalProps) {
  const [address, setAddress] = useState("")
  const [isValidating, setIsValidating] = useState(false)
  const [validationResult, setValidationResult] = useState<{
    success: boolean
    message: string
    tokenName?: string
    tokenSymbol?: string
  } | null>(null)

  if (!isOpen) return null

  const handleValidate = () => {
    if (!address) return

    setIsValidating(true)
    setValidationResult(null)

    // Simulate token validation
    setTimeout(() => {
      setIsValidating(false)

      // Check if address looks like a valid address (very basic check)
      if (address.startsWith("0x") && address.length === 42) {
        setValidationResult({
          success: true,
          message: "Token validated successfully",
          tokenName: "Custom Token",
          tokenSymbol: "CTK",
        })
      } else {
        setValidationResult({
          success: false,
          message: "Invalid token address",
        })
      }
    }, 1500)
  }

  const handleImport = () => {
    // Here you would add the token to your list
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <GlassmorphicCard variant="gradient" className="w-full max-w-md relative">
        {/* Close button */}
        <button className="absolute top-2 right-2 text-text-secondary hover:text-white" onClick={onClose}>
          <X className="h-5 w-5" />
        </button>

        <div className="space-y-4">
          <h2 className="text-xl font-orbitron neon-cyan">Import Token</h2>

          <p className="text-sm text-text-secondary">Enter the contract address of the token you want to import.</p>

          <NeonInput
            variant="cyan"
            label="Token Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="0x..."
          />

          {validationResult && (
            <div
              className={`p-3 rounded-md border ${
                validationResult.success
                  ? "border-neon-green bg-neon-green/10 text-neon-green"
                  : "border-neon-red bg-neon-red/10 text-neon-red"
              }`}
            >
              <div className="flex items-center gap-2">
                {validationResult.success ? <Check className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                <span>{validationResult.message}</span>
              </div>

              {validationResult.success && (
                <div className="mt-2 p-2 border border-white/10 rounded-md">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Name:</span>
                    <span className="text-white">{validationResult.tokenName}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Symbol:</span>
                    <span className="text-white">{validationResult.tokenSymbol}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-3">
            <CyberpunkButton
              variant="cyan"
              className="flex-1"
              disabled={!address || isValidating}
              onClick={handleValidate}
            >
              {isValidating ? (
                <span className="flex items-center justify-center">
                  <span className="animate-pulse">Validating...</span>
                </span>
              ) : (
                "Validate"
              )}
            </CyberpunkButton>

            <CyberpunkButton
              variant="magenta"
              className="flex-1"
              disabled={!validationResult?.success}
              onClick={handleImport}
            >
              Import
            </CyberpunkButton>
          </div>
        </div>
      </GlassmorphicCard>
    </div>
  )
}
