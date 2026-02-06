"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { crudService } from "@/lib/crudService";
import { useAuth } from "@/lib/auth-context";
import { useEntityRelationship } from "@/lib/entityRelationshipContext";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

const ThreeBackground = dynamic(() => import("@/components/three-bg"), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 -z-10">
      <div className="w-full h-full bg-gradient-to-br from-green-50 via-emerald-50 to-sky-50" />
    </div>
  ),
});

// Activity type options matching the tabs
const activityTypes = [
  { id: "overview", label: "Overview", value: "Consumption" },
  { id: "stationary", label: "Stationary Fuels", value: "Stationary Fuels" },
  { id: "mobile", label: "Mobile Fuels", value: "Mobile Fuels" },
  { id: "fugitive", label: "Fugitive Fuels", value: "Fugitive Fuels" },
  { id: "process", label: "Process", value: "Process" },
  { id: "wastewater", label: "Waste Water", value: "Waste Water" },
  { id: "renewable", label: "Renewable Electricity", value: "Renewable Electricity" },
];

// Color palette for pie chart
const COLORS = ["#10B981", "#3B82F6", "#F59E0B", "#EF4444", "#8B5CF6"];

interface DashboardData {
  total: number;
  scope1: number;
  scope2: number;
  scope3: number;
}

