"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default function Process() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2 mb-6">
        <h2 className="text-3xl font-bold tracking-tight">Process</h2>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Process Emissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">100.00 kg CO2e</div>
            <p className="text-xs text-muted-foreground">+3% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Chemical Processes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">60.00 kg CO2e</div>
            <p className="text-xs text-muted-foreground">+5% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Manufacturing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">40.00 kg CO2e</div>
            <p className="text-xs text-muted-foreground">-1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Other Processes
            </CardTitle>
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
            <CardTitle>Process Emissions Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Chart placeholder for process trends.
            </p>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Reports</CardTitle>
            <CardDescription>Your latest process reports.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-sm">Report 1: 100.00 kg CO2e</div>
              <div className="text-sm">Report 2: 97 kg CO2e</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
