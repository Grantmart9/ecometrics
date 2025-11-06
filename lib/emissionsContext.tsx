"use client";

import React, { createContext, useContext, useState } from "react";
import { EmissionData, EmissionResult } from "@/types/emissions";

interface EmissionsContextType {
  data: EmissionData;
  setData: (data: EmissionData) => void;
  result: EmissionResult | null;
  setResult: (result: EmissionResult | null) => void;
}

const EmissionsContext = createContext<EmissionsContextType | undefined>(
  undefined
);

export function EmissionsProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<EmissionData>({
    electricity: 0,
    fuel: 0,
    waste: 0,
    water: 0,
  });
  const [result, setResult] = useState<EmissionResult | null>(null);

  return (
    <EmissionsContext.Provider value={{ data, setData, result, setResult }}>
      {children}
    </EmissionsContext.Provider>
  );
}

export function useEmissions() {
  const context = useContext(EmissionsContext);
  if (context === undefined) {
    throw new Error("useEmissions must be used within an EmissionsProvider");
  }
  return context;
}