export default function DashboardPage() {
  const { session } = useAuth();
  const { selectedEntityId } = useEntityRelationship();
  
  // State for selected activity type
  const [selectedType, setSelectedType] = useState("Consumption");
  
  // State for date range
  const [startDate, setStartDate] = useState("2025-02-04");
  const [endDate, setEndDate] = useState("2026-02-06");
  
  // State for dashboard data
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Default entity ID if not selected
  const entityId = selectedEntityId || "140634501";

  // Format date to YYYYMMDD
  const formatDateForApi = (dateStr: string) => {
    return dateStr.replace(/-/g, "");
  };

  // Fetch dashboard data
  const fetchDashboardData = useCallback(async () => {
    if (!session?.access_token) return;

    setLoading(true);
    setError(null);

    try {
      const formattedStartDate = formatDateForApi(startDate);
      const formattedEndDate = formatDateForApi(endDate);

      const requestBody = {
        data: JSON.stringify([
          {
            RecordSet: "Dashboard",
            TableName: "get_carboncalc",
            Action: "procedure",
            Fields: {
              Type: selectedType,
              Entity: entityId,
              SrtDate: formattedStartDate,
              EndDatee: formattedEndDate,
            },
          },
        ]),
        PageNo: "1",
        NoOfLines: "300",
        CrudMessage: "@CrudMessage",
      };

      console.log("Fetching dashboard data with request:", requestBody);

      const response = await crudService.callCrud(requestBody);

      console.log("Dashboard API response:", response);

      if (response?.Data && response.Data[0]?.JsonData) {
        const jsonData = JSON.parse(response.Data[0].JsonData);
        const tableData = jsonData.Dashboard?.TableData || [];

        // Parse the response format
        // Response: [{"Totals": 20.4}, {"Scope1": 0}, {"Scope2": 0}, {"Scope3": 20.4}]
        const dataObj: DashboardData = {
          total: 0,
          scope1: 0,
          scope2: 0,
          scope3: 0,
        };

        tableData.forEach((item: any) => {
          if (item.Totals !== undefined) {
            dataObj.total = parseFloat(item.Totals) || 0;
          }
          if (item.Scope1 !== undefined) {
            dataObj.scope1 = parseFloat(item.Scope1) || 0;
          }
          if (item.Scope2 !== undefined) {
            dataObj.scope2 = parseFloat(item.Scope2) || 0;
          }
          if (item.Scope3 !== undefined) {
            dataObj.scope3 = parseFloat(item.Scope3) || 0;
          }
        });

        console.log("Parsed dashboard data:", dataObj);
        setDashboardData(dataObj);
      } else {
        console.warn("No data found in response");
        setDashboardData(null);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, [session?.access_token, selectedType, startDate, endDate, entityId]);

  // Fetch data when dependencies change
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Handle activity type selection
  const handleTypeSelect = (typeId: string) => {
    const activityType = activityTypes.find((t) => t.id === typeId);
    if (activityType) {
      setSelectedType(activityType.value);
    }
  };

  // Handle date changes
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(e.target.value);
  };

  // Clear date fields
  const handleClearStartDate = () => {
    setStartDate("");
  };

  const handleClearEndDate = () => {
    setEndDate("");
  };

  // Prepare pie chart data
  const pieData = dashboardData
    ? [
        { name: "Scope 1", value: dashboardData.scope1 },
        { name: "Scope 2", value: dashboardData.scope2 },
        { name: "Scope 3", value: dashboardData.scope3 },
      ].filter((item) => item.value > 0)
    : [];

  // Calculate total for percentage display
  const pieTotal = pieData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="min-h-screen relative">
      {/* 3D Background */}
      <ThreeBackground />

      {/* Main Content */}
      <div className="relative z-10 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Dashboard
            </h1>
            <p className="text-lg text-gray-600">
              View your carbon emissions breakdown by scope
            </p>
          </motion.div>

          {/* Activity Type Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-6"
          >
            <div className="flex flex-wrap gap-2">
              {activityTypes.map((type) => (
                <Button
                  key={type.id}
                  variant={selectedType === type.value ? "default" : "outline"}
                  onClick={() => handleTypeSelect(type.id)}
                  className={
                    selectedType === type.value
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "border-green-200 text-green-700 hover:bg-green-50"
                  }
                >
                  {type.label}
                </Button>
              ))}
            </div>
          </motion.div>

          {/* Date Range Inputs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8 flex flex-wrap gap-4 items-end"
          >
            <div className="w-full sm:w-auto">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <div className="relative">
                <Input
                  type="date"
                  value={startDate}
                  onChange={handleStartDateChange}
                  className="pr-10 border-green-200 focus:border-green-500"
                />
                {startDate && (
                  <button
                    type="button"
                    onClick={handleClearStartDate}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
            <div className="w-full sm:w-auto">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <div className="relative">
                <Input
                  type="date"
                  value={endDate}
                  onChange={handleEndDateChange}
                  className="pr-10 border-green-200 focus:border-green-500"
                />
                {endDate && (
                  <button
                    type="button"
                    onClick={handleClearEndDate}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          </motion.div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700"
            >
              {error}
            </motion.div>
          )}

          {/* Pie Chart Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="backdrop-blur-md bg-white/20 border-white/30 shadow-xl">
              <CardHeader>
                <CardTitle className="text-gray-900">
                  Total CO₂e by Scope
                </CardTitle>
                <p className="text-sm text-gray-600">
                  {selectedType === "Consumption" ? "All Activities" : selectedType} -{" "}
                  {startDate && endDate
                    ? `${startDate} to ${endDate}`
                    : "Select date range"}
                </p>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center h-[400px]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                  </div>
                ) : dashboardData ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Pie Chart */}
                    <div className="h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={80}
                            outerRadius={140}
                            fill="#8884d8"
                            paddingAngle={2}
                            dataKey="value"
                            label={({ name, percent }) =>
                              `${name}: ${(percent * 100).toFixed(1)}%`
                            }
                            labelLine={false}
                          >
                            {pieData.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(value: number) => [
                              `${value.toFixed(2)} tCO₂e`,
                              "Emissions",
                            ]}
                          />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Summary Stats */}
                    <div className="flex flex-col justify-center space-y-6">
                      {/* Total CO2e */}
                      <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                        <p className="text-sm font-medium text-gray-600 mb-1">
                          Total CO₂e
                        </p>
                        <p className="text-4xl font-bold text-green-600">
                          {dashboardData.total.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-500">tonnes CO₂e</p>
                      </div>

                      {/* Scope Breakdown */}
                      <div className="space-y-4">
                        {pieData.map((item, index) => (
                          <div key={item.name} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center">
                                <div
                                  className="w-3 h-3 rounded-full mr-2"
                                  style={{
                                    backgroundColor: COLORS[index % COLORS.length],
                                  }}
                                ></div>
                                <span className="text-sm font-medium text-gray-700">
                                  {item.name}
                                </span>
                              </div>
                              <span className="text-sm font-semibold text-gray-900">
                                {item.value.toFixed(2)} tCO₂e{" "}
                                <span className="text-gray-500 font-normal">
                                  ({((item.value / pieTotal) * 100).toFixed(1)}%)
                                </span>
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="h-2 rounded-full transition-all duration-500"
                                style={{
                                  width: `${(item.value / pieTotal) * 100}%`,
                                  backgroundColor:
                                    COLORS[index % COLORS.length],
                                }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-[400px] text-gray-500">
                    No data available for the selected period
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
