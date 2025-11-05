"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import {
  BarChart as RechartsBarChart,
  Bar,
  AreaChart as RechartsAreaChart,
  Area,
  LineChart as RechartsLineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
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

// Mock data for real-time tracking - Enhanced for demo
const realtimeData = [
  { time: "00:00", emissions: 189.2, temperature: 22.1, humidity: 68 },
  { time: "04:00", emissions: 156.8, temperature: 21.3, humidity: 71 },
  { time: "08:00", emissions: 298.4, temperature: 23.7, humidity: 59 },
  { time: "12:00", emissions: 412.6, temperature: 25.8, humidity: 54 },
  { time: "16:00", emissions: 487.3, temperature: 27.2, humidity: 52 },
  { time: "20:00", emissions: 334.7, temperature: 24.9, humidity: 58 },
  { time: "24:00", emissions: 221.5, temperature: 23.1, humidity: 62 },
];

const emissionSources = [
  { name: "Solar Power", value: 38, color: "#22c55e" },
  { name: "Fleet Vehicles", value: 24, color: "#3b82f6" },
  { name: "Manufacturing", value: 22, color: "#f59e0b" },
  { name: "Grid Electricity", value: 16, color: "#ef4444" },
];

const dailyComparison = [
  { day: "Mon", current: 234, previous: 287 },
  { day: "Tue", current: 198, previous: 241 },
  { day: "Wed", current: 276, previous: 318 },
  { day: "Thu", current: 312, previous: 356 },
  { day: "Fri", current: 389, previous: 441 },
  { day: "Sat", current: 267, previous: 298 },
  { day: "Sun", current: 223, previous: 256 },
];

const alerts = [
  {
    id: 1,
    type: "success",
    message: "Solar panel efficiency increased to 94% - Record performance!",
    time: "5 minutes ago",
  },
  {
    id: 2,
    type: "success",
    message: "Carbon reduction target 23% ahead of schedule",
    time: "12 minutes ago",
  },
  {
    id: 3,
    type: "info",
    message: "New IoT sensors deployed in Manufacturing Plant B",
    time: "34 minutes ago",
  },
  {
    id: 4,
    type: "success",
    message: "Electric vehicle fleet saved R45,200 this month",
    time: "1 hour ago",
  },
];

