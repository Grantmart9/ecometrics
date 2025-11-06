import { useState, useMemo, useEffect } from "react";
import {
  EmissionData,
  EmissionResult,
  EmissionFactor,
} from "@/types/emissions";
import emissionFactors from "@/lib/emissionFactors.json";

export function useEmissionsCalculator(data: EmissionData) {
  const [result, setResult] = useState<EmissionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculation = useMemo(() => {
    try {
      const factors = emissionFactors as Record<string, EmissionFactor>;

      const electricityEmissions =
        data.electricity * factors.electricity.factor;
      const fuelEmissions = data.fuel * factors.fuel.factor;
      const wasteEmissions = data.waste * factors.waste.factor;
      const waterEmissions = data.water * factors.water.factor;

      const totalEmissions =
        electricityEmissions + fuelEmissions + wasteEmissions + waterEmissions;

      return {
        electricityEmissions,
        fuelEmissions,
        wasteEmissions,
        waterEmissions,
        totalEmissions,
      };
    } catch (err) {
      return null;
    }
  }, [data]);

  useEffect(() => {
    setLoading(false);
    setError(null);
    setResult(calculation);
  }, [calculation]);

  return { result, loading, error };
}
