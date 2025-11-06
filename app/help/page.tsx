"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Help() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2 mb-6">
        <h2 className="text-3xl font-bold tracking-tight">Help & Support</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>App Overview</CardTitle>
            <CardDescription>
              Welcome to the Carbon Calculator, a tool to track and manage your
              carbon emissions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              This application helps you calculate emissions from various
              sources such as electricity, fuel, processes, and more. Use the
              navigation menu to access different sections and input your data
              for accurate calculations.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Navigation Guide</CardTitle>
            <CardDescription>How to move around the app.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>
                <strong>Dashboard:</strong> Overview of your emissions.
              </li>
              <li>
                <strong>Reports:</strong> Detailed reports and history.
              </li>
              <li>
                <strong>Input:</strong> Enter data for calculations.
              </li>
              <li>
                <strong>Help:</strong> This page for assistance.
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Emissions Calculation</CardTitle>
            <CardDescription>
              Understanding how emissions are calculated.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Emissions are calculated based on standard factors for each
              category (e.g., electricity usage, fuel consumption). Enter your
              data in the respective sections, and the app will compute the
              total CO2e emissions.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>FAQ</CardTitle>
            <CardDescription>Frequently Asked Questions.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-sm">
                <strong>Q: How accurate are the calculations?</strong>
                <p className="text-muted-foreground">
                  A: Based on standard emission factors; for precise needs,
                  consult experts.
                </p>
              </div>
              <div className="text-sm">
                <strong>Q: Can I export reports?</strong>
                <p className="text-muted-foreground">
                  A: Yes, use the Reports section to view and download.
                </p>
              </div>
              <div className="text-sm">
                <strong>Q: What units are used?</strong>
                <p className="text-muted-foreground">
                  A: Primarily kg CO2e for emissions.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Contact Support</CardTitle>
            <CardDescription>Need more help? Get in touch.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              For technical issues or feature requests, please contact our
              support team.
            </p>
            <Button variant="outline">Email Support</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
