import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative bg-background py-12 md:py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div className="flex flex-col gap-6">
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
              ENSURING EVERY HPV VACCINE DOSE IS SAFE AND EFFECTIVE
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-foreground">
              Protect Every Girl with{" "}
              <span className="text-primary italic">Safe Vaccines</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-lg leading-relaxed">
              SafeDose analyzes vaccine transport conditions such as temperature
              and handling to ensure every dose provides full protection.
            </p>
            <div className="flex flex-wrap gap-4 mt-2">
              <Link href="/dashboard">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 py-6 text-base">
                  Get Started
                </Button>
              </Link>
              <Link href="/awareness">
                <Button variant="outline" className="rounded-full px-8 py-6 text-base border-foreground/20">
                  Learn About HPV
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md aspect-square rounded-3xl overflow-hidden">
              <Image
                src="/images/smiling-women.png"
                alt="A group of smiling women and healthcare professionals"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
