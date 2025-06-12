"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Settings, Save, RotateCcw } from "lucide-react";

interface SettingsPanelProps {
  language: string;
}

export function SettingsPanel({ language }: SettingsPanelProps) {
  const [settings, setSettings] = useState({
    defaultPrecision: 6,
    defaultMaxIterations: 100,
    defaultTolerance: 0.000001,
    autoSaveHistory: true,
    showStepByStep: true,
    graphResolution: 200,
    theme: "light",
    language: "es",
    angleUnit: "radians",
  });

  const translations = {
    es: {
      title: "Configuración",
      defaults: "Valores por defecto",
      precision: "Precisión decimal",
      maxIterations: "Máximo de iteraciones",
      tolerance: "Tolerancia",
      display: "Visualización",
      autoSave: "Guardar historial automáticamente",
      showSteps: "Mostrar pasos detallados",
      graphRes: "Resolución del gráfico",
      angleUnit: "Unidad de ángulos",
      radians: "Radianes",
      degrees: "Grados",
      gradians: "Gradianes",
      save: "Guardar",
      reset: "Restablecer",
      saved: "Configuración guardada",
    },
    en: {
      title: "Settings",
      defaults: "Default values",
      precision: "Decimal precision",
      maxIterations: "Maximum iterations",
      tolerance: "Tolerance",
      display: "Display",
      autoSave: "Auto-save history",
      showSteps: "Show detailed steps",
      graphRes: "Graph resolution",
      angleUnit: "Angle units",
      radians: "Radians",
      degrees: "Degrees",
      gradians: "Gradians",
      save: "Save",
      reset: "Reset",
      saved: "Settings saved",
    },
  };

  const t = translations[language as keyof typeof translations];

  useEffect(() => {
    const savedSettings = localStorage.getItem("newton-raphson-settings");
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem("newton-raphson-settings", JSON.stringify(settings));
    // Show success message
  };

  const handleReset = () => {
    const defaultSettings = {
      defaultPrecision: 6,
      defaultMaxIterations: 100,
      defaultTolerance: 0.000001,
      autoSaveHistory: true,
      showStepByStep: true,
      graphResolution: 200,
      theme: "light",
      language: "es",
      angleUnit: "radians",
    };
    setSettings(defaultSettings);
    localStorage.setItem(
      "newton-raphson-settings",
      JSON.stringify(defaultSettings),
    );
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            {t.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">{t.defaults}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="default-precision">{t.precision}</Label>
                <Input
                  id="default-precision"
                  type="number"
                  value={settings.defaultPrecision}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      defaultPrecision: Number.parseInt(e.target.value),
                    }))
                  }
                  min="1"
                  max="15"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="default-max-iter">{t.maxIterations}</Label>
                <Input
                  id="default-max-iter"
                  type="number"
                  value={settings.defaultMaxIterations}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      defaultMaxIterations: Number.parseInt(e.target.value),
                    }))
                  }
                  min="1"
                  max="1000"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="default-tolerance">{t.tolerance}</Label>
                <Input
                  id="default-tolerance"
                  type="number"
                  value={settings.defaultTolerance}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      defaultTolerance: Number.parseFloat(e.target.value),
                    }))
                  }
                  step="0.000001"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">{t.display}</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-save">{t.autoSave}</Label>
                <Switch
                  id="auto-save"
                  checked={settings.autoSaveHistory}
                  onCheckedChange={(checked) =>
                    setSettings((prev) => ({
                      ...prev,
                      autoSaveHistory: checked,
                    }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="show-steps">{t.showSteps}</Label>
                <Switch
                  id="show-steps"
                  checked={settings.showStepByStep}
                  onCheckedChange={(checked) =>
                    setSettings((prev) => ({
                      ...prev,
                      showStepByStep: checked,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="graph-resolution">{t.graphRes}</Label>
                <Select
                  value={settings.graphResolution.toString()}
                  onValueChange={(value) =>
                    setSettings((prev) => ({
                      ...prev,
                      graphResolution: Number.parseInt(value),
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="100">
                      100 {language === "es" ? "puntos" : "points"}
                    </SelectItem>
                    <SelectItem value="200">
                      200 {language === "es" ? "puntos" : "points"}
                    </SelectItem>
                    <SelectItem value="500">
                      500 {language === "es" ? "puntos" : "points"}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="angle-unit">{t.angleUnit}</Label>
                <Select
                  value={settings.angleUnit}
                  onValueChange={(value) =>
                    setSettings((prev) => ({ ...prev, angleUnit: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="radians">{t.radians}</SelectItem>
                    <SelectItem value="degrees">{t.degrees}</SelectItem>
                    <SelectItem value="gradians">{t.gradians}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button onClick={handleSave} className="flex-1">
              <Save className="h-4 w-4 mr-2" />
              {t.save}
            </Button>
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="h-4 w-4 mr-2" />
              {t.reset}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
