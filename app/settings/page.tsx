"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import ThreeBackground from "@/components/three-bg";
import {
  Building2,
  Bell,
  User,
  Settings as SettingsIcon,
  Save,
  Mail,
  Sun,
  Moon,
  Monitor,
  Shield,
  Database,
  Palette,
  ArrowLeft,
} from "lucide-react";

export default function SettingsPage() {
  console.log("SettingsPage component rendered");
  console.log(
    "Current URL:",
    typeof window !== "undefined" ? window.location.href : "SSR"
  );
  console.log("Settings page loaded successfully");

  const router = useRouter();

  const [settings, setSettings] = useState({
    companyName: "",
    contactEmail: "",
    darkMode: false,
    notifications: true,
    theme: "light",
  });

  const [activeTab, setActiveTab] = useState("company");

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const handleSave = () => {
    // Handle save logic here
    console.log("Settings saved:", settings);
  };

  const tabs = [
    { id: "company", label: "Company", icon: Building2 },
    { id: "preferences", label: "Preferences", icon: SettingsIcon },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-sky-50">
      <ThreeBackground />

      <div className="relative flex-1 space-y-6 p-8 pt-6">
        <motion.div
          initial="initial"
          animate="animate"
          variants={staggerChildren}
          className="space-y-6"
        >
          <motion.div
            variants={fadeIn}
            className="flex items-center justify-between"
          >
            <div>
              <h2 className="text-4xl font-bold tracking-tight text-gray-900">
                Settings
              </h2>
              <p className="text-lg text-gray-600 mt-2">
                Manage your account and application preferences
              </p>
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </motion.div>
          </motion.div>

          {/* Settings Navigation */}
          <motion.div variants={fadeIn}>
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardContent className="p-0">
                <div className="flex border-b border-gray-200">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <motion.button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 px-6 py-4 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                          activeTab === tab.id
                            ? "text-green-600 border-b-2 border-green-600 bg-green-50/50"
                            : "text-gray-600 hover:text-green-600 hover:bg-gray-50/50"
                        }`}
                        whileHover={{ y: -1 }}
                        whileTap={{ y: 0 }}
                      >
                        <Icon className="h-4 w-4" />
                        {tab.label}
                      </motion.button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Settings Content */}
          <AnimatePresence mode="wait">
            {activeTab === "company" && (
              <motion.div
                key="company"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="grid gap-6 md:grid-cols-2"
              >
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-shadow">
                  <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      Company Information
                    </CardTitle>
                    <CardDescription className="text-green-100">
                      Update your company details and profile information.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6 p-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="company-name"
                        className="text-sm font-medium text-gray-700"
                      >
                        Company Name
                      </Label>
                      <Input
                        id="company-name"
                        placeholder="Enter company name"
                        className="border-gray-200 focus:border-green-500 focus:ring-green-500"
                        value={settings.companyName}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            companyName: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="contact"
                        className="text-sm font-medium text-gray-700"
                      >
                        Contact Email
                      </Label>
                      <Input
                        id="contact"
                        type="email"
                        placeholder="Enter contact email"
                        className="border-gray-200 focus:border-green-500 focus:ring-green-500"
                        value={settings.contactEmail}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            contactEmail: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="pt-4">
                      <Button
                        onClick={handleSave}
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save Company Information
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-shadow">
                  <CardHeader className="bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-2">
                      <Database className="h-5 w-5" />
                      Account Status
                    </CardTitle>
                    <CardDescription className="text-emerald-100">
                      Your current account information and status.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 p-6">
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <h4 className="font-medium text-green-800 mb-2">
                        Account Type
                      </h4>
                      <p className="text-sm text-green-700">
                        Professional Plan
                      </p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <h4 className="font-medium text-blue-800 mb-2">
                        Credits Used
                      </h4>
                      <p className="text-sm text-blue-700">
                        1,247 of 5,000 this month
                      </p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                      <h4 className="font-medium text-purple-800 mb-2">
                        Storage Used
                      </h4>
                      <p className="text-sm text-purple-700">2.3 GB of 10 GB</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeTab === "preferences" && (
              <motion.div
                key="preferences"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="grid gap-6 md:grid-cols-2"
              >
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-shadow">
                  <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-2">
                      <Palette className="h-5 w-5" />
                      Appearance
                    </CardTitle>
                    <CardDescription className="text-blue-100">
                      Customize the look and feel of your application.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6 p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label className="text-sm font-medium text-gray-700">
                            Theme
                          </Label>
                          <p className="text-xs text-gray-500">
                            Choose your preferred theme
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant={
                              settings.theme === "light" ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() =>
                              setSettings({ ...settings, theme: "light" })
                            }
                            className="flex items-center gap-1"
                          >
                            <Sun className="h-4 w-4" />
                            Light
                          </Button>
                          <Button
                            variant={
                              settings.theme === "dark" ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() =>
                              setSettings({ ...settings, theme: "dark" })
                            }
                            className="flex items-center gap-1"
                          >
                            <Moon className="h-4 w-4" />
                            Dark
                          </Button>
                          <Button
                            variant={
                              settings.theme === "system"
                                ? "default"
                                : "outline"
                            }
                            size="sm"
                            onClick={() =>
                              setSettings({ ...settings, theme: "system" })
                            }
                            className="flex items-center gap-1"
                          >
                            <Monitor className="h-4 w-4" />
                            System
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-shadow">
                  <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-2">
                      <SettingsIcon className="h-5 w-5" />
                      General Preferences
                    </CardTitle>
                    <CardDescription className="text-purple-100">
                      Configure general application settings.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6 p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label className="text-sm font-medium text-gray-700">
                            Data Refresh Interval
                          </Label>
                          <p className="text-xs text-gray-500">
                            How often to update dashboard data
                          </p>
                        </div>
                        <select className="border border-gray-200 rounded-md px-3 py-1 text-sm">
                          <option>30 seconds</option>
                          <option>1 minute</option>
                          <option>5 minutes</option>
                          <option>15 minutes</option>
                        </select>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label className="text-sm font-medium text-gray-700">
                            Default View
                          </Label>
                          <p className="text-xs text-gray-500">
                            Your preferred dashboard view
                          </p>
                        </div>
                        <select className="border border-gray-200 rounded-md px-3 py-1 text-sm">
                          <option>Overview</option>
                          <option>Detailed Analytics</option>
                          <option>Reports</option>
                        </select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeTab === "notifications" && (
              <motion.div
                key="notifications"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="grid gap-6 md:grid-cols-2"
              >
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-shadow">
                  <CardHeader className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="h-5 w-5" />
                      Notification Preferences
                    </CardTitle>
                    <CardDescription className="text-yellow-100">
                      Manage how you receive notifications and alerts.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6 p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label className="text-sm font-medium text-gray-700">
                            Email Notifications
                          </Label>
                          <p className="text-xs text-gray-500">
                            Receive notifications via email
                          </p>
                        </div>
                        <Switch
                          id="notifications"
                          checked={settings.notifications}
                          onCheckedChange={(checked) =>
                            setSettings({ ...settings, notifications: checked })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label className="text-sm font-medium text-gray-700">
                            Report Alerts
                          </Label>
                          <p className="text-xs text-gray-500">
                            Get notified when reports are ready
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label className="text-sm font-medium text-gray-700">
                            System Updates
                          </Label>
                          <p className="text-xs text-gray-500">
                            Important system notifications
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-shadow">
                  <CardHeader className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-2">
                      <Mail className="h-5 w-5" />
                      Notification Schedule
                    </CardTitle>
                    <CardDescription className="text-indigo-100">
                      Configure when and how often you receive notifications.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6 p-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">
                          Daily Summary Time
                        </Label>
                        <select className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm">
                          <option>8:00 AM</option>
                          <option>9:00 AM</option>
                          <option>10:00 AM</option>
                          <option>12:00 PM</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">
                          Weekly Report Schedule
                        </Label>
                        <select className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm">
                          <option>Monday</option>
                          <option>Tuesday</option>
                          <option>Wednesday</option>
                          <option>Thursday</option>
                          <option>Friday</option>
                        </select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeTab === "security" && (
              <motion.div
                key="security"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="grid gap-6 md:grid-cols-2"
              >
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-shadow">
                  <CardHeader className="bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Security Settings
                    </CardTitle>
                    <CardDescription className="text-red-100">
                      Manage your account security and access controls.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6 p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label className="text-sm font-medium text-gray-700">
                            Two-Factor Authentication
                          </Label>
                          <p className="text-xs text-gray-500">
                            Add an extra layer of security
                          </p>
                        </div>
                        <Switch />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label className="text-sm font-medium text-gray-700">
                            Session Timeout
                          </Label>
                          <p className="text-xs text-gray-500">
                            Auto-logout after inactivity
                          </p>
                        </div>
                        <select className="border border-gray-200 rounded-md px-3 py-1 text-sm">
                          <option>30 minutes</option>
                          <option>1 hour</option>
                          <option>4 hours</option>
                          <option>8 hours</option>
                        </select>
                      </div>
                    </div>

                    <div className="pt-4 space-y-3">
                      <Button variant="outline" className="w-full">
                        Change Password
                      </Button>
                      <Button variant="outline" className="w-full">
                        Download Security Report
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-shadow">
                  <CardHeader className="bg-gradient-to-r from-gray-500 to-slate-500 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Access Log
                    </CardTitle>
                    <CardDescription className="text-gray-100">
                      Recent account activity and login history.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 p-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Login from Chrome
                          </p>
                          <p className="text-xs text-gray-500">
                            192.168.1.1 - New York, US
                          </p>
                        </div>
                        <span className="text-xs text-gray-400">
                          2 hours ago
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Password Changed
                          </p>
                          <p className="text-xs text-gray-500">
                            Security update
                          </p>
                        </div>
                        <span className="text-xs text-gray-400">1 day ago</span>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Two-Factor Enabled
                          </p>
                          <p className="text-xs text-gray-500">
                            Enhanced security activated
                          </p>
                        </div>
                        <span className="text-xs text-gray-400">
                          3 days ago
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
