"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Paperclip, Calendar, User, Image } from "lucide-react";
import { crudService } from "@/lib/crudService";
import Link from "next/link";

const ThreeBackground = dynamic(() => import("@/components/three-bg"), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 -z-10">
      <div className="w-full h-full bg-gradient-to-br from-green-50 via-emerald-50 to-sky-50" />
    </div>
  ),
});

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
        // Find article by quizid (handle both number and string types)
        const articleData = articles.find((a: any) => 
          String(a.quizid) === String(id) || a.quizid === id
        );
        
        if (articleData) {
          console.log('Found article in sessionStorage:', articleData);
          setArticle(articleData);
          
          // Also check for image
          if (storedImages) {
            const images = JSON.parse(storedImages);
            const articleImage = images.find((img: any) => 
              String(img.relativeid ?? img.RelativeID) === String(id) || 
              img.relativeid === id || img.RelativeID === id
            );
            if (articleImage) {
              console.log('Found image in sessionStorage:', articleImage);
              // Set the image URL
              const imageUrl = articleImage.imageUrl || 
                (articleImage.attachmentcontent ? `data:image/png;base64,${articleImage.attachmentcontent}` : null);
              setArticleImage(imageUrl);
            }
          }
          setLoading(false);
          return; // No need to make API calls
        }
      }

      // Fallback: Fetch article details from API if not in sessionStorage
      try {
        // Fetch article details
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

        console.log("Article detail response:", articleResponse);

        if (articleResponse && articleResponse.Data && articleResponse.Data.length > 0) {
          const jsonData = articleResponse.Data[0].JsonData;
          const parsedData = JSON.parse(jsonData);
          console.log("Parsed article data:", parsedData);

          if (parsedData.Articles && parsedData.Articles.TableData && parsedData.Articles.TableData.length > 0) {
            setArticle(parsedData.Articles.TableData[0]);
          }
        }

        // Fetch article questions (quiz questions)
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

        console.log("Article questions response:", questionsResponse);

        if (questionsResponse && questionsResponse.Data && questionsResponse.Data.length > 0) {
          const jsonData = questionsResponse.Data[0].JsonData;
          const parsedQuestions = JSON.parse(jsonData);
          console.log("Parsed article questions:", parsedQuestions);

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
      // Format: YYYYMMDD
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
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-sky-50">
        <ThreeBackground />
        <div className="flex flex-col items-center justify-center min-h-screen">
          <p className="text-red-600 text-lg mb-4">{error || "Article not found"}</p>
          <Link href="/">
            <Button>Go Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-sky-50">
      <ThreeBackground />
      
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="h-5 w-5 text-green-600" />
              <span className="text-gray-600 hover:text-green-600">Back to Articles</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Article Content */}
      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="backdrop-blur-md bg-white/90 border-white/30 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-green-500/80 to-emerald-600/80 text-white rounded-t-lg">
                <CardTitle className="text-3xl font-bold">{article.quizname}</CardTitle>
                <CardDescription className="text-green-100">
                  {article.quiztypeName}
                </CardDescription>
              </CardHeader>
              
              {/* Article Image */}
              {articleImage && (
                <div className="relative h-64 md:h-96 w-full overflow-hidden">
                  <img
                    src={articleImage}
                    alt={article.quizname}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <CardContent className="p-8 space-y-8">
                {/* Article Info */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Description</h3>
                    <p className="text-gray-700">{article.quizdescription || "No description available"}</p>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-green-600" />
                      <span>{article.quizadminentityName || "Unknown"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-green-600" />
                      <span>{formatDate(article.quizadmininstancedate)}</span>
                    </div>
                  </div>
                </div>

                {/* Article Questions/Content */}
                {questions.length > 0 && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">
                      Article Content
                    </h3>
                    
                    {questions.map((question, index) => (
                      <motion.div
                        key={question.quizquestionid}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className="bg-gray-50 rounded-lg p-6"
                      >
                        <h4 className="font-semibold text-gray-900 mb-2">
                          {question.quizquestionname}
                        </h4>
                        <p className="text-gray-700">
                          {question.quizquestiondescription || "No content available"}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Attachment */}
                {article.quizadminid && (
                  <div className="border-t pt-6">
                    <h3 className="text-sm font-medium text-gray-500 mb-3">Attachment</h3>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2"
                      onClick={() => {
                        // Fetch attachment
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
                          console.log("Attachment response:", response);
                          if (response && response.Data && response.Data.length > 0) {
                            const jsonData = response.Data[0].JsonData;
                            const parsedData = JSON.parse(jsonData);
                            if (parsedData.TS && parsedData.TS.TableData && parsedData.TS.TableData.length > 0) {
                              const attachment = parsedData.TS.TableData[0];
                              if (attachment.attachmentcontent) {
                                // Create download link
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
                      Download Attachment
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
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
