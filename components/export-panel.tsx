"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Download, Share2, Printer } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ExportPanelProps {
  language: string
}

export function ExportPanel({ language }: ExportPanelProps) {
  const [history, setHistory] = useState<any[]>([])
  const [selectedFormat, setSelectedFormat] = useState("json")
  const [exportData, setExportData] = useState("")
  const [message, setMessage] = useState("")

  const translations = {
    es: {
      title: "Exportar Cálculos",
      format: "Formato de exportación",
      preview: "Vista previa",
      download: "Descargar",
      share: "Compartir",
      print: "Imprimir",
      noData: "No hay datos para exportar",
      exported: "Datos exportados exitosamente",
      copied: "Enlace copiado al portapapeles",
    },
    en: {
      title: "Export Calculations",
      format: "Export format",
      preview: "Preview",
      download: "Download",
      share: "Share",
      print: "Print",
      noData: "No data to export",
      exported: "Data exported successfully",
      copied: "Link copied to clipboard",
    },
  }

  const t = translations[language as keyof typeof translations]

  useEffect(() => {
    const savedHistory = localStorage.getItem("newton-raphson-history")
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory))
    }
  }, [])

  useEffect(() => {
    generateExportData()
  }, [selectedFormat, history])

  const generateExportData = () => {
    if (history.length === 0) {
      setExportData("")
      return
    }

    switch (selectedFormat) {
      case "json":
        setExportData(JSON.stringify(history, null, 2))
        break
      case "csv":
        const csvHeader = "Function,Initial Value,Root,Iterations,Converged,Timestamp\n"
        const csvData = history
          .map(
            (item) =>
              `"${item.function}",${item.initialValue},${item.result?.root || "N/A"},${item.result?.iterations || 0},${item.result?.converged || false},"${item.timestamp}"`,
          )
          .join("\n")
        setExportData(csvHeader + csvData)
        break
      case "txt":
        const txtData = history
          .map(
            (item, index) =>
              `Calculation ${index + 1}:\n` +
              `Function: ${item.function}\n` +
              `Initial Value: ${item.initialValue}\n` +
              `Result: ${item.result?.converged ? item.result.root?.toFixed(6) : "Did not converge"}\n` +
              `Iterations: ${item.result?.iterations || 0}\n` +
              `Date: ${new Date(item.timestamp).toLocaleString()}\n` +
              `${"=".repeat(50)}\n`,
          )
          .join("\n")
        setExportData(txtData)
        break
    }
  }

  const handleDownload = () => {
    if (!exportData) return

    const blob = new Blob([exportData], {
      type: selectedFormat === "json" ? "application/json" : selectedFormat === "csv" ? "text/csv" : "text/plain",
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `newton-raphson-calculations.${selectedFormat}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    setMessage(t.exported)
    setTimeout(() => setMessage(""), 3000)
  }

  const handleShare = async () => {
    if (navigator.share && exportData) {
      try {
        await navigator.share({
          title: "Newton-Raphson Calculations",
          text: exportData,
        })
      } catch (err) {
        // Fallback to clipboard
        navigator.clipboard.writeText(exportData)
        setMessage(t.copied)
        setTimeout(() => setMessage(""), 3000)
      }
    } else if (exportData) {
      navigator.clipboard.writeText(exportData)
      setMessage(t.copied)
      setTimeout(() => setMessage(""), 3000)
    }
  }

  const handlePrint = () => {
    if (!exportData) return

    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Newton-Raphson Calculations</title>
            <style>
              body { font-family: monospace; margin: 20px; }
              pre { white-space: pre-wrap; }
            </style>
          </head>
          <body>
            <h1>Newton-Raphson Calculations</h1>
            <pre>${exportData}</pre>
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            {t.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {history.length === 0 ? (
            <Alert>
              <AlertDescription>{t.noData}</AlertDescription>
            </Alert>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="format">{t.format}</Label>
                <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="json">JSON</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="txt">TXT</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="preview">{t.preview}</Label>
                <Textarea id="preview" value={exportData} readOnly className="h-64 font-mono text-sm" />
              </div>

              <div className="flex gap-4">
                <Button onClick={handleDownload} className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  {t.download}
                </Button>
                <Button variant="outline" onClick={handleShare} className="flex-1">
                  <Share2 className="h-4 w-4 mr-2" />
                  {t.share}
                </Button>
                <Button variant="outline" onClick={handlePrint} className="flex-1">
                  <Printer className="h-4 w-4 mr-2" />
                  {t.print}
                </Button>
              </div>

              {message && (
                <Alert>
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
