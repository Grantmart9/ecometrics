"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEmissions } from "@/lib/emissionsContext";
import { dummyEmissionResult } from "@/lib/dummyData";

export const dynamic = "force-dynamic";

export default function Electricity() {
  const { result } = useEmissions();

  const emissions = result || dummyEmissionResult;

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2 mb-6">
        <h2 className="text-3xl font-bold tracking-tight">Electricity</h2>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Electricity Emissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {emissions.electricityEmissions.toFixed(2)} kg CO2e
            </div>
            <p className="text-xs text-muted-foreground">
              +10% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Grid Electricity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">300.00 kg CO2e</div>
            <p className="text-xs text-muted-foreground">
              +15% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Backup Generators
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">50.00 kg CO2e</div>
            <p className="text-xs text-muted-foreground">-5% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Other Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">20.00 kg CO2e</div>
            <p className="text-xs text-muted-foreground">0% change</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Electricity Emissions Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Chart placeholder for electricity trends.
            </p>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Reports</CardTitle>
            <CardDescription>Your latest electricity reports.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-sm">
                Report 1: {emissions.electricityEmissions.toFixed(2)} kg CO2e
              </div>
              <div className="text-sm">Report 2: 350 kg CO2e</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
