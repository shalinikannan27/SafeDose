import { AlertCircle } from "lucide-react"

export function HealthBanner() {
  return (
    <div className="bg-red-50 border-b border-red-100 py-3 px-4 flex items-center justify-center gap-3">
      <AlertCircle className="w-5 h-5 text-red-600" />
      <p className="text-sm font-medium text-red-800 text-center">
        Cannot reach the backend API. Run Flask locally or set NEXT_PUBLIC_API_URL (for
        example in Vercel project environment variables).
      </p>
    </div>
  )
}
