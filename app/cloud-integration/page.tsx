"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart as RechartsLineChart,
  Line as RechartsLine,
  PieChart as RechartsPieChart,
  Pie as RechartsPie,
  Cell as RechartsCell,
  XAxis as RechartsXAxis,
  YAxis as RechartsYAxis,
  CartesianGrid as RechartsCartesianGrid,
  Tooltip as RechartsTooltip,
  Legend as RechartsLegend,
  ResponsiveContainer as RechartsResponsiveContainer,
} from "recharts";
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
  Cloud,
  Database,
  Zap,
  Shield,
  Settings,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Clock,
  ArrowLeft,
  Link2,
  Wifi,
  Server,
  Download,
  Upload,
  GitBranch,
  Monitor,
  Lock,
  Globe,
  TrendingUp,
  Plus,
  Users,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

// Mock data for cloud integrations
const integrationsData = [
  {
    name: "AWS S3",
    status: "connected",
    dataFlow: 145.2,
    lastSync: "2 min ago",
    uptime: 99.9,
    category: "Storage",
    color: "orange",
  },
  {
    name: "Azure SQL",
    status: "connected",
    dataFlow: 89.7,
    lastSync: "1 min ago",
    uptime: 99.8,
    category: "Database",
    color: "blue",
  },
  {
    name: "Google Analytics",
    status: "warning",
    dataFlow: 23.1,
    lastSync: "15 min ago",
    uptime: 98.5,
    category: "Analytics",
    color: "green",
  },
  {
    name: "Salesforce",
    status: "connected",
    dataFlow: 67.4,
    lastSync: "3 min ago",
    uptime: 99.7,
    category: "CRM",
    color: "blue",
  },
  {
    name: "SAP ERP",
    status: "disconnected",
    dataFlow: 0,
    lastSync: "2 hours ago",
    uptime: 0,
    category: "ERP",
    color: "red",
  },
  {
    name: "Slack",
    status: "connected",
    dataFlow: 12.8,
    lastSync: "30 sec ago",
    uptime: 99.9,
    category: "Communication",
    color: "purple",
  },
];

const dataFlowHistory = [
  { time: "00:00", inbound: 145, outbound: 89, total: 234 },
  { time: "04:00", inbound: 98, outbound: 67, total: 165 },
  { time: "08:00", inbound: 287, outbound: 156, total: 443 },
  { time: "12:00", inbound: 356, outbound: 198, total: 554 },
  { time: "16:00", inbound: 423, outbound: 234, total: 657 },
  { time: "20:00", inbound: 298, outbound: 167, total: 465 },
  { time: "24:00", inbound: 156, outbound: 98, total: 254 },
];

const categoryBreakdown = [
  { category: "Storage", connections: 3, dataVolume: 456.8, color: "orange" },
  { category: "Database", connections: 2, dataVolume: 234.5, color: "blue" },
  { category: "Analytics", connections: 4, dataVolume: 123.7, color: "green" },
  { category: "CRM", connections: 1, dataVolume: 189.2, color: "purple" },
  { category: "ERP", connections: 2, dataVolume: 67.4, color: "red" },
  {
    category: "Communication",
    connections: 3,
    dataVolume: 45.9,
    color: "indigo",
  },
];

const performanceMetrics = [
  {
    metric: "API Response Time",
    value: 245,
    unit: "ms",
    trend: "down",
    target: 200,
  },
  {
    metric: "Data Throughput",
    value: 1.2,
    unit: "GB/s",
    trend: "up",
    target: 1.0,
  },
  { metric: "Error Rate", value: 0.02, unit: "%", trend: "down", target: 0.01 },
  { metric: "Availability", value: 99.7, unit: "%", trend: "up", target: 99.9 },
];

