import Link from "next/link"
import { Button } from "@/components/ui/button"

export function CtaSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="bg-primary rounded-3xl py-16 px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Ensure every dose protects.
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-md mx-auto">
            Join the network of healthcare providers committed to 100% vaccine integrity.
          </p>
          <Link href="/dashboard">
            <Button className="bg-white text-primary hover:bg-white/90 rounded-full px-8 py-6 text-base font-medium">
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
