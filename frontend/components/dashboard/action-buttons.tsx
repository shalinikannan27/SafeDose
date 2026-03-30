"use client"

import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface ActionButtonsProps {
  status: "Safe" | "Use Soon" | "Discard" | "Unknown"
  onApprove: () => void
  onReject: () => void
  disabled?: boolean
  confirmation: {
    type: "approve" | "reject" | null
    message: string | null
  }
}

export function ActionButtons({ 
  status, 
  onApprove, 
  onReject, 
  disabled, 
  confirmation 
}: ActionButtonsProps) {
  const isDiscard = status === "Discard"
  const isUnknown = status === "Unknown" || !status

  return (
    <div className="mt-8 flex flex-col items-center gap-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          onClick={onApprove}
          disabled={disabled || isUnknown}
          className="bg-green-600 hover:bg-green-700 text-white rounded-xl px-12 py-6 text-base flex items-center gap-2"
        >
          <CheckCircle className="w-5 h-5" />
          Approve Vaccine Batch
        </Button>
        <Button
          onClick={onReject}
          variant="destructive"
          disabled={disabled || isUnknown}
          className="bg-red-700 hover:bg-red-800 text-white rounded-xl px-12 py-6 text-base flex items-center gap-2"
        >
          <XCircle className="w-5 h-5" />
          Reject Vaccine Batch
        </Button>
      </div>

      {confirmation.type && (
        <div 
          className={cn(
            "w-full max-w-2xl p-4 rounded-lg flex items-center justify-center gap-2 animate-in fade-in slide-in-from-top-2 duration-300",
            confirmation.type === "approve" ? "bg-green-600 text-white" : "bg-red-700 text-white"
          )}
        >
          <span className="text-lg font-medium">
            {confirmation.type === "approve" ? "✓" : "✗"} {confirmation.message}
          </span>
        </div>
      )}
    </div>
  )
}