const integrationSteps = [
  {
    step: 1,
    title: "Connect Data Source",
    description: "Add your first data source to EcoMetrics",
    status: "completed",
    icon: <Database className="h-5 w-5" />,
  },
  {
    step: 2,
    title: "Configure Authentication",
    description: "Set up secure API keys and OAuth",
    status: "completed",
    icon: <Lock className="h-5 w-5" />,
  },
  {
    step: 3,
    title: "Map Data Fields",
    description: "Configure data field mappings",
    status: "in-progress",
    icon: <GitBranch className="h-5 w-5" />,
  },
  {
    step: 4,
    title: "Test Integration",
    description: "Run initial data sync test",
    status: "pending",
    icon: <Wifi className="h-5 w-5" />,
  },
  {
    step: 5,
    title: "Go Live",
    description: "Activate continuous data flow",
    status: "pending",
    icon: <CheckCircle className="h-5 w-5" />,
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "connected":
      return "text-green-600 bg-green-100";
    case "warning":
      return "text-yellow-600 bg-yellow-100";
    case "disconnected":
      return "text-red-600 bg-red-100";
    case "error":
      return "text-red-600 bg-red-100";
    default:
      return "text-gray-600 bg-gray-100";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "connected":
      return <CheckCircle className="h-4 w-4" />;
    case "warning":
      return <AlertCircle className="h-4 w-4" />;
    case "disconnected":
      return <Clock className="h-4 w-4" />;
    case "error":
      return <AlertCircle className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
};

const getTrendIcon = (trend: string) => {
  if (trend === "up") return <TrendingUp className="h-4 w-4" />;
  return <TrendingUp className="h-4 w-4 rotate-180" />;
};

export default function CloudIntegrationPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeTab, setActiveTab] = useState(0);
  const { user } = useAuth();

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

  const getDeltaType = (current: number, target: number) => {
    if (current < target && target > 0) return "moderateDecrease";
    if (current > target) return "moderateIncrease";
    return "unchanged";
  };

  const connectedIntegrations = integrationsData.filter(
    (i) => i.status === "connected"
  ).length;
  const totalIntegrations = integrationsData.length;
  const totalDataFlow = integrationsData.reduce(
    (sum, i) => sum + i.dataFlow,
    0
  );
  const averageUptime =
    integrationsData.reduce((sum, i) => sum + i.uptime, 0) /
    integrationsData.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-sky-50">
      {/* Back button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Link
          href="/"
          className="inline-flex items-center text-gray-600 hover:text-green-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Home
        </Link>
      </div>

      {/* Dashboard Header */}
      <section className="py-8 bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800">
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
                  Cloud Integration
                </h1>
                <p className="text-lg text-gray-600">
                  Connect your existing systems for seamless data
                  synchronization
                </p>
              </div>
              <div className="flex items-center space-x-4 mt-4 lg:mt-0">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-green-200 text-green-700 hover:bg-green-50"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Setup Guide
                </Button>
                <Button
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Integration
                </Button>
              </div>
            </motion.div>
          </motion.div>

          {/* Summary Cards */}
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerChildren}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            <motion.div variants={fadeIn}>
              <UICard className="bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="truncate">
                      <p className="text-green-100 text-sm font-medium">
                        Active Connections
                      </p>
                      <p className="text-white text-2xl font-bold mt-1">
                        {connectedIntegrations}/{totalIntegrations}
                      </p>
                    </div>
                    <Link2 className="h-8 w-8 text-green-200" />
                  </div>
                  <div className="mt-4">
                    <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white/20 text-white border border-white/30">
                      +2 this month
                    </div>
                  </div>
                </CardContent>
              </UICard>
            </motion.div>

            <motion.div variants={fadeIn}>
              <UICard className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="truncate">
                      <p className="text-blue-100 text-sm font-medium">
                        Data Flow
                      </p>
                      <p className="text-white text-2xl font-bold mt-1">
                        {totalDataFlow.toFixed(1)} MB/s
                      </p>
                    </div>
                    <Download className="h-8 w-8 text-blue-200" />
                  </div>
                  <div className="mt-4">
                    <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white/20 text-white border border-white/30">
                      +15% vs last week
                    </div>
                  </div>
                </CardContent>
              </UICard>
            </motion.div>

            <motion.div variants={fadeIn}>
              <UICard className="bg-gradient-to-br from-purple-500 to-pink-600 text-white border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="truncate">
                      <p className="text-purple-100 text-sm font-medium">
                        System Uptime
                      </p>
                      <p className="text-white text-2xl font-bold mt-1">
                        {averageUptime.toFixed(1)}%
                      </p>
                    </div>
                    <Monitor className="h-8 w-8 text-purple-200" />
                  </div>
                  <div className="mt-4">
                    <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white/20 text-white border border-white/30">
                      -0.1% from target
                    </div>
                  </div>
                </CardContent>
              </UICard>
            </motion.div>

            <motion.div variants={fadeIn}>
              <UICard className="bg-gradient-to-br from-orange-500 to-red-600 text-white border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="truncate">
                      <p className="text-orange-100 text-sm font-medium">
                        Avg Response Time
                      </p>
                      <p className="text-white text-2xl font-bold mt-1">
                        245 ms
                      </p>
                    </div>
                    <Zap className="h-8 w-8 text-orange-200" />
                  </div>
                  <div className="mt-4">
                    <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white/20 text-white border border-white/30">
                      -12% improvement
                    </div>
                  </div>
                </CardContent>
              </UICard>
            </motion.div>
          </motion.div>

          {/* Alerts */}
          <motion.div variants={fadeIn} className="mb-6">
            <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start">
                <Shield className="h-5 w-5 text-yellow-600 mr-3 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-yellow-900 mb-1">
                    Integration Health Check
                  </h3>
                  <p className="text-sm text-yellow-800">
                    1 integration requires attention: Google Analytics sync
                    delayed by 15 minutes
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Dashboard */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="flex space-x-2 mb-8 border-b border-gray-200">
              {["Overview", "Integrations", "Setup Guide", "Performance"].map(
                (tab, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTab(index)}
                    className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                      activeTab === index
                        ? "border-green-600 text-green-600"
                        : "border-transparent text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {tab}
                  </button>
                )
              )}
            </div>

            <div>
              {/* Overview Tab */}
              {activeTab === 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {/* Data Flow Chart */}
                  <UICard className="col-span-2 bg-white border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold text-gray-900">
                        Real-time Data Flow
                      </CardTitle>
                      <CardDescription>
                        Incoming and outgoing data volumes
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <RechartsResponsiveContainer width="100%" height="100%">
                          <RechartsLineChart
                            data={dataFlowHistory}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                          >
                            <RechartsCartesianGrid
                              strokeDasharray="3 3"
                              stroke="#f0f0f0"
                            />
                            <RechartsXAxis
                              dataKey="time"
                              tick={{ fontSize: 12, fill: "#666" }}
                              axisLine={{ stroke: "#e0e0e0" }}
                              tickLine={{ stroke: "#e0e0e0" }}
                            />
                            <RechartsYAxis
                              tick={{ fontSize: 12, fill: "#666" }}
                              axisLine={{ stroke: "#e0e0e0" }}
                              tickLine={{ stroke: "#e0e0e0" }}
                              width={60}
                              tickFormatter={(value) => `${value} MB/s`}
                            />
                            <RechartsTooltip
                              formatter={(value) => [`${value} MB/s`, ""]}
                              labelStyle={{ color: "#333", fontWeight: "bold" }}
                              contentStyle={{
                                backgroundColor: "white",
                                border: "1px solid #e0e0e0",
                                borderRadius: "8px",
                                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                              }}
                            />
                            <RechartsLegend />
                            <RechartsLine
                              type="monotone"
                              dataKey="inbound"
                              stroke="#6366f1"
                              strokeWidth={3}
                              dot={{ fill: "#6366f1", strokeWidth: 2, r: 4 }}
                              activeDot={{
                                r: 6,
                                fill: "#6366f1",
                                stroke: "#fff",
                                strokeWidth: 2,
                              }}
                              name="Inbound"
                            />
                            <RechartsLine
                              type="monotone"
                              dataKey="outbound"
                              stroke="#10b981"
                              strokeWidth={3}
                              dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                              activeDot={{
                                r: 6,
                                fill: "#10b981",
                                stroke: "#fff",
                                strokeWidth: 2,
                              }}
                              name="Outbound"
                            />
                            <RechartsLine
                              type="monotone"
                              dataKey="total"
                              stroke="#f59e0b"
                              strokeWidth={3}
                              dot={{ fill: "#f59e0b", strokeWidth: 2, r: 4 }}
                              activeDot={{
                                r: 6,
                                fill: "#f59e0b",
                                stroke: "#fff",
                                strokeWidth: 2,
                              }}
                              name="Total"
                            />
                          </RechartsLineChart>
                        </RechartsResponsiveContainer>
                      </div>
                    </CardContent>
                  </UICard>

                  {/* Category Breakdown */}
                  <UICard className="bg-white border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold text-gray-900">
                        Data by Category
                      </CardTitle>
                      <CardDescription>
                        Volume distributed across integration types
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <RechartsResponsiveContainer width="100%" height="100%">
                          <RechartsPieChart>
                            <RechartsPie
                              data={categoryBreakdown}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={100}
                              paddingAngle={5}
                              dataKey="dataVolume"
                              label={({ category, percent }) =>
                                `${category}: ${(Number(percent) * 100).toFixed(
                                  0
                                )}%`
                              }
                              labelLine={false}
                            >
                              {categoryBreakdown.map((entry, index) => (
                                <RechartsCell
                                  key={`cell-${index}`}
                                  fill={
                                    [
                                      "#f43f5e",
                                      "#6366f1",
                                      "#10b981",
                                      "#8b5cf6",
                                      "#f59e0b",
                                      "#06b6d4",
                                    ][index]
                                  }
                                />
                              ))}
                            </RechartsPie>
                            <RechartsTooltip
                              formatter={(value) => [
                                `${Number(value).toFixed(1)} GB`,
                                "Data Volume",
                              ]}
                              labelStyle={{ color: "#333", fontWeight: "bold" }}
                              contentStyle={{
                                backgroundColor: "white",
                                border: "1px solid #e0e0e0",
                                borderRadius: "8px",
                                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                              }}
                            />
                          </RechartsPieChart>
                        </RechartsResponsiveContainer>
                      </div>
                    </CardContent>
                  </UICard>

                  {/* System Status */}
                  <UICard className="col-span-1 lg:col-span-3 bg-white border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold text-gray-900">
                        Integration Status
                      </CardTitle>
                      <CardDescription>
                        Real-time status of all connected systems
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {integrationsData.map((integration, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <h3 className="font-semibold text-gray-900">
                                {integration.name}
                              </h3>
                              <div
                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                  integration.status
                                )}`}
                              >
                                {getStatusIcon(integration.status)}
                                <span className="ml-1 capitalize">
                                  {integration.status}
                                </span>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">
                                  Data Flow:
                                </span>
                                <span className="font-medium">
                                  {integration.dataFlow.toFixed(1)} MB/s
                                </span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">
                                  Last Sync:
                                </span>
                                <span className="font-medium">
                                  {integration.lastSync}
                                </span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Uptime:</span>
                                <span className="font-medium">
                                  {integration.uptime}%
                                </span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Category:</span>
                                <span className="font-medium">
                                  {integration.category}
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </UICard>
                </div>
              )}

              {/* Integrations Tab */}
              {activeTab === 1 && (
                <UICard className="bg-white border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-900">
                      Manage Integrations
                    </CardTitle>
                    <CardDescription>
                      Configure and monitor all your data source connections
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center flex-wrap gap-2 mb-6">
                      <p className="text-gray-600 text-sm">
                        Filter by category:
                      </p>
                      <button
                        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                          selectedCategory === "all"
                            ? "bg-green-600 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                        onClick={() => setSelectedCategory("all")}
                      >
                        All
                      </button>
                      {[
                        "Storage",
                        "Database",
                        "Analytics",
                        "CRM",
                        "ERP",
                        "Communication",
                      ].map((category) => (
                        <button
                          key={category}
                          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                            selectedCategory === category
                              ? "bg-green-600 text-white"
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }`}
                          onClick={() => setSelectedCategory(category)}
                        >
                          {category}
                        </button>
                      ))}
                    </div>

                    <div className="space-y-4">
                      {integrationsData
                        .filter(
                          (integration) =>
                            selectedCategory === "all" ||
                            integration.category === selectedCategory
                        )
                        .map((integration, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex items-center justify-between p-6 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-center space-x-4">
                              <div
                                className={`p-3 rounded-lg ${
                                  integration.color === "orange"
                                    ? "bg-orange-100 text-orange-600"
                                    : integration.color === "blue"
                                      ? "bg-blue-100 text-blue-600"
                                      : integration.color === "green"
                                        ? "bg-green-100 text-green-600"
                                        : integration.color === "purple"
                                          ? "bg-purple-100 text-purple-600"
                                          : integration.color === "red"
                                            ? "bg-red-100 text-red-600"
                                            : "bg-indigo-100 text-indigo-600"
                                }`}
                              >
                                {integration.category === "Storage" && (
                                  <Server className="h-6 w-6" />
                                )}
                                {integration.category === "Database" && (
                                  <Database className="h-6 w-6" />
                                )}
                                {integration.category === "Analytics" && (
                                  <Monitor className="h-6 w-6" />
                                )}
                                {integration.category === "CRM" && (
                                  <Users className="h-6 w-6" />
                                )}
                                {integration.category === "ERP" && (
                                  <Settings className="h-6 w-6" />
                                )}
                                {integration.category === "Communication" && (
                                  <Globe className="h-6 w-6" />
                                )}
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900">
                                  {integration.name}
                                </h3>
                                <p className="text-sm text-gray-600">
                                  {integration.category}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center space-x-6">
                              <div className="text-center">
                                <div className="text-lg font-bold text-gray-900">
                                  {integration.dataFlow.toFixed(1)}
                                </div>
                                <div className="text-xs text-gray-600">
                                  MB/s
                                </div>
                              </div>
                              <div className="text-center">
                                <div className="text-lg font-bold text-gray-900">
                                  {integration.uptime}%
                                </div>
                                <div className="text-xs text-gray-600">
                                  Uptime
                                </div>
                              </div>
                              <div
                                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                                  integration.status
                                )}`}
                              >
                                {getStatusIcon(integration.status)}
                                <span className="ml-2 capitalize">
                                  {integration.status}
                                </span>
                              </div>
                              <Button variant="outline" size="sm">
                                <Settings className="h-4 w-4 mr-2" />
                                Configure
                              </Button>
                            </div>
                          </motion.div>
                        ))}
                    </div>
                  </CardContent>
                </UICard>
              )}

              {/* Setup Guide Tab */}
              {activeTab === 2 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  {/* Setup Steps */}
                  <UICard className="bg-white border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold text-gray-900">
                        Integration Setup
                      </CardTitle>
                      <CardDescription>
                        Follow these steps to connect your first data source
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {integrationSteps.map((step, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-start space-x-4"
                          >
                            <div
                              className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                                step.status === "completed"
                                  ? "bg-green-100 text-green-600"
                                  : step.status === "in-progress"
                                    ? "bg-blue-100 text-blue-600"
                                    : "bg-gray-100 text-gray-400"
                              }`}
                            >
                              {step.status === "completed" ? (
                                <CheckCircle className="h-5 w-5" />
                              ) : (
                                step.step
                              )}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900">
                                {step.title}
                              </h3>
                              <p className="text-sm text-gray-600 mb-2">
                                {step.description}
                              </p>
                              {step.status === "in-progress" && (
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-blue-600 h-2 rounded-full"
                                    style={{ width: "60%" }}
                                  ></div>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </UICard>

                  {/* Quick Setup Options */}
                  <UICard className="bg-white border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold text-gray-900">
                        Quick Setup Options
                      </CardTitle>
                      <CardDescription>
                        Popular integrations ready to connect
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          {
                            name: "AWS S3",
                            description: "Cloud storage for emissions data",
                            popular: true,
                          },
                          {
                            name: "Google Analytics",
                            description: "Website and app analytics",
                            popular: true,
                          },
                          {
                            name: "Salesforce",
                            description: "Customer relationship management",
                            popular: false,
                          },
                          {
                            name: "SAP ERP",
                            description: "Enterprise resource planning",
                            popular: true,
                          },
                          {
                            name: "Slack",
                            description: "Team communication platform",
                            popular: false,
                          },
                        ].map((integration, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                          >
                            <div>
                              <h3 className="font-semibold text-gray-900">
                                {integration.name}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {integration.description}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              {integration.popular && (
                                <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full">
                                  Popular
                                </span>
                              )}
                              <Button size="sm">Connect</Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </UICard>
                </div>
              )}

              {/* Performance Tab */}
              {activeTab === 3 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  {/* Performance Metrics */}
                  <UICard className="bg-white border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold text-gray-900">
                        System Performance
                      </CardTitle>
                      <CardDescription>
                        Real-time performance indicators
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {performanceMetrics.map((metric, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                          >
                            <div>
                              <h3 className="font-semibold text-gray-900">
                                {metric.metric}
                              </h3>
                              <p className="text-sm text-gray-600">
                                Target: {metric.target}
                                {metric.unit}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center space-x-2">
                                <span className="text-2xl font-bold text-gray-900">
                                  {typeof metric.value === "number" &&
                                  metric.value % 1 !== 0
                                    ? metric.value.toFixed(2)
                                    : metric.value}
                                </span>
                                <span className="text-sm text-gray-600">
                                  {metric.unit}
                                </span>
                              </div>
                              <div
                                className={`flex items-center text-sm ${
                                  metric.trend === "up"
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                              >
                                {getTrendIcon(metric.trend)}
                                <span className="ml-1">vs target</span>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </UICard>

                  {/* Recent Activity */}
                  <UICard className="bg-white border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold text-gray-900">
                        Recent Activity
                      </CardTitle>
                      <CardDescription>
                        Latest integration events and updates
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          {
                            time: "2 min ago",
                            event: "Data sync completed",
                            source: "AWS S3",
                            status: "success",
                          },
                          {
                            time: "5 min ago",
                            event: "API rate limit warning",
                            source: "Google Analytics",
                            status: "warning",
                          },
                          {
                            time: "12 min ago",
                            event: "Connection established",
                            source: "Azure SQL",
                            status: "success",
                          },
                          {
                            time: "1 hour ago",
                            event: "Integration configured",
                            source: "Salesforce",
                            status: "info",
                          },
                          {
                            time: "2 hours ago",
                            event: "Data mapping updated",
                            source: "Slack",
                            status: "info",
                          },
                          {
                            time: "3 hours ago",
                            event: "Sync failed",
                            source: "SAP ERP",
                            status: "error",
                          },
                        ].map((activity, index) => (
                          <div
                            key={index}
                            className="flex items-start space-x-3"
                          >
                            <div
                              className={`w-2 h-2 rounded-full mt-2 ${
                                activity.status === "success"
                                  ? "bg-green-500"
                                  : activity.status === "warning"
                                    ? "bg-yellow-500"
                                    : activity.status === "error"
                                      ? "bg-red-500"
                                      : "bg-blue-500"
                              }`}
                            ></div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">
                                {activity.event}
                              </p>
                              <p className="text-xs text-gray-600">
                                {activity.source} • {activity.time}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </UICard>
                </div>
              )}
            </div>
          </div>
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
              <RefreshCw className="h-5 w-5 mr-2" />
              Refresh Connections
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-green-200 text-green-700 hover:bg-green-50 px-8 py-4"
            >
              <Download className="h-5 w-5 mr-2" />
              Export Logs
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-green-200 text-green-700 hover:bg-green-50 px-8 py-4"
            >
              <Settings className="h-5 w-5 mr-2" />
              System Settings
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
