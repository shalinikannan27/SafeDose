"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { AnalysisResultCard } from "@/components/dashboard/analysis-result-card"
import { MetricCard } from "@/components/dashboard/metric-card"
import { ActionButtons } from "@/components/dashboard/action-buttons"
import { StepIndicator } from "@/components/dashboard/step-indicator"
import { HealthBanner } from "@/components/dashboard/health-banner"
import { 
  Thermometer, 
  Activity, 
  DoorOpen, 
  Upload, 
  FlaskConical,
  FileUp,
  Droplets,
  Zap,
  Lightbulb,
  Waves
} from "lucide-react"
import { useDropzone } from "react-dropzone"
import { cn } from "@/lib/utils"
import Papa from "papaparse"

interface ManualFormData {
  frac_temp_above_8: number
  handling_stress: number
  hum_std: number
  door_count: number
  temp_max: number
  hum_mean: number
  light_mean_abs: number
  accel_rms: number
  vaccine_brand: string
}

interface PredictionMetadata {
  batch_id?: string
  vaccine_brand?: string
  route?: string
  timestamp?: string
}

interface PredictionResult {
  potency_percentage: number
  status: "Safe" | "Use Soon" | "Discard" | "Unknown"
  shelf_life_hours: number | null
  warnings: string[]
  stats: {
    frac_temp_above_8: number
    handling_stress: number
    hum_std: number
    door_count: number
    temp_max: number
    hum_mean: number
    light_mean_abs: number
    accel_rms: number
  }
  metadata: {
    vaccine_brand?: string
    batch_id?: string
  }
  input_source: "manual" | "csv"
  rows_processed?: number
}

const emptyResult: PredictionResult = {
  potency_percentage: NaN,
  status: "Unknown",
  shelf_life_hours: null,
  warnings: [],
  stats: {
    frac_temp_above_8: 0,
    handling_stress: 0,
    hum_std: 0,
    door_count: 0,
    temp_max: 0,
    hum_mean: 0,
    light_mean_abs: 0,
    accel_rms: 0,
  },
  metadata: {
    vaccine_brand: "",
    batch_id: "",
  },
  input_source: "manual",
}

