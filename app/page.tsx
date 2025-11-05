"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SignupModal } from "@/components/signup-modal";
import Link from "next/link";
import {
  Leaf,
  Globe,
  Database,
  TrendingUp,
  Users,
  Settings,
  Cloud,
  Zap,
  ChevronDown,
  LogOut,
  User,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const [signupModalOpen, setSignupModalOpen] = useState(false);
  const [isCalculateDropdownOpen, setIsCalculateDropdownOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();

  const handleLogin = () => {
    router.push("/login");
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

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
      icon: <TrendingUp className="h-8 w-8 text-green-600" />,
      title: "Real-Time Carbon Tracking",
      description:
        "Monitor your emissions in real-time with our advanced tracking system.",
    },
    {
      icon: <Database className="h-8 w-8 text-green-600" />,
      title: "Automated Reports",
      description:
        "Generate comprehensive reports automatically and schedule them for stakeholders.",
    },
    {
      icon: <Globe className="h-8 w-8 text-green-600" />,
      title: "Custom Dashboards",
      description:
        "Create personalized dashboards to visualize your sustainability metrics.",
    },
    {
      icon: <Leaf className="h-8 w-8 text-green-600" />,
      title: "Emission Source Breakdown",
      description:
        "Detailed analysis of all emission sources with actionable insights.",
    },
    {
      icon: <Cloud className="h-8 w-8 text-green-600" />,
      title: "Cloud Integration",
      description:
        "Seamlessly integrate with your existing systems and data sources.",
    },
    {
      icon: <Users className="h-8 w-8 text-green-600" />,
      title: "Team Collaboration",
      description:
        "Collaborate with your team and share insights across departments.",
    },
  ];

  const steps = [
    {
      icon: <Settings className="h-12 w-12 text-green-600" />,
      title: "Connect Your Data",
      description:
        "Link your ERP, energy logs, travel data, and other operational systems.",
    },
    {
      icon: <Zap className="h-12 w-12 text-green-600" />,
      title: "Analyze Automatically",
      description:
        "Our AI analyzes your data and calculates carbon emissions automatically.",
    },
    {
      icon: <Globe className="h-12 w-12 text-green-600" />,
      title: "Generate Insights",
      description:
        "Get visual reports and actionable insights to reduce your carbon footprint.",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      company: "EcoTech Solutions",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      message:
        "EcoMetrics transformed how we track and report our carbon emissions. The insights have helped us reduce our footprint by 30%.",
    },
    {
      name: "Michael Rodriguez",
      company: "Green Innovations Inc.",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      message:
        "The automated reporting feature saves us hours every week. Our stakeholders love the detailed visualizations.",
    },
    {
      name: "Emily Johnson",
      company: "Sustainable Systems",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      message:
        "Easy to use, comprehensive, and powerful. EcoMetrics is essential for any company serious about sustainability.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-sky-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-green-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Leaf className="h-8 w-8 text-green-600 mr-2" />
              <span className="text-2xl font-bold text-gray-900">
                EcoMetrics
              </span>
            </div>
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">
                  <motion.div
                    className="flex items-center space-x-4"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="flex items-center text-gray-700">
                      <User className="h-5 w-5 mr-2 text-green-600" />
                      <span className="font-medium">{user?.name}</span>
                    </div>
                    <Button
                      onClick={handleLogout}
                      variant="outline"
                      size="sm"
                      className="text-gray-700 border-green-200 hover:bg-green-50"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </motion.div>
                </span>
              </div>
            ) : (
              <></>
            )}
            <div className="hidden md:flex space-x-8">
              <a
                href="#about"
                className="text-gray-700 hover:text-green-600 transition-colors m-auto"
              >
                About
              </a>
              <a
                href="#features"
                className="text-gray-700 hover:text-green-600 transition-colors m-auto"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-gray-700 hover:text-green-600 transition-colors m-auto"
              >
                How It Works
              </a>
              <a
                href="#testimonials"
                className="text-gray-700 hover:text-green-600 transition-colors m-auto"
              >
                Testimonials
              </a>
              <div className="relative">
                {isAuthenticated ? (
                  <></>
                ) : (
                  <motion.button
                    onClick={handleLogin}
                    className="text-gray-700 hover:text-green-600 transition-colors flex items-center px-3 py-2 rounded-lg hover:bg-green-50"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Login
                  </motion.button>
                )}
                {isAuthenticated && (
                  <div className="relative">
                    <motion.button
                      onClick={() =>
                        setIsCalculateDropdownOpen(!isCalculateDropdownOpen)
                      }
                      className="text-gray-700 hover:text-green-600 transition-colors flex items-center px-3 py-2 rounded-lg hover:bg-green-50"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Calculate
                      <motion.div
                        animate={{ rotate: isCalculateDropdownOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className="ml-1 h-4 w-4" />
                      </motion.div>
                    </motion.button>
                    <AnimatePresence>
                      {isCalculateDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full mt-2 bg-white/95 backdrop-blur-md border border-green-200 rounded-xl shadow-xl z-50 min-w-[200px] overflow-hidden"
                        >
                          <motion.a
                            href="/real-time-carbon-tracking"
                            className="block px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
                            onClick={() => setIsCalculateDropdownOpen(false)}
                            whileHover={{ x: 4 }}
                            transition={{ duration: 0.1 }}
                          >
                            Real-Time Carbon Tracking
                          </motion.a>
                          <motion.a
                            href="/automated-reports"
                            className="block px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
                            onClick={() => setIsCalculateDropdownOpen(false)}
                            whileHover={{ x: 4 }}
                            transition={{ duration: 0.1 }}
                          >
                            Automated Reports
                          </motion.a>
                          <motion.a
                            href="/custom-dashboards"
                            className="block px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
                            onClick={() => setIsCalculateDropdownOpen(false)}
                            whileHover={{ x: 4 }}
                            transition={{ duration: 0.1 }}
                          >
                            Custom Dashboards
                          </motion.a>
                          <motion.a
                            href="/emission-source-breakdown"
                            className="block px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
                            onClick={() => setIsCalculateDropdownOpen(false)}
                            whileHover={{ x: 4 }}
                            transition={{ duration: 0.1 }}
                          >
                            Emission Source Breakdown
                          </motion.a>
                          <motion.a
                            href="/cloud-integration"
                            className="block px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
                            onClick={() => setIsCalculateDropdownOpen(false)}
                            whileHover={{ x: 4 }}
                            transition={{ duration: 0.1 }}
                          >
                            Cloud Integration
                          </motion.a>
                          <motion.a
                            href="/team-collaboration"
                            className="block px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
                            onClick={() => setIsCalculateDropdownOpen(false)}
                            whileHover={{ x: 4 }}
                            transition={{ duration: 0.1 }}
                          >
                            Team Collaboration
                          </motion.a>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>
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
                Measure. Reduce.{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                  Sustain.
                </span>
              </motion.h1>

              <motion.p
                variants={fadeIn}
                className="text-xl text-gray-600 mb-8 max-w-lg mx-auto lg:mx-0"
              >
                EcoMetrics empowers businesses to track and reduce their carbon
                footprint with intelligent analytics.
              </motion.p>

              <motion.div
                variants={fadeIn}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <Button
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg"
                  onClick={() => setSignupModalOpen(true)}
                >
                  Get Started
                </Button>

                <Link href="#about">
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
              <div className="relative w-full h-96 bg-gradient-to-br from-green-100 to-emerald-100 rounded-3xl overflow-hidden shadow-2xl">
                <motion.div
                  animate={{
                    rotate: [0, 360],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <Globe className="h-64 w-64 text-green-300" />
                </motion.div>

                {/* Floating elements */}
                <motion.div
                  animate={{ y: [0, -20, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 0 }}
                  className="absolute top-8 left-8 bg-white rounded-xl p-4 shadow-lg"
                >
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </motion.div>

                <motion.div
                  animate={{ y: [0, -15, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                  className="absolute top-16 right-8 bg-white rounded-xl p-4 shadow-lg"
                >
                  <Leaf className="h-6 w-6 text-emerald-600" />
                </motion.div>

                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 2 }}
                  className="absolute bottom-8 left-16 bg-white rounded-xl p-4 shadow-lg"
                >
                  <Database className="h-6 w-6 text-green-600" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                About EcoMetrics
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Our mission is to simplify carbon tracking for businesses
                through data-driven insights and automation. Whether it's energy
                consumption, logistics, or production — EcoMetrics makes
                sustainability measurable.
              </p>
              <p className="text-lg text-gray-600">
                We believe that every business has the power to make a positive
                environmental impact. Our platform provides the tools and
                insights needed to turn sustainability goals into measurable
                results.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="w-full h-96 bg-gradient-to-br from-green-100 to-emerald-100 rounded-3xl overflow-hidden shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop"
                  alt="Sustainability"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Every Business
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to track, analyze, and reduce your carbon
              footprint
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Get started in three simple steps
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="relative mb-8">
                  <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                    {step.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-lg">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Trusted by Sustainable Leaders
            </h2>
            <p className="text-xl text-gray-600">
              See what our customers say about EcoMetrics
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover mr-4"
                      />
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {testimonial.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {testimonial.company}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-700 italic">
                      "{testimonial.message}"
                    </p>
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
              Ready to measure your impact?
            </h2>
            <p className="text-xl text-green-100 mb-8">
              Join thousands of companies already reducing their carbon
              footprint with EcoMetrics
            </p>
            <Button
              size="lg"
              className="bg-white text-green-600 hover:bg-gray-100 px-8 py-4 text-lg"
              onClick={() => setSignupModalOpen(true)}
            >
              Sign up free
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Leaf className="h-8 w-8 text-green-400 mr-2" />
                <span className="text-2xl font-bold">EcoMetrics</span>
              </div>
              <p className="text-gray-400 mb-4">
                Empowering businesses to measure, reduce, and sustain their
                environmental impact.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <h4 className="font-semibold mb-3">Product</h4>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    <a
                      href="#"
                      className="hover:text-green-400 transition-colors"
                    >
                      Features
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-green-400 transition-colors"
                    >
                      Pricing
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-green-400 transition-colors"
                    >
                      API
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Company</h4>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    <a
                      href="#"
                      className="hover:text-green-400 transition-colors"
                    >
                      About
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-green-400 transition-colors"
                    >
                      Blog
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-green-400 transition-colors"
                    >
                      Careers
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Support</h4>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    <a
                      href="#"
                      className="hover:text-green-400 transition-colors"
                    >
                      Help Center
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-green-400 transition-colors"
                    >
                      Contact
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-green-400 transition-colors"
                    >
                      Status
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Legal</h4>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    <a
                      href="#"
                      className="hover:text-green-400 transition-colors"
                    >
                      Privacy
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-green-400 transition-colors"
                    >
                      Terms
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-green-400 transition-colors"
                    >
                      Security
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 EcoMetrics. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <SignupModal open={signupModalOpen} onOpenChange={setSignupModalOpen} />
    </div>
  );
}
