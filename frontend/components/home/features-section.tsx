import { Card, CardContent } from "@/components/ui/card"
import { BarChart3, Activity, CheckCircle, AlertTriangle, XCircle } from "lucide-react"

export function FeaturesSection() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Precision Monitoring Features
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            We combine advanced data points to provide a comprehensive health check for every single vial.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Strength Score System Card */}
          <Card className="border border-border/50 shadow-sm">
            <CardContent className="p-6">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <BarChart3 className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-lg text-foreground mb-2">
                Strength Score System
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                Our proprietary algorithm calculates a real-time &quot;Strength Score&quot; based on the entire lifecycle of the vaccine dose.
              </p>
              {/* Bar chart visualization */}
              <div className="flex items-end gap-2 h-24">
                <div className="w-8 bg-primary/20 rounded-t h-8" />
                <div className="w-8 bg-primary/40 rounded-t h-12" />
                <div className="w-8 bg-primary/60 rounded-t h-16" />
                <div className="w-8 bg-primary rounded-t h-20" />
                <div className="w-8 bg-primary rounded-t h-24" />
              </div>
            </CardContent>
          </Card>

          {/* Multi-factor Damage Analysis Card */}
          <Card className="border border-border/50 shadow-sm bg-primary/5">
            <CardContent className="p-6 flex flex-col items-center justify-center h-full text-center">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                <Activity className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg text-foreground mb-2">
                Multi-factor Damage Analysis
              </h3>
              <p className="text-sm text-muted-foreground">
                Continuous tracking of temperature spikes and handling stress to detect micro-vial fractures or protein denaturation.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Clear Decision Output */}
        <Card className="border border-border/50 shadow-sm mt-6 max-w-4xl mx-auto">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="font-semibold text-lg text-foreground mb-2">
                  Clear Decision Output
                </h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  No more guessing. We provide immediate actionable status for healthcare providers at the point of care.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center">
                    <CheckCircle className="w-7 h-7 text-green-600" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">SAFE</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-14 h-14 rounded-xl bg-yellow-100 flex items-center justify-center">
                    <AlertTriangle className="w-7 h-7 text-yellow-600" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">CAUTION</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-14 h-14 rounded-xl bg-red-100 flex items-center justify-center">
                    <XCircle className="w-7 h-7 text-red-600" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">UNSAFE</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
