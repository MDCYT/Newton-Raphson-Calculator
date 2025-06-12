"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { BookOpen, RatioIcon as Formula, Target, AlertTriangle } from "lucide-react"

interface TheorySectionProps {
  language: string
}

export function TheorySection({ language }: TheorySectionProps) {
  const content = {
    es: {
      title: "Teoría del Método Newton-Raphson",
      introduction: {
        title: "Introducción",
        content:
          "El método de Newton-Raphson es un algoritmo iterativo para encontrar aproximaciones de las raíces (o ceros) de una función real. Es uno de los métodos más utilizados para resolver ecuaciones no lineales debido a su rápida convergencia cuando se aplica correctamente.",
      },
      formula: {
        title: "Fórmula del Método",
        content: "La fórmula iterativa del método Newton-Raphson es:",
        explanation:
          "Donde:\n• xₙ₊₁ es la siguiente aproximación\n• xₙ es la aproximación actual\n• f(xₙ) es el valor de la función en xₙ\n• f'(xₙ) es la derivada de la función en xₙ",
      },
      algorithm: {
        title: "Algoritmo",
        steps: [
          "Elegir un valor inicial x₀ cercano a la raíz esperada",
          "Calcular f(xₙ) y f'(xₙ)",
          "Aplicar la fórmula: xₙ₊₁ = xₙ - f(xₙ)/f'(xₙ)",
          "Verificar si |xₙ₊₁ - xₙ| < tolerancia",
          "Si no converge, repetir desde el paso 2 con xₙ₊₁",
          "Si converge o se alcanza el máximo de iteraciones, terminar",
        ],
      },
      convergence: {
        title: "Convergencia",
        content:
          "El método Newton-Raphson tiene convergencia cuadrática cuando:\n• La función es dos veces diferenciable\n• La derivada no es cero en la raíz\n• El valor inicial está suficientemente cerca de la raíz\n\nEsto significa que el número de dígitos correctos aproximadamente se duplica en cada iteración.",
      },
      limitations: {
        title: "Limitaciones",
        points: [
          "Requiere el cálculo de la derivada",
          "Puede no converger si f'(x) = 0 cerca de la raíz",
          "Sensible al valor inicial elegido",
          "Puede oscilar entre valores sin converger",
          "No garantiza encontrar todas las raíces",
        ],
      },
    },
    en: {
      title: "Newton-Raphson Method Theory",
      introduction: {
        title: "Introduction",
        content:
          "The Newton-Raphson method is an iterative algorithm for finding approximations to the roots (or zeros) of a real-valued function. It is one of the most widely used methods for solving nonlinear equations due to its rapid convergence when applied correctly.",
      },
      formula: {
        title: "Method Formula",
        content: "The iterative formula of the Newton-Raphson method is:",
        explanation:
          "Where:\n• xₙ₊₁ is the next approximation\n• xₙ is the current approximation\n• f(xₙ) is the function value at xₙ\n• f'(xₙ) is the derivative of the function at xₙ",
      },
      algorithm: {
        title: "Algorithm",
        steps: [
          "Choose an initial value x₀ close to the expected root",
          "Calculate f(xₙ) and f'(xₙ)",
          "Apply the formula: xₙ₊₁ = xₙ - f(xₙ)/f'(xₙ)",
          "Check if |xₙ₊₁ - xₙ| < tolerance",
          "If not converged, repeat from step 2 with xₙ₊₁",
          "If converged or maximum iterations reached, terminate",
        ],
      },
      convergence: {
        title: "Convergence",
        content:
          "The Newton-Raphson method has quadratic convergence when:\n• The function is twice differentiable\n• The derivative is not zero at the root\n• The initial value is sufficiently close to the root\n\nThis means the number of correct digits approximately doubles with each iteration.",
      },
      limitations: {
        title: "Limitations",
        points: [
          "Requires calculation of the derivative",
          "May not converge if f'(x) = 0 near the root",
          "Sensitive to the chosen initial value",
          "May oscillate between values without converging",
          "Does not guarantee finding all roots",
        ],
      },
    },
  }

  const t = content[language as keyof typeof content]

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            {t.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Target className="h-4 w-4" />
              {t.introduction.title}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{t.introduction.content}</p>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Formula className="h-4 w-4" />
              {t.formula.title}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">{t.formula.content}</p>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg text-center">
              <div className="text-2xl font-mono font-bold text-blue-700 dark:text-blue-400 mb-4">
                x₍ₙ₊₁₎ = xₙ - f(xₙ)/f'(xₙ)
              </div>
            </div>
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
                {t.formula.explanation}
              </pre>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-3">{t.algorithm.title}</h3>
            <ol className="space-y-2">
              {t.algorithm.steps.map((step, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full flex items-center justify-center text-sm font-semibold">
                    {index + 1}
                  </span>
                  <span className="text-gray-700 dark:text-gray-300">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-3">{t.convergence.title}</h3>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
                {t.convergence.content}
              </pre>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              {t.limitations.title}
            </h3>
            <ul className="space-y-2">
              {t.limitations.points.map((point, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-2 h-2 bg-red-400 rounded-full mt-2"></span>
                  <span className="text-gray-700 dark:text-gray-300">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
