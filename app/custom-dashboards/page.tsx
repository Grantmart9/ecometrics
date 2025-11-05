"use client";

import { useState, useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import Link from "next/link";
import {
  Leaf,
  Layout,
  Plus,
  Edit3,
  Trash2,
  Save,
  Share2,
  BarChart3,
  TrendingUp,
  Settings,
  ArrowLeft,
  Grid3X3,
  PieChart,
  LineChart as LineChartIcon,
  Activity,
  Zap,
  Download,
} from "lucide-react";

// Dashboard templates and widget data
const dashboardTemplates = [
  {
    id: 1,
    name: "Executive Summary",
    description: "High-level metrics for leadership",
    icon: <TrendingUp className="h-6 w-6" />,
    widgets: [
      "current-emissions",
      "monthly-trend",
      "target-progress",
      "cost-savings",
    ],
  },
  {
    id: 2,
    name: "Operations Dashboard",
    description: "Detailed operational metrics",
    icon: <Settings className="h-6 w-6" />,
    widgets: [
      "real-time-tracking",
      "department-breakdown",
      "alerts-panel",
      "environmental-factors",
    ],
  },
  {
    id: 3,
    name: "Compliance Report",
    description: "Regulatory and compliance tracking",
    icon: <BarChart3 className="h-6 w-6" />,
    widgets: [
      "scope-breakdown",
      "compliance-status",
      "audit-trail",
      "certifications",
    ],
  },
  {
    id: 4,
    name: "Sustainability Scorecard",
    description: "Comprehensive sustainability metrics",
    icon: <Activity className="h-6 w-6" />,
    widgets: [
      "kpi-overview",
      "trend-analysis",
      "benchmark-comparison",
      "action-items",
    ],
  },
];

const widgetTypes = [
  {
    type: "area-chart",
    name: "Area Chart",
    icon: <LineChartIcon className="h-4 w-4" />,
    dataKey: "area",
  },
  {
    type: "bar-chart",
    name: "Bar Chart",
    icon: <BarChart3 className="h-4 w-4" />,
    dataKey: "bar",
  },
  {
    type: "donut-chart",
    name: "Donut Chart",
    icon: <PieChart className="h-4 w-4" />,
    dataKey: "donut",
  },
  {
    type: "line-chart",
    name: "Line Chart",
    icon: <Activity className="h-4 w-4" />,
    dataKey: "line",
  },
  {
    type: "metric-card",
    name: "Metric Card",
    icon: <Grid3X3 className="h-4 w-4" />,
    dataKey: "metric",
  },
];

// Mock data for various widgets
const areaData = [
  { date: "2024-01", emissions: 1200, target: 1300 },
  { date: "2024-02", emissions: 1150, target: 1300 },
  { date: "2024-03", emissions: 1320, target: 1300 },
  { date: "2024-04", emissions: 1100, target: 1300 },
  { date: "2024-05", emissions: 1080, target: 1300 },
  { date: "2024-06", emissions: 950, target: 1300 },
];

const barData = [
  { department: "Manufacturing", emissions: 450, target: 500 },
  { department: "Transport", emissions: 320, target: 350 },
  { department: "Facilities", emissions: 280, target: 250 },
  { department: "Office", emissions: 150, target: 180 },
  { department: "Supply Chain", emissions: 200, target: 220 },
];

const donutData = [
  { name: "Scope 1", value: 380, color: "#ef4444" },
  { name: "Scope 2", value: 520, color: "#f59e0b" },
  { name: "Scope 3", value: 340, color: "#3b82f6" },
];

const lineData = [
  { time: "00:00", temperature: 22.5, humidity: 65, efficiency: 87 },
  { time: "04:00", temperature: 21.8, humidity: 68, efficiency: 89 },
  { time: "08:00", temperature: 23.2, humidity: 62, efficiency: 85 },
  { time: "12:00", temperature: 25.1, humidity: 58, efficiency: 82 },
  { time: "16:00", temperature: 26.8, humidity: 55, efficiency: 78 },
  { time: "20:00", temperature: 24.3, humidity: 61, efficiency: 84 },
];

const currentDashboard = {
  name: "Custom Dashboard",
  widgets: [
    { id: 1, type: "area-chart", title: "Emissions Trend", dataKey: "area" },
    {
      id: 2,
      type: "metric-card",
      title: "Current Emissions",
      dataKey: "metric",
      value: "245.8",
      unit: "tCO₂e",
    },
    { id: 3, type: "donut-chart", title: "Emission Sources", dataKey: "donut" },
    {
      id: 4,
      type: "bar-chart",
      title: "Department Performance",
      dataKey: "bar",
    },
  ],
};

export default function CustomDashboardsPage() {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [dashboardName, setDashboardName] = useState("My Custom Dashboard");
  const [widgets, setWidgets] = useState(currentDashboard.widgets);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showWidgetPicker, setShowWidgetPicker] = useState(false);

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

  const handleCreateFromTemplate = (template: any) => {
    setSelectedTemplate(template);
    setIsCreating(true);
  };

  const handleAddWidget = (widgetType: any) => {
    const newWidget = {
      id: Date.now(),
      type: widgetType.type,
      title: `New ${widgetType.name}`,
      dataKey: widgetType.dataKey,
    };
    setWidgets([...widgets, newWidget]);
    setShowWidgetPicker(false);
  };

  const handleRemoveWidget = (widgetId: number) => {
    setWidgets(widgets.filter((w) => w.id !== widgetId));
  };

  const handleSaveDashboard = () => {
    // Save dashboard logic here
    console.log("Saving dashboard:", { name: dashboardName, widgets });
    setIsCreating(false);
    setIsEditing(false);
  };

  const renderWidget = (widget: any) => {
    switch (widget.type) {
      case "area-chart":
        return (
          <div className="h-80">
            <RechartsResponsiveContainer width="100%" height="100%">
              <RechartsAreaChart
                data={areaData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <RechartsCartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <RechartsXAxis
                  dataKey="date"
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
                  dataKey="emissions"
                  stackId="1"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.6}
                  strokeWidth={2}
                  name="Emissions"
                />
                <RechartsArea
                  type="monotone"
                  dataKey="target"
                  stackId="2"
                  stroke="#f59e0b"
                  fill="#f59e0b"
                  fillOpacity={0.6}
                  strokeWidth={2}
                  name="Target"
                />
              </RechartsAreaChart>
            </RechartsResponsiveContainer>
          </div>
        );

      case "bar-chart":
        return (
          <div className="h-80">
            <RechartsResponsiveContainer width="100%" height="100%">
              <RechartsBarChart
                data={barData}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
              >
                <RechartsCartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
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
                  name="Emissions"
                  radius={[8, 8, 0, 0]}
                />
                <RechartsBar
                  dataKey="target"
                  fill="#f59e0b"
                  name="Target"
                  radius={[8, 8, 0, 0]}
                />
              </RechartsBarChart>
            </RechartsResponsiveContainer>
          </div>
        );

      case "donut-chart":
        return (
          <div className="h-80">
            <RechartsResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <RechartsPie
                  data={donutData}
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
                  {donutData.map((entry, index) => (
                    <RechartsCell key={`cell-${index}`} fill={entry.color} />
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
        );

      case "line-chart":
        return (
          <div className="h-80">
            <RechartsResponsiveContainer width="100%" height="100%">
              <RechartsLineChart
                data={lineData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <RechartsCartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
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
                  tickFormatter={(value) => Number(value).toFixed(1)}
                />
                <RechartsTooltip
                  formatter={(value) => [Number(value).toFixed(1), ""]}
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
                  dataKey="temperature"
                  stroke="#f43f5e"
                  strokeWidth={3}
                  dot={{ fill: "#f43f5e", strokeWidth: 2, r: 4 }}
                  activeDot={{
                    r: 6,
                    fill: "#f43f5e",
                    stroke: "#fff",
                    strokeWidth: 2,
                  }}
                  name="Temperature"
                />
                <RechartsLine
                  type="monotone"
                  dataKey="efficiency"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                  activeDot={{
                    r: 6,
                    fill: "#10b981",
                    stroke: "#fff",
                    strokeWidth: 2,
                  }}
                  name="Efficiency"
                />
              </RechartsLineChart>
            </RechartsResponsiveContainer>
          </div>
        );

      case "metric-card":
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-4xl font-bold text-green-600">
                {widget.value}
              </p>
              <p className="text-gray-600 mt-2">{widget.unit}</p>
            </div>
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
                  Custom Dashboards
                </h1>
                <p className="text-lg text-gray-600">
                  Build personalized dashboards with drag-and-drop widgets
                </p>
              </div>
              <div className="flex items-center space-x-4 mt-4 lg:mt-0">
                {isCreating || isEditing ? (
                  <>
                    <UIButton
                      onClick={handleSaveDashboard}
                      size="lg"
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Dashboard
                    </UIButton>
                    <UIButton
                      variant="outline"
                      onClick={() => {
                        setIsCreating(false);
                        setIsEditing(false);
                      }}
                    >
                      Cancel
                    </UIButton>
                  </>
                ) : (
                  <>
                    <UIButton
                      onClick={() => setIsEditing(true)}
                      variant="outline"
                      size="lg"
                      className="border-green-200 text-green-700 hover:bg-green-50"
                    >
                      <Edit3 className="h-4 w-4 mr-2" />
                      Edit Dashboard
                    </UIButton>
                    <UIButton
                      size="lg"
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      New Dashboard
                    </UIButton>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>

          {/* Template Selection */}
          {!isCreating && !isEditing && (
            <motion.div variants={fadeIn} className="mb-8">
              <p className="text-gray-600 mb-4">
                Choose a template to get started:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {dashboardTemplates.map((template) => (
                  <UICard
                    key={template.id}
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => handleCreateFromTemplate(template)}
                  >
                    <CardHeader>
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-green-100 rounded-lg text-green-600">
                          {template.icon}
                        </div>
                        <div>
                          <CardTitle className="text-lg">
                            {template.name}
                          </CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>{template.description}</CardDescription>
                      <div className="mt-3 flex flex-wrap gap-1">
                        {template.widgets.slice(0, 3).map((widget, index) => (
                          <span
                            key={index}
                            className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full"
                          >
                            {widget.replace("-", " ")}
                          </span>
                        ))}
                        {template.widgets.length > 3 && (
                          <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{template.widgets.length - 3} more
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </UICard>
                ))}
              </div>
            </motion.div>
          )}

          {/* Dashboard Name Input */}
          {(isCreating || isEditing) && (
            <motion.div variants={fadeIn} className="mb-6">
              <div className="flex items-center space-x-4">
                <p className="text-gray-600">Dashboard Name:</p>
                <Input
                  value={dashboardName}
                  onChange={(e) => setDashboardName(e.target.value)}
                  placeholder="Enter dashboard name"
                  className="max-w-md"
                />
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Dashboard Grid */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isCreating || isEditing || widgets.length > 0 ? (
            <motion.div
              initial="initial"
              animate="animate"
              variants={staggerChildren}
              className="mb-8"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {widgets.map((widget) => (
                  <motion.div key={widget.id} variants={fadeIn}>
                    <UICard className="relative bg-white border-0 shadow-lg">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg font-semibold text-gray-900">
                            {widget.title}
                          </CardTitle>
                          {(isCreating || isEditing) && (
                            <UIButton
                              onClick={() => handleRemoveWidget(widget.id)}
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </UIButton>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>{renderWidget(widget)}</CardContent>
                    </UICard>
                  </motion.div>
                ))}

                {/* Add Widget Button */}
                {(isCreating || isEditing) && (
                  <motion.div variants={fadeIn}>
                    <UICard
                      className="border-dashed border-2 border-gray-300 hover:border-green-400 cursor-pointer transition-colors"
                      onClick={() => setShowWidgetPicker(true)}
                    >
                      <div className="flex items-center justify-center h-80">
                        <div className="text-center">
                          <Plus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-500">Add Widget</p>
                        </div>
                      </div>
                    </UICard>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div variants={fadeIn} className="text-center py-16">
              <Layout className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg mb-2">
                No dashboard selected
              </p>
              <p className="text-gray-400">
                Choose a template above or create a custom dashboard
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Widget Picker Modal */}
      <AnimatePresence>
        {showWidgetPicker && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowWidgetPicker(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  Add Widget
                </h3>
                <UIButton
                  onClick={() => setShowWidgetPicker(false)}
                  variant="ghost"
                  size="sm"
                >
                  ×
                </UIButton>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {widgetTypes.map((widgetType) => (
                  <UICard
                    key={widgetType.type}
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => handleAddWidget(widgetType)}
                  >
                    <CardHeader>
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-green-100 rounded-lg text-green-600">
                          {widgetType.icon}
                        </div>
                        <div>
                          <CardTitle className="text-lg">
                            {widgetType.name}
                          </CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                  </UICard>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Buttons */}
      {widgets.length > 0 && (
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
              <UIButton
                variant="outline"
                size="lg"
                className="border-green-200 text-green-700 hover:bg-green-50 px-8 py-4"
              >
                <Settings className="h-5 w-5 mr-2" />
                Dashboard Settings
              </UIButton>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
