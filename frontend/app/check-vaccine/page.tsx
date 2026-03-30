"use client"

import { useState } from "react"
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
import { PotencyGauge } from "@/components/dashboard/potency-gauge"
import { AnalysisStatusCard } from "@/components/dashboard/analysis-status-card"
import { ShelfLifeCard } from "@/components/dashboard/shelf-life-card"
import { MetricCard } from "@/components/dashboard/metric-card"
import { VaccineStrengthBar } from "@/components/dashboard/vaccine-strength-bar"
import { ActionButtons } from "@/components/dashboard/action-buttons"
import { StepIndicator } from "@/components/dashboard/step-indicator"
import { 
  Thermometer, 
  Activity, 
  DoorOpen, 
  Upload, 
  FlaskConical,
  FileUp
} from "lucide-react"
import { useDropzone } from "react-dropzone"

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

const defaultResult: PredictionResult = {
  potency_percentage: 85,
  status: "Safe",
  shelf_life_hours: 120,
  warnings: ["Batch integrity verified"],
  stats: {
    frac_temp_above_8: 0.05,
    handling_stress: 1.2,
    hum_std: 2.8,
    door_count: 4,
    temp_max: 5.2,
    hum_mean: 60,
    light_mean_abs: 400,
    accel_rms: 0.8,
  },
  metadata: {
    vaccine_brand: "Gardasil-9",
    batch_id: "BAG_0001",
  },
  input_source: "manual",
}

