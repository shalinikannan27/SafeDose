import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ShieldCheck, Heart, Users, BookOpen, AlertCircle, Syringe } from "lucide-react"

export default function AwarenessPage() {
  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            HPV Awareness
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Understanding HPV and the importance of vaccination in preventing cervical cancer and other HPV-related diseases.
          </p>
        </div>
      </section>

      {/* What is HPV */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-4">
                What is HPV?
              </h2>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Human Papillomavirus (HPV) is one of the most common sexually transmitted infections worldwide. There are more than 100 types of HPV, and at least 14 of them can cause cancer.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Most HPV infections do not cause symptoms and resolve on their own. However, persistent infection with high-risk HPV types can lead to cervical cancer, as well as cancers of the throat, anus, penis, vagina, and vulva.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card className="border border-border/50">
                <CardContent className="p-6 text-center">
                  <p className="text-4xl font-bold text-primary">80%</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    of people will be infected with HPV at some point
                  </p>
                </CardContent>
              </Card>
              <Card className="border border-border/50">
                <CardContent className="p-6 text-center">
                  <p className="text-4xl font-bold text-primary">99%</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    of cervical cancers are caused by HPV
                  </p>
                </CardContent>
              </Card>
              <Card className="border border-border/50">
                <CardContent className="p-6 text-center">
                  <p className="text-4xl font-bold text-primary">570K</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    new cervical cancer cases annually worldwide
                  </p>
                </CardContent>
              </Card>
              <Card className="border border-border/50">
                <CardContent className="p-6 text-center">
                  <p className="text-4xl font-bold text-primary">311K</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    deaths from cervical cancer each year
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Why Vaccination Matters */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">
            Why HPV Vaccination Matters
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border border-border/50">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <ShieldCheck className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg text-foreground mb-2">Prevention is Key</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  The HPV vaccine is most effective when given before exposure to the virus. Vaccination can prevent up to 90% of HPV-related cancers.
                </p>
              </CardContent>
            </Card>
            <Card className="border border-border/50">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg text-foreground mb-2">Long-lasting Protection</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Studies show that HPV vaccines provide long-lasting protection. The immune response from vaccination remains strong for many years.
                </p>
              </CardContent>
            </Card>
            <Card className="border border-border/50">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg text-foreground mb-2">Community Protection</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  When more people are vaccinated, the spread of HPV decreases, protecting even those who cannot be vaccinated.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Vaccine Safety */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                <Syringe className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-foreground">
                Vaccine Safety
              </h2>
            </div>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              HPV vaccines have been extensively studied and monitored. They have been shown to be safe and effective in preventing HPV infections and related diseases.
            </p>
            <div className="bg-muted/50 rounded-xl p-6 border border-border/50">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Important Note</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Like all vaccines, HPV vaccines must be stored and handled properly to maintain their effectiveness. SafeDose helps ensure every dose maintains its full protective potential.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Resources */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">
            Learn More
          </h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card className="border border-border/50">
              <CardContent className="p-6">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <BookOpen className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">WHO Guidelines</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Access comprehensive information about HPV vaccination from the World Health Organization.
                </p>
                <Button variant="outline" className="rounded-full" asChild>
                  <a href="https://www.who.int/health-topics/cervical-cancer" target="_blank" rel="noopener noreferrer">
                    Visit WHO
                  </a>
                </Button>
              </CardContent>
            </Card>
            <Card className="border border-border/50">
              <CardContent className="p-6">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <BookOpen className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">CDC Resources</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Find detailed information about HPV vaccines, schedules, and recommendations from the CDC.
                </p>
                <Button variant="outline" className="rounded-full" asChild>
                  <a href="https://www.cdc.gov/hpv/index.html" target="_blank" rel="noopener noreferrer">
                    Visit CDC
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="bg-primary rounded-3xl py-16 px-8 text-center">
            <h2 className="text-3xl font-bold text-primary-foreground mb-4">
              Ready to ensure vaccine safety?
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-md mx-auto">
              Use SafeDose to verify the integrity of every vaccine dose before administration.
            </p>
            <Link href="/check-vaccine">
              <Button className="bg-white text-primary hover:bg-white/90 rounded-full px-8 py-6 text-base font-medium">
                Check Vaccine
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
