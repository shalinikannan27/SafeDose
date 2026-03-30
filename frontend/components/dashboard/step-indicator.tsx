import { Card, CardContent } from "@/components/ui/card"

interface StepIndicatorProps {
  currentStep: number
}

const steps = [
  { number: 1, label: "UPLOAD" },
  { number: 2, label: "PROCESS" },
  { number: 3, label: "RESULTS" },
]

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <Card className="border border-border/50 shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    currentStep >= step.number
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step.number}
                </div>
                <p
                  className={`text-xs mt-2 font-medium ${
                    currentStep >= step.number
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  {step.label}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-12 h-0.5 mx-2 ${
                    currentStep > step.number ? "bg-primary" : "bg-muted"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
