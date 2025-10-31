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
const ScatterChart = dynamic(
  () => import("@tremor/react").then((mod) => mod.ScatterChart),
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
const TabGroup = dynamic(
  () => import("@tremor/react").then((mod) => mod.TabGroup),
  { ssr: false }
);
const TabList = dynamic(
  () => import("@tremor/react").then((mod) => mod.TabList),
  { ssr: false }
);
const Tab = dynamic(() => import("@tremor/react").then((mod) => mod.Tab), {
  ssr: false,
});
const TabPanels = dynamic(
  () => import("@tremor/react").then((mod) => mod.TabPanels),
  { ssr: false }
);
const TabPanel = dynamic(
  () => import("@tremor/react").then((mod) => mod.TabPanel),
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
  Factory,
  Truck,
  Zap,
  Home,
  Plane,
  Ship,
  Building2,
  Settings,
  TrendingUp,
  TrendingDown,
  ArrowLeft,
  Filter,
  Download,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Target,
} from "lucide-react";

// Mock data for emission sources
const emissionSourcesData = [
  {
    category: "Scope 1",
    source: "Natural Gas Combustion",
    emissions: 380,
    percentage: 15.2,
    reduction: 8,
  },
  {
    category: "Scope 1",
    source: "Company Vehicles",
    emissions: 320,
    percentage: 12.8,
    reduction: 12,
  },
  {
    category: "Scope 1",
    source: "Industrial Processes",
    emissions: 290,
    percentage: 11.6,
    reduction: -3,
  },
  {
    category: "Scope 1",
    source: "Backup Generators",
    emissions: 120,
    percentage: 4.8,
    reduction: 5,
  },
  {
    category: "Scope 2",
    source: "Electricity Consumption",
    emissions: 520,
    percentage: 20.8,
    reduction: 15,
  },
  {
    category: "Scope 2",
    source: "Steam Generation",
    emissions: 180,
    percentage: 7.2,
    reduction: 10,
  },
  {
    category: "Scope 3",
    source: "Business Travel",
    emissions: 240,
    percentage: 9.6,
    reduction: 18,
  },
  {
    category: "Scope 3",
    source: "Employee Commuting",
    emissions: 150,
    percentage: 6.0,
    reduction: 8,
  },
  {
    category: "Scope 3",
    source: "Supply Chain",
    emissions: 340,
    percentage: 13.6,
    reduction: 6,
  },
  {
    category: "Scope 3",
    source: "Waste Disposal",
    emissions: 90,
    percentage: 3.6,
    reduction: 22,
  },
];

const scopeBreakdown = [
  { name: "Scope 1 (Direct)", value: 1110, color: "#ef4444", scope: 1 },
  { name: "Scope 2 (Energy)", value: 700, color: "#f59e0b", scope: 2 },
  { name: "Scope 3 (Indirect)", value: 820, color: "#3b82f6", scope: 3 },
];

const trendData = [
  { month: "Jan 2024", scope1: 1150, scope2: 720, scope3: 850 },
  { month: "Feb 2024", scope1: 1120, scope2: 710, scope3: 840 },
  { month: "Mar 2024", scope1: 1100, scope2: 705, scope3: 830 },
  { month: "Apr 2024", scope1: 1090, scope2: 700, scope3: 820 },
  { month: "May 2024", scope1: 1080, scope2: 695, scope3: 815 },
  { month: "Jun 2024", scope1: 1070, scope2: 690, scope3: 810 },
];

const departmentData = [
  {
    department: "Manufacturing",
    scope1: 450,
    scope2: 280,
    scope3: 120,
    total: 850,
  },
  {
    department: "Logistics",
    scope1: 380,
    scope2: 150,
    scope3: 280,
    total: 810,
  },
  {
    department: "Facilities",
    scope1: 180,
    scope2: 340,
    scope3: 90,
    total: 610,
  },
  { department: "Corporate", scope1: 50, scope2: 120, scope3: 230, total: 400 },
  { department: "R&D", scope1: 50, scope2: 80, scope3: 100, total: 230 },
];

const comparisonData = [
  { industry: "Our Company", emissions: 245.8, efficiency: 87.3 },
  { industry: "Industry Average", emissions: 298.4, efficiency: 78.2 },
  { industry: "Best Practice", emissions: 189.2, efficiency: 92.1 },
  { industry: "Industry Worst", emissions: 445.7, efficiency: 62.8 },
];

const reductionOpportunities = [
  {
    source: "Electricity Consumption",
    potential: 78,
    cost: "Low",
    effort: "Easy",
    impact: "High",
  },
  {
    source: "Supply Chain",
    potential: 51,
    cost: "Medium",
    effort: "Medium",
    impact: "High",
  },
  {
    source: "Business Travel",
    potential: 43,
    cost: "Low",
    effort: "Medium",
    impact: "Medium",
  },
  {
    source: "Natural Gas",
    potential: 38,
    cost: "High",
    effort: "Hard",
    impact: "Medium",
  },
  {
    source: "Company Vehicles",
    potential: 32,
    cost: "Medium",
    effort: "Medium",
    impact: "Medium",
  },
];

const getSourceIcon = (source: string) => {
  if (source.includes("Natural Gas") || source.includes("Industrial"))
    return <Factory className="h-6 w-6" />;
  if (source.includes("Vehicle")) return <Truck className="h-6 w-6" />;
  if (source.includes("Electricity")) return <Zap className="h-6 w-6" />;
  if (source.includes("Travel") || source.includes("Commuting"))
    return <Plane className="h-6 w-6" />;
  if (source.includes("Supply Chain")) return <Ship className="h-6 w-6" />;
  if (source.includes("Waste")) return <Settings className="h-6 w-6" />;
  return <Building2 className="h-6 w-6" />;
};

const getReductionColor = (reduction: number) => {
  if (reduction > 0) return "text-green-600";
  if (reduction < 0) return "text-red-600";
  return "text-gray-600";
};

export default function EmissionSourceBreakdownPage() {
  const [selectedScope, setSelectedScope] = useState("all");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedTimeRange, setSelectedTimeRange] = useState("6months");

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

  const getDeltaType = (reduction: number) => {
    if (reduction > 10) return "strongDecrease";
    if (reduction > 0) return "moderateDecrease";
    if (reduction < -5) return "moderateIncrease";
    return "unchanged";
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "High":
        return "bg-green-100 text-green-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Low":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredData = emissionSourcesData.filter((item) => {
    if (selectedScope !== "all" && item.category !== selectedScope)
      return false;
    return true;
  });

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
                  Emission Source Breakdown
                </h1>
                <p className="text-lg text-gray-600">
                  Detailed analysis of all emission sources with reduction
                  opportunities
                </p>
              </div>
              <div className="flex items-center space-x-4 mt-4 lg:mt-0">
                <Button
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Analysis
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
              <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-0">
                <Flex alignItems="start">
                  <div className="truncate">
                    <Text className="text-red-100">Scope 1 Emissions</Text>
                    <Metric className="text-white">1,110 tCO₂e</Metric>
                  </div>
                  <Factory className="h-8 w-8 text-red-200" />
                </Flex>
                <BadgeDelta
                  deltaType="moderateDecrease"
                  className="mt-2 bg-white/20 text-white border-white/30"
                >
                  -8% vs last year
                </BadgeDelta>
              </Card>
            </motion.div>

            <motion.div variants={fadeIn}>
              <Card className="bg-gradient-to-br from-amber-500 to-orange-600 text-white border-0">
                <Flex alignItems="start">
                  <div className="truncate">
                    <Text className="text-amber-100">Scope 2 Emissions</Text>
                    <Metric className="text-white">700 tCO₂e</Metric>
                  </div>
                  <Zap className="h-8 w-8 text-amber-200" />
                </Flex>
                <BadgeDelta
                  deltaType="moderateDecrease"
                  className="mt-2 bg-white/20 text-white border-white/30"
                >
                  -12% vs last year
                </BadgeDelta>
              </Card>
            </motion.div>

            <motion.div variants={fadeIn}>
              <Card className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-0">
                <Flex alignItems="start">
                  <div className="truncate">
                    <Text className="text-blue-100">Scope 3 Emissions</Text>
                    <Metric className="text-white">820 tCO₂e</Metric>
                  </div>
                  <Truck className="h-8 w-8 text-blue-200" />
                </Flex>
                <BadgeDelta
                  deltaType="moderateDecrease"
                  className="mt-2 bg-white/20 text-white border-white/30"
                >
                  -15% vs last year
                </BadgeDelta>
              </Card>
            </motion.div>

            <motion.div variants={fadeIn}>
              <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0">
                <Flex alignItems="start">
                  <div className="truncate">
                    <Text className="text-green-100">Total Emissions</Text>
                    <Metric className="text-white">2,630 tCO₂e</Metric>
                  </div>
                  <Target className="h-8 w-8 text-green-200" />
                </Flex>
                <BadgeDelta
                  deltaType="moderateDecrease"
                  className="mt-2 bg-white/20 text-white border-white/30"
                >
                  -11% vs last year
                </BadgeDelta>
              </Card>
            </motion.div>
          </motion.div>

          {/* Filters */}
          <motion.div
            variants={fadeIn}
            className="flex flex-wrap items-center gap-4 mb-6"
          >
            <div className="flex items-center space-x-2">
              <Text className="text-gray-600">Scope:</Text>
              <Button
                color={selectedScope === "all" ? "green" : "gray"}
                onClick={() => setSelectedScope("all")}
                size="sm"
              >
                All
              </Button>
              <Button
                color={selectedScope === "Scope 1" ? "green" : "gray"}
                onClick={() => setSelectedScope("Scope 1")}
                size="sm"
              >
                Scope 1
              </Button>
              <Button
                color={selectedScope === "Scope 2" ? "green" : "gray"}
                onClick={() => setSelectedScope("Scope 2")}
                size="sm"
              >
                Scope 2
              </Button>
              <Button
                color={selectedScope === "Scope 3" ? "green" : "gray"}
                onClick={() => setSelectedScope("Scope 3")}
                size="sm"
              >
                Scope 3
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Analysis */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <TabGroup>
            <TabList className="mb-8">
              <Tab>Overview</Tab>
              <Tab>Sources Detail</Tab>
              <Tab>Reduction Opportunities</Tab>
              <Tab>Benchmarking</Tab>
            </TabList>

            <TabPanels>
              {/* Overview Tab */}
              <TabPanel>
                <Grid
                  numItems={1}
                  numItemsSm={2}
                  numItemsLg={3}
                  className="gap-6 mb-8"
                >
                  {/* Scope Breakdown */}
                  <Card className="col-span-2">
                    <Title>Emissions by Scope</Title>
                    <Text>Distribution across all emission scopes</Text>
                    <DonutChart
                      className="h-80 mt-4"
                      data={scopeBreakdown}
                      category="value"
                      index="name"
                      colors={["red", "amber", "blue"]}
                      valueFormatter={(number) => `${number} tCO₂e`}
                      showLabel={true}
                      showAnimation={true}
                    />
                  </Card>

                  {/* Trend Analysis */}
                  <Card>
                    <Title>Scope Trends</Title>
                    <Text>Monthly emission trends by scope</Text>
                    <AreaChart
                      className="h-80 mt-4"
                      data={trendData}
                      index="month"
                      categories={["scope1", "scope2", "scope3"]}
                      colors={["red", "amber", "blue"]}
                      valueFormatter={(number) => `${number} tCO₂e`}
                      showLegend={true}
                      yAxisWidth={60}
                    />
                  </Card>

                  {/* Department Breakdown */}
                  <Card className="col-span-1 lg:col-span-3">
                    <Title>Emissions by Department</Title>
                    <Text>
                      Department-wise emission breakdown across all scopes
                    </Text>
                    <BarChart
                      className="h-80 mt-4"
                      data={departmentData}
                      index="department"
                      categories={["scope1", "scope2", "scope3"]}
                      colors={["red", "amber", "blue"]}
                      valueFormatter={(number) => `${number} tCO₂e`}
                      showLegend={true}
                      yAxisWidth={80}
                    />
                  </Card>
                </Grid>
              </TabPanel>

              {/* Sources Detail Tab */}
              <TabPanel>
                <Card>
                  <Title>Detailed Source Analysis</Title>
                  <Text>Complete breakdown of all emission sources</Text>
                  <div className="mt-6 space-y-4">
                    {filteredData.map((source, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center space-x-4">
                          <div
                            className={`p-3 rounded-lg ${
                              source.category === "Scope 1"
                                ? "bg-red-100 text-red-600"
                                : source.category === "Scope 2"
                                ? "bg-amber-100 text-amber-600"
                                : "bg-blue-100 text-blue-600"
                            }`}
                          >
                            {getSourceIcon(source.source)}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {source.source}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {source.category}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-900">
                            {source.emissions}
                          </div>
                          <div className="text-sm text-gray-600">
                            {source.percentage}% of total
                          </div>
                          <div
                            className={`text-sm flex items-center ${getReductionColor(
                              source.reduction
                            )}`}
                          >
                            {source.reduction > 0 ? (
                              <TrendingDown className="h-4 w-4 mr-1" />
                            ) : source.reduction < 0 ? (
                              <TrendingUp className="h-4 w-4 mr-1" />
                            ) : null}
                            {Math.abs(source.reduction)}%{" "}
                            {source.reduction > 0 ? "reduction" : "increase"}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </Card>
              </TabPanel>

              {/* Reduction Opportunities Tab */}
              <TabPanel>
                <Grid numItems={1} numItemsLg={2} className="gap-6 mb-8">
                  {/* Opportunities Table */}
                  <Card className="col-span-1 lg:col-span-2">
                    <Title>Reduction Opportunities</Title>
                    <Text>
                      Prioritized list of emission reduction opportunities
                    </Text>
                    <div className="mt-6">
                      <div className="space-y-4">
                        {reductionOpportunities.map((opportunity, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <h3 className="font-semibold text-gray-900">
                                {opportunity.source}
                              </h3>
                              <div className="flex items-center space-x-2">
                                <span className="text-2xl font-bold text-green-600">
                                  {opportunity.potential}
                                </span>
                                <span className="text-sm text-gray-600">
                                  tCO₂e potential
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-2">
                                <Text className="text-sm text-gray-600">
                                  Cost:
                                </Text>
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    opportunity.cost === "Low"
                                      ? "bg-green-100 text-green-800"
                                      : opportunity.cost === "Medium"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {opportunity.cost}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Text className="text-sm text-gray-600">
                                  Effort:
                                </Text>
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    opportunity.effort === "Easy"
                                      ? "bg-green-100 text-green-800"
                                      : opportunity.effort === "Medium"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {opportunity.effort}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Text className="text-sm text-gray-600">
                                  Impact:
                                </Text>
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(
                                    opportunity.impact
                                  )}`}
                                >
                                  {opportunity.impact}
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </Card>

                  {/* Implementation Roadmap */}
                  <Card>
                    <Title>Implementation Roadmap</Title>
                    <Text>Recommended sequence for emission reductions</Text>
                    <div className="mt-6 space-y-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-bold text-sm">
                          1
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            Quick Wins (0-3 months)
                          </h4>
                          <p className="text-sm text-gray-600">
                            LED lighting, equipment optimization
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
                          2
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            Medium-term (3-12 months)
                          </h4>
                          <p className="text-sm text-gray-600">
                            Renewable energy, fleet electrification
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold text-sm">
                          3
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            Long-term (12+ months)
                          </h4>
                          <p className="text-sm text-gray-600">
                            Supply chain transformation
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Grid>
              </TabPanel>

              {/* Benchmarking Tab */}
              <TabPanel>
                <Grid numItems={1} numItemsLg={2} className="gap-6 mb-8">
                  {/* Industry Comparison */}
                  <Card>
                    <Title>Industry Benchmarking</Title>
                    <Text>Performance vs industry standards</Text>
                    <ScatterChart
                      className="h-80 mt-4"
                      data={comparisonData}
                      x="emissions"
                      y="efficiency"
                      category="industry"
                      colors={["green", "gray", "blue", "red"]}
                    />
                  </Card>

                  {/* Competitive Position */}
                  <Card>
                    <Title>Competitive Position</Title>
                    <Text>Your position relative to industry peers</Text>
                    <div className="mt-6 space-y-4">
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <h3 className="font-semibold text-green-900">
                            Above Average Performance
                          </h3>
                        </div>
                        <p className="text-sm text-green-700">
                          Your company performs 18% better than industry average
                        </p>
                      </div>
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <Target className="h-5 w-5 text-blue-600" />
                          <h3 className="font-semibold text-blue-900">
                            Industry Ranking
                          </h3>
                        </div>
                        <p className="text-sm text-blue-700">
                          Top 25% in carbon efficiency among similar-sized
                          companies
                        </p>
                      </div>
                      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <AlertTriangle className="h-5 w-5 text-yellow-600" />
                          <h3 className="font-semibold text-yellow-900">
                            Improvement Areas
                          </h3>
                        </div>
                        <p className="text-sm text-yellow-700">
                          Focus on renewable energy adoption to reach best
                          practice levels
                        </p>
                      </div>
                    </div>
                  </Card>
                </Grid>
              </TabPanel>
            </TabPanels>
          </TabGroup>
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
              <Download className="h-5 w-5 mr-2" />
              Download Full Report
            </Button>
            <UIButton
              variant="outline"
              size="lg"
              className="border-green-200 text-green-700 hover:bg-green-50 px-8 py-4"
            >
              <Settings className="h-5 w-5 mr-2" />
              Configure Alerts
            </UIButton>
            <UIButton
              variant="outline"
              size="lg"
              className="border-green-200 text-green-700 hover:bg-green-50 px-8 py-4"
            >
              <RefreshCw className="h-5 w-5 mr-2" />
              Refresh Data
            </UIButton>
          </div>
        </div>
      </section>
    </div>
  );
}
