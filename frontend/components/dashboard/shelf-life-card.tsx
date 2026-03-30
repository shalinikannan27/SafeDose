import { Card, CardContent } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"

interface ShelfLifeCardProps {
  hours: number | null
}

export function ShelfLifeCard({ hours }: ShelfLifeCardProps) {
  const isExpired = hours !== null && hours <= 0

  return (
    <Card className="border border-border/50 shadow-sm">
      <CardContent className="p-6 flex flex-col items-center justify-center h-full">
        <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-3">
          Remaining Shelf Life
        </p>
        <p className="text-4xl font-bold text-foreground">
          {hours === null ? (
            <span className="text-2xl font-normal text-muted-foreground italic">Pending</span>
          ) : hours <= 0 ? (
            <span className="text-xl text-red-600 font-bold uppercase">Discard immediately</span>
          ) : (
            <>
              {hours} <span className="text-2xl font-normal">Hrs</span>
            </>
          )}
        </p>
        {isExpired && (
          <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            Expired
          </p>
        )}
        {hours !== null && hours > 0 && hours < 24 && (
          <p className="text-xs text-yellow-600 mt-2 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            Expiring Soon
          </p>
        )}
      </CardContent>
    </Card>
  )
}
