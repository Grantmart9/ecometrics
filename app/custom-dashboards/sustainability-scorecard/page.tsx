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
import Link from "next/link";
import {
  Leaf,
  Activity,
  ArrowLeft,
  ChevronDown,
  Download,
  Share2,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

const sustainabilityData = {
  "sustainability-score": { value: "87.5", unit: "/100" },
  "reduction-areas": [
    { name: "Energy", value: 35, color: "#10b981" },
    { name: "Transport", value: 28, color: "#3b82f6" },
    { name: "Waste", value: 22, color: "#f59e0b" },
    { name: "Supply Chain", value: 15, color: "#8b5cf6" },
  ],
  "sustainability-kpis": [
    { quarter: "Q1", energy: 82, waste: 75, water: 88 },
    { quarter: "Q2", energy: 85, waste: 78, water: 90 },
    { quarter: "Q3", energy: 87, waste: 82, water: 92 },
    { quarter: "Q4", energy: 89, waste: 85, water: 94 },
  ],
  "goals-progress": [
    { goal: "Net Zero", progress: 45, target: 100 },
    { goal: "Renewable 100%", progress: 67, target: 100 },
    { goal: "Zero Waste", progress: 78, target: 100 },
  ],
};

const calculateMenuItems = [
  {
    label: "Real-Time Carbon Tracking",
    description: "Monitor emissions with live data",
    href: "/real-time-carbon-tracking",
  },
  {
    label: "Automated Reports",
    description: "Generate scheduled emissions reports",
    href: "/automated-reports",
  },
  {
    label: "Custom Dashboards",
    description: "Build personalized tracking dashboards",
    href: "/custom-dashboards",
  },
  {
    label: "Emission Source Breakdown",
    description: "Analyze emissions by source category",
    href: "/emission-source-breakdown",
  },
  {
    label: "Cloud Integration",
    description: "Connect cloud services for data sync",
    href: "/cloud-integration",
  },
  {
    label: "Team Collaboration",
    description: "Collaborate with team members on sustainability goals",
    href: "/team-collaboration",
  },
];

export default function SustainabilityScorecardPage() {
  const [isCalculateDropdownOpen, setIsCalculateDropdownOpen] = useState(false);
  const { user } = useAuth();
  const isAuthenticated = user !== null;

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

  const renderWidget = (widget: any) => {
    switch (widget.type) {
      case "metric-card":
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-4xl font-bold text-green-600">
                {sustainabilityData["sustainability-score"].value}
              </p>
              <p className="text-gray-600 mt-2">
                {sustainabilityData["sustainability-score"].unit}
              </p>
            </div>
          </div>
        );

      case "donut-chart":
        return (
          <div className="h-80">
            <RechartsResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <RechartsPie
                  data={sustainabilityData["reduction-areas"]}
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
                  {sustainabilityData["reduction-areas"].map((entry, index) => (
                    <RechartsCell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </RechartsPie>
                <RechartsTooltip
                  formatter={(value) => [`${value}%`, "Contribution"]}
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
        );

      case "area-chart":
        return (
          <div className="h-80">
            <RechartsResponsiveContainer width="100%" height="100%">
              <RechartsAreaChart
                data={sustainabilityData["sustainability-kpis"]}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <RechartsCartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <RechartsXAxis
                  dataKey="quarter"
                  tick={{ fontSize: 12, fill: "#666" }}
                  axisLine={{ stroke: "#e0e0e0" }}
                  tickLine={{ stroke: "#e0e0e0" }}
                />
                <RechartsYAxis
                  tick={{ fontSize: 12, fill: "#666" }}
                  axisLine={{ stroke: "#e0e0e0" }}
                  tickLine={{ stroke: "#e0e0e0" }}
                  width={60}
                  tickFormatter={(value) => `${value}%`}
                />
                <RechartsTooltip
                  formatter={(value) => [`${value}%`, ""]}
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
                  dataKey="energy"
                  stackId="1"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.6}
                  strokeWidth={2}
                  name="Energy"
                />
                <RechartsArea
                  type="monotone"
                  dataKey="waste"
                  stackId="2"
                  stroke="#f59e0b"
                  fill="#f59e0b"
                  fillOpacity={0.6}
                  strokeWidth={2}
                  name="Waste"
                />
                <RechartsArea
                  type="monotone"
                  dataKey="water"
                  stackId="3"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.6}
                  strokeWidth={2}
                  name="Water"
                />
              </RechartsAreaChart>
            </RechartsResponsiveContainer>
          </div>
        );

      case "line-chart":
        return (
          <div className="h-80">
            <RechartsResponsiveContainer width="100%" height="100%">
              <RechartsLineChart
                data={sustainabilityData["goals-progress"]}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <RechartsCartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <RechartsXAxis
                  dataKey="goal"
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
                  tickFormatter={(value) => `${value}%`}
                />
                <RechartsTooltip
                  formatter={(value) => [`${value}%`, "Progress"]}
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
                  dataKey="progress"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                  activeDot={{
                    r: 6,
                    fill: "#10b981",
                    stroke: "#fff",
                    strokeWidth: 2,
                  }}
                  name="Progress"
                />
              </RechartsLineChart>
            </RechartsResponsiveContainer>
          </div>
        );

      default:
        return (
          <div className="flex items-center justify-center h-full text-gray-500">
            Unknown widget type
          </div>
        );
    }
  };

  const widgets = [
    {
      id: 1,
      type: "metric-card",
      title: "Sustainability Score",
      dataKey: "sustainability-score",
    },
    {
      id: 2,
      type: "donut-chart",
      title: "Carbon Reduction Areas",
      dataKey: "reduction-areas",
    },
    {
      id: 3,
      type: "area-chart",
      title: "Sustainability KPIs",
      dataKey: "sustainability-kpis",
    },
    {
      id: 4,
      type: "line-chart",
      title: "Progress Towards Goals",
      dataKey: "goals-progress",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-sky-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-green-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link href="/custom-dashboards">
                <ArrowLeft className="h-6 w-6 text-gray-600 mr-4 hover:text-green-600 transition-colors" />
              </Link>
              <Leaf className="h-8 w-8 text-green-600 mr-2" />
              <span className="text-2xl font-bold text-gray-900">
                EcoMetrics
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
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

              {/* Calculate Dropdown */}
              <div className="relative">
                <button
                  onClick={() =>
                    setIsCalculateDropdownOpen(!isCalculateDropdownOpen)
                  }
                  className="inline-flex items-center px-4 py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                >
                  Calculate
                  <ChevronDown
                    className={`ml-1 h-4 w-4 transition-transform ${
                      isCalculateDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {isCalculateDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                    >
                      {calculateMenuItems.map((item, index) => (
                        <Link
                          key={index}
                          href={item.href}
                          className="block px-4 py-3 hover:bg-green-50 transition-colors"
                          onClick={() => setIsCalculateDropdownOpen(false)}
                        >
                          <div className="font-medium text-gray-900">
                            {item.label}
                          </div>
                          <div className="text-sm text-gray-500">
                            {item.description}
                          </div>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
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
                  Sustainability Scorecard Dashboard
                </h1>
                <p className="text-lg text-gray-600">
                  Comprehensive sustainability metrics and goal tracking
                </p>
              </div>
              <div className="flex items-center space-x-4 mt-4 lg:mt-0">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-sm text-gray-600">Live Data</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Dashboard Grid */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerChildren}
            className="mb-8"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
              {widgets.map((widget) => (
                <motion.div key={widget.id} variants={fadeIn}>
                  <UICard className="relative bg-white border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold text-gray-900">
                        {widget.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>{renderWidget(widget)}</CardContent>
                  </UICard>
                </motion.div>
              ))}
            </div>
          </motion.div>
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
              <Share2 className="h-5 w-5 mr-2" />
              Share Dashboard
            </UIButton>
            <UIButton
              variant="outline"
              size="lg"
              className="border-green-200 text-green-700 hover:bg-green-50 px-8 py-4"
            >
              <Download className="h-5 w-5 mr-2" />
              Export as PDF
            </UIButton>
          </div>
        </div>
      </section>
    </div>
  );
}
