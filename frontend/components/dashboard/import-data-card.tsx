"use client"

import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"
import { Spinner } from "@/components/ui/spinner"

interface ImportDataCardProps {
  onFileUpload: (data: FormData) => void
  onSimulation: (type: "safe" | "warning" | "unsafe") => void
  isLoading: boolean
}

export function ImportDataCard({ onFileUpload, onSimulation, isLoading }: ImportDataCardProps) {
  const [dragActive, setDragActive] = useState(false)

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const formDataObj = new FormData()
        formDataObj.append("file", acceptedFiles[0])
        onFileUpload(formDataObj)
      }
    },
    [onFileUpload]
  )

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
      "application/json": [".json"],
    },
    noClick: true,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
  })

  return (
    <Card className="border border-border/50 shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Upload className="w-4 h-4 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground">Import Data</h3>
        </div>

        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
            dragActive ? "border-primary bg-primary/5" : "border-border"
          }`}
        >
          <input {...getInputProps()} />
          <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center mx-auto mb-4">
            <Upload className="w-6 h-6 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium text-foreground mb-1">
            Drag and drop batch data
          </p>
          <p className="text-xs text-muted-foreground mb-4">
            CSV or JSON formats supported
          </p>
          <Button
            onClick={open}
            disabled={isLoading}
            className="bg-muted hover:bg-muted/80 text-foreground rounded-full px-6"
          >
            {isLoading ? <Spinner className="mr-2" /> : null}
            Upload File
          </Button>
        </div>

        <div className="mt-6">
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-3">
            Quick Simulation
          </p>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSimulation("safe")}
              disabled={isLoading}
              className="rounded-full border-green-200 text-green-700 hover:bg-green-50"
            >
              Safe Case
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSimulation("warning")}
              disabled={isLoading}
              className="rounded-full border-yellow-200 bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
            >
              Warning Case
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSimulation("unsafe")}
              disabled={isLoading}
              className="rounded-full border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
            >
              Unsafe Case
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
