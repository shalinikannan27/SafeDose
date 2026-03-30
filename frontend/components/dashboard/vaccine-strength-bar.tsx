import { Card, CardContent } from "@/components/ui/card"

interface VaccineStrengthBarProps {
  vaccineStrength: {
    stable: number
    degrading: number
    inert: number
    effective_percentage: number
  }
}

export function VaccineStrengthBar({ vaccineStrength }: VaccineStrengthBarProps) {
  return (
    <Card className="border border-border/50 shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold text-foreground">
              Vaccine Strength Breakdown
            </h3>
            <p className="text-sm text-muted-foreground">
              Biological stability projection over the current cycle
            </p>
          </div>
          <p className="text-lg font-semibold text-green-600">
            {vaccineStrength.effective_percentage}% Effective
          </p>
        </div>

        <div className="h-4 rounded-full overflow-hidden flex">
          <div
            className="bg-primary transition-all duration-500"
            style={{ width: `${vaccineStrength.stable}%` }}
          />
          <div
            className="bg-primary/60 transition-all duration-500"
            style={{ width: `${vaccineStrength.degrading}%` }}
          />
          <div
            className="bg-muted transition-all duration-500"
            style={{ width: `${vaccineStrength.inert}%` }}
          />
        </div>

        <div className="flex items-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-xs text-muted-foreground">STABLE</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary/60" />
            <span className="text-xs text-muted-foreground">DEGRADING</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-muted" />
            <span className="text-xs text-muted-foreground">INERT</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
