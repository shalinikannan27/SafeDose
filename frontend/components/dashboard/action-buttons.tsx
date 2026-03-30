"use client"

import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle } from "lucide-react"

interface ActionButtonsProps {
  status: "Safe" | "Warning" | "Unsafe"
}

export function ActionButtons({ status }: ActionButtonsProps) {
  const handleApprove = () => {
    alert("Vaccine batch approved!")
  }

  const handleReject = () => {
    alert("Vaccine batch rejected!")
  }

  return (
    <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
      <Button
        onClick={handleApprove}
        disabled={status === "Unsafe"}
        className="bg-green-600 hover:bg-green-700 text-white rounded-xl px-12 py-6 text-base flex items-center gap-2"
      >
        <CheckCircle className="w-5 h-5" />
        Approve Vaccine Batch
      </Button>
      <Button
        onClick={handleReject}
        variant="destructive"
        className="bg-red-700 hover:bg-red-800 text-white rounded-xl px-12 py-6 text-base flex items-center gap-2"
      >
        <XCircle className="w-5 h-5" />
        Reject Vaccine Batch
      </Button>
    </div>
  )
}
