"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { History, Trash2, Eye } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface HistoryPanelProps {
  language: string
}

export function HistoryPanel({ language }: HistoryPanelProps) {
  const [history, setHistory] = useState<any[]>([])

  const translations = {
    es: {
      title: "Historial de Cálculos",
      noHistory: "No hay cálculos guardados",
      function: "Función",
      initialValue: "Valor inicial",
      result: "Resultado",
      iterations: "Iteraciones",
      converged: "Convergió",
      failed: "Falló",
      view: "Ver detalles",
      clear: "Limpiar historial",
      delete: "Eliminar",
      timestamp: "Fecha y hora",
    },
    en: {
      title: "Calculation History",
      noHistory: "No saved calculations",
      function: "Function",
      initialValue: "Initial value",
      result: "Result",
      iterations: "Iterations",
      converged: "Converged",
      failed: "Failed",
      view: "View details",
      clear: "Clear history",
      delete: "Delete",
      timestamp: "Date and time",
    },
  }

  const t = translations[language as keyof typeof translations]

  useEffect(() => {
    const savedHistory = localStorage.getItem("newton-raphson-history")
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory))
    }
  }, [])

  const clearHistory = () => {
    setHistory([])
    localStorage.removeItem("newton-raphson-history")
  }

  const deleteItem = (id: number) => {
    const newHistory = history.filter((item) => item.id !== id)
    setHistory(newHistory)
    localStorage.setItem("newton-raphson-history", JSON.stringify(newHistory))
  }

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString(language === "es" ? "es-ES" : "en-US")
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            {t.title}
          </CardTitle>
          {history.length > 0 && (
            <Button variant="outline" size="sm" onClick={clearHistory}>
              <Trash2 className="h-4 w-4 mr-2" />
              {t.clear}
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {history.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400 py-8">
              <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>{t.noHistory}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((item, index) => (
                <Card key={item.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="font-mono text-sm bg-gray-100 dark:bg-gray-800 p-2 rounded mb-2">
                          f(x) = {item.function}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {t.timestamp}: {formatDate(item.timestamp)}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={item.result?.converged ? "default" : "destructive"}>
                          {item.result?.converged ? t.converged : t.failed}
                        </Badge>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              {t.view}
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>
                                {t.function}: {item.function}
                              </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <strong>{t.initialValue}:</strong> {item.initialValue}
                                </div>
                                <div>
                                  <strong>{t.iterations}:</strong> {item.result?.iterations || 0}
                                </div>
                              </div>
                              {item.result?.converged && (
                                <div>
                                  <strong>{t.result}:</strong> {item.result.root?.toFixed(6)}
                                </div>
                              )}
                              {item.result?.steps && (
                                <div>
                                  <strong>Pasos:</strong>
                                  <div className="max-h-64 overflow-y-auto mt-2 space-y-2">
                                    {item.result.steps.map((step: any, stepIndex: number) => (
                                      <div
                                        key={stepIndex}
                                        className="p-2 bg-gray-50 dark:bg-gray-800 rounded text-sm font-mono"
                                      >
                                        <div>
                                          x₍{stepIndex}₎ = {step.x?.toFixed(6)}
                                        </div>
                                        <div>
                                          f(x₍{stepIndex}₎) = {step.fx?.toFixed(6)}
                                        </div>
                                        <div>
                                          f'(x₍{stepIndex}₎) = {step.fpx?.toFixed(6)}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button variant="outline" size="sm" onClick={() => deleteItem(item.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">{t.initialValue}:</span>
                        <div className="font-semibold">{item.initialValue}</div>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">{t.iterations}:</span>
                        <div className="font-semibold">{item.result?.iterations || 0}</div>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">{t.result}:</span>
                        <div className="font-semibold">
                          {item.result?.converged ? item.result.root?.toFixed(6) : "N/A"}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
