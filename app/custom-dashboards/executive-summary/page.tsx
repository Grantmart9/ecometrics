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
import { TrendingUp, ArrowLeft, Download, Share2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

const executiveData = {
  "total-emissions": {
    value: "1,245",
    unit: "tCO₂e",
    trend: "-8.2%",
    trendUp: false,
  },
  "target-progress": {
    value: "94.3",
    unit: "%",
    trend: "+2.1%",
    trendUp: true,
  },
  "emissions-trend": [
    { month: "Jan", actual: 1450, target: 1300, reduction: 150 },
    { month: "Feb", actual: 1380, target: 1300, reduction: 80 },
    { month: "Mar", actual: 1420, target: 1300, reduction: -120 },
    { month: "Apr", actual: 1290, target: 1300, reduction: 10 },
    { month: "May", actual: 1245, target: 1300, reduction: 55 },
  ],
  "scope-breakdown": [
    { name: "Scope 1", value: 380, color: "#ef4444" },
    { name: "Scope 2", value: 520, color: "#f59e0b" },
    { name: "Scope 3", value: 345, color: "#3b82f6" },
  ],
};

export default function ExecutiveSummaryPage() {
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
      case "area-chart":
        return (
          <div className="h-80">
            <RechartsResponsiveContainer width="100%" height="100%">
              <RechartsAreaChart
                data={executiveData["emissions-trend"]}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <RechartsCartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
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
                  tickFormatter={(value) => `${value}`}
                />
                <RechartsTooltip
                  formatter={(value) => [value, ""]}
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
                  dataKey="actual"
                  stackId="1"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.6}
                  strokeWidth={2}
                  name="Actual"
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

      case "donut-chart":
        return (
          <div className="h-80">
            <RechartsResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <RechartsPie
                  data={executiveData["scope-breakdown"]}
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
                  {executiveData["scope-breakdown"].map((entry, index) => (
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

      case "metric-card":
        const data =
          executiveData[
            widget.dataKey as "total-emissions" | "target-progress"
          ];
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-4xl font-bold text-green-600">{data.value}</p>
              <p className="text-gray-600 mt-2">{data.unit}</p>
              {data.trend && (
                <p
                  className={`text-sm mt-1 ${
                    data.trendUp ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {data.trend} from last month
                </p>
              )}
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

  const widgets = [
    {
      id: 1,
      type: "metric-card",
      title: "Total Emissions",
      dataKey: "total-emissions",
    },
    {
      id: 2,
      type: "metric-card",
      title: "Target Achievement",
      dataKey: "target-progress",
    },
    {
      id: 3,
      type: "area-chart",
      title: "Monthly Emissions Trend",
      dataKey: "emissions-trend",
    },
    {
      id: 4,
      type: "donut-chart",
      title: "Scope Breakdown",
      dataKey: "scope-breakdown",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-sky-50">
      {/* Back button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Link
          href="/custom-dashboards"
          className="inline-flex items-center text-gray-600 hover:text-green-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Dashboards
        </Link>
      </div>

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
                  Executive Summary Dashboard
                </h1>
                <p className="text-lg text-gray-600">
                  High-level metrics and KPIs for leadership decision-making
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
