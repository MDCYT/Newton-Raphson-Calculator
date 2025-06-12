"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { evaluateFunction } from "@/lib/newton-raphson";
import { BarChart3, Play, Share2 } from "lucide-react";

interface GraphVisualizationProps {
  language: string;
}

export function GraphVisualization({ language }: GraphVisualizationProps) {
  const [functionInput, setFunctionInput] = useState("x^3 - 2*x - 5");
  const [xMin, setXMin] = useState(-5);
  const [xMax, setXMax] = useState(5);
  const [graphData, setGraphData] = useState<any[]>([]);
  const [angleUnit, setAngleUnit] = useState("radians");

  const translations = {
    es: {
      title: "Visualización Gráfica",
      function: "Función f(x)",
      xRange: "Rango de X",
      plot: "Graficar",
      xAxis: "x",
      yAxis: "f(x)",
      angleUnit: "Unidad de ángulo",
      share: "Compartir",
      copySuccess: "Información copiada al portapapeles",
      copyFailure: "Error al copiar",
    },
    en: {
      title: "Graph Visualization",
      function: "Function f(x)",
      xRange: "X Range",
      plot: "Plot",
      xAxis: "x",
      yAxis: "f(x)",
      angleUnit: "Angle Unit",
      share: "Share",
      copySuccess: "Information copied to clipboard",
      copyFailure: "Clipboard copy failed",
    },
  };

  const t = translations[language as keyof typeof translations];

  const generateGraphData = () => {
    try {
      const data = [];
      const step = (xMax - xMin) / 200;
      for (let x = xMin; x <= xMax; x += step) {
        try {
          const y = evaluateFunction(functionInput, x, angleUnit);
          if (isFinite(y) && Math.abs(y) < 1000) {
            data.push({ x: Number(x.toFixed(3)), y: Number(y.toFixed(3)) });
          }
        } catch (e) {
          // Skip invalid points
        }
      }
      setGraphData(data);
    } catch (error) {
      console.error("Error generating graph data:", error);
    }
  };

  // Load settings and initial function input from localStorage
  useEffect(() => {
    const settings = localStorage.getItem("newton-raphson-settings");
    if (settings) {
      const parsed = JSON.parse(settings);
      if (parsed.angleUnit) {
        setAngleUnit(parsed.angleUnit);
      }
    }
    const savedFunction = localStorage.getItem("graph-function-input");
    if (savedFunction) {
      setFunctionInput(savedFunction);
    }
  }, []);

  // Listen to custom event 'functionChanged' to sync with calculator changes
  useEffect(() => {
    const handleFunctionChange = (event: CustomEvent) => {
      if (event.detail && event.detail.function) {
        setFunctionInput(event.detail.function);
        localStorage.setItem("graph-function-input", event.detail.function);
      }
    };

    window.addEventListener(
      "functionChanged",
      handleFunctionChange as EventListener,
    );
    return () => {
      window.removeEventListener(
        "functionChanged",
        handleFunctionChange as EventListener,
      );
    };
  }, []);

  // Regenerate graph data when needed
  useEffect(() => {
    generateGraphData();
  }, [functionInput, xMin, xMax, angleUnit]);

  const handleShare = () => {
    const shareData = {
      title: t.title,
      text: `${t.function}: ${functionInput}\n${t.xRange}: [${xMin}, ${xMax}]\n${t.angleUnit}: ${angleUnit}`,
      url: window.location.href,
    };
    if (navigator.share) {
      navigator
        .share(shareData)
        .catch((error) => console.error("Share failed:", error));
    } else {
      navigator.clipboard
        .writeText(shareData.text + "\n" + shareData.url)
        .then(() => alert(t.copySuccess))
        .catch((error) => console.error("Clipboard copy failed:", error));
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            {t.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="graph-function">{t.function}</Label>
            <Input
              id="graph-function"
              value={functionInput}
              onChange={(e) => {
                const newVal = e.target.value;
                setFunctionInput(newVal);
                localStorage.setItem("graph-function-input", newVal);
                // Dispatch custom event to sync changes across components
                window.dispatchEvent(
                  new CustomEvent("functionChanged", {
                    detail: { function: newVal },
                  }),
                );
              }}
              className="font-mono"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="x-min">X Min</Label>
              <Input
                id="x-min"
                type="number"
                value={xMin}
                onChange={(e) => setXMin(Number.parseFloat(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="x-max">X Max</Label>
              <Input
                id="x-max"
                type="number"
                value={xMax}
                onChange={(e) => setXMax(Number.parseFloat(e.target.value))}
              />
            </div>
            <div className="flex items-end gap-2">
              <Button onClick={generateGraphData} className="w-full">
                <Play className="h-4 w-4 mr-2" />
                {t.plot}
              </Button>
              <Button
                onClick={handleShare}
                variant="outline"
                className="w-full"
              >
                <Share2 className="h-4 w-4 mr-2" />
                {t.share}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={graphData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="x"
                  type="number"
                  scale="linear"
                  domain={[xMin, xMax]}
                  label={{
                    value: t.xAxis,
                    position: "insideBottom",
                    offset: -10,
                  }}
                />
                <YAxis
                  label={{ value: t.yAxis, angle: -90, position: "insideLeft" }}
                />
                <Tooltip
                  formatter={(value, name) => [Number(value).toFixed(3), name]}
                  labelFormatter={(value) => `x = ${Number(value).toFixed(3)}`}
                />
                <ReferenceLine y={0} stroke="#666" strokeDasharray="2 2" />
                <ReferenceLine x={0} stroke="#666" strokeDasharray="2 2" />
                <Line
                  type="monotone"
                  dataKey="y"
                  stroke="#2563eb"
                  strokeWidth={2}
                  dot={false}
                  name="f(x)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
