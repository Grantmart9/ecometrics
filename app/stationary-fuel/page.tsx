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

export default function StationaryFuel() {
  const { result } = useEmissions();

  const emissions = result || dummyEmissionResult;

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2 mb-6">
        <h2 className="text-3xl font-bold tracking-tight">Stationary Fuel</h2>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Stationary Fuel Emissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {emissions.fuelEmissions.toFixed(2)} kg CO2e
            </div>
            <p className="text-xs text-muted-foreground">+5% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gasoline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">150.00 kg CO2e</div>
            <p className="text-xs text-muted-foreground">
              +10% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Diesel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">200.00 kg CO2e</div>
            <p className="text-xs text-muted-foreground">+5% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Other Fuels</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">50.00 kg CO2e</div>
            <p className="text-xs text-muted-foreground">-2% from last month</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Stationary Fuel Emissions Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Chart placeholder for stationary fuel trends.
            </p>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Reports</CardTitle>
            <CardDescription>
              Your latest stationary fuel reports.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-sm">
                Report 1: {emissions.fuelEmissions.toFixed(2)} kg CO2e
              </div>
              <div className="text-sm">Report 2: 400 kg CO2e</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
