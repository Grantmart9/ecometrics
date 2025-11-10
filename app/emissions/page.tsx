"use client";

import { useForm, useWatch } from "react-hook-form";
import { useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
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
import { TrendingUp } from "lucide-react";

// Dynamically import Tremor components to avoid SSR issues
const BadgeDelta = dynamic(
  () => import("@tremor/react").then((mod) => mod.BadgeDelta),
  { ssr: false }
);
const Flex = dynamic(() => import("@tremor/react").then((mod) => mod.Flex), {
  ssr: false,
});
const Text = dynamic(() => import("@tremor/react").then((mod) => mod.Text), {
  ssr: false,
});
const Metric = dynamic(
  () => import("@tremor/react").then((mod) => mod.Metric),
  { ssr: false }
);

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

  const fadeIn = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const kpiData = [
    {
      name: "Current Emissions",
      value: result ? result.totalEmissions.toFixed(2) : "0.00",
      unit: "kg CO₂e",
      target: 500,
      trend: "up",
    },
    {
      name: "Daily Target",
      value: "125",
      unit: "kg CO₂e",
      target: 100,
      trend: "down",
    },
    {
      name: "Weekly Progress",
      value: "87.5",
      unit: "%",
      target: 90,
      trend: "up",
    },
    {
      name: "Monthly Goal",
      value: "92.3",
      unit: "%",
      target: 95,
      trend: "up",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-sky-50">
      {/* Dashboard Header */}
      <section className="py-8 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerChildren}
            className="mb-8"
          >
            <motion.div
              variants={fadeIn}
              className="flex flex-col lg:flex-row lg:items-center lg:justify-between"
            >
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  Carbon Emissions Tracking
                </h1>
                <p className="text-lg text-gray-600">
                  Monitor and calculate your carbon footprint in real-time
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* KPI Cards */}
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerChildren}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            {kpiData.map((kpi, index) => (
              <motion.div key={index} variants={fadeIn}>
                <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0 rounded-lg">
                  <Flex alignItems="start">
                    <div className="truncate">
                      <Text className="text-white">{kpi.name}</Text>
                      <Metric className="text-white">
                        {kpi.value} {kpi.unit}
                      </Metric>
                    </div>
                    <TrendingUp className="h-8 w-8 text-blue-100" />
                  </Flex>
                  <BadgeDelta
                    deltaType={
                      kpi.trend === "up"
                        ? "moderateIncrease"
                        : "moderateDecrease"
                    }
                    className="mt-2 bg-white/20 text-white border-white/30"
                  >
                    {kpi.trend === "up" ? "+" : "-"}
                    {Math.abs(
                      ((parseFloat(kpi.value.replace("%", "")) - kpi.target) /
                        kpi.target) *
                        100
                    ).toFixed(1)}
                    % {kpi.trend === "up" ? "above" : "below"} target
                  </BadgeDelta>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-white">
                  Enter Emission Data
                </CardTitle>
                <CardDescription className="text-green-100">
                  Input your operational data to calculate emissions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-white rounded-lg p-4">
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-4 text-black"
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
                      <Button
                        type="submit"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Calculate Emissions
                      </Button>
                    </form>
                  </Form>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-white">
                  Calculated Emissions
                </CardTitle>
                <CardDescription className="text-green-100">
                  Real-time calculation based on your input.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-white rounded-lg p-4">
                  {result ? (
                    <div className="space-y-2 text-black">
                      <div className="text-sm">
                        Electricity: {result.electricityEmissions.toFixed(2)} kg
                        CO2e
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
                    <p className="text-sm text-gray-600">
                      Enter data to see calculations.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
