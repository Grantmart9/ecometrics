// Chart utilities and optimizations for EcoMetrics
import { useMemo } from "react";

// Color palettes optimized for different chart types
export const CHART_COLORS = {
  // Primary colors for sustainability theme
  emerald: ["#10b981", "#059669", "#047857", "#065f46"],
  emeraldLight: ["#34d399", "#10b981", "#059669", "#047857"],

  // Extended palette for multiple data series
  multiColor: [
    "#10b981", // emerald
    "#3b82f6", // blue
    "#f59e0b", // amber
    "#ef4444", // red
    "#8b5cf6", // purple
    "#06b6d4", // cyan
    "#f97316", // orange
    "#84cc16", // lime
  ],

  // Scope-specific colors
  scopes: {
    scope1: "#ef4444", // red for direct emissions
    scope2: "#f59e0b", // amber for energy
    scope3: "#3b82f6", // blue for indirect
  },

  // Performance indicators
  performance: {
    excellent: "#10b981",
    good: "#84cc16",
    warning: "#f59e0b",
    poor: "#ef4444",
  },
};

// Formatter utilities
export const formatEmissions = (value: number): string => {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}k tCO₂e`;
  }
  return `${value.toFixed(1)} tCO₂e`;
};

export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

export const formatCurrency = (
  value: number,
  currency: string = "R"
): string => {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(value)
    .replace("R", "R");
};

// Chart configuration templates
export const CHART_CONFIGS = {
  area: {
    curveType: "monotone" as const,
    showLegend: true,
    showAnimation: true,
    showTooltip: true,
    showGridLines: true,
    showGradient: true,
  },

  line: {
    curveType: "monotone" as const,
    showLegend: true,
    showAnimation: true,
    showTooltip: true,
    showGridLines: true,
  },

  bar: {
    showLegend: true,
    showAnimation: true,
    showTooltip: true,
    showGridLines: true,
  },

  donut: {
    showLabel: true,
    showAnimation: true,
    showTooltip: true,
    noDataText: "No data available",
  },

  scatter: {
    showLegend: true,
    showTooltip: true,
    showXAxis: true,
    showYAxis: true,
  },
};

// Responsive chart heights
export const getChartHeight = (
  size: "small" | "medium" | "large" = "medium"
): number => {
  switch (size) {
    case "small":
      return 200;
    case "large":
      return 400;
    default:
      return 300;
  }
};

// Performance optimization hooks
export const useOptimizedChartData = <T>(
  data: T[],
  maxDataPoints: number = 50
) => {
  return useMemo(() => {
    if (data.length <= maxDataPoints) {
      return data;
    }

    // For time series data, sample to reduce points while maintaining trends
    const step = Math.ceil(data.length / maxDataPoints);
    return data.filter((_, index) => index % step === 0);
  }, [data, maxDataPoints]);
};

// Theme utilities
export const getThemeColors = (mode: "light" | "dark" = "light") => {
  if (mode === "dark") {
    return {
      background: "#1f2937",
      foreground: "#f9fafb",
      grid: "#374151",
      text: "#d1d5db",
    };
  }

  return {
    background: "#ffffff",
    foreground: "#111827",
    grid: "#f3f4f6",
    text: "#6b7280",
  };
};

// Animation utilities
export const getAnimationConfig = (duration: number = 1000) => ({
  duration,
  easing: "ease-in-out" as const,
  delay: 0,
});

// Chart loading states
export const CHART_SKELETONS = {
  small: {
    width: "100%",
    height: "200px",
    className: "chart-loading",
  },
  medium: {
    width: "100%",
    height: "300px",
    className: "chart-loading",
  },
  large: {
    width: "100%",
    height: "400px",
    className: "chart-loading",
  },
};

// Export helper functions
export const exportChartData = {
  csv: (data: any[], filename: string) => {
    const csvContent = [
      Object.keys(data[0] || {}).join(","),
      ...data.map((row) => Object.values(row).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  },

  json: (data: any[], filename: string) => {
    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}.json`;
    link.click();
    URL.revokeObjectURL(url);
  },
};

// Chart error boundaries
export const handleChartError = (error: Error, fallbackData: any[] = []) => {
  console.error("Chart rendering error:", error);
  return fallbackData;
};

// Data validation utilities
export const validateChartData = (
  data: any[],
  requiredFields: string[]
): boolean => {
  if (!Array.isArray(data) || data.length === 0) {
    return false;
  }

  return data.every((item) =>
    requiredFields.every((field) => item.hasOwnProperty(field))
  );
};

// Performance monitoring
export const monitorChartPerformance = (chartId: string, startTime: number) => {
  const endTime = performance.now();
  const renderTime = endTime - startTime;

  if (renderTime > 1000) {
    console.warn(`Chart ${chartId} took ${renderTime.toFixed(2)}ms to render`);
  }

  return renderTime;
};

// Accessibility utilities
export const chartAccessibility = {
  getAriaLabel: (chartType: string, data: any[]): string => {
    return `${chartType} chart showing ${data.length} data points`;
  },

  getDescription: (title: string, description: string): string => {
    return `${title}. ${description}`;
  },
};

// Color utilities for data visualization
export const generateColorScale = (
  count: number,
  palette: string[] = CHART_COLORS.multiColor
): string[] => {
  if (count <= palette.length) {
    return palette.slice(0, count);
  }

  // Generate additional colors if needed
  const colors = [...palette];
  for (let i = palette.length; i < count; i++) {
    const baseColor = palette[i % palette.length];
    const lightness = 30 + ((i * 20) % 40); // Vary lightness
    colors.push(baseColor);
  }

  return colors;
};

// Chart interaction utilities
export const chartInteractions = {
  handleClick: (data: any, event: React.MouseEvent) => {
    // Custom click handler for chart elements
    console.log("Chart element clicked:", data);
  },

  handleHover: (data: any, event: React.MouseEvent) => {
    // Custom hover handler
    console.log("Chart element hovered:", data);
  },

  handleZoom: (data: any, direction: "in" | "out") => {
    // Custom zoom handler
    console.log(`Chart zoom ${direction}:`, data);
  },
};

// Real-time data utilities
export const realTimeDataHelpers = {
  aggregateData: (
    newData: any[],
    existingData: any[],
    maxPoints: number = 100
  ): any[] => {
    const combined = [...existingData, ...newData];
    if (combined.length > maxPoints) {
      return combined.slice(-maxPoints);
    }
    return combined;
  },

  smoothData: (data: any[], windowSize: number = 3): any[] => {
    return data.map((item, index) => {
      const start = Math.max(0, index - windowSize);
      const end = Math.min(data.length, index + windowSize + 1);
      const window = data.slice(start, end);

      // Simple moving average for numerical values
      const averaged = { ...item };
      Object.keys(item).forEach((key) => {
        if (typeof item[key] === "number") {
          const sum = window.reduce((acc, curr) => acc + (curr[key] || 0), 0);
          averaged[key] = sum / window.length;
        }
      });

      return averaged;
    });
  },
};
