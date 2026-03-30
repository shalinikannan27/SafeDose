import Image from "next/image"
import { Thermometer, Package } from "lucide-react"

export function HiddenProblemSection() {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-6">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              The <span className="text-primary underline decoration-primary/30 underline-offset-4">Hidden Problem</span> in<br />
              Vaccine Care
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Most vaccines lose their potency long before they reach the
              patient, often due to invisible factors during transportation and
              storage.
            </p>

            <div className="flex flex-col gap-4 mt-4">
              <div className="flex items-start gap-4">
                <div className="w-1 h-12 bg-red-400 rounded-full" />
                <div>
                  <h4 className="font-semibold text-foreground flex items-center gap-2">
                    <Thermometer className="w-4 h-4 text-red-500" />
                    Thermal Stress:
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Fluctuations in temperature can degrade sensitive biological components instantly.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-1 h-12 bg-primary rounded-full" />
                <div>
                  <h4 className="font-semibold text-foreground flex items-center gap-2">
                    <Package className="w-4 h-4 text-primary" />
                    Physical Stress:
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Rough handling and excessive vibration during transit can lead to molecular damage.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80"
                alt="Vaccine storage refrigerator"
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute bottom-4 left-4 bg-card/95 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-border/50">
              <p className="text-3xl font-bold text-primary">25%</p>
              <p className="text-xs text-muted-foreground max-w-[180px]">
                of vaccines reach their destination with some degree of degradation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
