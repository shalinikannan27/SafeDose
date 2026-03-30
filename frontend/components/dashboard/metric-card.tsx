import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LucideIcon } from "lucide-react"

interface MetricCardProps {
  icon: LucideIcon
  label: string
  value: string
  subValue?: string
  status?: string
  statusColor?: "green" | "yellow" | "red"
  progressValue?: number
  progressColor?: "green" | "yellow" | "red"
  showDoorIndicator?: boolean
  doorCount?: number
}

export function MetricCard({
  icon: Icon,
  label,
  value,
  subValue,
  status,
  statusColor = "green",
  progressValue,
  progressColor,
  showDoorIndicator,
  doorCount = 0,
}: MetricCardProps) {
  const statusStyles = {
    green: "bg-green-100 text-green-700 border-green-200",
    yellow: "bg-yellow-100 text-yellow-700 border-yellow-200",
    red: "bg-red-100 text-red-700 border-red-200",
  }

  const progressStyles = {
    green: "bg-green-500",
    yellow: "bg-yellow-500",
    red: "bg-red-500",
  }

  return (
    <Card className="border border-border/50 shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon className="w-4 h-4 text-primary" />
          </div>
          {status && (
            <Badge
              variant="outline"
              className={`${statusStyles[statusColor]} text-xs px-2 py-0.5 rounded-full border`}
            >
              {status}
            </Badge>
          )}
        </div>
        <p className="text-2xl font-bold text-foreground">
          {value}
          {subValue && (
            <span className="text-sm font-normal text-muted-foreground">
              {subValue}
            </span>
          )}
        </p>
        <p className="text-xs text-muted-foreground mt-1">{label}</p>

        {progressValue !== undefined && (
          <div className="mt-3 h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full ${progressStyles[progressColor || "green"]} transition-all duration-500`}
              style={{ width: `${progressValue}%` }}
            />
          </div>
        )}

        {showDoorIndicator && (
          <div className="mt-3 flex gap-1">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full ${
                  i < doorCount ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
