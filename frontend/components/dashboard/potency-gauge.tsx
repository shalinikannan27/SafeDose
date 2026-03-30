"use client"

import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface PotencyGaugeProps {
  potency: number
}

export function PotencyGauge({ potency }: PotencyGaugeProps) {
  const radius = 45
  const circumference = 2 * Math.PI * radius
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - ((potency ?? 0) / 100) * circumference
  const color = (potency ?? 0) > 75 ? "text-emerald-500" : (potency ?? 0) > 40 ? "text-amber-500" : "text-rose-500"

  return (
    <Card className="border border-border/50 shadow-sm">
      <CardContent className="p-6 flex flex-col items-center">
        <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-4">
          Potency Level
        </p>
        <div className="relative w-32 h-32">
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold text-foreground">
              {isNaN(potency as number) || potency === null ? "—" : `${potency}%`}
            </span>
          </div>
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="transparent"
              stroke="currentColor"
              strokeWidth="8"
              className="text-muted/30"
            />
            {!(isNaN(potency as number) || potency === null) && (
              <circle
                cx="50"
                cy="50"
                r={radius}
                fill="transparent"
                stroke="currentColor"
                strokeWidth="8"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className={cn("transition-all duration-1000 ease-out", color)}
              />
            )}
          </svg>
        </div>
      </CardContent>
    </Card>
  )
}
