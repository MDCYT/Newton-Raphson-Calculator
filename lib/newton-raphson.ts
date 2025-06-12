// Function parser and evaluator
export function evaluateFunction(
  expression: string,
  x: number,
  angleUnit: string = "radians",
  language: string = "es",
): number {
  // Helper functions for angle conversion
  const convertToRadians = (angle: number): number => {
    switch (angleUnit) {
      case "degrees":
        return (angle * Math.PI) / 180;
      case "gradians":
        return (angle * Math.PI) / 200;
      default:
        return angle;
    }
  };

  const convertFromRadians = (angle: number): number => {
    switch (angleUnit) {
      case "degrees":
        return (angle * 180) / Math.PI;
      case "gradians":
        return (angle * 200) / Math.PI;
      default:
        return angle;
    }
  };

  // Replace mathematical constants and functions
  let expr = expression
    .replace(/\bpi\b/g, Math.PI.toString())
    .replace(/\be\b/g, Math.E.toString())
    .replace(/\bx\b/g, x.toString())
    .replace(/\^/g, "**");

  // Handle trigonometric functions with angle unit conversion
  if (angleUnit !== "radians") {
    expr = expr
      .replace(
        /sin\(/g,
        `Math.sin(${Math.PI / (angleUnit === "degrees" ? 180 : 200)}*(`,
      )
      .replace(
        /cos\(/g,
        `Math.cos(${Math.PI / (angleUnit === "degrees" ? 180 : 200)}*(`,
      )
      .replace(
        /tan\(/g,
        `Math.tan(${Math.PI / (angleUnit === "degrees" ? 180 : 200)}*(`,
      );
  } else {
    expr = expr
      .replace(/sin\(/g, "Math.sin(")
      .replace(/cos\(/g, "Math.cos(")
      .replace(/tan\(/g, "Math.tan(");
  }

  // Handle other mathematical functions
  expr = expr
    .replace(/(?<!Math\.)\bln\(/g, "Math.log(")
    .replace(/(?<!Math\.)\blog\(/g, "Math.log10(")
    .replace(/sqrt\(/g, "Math.sqrt(")
    .replace(/abs\(/g, "Math.abs(")
    .replace(/exp\(/g, "Math.exp(");
  if (angleUnit !== "radians") {
    if (angleUnit === "degrees") {
      x = (x * Math.PI) / 180;
    } else if (angleUnit === "gradian" || angleUnit === "gradianes") {
      x = (x * Math.PI) / 200;
    }
  }
  const openParens = (expr.match(/\(/g) || []).length;
  const closeParens = (expr.match(/\)/g) || []).length;
  if (openParens > closeParens) {
    expr = expr + ")".repeat(openParens - closeParens);
  }

  try {
    console.log(expr);
    const result = Function("x", '"use strict"; return (' + expr + ")")(x);
    if (!isFinite(result)) {
      throw new Error(
        language === "es"
          ? "La evaluación de la función resultó en un valor no finito"
          : "Function evaluation resulted in non-finite value",
      );
    }
    return result;
  } catch (error) {
    console.log(error);
    throw new Error(
      language === "es"
        ? "Expresión de función inválida o error de evaluación"
        : "Invalid function expression or evaluation error",
    );
  }
}

// Numerical derivative calculation
export function evaluateDerivative(
  expression: string,
  x: number,
  h = 1e-8,
  angleUnit: string = "radians",
  language: string = "es",
): number {
  const f1 = evaluateFunction(expression, x + h, angleUnit, language);
  const f2 = evaluateFunction(expression, x - h, angleUnit, language);
  return (f1 - f2) / (2 * h);
}

// Newton-Raphson method implementation
export function newtonRaphson(
  expression: string,
  x0: number,
  tolerance = 1e-6,
  maxIterations = 100,
  angleUnit: string = "radians",
  language: string = "es",
): NewtonRaphsonResult {
  const steps = [];
  let x = x0;
  let iteration = 0;

  try {
    for (iteration = 0; iteration < maxIterations; iteration++) {
      const fx = evaluateFunction(expression, x, angleUnit, language);
      const fpx = evaluateDerivative(expression, x, 1e-8, angleUnit, language);

      steps.push({
        iteration,
        x,
        fx,
        fpx,
      });

      // Check if derivative is too small (potential division by zero)
      if (Math.abs(fpx) < 1e-12) {
        throw new Error(
          language === "es"
            ? "Derivada demasiado pequeña - el método puede no converger"
            : "Derivative too small - method may not converge",
        );
      }

      const xNext = x - fx / fpx;

      // Check for convergence
      if (Math.abs(xNext - x) < tolerance) {
        steps.push({
          iteration: iteration + 1,
          x: xNext,
          fx: evaluateFunction(expression, xNext, angleUnit, language),
          fpx: evaluateDerivative(expression, xNext, 1e-8, angleUnit, language),
        });

        return {
          root: xNext,
          iterations: iteration + 1,
          converged: true,
          steps,
          finalError: Math.abs(xNext - x),
        };
      }

      x = xNext;

      // Check for divergence
      if (!isFinite(x) || Math.abs(x) > 1e10) {
        throw new Error(
          language === "es"
            ? "El método divergió - intente con un valor inicial diferente"
            : "Method diverged - try a different initial value",
        );
      }
    }

    // Maximum iterations reached
    return {
      root: x,
      iterations: maxIterations,
      converged: false,
      steps,
      finalError: Math.abs(evaluateFunction(expression, x, angleUnit)),
    };
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : language === "es"
          ? "Error de cálculo"
          : "Calculation error",
    );
  }
}

// Multiple root finder (basic implementation)
interface NewtonRaphsonResult {
  root: number;
  iterations: number;
  converged: boolean;
  steps: Array<{
    iteration: number;
    x: number;
    fx: number;
    fpx: number;
  }>;
  finalError: number;
}

export function findMultipleRoots(
  expression: string,
  xMin: number,
  xMax: number,
  numTrials = 10,
  tolerance = 1e-6,
  angleUnit: string = "radians",
  language: string = "es",
): NewtonRaphsonResult[] {
  const roots: NewtonRaphsonResult[] = [];
  const step = (xMax - xMin) / numTrials;

  for (let i = 0; i < numTrials; i++) {
    const x0 = xMin + i * step;
    try {
      const result = newtonRaphson(
        expression,
        x0,
        tolerance,
        50,
        angleUnit,
        language,
      );
      if (result.converged) {
        // Check if this root is already found
        const isDuplicate = roots.some(
          (root) => Math.abs(root.root - result.root) < tolerance * 10,
        );
        if (!isDuplicate) {
          roots.push(result);
        }
      }
    } catch (error) {
      // Continue with next initial value
    }
  }

  return roots;
}
