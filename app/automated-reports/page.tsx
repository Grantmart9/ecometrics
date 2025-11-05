"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AreaChart as RechartsAreaChart,
  Area as RechartsArea,
  BarChart as RechartsBarChart,
  Bar as RechartsBar,
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
import { Button as UIButton } from "@/components/ui/button";
import {
  Card as UICard,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ReportScheduleDialog } from "@/components/report-schedule-dialog";
import { RecipientsManagementDialog } from "@/components/recipients-management-dialog";
import Link from "next/link";
import {
  Leaf,
  FileText,
  Download,
  Calendar,
  BarChart3,
  TrendingUp,
  Users,
  Clock,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Play,
  Pause,
  Settings,
  Filter,
  RefreshCw,
} from "lucide-react";
import { generateAutomatedReportsSummary } from "@/lib/reportGenerator";

// Mock data for automated reports
const reportHistory = [
  {
    id: 1,
    name: "Monthly Carbon Report",
    type: "Monthly",
    status: "completed",
    generated: "2024-01-15",
    size: "2.4 MB",
    recipients: 5,
  },
  {
    id: 2,
    name: "Weekly Performance",
    type: "Weekly",
    status: "processing",
    generated: "2024-01-14",
    size: "1.8 MB",
    recipients: 3,
  },
  {
    id: 3,
    name: "Quarterly Sustainability",
    type: "Quarterly",
    status: "completed",
    generated: "2024-01-12",
    size: "5.2 MB",
    recipients: 8,
  },
  {
    id: 4,
    name: "Annual ESG Report",
    type: "Annual",
    status: "scheduled",
    generated: "2024-01-20",
    size: "N/A",
    recipients: 12,
  },
];

const emissionsTrend = [
  { month: "Jan 2023", total: 1240, scope1: 380, scope2: 520, scope3: 340 },
  { month: "Feb 2023", total: 1180, scope1: 360, scope2: 490, scope3: 330 },
  { month: "Mar 2023", total: 1320, scope1: 420, scope2: 550, scope3: 350 },
  { month: "Apr 2023", total: 1150, scope1: 340, scope2: 480, scope3: 330 },
  { month: "May 2023", total: 1090, scope1: 320, scope2: 450, scope3: 320 },
  { month: "Jun 2023", total: 980, scope1: 290, scope2: 400, scope3: 290 },
  { month: "Jul 2023", total: 875, scope1: 260, scope2: 370, scope3: 245 },
  { month: "Aug 2023", total: 820, scope1: 240, scope2: 350, scope3: 230 },
  { month: "Sep 2023", total: 765, scope1: 220, scope2: 330, scope3: 215 },
  { month: "Oct 2023", total: 720, scope1: 200, scope2: 310, scope3: 210 },
  { month: "Nov 2023", total: 685, scope1: 185, scope2: 295, scope3: 205 },
  { month: "Dec 2023", total: 650, scope1: 170, scope2: 280, scope3: 200 },
];

const departmentEmissions = [
  { department: "Manufacturing", emissions: 450, target: 500, status: "below" },
  {
    department: "Transportation",
    emissions: 320,
    target: 350,
    status: "below",
  },
  { department: "Facilities", emissions: 280, target: 250, status: "above" },
  {
    department: "Office Operations",
    emissions: 150,
    target: 180,
    status: "below",
  },
  { department: "Supply Chain", emissions: 200, target: 220, status: "below" },
];

const kpiData = [
  {
    name: "Carbon Intensity",
    value: "198.4",
    unit: "tCO₂e/R",
    target: "260",
    trend: "down",
  },
  {
    name: "Energy Efficiency",
    value: "94.2",
    unit: "%",
    target: "85",
    trend: "up",
  },
  {
    name: "Renewable Energy",
    value: "87.6",
    unit: "%",
    target: "70",
    trend: "up",
  },
  {
    name: "Waste Diversion",
    value: "92.3",
    unit: "%",
    target: "80",
    trend: "up",
  },
];

const monthlyComparison = [
  { month: "Jan", currentYear: 1240, previousYear: 1380 },
  { month: "Feb", currentYear: 1180, previousYear: 1320 },
  { month: "Mar", currentYear: 1320, previousYear: 1450 },
  { month: "Apr", currentYear: 1150, previousYear: 1280 },
  { month: "May", currentYear: 1090, previousYear: 1210 },
  { month: "Jun", currentYear: 980, previousYear: 1150 },
];

