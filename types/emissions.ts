export interface EmissionFactor {
  category: string;
  unit: string;
  factor: number; // kg CO2e per unit
}

export interface EmissionData {
  electricity: number; // kWh
  fuel: number; // liters
  waste: number; // kg
  water: number; // liters
}

export interface EmissionResult {
  electricityEmissions: number;
  fuelEmissions: number;
  wasteEmissions: number;
  waterEmissions: number;
  totalEmissions: number;
}

export interface CompanyData {
  name: string;
  logo?: string;
  contact: string;
}

export interface ReportData {
  id: string;
  company: CompanyData;
  emissions: EmissionResult;
  date: string;
}

import { z } from "zod";

export const emissionDataSchema = z.object({
  electricity: z.number().min(0, "Electricity must be non-negative"),
  fuel: z.number().min(0, "Fuel must be non-negative"),
  waste: z.number().min(0, "Waste must be non-negative"),
  water: z.number().min(0, "Water must be non-negative"),
});
