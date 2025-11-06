"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default function FugitiveGas() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2 mb-6">
        <h2 className="text-3xl font-bold tracking-tight">Fugitive Gas</h2>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Fugitive Gas Emissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">50.00 kg CO2e</div>
            <p className="text-xs text-muted-foreground">+2% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Methane</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">30.00 kg CO2e</div>
            <p className="text-xs text-muted-foreground">+5% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CO2</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">20.00 kg CO2e</div>
            <p className="text-xs text-muted-foreground">-1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Other Gases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0.00 kg CO2e</div>
            <p className="text-xs text-muted-foreground">0% change</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Fugitive Gas Emissions Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Chart placeholder for fugitive gas trends.
            </p>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Reports</CardTitle>
            <CardDescription>Your latest fugitive gas reports.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-sm">Report 1: 50.00 kg CO2e</div>
              <div className="text-sm">Report 2: 48 kg CO2e</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
