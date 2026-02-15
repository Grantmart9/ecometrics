"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Paperclip, Calendar, User, Image, Leaf, Sparkles } from "lucide-react";
import { crudService } from "@/lib/crudService";
import Link from "next/link";

// Enhanced Three.js background with animated particles
const ThreeBackground = dynamic(() => import("@/components/three-bg"), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 -z-10">
      <div className="w-full h-full bg-gradient-to-br from-green-50 via-emerald-50 to-sky-50" />
    </div>
  ),
});

// Carbon animation for decorative elements
const CarbonAnimation = dynamic(
  () => import("@/components/CarbonAnimation"),
  {
    ssr: false,
    loading: () => (
      <div className="relative w-32 h-32 flex items-center justify-center">
        <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full animate-pulse" />
      </div>
    ),
  }
);

interface ArticleDetail {
  quizid: number;
  quizname: string;
  quizdescription: string;
  quiztype: number;
  quiztypeName: string;
  quizadminid: number;
  quizadminentity: number;
  quizadminentityName: string;
  quizadmininstancedate: number | null;
}

interface ArticleQuestion {
  quizquestionid: number;
  quizquestionname: string;
  quizquestiondescription: string;
}

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.15
    }
  }
};

const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut" }
};

// Enhanced animation variants for articles
const cardHoverEffect = {
  rest: { scale: 1, rotateX: 0, rotateY: 0 },
  hover: { scale: 1.02, rotateX: 2, rotateY: -2 }
};

const floatAnimation = {
  initial: { y: 0 },
  animate: { 
    y: [-10, 10, -10],
    transition: { 
      duration: 6, 
      repeat: Infinity, 
      ease: "easeInOut" 
    }
  }
};

const pulseGlow = {
  initial: { boxShadow: "0 0 0 0 rgba(34, 197, 94, 0)" },
  animate: {
    boxShadow: [
      "0 0 0 0 rgba(34, 197, 94, 0)",
      "0 0 0 20px rgba(34, 197, 94, 0.3)",
      "0 0 0 40px rgba(34, 197, 94, 0.1)",
      "0 0 0 60px rgba(34, 197, 94, 0.05)",
      "0 0 0 80px rgba(34, 197, 94, 0.02)",
      "0 0 0 100px rgba(34, 197, 94, 0.01)",
      "0 0 0 0 rgba(34, 197, 94, 0)"
    ]
  }
};

const particleFloat = {
  initial: { opacity: 0, scale: 0 },
  animate: { 
    opacity: [0, 0.6, 0],
    scale: [0, 1, 0],
    x: [0, Math.random() * 100 - 50],
    y: [0, Math.random() * 100 - 50],
    transition: { 
      duration: 4 + Math.random() * 2, 
      repeat: Infinity, 
      ease: "easeInOut" 
    }
  }
};

