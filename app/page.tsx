"use client";

import { useState, useEffect } from "react";
import { Calculator } from "@/components/calculator";
import { GraphVisualization } from "@/components/graph-visualization";
import { SettingsPanel } from "@/components/settings-panel";
import { TheorySection } from "@/components/theory-section";
import { HistoryPanel } from "@/components/history-panel";
import { ExportPanel } from "@/components/export-panel";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Moon,
  Sun,
  CalculatorIcon as CalcIcon,
  BarChart3,
  Settings,
  BookOpen,
  History,
  Download,
} from "lucide-react";
import { useTheme } from "next-themes";

export default function NewtonRaphsonApp() {
  const { theme, setTheme } = useTheme();
  const [language, setLanguage] = useState("es");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const translations = {
    es: {
      title: "Calculadora Newton-Raphson",
      subtitle: "Método numérico para encontrar raíces de funciones",
      calculator: "Calculadora",
      graph: "Gráfico",
      settings: "Configuración",
      theory: "Teoría",
      history: "Historial",
      export: "Exportar",
      footer: "Hecho por MDCDEV (José Ortiz) para la Universidad Continental",
    },
    en: {
      title: "Newton-Raphson Calculator",
      subtitle: "Numerical method for finding function roots",
      calculator: "Calculator",
      graph: "Graph",
      settings: "Settings",
      theory: "Theory",
      history: "History",
      export: "Export",
      footer: "Made by MDCDEV (José Ortiz) for Universidad Continental",
    },
  };

  const t = translations[language as keyof typeof translations];

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {t.title}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              {t.subtitle}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLanguage(language === "es" ? "en" : "es")}
            >
              {language === "es" ? "EN" : "ES"}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="calculator" className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-8">
            <TabsTrigger value="calculator" className="flex items-center gap-2">
              <CalcIcon className="h-4 w-4" />
              {t.calculator}
            </TabsTrigger>
            <TabsTrigger value="graph" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              {t.graph}
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              {t.settings}
            </TabsTrigger>
            <TabsTrigger value="theory" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              {t.theory}
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              {t.history}
            </TabsTrigger>
            <TabsTrigger value="export" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              {t.export}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calculator">
            <Calculator language={language} />
          </TabsContent>

          <TabsContent value="graph">
            <GraphVisualization language={language} />
          </TabsContent>

          <TabsContent value="settings">
            <SettingsPanel language={language} />
          </TabsContent>

          <TabsContent value="theory">
            <TheorySection language={language} />
          </TabsContent>

          <TabsContent value="history">
            <HistoryPanel language={language} />
          </TabsContent>

          <TabsContent value="export">
            <ExportPanel language={language} />
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <footer className="mt-16 text-center text-sm text-gray-600 dark:text-gray-400 border-t pt-8">
          {t.footer}
        </footer>
      </div>
    </div>
  );
}
