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
  FileText,
  Calendar,
  Mail,
  Download,
  Clock,
  BarChart3,
  ArrowLeft,
} from "lucide-react";

export default function AutomatedReportsPage() {
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
      icon: <Calendar className="h-8 w-8 text-green-600" />,
      title: "Scheduled Reports",
      description:
        "Set up automatic report generation on daily, weekly, monthly, or custom schedules.",
    },
    {
      icon: <Mail className="h-8 w-8 text-green-600" />,
      title: "Email Delivery",
      description:
        "Automatically send reports to stakeholders via email with customizable templates.",
    },
    {
      icon: <Download className="h-8 w-8 text-green-600" />,
      title: "Multiple Formats",
      description:
        "Export reports in PDF, Excel, CSV, or JSON formats for different use cases.",
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-green-600" />,
      title: "Custom Templates",
      description:
        "Design and save custom report templates with your branding and preferred metrics.",
    },
  ];

  const reportTypes = [
    {
      title: "Daily Summary",
      description: "Quick overview of yesterday's emissions with key metrics",
      frequency: "Daily at 9 AM",
    },
    {
      title: "Weekly Analysis",
      description: "Detailed weekly trends and comparisons",
      frequency: "Every Monday",
    },
    {
      title: "Monthly Report",
      description: "Comprehensive monthly carbon footprint analysis",
      frequency: "1st of each month",
    },
    {
      title: "Quarterly Review",
      description: "Strategic quarterly insights and recommendations",
      frequency: "Quarterly",
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
                Automated{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                  Reports
                </span>
              </motion.h1>

              <motion.p
                variants={fadeIn}
                className="text-xl text-gray-600 mb-8 max-w-lg mx-auto lg:mx-0"
              >
                Generate comprehensive reports automatically and schedule them
                for stakeholders with our intelligent reporting system.
              </motion.p>

              <motion.div
                variants={fadeIn}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <Button
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg"
                >
                  Create Report
                </Button>

                <Link href="/#about">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-green-200 text-green-700 hover:bg-green-50 px-8 py-4 text-lg"
                  >
                    Learn More
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
                    <FileText className="h-6 w-6 mr-2 text-green-600" />
                    Report Dashboard
                  </CardTitle>
                  <CardDescription className="text-center">
                    Automated report generation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-green-600 mr-2" />
                        <span className="text-sm font-medium">
                          Daily Report
                        </span>
                      </div>
                      <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                        Scheduled
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-blue-600 mr-2" />
                        <span className="text-sm font-medium">
                          Weekly Summary
                        </span>
                      </div>
                      <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                        Active
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 text-purple-600 mr-2" />
                        <span className="text-sm font-medium">
                          Monthly Review
                        </span>
                      </div>
                      <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded">
                        Pending
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Report Types Section */}
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
              Report Types
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose from various automated report types to keep your team
              informed
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {reportTypes.map((report, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-xl">{report.title}</CardTitle>
                    <CardDescription className="text-sm text-green-600 font-medium">
                      {report.frequency}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{report.description}</p>
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
              Automation Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Powerful automation tools to streamline your reporting workflow
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
              Ready to automate your reports?
            </h2>
            <p className="text-xl text-green-100 mb-8">
              Save hours every week with automated carbon reporting
            </p>
            <Button
              size="lg"
              className="bg-white text-green-600 hover:bg-gray-100 px-8 py-4 text-lg"
            >
              Start Automating
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
