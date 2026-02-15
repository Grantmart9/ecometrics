"use client";

import { useState, useEffect, Suspense, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SignupModal } from "@/components/signup-modal";
import { Skeleton } from "@/components/ui/skeleton";
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
import { crudService } from "@/lib/crudService";

export default function LandingPage() {
  const [signupModalOpen, setSignupModalOpen] = useState(false);
  const [isCalculateDropdownOpen, setIsCalculateDropdownOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();

  // Articles state
  const [articles, setArticles] = useState<any[]>([]);
  const [articleImages, setArticleImages] = useState<any[]>([]);
  const [loadingArticles, setLoadingArticles] = useState(false);

  // Track which articles have images loaded
  const [imagesLoaded, setImagesLoaded] = useState<Set<number>>(new Set());

  // Fetch articles from CRUD
  useEffect(() => {
    const fetchArticles = async () => {
      setLoadingArticles(true);
      try {
        const response = (await crudService.callCrud({
          data: JSON.stringify([
            {
              RecordSet: "Articles",
              TableName: "get_quizadmin",
              Action: "procedure",
              Fields: {
                Ent: "4",
                QType: "Article",
              },
            },
          ]),
        })) as any;

        if (response && response.Data && response.Data.length > 0) {
          const jsonData = response.Data[0].JsonData;
          const parsedData = JSON.parse(jsonData);

          if (
            parsedData.Articles &&
            parsedData.Articles.TableData &&
            Array.isArray(parsedData.Articles.TableData)
          ) {
            setArticles(parsedData.Articles.TableData);

            // Store articles in sessionStorage for article page to use
            sessionStorage.setItem(
              "articles_data",
              JSON.stringify(parsedData.Articles.TableData),
            );

            // Fetch images for articles if we have article IDs
            const articleIds: number[] = Array.from(
              new Set(
                parsedData.Articles.TableData.filter(
                  (item: any) => item.quizid,
                ).map((item: any) => item.quizid),
              ) as unknown as number[],
            );

            if (articleIds.length > 0) {
              fetchArticleImages(articleIds);
            }
          }
        }
      } catch (error: any) {
        console.error("Error fetching articles:", error);
        // 401 errors are handled globally by crudService - no additional handling needed
      } finally {
        setLoadingArticles(false);
      }
    };

    const fetchArticleImages = async (ids: number[]) => {
      try {
        const response = (await crudService.callCrud({
          data: JSON.stringify([
            {
              RecordSet: "ArticleImages",
              TableName: "attachment",
              Action: "readIn",
              Fields: {
                RelativeID: `(${ids.join(",")})`,
              },
            },
          ]),
        })) as any;
        console.log("Article images API response:", response);

        if (response && response.Data && response.Data.length > 0) {
          const jsonData = response.Data[0].JsonData;
          const parsedData = JSON.parse(jsonData);

          // Handle both 'TS' and 'ArticleImages' key formats from API
          const tableData =
            parsedData.TS?.TableData ||
            parsedData.ArticleImages?.TableData ||
            [];

          if (tableData && Array.isArray(tableData) && tableData.length > 0) {
            // Convert base64 attachmentcontent to image URLs
            const processedImages = tableData.map((item: any) => {
              const imageType =
                item.attachmentType ||
                item.attachmenttype ||
                item.attachmentContentType ||
                item.attachmentmimetype ||
                "image/png";
              const dataUrl = item.attachmentcontent
                ? `data:${imageType};base64,${item.attachmentcontent}`
                : null;

              return {
                ...item,
                imageUrl: dataUrl,
              };
            });

            setArticleImages(processedImages);

            // Track which articles have images loaded
            const loadedIds = new Set(
              processedImages
                .map(
                  (img) =>
                    img.attachmentRelativeID ??
                    img.attachmentRelativeId ??
                    img.attachmentrelativeid ??
                    img.RelativeID ??
                    img.relativeid ??
                    0,
                )
                .filter(Boolean),
            );
            setImagesLoaded(loadedIds);

            // Store images in sessionStorage for article page to use
            sessionStorage.setItem(
              "article_images",
              JSON.stringify(processedImages),
            );
          }
        }
      } catch (error: any) {
        console.error("Error fetching article images:", error);

        // Check for 401 authentication error
        if (
          error.message?.includes("401") ||
          error.message?.includes("Authentication required")
        ) {
          console.log(
            "Authentication error - logging out and redirecting to login",
          );
          logout();
          router.push("/login");
        }
      }
    };

    fetchArticles();
  }, []);

  // Parse articles from API or fallback to mock data - recalculate when articles or images change
  const parsedArticles = useMemo(() => {
    if (articles.length === 0) {
      return [];
    }

    const result = articles.map((item: any) => {
      // Find matching image for this article using relativeid
      const imageItem = articleImages.find((img: any) => {
        const imgRelativeId =
          img.attachmentRelativeID ??
          img.attachmentRelativeId ??
          img.attachmentrelativeid ??
          img.RelativeID ??
          img.relativeid ??
          null;
        return String(imgRelativeId) === String(item.quizid);
      });

      // Use the converted imageUrl, or construct from attachmentcontent if needed
      let displayImage =
        imageItem?.imageUrl ||
        (imageItem?.attachmentcontent
          ? `data:image/png;base64,${imageItem.attachmentcontent}`
          : null) ||
        item.Image ||
        item.image ||
        item.Attachment ||
        item.attachment ||
        "";

      // Validate and fix data URL format
      if (displayImage && !displayImage.startsWith("data:")) {
        if (displayImage.length > 0 && !displayImage.includes("://")) {
          displayImage = `data:image/png;base64,${displayImage}`;
        }
      }

      return {
        id: item.quizid,
        header: item.quizname || "Article",
        title: item.quizdescription || "",
        image: displayImage,
        date: item.quizadmininstancedate || "",
        author: item.quizadminentityName || "",
      };
    });

    // Deduplicate articles by quizid - keep first occurrence
    return result.filter(
      (article, index, self) =>
        index === self.findIndex((a) => a.id === article.id),
    );
  }, [articles, articleImages]);

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

  // Image with skeleton loading component
  function ArticleImage({
    src,
    alt,
    className,
    skeletonHeight = "h-64",
    isLoading,
  }: {
    src: string | null | undefined;
    alt: string;
    className?: string;
    skeletonHeight?: string;
    isLoading: boolean;
  }) {
    const [hasError, setHasError] = useState(false);

    // Show skeleton while loading or if no image
    if (isLoading || !src || hasError) {
      return (
        <div
          className={`w-full ${skeletonHeight} bg-gradient-to-br from-green-100 to-emerald-100 rounded-t-lg`}
        >
          <Skeleton className="w-full h-full rounded-t-lg" />
        </div>
      );
    }

    return (
      <img
        src={src}
        alt={alt}
        className={`${className} w-full h-full object-cover rounded-t-lg`}
        onError={() => setHasError(true)}
      />
    );
  }

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
          <section id="features" className="py-20 bg-white">
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
          <section
            id="how-it-works"
            className="py-20 bg-gradient-to-br from-green-50 to-emerald-50"
          >
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
          <section id="testimonials" className="py-20 bg-white">
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
        <>
          {/* BBC-Style News Header */}
          <header className="bg-black text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="text-sm text-gray-300">
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </div>
              </div>
            </div>
          </header>

          {/* News Navigation Bar */}
        </>
      )}

      {/* BBC-Style News Content for authenticated users */}
      {isAuthenticated && (
        <main className="bg-gray-100 min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {loadingArticles ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
              </div>
            ) : parsedArticles.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main News Column */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Top Story - Featured Article */}
                  {parsedArticles.slice(0, 1).map((article, index) => (
                    <motion.article
                      key={article.id || `featured-${index}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                    >
                      <Link
                        href={`/article?id=${article.id || index + 1}`}
                        className="block"
                      >
                        <div className="relative aspect-video bg-gray-200">
                          <ArticleImage
                            src={article.image}
                            alt={article.header}
                            className="w-full h-full object-cover"
                            skeletonHeight="aspect-video"
                            isLoading={!imagesLoaded.has(Number(article.id))}
                          />
                          <div className="absolute top-4 left-4">
                            <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                              TOP STORY
                            </span>
                          </div>
                        </div>
                        <div className="p-6">
                          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 hover:text-red-600 transition-colors">
                            {article.header}
                          </h2>
                          <p className="text-gray-600 text-lg leading-relaxed">
                            {article.title}
                          </p>
                          <div className="mt-4 flex items-center text-sm text-gray-500">
                            <span className="font-medium text-red-600">
                              {article.author || "EcoMetrics"}
                            </span>
                            <span className="mx-2">•</span>
                            <span>{article.date || "Recent"}</span>
                          </div>
                        </div>
                      </Link>
                    </motion.article>
                  ))}

                  {/* News Grid - 2 columns */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {parsedArticles.slice(1, 5).map((article, index) => (
                      <motion.article
                        key={article.id || `article-${index}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: (index + 1) * 0.1 }}
                        className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                      >
                        <Link
                          href={`/article?id=${article.id || index + 2}`}
                          className="block"
                        >
                          <div className="relative h-48 bg-gray-200">
                            <ArticleImage
                              src={article.image}
                              alt={article.header}
                              className="w-full h-full object-cover"
                              skeletonHeight="h-48"
                              isLoading={!imagesLoaded.has(Number(article.id))}
                            />
                          </div>
                          <div className="p-4">
                            <h3 className="text-lg font-bold text-gray-900 mb-2 hover:text-red-600 transition-colors line-clamp-2">
                              {article.header}
                            </h3>
                            <p className="text-gray-600 text-sm line-clamp-2">
                              {article.title}
                            </p>
                            <div className="mt-3 text-xs text-gray-500">
                              <span className="font-medium text-red-600">
                                {article.author || "EcoMetrics"}
                              </span>
                              <span className="mx-1">•</span>
                              <span>{article.date || "Recent"}</span>
                            </div>
                          </div>
                        </Link>
                      </motion.article>
                    ))}
                  </div>

                  {/* More News List */}
                  {parsedArticles.length > 5 && (
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                      <div className="border-b border-gray-200 px-6 py-4">
                        <h3 className="text-lg font-bold text-gray-900">
                          More News
                        </h3>
                      </div>
                      <div className="divide-y divide-gray-200">
                        {parsedArticles.slice(5).map((article, index) => (
                          <motion.div
                            key={article.id || `more-${index}`}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                          >
                            <Link
                              href={`/article?id=${article.id || index + 6}`}
                              className="block px-6 py-4 hover:bg-gray-50 transition-colors"
                            >
                              <div className="flex items-start space-x-4">
                                <div className="flex-1">
                                  <h4 className="font-semibold text-gray-900 hover:text-red-600 transition-colors">
                                    {article.header}
                                  </h4>
                                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                    {article.title}
                                  </p>
                                  <div className="mt-2 text-xs text-gray-500">
                                    <span className="font-medium text-red-600">
                                      {article.author || "EcoMetrics"}
                                    </span>
                                    <span className="mx-1">•</span>
                                    <span>{article.date || "Recent"}</span>
                                  </div>
                                </div>
                                {article.image && (
                                  <div className="w-24 h-16 flex-shrink-0 rounded overflow-hidden bg-gray-200">
                                    <img
                                      src={article.image}
                                      alt=""
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                )}
                              </div>
                            </Link>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Sidebar */}
                <aside className="space-y-6">
                  {/* Trending Section */}
                  <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="bg-red-600 px-4 py-3">
                      <h3 className="text-white font-bold flex items-center">
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Trending
                      </h3>
                    </div>
                    <div className="divide-y divide-gray-200">
                      {parsedArticles.slice(0, 5).map((article, index) => (
                        <Link
                          key={`trending-${article.id || index}`}
                          href={`/article?id=${article.id || index + 1}`}
                          className="block px-4 py-3 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-start space-x-3">
                            <span className="text-2xl font-bold text-red-600">
                              {index + 1}
                            </span>
                            <p className="text-sm font-medium text-gray-900 hover:text-red-600 transition-colors line-clamp-2">
                              {article.header}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Quick Links */}
                  <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="border-b border-gray-200 px-4 py-3">
                      <h3 className="font-bold text-gray-900">Quick Links</h3>
                    </div>
                    <div className="p-4 space-y-2">
                      <Link
                        href="/dashboard"
                        className="flex items-center p-2 rounded hover:bg-gray-100 transition-colors"
                      >
                        <TrendingUp className="h-5 w-5 text-green-600 mr-3" />
                        <span className="text-gray-700">Dashboard</span>
                      </Link>
                      <Link
                        href="/input"
                        className="flex items-center p-2 rounded hover:bg-gray-100 transition-colors"
                      >
                        <Database className="h-5 w-5 text-blue-600 mr-3" />
                        <span className="text-gray-700">Input Data</span>
                      </Link>
                      <Link
                        href="/automated-reports"
                        className="flex items-center p-2 rounded hover:bg-gray-100 transition-colors"
                      >
                        <Settings className="h-5 w-5 text-purple-600 mr-3" />
                        <span className="text-gray-700">Reports</span>
                      </Link>
                      <Link
                        href="/settings"
                        className="flex items-center p-2 rounded hover:bg-gray-100 transition-colors"
                      >
                        <User className="h-5 w-5 text-gray-600 mr-3" />
                        <span className="text-gray-700">Settings</span>
                      </Link>
                    </div>
                  </div>

                  {/* Newsletter Signup */}
                  <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg shadow-md p-6 text-white">
                    <h3 className="font-bold text-lg mb-2">Stay Informed</h3>
                    <p className="text-green-100 text-sm mb-4">
                      Get the latest sustainability news delivered to your
                      inbox.
                    </p>
                    <Button className="w-full bg-white text-green-600 hover:bg-gray-100">
                      Subscribe
                    </Button>
                  </div>
                </aside>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <Leaf className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No News Available
                </h3>
                <p className="text-gray-600">
                  Check back later for the latest sustainability news and
                  updates.
                </p>
              </div>
            )}
          </div>
        </main>
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
