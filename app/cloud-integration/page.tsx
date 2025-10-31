"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  Title,
  Text,
  Metric,
  LineChart,
  BarChart,
  DonutChart,
  BadgeDelta,
  Flex,
  Grid,
  Button as TremorButton,
  TabGroup,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Callout,
} from "@tremor/react";
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
              <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0">
                <Flex alignItems="start">
                  <div className="truncate">
                    <Text className="text-green-100">Active Connections</Text>
                    <Metric className="text-white">
                      {connectedIntegrations}/{totalIntegrations}
                    </Metric>
                  </div>
                  <Link2 className="h-8 w-8 text-green-200" />
                </Flex>
                <BadgeDelta
                  deltaType="moderateIncrease"
                  className="mt-2 bg-white/20 text-white border-white/30"
                >
                  +2 this month
                </BadgeDelta>
              </Card>
            </motion.div>

            <motion.div variants={fadeIn}>
              <Card className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-0">
                <Flex alignItems="start">
                  <div className="truncate">
                    <Text className="text-blue-100">Data Flow</Text>
                    <Metric className="text-white">
                      {totalDataFlow.toFixed(1)} MB/s
                    </Metric>
                  </div>
                  <Download className="h-8 w-8 text-blue-200" />
                </Flex>
                <BadgeDelta
                  deltaType="moderateIncrease"
                  className="mt-2 bg-white/20 text-white border-white/30"
                >
                  +15% vs last week
                </BadgeDelta>
              </Card>
            </motion.div>

            <motion.div variants={fadeIn}>
              <Card className="bg-gradient-to-br from-purple-500 to-pink-600 text-white border-0">
                <Flex alignItems="start">
                  <div className="truncate">
                    <Text className="text-purple-100">System Uptime</Text>
                    <Metric className="text-white">
                      {averageUptime.toFixed(1)}%
                    </Metric>
                  </div>
                  <Monitor className="h-8 w-8 text-purple-200" />
                </Flex>
                <BadgeDelta
                  deltaType="moderateDecrease"
                  className="mt-2 bg-white/20 text-white border-white/30"
                >
                  -0.1% from target
                </BadgeDelta>
              </Card>
            </motion.div>

            <motion.div variants={fadeIn}>
              <Card className="bg-gradient-to-br from-orange-500 to-red-600 text-white border-0">
                <Flex alignItems="start">
                  <div className="truncate">
                    <Text className="text-orange-100">Avg Response Time</Text>
                    <Metric className="text-white">245 ms</Metric>
                  </div>
                  <Zap className="h-8 w-8 text-orange-200" />
                </Flex>
                <BadgeDelta
                  deltaType="moderateDecrease"
                  className="mt-2 bg-white/20 text-white border-white/30"
                >
                  -12% improvement
                </BadgeDelta>
              </Card>
            </motion.div>
          </motion.div>

          {/* Alerts */}
          <motion.div variants={fadeIn} className="mb-6">
            <Callout
              className="mb-4"
              title="Integration Health Check"
              icon={Shield}
              color="yellow"
            >
              1 integration requires attention: Google Analytics sync delayed by
              15 minutes
            </Callout>
          </motion.div>
        </div>
      </section>

      {/* Main Dashboard */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <TabGroup index={activeTab} onIndexChange={setActiveTab}>
            <TabList className="mb-8">
              <Tab>Overview</Tab>
              <Tab>Integrations</Tab>
              <Tab>Setup Guide</Tab>
              <Tab>Performance</Tab>
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
                  {/* Data Flow Chart */}
                  <Card className="col-span-2">
                    <Title>Real-time Data Flow</Title>
                    <Text>Incoming and outgoing data volumes</Text>
                    <LineChart
                      className="h-80 mt-4"
                      data={dataFlowHistory}
                      index="time"
                      categories={["inbound", "outbound", "total"]}
                      colors={["blue", "green", "orange"]}
                      valueFormatter={(number) => `${number} MB/s`}
                      showLegend={true}
                      yAxisWidth={60}
                    />
                  </Card>

                  {/* Category Breakdown */}
                  <Card>
                    <Title>Data by Category</Title>
                    <Text>Volume distributed across integration types</Text>
                    <DonutChart
                      className="h-80 mt-4"
                      data={categoryBreakdown}
                      category="dataVolume"
                      index="category"
                      colors={[
                        "orange",
                        "blue",
                        "green",
                        "purple",
                        "red",
                        "indigo",
                      ]}
                      valueFormatter={(number) => `${number.toFixed(1)} GB`}
                      showLabel={true}
                      showAnimation={true}
                    />
                  </Card>

                  {/* System Status */}
                  <Card className="col-span-1 lg:col-span-3">
                    <Title>Integration Status</Title>
                    <Text>Real-time status of all connected systems</Text>
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
                              <span className="text-gray-600">Data Flow:</span>
                              <span className="font-medium">
                                {integration.dataFlow.toFixed(1)} MB/s
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Last Sync:</span>
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
                  </Card>
                </Grid>
              </TabPanel>

              {/* Integrations Tab */}
              <TabPanel>
                <Card>
                  <Title>Manage Integrations</Title>
                  <Text>
                    Configure and monitor all your data source connections
                  </Text>
                  <div className="mt-6">
                    <div className="flex items-center space-x-4 mb-6">
                      <Text className="text-gray-600">Filter by category:</Text>
                      <TremorButton
                        color={selectedCategory === "all" ? "green" : "gray"}
                        onClick={() => setSelectedCategory("all")}
                        size="sm"
                      >
                        All
                      </TremorButton>
                      {[
                        "Storage",
                        "Database",
                        "Analytics",
                        "CRM",
                        "ERP",
                        "Communication",
                      ].map((category) => (
                        <TremorButton
                          key={category}
                          color={
                            selectedCategory === category ? "green" : "gray"
                          }
                          onClick={() => setSelectedCategory(category)}
                          size="sm"
                        >
                          {category}
                        </TremorButton>
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
                  </div>
                </Card>
              </TabPanel>

              {/* Setup Guide Tab */}
              <TabPanel>
                <Grid numItems={1} numItemsLg={2} className="gap-6 mb-8">
                  {/* Setup Steps */}
                  <Card>
                    <Title>Integration Setup</Title>
                    <Text>
                      Follow these steps to connect your first data source
                    </Text>
                    <div className="mt-6 space-y-6">
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
                  </Card>

                  {/* Quick Setup Options */}
                  <Card>
                    <Title>Quick Setup Options</Title>
                    <Text>Popular integrations ready to connect</Text>
                    <div className="mt-6 space-y-4">
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
                  </Card>
                </Grid>
              </TabPanel>

              {/* Performance Tab */}
              <TabPanel>
                <Grid numItems={1} numItemsLg={2} className="gap-6 mb-8">
                  {/* Performance Metrics */}
                  <Card>
                    <Title>System Performance</Title>
                    <Text>Real-time performance indicators</Text>
                    <div className="mt-6 space-y-6">
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
                  </Card>

                  {/* Recent Activity */}
                  <Card>
                    <Title>Recent Activity</Title>
                    <Text>Latest integration events and updates</Text>
                    <div className="mt-6 space-y-4">
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
                        <div key={index} className="flex items-start space-x-3">
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
