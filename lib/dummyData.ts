import {
  EmissionData,
  EmissionResult,
  ReportData,
  CompanyData,
} from "@/types/emissions";

export const dummyEmissionData: EmissionData = {
  electricity: 1000,
  fuel: 500,
  waste: 200,
  water: 10000,
};

export const dummyEmissionResult: EmissionResult = {
  electricityEmissions: 400,
  fuelEmissions: 1150,
  wasteEmissions: 20,
  waterEmissions: 3,
  totalEmissions: 1573,
};

export const dummyCompany: CompanyData = {
  name: "Sample Company",
  logo: "/logo.png",
  contact: "contact@sample.com",
};

export const dummyReports: ReportData[] = [
  {
    id: "1",
    company: dummyCompany,
    emissions: dummyEmissionResult,
    date: "2023-01-01",
  },
  {
    id: "2",
    company: dummyCompany,
    emissions: {
      electricityEmissions: 350,
      fuelEmissions: 1000,
      wasteEmissions: 15,
      waterEmissions: 2,
      totalEmissions: 1367,
    },
    date: "2023-02-01",
  },
];
