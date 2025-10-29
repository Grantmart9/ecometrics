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
  Cloud,
  Database,
  Zap,
  Shield,
  RefreshCw,
  ArrowLeft,
} from "lucide-react";

export default function CloudIntegrationPage() {
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
      icon: <Cloud className="h-8 w-8 text-green-600" />,
      title: "Multi-Cloud Support",
      description:
        "Connect to AWS, Azure, Google Cloud, and other major cloud platforms seamlessly.",
    },
    {
      icon: <Database className="h-8 w-8 text-green-600" />,
      title: "Data Source Integration",
      description:
        "Import data from ERP systems, IoT sensors, energy monitors, and more.",
    },
    {
      icon: <RefreshCw className="h-8 w-8 text-green-600" />,
      title: "Real-Time Sync",
      description:
        "Automatic data synchronization ensures your carbon data is always up-to-date.",
    },
    {
      icon: <Shield className="h-8 w-8 text-green-600" />,
      title: "Secure Connections",
      description:
        "Enterprise-grade security with encrypted data transfer and API authentication.",
    },
  ];

  const integrations = [
    {
      name: "AWS",
      description: "Amazon Web Services integration",
      services: ["EC2", "S3", "Lambda", "CloudWatch"],
      color: "bg-orange-500",
    },
    {
      name: "Azure",
      description: "Microsoft Azure integration",
      services: ["VMs", "Storage", "Functions", "Monitor"],
      color: "bg-blue-500",
    },
    {
      name: "Google Cloud",
      description: "Google Cloud Platform integration",
      services: [
        "Compute Engine",
        "Cloud Storage",
        "Cloud Functions",
        "Monitoring",
      ],
      color: "bg-green-500",
    },
    {
      name: "ERP Systems",
      description: "Enterprise resource planning",
      services: ["SAP", "Oracle", "Microsoft Dynamics", "Custom APIs"],
      color: "bg-purple-500",
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
                Cloud{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                  Integration
                </span>
              </motion.h1>

              <motion.p
                variants={fadeIn}
                className="text-xl text-gray-600 mb-8 max-w-lg mx-auto lg:mx-0"
              >
                Seamlessly integrate with your existing systems and data
                sources. Connect to cloud platforms, ERPs, and IoT devices
                automatically.
              </motion.p>

              <motion.div
                variants={fadeIn}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <Button
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg"
                >
                  Connect Systems
                </Button>

                <Link href="/#about">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-green-200 text-green-700 hover:bg-green-50 px-8 py-4 text-lg"
                  >
                    View Integrations
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
                    <Cloud className="h-6 w-6 mr-2 text-green-600" />
                    Integration Hub
                  </CardTitle>
                  <CardDescription className="text-center">
                    Connected systems and data sources
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-orange-100 p-3 rounded-lg text-center">
                      <Cloud className="h-6 w-6 mx-auto mb-1 text-orange-600" />
                      <span className="text-xs font-medium">AWS</span>
                      <div className="w-full h-1 bg-orange-200 rounded-full mt-1">
                        <div className="w-4/5 h-1 bg-orange-500 rounded-full"></div>
                      </div>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-lg text-center">
                      <Database className="h-6 w-6 mx-auto mb-1 text-blue-600" />
                      <span className="text-xs font-medium">Azure</span>
                      <div className="w-full h-1 bg-blue-200 rounded-full mt-1">
                        <div className="w-3/5 h-1 bg-blue-500 rounded-full"></div>
                      </div>
                    </div>
                    <div className="bg-green-100 p-3 rounded-lg text-center">
                      <Zap className="h-6 w-6 mx-auto mb-1 text-green-600" />
                      <span className="text-xs font-medium">IoT</span>
                      <div className="w-full h-1 bg-green-200 rounded-full mt-1">
                        <div className="w-2/3 h-1 bg-green-500 rounded-full"></div>
                      </div>
                    </div>
                    <div className="bg-purple-100 p-3 rounded-lg text-center">
                      <Shield className="h-6 w-6 mx-auto mb-1 text-purple-600" />
                      <span className="text-xs font-medium">ERP</span>
                      <div className="w-full h-1 bg-purple-200 rounded-full mt-1">
                        <div className="w-1/2 h-1 bg-purple-500 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Integrations Section */}
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
              Supported Integrations
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Connect to your favorite cloud platforms and business systems
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {integrations.map((integration, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl">
                        {integration.name}
                      </CardTitle>
                      <div
                        className={`w-3 h-3 ${integration.color} rounded-full`}
                      ></div>
                    </div>
                    <CardDescription>{integration.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {integration.services.map((service, serviceIndex) => (
                        <div
                          key={serviceIndex}
                          className="flex items-center text-sm text-gray-600"
                        >
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></div>
                          {service}
                        </div>
                      ))}
                    </div>
                    <Button className="w-full mt-4" variant="outline">
                      Connect
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
              Integration Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Powerful integration capabilities to connect all your data sources
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
              Ready to integrate your systems?
            </h2>
            <p className="text-xl text-green-100 mb-8">
              Connect all your data sources and get comprehensive carbon
              insights
            </p>
            <Button
              size="lg"
              className="bg-white text-green-600 hover:bg-gray-100 px-8 py-4 text-lg"
            >
              Start Integration
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
