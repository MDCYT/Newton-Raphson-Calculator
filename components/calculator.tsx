"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { CalculatorIcon as CalcIcon, Play, RotateCcw } from "lucide-react";
import { ScientificKeyboard } from "@/components/scientific-keyboard";
import { newtonRaphson } from "@/lib/newton-raphson";

interface CalculatorProps {
  language: string;
}

export function Calculator({ language }: CalculatorProps) {
  const [functionInput, setFunctionInput] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("graph-function-input") || "x^3 - 2*x - 5";
    }
    return "x^3 - 2*x - 5";
  });
  const [initialValue, setInitialValue] = useState("2");
  const [precision, setPrecision] = useState(6);
  const [maxIterations, setMaxIterations] = useState(100);
  const [tolerance, setTolerance] = useState(0.000001);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [isCalculating, setIsCalculating] = useState(false);
  const [angleUnit, setAngleUnit] = useState("radians");

  const translations = {
    es: {
      function: "Función f(x)",
      initialValue: "Valor inicial (x₀)",
      precision: "Precisión decimal",
      maxIterations: "Máximo de iteraciones",
      tolerance: "Tolerancia de convergencia",
      calculate: "Calcular",
      reset: "Reiniciar",
      result: "Resultado",
      iterations: "Iteraciones",
      converged: "Convergió",
      root: "Raíz encontrada",
      error: "Error",
      invalidFunction: "Función inválida",
      noConvergence: "No convergió en el máximo de iteraciones",
      steps: "Pasos de la solución",
    },
    en: {
      function: "Function f(x)",
      initialValue: "Initial value (x₀)",
      precision: "Decimal precision",
      maxIterations: "Maximum iterations",
      tolerance: "Convergence tolerance",
      calculate: "Calculate",
      reset: "Reset",
      result: "Result",
      iterations: "Iterations",
      converged: "Converged",
      root: "Root found",
      error: "Error",
      invalidFunction: "Invalid function",
      noConvergence: "Did not converge within maximum iterations",
      steps: "Solution steps",
    },
  };

  const t = translations[language as keyof typeof translations];

  useEffect(() => {
    const savedSettings = localStorage.getItem("newton-raphson-settings");
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setAngleUnit(settings.angleUnit || "radians");
    }
  }, []);

  // Handle function input changes, sync with graph and dispatch custom event
  const handleFunctionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFunction = e.target.value;
    setFunctionInput(newFunction);
    localStorage.setItem("graph-function-input", newFunction);
    window.dispatchEvent(
      new CustomEvent("functionChanged", {
        detail: { function: newFunction },
      }),
    );
  };

  const handleCalculate = async () => {
    setIsCalculating(true);
    setError("");

    try {
      const x0 = Number.parseFloat(initialValue);
      if (isNaN(x0)) {
        throw new Error(
          language === "es"
            ? "Valor inicial inválido"
            : "Invalid initial value",
        );
      }

      const result = newtonRaphson(
        functionInput,
        x0,
        tolerance,
        maxIterations,
        angleUnit,
        language,
      );
      setResult(result);

      // Save to history
      const calculation = {
        id: Date.now(),
        function: functionInput,
        initialValue: x0,
        result: result,
        timestamp: new Date().toISOString(),
      };

      const history = JSON.parse(
        localStorage.getItem("newton-raphson-history") || "[]",
      );
      history.unshift(calculation);
      localStorage.setItem(
        "newton-raphson-history",
        JSON.stringify(history.slice(0, 50)),
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : language === "es"
            ? "Error de cálculo"
            : "Calculation error",
      );
    } finally {
      setIsCalculating(false);
    }
  };

  const handleReset = () => {
    setFunctionInput("x^3 - 2*x - 5");
    setInitialValue("2");
    setResult(null);
    setError("");
    localStorage.setItem("graph-function-input", "x^3 - 2*x - 5");
    window.dispatchEvent(
      new CustomEvent("functionChanged", {
        detail: { function: "x^3 - 2*x - 5" },
      }),
    );
  };

  const handleKeyboardInput = (value: string) => {
    const updatedFunction = functionInput + value;
    setFunctionInput(updatedFunction);
    localStorage.setItem("graph-function-input", updatedFunction);
    window.dispatchEvent(
      new CustomEvent("functionChanged", {
        detail: { function: updatedFunction },
      }),
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Input Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalcIcon className="h-5 w-5" />
            {t.function}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="function">{t.function}</Label>
            <Input
              id="function"
              value={functionInput}
              onChange={handleFunctionChange}
              placeholder="x^2 - 4"
              className="font-mono"
            />
          </div>

          <ScientificKeyboard
            onInput={handleKeyboardInput}
            language={language}
            angleUnit={angleUnit}
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="initial">{t.initialValue}</Label>
              <Input
                id="initial"
                type="number"
                value={initialValue}
                onChange={(e) => setInitialValue(e.target.value)}
                step="0.1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="precision">{t.precision}</Label>
              <Input
                id="precision"
                type="number"
                value={precision}
                onChange={(e) => setPrecision(Number.parseInt(e.target.value))}
                min="1"
                max="15"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="maxIter">{t.maxIterations}</Label>
              <Input
                id="maxIter"
                type="number"
                value={maxIterations}
                onChange={(e) =>
                  setMaxIterations(Number.parseInt(e.target.value))
                }
                min="1"
                max="1000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tolerance">{t.tolerance}</Label>
              <Input
                id="tolerance"
                type="number"
                value={tolerance}
                onChange={(e) =>
                  setTolerance(Number.parseFloat(e.target.value))
                }
                step="0.000001"
                min="0.000001"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              onClick={handleCalculate}
              disabled={isCalculating}
              className="flex-1"
            >
              <Play className="h-4 w-4 mr-2" />
              {isCalculating ? "Calculando..." : t.calculate}
            </Button>
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="h-4 w-4 mr-2" />
              {t.reset}
            </Button>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Results Panel */}
      <Card>
        <CardHeader>
          <CardTitle>{t.result}</CardTitle>
        </CardHeader>
        <CardContent>
          {result ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-700 dark:text-green-400">
                    {result.root.toFixed(precision)}
                  </div>
                  <div className="text-sm text-green-600 dark:text-green-500">
                    {t.root}
                  </div>
                </div>
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">
                    {result.iterations}
                  </div>
                  <div className="text-sm text-blue-600 dark:text-blue-500">
                    {t.iterations}
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <Badge variant={result.converged ? "default" : "destructive"}>
                  {result.converged ? t.converged : t.noConvergence}
                </Badge>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-3">{t.steps}</h4>
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {result.steps.map((step: any, index: number) => (
                    <div
                      key={index}
                      className="p-3 bg-gray-50 dark:bg-gray-800 rounded text-sm font-mono"
                    >
                      <div>
                        x₍{index}₎ = {step.x.toFixed(precision)}
                      </div>
                      <div>
                        f(x₍{index}₎) = {step.fx.toFixed(precision)}
                      </div>
                      <div>
                        f'(x₍{index}₎) = {step.fpx.toFixed(precision)}
                      </div>
                      {index < result.steps.length - 1 && (
                        <div className="text-blue-600 dark:text-blue-400">
                          x₍{index + 1}₎ = {step.x.toFixed(precision)} -{" "}
                          {step.fx.toFixed(precision)}/
                          {step.fpx.toFixed(precision)} ={" "}
                          {result.steps[index + 1]?.x.toFixed(precision)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-muted-foreground">
              {t.calculate} {t.function}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
