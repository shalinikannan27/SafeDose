"use client"

import { Card, CardContent } from "@/components/ui/card"

interface PotencyGaugeProps {
  potency: number
}

export function PotencyGauge({ potency }: PotencyGaugeProps) {
  const circumference = 2 * Math.PI * 45
  const strokeDashoffset = circumference - (potency / 100) * circumference

  return (
    <Card className="border border-border/50 shadow-sm">
      <CardContent className="p-6 flex flex-col items-center">
        <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-4">
          Potency Level
        </p>
        <div className="relative w-32 h-32">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-muted"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="text-primary transition-all duration-500"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl font-bold text-foreground">{potency}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
