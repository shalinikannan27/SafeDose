import { Card, CardContent } from "@/components/ui/card"
import { ShieldAlert, Shield, Droplets } from "lucide-react"

const cards = [
  {
    icon: ShieldAlert,
    title: "Cervical Cancer Risk",
    description:
      "HPV is a leading cause of cervical cancer globally, claiming thousands of lives that could be saved through prevention.",
    iconBg: "bg-red-50",
    iconColor: "text-red-500",
  },
  {
    icon: Shield,
    title: "Strong Protection",
    description:
      "Early vaccination provides the strongest immune response, offering long-term protection before exposure occurs.",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
  },
  {
    icon: Droplets,
    title: "Preserved Potency",
    description:
      "Vaccine effectiveness must be preserved through strict monitoring. A compromised dose is a missed opportunity for protection.",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
  },
]

export function WhyHpvSection() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
          Why HPV Vaccination Matters
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {cards.map((card, index) => (
            <Card key={index} className="border border-border/50 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex flex-col gap-4">
                <div className={`w-12 h-12 rounded-lg ${card.iconBg} flex items-center justify-center`}>
                  <card.icon className={`w-6 h-6 ${card.iconColor}`} />
                </div>
                <h3 className="font-semibold text-lg text-foreground">{card.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {card.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
