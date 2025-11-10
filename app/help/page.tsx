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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ThreeBackground from "@/components/three-bg";
import {
  HelpCircle,
  Book,
  Search,
  Mail,
  MessageCircle,
  Phone,
  Globe,
  Database,
  TrendingUp,
  FileText,
  Settings,
  ChevronRight,
  ChevronDown,
  ExternalLink,
  Users,
  Zap,
  Shield,
  Clock,
  ArrowLeft,
} from "lucide-react";

export default function Help() {
  console.log("HelpPage component rendered");
  console.log(
    "Current URL:",
    typeof window !== "undefined" ? window.location.href : "SSR"
  );
  console.log("Help page loaded successfully");

  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState("overview");

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

  const categories = [
    { id: "overview", label: "Overview", icon: Book },
    { id: "navigation", label: "Navigation", icon: Globe },
    { id: "calculations", label: "Calculations", icon: TrendingUp },
    { id: "faq", label: "FAQ", icon: HelpCircle },
    { id: "contact", label: "Contact", icon: MessageCircle },
  ];

  const faqs = [
    {
      question: "How accurate are the emissions calculations?",
      answer:
        "Our calculations are based on internationally recognized emission factors and methodologies. For most business applications, these provide sufficiently accurate estimates. For regulatory compliance or precise carbon accounting, we recommend consulting with environmental experts.",
    },
    {
      question: "Can I export reports and data?",
      answer:
        "Yes, you can export your reports in multiple formats including PDF, Excel, and CSV. The Reports section provides options to download individual reports or generate comprehensive data exports for analysis.",
    },
    {
      question: "What units of measurement are used?",
      answer:
        "We primarily use kg CO2e (carbon dioxide equivalent) for emissions measurements. This standardized unit allows for accurate comparison across different emission sources and types.",
    },
    {
      question: "How do I add new data sources?",
      answer:
        "Navigate to the Input section and select the appropriate category. You can manually enter data or upload CSV files. For automated data integration, check our Cloud Integration features.",
    },
    {
      question: "Is my data secure and private?",
      answer:
        "Yes, we employ enterprise-grade security measures including encryption, secure data centers, and compliance with international data protection standards. Your data is never shared with third parties without your explicit consent.",
    },
    {
      question: "Can I collaborate with team members?",
      answer:
        "Our Team Collaboration features allow you to share dashboards, reports, and insights with colleagues. You can set different permission levels and manage access controls for sensitive data.",
    },
  ];

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <motion.div variants={fadeIn} className="text-center">
            <h2 className="text-4xl font-bold tracking-tight text-gray-900">
              Help & Support
            </h2>
            <p className="text-lg text-gray-600 mt-2 max-w-2xl mx-auto">
              Find answers, learn how to use EcoMetrics, and get the help you
              need
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div variants={fadeIn} className="max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search help articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-gray-200 focus:border-green-500 focus:ring-green-500 bg-white/80 backdrop-blur-sm"
              />
            </div>
          </motion.div>

          {/* Category Navigation */}
          <motion.div variants={fadeIn}>
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardContent className="p-0">
                <div className="flex border-b border-gray-200 overflow-x-auto">
                  {categories.map((category) => {
                    const Icon = category.icon;
                    return (
                      <motion.button
                        key={category.id}
                        onClick={() => setActiveCategory(category.id)}
                        className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap ${
                          activeCategory === category.id
                            ? "text-green-600 border-b-2 border-green-600 bg-green-50/50"
                            : "text-gray-600 hover:text-green-600 hover:bg-gray-50/50"
                        }`}
                        whileHover={{ y: -1 }}
                        whileTap={{ y: 0 }}
                      >
                        <Icon className="h-4 w-4" />
                        {category.label}
                      </motion.button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Content Area */}
          <AnimatePresence mode="wait">
            {activeCategory === "overview" && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
              >
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all hover:-translate-y-1">
                  <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-2">
                      <Book className="h-5 w-5" />
                      Welcome to EcoMetrics
                    </CardTitle>
                    <CardDescription className="text-green-100">
                      Your complete guide to carbon tracking
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <p className="text-sm text-gray-600 mb-4">
                      EcoMetrics is a comprehensive carbon emissions tracking
                      platform designed to help businesses measure, analyze, and
                      reduce their environmental impact.
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        Real-time emissions tracking
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FileText className="h-4 w-4 text-green-600" />
                        Automated reporting
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="h-4 w-4 text-green-600" />
                        Team collaboration
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all hover:-translate-y-1">
                  <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-2">
                      <Database className="h-5 w-5" />
                      Data Sources
                    </CardTitle>
                    <CardDescription className="text-blue-100">
                      Supported input methods and formats
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <p className="text-sm text-gray-600 mb-4">
                      We support multiple ways to input your emissions data for
                      maximum flexibility and accuracy.
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <ChevronRight className="h-4 w-4 text-blue-600" />
                        Manual data entry
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <ChevronRight className="h-4 w-4 text-blue-600" />
                        CSV file uploads
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <ChevronRight className="h-4 w-4 text-blue-600" />
                        API integrations
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <ChevronRight className="h-4 w-4 text-blue-600" />
                        Cloud service connections
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all hover:-translate-y-1">
                  <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5" />
                      Quick Start Guide
                    </CardTitle>
                    <CardDescription className="text-purple-100">
                      Get up and running in minutes
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                          1
                        </div>
                        <p className="text-sm text-gray-600">
                          Set up your company profile in Settings
                        </p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                          2
                        </div>
                        <p className="text-sm text-gray-600">
                          Input your emissions data using the Input section
                        </p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                          3
                        </div>
                        <p className="text-sm text-gray-600">
                          View your results on the Dashboard
                        </p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                          4
                        </div>
                        <p className="text-sm text-gray-600">
                          Generate and share reports
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeCategory === "navigation" && (
              <motion.div
                key="navigation"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
              >
                {[
                  {
                    icon: TrendingUp,
                    title: "Dashboard",
                    description:
                      "Overview of your emissions with interactive charts and key metrics",
                    color: "from-green-500 to-emerald-500",
                  },
                  {
                    icon: Database,
                    title: "Input",
                    description:
                      "Enter and manage your emissions data from various sources",
                    color: "from-blue-500 to-cyan-500",
                  },
                  {
                    icon: FileText,
                    title: "Reports",
                    description:
                      "Generate comprehensive reports and export data",
                    color: "from-purple-500 to-pink-500",
                  },
                  {
                    icon: Settings,
                    title: "Settings",
                    description:
                      "Configure your account, preferences, and company information",
                    color: "from-orange-500 to-red-500",
                  },
                  {
                    icon: Users,
                    title: "Team Collaboration",
                    description:
                      "Share insights and collaborate with your team members",
                    color: "from-indigo-500 to-purple-500",
                  },
                  {
                    icon: HelpCircle,
                    title: "Help & Support",
                    description:
                      "Access documentation, FAQs, and get help when needed",
                    color: "from-teal-500 to-green-500",
                  },
                ].map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all hover:-translate-y-1 h-full">
                        <CardHeader
                          className={`bg-gradient-to-r ${item.color} text-white rounded-t-lg`}
                        >
                          <CardTitle className="flex items-center gap-2">
                            <Icon className="h-5 w-5" />
                            {item.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                          <p className="text-sm text-gray-600">
                            {item.description}
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}

            {activeCategory === "calculations" && (
              <motion.div
                key="calculations"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="grid gap-6 md:grid-cols-2"
              >
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader className="bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-t-lg">
                    <CardTitle>How Calculations Work</CardTitle>
                    <CardDescription className="text-emerald-100">
                      Understanding our emission calculation methodology
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
                      <h4 className="font-medium text-emerald-800 mb-2">
                        Standard Methodology
                      </h4>
                      <p className="text-sm text-emerald-700">
                        Our calculations follow internationally recognized
                        standards including GHG Protocol and ISO 14064 for
                        accurate and consistent results.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                        <div>
                          <h5 className="font-medium text-gray-900">
                            Emission Factors
                          </h5>
                          <p className="text-sm text-gray-600">
                            We use region-specific emission factors updated
                            regularly
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                        <div>
                          <h5 className="font-medium text-gray-900">
                            Data Quality
                          </h5>
                          <p className="text-sm text-gray-600">
                            All inputs are validated and checked for consistency
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                        <div>
                          <h5 className="font-medium text-gray-900">
                            Uncertainty Analysis
                          </h5>
                          <p className="text-sm text-gray-600">
                            We provide uncertainty ranges for all calculations
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-t-lg">
                    <CardTitle>Categories Covered</CardTitle>
                    <CardDescription className="text-blue-100">
                      Emission sources we track and calculate
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      {[
                        {
                          name: "Electricity Consumption",
                          icon: "⚡",
                          factor: "0.4-0.8 kg CO2e/kWh",
                        },
                        {
                          name: "Stationary Fuel",
                          icon: "🏭",
                          factor: "2.3-3.1 kg CO2e/liter",
                        },
                        {
                          name: "Mobile Fuel",
                          icon: "🚗",
                          factor: "2.3-2.7 kg CO2e/liter",
                        },
                        {
                          name: "Fugitive Emissions",
                          icon: "💨",
                          factor: "Variable by gas type",
                        },
                        {
                          name: "Process Emissions",
                          icon: "🏗️",
                          factor: "Industry-specific",
                        },
                        {
                          name: "Waste Water",
                          icon: "🌊",
                          factor: "0.5-1.2 kg CO2e/m³",
                        },
                        {
                          name: "Renewable Energy",
                          icon: "☀️",
                          factor: "0 kg CO2e (net)",
                        },
                      ].map((category) => (
                        <div
                          key={category.name}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-lg">{category.icon}</span>
                            <span className="text-sm font-medium text-gray-900">
                              {category.name}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {category.factor}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeCategory === "faq" && (
              <motion.div
                key="faq"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="max-w-4xl mx-auto"
              >
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-2">
                      <HelpCircle className="h-5 w-5" />
                      Frequently Asked Questions
                    </CardTitle>
                    <CardDescription className="text-purple-100">
                      Find quick answers to common questions
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {filteredFaqs.map((faq, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2, delay: index * 0.05 }}
                        >
                          <Card className="border border-gray-200 hover:border-purple-300 transition-colors">
                            <CardContent className="p-0">
                              <button
                                onClick={() =>
                                  setExpandedFaq(
                                    expandedFaq === index ? null : index
                                  )
                                }
                                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                              >
                                <span className="font-medium text-gray-900">
                                  {faq.question}
                                </span>
                                <motion.div
                                  animate={{
                                    rotate: expandedFaq === index ? 180 : 0,
                                  }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <ChevronDown className="h-4 w-4 text-gray-500" />
                                </motion.div>
                              </button>
                              <AnimatePresence>
                                {expandedFaq === index && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="overflow-hidden"
                                  >
                                    <div className="px-6 pb-4 border-t border-gray-100">
                                      <p className="text-sm text-gray-600 pt-4">
                                        {faq.answer}
                                      </p>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>

                    {filteredFaqs.length === 0 && searchQuery && (
                      <div className="text-center py-8">
                        <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">
                          No FAQs found matching "{searchQuery}"
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                          Try different keywords or browse all questions
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeCategory === "contact" && (
              <motion.div
                key="contact"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
              >
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all hover:-translate-y-1">
                  <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-2">
                      <Mail className="h-5 w-5" />
                      Email Support
                    </CardTitle>
                    <CardDescription className="text-blue-100">
                      Get help via email
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <p className="text-sm text-gray-600">
                      Send us an email and we'll respond within 24 hours during
                      business days.
                    </p>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-900">
                        support@ecometrics.com
                      </p>
                      <p className="text-xs text-gray-500">
                        Response time: Within 24 hours
                      </p>
                    </div>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      <Mail className="h-4 w-4 mr-2" />
                      Send Email
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all hover:-translate-y-1">
                  <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-2">
                      <MessageCircle className="h-5 w-5" />
                      Live Chat
                    </CardTitle>
                    <CardDescription className="text-green-100">
                      Chat with our support team
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <p className="text-sm text-gray-600">
                      Get instant help through our live chat feature, available
                      Monday to Friday.
                    </p>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-900">
                        Mon-Fri: 9AM - 6PM EST
                      </p>
                      <p className="text-xs text-gray-500">
                        Average response: Under 2 minutes
                      </p>
                    </div>
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Start Chat
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all hover:-translate-y-1">
                  <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-2">
                      <Phone className="h-5 w-5" />
                      Phone Support
                    </CardTitle>
                    <CardDescription className="text-purple-100">
                      Call us directly
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <p className="text-sm text-gray-600">
                      For urgent matters or complex issues, give us a call
                      during business hours.
                    </p>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-900">
                        +1 (555) 123-4567
                      </p>
                      <p className="text-xs text-gray-500">
                        Mon-Fri: 9AM - 5PM EST
                      </p>
                    </div>
                    <Button className="w-full bg-purple-600 hover:bg-purple-700">
                      <Phone className="h-4 w-4 mr-2" />
                      Call Now
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm lg:col-span-3">
                  <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-2">
                      <ExternalLink className="h-5 w-5" />
                      Additional Resources
                    </CardTitle>
                    <CardDescription className="text-orange-100">
                      Explore more ways to get help and learn
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Book className="h-6 w-6 text-orange-600" />
                        </div>
                        <h4 className="font-medium text-gray-900 mb-2">
                          Documentation
                        </h4>
                        <p className="text-sm text-gray-600 mb-3">
                          Comprehensive guides and API documentation
                        </p>
                        <Button variant="outline" size="sm">
                          View Docs
                        </Button>
                      </div>

                      <div className="text-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Users className="h-6 w-6 text-blue-600" />
                        </div>
                        <h4 className="font-medium text-gray-900 mb-2">
                          Community
                        </h4>
                        <p className="text-sm text-gray-600 mb-3">
                          Join our user community and forums
                        </p>
                        <Button variant="outline" size="sm">
                          Join Community
                        </Button>
                      </div>

                      <div className="text-center">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Clock className="h-6 w-6 text-green-600" />
                        </div>
                        <h4 className="font-medium text-gray-900 mb-2">
                          Webinars
                        </h4>
                        <p className="text-sm text-gray-600 mb-3">
                          Live training sessions and tutorials
                        </p>
                        <Button variant="outline" size="sm">
                          View Schedule
                        </Button>
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
