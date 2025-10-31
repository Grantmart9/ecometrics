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
const Select = dynamic(
  () => import("@tremor/react").then((mod) => mod.Select),
  {
    ssr: false,
  }
);
const SelectItem = dynamic(
  () => import("@tremor/react").then((mod) => mod.SelectItem),
  { ssr: false }
);
const TextInput = dynamic(
  () => import("@tremor/react").then((mod) => mod.TextInput),
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
    const commonProps = {
      className: "h-80",
      showLegend: true,
      showGridLines: true,
      yAxisWidth: 60,
    };

    switch (widget.type) {
      case "area-chart":
        return (
          <AreaChart
            {...commonProps}
            data={areaData}
            index="date"
            categories={["emissions", "target"]}
            colors={["green", "gray"]}
            valueFormatter={(number) => `${number} tCO₂e`}
          />
        );

      case "bar-chart":
        return (
          <BarChart
            {...commonProps}
            data={barData}
            index="department"
            categories={["emissions", "target"]}
            colors={["green", "gray"]}
            valueFormatter={(number) => `${number} tCO₂e`}
          />
        );

      case "donut-chart":
        return (
          <DonutChart
            data={donutData}
            category="value"
            index="name"
            colors={["red", "amber", "blue"]}
            valueFormatter={(number) => `${number} tCO₂e`}
            showLabel={true}
            showAnimation={true}
          />
        );

      case "line-chart":
        return (
          <LineChart
            {...commonProps}
            data={lineData}
            index="time"
            categories={["temperature", "efficiency"]}
            colors={["red", "green"]}
            valueFormatter={(number) => number.toFixed(1)}
          />
        );

      case "metric-card":
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Metric className="text-4xl text-green-600">
                {widget.value}
              </Metric>
              <Text className="text-gray-600">{widget.unit}</Text>
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
                    <Button
                      color="gray"
                      onClick={() => {
                        setIsCreating(false);
                        setIsEditing(false);
                      }}
                    >
                      Cancel
                    </Button>
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
              <Text className="text-gray-600 mb-4">
                Choose a template to get started:
              </Text>
              <Grid
                numItems={1}
                numItemsSm={2}
                numItemsLg={4}
                className="gap-4"
              >
                {dashboardTemplates.map((template) => (
                  <Card
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
                  </Card>
                ))}
              </Grid>
            </motion.div>
          )}

          {/* Dashboard Name Input */}
          {(isCreating || isEditing) && (
            <motion.div variants={fadeIn} className="mb-6">
              <div className="flex items-center space-x-4">
                <Text className="text-gray-600">Dashboard Name:</Text>
                <TextInput
                  value={dashboardName}
                  onValueChange={setDashboardName}
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
              <Grid
                numItems={1}
                numItemsSm={2}
                numItemsLg={3}
                className="gap-6"
              >
                {widgets.map((widget) => (
                  <motion.div key={widget.id} variants={fadeIn}>
                    <Card className="relative">
                      <div className="flex items-center justify-between mb-4">
                        <Title>{widget.title}</Title>
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
                      {renderWidget(widget)}
                    </Card>
                  </motion.div>
                ))}

                {/* Add Widget Button */}
                {(isCreating || isEditing) && (
                  <motion.div variants={fadeIn}>
                    <Card
                      className="border-dashed border-2 border-gray-300 hover:border-green-400 cursor-pointer transition-colors"
                      onClick={() => setShowWidgetPicker(true)}
                    >
                      <div className="flex items-center justify-center h-80">
                        <div className="text-center">
                          <Plus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <Text className="text-gray-500">Add Widget</Text>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                )}
              </Grid>
            </motion.div>
          ) : (
            <motion.div variants={fadeIn} className="text-center py-16">
              <Layout className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <Text className="text-gray-500 text-lg mb-2">
                No dashboard selected
              </Text>
              <Text className="text-gray-400">
                Choose a template above or create a custom dashboard
              </Text>
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
              <Grid
                numItems={1}
                numItemsSm={2}
                numItemsLg={3}
                className="gap-4"
              >
                {widgetTypes.map((widgetType) => (
                  <Card
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
                  </Card>
                ))}
              </Grid>
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
