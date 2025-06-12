"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ScientificKeyboardProps {
  onInput: (value: string) => void;
  language: string;
  angleUnit?: string;
}

export function ScientificKeyboard({
  onInput,
  language,
  angleUnit = "radians",
}: ScientificKeyboardProps) {
  const buttons = [
    [
      { label: "sin", value: "sin(" },
      { label: "cos", value: "cos(" },
      { label: "tan", value: "tan(" },
      { label: "ln", value: "ln(" },
      { label: "log₁₀", value: "log(" },
    ],
    [
      { label: "√", value: "sqrt(" },
      { label: "x²", value: "^2" },
      { label: "x³", value: "^3" },
      { label: "xⁿ", value: "^" },
      { label: "eˣ", value: "exp(" },
    ],
    [
      { label: "π", value: "pi" },
      { label: "e", value: "e" },
      { label: "(", value: "(" },
      { label: ")", value: ")" },
      { label: "+", value: "+" },
    ],
    [
      { label: "-", value: "-" },
      { label: "×", value: "*" },
      { label: "÷", value: "/" },
      { label: "x", value: "x" },
      { label: ".", value: "." },
    ],
  ];

  const handleClick = (button: any) => {
    if (button.value === "clear") {
      // This would need to be handled by parent component
      return;
    }
    onInput(button.value);
  };

  const getAngleUnitLabel = () => {
    switch (angleUnit) {
      case "degrees":
        return language === "es" ? "Grados" : "Degrees";
      case "gradians":
        return language === "es" ? "Gradianes" : "Gradians";
      default:
        return language === "es" ? "Radianes" : "Radians";
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">
            {language === "es" ? "Teclado Científico" : "Scientific Keyboard"}
          </CardTitle>
          <Badge variant="secondary" className="text-xs">
            {getAngleUnitLabel()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="grid gap-2">
          {buttons.map((row, rowIndex) => (
            <div key={rowIndex} className="grid grid-cols-5 gap-2">
              {row.map((button, buttonIndex) => (
                <Button
                  key={buttonIndex}
                  variant={button.special ? "destructive" : "outline"}
                  size="sm"
                  onClick={() => handleClick(button)}
                  className="h-10 text-sm"
                >
                  {button.label}
                </Button>
              ))}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
