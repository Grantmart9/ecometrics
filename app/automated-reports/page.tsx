"use client";

import { useState } from "react";
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
const BarChart = dynamic(
  () => import("@tremor/react").then((mod) => mod.BarChart),
  { ssr: false }
);
const DonutChart = dynamic(
  () => import("@tremor/react").then((mod) => mod.DonutChart),
  { ssr: false }
);
const LineChart = dynamic(
  () => import("@tremor/react").then((mod) => mod.LineChart),
  { ssr: false }
);
const Table = dynamic(() => import("@tremor/react").then((mod) => mod.Table), {
  ssr: false,
});
const TableHead = dynamic(
  () => import("@tremor/react").then((mod) => mod.TableHead),
  { ssr: false }
);
const TableRow = dynamic(
  () => import("@tremor/react").then((mod) => mod.TableRow),
  { ssr: false }
);
const TableHeaderCell = dynamic(
  () => import("@tremor/react").then((mod) => mod.TableHeaderCell),
  { ssr: false }
);
const TableBody = dynamic(
  () => import("@tremor/react").then((mod) => mod.TableBody),
  { ssr: false }
);
const TableCell = dynamic(
  () => import("@tremor/react").then((mod) => mod.TableCell),
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
const Button = dynamic(
  () => import("@tremor/react").then((mod) => mod.Button),
  { ssr: false }
);
import { Button as UIButton } from "@/components/ui/button";
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
    value: "245.8",
    unit: "tCO₂e/$M",
    target: "260",
    trend: "down",
  },
  {
    name: "Energy Efficiency",
    value: "87.3",
    unit: "%",
    target: "85",
    trend: "up",
  },
  {
    name: "Renewable Energy",
    value: "62.1",
    unit: "%",
    target: "70",
    trend: "up",
  },
  {
    name: "Waste Diversion",
    value: "78.9",
    unit: "%",
    target: "80",
    trend: "down",
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
                  Automated Reports
                </h1>
                <p className="text-lg text-gray-600">
                  Generate comprehensive sustainability reports automatically
                </p>
              </div>
              <div className="flex items-center space-x-4 mt-4 lg:mt-0">
                <Button
                  onClick={handleGenerateReport}
                  disabled={isGenerating}
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 text-white"
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
                </Button>
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
                <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0">
                  <Flex alignItems="start">
                    <div className="truncate">
                      <Text className="text-green-100">{kpi.name}</Text>
                      <Metric className="text-white">
                        {kpi.value} {kpi.unit}
                      </Metric>
                    </div>
                    <TrendingUp className="h-8 w-8 text-green-200" />
                  </Flex>
                  <BadgeDelta
                    deltaType={getDeltaType(
                      parseFloat(kpi.value.replace(",", ".")),
                      parseFloat(kpi.target)
                    )}
                    className="mt-2 bg-white/20 text-white border-white/30"
                  >
                    Target: {kpi.target}
                  </BadgeDelta>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            variants={fadeIn}
            className="flex items-center space-x-4 mb-6"
          >
            <Button
              color="green"
              icon={Calendar}
              onClick={() => setSelectedTimeRange("3months")}
            >
              This Quarter
            </Button>
            <Button
              color="gray"
              icon={Filter}
              onClick={() => setSelectedTimeRange("6months")}
            >
              Last 6 Months
            </Button>
            <Button
              color="gray"
              icon={BarChart3}
              onClick={() => setSelectedTimeRange("1year")}
            >
              This Year
            </Button>
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
            {/* Emissions Trend */}
            <Card className="col-span-2">
              <Title>Emissions Trend Analysis</Title>
              <Text>Monthly emissions by scope over time</Text>
              <AreaChart
                className="h-80 mt-4"
                data={emissionsTrend}
                index="month"
                categories={["total", "scope1", "scope2", "scope3"]}
                colors={["green", "red", "orange", "blue"]}
                valueFormatter={(number) => `${number} tCO₂e`}
                showLegend={true}
                showGridLines={true}
                curveType="monotone"
                yAxisWidth={60}
              />
            </Card>

            {/* Department Performance */}
            <Card>
              <Title>Department Targets</Title>
              <Text>Current performance vs targets</Text>
              <BarChart
                className="h-80 mt-4"
                data={departmentEmissions}
                index="department"
                categories={["emissions", "target"]}
                colors={["green", "gray"]}
                valueFormatter={(number) => `${number} tCO₂e`}
                showLegend={true}
                yAxisWidth={60}
                onValueChange={(value) => console.log(value)}
              />
            </Card>

            {/* Monthly Comparison */}
            <Card className="col-span-2">
              <Title>Year-over-Year Comparison</Title>
              <Text>Current year vs previous year emissions</Text>
              <BarChart
                className="h-80 mt-4"
                data={monthlyComparison}
                index="month"
                categories={["currentYear", "previousYear"]}
                colors={["green", "gray"]}
                valueFormatter={(number) => `${number} tCO₂e`}
                showLegend={true}
                yAxisWidth={60}
              />
            </Card>

            {/* Report History */}
            <Card>
              <Title>Recent Reports</Title>
              <Text>Generated and scheduled reports</Text>
              <div className="h-80 mt-4">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableHeaderCell>Report</TableHeaderCell>
                      <TableHeaderCell>Status</TableHeaderCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {reportHistory.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell>
                          <div>
                            <Text className="font-medium">{report.name}</Text>
                            <Text className="text-xs text-gray-500">
                              {report.type} • {report.generated}
                            </Text>
                          </div>
                        </TableCell>
                        <TableCell>
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
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </Grid>

          {/* Additional Charts Section */}
          <Grid numItems={1} numItemsLg={2} className="gap-6 mb-8">
            {/* Carbon Intensity Trend */}
            <Card>
              <Title>Carbon Intensity Progress</Title>
              <Text>Track improvement in carbon efficiency</Text>
              <LineChart
                className="h-80 mt-4"
                data={emissionsTrend}
                index="month"
                categories={["total"]}
                colors={["green"]}
                valueFormatter={(number) => `${number.toFixed(1)} tCO₂e/$M`}
                showLegend={false}
                showGridLines={true}
                curveType="monotone"
                yAxisWidth={80}
              />
            </Card>

            {/* Scope Breakdown */}
            <Card>
              <Title>Emissions by Scope</Title>
              <Text>Current distribution across all scopes</Text>
              <DonutChart
                className="h-80 mt-4"
                data={[
                  { name: "Scope 1 (Direct)", value: 380 },
                  { name: "Scope 2 (Energy)", value: 520 },
                  { name: "Scope 3 (Indirect)", value: 340 },
                ]}
                category="value"
                index="name"
                colors={["red", "orange", "blue"]}
                valueFormatter={(number) => `${number} tCO₂e`}
                showLabel={true}
                showAnimation={true}
              />
            </Card>
          </Grid>
        </div>
      </section>

      {/* Action Buttons */}
      <section className="py-8 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <UIButton
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4"
            >
              <Download className="h-5 w-5 mr-2" />
              Export All Reports
            </UIButton>
            <UIButton
              variant="outline"
              size="lg"
              className="border-green-200 text-green-700 hover:bg-green-50 px-8 py-4"
            >
              <Settings className="h-5 w-5 mr-2" />
              Configure Schedules
            </UIButton>
            <UIButton
              variant="outline"
              size="lg"
              className="border-green-200 text-green-700 hover:bg-green-50 px-8 py-4"
            >
              <Users className="h-5 w-5 mr-2" />
              Manage Recipients
            </UIButton>
          </div>
        </div>
      </section>
    </div>
  );
}