function ArticleContent() {
  const searchParams = useSearchParams();
  const articleId = searchParams.get("id");
  const [article, setArticle] = useState<ArticleDetail | null>(null);
  const [questions, setQuestions] = useState<ArticleQuestion[]>([]);
  const [articleImage, setArticleImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadArticle = async () => {
      if (!articleId) return;

      const id = parseInt(articleId);
      setLoading(true);
      setError(null);

      // Check if article data is already in sessionStorage (from home page)
      const storedArticles = sessionStorage.getItem('articles_data');
      const storedImages = sessionStorage.getItem('article_images');
      
      if (storedArticles) {
        const articles = JSON.parse(storedArticles);
        const articleData = articles.find((a: any) => 
          String(a.quizid) === String(id) || a.quizid === id
        );
        
        if (articleData) {
          console.log('Found article in sessionStorage:', articleData);
          setArticle(articleData);
          
          if (storedImages) {
            const images = JSON.parse(storedImages);
            console.log('Stored images:', images);
            console.log('Looking for article id:', id);
            const articleImage = images.find((img: any) => 
              String(img.attachmentRelativeID ?? img.attachmentRelativeId ?? img.attachmentrelativeid ?? img.relativeid ?? img.RelativeID) === String(id) || 
              img.attachmentRelativeID === id || img.attachmentRelativeId === id || img.attachmentrelativeid === id || img.relativeid === id || img.RelativeID === id
            );
            console.log('Found image:', articleImage);
            if (articleImage) {
              const imageUrl = articleImage.imageUrl || 
                (articleImage.attachmentcontent ? `data:image/png;base64,${articleImage.attachmentcontent}` : null);
              setArticleImage(imageUrl);
            }
          }
          setLoading(false);
          return;
        }
      }

      // Fallback: Fetch article details from API if not in sessionStorage
      try {
        const articleResponse = await crudService.callCrud({
          data: JSON.stringify([{
            RecordSet: "ArticleDetail",
            TableName: "get_quizadmin",
            Action: "procedure",
            Fields: {
              Ent: "4",
              QType: "Article",
              QID: articleId
            }
          }]),
        }) as any;

        if (articleResponse && articleResponse.Data && articleResponse.Data.length > 0) {
          const jsonData = articleResponse.Data[0].JsonData;
          const parsedData = JSON.parse(jsonData);
          if (parsedData.Articles && parsedData.Articles.TableData && parsedData.Articles.TableData.length > 0) {
            setArticle(parsedData.Articles.TableData[0]);
          }
        }

        // Also try to fetch the article image from API
        try {
          const imageResponse = await crudService.callCrud({
            data: JSON.stringify([{
              RecordSet: "ArticleImages",
              TableName: "attachment",
              Action: "readIn",
              Fields: {
                RelativeID: `(${articleId})`
              }
            }]),
          }) as any;
          
          console.log("Article image API response:", imageResponse);
          
          if (imageResponse && imageResponse.Data && imageResponse.Data.length > 0) {
            const jsonData = imageResponse.Data[0].JsonData;
            const parsedData = JSON.parse(jsonData);
            const tableData = parsedData.TS?.TableData || parsedData.ArticleImages?.TableData || [];
            
            console.log("Image table data:", tableData);
            
            if (tableData && Array.isArray(tableData) && tableData.length > 0) {
              const img = tableData[0];
              const imageType = img.attachmentType || img.attachmenttype || img.attachmentmimetype || 'image/png';
              const imageUrl = img.attachmentcontent 
                ? `data:${imageType};base64,${img.attachmentcontent}` 
                : null;
              console.log("Constructed image URL:", imageUrl ? "present" : "null");
              if (imageUrl) {
                setArticleImage(imageUrl);
              }
            }
          }
        } catch (imgErr) {
          console.error("Error fetching article image:", imgErr);
        }

        const questionsResponse = await crudService.callCrud({
          data: JSON.stringify([{
            RecordSet: "ArticleQuestions",
            TableName: "get_quizquestion",
            Action: "procedure",
            Fields: {
              Ent: "4",
              QType: "Article",
              QID: articleId
            }
          }]),
        }) as any;

        if (questionsResponse && questionsResponse.Data && questionsResponse.Data.length > 0) {
          const jsonData = questionsResponse.Data[0].JsonData;
          const parsedQuestions = JSON.parse(jsonData);
          if (parsedQuestions.get_quizquestion && Array.isArray(parsedQuestions.get_quizquestion)) {
            setQuestions(parsedQuestions.get_quizquestion);
          }
        }
      } catch (err) {
        console.error("Error fetching article:", err);
        setError("Failed to load article");
      } finally {
        setLoading(false);
      }
    };

    loadArticle();
  }, [articleId]);

  const formatDate = (dateNum: number | null) => {
    if (!dateNum) return "N/A";
    const dateStr = dateNum.toString();
    if (dateStr.length === 8) {
      const year = dateStr.slice(0, 4);
      const month = dateStr.slice(4, 6);
      const day = dateStr.slice(6, 8);
      return `${year}-${month}-${day}`;
    }
    return dateStr;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-sky-50">
        <ThreeBackground />
        <div className="flex flex-col items-center justify-center min-h-screen">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            variants={pulseGlow}
          >
            <div className="relative">
              <CarbonAnimation />
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Leaf className="h-8 w-8 text-white" />
              </motion.div>
            </div>
          </motion.div>
          <motion.p
            className="mt-4 text-green-700 font-medium"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            Loading article...
          </motion.p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-sky-50">
        <ThreeBackground />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center min-h-screen"
        >
          <Card className="backdrop-blur-md bg-white/90 border-red-200 shadow-xl max-w-md">
            <CardContent className="p-8 text-center">
              <motion.div
                animate={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 0.5, repeat: 2 }}
                className="inline-block mb-4"
              >
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <Leaf className="h-8 w-8 text-red-500" />
                </div>
              </motion.div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Article Not Found</h2>
              <p className="text-gray-600 mb-6">{error || "The article you're looking for doesn't exist."}</p>
              <Link href="/">
                <Button className="bg-green-600 hover:bg-green-700">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-sky-50">
      <ThreeBackground />
      
      {/* Animated floating particles */}
      <motion.div
        className="fixed inset-0 pointer-events-none overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              y: [0, -150, 0],
              x: [0, Math.random() * 80 - 40, 0],
              opacity: [0, 0.5, 0],
              scale: [0, 1.2, 0],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: "easeInOut",
            }}
          >
            <Leaf className="h-5 w-5 text-green-400" />
          </motion.div>
        ))}
        {/* Additional sparkles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`sparkle-${i}`}
            className="absolute"
            style={{
              left: `${20 + Math.random() * 60}%`,
              top: `${20 + Math.random() * 60}%`,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              scale: [0, 1.5, 0],
              opacity: [0, 0.8, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          >
            <Sparkles className="h-4 w-4 text-yellow-400" />
          </motion.div>
        ))}
      </motion.div>

      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="bg-white/70 backdrop-blur-xl shadow-lg fixed top-0 left-0 right-0 z-50 border-b border-white/20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3 group">
              <motion.div
                whileHover={{ x: -5 }}
                transition={{ type: "spring", stiffness: 400 }}
                className="flex items-center gap-2"
              >
                <div className="p-2 bg-green-100 rounded-full group-hover:bg-green-200 transition-colors">
                  <ArrowLeft className="h-5 w-5 text-green-600" />
                </div>
                <span className="text-gray-700 font-medium group-hover:text-green-700 transition-colors">
                  Back to Articles
                </span>
              </motion.div>
            </Link>
            
            {/* Decorative element */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Leaf className="h-6 w-6 text-green-500 opacity-50" />
            </motion.div>
          </div>
        </div>
      </motion.nav>

      {/* Article Content */}
      <main className="pt-28 pb-16 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={article.quizid}
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              {/* Hero Image - Now at the top */}
              <AnimatePresence>
                {articleImage && (
                  <motion.div
                    variants={staggerItem}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.6 }}
                    className="mb-8"
                  >
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                      className="relative overflow-hidden rounded-3xl shadow-2xl"
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent z-10"
                      />
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-green-500/20 via-transparent to-emerald-500/20 z-10"
                      />
                      <img
                        src={articleImage}
                        alt={article.quizname}
                        className="w-full h-[400px] md:h-[500px] object-cover"
                      />
                      <motion.div
                        className="absolute bottom-6 left-6 z-20"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium text-gray-700 shadow-lg">
                          <Image className="h-4 w-4" />
                          Article Image
                        </span>
                      </motion.div>
                      {/* Floating badge */}
                      <motion.div
                        className="absolute top-6 right-6 z-20"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-600/90 backdrop-blur-sm rounded-full text-sm font-medium text-white shadow-lg">
                          <Sparkles className="h-4 w-4 text-yellow-300" />
                          {article.quiztypeName}
                        </span>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Hero Card with Title */}
              <motion.div 
                variants={staggerItem} 
                className="relative mb-8"
                initial="initial"
                whileHover="hover"
                animate="animate"
              >
                <motion.div
                  variants={cardHoverEffect}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                <Card className="backdrop-blur-xl bg-white/80 border-white/30 shadow-2xl overflow-hidden">
                  {/* Animated gradient overlay */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-teal-500/10"
                    animate={{
                      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                    }}
                    transition={{ duration: 5, repeat: Infinity }}
                    style={{ backgroundSize: "200% 200%" }}
                  />
                  
                  {/* Decorative circles */}
                  <motion.div
                    className="absolute -top-20 -right-20 w-64 h-64 bg-green-400/10 rounded-full blur-3xl"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  />
                  <motion.div
                    className="absolute -bottom-20 -left-20 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl"
                    animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 5, repeat: Infinity, delay: 1 }}
                  />
                  
                  <CardHeader className="relative bg-gradient-to-r from-green-600/90 to-emerald-600/90 text-white rounded-t-lg overflow-hidden">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      {!articleImage && (
                        <div className="flex items-center gap-2 mb-2">
                          <motion.div
                            animate={{ rotate: [0, 360] }}
                            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                          >
                            <Sparkles className="h-5 w-5 text-yellow-300" />
                          </motion.div>
                          <CardDescription className="text-green-100">
                            {article.quiztypeName}
                          </CardDescription>
                        </div>
                      )}
                      <CardTitle className="text-4xl md:text-5xl font-bold leading-tight">
                        {article.quizname}
                      </CardTitle>
                    </motion.div>
                  </CardHeader>
                  
                  <CardContent className="p-8 relative">
                    {/* Article Info Grid */}
                    <motion.div
                      variants={staggerContainer}
                      initial="initial"
                      animate="animate"
                      className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    >
                      {/* Description */}
                      <motion.div variants={staggerItem} className="space-y-4">
                        <div className="relative">
                          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                            <div className="w-1 h-4 bg-green-500 rounded-full" />
                            About This Article
                          </h3>
                          <p className="text-gray-700 leading-relaxed text-lg">
                            {article.quizdescription || "No description available for this article."}
                          </p>
                        </div>
                      </motion.div>
                      
                      {/* Meta Information */}
                      <motion.div variants={staggerItem} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100"
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-green-100 rounded-lg">
                                <User className="h-5 w-5 text-green-600" />
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 uppercase">Author</p>
                                <p className="font-medium text-gray-900">{article.quizadminentityName || "Unknown"}</p>
                              </div>
                            </div>
                          </motion.div>
                          
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-100"
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-amber-100 rounded-lg">
                                <Calendar className="h-5 w-5 text-amber-600" />
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 uppercase">Published</p>
                                <p className="font-medium text-gray-900">{formatDate(article.quizadmininstancedate)}</p>
                              </div>
                            </div>
                          </motion.div>
                        </div>
                      </motion.div>
                    </motion.div>
                  </CardContent>
                </Card>
                </motion.div>
              </motion.div>

              {/* Article Questions/Content */}
              <AnimatePresence>
                {questions.length > 0 && (
                  <motion.div variants={staggerItem} className="space-y-6">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-3 mb-6"
                    >
                      <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
                        <Leaf className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900">
                        Article Content
                      </h3>
                    </motion.div>
                    
                    <div className="space-y-4">
                      {questions.map((question, index) => (
                        <motion.div
                          key={question.quizquestionid}
                          variants={staggerItem}
                          initial={{ opacity: 0, x: -30 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.01, x: 5 }}
                          className="group"
                        >
                          <Card className="backdrop-blur-md bg-white/80 border-green-100/50 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                            <motion.div
                              className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-green-500 to-emerald-500"
                              initial={{ scaleY: 0 }}
                              whileInView={{ scaleY: 1 }}
                              transition={{ duration: 0.3 }}
                            />
                            <CardContent className="p-6 pl-8">
                              <motion.h4
                                className="font-semibold text-gray-900 text-lg mb-3 flex items-start gap-3"
                                initial={{ opacity: 0.8 }}
                                whileHover={{ opacity: 1 }}
                              >
                                <motion.span
                                  className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold"
                                  whileHover={{ scale: 1.1, backgroundColor: "#dcfce7" }}
                                >
                                  {index + 1}
                                </motion.span>
                                {question.quizquestionname}
                              </motion.h4>
                              <motion.p
                                className="text-gray-600 leading-relaxed pl-11"
                                initial={{ opacity: 0.7 }}
                                whileHover={{ opacity: 1 }}
                              >
                                {question.quizquestiondescription || (
                                  <span className="italic text-gray-400">No content available</span>
                                )}
                              </motion.p>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Attachment */}
              <AnimatePresence>
                {article.quizadminid && (
                  <motion.div
                    variants={staggerItem}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="mt-8"
                  >
                    <Card className="backdrop-blur-md bg-white/80 border-amber-200/50 shadow-lg">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <motion.div
                              whileHover={{ rotate: 360 }}
                              transition={{ duration: 0.5 }}
                              className="p-3 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl"
                            >
                              <Paperclip className="h-6 w-6 text-amber-600" />
                            </motion.div>
                            <div>
                              <h4 className="font-semibold text-gray-900">Attachment Available</h4>
                              <p className="text-sm text-gray-500">Download related documents</p>
                            </div>
                          </div>
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                              variant="outline"
                              className="flex items-center gap-2 border-amber-200 hover:bg-amber-50"
                              onClick={() => {
                                crudService.callCrud({
                                  data: JSON.stringify([{
                                    RecordSet: "ArticleAttachment",
                                    TableName: "attachment",
                                    Action: "readExact",
                                    Fields: {
                                      RelativeID: article.quizadminid.toString()
                                    }
                                  }]),
                                }).then((response: any) => {
                                  if (response && response.Data && response.Data.length > 0) {
                                    const jsonData = response.Data[0].JsonData;
                                    const parsedData = JSON.parse(jsonData);
                                    if (parsedData.TS && parsedData.TS.TableData && parsedData.TS.TableData.length > 0) {
                                      const attachment = parsedData.TS.TableData[0];
                                      if (attachment.attachmentcontent) {
                                        const link = document.createElement('a');
                                        link.href = `data:${attachment.attachmentmimeType};base64,${attachment.attachmentcontent}`;
                                        link.download = attachment.attachmentoriginalName || 'attachment';
                                        link.click();
                                      }
                                    }
                                  }
                                }).catch((err: Error) => {
                                  console.error("Error fetching attachment:", err);
                                });
                              }}
                            >
                              <Paperclip className="h-4 w-4" />
                              Download
                            </Button>
                          </motion.div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Decorative footer */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-12 text-center"
              >
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="inline-flex items-center gap-2 text-green-600/60"
                >
                  <Leaf className="h-4 w-4" />
                  <span className="text-sm">Sustainability matters</span>
                  <Leaf className="h-4 w-4" />
                </motion.div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function ArticleLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-sky-50">
      <ThreeBackground />
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <CarbonAnimation />
        </motion.div>
      </div>
    </div>
  );
}

export default function ArticlePage() {
  return (
    <Suspense fallback={<ArticleLoading />}>
      <ArticleContent />
    </Suspense>
  );
}