export default function AutomatedReportsPage() {
  const [selectedReport, setSelectedReport] = useState(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState("6months");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [isRecipientsDialogOpen, setIsRecipientsDialogOpen] = useState(false);

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "processing":
        return <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />;
      case "scheduled":
        return <Clock className="h-4 w-4 text-orange-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-700 bg-green-100";
      case "processing":
        return "text-blue-700 bg-blue-100";
      case "scheduled":
        return "text-orange-700 bg-orange-100";
      default:
        return "text-gray-700 bg-gray-100";
    }
  };

  const getDeltaType = (current: number, target: number) => {
    if (current < target) return "moderateDecrease";
    if (current > target) return "moderateIncrease";
    return "unchanged";
  };

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    // Simulate report generation
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setIsGenerating(false);
  };

  const handleExportAllReports = async () => {
    setIsGeneratingReport(true);
    try {
      const reportData = {
        kpiData,
        departmentEmissions,
        emissionsTrend,
        reportHistory,
      };
      await generateAutomatedReportsSummary(reportData);
    } catch (error) {
      console.error("Error generating reports summary:", error);
    } finally {
      setIsGeneratingReport(false);
    }
  };

  return (
    <div
      id="automated-reports-dashboard"
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
                  Automated Reports
                </h1>
                <p className="text-lg text-gray-600">
                  Generate comprehensive sustainability reports automatically
                </p>
              </div>
              <div className="flex items-center space-x-4 mt-4 lg:mt-0">
                <button
                  onClick={handleGenerateReport}
                  disabled={isGenerating}
                  className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Generate Report
                    </>
                  )}
                </button>
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
                <UICard className="bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="truncate">
                        <p className="text-green-100 text-sm font-medium">
                          {kpi.name}
                        </p>
                        <p className="text-white text-2xl font-bold mt-1">
                          {kpi.value} {kpi.unit}
                        </p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-green-200" />
                    </div>
                    <div className="mt-4">
                      <div
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white/20 text-white border border-white/30`}
                      >
                        Target: {kpi.target}
                      </div>
                    </div>
                  </CardContent>
                </UICard>
              </motion.div>
            ))}
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            variants={fadeIn}
            className="flex items-center space-x-4 mb-6"
          >
            <button
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              onClick={() => setSelectedTimeRange("3months")}
            >
              <Calendar className="h-4 w-4 mr-2" />
              This Quarter
            </button>
            <button
              className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              onClick={() => setSelectedTimeRange("6months")}
            >
              <Filter className="h-4 w-4 mr-2" />
              Last 6 Months
            </button>
            <button
              className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              onClick={() => setSelectedTimeRange("1year")}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              This Year
            </button>
          </motion.div>
        </div>
      </section>

      {/* Main Dashboard */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Emissions Trend */}
            <UICard className="col-span-2 bg-white border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Emissions Trend Analysis
                </CardTitle>
                <CardDescription>
                  Monthly emissions by scope over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <RechartsResponsiveContainer width="100%" height="100%">
                    <RechartsAreaChart
                      data={emissionsTrend}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <RechartsCartesianGrid
                        strokeDasharray="3 3"
                        stroke="#f0f0f0"
                      />
                      <RechartsXAxis
                        dataKey="month"
                        tick={{ fontSize: 12, fill: "#666" }}
                        axisLine={{ stroke: "#e0e0e0" }}
                        tickLine={{ stroke: "#e0e0e0" }}
                      />
                      <RechartsYAxis
                        tick={{ fontSize: 12, fill: "#666" }}
                        axisLine={{ stroke: "#e0e0e0" }}
                        tickLine={{ stroke: "#e0e0e0" }}
                        width={60}
                        tickFormatter={(value) => `${value} tCO₂e`}
                      />
                      <RechartsTooltip
                        formatter={(value) => [`${value} tCO₂e`, ""]}
                        labelStyle={{ color: "#333", fontWeight: "bold" }}
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e0e0e0",
                          borderRadius: "8px",
                          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                        }}
                      />
                      <RechartsLegend />
                      <RechartsArea
                        type="monotone"
                        dataKey="total"
                        stackId="1"
                        stroke="#10b981"
                        fill="#10b981"
                        fillOpacity={0.6}
                        strokeWidth={2}
                        name="Total Emissions"
                      />
                      <RechartsArea
                        type="monotone"
                        dataKey="scope1"
                        stackId="2"
                        stroke="#f43f5e"
                        fill="#f43f5e"
                        fillOpacity={0.6}
                        strokeWidth={2}
                        name="Scope 1"
                      />
                      <RechartsArea
                        type="monotone"
                        dataKey="scope2"
                        stackId="3"
                        stroke="#f59e0b"
                        fill="#f59e0b"
                        fillOpacity={0.6}
                        strokeWidth={2}
                        name="Scope 2"
                      />
                      <RechartsArea
                        type="monotone"
                        dataKey="scope3"
                        stackId="4"
                        stroke="#3b82f6"
                        fill="#3b82f6"
                        fillOpacity={0.6}
                        strokeWidth={2}
                        name="Scope 3"
                      />
                    </RechartsAreaChart>
                  </RechartsResponsiveContainer>
                </div>
              </CardContent>
            </UICard>

            {/* Department Performance */}
            <UICard className="bg-white border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Department Targets
                </CardTitle>
                <CardDescription>
                  Current performance vs targets
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <RechartsResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart
                      data={departmentEmissions}
                      margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                    >
                      <RechartsCartesianGrid
                        strokeDasharray="3 3"
                        stroke="#f0f0f0"
                      />
                      <RechartsXAxis
                        dataKey="department"
                        tick={{ fontSize: 12, fill: "#666" }}
                        axisLine={{ stroke: "#e0e0e0" }}
                        tickLine={{ stroke: "#e0e0e0" }}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <RechartsYAxis
                        tick={{ fontSize: 12, fill: "#666" }}
                        axisLine={{ stroke: "#e0e0e0" }}
                        tickLine={{ stroke: "#e0e0e0" }}
                        width={60}
                        tickFormatter={(value) => `${value} tCO₂e`}
                      />
                      <RechartsTooltip
                        formatter={(value) => [`${value} tCO₂e`, ""]}
                        labelStyle={{ color: "#333", fontWeight: "bold" }}
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e0e0e0",
                          borderRadius: "8px",
                          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                        }}
                      />
                      <RechartsLegend />
                      <RechartsBar
                        dataKey="emissions"
                        fill="#10b981"
                        name="Current Emissions"
                        radius={[2, 2, 0, 0]}
                      />
                      <RechartsBar
                        dataKey="target"
                        fill="#6b7280"
                        name="Target"
                        radius={[2, 2, 0, 0]}
                      />
                    </RechartsBarChart>
                  </RechartsResponsiveContainer>
                </div>
              </CardContent>
            </UICard>

            {/* Monthly Comparison */}
            <UICard className="col-span-2 bg-white border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Year-over-Year Comparison
                </CardTitle>
                <CardDescription>
                  Current year vs previous year emissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <RechartsResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart
                      data={monthlyComparison}
                      margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                    >
                      <RechartsCartesianGrid
                        strokeDasharray="3 3"
                        stroke="#f0f0f0"
                      />
                      <RechartsXAxis
                        dataKey="month"
                        tick={{ fontSize: 12, fill: "#666" }}
                        axisLine={{ stroke: "#e0e0e0" }}
                        tickLine={{ stroke: "#e0e0e0" }}
                      />
                      <RechartsYAxis
                        tick={{ fontSize: 12, fill: "#666" }}
                        axisLine={{ stroke: "#e0e0e0" }}
                        tickLine={{ stroke: "#e0e0e0" }}
                        width={60}
                        tickFormatter={(value) => `${value} tCO₂e`}
                      />
                      <RechartsTooltip
                        formatter={(value) => [`${value} tCO₂e`, ""]}
                        labelStyle={{ color: "#333", fontWeight: "bold" }}
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e0e0e0",
                          borderRadius: "8px",
                          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                        }}
                      />
                      <RechartsLegend />
                      <RechartsBar
                        dataKey="currentYear"
                        fill="#10b981"
                        name="Current Year"
                        radius={[2, 2, 0, 0]}
                      />
                      <RechartsBar
                        dataKey="previousYear"
                        fill="#6b7280"
                        name="Previous Year"
                        radius={[2, 2, 0, 0]}
                      />
                    </RechartsBarChart>
                  </RechartsResponsiveContainer>
                </div>
              </CardContent>
            </UICard>

            {/* Report History */}
            <UICard className="bg-white border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Recent Reports
                </CardTitle>
                <CardDescription>
                  Generated and scheduled reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 overflow-y-auto">
                  <div className="space-y-3">
                    {reportHistory.map((report) => (
                      <div
                        key={report.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-gray-900">
                            {report.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {report.type} • {report.generated} • {report.size}
                          </p>
                        </div>
                        <div
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            report.status
                          )}`}
                        >
                          {getStatusIcon(report.status)}
                          <span className="ml-1 capitalize">
                            {report.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </UICard>
          </div>

          {/* Additional Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Carbon Intensity Trend */}
            <UICard className="bg-white border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Carbon Intensity Progress
                </CardTitle>
                <CardDescription>
                  Track improvement in carbon efficiency
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <RechartsResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart
                      data={emissionsTrend}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <RechartsCartesianGrid
                        strokeDasharray="3 3"
                        stroke="#f0f0f0"
                      />
                      <RechartsXAxis
                        dataKey="month"
                        tick={{ fontSize: 12, fill: "#666" }}
                        axisLine={{ stroke: "#e0e0e0" }}
                        tickLine={{ stroke: "#e0e0e0" }}
                      />
                      <RechartsYAxis
                        tick={{ fontSize: 12, fill: "#666" }}
                        axisLine={{ stroke: "#e0e0e0" }}
                        tickLine={{ stroke: "#e0e0e0" }}
                        width={80}
                        tickFormatter={(value) =>
                          `${Number(value).toFixed(1)} tCO₂e/R`
                        }
                      />
                      <RechartsTooltip
                        formatter={(value) => [
                          `${Number(value).toFixed(1)} tCO₂e/R`,
                          "Carbon Intensity",
                        ]}
                        labelStyle={{ color: "#333", fontWeight: "bold" }}
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e0e0e0",
                          borderRadius: "8px",
                          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                        }}
                      />
                      <RechartsLine
                        type="monotone"
                        dataKey="total"
                        stroke="#10b981"
                        strokeWidth={3}
                        dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                        activeDot={{
                          r: 6,
                          fill: "#10b981",
                          stroke: "#fff",
                          strokeWidth: 2,
                        }}
                        name="Carbon Intensity"
                      />
                    </RechartsLineChart>
                  </RechartsResponsiveContainer>
                </div>
              </CardContent>
            </UICard>

            {/* Scope Breakdown */}
            <UICard className="bg-white border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Emissions by Scope
                </CardTitle>
                <CardDescription>
                  Current distribution across all scopes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <RechartsResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <RechartsPie
                        data={[
                          { name: "Scope 1 (Direct)", value: 380 },
                          { name: "Scope 2 (Energy)", value: 520 },
                          { name: "Scope 3 (Indirect)", value: 340 },
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name}: ${(Number(percent) * 100).toFixed(0)}%`
                        }
                        labelLine={false}
                      >
                        {[
                          { name: "Scope 1 (Direct)", value: 380 },
                          { name: "Scope 2 (Energy)", value: 520 },
                          { name: "Scope 3 (Indirect)", value: 340 },
                        ].map((entry, index) => (
                          <RechartsCell
                            key={`cell-${index}`}
                            fill={["#f43f5e", "#f59e0b", "#3b82f6"][index]}
                          />
                        ))}
                      </RechartsPie>
                      <RechartsTooltip
                        formatter={(value) => [`${value} tCO₂e`, "Emissions"]}
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
          </div>
        </div>
      </section>

      {/* Action Buttons */}
      <section className="py-8 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <UIButton
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4"
              onClick={handleExportAllReports}
              disabled={isGeneratingReport}
            >
              <Download className="h-5 w-5 mr-2" />
              {isGeneratingReport ? "Exporting..." : "Export All Reports"}
            </UIButton>
            <UIButton
              variant="outline"
              size="lg"
              className="border-green-200 text-green-700 hover:bg-green-50 px-8 py-4"
              onClick={() => setIsScheduleDialogOpen(true)}
            >
              <Settings className="h-5 w-5 mr-2" />
              Configure Schedules
            </UIButton>
            <UIButton
              variant="outline"
              size="lg"
              className="border-green-200 text-green-700 hover:bg-green-50 px-8 py-4"
              onClick={() => setIsRecipientsDialogOpen(true)}
            >
              <Users className="h-5 w-5 mr-2" />
              Manage Recipients
            </UIButton>
          </div>
        </div>
      </section>

      {/* Dialogs */}
      <ReportScheduleDialog
        open={isScheduleDialogOpen}
        onOpenChange={setIsScheduleDialogOpen}
      />
      <RecipientsManagementDialog
        open={isRecipientsDialogOpen}
        onOpenChange={setIsRecipientsDialogOpen}
      />
    </div>
  );
}
