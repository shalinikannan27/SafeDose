import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  Thermometer,
  Activity,
  BarChart3,
  Shield,
  Clock,
  FileCheck,
  Bell,
  Database,
  CheckCircle,
  AlertTriangle,
  XCircle,
} from "lucide-react"

const features = [
  {
    icon: Thermometer,
    title: "Temperature Monitoring",
    description:
      "Real-time tracking of storage temperatures with instant alerts when thresholds are exceeded. Ensures cold chain integrity throughout the vaccine lifecycle.",
  },
  {
    icon: Activity,
    title: "Handling Stress Analysis",
    description:
      "Advanced sensors detect vibration, shock, and physical stress during transportation. Identifies potential damage before it affects vaccine potency.",
  },
  {
    icon: BarChart3,
    title: "Strength Score Algorithm",
    description:
      "Our proprietary algorithm calculates a real-time potency score based on multiple environmental factors and the entire lifecycle of each dose.",
  },
  {
    icon: Clock,
    title: "Shelf Life Prediction",
    description:
      "AI-powered predictions of remaining shelf life based on storage conditions. Helps prioritize vaccine usage and minimize waste.",
  },
  {
    icon: Shield,
    title: "Batch Integrity Verification",
    description:
      "Comprehensive verification of entire vaccine batches. Ensures consistency and safety across all doses in a shipment.",
  },
  {
    icon: FileCheck,
    title: "Compliance Reporting",
    description:
      "Automated generation of compliance reports for regulatory requirements. Maintains complete audit trails for every vaccine dose.",
  },
  {
    icon: Bell,
    title: "Smart Alerts",
    description:
      "Configurable alert system for temperature excursions, handling events, and expiration warnings. Never miss a critical event.",
  },
  {
    icon: Database,
    title: "Data Integration",
    description:
      "Seamless integration with existing healthcare systems and vaccine management platforms. Import and export data in multiple formats.",
  },
]

export default function FeaturesPage() {
  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Platform Features
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive tools for ensuring vaccine safety and potency at every step of the supply chain.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border border-border/50 hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Decision Output Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground text-center mb-4">
              Clear Decision Output
            </h2>
            <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
              No more guessing. SafeDose provides immediate, actionable status for healthcare providers at the point of care.
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border border-green-200 bg-green-50/50">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-xl text-green-700 mb-2">Safe</h3>
                  <p className="text-sm text-green-600/80">
                    Vaccine has maintained proper conditions throughout its lifecycle. Safe for administration.
                  </p>
                </CardContent>
              </Card>

              <Card className="border border-yellow-200 bg-yellow-50/50">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-yellow-100 flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="w-8 h-8 text-yellow-600" />
                  </div>
                  <h3 className="font-semibold text-xl text-yellow-700 mb-2">Caution</h3>
                  <p className="text-sm text-yellow-600/80">
                    Minor deviations detected. Review detailed analysis before proceeding with administration.
                  </p>
                </CardContent>
              </Card>

              <Card className="border border-red-200 bg-red-50/50">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center mx-auto mb-4">
                    <XCircle className="w-8 h-8 text-red-600" />
                  </div>
                  <h3 className="font-semibold text-xl text-red-700 mb-2">Unsafe</h3>
                  <p className="text-sm text-red-600/80">
                    Critical issues detected. Do not administer. Quarantine batch for proper disposal.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">
            How It Works
          </h2>
          <div className="max-w-3xl mx-auto">
            <div className="flex flex-col gap-8">
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold shrink-0">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-foreground mb-2">Upload Data</h3>
                  <p className="text-muted-foreground">
                    Import your vaccine batch data via CSV, JSON, or direct API integration. Our system accepts data from various cold chain monitoring devices.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold shrink-0">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-foreground mb-2">AI Analysis</h3>
                  <p className="text-muted-foreground">
                    Our advanced algorithms analyze temperature history, handling stress, storage duration, and other factors to calculate potency scores.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold shrink-0">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-foreground mb-2">Get Results</h3>
                  <p className="text-muted-foreground">
                    Receive clear, actionable results with detailed breakdowns. Make informed decisions about vaccine administration with confidence.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="bg-primary rounded-3xl py-16 px-8 text-center">
            <h2 className="text-3xl font-bold text-primary-foreground mb-4">
              Ready to get started?
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-md mx-auto">
              Start analyzing your vaccine batches today with our easy-to-use dashboard.
            </p>
            <Link href="/dashboard">
              <Button className="bg-white text-primary hover:bg-white/90 rounded-full px-8 py-6 text-base font-medium">
                Go to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
