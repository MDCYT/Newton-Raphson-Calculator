export interface AppSettings {
  defaultPrecision: number;
  defaultMaxIterations: number;
  defaultTolerance: number;
  autoSaveHistory: boolean;
  showStepByStep: boolean;
  graphResolution: number;
  theme: string;
  language: string;
  angleUnit: "radians" | "degrees" | "gradians";
}

export const defaultSettings: AppSettings = {
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

export function getSettings(): AppSettings {
  if (typeof window === "undefined") {
    return defaultSettings;
  }

  try {
    const savedSettings = localStorage.getItem("newton-raphson-settings");
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      return { ...defaultSettings, ...parsed };
    }
  } catch (error) {
    console.warn("Failed to load settings from localStorage:", error);
  }

  return defaultSettings;
}

export function saveSettings(settings: AppSettings): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.setItem("newton-raphson-settings", JSON.stringify(settings));
  } catch (error) {
    console.warn("Failed to save settings to localStorage:", error);
  }
}

export function resetSettings(): AppSettings {
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem("newton-raphson-settings");
    } catch (error) {
      console.warn("Failed to reset settings in localStorage:", error);
    }
  }
  return defaultSettings;
}

export function getAngleUnitLabel(
  angleUnit: string,
  language: string = "es",
): string {
  const translations = {
    es: {
      radians: "Radianes",
      degrees: "Grados",
      gradians: "Gradianes",
    },
    en: {
      radians: "Radians",
      degrees: "Degrees",
      gradians: "Gradians",
    },
  };

  const t = translations[language as keyof typeof translations] || translations.es;
  return t[angleUnit as keyof typeof t] || t.radians;
}

export function convertAngle(
  value: number,
  fromUnit: string,
  toUnit: string,
): number {
  if (fromUnit === toUnit) return value;

  // Convert to radians first
  let radians: number;
  switch (fromUnit) {
    case "degrees":
      radians = (value * Math.PI) / 180;
      break;
    case "gradians":
      radians = (value * Math.PI) / 200;
      break;
    default:
      radians = value;
      break;
  }

  // Convert from radians to target unit
  switch (toUnit) {
    case "degrees":
      return (radians * 180) / Math.PI;
    case "gradians":
      return (radians * 200) / Math.PI;
    default:
      return radians;
  }
}
