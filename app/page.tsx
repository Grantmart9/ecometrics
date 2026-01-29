"use client";

import { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
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
  Activity,
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

  // Mock articles data for ABSA South Africa
  const mockArticles = [
    {
      Header_1: "ABSA Launches Green Banking Initiative",
      Title_1:
        "ABSA introduces comprehensive green banking solutions to support South Africa's transition to a sustainable economy.",
      Image_1:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop",
      Header_2: "New Digital Banking Platform Goes Live",
      Title_2:
        "ABSA's latest digital banking platform offers enhanced security and seamless user experience for millions of customers.",
      Image_2:
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=400&fit=crop",
      Header_3: "ABSA Reports Strong Q4 Financial Results",
      Title_3:
        "Record profits driven by digital transformation and strategic investments in key sectors of the South African economy.",
      Image_3:
        "https://images.unsplash.com/photo-1569163139394-de44cb8938ba?w=800&h=400&fit=crop",
      Header_4: "Empowering SMEs Across South Africa",
      Title_4:
        "ABSA's SME support programs help small businesses thrive with tailored financial solutions and expert guidance.",
      Image_4:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
      Header_5: "ABSA Stock Performance and Market Outlook",
      Title_5:
        "Analysis of ABSA's stock performance and expert insights on market trends affecting South African banking sector.",
      Image_5:
        "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=400&fit=crop",
      Header_6: "Community Development Projects Update",
      Title_6:
        "ABSA's latest community initiatives focus on education, entrepreneurship, and sustainable development in underserved areas.",
      Image_6:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop",
      Header_7: "ABSA Wins Banking Innovation Award",
      Title_7:
        "Recognized for groundbreaking fintech solutions that are transforming the South African banking landscape.",
      Image_7:
        "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop",
      Header_8: "New Branch Openings Across Provinces",
      Title_8:
        "ABSA expands its footprint with modern banking facilities in key economic hubs across South Africa.",
      Image_8:
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=400&fit=crop",
      Header_9: "Youth Employment Initiative Success",
      Title_9:
        "ABSA's graduate program achieves record placement rates, contributing to South Africa's skills development.",
      Image_9:
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=400&fit=crop",
      Header_10: "ABSA's ESG Report Highlights Achievements",
      Title_10:
        "Comprehensive Environmental, Social, and Governance report showcases ABSA's commitment to sustainable banking.",
      Image_10:
        "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=400&fit=crop",
    },
  ];

  const articles: any[] = mockArticles;

  const parsedArticles =
    articles.length > 0
      ? Object.keys(articles[0])
          .filter((key) => key.startsWith("Header_"))
          .map((key) => {
            const index = key.split("_")[1];
            return {
              header: articles[0][`Header_${index}`],
              title: articles[0][`Title_${index}`],
              image: articles[0][`Image_${index}`],
              // Add more fields if available, e.g., content: articles[0][`Content_${index}`]
            };
          })
      : [];

  // Carbon footprint animation component using Three.js
  const CarbonAnimation = dynamic(
    () => import("@/components/CarbonAnimation"),
    {
      ssr: false,
      loading: () => (
        <div className="relative w-80 h-80 flex items-center justify-center">
          <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full animate-pulse"></div>
        </div>
      ),
    },
  );

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
      title: "Carbon Emissions Tracking",
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
      {/* Hero Section or News Header */}
      {!isAuthenticated ? (
        <>
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
                    EcoMetrics empowers businesses to track and reduce their
                    carbon footprint with intelligent analytics.
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
                    <div className="absolute inset-0 flex items-center justify-center">
                      <CarbonAnimation />
                    </div>

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

          {/* Features Section */}
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
                  Powerful Features for Sustainability
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Everything you need to track, analyze, and reduce your carbon
                  emissions effectively
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {features.map((feature, index) => (
                  <Card
                    key={index}
                    className="border-0 shadow-lg hover:shadow-xl transition-shadow"
                  >
                    <CardContent className="p-8">
                      <div className="mb-4">{feature.icon}</div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </motion.div>
            </div>
          </section>

          {/* How It Works Section */}
          <section className="py-20 bg-gradient-to-br from-green-50 to-emerald-50">
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
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Get started with carbon tracking in just three simple steps
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="grid md:grid-cols-3 gap-8"
              >
                {steps.map((step, index) => (
                  <div key={index} className="text-center">
                    <div className="mb-6 flex justify-center">{step.icon}</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 text-lg">{step.description}</p>
                  </div>
                ))}
              </motion.div>
            </div>
          </section>

          {/* Testimonials Section */}
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
                  Trusted by Industry Leaders
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Join thousands of companies already reducing their carbon
                  footprint
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="grid md:grid-cols-3 gap-8"
              >
                {testimonials.map((testimonial, index) => (
                  <Card key={index} className="border-0 shadow-lg">
                    <CardContent className="p-8">
                      <div className="flex items-center mb-4">
                        <img
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          className="w-12 h-12 rounded-full mr-4"
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
                      <p className="text-gray-600 italic">
                        "{testimonial.message}"
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </motion.div>
            </div>
          </section>
        </>
      ) : (
        <></>
      )}

      {/* Articles Section - Only for authenticated users */}
      {isAuthenticated && parsedArticles.length > 0 && (
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
                Latest News
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Stay updated with the latest developments and insights from
                EcoMetrics
              </p>
            </motion.div>

            {!isAuthenticated ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {parsedArticles.slice(0, 6).map((article, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Link href={`/article/${index + 1}`} className="block">
                      <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                        <div className="relative h-48 bg-gradient-to-br from-green-100 to-emerald-100 rounded-t-lg overflow-hidden">
                          <img
                            src={article.image}
                            alt={article.header}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <CardContent className="p-6">
                          <h3 className="text-xl font-bold text-gray-900 mb-3">
                            {article.header}
                          </h3>
                          <p className="text-gray-600 text-base">
                            {article.title}
                          </p>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div>
                {/* Featured Article */}
                {parsedArticles.slice(0, 1).map((article, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="mb-12"
                  >
                    <Link href={`/article/${index + 1}`} className="block">
                      <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                        <div className="relative h-64 md:h-80 bg-gradient-to-br from-green-100 to-emerald-100 rounded-t-lg overflow-hidden">
                          <img
                            src={article.image}
                            alt={article.header}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <CardContent className="p-8">
                          <h3 className="text-3xl font-bold text-gray-900 mb-4">
                            {article.header}
                          </h3>
                          <p className="text-gray-600 text-lg">
                            {article.title}
                          </p>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
                {/* Other Articles */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {parsedArticles.slice(1, 6).map((article, index) => (
                    <motion.div
                      key={index + 1}
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: (index + 1) * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <Link href={`/article/${index + 2}`} className="block">
                        <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                          <div className="relative h-48 bg-gradient-to-br from-green-100 to-emerald-100 rounded-t-lg overflow-hidden">
                            <img
                              src={article.image}
                              alt={article.header}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <CardContent className="p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-3">
                              {article.header}
                            </h3>
                            <p className="text-gray-600 text-base">
                              {article.title}
                            </p>
                          </CardContent>
                        </Card>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* CTA Section */}
      {!isAuthenticated && (
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
      )}

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
