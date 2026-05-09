"use client";

/**
 * Learn page — browse health education categories and read articles.
 * Redesigned for a more appealing, vibrant, and glassmorphic UI.
 */

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, BookOpen, Heart, Sparkles, Apple, ChevronRight, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { learnApi } from "@/lib/api";
import { useUIStore, useAuthStore } from "@/lib/stores";
import type { LearnCategory, LearnArticle } from "@/types";
import { useTranslation } from "@/lib/i18n/useTranslation";

const iconMap: Record<string, React.ElementType> = {
  Heart, BookOpen, Sparkles, Apple,
};

type View = "categories" | "articles" | "article";

export default function LearnPage() {
  const language = useUIStore((s) => s.language);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { t } = useTranslation();
  const [view, setView] = useState<View>("categories");
  const [activeCategory, setActiveCategory] = useState<LearnCategory | null>(null);
  const [activeArticle, setActiveArticle] = useState<LearnArticle | null>(null);

  const { data: categoriesData = [] } = useQuery({
    queryKey: ["learnCategories"],
    queryFn: learnApi.listCategories,
    enabled: isAuthenticated,
  });
  const categories = Array.isArray(categoriesData) ? categoriesData : [];

  const { data: articlesData = [] } = useQuery({
    queryKey: ["learnArticles", activeCategory?.slug],
    queryFn: () => learnApi.getArticles(activeCategory!.slug),
    enabled: !!activeCategory && isAuthenticated,
  });
  const articles = Array.isArray(articlesData) ? articlesData : [];

  const openCategory = (cat: LearnCategory) => {
    setActiveCategory(cat);
    setView("articles");
  };

  const openArticle = (article: LearnArticle) => {
    setActiveArticle(article);
    setView("article");
  };

  // Vibrant gradients mapped by index
  const categoryGradients = [
    "from-dusty-rose-400 to-warm-peach-400",
    "from-lavender-400 to-dusty-rose-300",
    "from-sage-400 to-sage-500",
    "from-warm-peach-400 to-warm-peach-500",
  ];

  const floatingAnimation = {
    y: ["-5%", "5%"],
    transition: {
      duration: 3,
      repeat: Infinity,
      repeatType: "reverse" as const,
      ease: "easeInOut",
    },
  };

  return (
    <div className="mx-auto max-w-lg px-4 py-6 pb-24 min-h-[calc(100vh-4rem)]">
      <AnimatePresence mode="wait">
        {/* ── Categories Grid ── */}
        {view === "categories" && (
          <motion.div key="cats" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}>
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-1 flex items-center gap-2">
                {t("learn.title")} <Sparkles className="w-5 h-5 text-dusty-rose-500" />
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t("learn.subtitle")}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {categories.map((cat: LearnCategory, i: number) => {
                const Icon = iconMap[cat.icon || "BookOpen"] || BookOpen;
                const gradient = categoryGradients[i % categoryGradients.length];
                
                return (
                  <motion.div
                    key={cat.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1, type: "spring", stiffness: 100 }}
                  >
                    <Card
                      className={`relative overflow-hidden cursor-pointer h-44 border-0 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-gradient-to-br ${gradient}`}
                      onClick={() => openCategory(cat)}
                    >
                      {/* Abstract Background Visualization */}
                      <motion.div 
                        className="absolute -right-6 -bottom-6 opacity-20 pointer-events-none"
                        animate={floatingAnimation}
                      >
                        <Icon className="w-36 h-36 text-white" strokeWidth={1} />
                      </motion.div>
                      
                      {/* Glassmorphic Content Overlay */}
                      <CardContent className="absolute inset-0 p-4 flex flex-col justify-end bg-black/5 hover:bg-black/0 transition-colors">
                        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md p-3 rounded-xl border border-white/20 dark:border-white/10 shadow-sm">
                          <Icon className="h-6 w-6 text-dusty-rose-600 dark:text-dusty-rose-400 mb-2" />
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100 leading-tight mb-1 text-sm">{cat.name}</h3>
                          <p className="text-[10px] uppercase tracking-wider text-gray-600 dark:text-gray-400 font-medium">{cat.article_count} reads</p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* ── Article List ── */}
        {view === "articles" && (
          <motion.div key="arts" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="flex items-center justify-between mb-6">
              <button 
                onClick={() => setView("categories")} 
                className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300 hover:text-dusty-rose-600 dark:hover:text-dusty-rose-400 transition-colors bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-sm border border-gray-100 dark:border-gray-700"
              >
                <ArrowLeft className="h-4 w-4" /> {t("common.back")}
              </button>
              {activeCategory && (
                 <span className="text-sm font-semibold text-dusty-rose-600 dark:text-dusty-rose-400 px-4 py-1.5 bg-dusty-rose-50 dark:bg-dusty-rose-900/20 rounded-full">
                   {activeCategory.name}
                 </span>
              )}
            </div>

            <div className="space-y-4">
              {articles.map((article: LearnArticle, i: number) => {
                const title = article.title?.[language] || article.title?.en || "Untitled";
                return (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <Card 
                      className="cursor-pointer overflow-hidden border-0 shadow-sm transition-all hover:shadow-md hover:scale-[1.02] bg-white dark:bg-gray-800 group h-full flex flex-col" 
                      onClick={() => openArticle(article)}
                    >
                      <CardContent className="p-0 flex flex-col flex-1">
                        {article.image_url && (
                          <div className="h-40 w-full overflow-hidden shrink-0">
                            <img src={article.image_url} alt={title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                          </div>
                        )}
                        <div className="flex flex-1">
                          {/* Decorative side bar */}
                          {!article.image_url && <div className="w-2 shrink-0 bg-gradient-to-b from-dusty-rose-300 to-lavender-400 group-hover:w-3 transition-all duration-300" />}
                          <div className="p-4 flex-1 flex flex-col justify-center">
                          <div className="flex items-center justify-between mb-2">
                            <span className="inline-block px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-bold bg-dusty-rose-100 dark:bg-dusty-rose-900/40 text-dusty-rose-700 dark:text-dusty-rose-300">
                              {article.content_type}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500 font-medium">
                              <Clock className="w-3.5 h-3.5" /> 3 min
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-4">
                            <h3 className="font-semibold text-gray-800 dark:text-gray-100 group-hover:text-dusty-rose-600 dark:group-hover:text-dusty-rose-400 transition-colors">
                              {title}
                            </h3>
                            <ChevronRight className="w-5 h-5 text-gray-300 dark:text-gray-600 group-hover:text-dusty-rose-400 transition-colors shrink-0" />
                          </div>
                        </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* ── Article Detail ── */}
        {view === "article" && activeArticle && (
          <motion.div key="detail" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <button 
              onClick={() => setView("articles")} 
              className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300 hover:text-dusty-rose-600 dark:hover:text-dusty-rose-400 transition-colors bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-sm border border-gray-100 dark:border-gray-700 w-fit mb-4"
            >
              <ArrowLeft className="h-4 w-4" /> {t("common.back")}
            </button>

            <Card className="overflow-hidden border-0 shadow-lg bg-white/95 dark:bg-gray-900/95 backdrop-blur">
              {/* Hero Visualization Header */}
              <div className="h-40 bg-gradient-to-r from-dusty-rose-400 via-warm-peach-400 to-lavender-400 relative overflow-hidden flex items-center justify-center">
                {/* Animated abstract blobs */}
                <motion.div 
                  className="absolute w-64 h-64 bg-white/20 rounded-full blur-2xl"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    x: [0, 30, -30, 0],
                    y: [0, -20, 20, 0]
                  }}
                  transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div 
                  className="absolute w-48 h-48 bg-white/20 rounded-full blur-xl"
                  animate={{ 
                    scale: [1, 1.5, 1],
                    x: [0, -40, 40, 0]
                  }}
                  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                />
                
                {/* Dynamic Category Icon in Header */}
                <div className="relative z-10 bg-white/20 backdrop-blur-md p-4 rounded-full border border-white/30 shadow-sm">
                  {activeCategory ? (
                    (() => {
                      const Icon = iconMap[activeCategory.icon || "BookOpen"] || BookOpen;
                      return <Icon className="w-8 h-8 text-white drop-shadow-md" />;
                    })()
                  ) : (
                    <Sparkles className="w-8 h-8 text-white drop-shadow-md" />
                  )}
                </div>
              </div>
              
              <CardContent className="p-6 md:p-8">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                  {activeArticle.title?.[language] || activeArticle.title?.en}
                </h1>
                
                {/* Fallback styling for prose in case typography plugin is missing */}
                <div className="
                  text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line text-[15px]
                  [&>h2]:text-lg [&>h2]:font-bold [&>h2]:text-gray-900 [&>h2]:dark:text-white [&>h2]:mt-6 [&>h2]:mb-3
                  [&>h3]:text-md [&>h3]:font-semibold [&>h3]:text-gray-800 [&>h3]:dark:text-gray-100 [&>h3]:mt-5 [&>h3]:mb-2
                  [&>p]:mb-4
                  [&>ul]:list-none [&>ul]:pl-0 [&>ul>li]:relative [&>ul>li]:pl-6 [&>ul>li]:mb-2
                  [&>ul>li::before]:content-['•'] [&>ul>li::before]:absolute [&>ul>li::before]:left-1 [&>ul>li::before]:text-dusty-rose-400 [&>ul>li::before]:font-bold
                  [&>strong]:text-dusty-rose-700 [&>strong]:dark:text-dusty-rose-400 [&>strong]:font-semibold
                ">
                  {activeArticle.content?.[language] || activeArticle.content?.en}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
