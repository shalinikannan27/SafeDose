import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface AnalysisStatusCardProps {
  status: "Safe" | "Use Soon" | "Discard" | "Unknown"
  message: string
  batchId?: string
}

export function AnalysisStatusCard({ status, message, batchId }: AnalysisStatusCardProps) {
  const statusStyles = {
    Safe: "bg-green-100 text-green-700 border-green-200",
    "Use Soon": "bg-yellow-100 text-yellow-700 border-yellow-200",
    Discard: "bg-red-100 text-red-700 border-red-200",
    Unknown: "bg-gray-100 text-gray-700 border-gray-200",
  }

  return (
    <Card className="border border-border/50 shadow-sm">
      <CardContent className="p-6 flex flex-col items-center justify-center h-full">
        <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-3">
          Analysis Status
        </p>
        <Badge
          className={`${statusStyles[status]} text-base px-6 py-2 rounded-full font-medium border`}
        >
          {status}
        </Badge>
        <p className="text-xs text-muted-foreground mt-3 text-center">
          {message}
        </p>
        {batchId && (
          <p className="text-xs text-muted-foreground mt-2 text-center font-medium">
            Batch ID: {batchId}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
