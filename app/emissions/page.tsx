"use client";

import { useForm, useWatch } from "react-hook-form";
import { useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { emissionDataSchema, EmissionData } from "@/types/emissions";
import { useEmissions } from "@/lib/emissionsContext";
import { useEmissionsCalculator } from "@/hooks/useEmissionsCalculator";

export default function EmissionsPage() {
  const { setData } = useEmissions();

  const form = useForm<EmissionData>({
    resolver: zodResolver(emissionDataSchema),
    defaultValues: {
      electricity: 0,
      fuel: 0,
      waste: 0,
      water: 0,
    },
  });

  const onSubmit = (data: EmissionData) => {
    setData(data);
  };

  const data = useWatch({ control: form.control });
  const stableData = useMemo(
    () => ({
      electricity: data.electricity || 0,
      fuel: data.fuel || 0,
      waste: data.waste || 0,
      water: data.water || 0,
    }),
    [data.electricity, data.fuel, data.waste, data.water]
  );

  const { result } = useEmissionsCalculator(stableData);

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Emissions Data Entry
        </h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Enter Emission Data</CardTitle>
            <CardDescription>
              Input your operational data to calculate emissions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="electricity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Electricity (kWh)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="fuel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fuel (liters)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="waste"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Waste (kg)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="water"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Water (liters)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Calculate Emissions</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Calculated Emissions</CardTitle>
            <CardDescription>
              Real-time calculation based on your input.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {result ? (
              <div className="space-y-2">
                <div className="text-sm">
                  Electricity: {result.electricityEmissions.toFixed(2)} kg CO2e
                </div>
                <div className="text-sm">
                  Fuel: {result.fuelEmissions.toFixed(2)} kg CO2e
                </div>
                <div className="text-sm">
                  Waste: {result.wasteEmissions.toFixed(2)} kg CO2e
                </div>
                <div className="text-sm">
                  Water: {result.waterEmissions.toFixed(2)} kg CO2e
                </div>
                <div className="text-lg font-bold">
                  Total: {result.totalEmissions.toFixed(2)} kg CO2e
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Enter data to see calculations.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
