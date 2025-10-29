"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import {
  Leaf,
  Layout,
  BarChart3,
  PieChart,
  TrendingUp,
  Settings,
  Plus,
  ArrowLeft,
} from "lucide-react";

export default function CustomDashboardsPage() {
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

  const features = [
    {
      icon: <Layout className="h-8 w-8 text-green-600" />,
      title: "Drag & Drop Builder",
      description:
        "Easily create custom layouts by dragging and dropping widgets and charts.",
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-green-600" />,
      title: "Multiple Chart Types",
      description:
        "Choose from bar charts, line graphs, pie charts, gauges, and more.",
    },
    {
      icon: <Settings className="h-8 w-8 text-green-600" />,
      title: "Custom Metrics",
      description:
        "Define and track your own custom sustainability KPIs and metrics.",
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-green-600" />,
      title: "Real-Time Updates",
      description:
        "Dashboards automatically refresh with the latest emission data.",
    },
  ];

  const dashboardTemplates = [
    {
      title: "Executive Overview",
      description: "High-level metrics for C-suite executives",
      widgets: ["Total Emissions", "Reduction Goals", "Cost Savings"],
    },
    {
      title: "Operations Dashboard",
      description: "Detailed operational carbon tracking",
      widgets: ["Facility Breakdown", "Energy Usage", "Supply Chain"],
    },
    {
      title: "Sustainability Report",
      description: "Comprehensive sustainability metrics",
      widgets: ["Carbon Footprint", "ESG Scores", "Compliance Status"],
    },
    {
      title: "Team Performance",
      description: "Individual and team carbon reduction progress",
      widgets: ["Personal Goals", "Team Rankings", "Achievements"],
    },
  ];

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

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="initial"
              animate="animate"
              variants={staggerChildren}
              className="text-center lg:text-left"
            >
              <motion.h1
                variants={fadeIn}
                className="text-5xl lg:text-7xl font-extrabold text-gray-900 mb-6"
              >
                Custom{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                  Dashboards
                </span>
              </motion.h1>

              <motion.p
                variants={fadeIn}
                className="text-xl text-gray-600 mb-8 max-w-lg mx-auto lg:mx-0"
              >
                Create personalized dashboards to visualize your sustainability
                metrics with our intuitive drag-and-drop builder.
              </motion.p>

              <motion.div
                variants={fadeIn}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <Button
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Create Dashboard
                </Button>

                <Link href="/#about">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-green-200 text-green-700 hover:bg-green-50 px-8 py-4 text-lg"
                  >
                    View Templates
                  </Button>
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <Card className="bg-white/90 backdrop-blur-md border-0 shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-2xl text-center flex items-center justify-center">
                    <Layout className="h-6 w-6 mr-2 text-green-600" />
                    Dashboard Preview
                  </CardTitle>
                  <CardDescription className="text-center">
                    Customizable widgets and layouts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-green-100 p-3 rounded-lg text-center">
                      <BarChart3 className="h-6 w-6 mx-auto mb-1 text-green-600" />
                      <span className="text-xs font-medium">
                        Emissions Chart
                      </span>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-lg text-center">
                      <PieChart className="h-6 w-6 mx-auto mb-1 text-blue-600" />
                      <span className="text-xs font-medium">
                        Source Breakdown
                      </span>
                    </div>
                    <div className="bg-purple-100 p-3 rounded-lg text-center">
                      <TrendingUp className="h-6 w-6 mx-auto mb-1 text-purple-600" />
                      <span className="text-xs font-medium">
                        Trend Analysis
                      </span>
                    </div>
                    <div className="bg-orange-100 p-3 rounded-lg text-center">
                      <Settings className="h-6 w-6 mx-auto mb-1 text-orange-600" />
                      <span className="text-xs font-medium">Custom KPI</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Templates Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Dashboard Templates
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get started quickly with pre-built templates designed for
              different roles and use cases
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {dashboardTemplates.map((template, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-xl">{template.title}</CardTitle>
                    <CardDescription>{template.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {template.widgets.map((widget, widgetIndex) => (
                        <div
                          key={widgetIndex}
                          className="flex items-center text-sm text-gray-600"
                        >
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                          {widget}
                        </div>
                      ))}
                    </div>
                    <Button className="w-full mt-4" variant="outline">
                      Use Template
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Dashboard Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Powerful customization tools to create the perfect dashboard for
              your needs
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="mb-4">{feature.icon}</div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-emerald-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to build your dashboard?
            </h2>
            <p className="text-xl text-green-100 mb-8">
              Create custom dashboards that tell your sustainability story
            </p>
            <Button
              size="lg"
              className="bg-white text-green-600 hover:bg-gray-100 px-8 py-4 text-lg"
            >
              Start Building
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
