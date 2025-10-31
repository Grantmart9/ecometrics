"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
// Dynamically import Tremor components to avoid SSR issues
const Card = dynamic(() => import("@tremor/react").then((mod) => mod.Card), {
  ssr: false,
});
const Title = dynamic(() => import("@tremor/react").then((mod) => mod.Title), {
  ssr: false,
});
const Text = dynamic(() => import("@tremor/react").then((mod) => mod.Text), {
  ssr: false,
});
const Metric = dynamic(
  () => import("@tremor/react").then((mod) => mod.Metric),
  { ssr: false }
);
const AreaChart = dynamic(
  () => import("@tremor/react").then((mod) => mod.AreaChart),
  { ssr: false }
);
const DonutChart = dynamic(
  () => import("@tremor/react").then((mod) => mod.DonutChart),
  { ssr: false }
);
const BarChart = dynamic(
  () => import("@tremor/react").then((mod) => mod.BarChart),
  { ssr: false }
);
const LineChart = dynamic(
  () => import("@tremor/react").then((mod) => mod.LineChart),
  { ssr: false }
);
const BadgeDelta = dynamic(
  () => import("@tremor/react").then((mod) => mod.BadgeDelta),
  { ssr: false }
);
const Flex = dynamic(() => import("@tremor/react").then((mod) => mod.Flex), {
  ssr: false,
});
const Grid = dynamic(() => import("@tremor/react").then((mod) => mod.Grid), {
  ssr: false,
});
import { Button } from "@/components/ui/button";
import {
  Card as UICard,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import {
  Leaf,
  Activity,
  Clock,
  BarChart3,
  Zap,
  Globe,
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

// Mock data for real-time tracking
const realtimeData = [
  { time: "00:00", emissions: 245.8, temperature: 22.5, humidity: 65 },
  { time: "04:00", emissions: 198.3, temperature: 21.8, humidity: 68 },
  { time: "08:00", emissions: 312.7, temperature: 23.2, humidity: 62 },
  { time: "12:00", emissions: 389.4, temperature: 25.1, humidity: 58 },
  { time: "16:00", emissions: 456.2, temperature: 26.8, humidity: 55 },
  { time: "20:00", emissions: 298.1, temperature: 24.3, humidity: 61 },
  { time: "24:00", emissions: 267.9, temperature: 22.9, humidity: 64 },
];

const emissionSources = [
  { name: "Electricity", value: 45, color: "#10b981" },
  { name: "Transportation", value: 25, color: "#3b82f6" },
  { name: "Manufacturing", value: 20, color: "#f59e0b" },
  { name: "Heating", value: 10, color: "#ef4444" },
];

const dailyComparison = [
  { day: "Mon", current: 245, previous: 289 },
  { day: "Tue", current: 198, previous: 234 },
  { day: "Wed", current: 312, previous: 298 },
  { day: "Thu", current: 389, previous: 412 },
  { day: "Fri", current: 456, previous: 478 },
  { day: "Sat", current: 298, previous: 321 },
  { day: "Sun", current: 267, previous: 289 },
];

const alerts = [
  {
    id: 1,
    type: "warning",
    message: "Emissions threshold exceeded in Building A",
    time: "2 minutes ago",
  },
  {
    id: 2,
    type: "success",
    message: "Energy consumption reduced by 15%",
    time: "15 minutes ago",
  },
  {
    id: 3,
    type: "info",
    message: "New data source connected successfully",
    time: "1 hour ago",
  },
];

export default function RealTimeCarbonTrackingPage() {
  const [currentEmissions, setCurrentEmissions] = useState(245.8);
  const [selectedTimeRange, setSelectedTimeRange] = useState("24h");
  const [isLive, setIsLive] = useState(true);

  // Simulate real-time updates
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      setCurrentEmissions((prev) => {
        const change = (Math.random() - 0.5) * 20;
        return Math.max(0, prev + change);
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isLive]);

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

  const getDeltaType = (current: number, previous: number) => {
    if (current < previous) return "moderateDecrease";
    if (current > previous) return "moderateIncrease";
    return "unchanged";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-sky-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-green-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link href="/">
                <ArrowLeft className="h-6 w-6 text-gray-600 mr-4 hover:text-green-600 transition-colors" />
              </Link>
              <Leaf className="h-8 w-8 text-green-600 mr-2" />
              <span className="text-2xl font-bold text-gray-900">
                EcoMetrics
              </span>
            </div>
            <div className="hidden md:flex space-x-8">
              <Link
                href="/"
                className="text-gray-700 hover:text-green-600 transition-colors"
              >
                Home
              </Link>
              <Link
                href="/#features"
                className="text-gray-700 hover:text-green-600 transition-colors"
              >
                Features
              </Link>
            </div>
          </div>
        </div>
      </nav>

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
                  Real-Time Carbon Tracking
                </h1>
                <p className="text-lg text-gray-600">
                  Monitor your emissions with live data and interactive
                  analytics
                </p>
              </div>
              <div className="flex items-center space-x-4 mt-4 lg:mt-0">
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      isLive ? "bg-green-500 animate-pulse" : "bg-gray-400"
                    }`}
                  ></div>
                  <span className="text-sm text-gray-600">
                    {isLive ? "Live" : "Paused"}
                  </span>
                </div>
                <Button
                  onClick={() => setIsLive(!isLive)}
                  variant={isLive ? "destructive" : "default"}
                  size="sm"
                >
                  {isLive ? "Pause" : "Resume"}
                </Button>
              </div>
            </motion.div>
          </motion.div>

          {/* Key Metrics Cards */}
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerChildren}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            <motion.div variants={fadeIn}>
              <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0">
                <Flex alignItems="start">
                  <div className="truncate">
                    <Text className="text-green-100">Current Emissions</Text>
                    <Metric className="text-white">
                      {currentEmissions.toFixed(1)} tCO₂e
                    </Metric>
                  </div>
                  <Activity className="h-8 w-8 text-green-200" />
                </Flex>
              </Card>
            </motion.div>

            <motion.div variants={fadeIn}>
              <Card className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-0">
                <Flex alignItems="start">
                  <div className="truncate">
                    <Text className="text-blue-100">Daily Target</Text>
                    <Metric className="text-white">320 tCO₂e</Metric>
                  </div>
                  <TrendingDown className="h-8 w-8 text-blue-200" />
                </Flex>
                <BadgeDelta
                  deltaType={getDeltaType(currentEmissions, 320)}
                  className="mt-2"
                >
                  {currentEmissions < 320 ? "23% below target" : "Above target"}
                </BadgeDelta>
              </Card>
            </motion.div>

            <motion.div variants={fadeIn}>
              <Card className="bg-gradient-to-br from-purple-500 to-pink-600 text-white border-0">
                <Flex alignItems="start">
                  <div className="truncate">
                    <Text className="text-purple-100">Week Progress</Text>
                    <Metric className="text-white">73%</Metric>
                  </div>
                  <BarChart3 className="h-8 w-8 text-purple-200" />
                </Flex>
                <BadgeDelta deltaType="moderateIncrease" className="mt-2">
                  +5% from last week
                </BadgeDelta>
              </Card>
            </motion.div>

            <motion.div variants={fadeIn}>
              <Card className="bg-gradient-to-br from-orange-500 to-red-600 text-white border-0">
                <Flex alignItems="start">
                  <div className="truncate">
                    <Text className="text-orange-100">Cost Impact</Text>
                    <Metric className="text-white">$1,247</Metric>
                  </div>
                  <Zap className="h-8 w-8 text-orange-200" />
                </Flex>
                <BadgeDelta deltaType="moderateDecrease" className="mt-2">
                  -12% cost reduction
                </BadgeDelta>
              </Card>
            </motion.div>
          </motion.div>

          {/* Time Range Selector */}
          <motion.div
            variants={fadeIn}
            className="flex items-center space-x-2 mb-6"
          >
            <Text className="text-gray-600 mr-2">Time Range:</Text>
            {["1h", "6h", "24h", "7d", "30d"].map((range) => (
              <Button
                key={range}
                onClick={() => setSelectedTimeRange(range)}
                variant={selectedTimeRange === range ? "default" : "outline"}
                size="sm"
              >
                {range}
              </Button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Main Dashboard */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Grid
            numItems={1}
            numItemsSm={2}
            numItemsLg={3}
            className="gap-6 mb-8"
          >
            {/* Real-time Emissions Chart */}
            <Card className="col-span-2">
              <Title>Real-Time Emissions Tracking</Title>
              <Text>Live carbon emissions over time</Text>
              <AreaChart
                className="h-80 mt-4"
                data={realtimeData}
                index="time"
                categories={["emissions"]}
                colors={["green"]}
                valueFormatter={(number) => `${number.toFixed(1)} tCO₂e`}
                showLegend={false}
                showGridLines={true}
                curveType="monotone"
                yAxisWidth={60}
              />
            </Card>

            {/* Emission Sources Breakdown */}
            <Card>
              <Title>Emission Sources</Title>
              <Text>Current distribution by source</Text>
              <DonutChart
                className="h-80 mt-4"
                data={emissionSources}
                category="value"
                index="name"
                colors={["emerald", "blue", "amber", "rose"]}
                valueFormatter={(number) => `${number}%`}
                showLabel={true}
                showAnimation={true}
              />
            </Card>

            {/* Daily Comparison */}
            <Card className="col-span-2">
              <Title>Weekly Comparison</Title>
              <Text>Current vs previous week emissions</Text>
              <BarChart
                className="h-80 mt-4"
                data={dailyComparison}
                index="day"
                categories={["current", "previous"]}
                colors={["green", "gray"]}
                valueFormatter={(number) => `${number} tCO₂e`}
                showLegend={true}
                yAxisWidth={60}
              />
            </Card>

            {/* Alerts and Notifications */}
            <Card>
              <Title>Recent Alerts</Title>
              <Text>Latest system notifications</Text>
              <div className="h-80 mt-4 space-y-4">
                <AnimatePresence>
                  {alerts.map((alert) => (
                    <motion.div
                      key={alert.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className={`p-4 rounded-lg border-l-4 ${
                        alert.type === "warning"
                          ? "bg-yellow-50 border-yellow-400"
                          : alert.type === "success"
                          ? "bg-green-50 border-green-400"
                          : "bg-blue-50 border-blue-400"
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        {alert.type === "warning" && (
                          <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                        )}
                        {alert.type === "success" && (
                          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                        )}
                        {alert.type === "info" && (
                          <Activity className="h-5 w-5 text-blue-600 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {alert.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {alert.time}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </Card>

            {/* Environmental Factors */}
            <Card className="col-span-1 lg:col-span-3">
              <Title>Environmental Factors</Title>
              <Text>Temperature and humidity correlation with emissions</Text>
              <LineChart
                className="h-80 mt-4"
                data={realtimeData}
                index="time"
                categories={["temperature", "humidity"]}
                colors={["red", "blue"]}
                valueFormatter={(number) => `${number.toFixed(1)}°`}
                showLegend={true}
                yAxisWidth={60}
              />
            </Card>
          </Grid>
        </div>
      </section>

      {/* Action Buttons */}
      <section className="py-8 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4"
            >
              <Zap className="h-5 w-5 mr-2" />
              Generate Report
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-green-200 text-green-700 hover:bg-green-50 px-8 py-4"
            >
              <BarChart3 className="h-5 w-5 mr-2" />
              Export Data
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-green-200 text-green-700 hover:bg-green-50 px-8 py-4"
            >
              <Globe className="h-5 w-5 mr-2" />
              Share Dashboard
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
