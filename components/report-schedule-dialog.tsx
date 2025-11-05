"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Calendar,
  Clock,
  FileText,
  Settings,
  Save,
  Trash2,
  Plus,
  CheckCircle,
} from "lucide-react";

// Mock data for schedules
const scheduleTemplates = [
  {
    id: 1,
    name: "Daily Carbon Report",
    description: "Daily summary of carbon emissions",
    frequency: "daily",
    time: "08:00",
    format: "PDF",
    enabled: true,
  },
  {
    id: 2,
    name: "Weekly Performance Summary",
    description: "Weekly overview of performance metrics",
    frequency: "weekly",
    day: "monday",
    time: "09:00",
    format: "PDF",
    enabled: true,
  },
  {
    id: 3,
    name: "Monthly ESG Report",
    description: "Comprehensive monthly ESG metrics",
    frequency: "monthly",
    day: 1,
    time: "10:00",
    format: "PDF",
    enabled: true,
  },
  {
    id: 4,
    name: "Quarterly Sustainability Report",
    description: "Detailed quarterly sustainability analysis",
    frequency: "quarterly",
    day: 1,
    time: "11:00",
    format: "PDF",
    enabled: false,
  },
];

const frequencyOptions = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "yearly", label: "Yearly" },
];

const formatOptions = [
  { value: "PDF", label: "PDF" },
  { value: "Excel", label: "Excel" },
  { value: "CSV", label: "CSV" },
  { value: "JSON", label: "JSON" },
];

interface ReportScheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReportScheduleDialog({
  open,
  onOpenChange,
}: ReportScheduleDialogProps) {
  const [schedules, setSchedules] = useState(scheduleTemplates);
  const [isCreating, setIsCreating] = useState(false);
  const [newSchedule, setNewSchedule] = useState({
    name: "",
    description: "",
    frequency: "monthly",
    time: "09:00",
    format: "PDF",
    enabled: true,
  });

  const handleSaveSchedule = () => {
    const id = Math.max(...schedules.map((s) => s.id)) + 1;
    setSchedules([...schedules, { ...newSchedule, id }]);
    setIsCreating(false);
    setNewSchedule({
      name: "",
      description: "",
      frequency: "monthly",
      time: "09:00",
      format: "PDF",
      enabled: true,
    });
  };

  const handleToggleSchedule = (id: number) => {
    setSchedules(
      schedules.map((schedule) =>
        schedule.id === id
          ? { ...schedule, enabled: !schedule.enabled }
          : schedule
      )
    );
  };

  const handleDeleteSchedule = (id: number) => {
    setSchedules(schedules.filter((schedule) => schedule.id !== id));
  };

  const getFrequencyLabel = (frequency: string, schedule: any) => {
    switch (frequency) {
      case "daily":
        return "Daily at " + schedule.time;
      case "weekly":
        return `Weekly on ${schedule.day} at ${schedule.time}`;
      case "monthly":
        return `Monthly on day ${schedule.day} at ${schedule.time}`;
      case "quarterly":
        return `Quarterly on day ${schedule.day} at ${schedule.time}`;
      case "yearly":
        return "Yearly on January 1st at " + schedule.time;
      default:
        return frequency;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5 text-green-600" />
            <span>Configure Report Schedules</span>
          </DialogTitle>
          <DialogDescription>
            Set up automated report generation schedules for your sustainability
            metrics.
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[70vh] space-y-4">
          {/* Active Schedules */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Active Schedules</h3>
              <Button
                onClick={() => setIsCreating(true)}
                size="sm"
                className="bg-green-600 hover:bg-green-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Schedule
              </Button>
            </div>

            <div className="space-y-3">
              {schedules.map((schedule) => (
                <Card
                  key={schedule.id}
                  className="border-l-4 border-l-green-500"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium text-gray-900">
                            {schedule.name}
                          </h4>
                          <div
                            className={`w-2 h-2 rounded-full ${
                              schedule.enabled ? "bg-green-500" : "bg-gray-300"
                            }`}
                          />
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {schedule.description}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>
                              {getFrequencyLabel(schedule.frequency, schedule)}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <FileText className="h-3 w-3" />
                            <span>{schedule.format}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleSchedule(schedule.id)}
                          className={
                            schedule.enabled
                              ? "text-green-600"
                              : "text-gray-500"
                          }
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteSchedule(schedule.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Create New Schedule */}
          <AnimatePresence>
            {isCreating && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border border-green-200 bg-green-50">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Create New Schedule
                    </CardTitle>
                    <CardDescription>
                      Set up a new automated report generation schedule.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Report Name
                        </label>
                        <Input
                          value={newSchedule.name}
                          onChange={(e) =>
                            setNewSchedule({
                              ...newSchedule,
                              name: e.target.value,
                            })
                          }
                          placeholder="e.g., Monthly Carbon Report"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Frequency
                        </label>
                        <select
                          value={newSchedule.frequency}
                          onChange={(e) =>
                            setNewSchedule({
                              ...newSchedule,
                              frequency: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                          {frequencyOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Time
                        </label>
                        <Input
                          type="time"
                          value={newSchedule.time}
                          onChange={(e) =>
                            setNewSchedule({
                              ...newSchedule,
                              time: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Format
                        </label>
                        <select
                          value={newSchedule.format}
                          onChange={(e) =>
                            setNewSchedule({
                              ...newSchedule,
                              format: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                          {formatOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <Input
                        value={newSchedule.description}
                        onChange={(e) =>
                          setNewSchedule({
                            ...newSchedule,
                            description: e.target.value,
                          })
                        }
                        placeholder="Brief description of the report"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="enabled"
                        checked={newSchedule.enabled}
                        onChange={(e) =>
                          setNewSchedule({
                            ...newSchedule,
                            enabled: e.target.checked,
                          })
                        }
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <label
                        htmlFor="enabled"
                        className="text-sm text-gray-700"
                      >
                        Enable this schedule
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        onClick={handleSaveSchedule}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save Schedule
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setIsCreating(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-end space-x-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
