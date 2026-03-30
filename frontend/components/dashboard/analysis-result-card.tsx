"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { AlertTriangle, CheckCircle2, AlertCircle, Info } from "lucide-react"

interface AnalysisResultCardProps {
  potency: number
  status: "Safe" | "Use Soon" | "Discard" | "Unknown"
  shelfLife: number | null
  inputSource: "manual" | "csv"
  metadata?: {
    batch_id?: string
    vaccine_brand?: string
  }
  warnings: string[]
}

export function AnalysisResultCard({
  potency,
  status,
  shelfLife,
  inputSource,
  metadata,
  warnings
}: AnalysisResultCardProps) {
  const isUnknown = status === "Unknown"

  // Status-based configuration
  const statusConfig = {
    Safe: {
      label: "Batch is safe to administer",
      badgeClass: "bg-green-100 text-green-700 border-green-200",
      icon: <CheckCircle2 className="w-5 h-5 text-green-600" />,
      potencyColor: "text-emerald-500"
    },
    "Use Soon": {
      label: "Administer as soon as possible",
      badgeClass: "bg-yellow-100 text-yellow-700 border-yellow-200",
      icon: <AlertCircle className="w-5 h-5 text-yellow-600" />,
      potencyColor: "text-amber-500"
    },
    Discard: {
      label: "Do not administer this batch",
      badgeClass: "bg-red-100 text-red-700 border-red-200",
      icon: <AlertTriangle className="w-5 h-5 text-red-600" />,
      potencyColor: "text-rose-500"
    },
    Unknown: {
      label: "Waiting for analysis...",
      badgeClass: "bg-gray-100 text-gray-700 border-gray-200",
      icon: <Info className="w-5 h-5 text-gray-500" />,
      potencyColor: "text-muted/30"
    }
  }

  const currentConfig = statusConfig[status]

  // Potency Circle Logic
  const radius = 45
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = isUnknown ? circumference : circumference - (potency / 100) * circumference

  // Shelf Life Formatting
  const formatShelfLife = (hours: number | null) => {
    if (hours === null) return "Awaiting model"
    if (hours === 0 && status === "Discard") return "Discard immediately"
    return `${hours} hrs`
  }

  return (
    <Card className="border border-border/50 shadow-sm overflow-hidden h-full">
      <CardContent className="p-0 flex flex-col h-full">
        {/* Top Section: Potency & Status */}
        <div className="p-8 flex flex-col items-center border-b border-border/40 bg-muted/5">
          <div className="relative w-40 h-40 mb-6 scale-110">
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-bold text-foreground">
                {isUnknown ? "—" : `${potency}%`}
              </span>
            </div>
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r={radius}
                fill="transparent"
                stroke="currentColor"
                strokeWidth="7"
                className="text-muted/20"
              />
              {!isUnknown && (
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="transparent"
                  stroke="currentColor"
                  strokeWidth="7"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className={cn("transition-all duration-1000 ease-out", currentConfig.potencyColor)}
                />
              )}
            </svg>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <p className="text-sm font-semibold text-foreground">
              {currentConfig.label}
            </p>
            <Badge className={cn("text-sm px-5 py-1 rounded-full font-medium border", currentConfig.badgeClass)}>
              {status}
            </Badge>
          </div>
        </div>

        {/* Middle Section: 3 Stats Row */}
        <div className="grid grid-cols-3 divide-x divide-border/40 py-6 border-b border-border/30">
          <div className="flex flex-col items-center text-center px-2">
            <span className="text-lg font-bold text-foreground">{isUnknown ? "—" : `${potency}%`}</span>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Potency</span>
          </div>
          <div className="flex flex-col items-center text-center px-2">
            <span className="text-lg font-bold text-foreground">{isUnknown ? "—" : formatShelfLife(shelfLife)}</span>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Shelf Life Remaining</span>
          </div>
          <div className="flex flex-col items-center text-center px-2">
            <span className="text-lg font-bold text-foreground">
              {inputSource === "manual" ? "Manual Entry" : "CSV Upload"}
            </span>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Data Source</span>
          </div>
        </div>

        {/* Bottom Section: Metadata */}
        {(metadata?.batch_id || metadata?.vaccine_brand) && !isUnknown && (
          <div className="px-6 py-4 bg-muted/10 flex justify-center gap-12 border-b border-border/30">
            {metadata.batch_id && (
              <div className="flex flex-col items-start">
                <span className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold">Batch ID</span>
                <span className="text-xs font-bold text-foreground">{metadata.batch_id}</span>
              </div>
            )}
            {metadata.vaccine_brand && (
              <div className="flex flex-col items-start">
                <span className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold">Vaccine</span>
                <span className="text-xs font-bold text-foreground">{metadata.vaccine_brand}</span>
              </div>
            )}
          </div>
        )}

        {/* Alerts Section */}
        <div className="p-6 flex-1 min-h-[140px]">
          <p className="text-[10px] font-bold text-foreground uppercase tracking-widest mb-4">Analysis Alerts</p>
          {isUnknown ? (
            <div className="flex items-center gap-2 text-muted-foreground text-xs italic">
              <Info className="w-3.5 h-3.5" />
              <span>Upload data to begin automated integrity analysis</span>
            </div>
          ) : warnings.length > 0 ? (
            <div className="space-y-2.5">
              {warnings.map((warning, i) => {
                const isSystem = warning.toLowerCase().includes("model not loaded")
                return (
                  <div key={i} className="flex items-start gap-2.5">
                    {!isSystem && <AlertTriangle className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" />}
                    <span className={cn(
                      "text-xs leading-relaxed",
                      isSystem ? "text-muted-foreground italic" : "text-foreground font-medium"
                    )}>
                      {warning}
                    </span>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-green-600 text-xs font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Cold chain integrity verified—all parameters within safety limits</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