export default function CheckVaccinePage() {
  const [result, setResult] = useState<PredictionResult>(emptyResult)
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [inputMode, setInputMode] = useState<"file" | "manual">("file")
  const [isBackendDown, setIsBackendDown] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [confirmation, setConfirmation] = useState<{ type: "approve" | "reject" | null, message: string | null }>({ type: null, message: null })
  const [formData, setFormData] = useState<ManualFormData>({
    frac_temp_above_8: 0,
    handling_stress: 0,
    hum_std: 0,
    door_count: 0,
    temp_max: 0,
    hum_mean: 60,
    light_mean_abs: 0,
    accel_rms: 0,
    vaccine_brand: "Gardasil-9",
  })

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await fetch("http://localhost:5000/health")
        if (!response.ok) throw new Error("Backend not ok")
        setIsBackendDown(false)
      } catch (err) {
        setIsBackendDown(true)
      }
    }
    checkHealth()
  }, [])

  const onDrop = async (acceptedFiles: File[], fileRejections: any[]) => {
    if (fileRejections.length > 0) {
      alert(`File rejected: ${fileRejections[0].errors[0].message}`)
      return
    }
    if (acceptedFiles.length === 0) return

    let file = acceptedFiles[0]
    setUploadedFile(file)
    setConfirmation({ type: null, message: null })
    console.log("File accepted for upload:", file.name, file.size, file.type)

    // FIX 4: CSV Brand Mapping with PapaParse
    const brandMap: Record<string, string> = {
      '0': 'Gardasil-9',
      '1': 'Cervarix',
      '2': 'Gardasil-4', 
      '3': 'Cervavac',
      '4': 'Vaxelis'
    }

    const text = await file.text()
    const parsed = Papa.parse(text, { header: true, skipEmptyLines: true })
    
    // 1. Log the detected brand header
    const headers = Object.keys(parsed.data[0] || {})
    const brandHeader = headers.find(h => 
      h.trim().toLowerCase().includes('vaccine_brand') 
      || h.trim().toLowerCase().includes('brand'))
    console.log("Detected brand header:", brandHeader)

    // 2. Log first 3 rows before replacement
    console.log("First 3 rows (BEFORE):", parsed.data.slice(0, 3))

    if (brandHeader) {
      parsed.data.forEach((row: any) => {
        const val = String(row[brandHeader]).trim()
        if (brandMap[val]) row[brandHeader] = brandMap[val]
      })
    }

    // 2. Log first 3 rows after replacement
    console.log("First 3 rows (AFTER):", parsed.data.slice(0, 3))

    const fixedCsv = Papa.unparse(parsed.data)
    file = new File([fixedCsv], file.name, { type: 'text/csv' })

    // 3. Log the final file being sent
    console.log("Final file prepared for submission:", file.name, file.size, "bytes")
    
    const uploadFormData = new FormData()
    uploadFormData.append("file", file)

    setIsLoading(true)
    setCurrentStep(2)

    try {
      const response = await fetch("http://localhost:5000/predict-csv", {
        method: "POST",
        body: uploadFormData,
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.unmapped_features) {
          alert(`Could not read columns: ${data.unmapped_features}\nColumns found: ${data.csv_columns_found}`)
        } else {
          alert(data.error || data.message || "Prediction failed")
        }
        throw new Error(data.error || data.message || "Prediction failed")
      }

      setResult(data)
      setCurrentStep(3)
    } catch (error: any) {
      console.error("Prediction error:", error)
      setCurrentStep(1) 
    } finally {
      setIsLoading(false)
    }
  }

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
      "application/vnd.ms-excel": [".csv"],
      "application/csv": [".csv"],
      "text/x-csv": [".csv"],
    },
    multiple: false,
  })

  const handleInputChange = (field: keyof ManualFormData, value: string | number) => {
    setConfirmation({ type: null, message: null })
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleManualSubmit = async () => {
    setConfirmation({ type: null, message: null })
    setIsLoading(true)
    setCurrentStep(2)

    try {
      const response = await fetch("http://localhost:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        alert(data.error || data.message || "Prediction failed")
        throw new Error(data.error || data.message || "Prediction failed")
      }

      setResult(data)
      setCurrentStep(3)
    } catch (error: any) {
      console.error("Prediction error:", error)
      setCurrentStep(1)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSimulation = (type: "safe" | "warning" | "unsafe") => {
    setCurrentStep(2)
    setTimeout(() => {
      if (type === "safe") {
        setResult({
          potency_percentage: 92,
          status: "Safe",
          shelf_life_hours: 336, // 14 days
          warnings: ["Batch integrity verified"],
          stats: {
            frac_temp_above_8: 0.02,
            handling_stress: 0.8,
            hum_std: 1.5,
            door_count: 2,
            temp_max: 4.2,
            hum_mean: 62,
            light_mean_abs: 350,
            accel_rms: 0.4,
          },
          metadata: {
            vaccine_brand: "Gardasil-9",
            batch_id: "SIM_SAFE_01",
          },
          input_source: "manual",
        })
      } else if (type === "warning") {
        setResult({
          potency_percentage: 68,
          status: "Use Soon",
          shelf_life_hours: 72, // 3 days
          warnings: ["Elevated storage temperature", "Increased handling stress"],
          stats: {
            frac_temp_above_8: 0.15,
            handling_stress: 4.5,
            hum_std: 4.8,
            door_count: 8,
            temp_max: 9.8,
            hum_mean: 55,
            light_mean_abs: 800,
            accel_rms: 1.2,
          },
          metadata: {
            vaccine_brand: "Gardasil-9",
            batch_id: "SIM_WARN_01",
          },
          input_source: "manual",
        })
      } else {
        setResult({
          potency_percentage: 35,
          status: "Discard",
          shelf_life_hours: 0,
          warnings: ["Critical temperature breach", "High physical stress detected"],
          stats: {
            frac_temp_above_8: 0.45,
            handling_stress: 8.5,
            hum_std: 7.2,
            door_count: 15,
            temp_max: 14.5,
            hum_mean: 45,
            light_mean_abs: 1200,
            accel_rms: 3.5,
          },
          metadata: {
            vaccine_brand: "Gardasil-9",
            batch_id: "SIM_DANG_01",
          },
          input_source: "manual",
        })
      }
      setCurrentStep(3)
    }, 1000)
  }

  const handleApprove = () => {
    setConfirmation({
      type: "approve",
      message: "Batch approved — vaccine cleared for administration"
    })
  }

  const handleReject = () => {
    setConfirmation({
      type: "reject",
      message: "Batch rejected — vaccine removed from use"
    })
  }

  return (
    <div className="bg-muted/30 min-h-screen">
      {isBackendDown && <HealthBanner />}
      <div className="py-8">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Vaccine Analysis Dashboard
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Ensure cold chain integrity and dosage safety through advanced real-time telemetry analysis.
            </p>
          </div>

          {/* CHANGE 3: Slim Info Bar Header */}
          {result.status !== "Unknown" && (
            <div className="flex items-center justify-center gap-6 mb-6 py-2 px-6 rounded-full bg-background/50 border border-border/30 text-muted-foreground text-[10px] font-bold uppercase tracking-widest backdrop-blur-sm shadow-sm mx-auto w-fit">
              <div className="flex items-center gap-2">
                <span className="opacity-60">Vaccine:</span>
                <span className="text-foreground">{result.metadata?.vaccine_brand || "Gardasil-9"}</span>
              </div>
              <div className="w-px h-3 bg-border/50" />
              <div className="flex items-center gap-2">
                {result.input_source === "csv" ? (
                  <>
                    <span className="opacity-60">Batch ID:</span>
                    <span className="text-foreground">{result.metadata?.batch_id || "BAG_0047"}</span>
                  </>
                ) : (
                  <span className="text-foreground">Manual Entry</span>
                )}
              </div>
              {result.rows_processed && (
                <>
                  <div className="w-px h-3 bg-border/50" />
                  <div className="flex items-center gap-2">
                    <span className="text-foreground">{result.rows_processed}</span>
                    <span className="opacity-60 text-[9px]">readings analysed</span>
                  </div>
                </>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch mb-8">
            {/* Row 1: Left Column - Import Data */}
            <div className="flex flex-col lg:col-span-1">
              <Card className="border border-border/50 shadow-sm h-full">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Upload className="w-4 h-4 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground">Import Data</h3>
                  </div>

                  <div className="flex gap-2 mb-4">
                    <Button
                      variant={inputMode === "file" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setInputMode("file")}
                      className="flex-1 text-[10px] font-bold uppercase"
                    >
                      <FileUp className="w-3.5 h-3.5 mr-2" />
                      File Upload
                    </Button>
                    <Button
                      variant={inputMode === "manual" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setInputMode("manual")}
                      className="flex-1 text-[10px] font-bold uppercase"
                    >
                      <FlaskConical className="w-3.5 h-3.5 mr-2" />
                      Manual Entry
                    </Button>
                  </div>

                  {inputMode === "file" ? (
                    <>
                      <div
                        {...getRootProps()}
                        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${
                          isDragActive
                            ? "border-primary bg-primary/5"
                            : isDragReject 
                              ? "border-red-500 bg-red-50"
                              : "border-border hover:border-primary/50 hover:bg-muted/20"
                        }`}
                      >
                        <input {...getInputProps()} />
                        <div className="w-10 h-10 mx-auto mb-3 rounded-lg bg-muted flex items-center justify-center">
                          <Upload className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <p className="text-xs font-bold text-foreground mb-1 uppercase tracking-tight">
                          {isDragReject ? "Invalid format" : "Drop logger data"}
                        </p>
                        <Button
                          variant="secondary"
                          size="sm"
                          disabled={isLoading}
                          className="rounded-full mt-2 h-7 text-[9px] font-bold uppercase w-full"
                        >
                          {isLoading ? <Spinner className="mr-2 w-3 h-3" /> : null}
                          Select CSV
                        </Button>
                      </div>
                      {uploadedFile && (
                        <p className="mt-2 text-[10px] text-muted-foreground flex items-center justify-center gap-1 opacity-80 italic animate-in fade-in slide-in-from-top-1 duration-300">
                          <span>📄</span>
                          <span className="truncate max-w-[180px]">{uploadedFile.name}</span>
                          {result.rows_processed && <span>({result.rows_processed.toLocaleString()} rows)</span>}
                        </p>
                      )}
                    </>
                  ) : (
                    <div className="space-y-4">
                      {/* 2-column grid for the 8 metric fields */}
                      <div className="grid grid-cols-2 gap-x-3 gap-y-3">
                        <div className="flex flex-col gap-1">
                          <Label className="text-[10px] text-muted-foreground uppercase font-bold text-nowrap">
                            Fraction above 8°C
                          </Label>
                          <Input
                            type="number"
                            min="0"
                            max="1"
                            step="0.001"
                            placeholder="e.g. 0.05"
                            value={formData.frac_temp_above_8 || ""}
                            onChange={(e) => handleInputChange("frac_temp_above_8", parseFloat(e.target.value) || 0)}
                            className="h-8 text-xs"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <Label className="text-[10px] text-muted-foreground uppercase font-bold text-nowrap">
                            Handling Stress
                          </Label>
                          <Input
                            type="number"
                            step="0.1"
                            placeholder="e.g. 1.2"
                            value={formData.handling_stress || ""}
                            onChange={(e) => handleInputChange("handling_stress", parseFloat(e.target.value) || 0)}
                            className="h-8 text-xs"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <Label className="text-[10px] text-muted-foreground uppercase font-bold text-nowrap">
                            Humidity Std Deviation
                          </Label>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="e.g. 5.1"
                            value={formData.hum_std || ""}
                            onChange={(e) => handleInputChange("hum_std", parseFloat(e.target.value) || 0)}
                            className="h-8 text-xs"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <Label className="text-[10px] text-muted-foreground uppercase font-bold text-nowrap">
                            Door Open Count
                          </Label>
                          <Input
                            type="number"
                            step="1"
                            placeholder="e.g. 4"
                            value={formData.door_count || ""}
                            onChange={(e) => handleInputChange("door_count", parseInt(e.target.value) || 0)}
                            className="h-8 text-xs"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <Label className="text-[10px] text-muted-foreground uppercase font-bold text-nowrap">
                            Max Temperature (°C)
                          </Label>
                          <Input
                            type="number"
                            step="0.1"
                            placeholder="e.g. 9.2"
                            value={formData.temp_max || ""}
                            onChange={(e) => handleInputChange("temp_max", parseFloat(e.target.value) || 0)}
                            className="h-8 text-xs"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <Label className="text-[10px] text-muted-foreground uppercase font-bold text-nowrap">
                            Mean Humidity (%)
                          </Label>
                          <Input
                            type="number"
                            step="0.1"
                            placeholder="e.g. 62.4"
                            value={formData.hum_mean || ""}
                            onChange={(e) => handleInputChange("hum_mean", parseFloat(e.target.value) || 0)}
                            className="h-8 text-xs"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <Label className="text-[10px] text-muted-foreground uppercase font-bold text-nowrap">
                            Light Exposure (lux)
                          </Label>
                          <Input
                            type="number"
                            step="1"
                            placeholder="e.g. 800"
                            value={formData.light_mean_abs || ""}
                            onChange={(e) => handleInputChange("light_mean_abs", parseFloat(e.target.value) || 0)}
                            className="h-8 text-xs"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <Label className="text-[10px] text-muted-foreground uppercase font-bold text-nowrap">
                            Vibration RMS (g-force)
                          </Label>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="e.g. 1.2"
                            value={formData.accel_rms || ""}
                            onChange={(e) => handleInputChange("accel_rms", parseFloat(e.target.value) || 0)}
                            className="h-8 text-xs"
                          />
                        </div>

                        {/* Vaccine Brand dropdown spanning full width */}
                        <div className="flex flex-col gap-1 col-span-2">
                          <Label className="text-[10px] text-muted-foreground uppercase font-bold">Vaccine Brand</Label>
                          <Select
                            value={formData.vaccine_brand}
                            onValueChange={(value) => handleInputChange("vaccine_brand", value)}
                          >
                            <SelectTrigger className="h-8 text-xs">
                              <SelectValue placeholder="Select Brand" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Gardasil-9">Gardasil-9</SelectItem>
                              <SelectItem value="Cervarix">Cervarix</SelectItem>
                              <SelectItem value="Gardasil-4">Gardasil-4</SelectItem>
                              <SelectItem value="Cervavac">Cervavac</SelectItem>
                              <SelectItem value="Vaxelis">Vaxelis</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <Button
                        onClick={handleManualSubmit}
                        disabled={isLoading}
                        className="w-full h-9 text-xs font-bold uppercase tracking-wider"
                      >
                        {isLoading ? <Spinner className="mr-2 w-4 h-4" /> : null}
                        Analyze
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* CHANGE 1: Combined Analysis Result Card (spans 3 columns) */}
            <div className="lg:col-span-3">
              <AnalysisResultCard 
                potency={parseFloat(result.potency_percentage.toFixed(1))}
                status={result.status}
                shelfLife={result.shelf_life_hours}
                inputSource={result.input_source}
                metadata={result.metadata}
                warnings={result.warnings}
              />
            </div>
          </div>

          {/* Row 2: 4x2 Stats Cards Grid with CHANGE 2: Safe Ranges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <MetricCard
              icon={Thermometer}
              label="Max Temp"
              value={result.status !== "Unknown" ? `${result.stats.temp_max.toFixed(1)}°C` : null}
              status={result.status === "Unknown" ? undefined : (result.stats.temp_max <= 8 ? "Optimal" : result.stats.temp_max <= 12 ? "Warning" : "Critical")}
              statusColor={result.status === "Unknown" ? undefined : (result.stats.temp_max <= 8 ? "green" : result.stats.temp_max <= 12 ? "yellow" : "red")}
              safeRange="Safe: ≤ 8°C"
            />
            <MetricCard
              icon={Activity}
              label="Handling Stress"
              value={result.status !== "Unknown" ? `${result.stats.handling_stress.toFixed(1)}` : null}
              subValue={result.status !== "Unknown" ? "/ 10" : ""}
              status={result.status === "Unknown" ? undefined : (result.stats.handling_stress <= 4 ? "Low Risk" : result.stats.handling_stress <= 6 ? "Moderate" : "High Risk")}
              statusColor={result.status === "Unknown" ? undefined : (result.stats.handling_stress <= 4 ? "green" : result.stats.handling_stress <= 6 ? "yellow" : "red")}
              safeRange="Safe: ≤ 4 / 10"
            />
            <MetricCard
              icon={DoorOpen}
              label="Door Count"
              value={result.status !== "Unknown" ? `${result.stats.door_count}` : null}
              status={result.status === "Unknown" ? undefined : (result.stats.door_count <= 3 ? "Low" : result.stats.door_count <= 5 ? "Moderate" : "High")}
              statusColor={result.status === "Unknown" ? undefined : (result.stats.door_count <= 3 ? "green" : result.stats.door_count <= 5 ? "yellow" : "red")}
              safeRange="Safe: ≤ 3 opens"
            />
            <MetricCard
              icon={Waves}
              label="Humidity Std Dev"
              value={result.status !== "Unknown" ? `${result.stats.hum_std.toFixed(1)}` : null}
              status={result.status === "Unknown" ? undefined : (result.stats.hum_std <= 8 ? "Stable" : result.stats.hum_std <= 15 ? "Variable" : "Unstable")}
              statusColor={result.status === "Unknown" ? undefined : (result.stats.hum_std <= 8 ? "green" : result.stats.hum_std <= 15 ? "yellow" : "red")}
              safeRange="Safe: ≤ 8"
            />
            <MetricCard
              icon={Zap}
              label="Time Above 8°C"
              value={result.status !== "Unknown" ? `${(result.stats.frac_temp_above_8 * 100).toFixed(1)}%` : null}
              status={result.status === "Unknown" ? undefined : (result.stats.frac_temp_above_8 <= 0.05 ? "Normal" : result.stats.frac_temp_above_8 <= 0.10 ? "Elevated" : "High")}
              statusColor={result.status === "Unknown" ? undefined : (result.stats.frac_temp_above_8 <= 0.05 ? "green" : result.stats.frac_temp_above_8 <= 0.10 ? "yellow" : "red")}
              safeRange="Safe: ≤ 5%"
            />
            <MetricCard
              icon={Droplets}
              label="Mean Humidity"
              value={result.status !== "Unknown" ? `${result.stats.hum_mean.toFixed(1)}%` : null}
              status={result.status === "Unknown" ? undefined : (result.stats.hum_mean >= 40 && result.stats.hum_mean <= 70 ? "Stable" : "Off-range")}
              statusColor={result.status === "Unknown" ? undefined : (result.stats.hum_mean >= 40 && result.stats.hum_mean <= 70 ? "green" : "yellow")}
              safeRange="Safe: 40–70%"
            />
            <MetricCard
              icon={Lightbulb}
              label="Light Exposure"
              value={result.status !== "Unknown" ? `${result.stats.light_mean_abs.toFixed(0)} lx` : null}
              status={result.status === "Unknown" ? undefined : (result.stats.light_mean_abs <= 50 ? "Minimal" : result.stats.light_mean_abs <= 1000 ? "Caution" : "Extreme")}
              statusColor={result.status === "Unknown" ? undefined : (result.stats.light_mean_abs <= 50 ? "green" : result.stats.light_mean_abs <= 1000 ? "yellow" : "red")}
              safeRange="Safe: ≤ 50 lux"
            />
            <MetricCard
              icon={Activity}
              label="Vibration RMS"
              value={result.status !== "Unknown" ? `${result.stats.accel_rms.toFixed(2)}g` : null}
              status={result.status === "Unknown" ? undefined : (result.stats.accel_rms <= 2 ? "Stable" : result.stats.accel_rms <= 3 ? "Bumpy" : "Critical")}
              statusColor={result.status === "Unknown" ? undefined : (result.stats.accel_rms <= 2 ? "green" : result.stats.accel_rms <= 3 ? "yellow" : "red")}
              safeRange="Safe: ≤ 2g"
            />
          </div>

          {/* Action Buttons */}
          <div className="mt-8">
            <ActionButtons 
              status={result.status} 
              onApprove={handleApprove}
              onReject={handleReject}
              disabled={confirmation.type !== null}
              confirmation={confirmation}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