export default function RealTimeCarbonTrackingPage() {
  const [currentEmissions, setCurrentEmissions] = useState(245.8);
  const [selectedTimeRange, setSelectedTimeRange] = useState("24h");
  const [isLive, setIsLive] = useState(true);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  // Import the report generator functions
  const {
    generateCarbonTrackingReport,
    captureElementAsImage,
  } = require("@/lib/reportGenerator");
  const { motion, AnimatePresence } = require("framer-motion");
  const { Zap } = require("lucide-react");
  const { Download, Image: ImageIcon } = require("lucide-react");
  const { Button } = require("@/components/ui/button");

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

  const handleGenerateReport = async () => {
    setIsGeneratingReport(true);
    try {
      const reportData = {
        currentEmissions,
        emissionSources,
        dailyComparison,
        alerts,
      };
      await generateCarbonTrackingReport(reportData);
    } catch (error) {
      console.error("Error generating report:", error);
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const handleExportData = async () => {
    setIsGeneratingReport(true);
    try {
      await captureElementAsImage(
        "real-time-dashboard",
        `carbon-tracking-dashboard-${new Date().toISOString().split("T")[0]}`
      );
    } catch (error) {
      console.error("Error exporting dashboard:", error);
    } finally {
      setIsGeneratingReport(false);
    }
  };

  return (
    <div
      id="real-time-dashboard"
      className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-sky-50"
    >
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
                    <Metric className="text-white">R23,070</Metric>
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
              <div className="h-80 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsAreaChart
                    data={realtimeData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis
                      dataKey="time"
                      stroke="#6b7280"
                      style={{ fontSize: "12px" }}
                    />
                    <YAxis
                      stroke="#6b7280"
                      style={{ fontSize: "12px" }}
                      label={{
                        value: "Emissions (tCO₂e)",
                        angle: -90,
                        position: "insideLeft",
                        style: { fontSize: "12px", fill: "#6b7280" },
                      }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                      }}
                      formatter={(value: number) => [
                        `${value.toFixed(1)} tCO₂e`,
                        "Emissions",
                      ]}
                      labelStyle={{ fontWeight: 600, marginBottom: "4px" }}
                    />
                    <Area
                      type="monotone"
                      dataKey="emissions"
                      stroke="#10b981"
                      fill="#10b981"
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                  </RechartsAreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Emission Sources Breakdown */}
            <Card>
              <Title>Emission Sources</Title>
              <Text>Current distribution by source</Text>
              <div className="h-80 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                      }}
                      formatter={(value: number) => [`${value}%`, "Percentage"]}
                    />
                    <Legend
                      wrapperStyle={{ paddingTop: "20px" }}
                      formatter={(value: string) => value}
                    />
                    <Pie
                      data={emissionSources}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {emissionSources.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Daily Comparison */}
            <Card className="col-span-2">
              <Title>Weekly Comparison</Title>
              <Text>Current vs previous week emissions</Text>
              <div className="h-80 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart
                    data={dailyComparison}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis
                      dataKey="day"
                      stroke="#6b7280"
                      style={{ fontSize: "12px" }}
                    />
                    <YAxis
                      stroke="#6b7280"
                      style={{ fontSize: "12px" }}
                      label={{
                        value: "Emissions (tCO₂e)",
                        angle: -90,
                        position: "insideLeft",
                        style: { fontSize: "12px", fill: "#6b7280" },
                      }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                      }}
                      formatter={(value: number) => [`${value} tCO₂e`, ""]}
                      labelStyle={{ fontWeight: 600, marginBottom: "4px" }}
                    />
                    <Legend
                      wrapperStyle={{ paddingTop: "20px" }}
                      formatter={(value) =>
                        value === "current" ? "Current Week" : "Previous Week"
                      }
                    />
                    <Bar
                      dataKey="current"
                      fill="#10b981"
                      name="Current Week"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="previous"
                      fill="#f59e0b"
                      name="Previous Week"
                      radius={[4, 4, 0, 0]}
                    />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Alerts and Notifications */}
            <Card>
              <Title>Recent Alerts</Title>
              <Text>Latest system notifications</Text>
              <div className="h-80 mt-4 space-y-4">
                <AnimatePresence>
                  {alerts.slice(0, 3).map((alert) => (
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
              <div className="h-80 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart
                    data={realtimeData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis
                      dataKey="time"
                      stroke="#6b7280"
                      style={{ fontSize: "12px" }}
                    />
                    <YAxis
                      stroke="#6b7280"
                      style={{ fontSize: "12px" }}
                      label={{
                        value: "Values",
                        angle: -90,
                        position: "insideLeft",
                        style: { fontSize: "12px", fill: "#6b7280" },
                      }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                      }}
                      formatter={(value: number, name: string) => {
                        if (name === "temperature")
                          return [`${value.toFixed(1)}°C`, "Temperature"];
                        if (name === "humidity")
                          return [`${Math.round(value)}%`, "Humidity"];
                        return [value, name];
                      }}
                    />
                    <Legend
                      wrapperStyle={{ paddingTop: "20px" }}
                      formatter={(value: string) =>
                        value === "temperature"
                          ? "Temperature"
                          : value === "humidity"
                          ? "Humidity"
                          : value
                      }
                    />
                    <Line
                      type="monotone"
                      dataKey="temperature"
                      stroke="#f43f5e"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="humidity"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
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
              onClick={handleGenerateReport}
              disabled={isGeneratingReport}
            >
              <Zap className="h-5 w-5 mr-2" />
              {isGeneratingReport ? "Generating..." : "Generate Report"}
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-green-200 text-green-700 hover:bg-green-50 px-8 py-4"
              onClick={handleExportData}
              disabled={isGeneratingReport}
            >
              <ImageIcon className="h-5 w-5 mr-2" />
              {isGeneratingReport ? "Exporting..." : "Export Dashboard"}
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-green-200 text-green-700 hover:bg-green-50 px-8 py-4"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: "Carbon Tracking Dashboard",
                    text: "View our real-time carbon emissions tracking dashboard",
                    url: window.location.href,
                  });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  alert("Dashboard URL copied to clipboard!");
                }
              }}
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