export default function CheckVaccinePage() {
  const [result, setResult] = useState<PredictionResult>(defaultResult)
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [inputMode, setInputMode] = useState<"file" | "manual">("file")
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

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return

    const file = acceptedFiles[0]
    
    // 30MB File Size Check
    if (file.size > 30 * 1024 * 1024) {
      alert("File too large. Maximum size is 30MB.")
      return
    }
    
    // CSV Extension Check
    if (!file.name.endsWith(".csv")) {
      alert("Only CSV files are accepted.")
      return
    }

    const formData = new FormData()
    formData.append("file", file)

    setIsLoading(true)
    setCurrentStep(2)

    try {
      const response = await fetch("http://localhost:5000/predict-csv", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.unmapped_features) {
          alert(`Could not read CSV columns: ${data.unmapped_features}. Please check your file format.`)
        } else {
          alert(data.error || "Prediction failed")
        }
        throw new Error(data.error || "Prediction failed")
      }

      setResult(data)
      setCurrentStep(3)
    } catch (error) {
      console.error("Prediction error:", error)
      // Stay on step 2 if failed, or show error state
      setCurrentStep(1) 
    } finally {
      setIsLoading(false)
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
      "application/json": [".json"],
    },
    multiple: false,
  })

  const handleInputChange = (field: keyof ManualFormData, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleManualSubmit = async () => {
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
        alert(data.message || "Prediction failed")
        throw new Error(data.message || "Prediction failed")
      }

      setResult(data)
      setCurrentStep(3)
    } catch (error) {
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

  return (
    <div className="bg-muted/30 min-h-screen py-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Vaccine Analysis Dashboard
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            Ensure cold chain integrity and dosage safety through advanced real-time telemetry analysis.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-6">
          {/* Left Column - Import Data */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <Card className="border border-border/50 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Upload className="w-4 h-4 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground">Import Data</h3>
                </div>

                {/* Input Mode Toggle */}
                <div className="flex gap-2 mb-4">
                  <Button
                    variant={inputMode === "file" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setInputMode("file")}
                    className="flex-1"
                  >
                    <FileUp className="w-4 h-4 mr-2" />
                    File Upload
                  </Button>
                  <Button
                    variant={inputMode === "manual" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setInputMode("manual")}
                    className="flex-1"
                  >
                    <FlaskConical className="w-4 h-4 mr-2" />
                    Manual Entry
                  </Button>
                </div>

                {inputMode === "file" ? (
                  <>
                    {/* File Upload Area */}
                    <div
                      {...getRootProps()}
                      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                        isDragActive
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <input {...getInputProps()} />
                      <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-muted flex items-center justify-center">
                        <Upload className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <p className="text-sm font-medium text-foreground mb-1">
                        Drag and drop batch data
                      </p>
                      <p className="text-xs text-muted-foreground mb-3">
                        CSV or JSON formats supported
                      </p>
                      <Button
                        variant="secondary"
                        size="sm"
                        disabled={isLoading}
                        className="rounded-full"
                      >
                        {isLoading ? <Spinner className="mr-2 w-4 h-4" /> : null}
                        Upload File
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Manual Entry Form */}
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1">
                          <Label className="text-xs text-foreground font-medium">Fraction above 8°C</Label>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            max="1"
                            placeholder="0.0 to 1.0"
                            value={formData.frac_temp_above_8 || ""}
                            onChange={(e) => handleInputChange("frac_temp_above_8", parseFloat(e.target.value) || 0)}
                            className="h-9"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <Label className="text-xs text-foreground font-medium">Handling Stress</Label>
                          <Input
                            type="number"
                            step="0.1"
                            min="0"
                            max="10"
                            placeholder="0 to 10"
                            value={formData.handling_stress || ""}
                            onChange={(e) => handleInputChange("handling_stress", parseFloat(e.target.value) || 0)}
                            className="h-9"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1">
                          <Label className="text-xs text-foreground font-medium">Humidity Std</Label>
                          <Input
                            type="number"
                            step="0.1"
                            placeholder="Std deviation"
                            value={formData.hum_std || ""}
                            onChange={(e) => handleInputChange("hum_std", parseFloat(e.target.value) || 0)}
                            className="h-9"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <Label className="text-xs text-foreground font-medium">Door Count</Label>
                          <Input
                            type="number"
                            step="1"
                            min="0"
                            placeholder="Integer"
                            value={formData.door_count || ""}
                            onChange={(e) => handleInputChange("door_count", parseInt(e.target.value) || 0)}
                            className="h-9"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1">
                          <Label className="text-xs text-foreground font-medium">Max Temp (°C)</Label>
                          <Input
                            type="number"
                            step="0.1"
                            placeholder="Max temp"
                            value={formData.temp_max || ""}
                            onChange={(e) => handleInputChange("temp_max", parseFloat(e.target.value) || 0)}
                            className="h-9"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <Label className="text-xs text-foreground font-medium">Humidity Mean (%)</Label>
                          <Input
                            type="number"
                            step="0.1"
                            placeholder="Mean hum"
                            value={formData.hum_mean || ""}
                            onChange={(e) => handleInputChange("hum_mean", parseFloat(e.target.value) || 0)}
                            className="h-9"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1">
                          <Label className="text-xs text-foreground font-medium">Light Mean (lux)</Label>
                          <Input
                            type="number"
                            step="1"
                            placeholder="Abs light"
                            value={formData.light_mean_abs || ""}
                            onChange={(e) => handleInputChange("light_mean_abs", parseFloat(e.target.value) || 0)}
                            className="h-9"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <Label className="text-xs text-foreground font-medium">Accel RMS (g)</Label>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            max="5"
                            placeholder="0–5 g"
                            value={formData.accel_rms || ""}
                            onChange={(e) => handleInputChange("accel_rms", parseFloat(e.target.value) || 0)}
                            className="h-9"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <Label className="text-xs text-foreground font-medium">Vaccine Brand</Label>
                        <Select
                          value={formData.vaccine_brand}
                          onValueChange={(value) => handleInputChange("vaccine_brand", value)}
                        >
                          <SelectTrigger className="h-9">
                            <SelectValue />
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

                      <Button
                        onClick={handleManualSubmit}
                        disabled={isLoading}
                        className="w-full mt-2"
                      >
                        {isLoading ? <Spinner className="mr-2 w-4 h-4" /> : null}
                        Run Potency Check
                      </Button>
                    </div>
                  </>
                )}

                {/* Quick Simulation */}
                <div className="mt-4 pt-4 border-t border-border/50">
                  <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                    Quick Simulation
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSimulation("safe")}
                      disabled={isLoading}
                      className="flex-1 text-xs"
                    >
                      Safe Case
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSimulation("warning")}
                      disabled={isLoading}
                      className="flex-1 text-xs bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100"
                    >
                      Warning Case
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSimulation("unsafe")}
                      disabled={isLoading}
                      className="flex-1 text-xs bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
                    >
                      Unsafe Case
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <StepIndicator currentStep={currentStep} />
          </div>

          {/* Middle Column - Potency + Metrics */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <PotencyGauge potency={result.potency_percentage || 0} />
            <div className="grid grid-cols-2 gap-4">
              <MetricCard
                icon={Thermometer}
                label="Max Temperature"
                value={result.stats.temp_max !== null ? `${result.stats.temp_max}°C` : "--"}
                status={result.stats.temp_max > 8 ? "High" : "Optimal"}
                statusColor={result.stats.temp_max > 8 ? "red" : "green"}
              />
              <MetricCard
                icon={Activity}
                label="Handling Stress"
                value={`${result.stats.handling_stress}`}
                subValue="/ 10"
                status={result.stats.handling_stress < 3 ? "Low Risk" : result.stats.handling_stress < 7 ? "Medium Risk" : "High Risk"}
                statusColor={result.stats.handling_stress < 3 ? "green" : result.stats.handling_stress < 7 ? "yellow" : "red"}
                progressValue={result.stats.handling_stress * 10}
                progressColor={result.stats.handling_stress < 3 ? "green" : result.stats.handling_stress < 7 ? "yellow" : "red"}
              />
            </div>
          </div>

          {/* Right Column - Status Cards */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="grid grid-cols-2 gap-4">
              <AnalysisStatusCard
                status={result.status}
                message={result.warnings.length > 0 ? result.warnings[0] : "All parameters within range"}
                batchId={result.metadata?.batch_id}
              />
              <ShelfLifeCard
                hours={result.shelf_life_hours}
              />
            </div>
            <MetricCard
              icon={DoorOpen}
              label="Door Open Count"
              value={`${result.stats.door_count} Times`}
              showDoorIndicator
              doorCount={result.stats.door_count}
            />
            
            {/* Warnings List */}
            {result.warnings.length > 0 && (
              <Card className="border-border/50 bg-background">
                <CardContent className="p-4">
                  <p className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2">Analysis Alerts</p>
                  <ul className="space-y-1">
                    {result.warnings.map((warning, i) => {
                      const isSystemMsg = warning.toLowerCase().includes("model not loaded")
                      return (
                        <li key={i} className={`text-xs flex items-start gap-2 ${isSystemMsg ? "text-muted-foreground bg-muted/30 p-1.5 rounded" : "text-red-600"}`}>
                          {!isSystemMsg && <span className="mt-1 w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />}
                          {warning}
                        </li>
                      )
                    })}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* CSV Info */}
            {result.input_source === "csv" && result.rows_processed && (
              <Card className="border-blue-100 bg-blue-50/50">
                <CardContent className="p-4 flex items-center justify-between">
                  <span className="text-xs font-medium text-blue-700">Data Processed</span>
                  <span className="text-xs font-bold text-blue-800">{result.rows_processed} readings</span>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-end">
          <ActionButtons status={result.status === "Safe" ? "Safe" : result.status === "Discard" ? "Unsafe" : "Warning"} />
        </div>
      </div>
    </div>
  )
}
