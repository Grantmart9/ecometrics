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
        const response = await crudService.callCrud({
          data: JSON.stringify([{
            RecordSet: "Articles",
            TableName: "get_quizadmin",
            Action: "procedure",
            Fields: {
              Ent: "4",
              QType: "Article"
            }
          }]),
        }) as any;

        if (response && response.Data && response.Data.length > 0) {
          const jsonData = response.Data[0].JsonData;
          const parsedData = JSON.parse(jsonData);
          
          if (parsedData.Articles && parsedData.Articles.TableData && Array.isArray(parsedData.Articles.TableData)) {
            setArticles(parsedData.Articles.TableData);
            
            // Store articles in sessionStorage for article page to use
            sessionStorage.setItem('articles_data', JSON.stringify(parsedData.Articles.TableData));
            
            // Fetch images for articles if we have article IDs
            const articleIds: number[] = Array.from(new Set(parsedData.Articles.TableData
              .filter((item: any) => item.quizid)
              .map((item: any) => item.quizid)) as unknown as number[]);
            
            if (articleIds.length > 0) {
              fetchArticleImages(articleIds);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setLoadingArticles(false);
      }
    };

    const fetchArticleImages = async (ids: number[]) => {
      try {
        const response = await crudService.callCrud({
          data: JSON.stringify([{
            RecordSet: "ArticleImages",
            TableName: "attachment",
            Action: "readIn",
            Fields: {
              RelativeID: `(${ids.join(",")})`
            }
          }]),
        }) as any;
        console.log("Article images API response:", response);

        if (response && response.Data && response.Data.length > 0) {
          const jsonData = response.Data[0].JsonData;
          const parsedData = JSON.parse(jsonData);
          
          // Handle both 'TS' and 'ArticleImages' key formats from API
          const tableData = parsedData.TS?.TableData || parsedData.ArticleImages?.TableData || [];
          
          if (tableData && Array.isArray(tableData) && tableData.length > 0) {
            // Convert base64 attachmentcontent to image URLs
            const processedImages = tableData.map((item: any) => {
              const imageType = item.attachmentType || item.attachmenttype || item.attachmentContentType || item.attachmentmimetype || 'image/png';
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
            const loadedIds = new Set(processedImages.map(img => 
              img.attachmentRelativeID ?? img.attachmentRelativeId ?? img.attachmentrelativeid ?? img.RelativeID ?? img.relativeid ?? 0
            ).filter(Boolean));
            setImagesLoaded(loadedIds);
            
            // Store images in sessionStorage for article page to use
            sessionStorage.setItem('article_images', JSON.stringify(processedImages));
          }
        }
      } catch (error) {
        console.error("Error fetching article images:", error);
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
      const imageItem = articleImages.find(
        (img: any) => {
          const imgRelativeId = img.attachmentRelativeID ?? img.attachmentRelativeId ?? img.attachmentrelativeid ?? img.RelativeID ?? img.relativeid ?? null;
          return String(imgRelativeId) === String(item.quizid);
        }
      );
      
      // Use the converted imageUrl, or construct from attachmentcontent if needed
      let displayImage = imageItem?.imageUrl || 
                           (imageItem?.attachmentcontent ? `data:image/png;base64,${imageItem.attachmentcontent}` : null) ||
                           item.Image || 
                           item.image || 
                           item.Attachment || 
                           item.attachment ||
                           "";
      
      // Validate and fix data URL format
      if (displayImage && !displayImage.startsWith('data:')) {
        if (displayImage.length > 0 && !displayImage.includes('://')) {
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
    return result.filter((article, index, self) => 
      index === self.findIndex((a) => a.id === article.id)
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
        <div className={`w-full ${skeletonHeight} bg-gradient-to-br from-green-100 to-emerald-100 rounded-t-lg`}>
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
          <section id="how-it-works" className="py-20 bg-gradient-to-br from-green-50 to-emerald-50">
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
        <></>
      )}

      {/* Articles Section - Only for authenticated users */}
      {isAuthenticated && (
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

            {loadingArticles ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
              </div>
            ) : parsedArticles.length > 0 ? (
              <>
                {/* Featured Article */}
                {parsedArticles.slice(0, 1).map((article, index) => (
                  <motion.div
                    key={article.id || `featured-${index}`}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="mb-12"
                  >
                    <Link href={`/article?id=${article.id || index + 1}`} className="block">
                      <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                        <div className="relative h-64 md:h-80 bg-gradient-to-br from-green-100 to-emerald-100 rounded-t-lg overflow-hidden">
                          <ArticleImage
                            src={article.image}
                            alt={article.header}
                            className="w-full h-full object-cover"
                            skeletonHeight="h-64 md:h-80"
                            isLoading={!imagesLoaded.has(Number(article.id))}
                          />
                        </div>
                        <CardContent className="p-8">
                          <div className="text-sm text-green-600 font-medium mb-2">
                            {article.date || "Featured Article"}
                          </div>
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

                {/* Article Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {parsedArticles.slice(1).map((article, index) => (
                    <motion.div
                      key={article.id || `article-${index}`}
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <Link href={`/article?id=${article.id || index + 2}`} className="block">
                        <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                          <div className="relative h-48 bg-gradient-to-br from-green-100 to-emerald-100 rounded-t-lg overflow-hidden">
                            <ArticleImage
                              src={article.image}
                              alt={article.header}
                              className="w-full h-full object-cover"
                              skeletonHeight="h-48"
                              isLoading={!imagesLoaded.has(Number(article.id))}
                            />
                          </div>
                          <CardContent className="p-6">
                            <div className="text-sm text-green-600 font-medium mb-2">
                              {article.date || "Article"}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">
                              {article.header}
                            </h3>
                            <p className="text-gray-600 text-base line-clamp-3">
                              {article.title}
                            </p>
                          </CardContent>
                        </Card>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-20">
                <p className="text-gray-600 text-lg">No articles available at the moment.</p>
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
