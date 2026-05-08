"use client";

/**
 * Learn page — browse health education categories and read articles.
 */

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, BookOpen, Heart, Sparkles, Apple, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { learnApi } from "@/lib/api";
import { useUIStore } from "@/lib/stores";
import type { LearnCategory, LearnArticle } from "@/types";

const iconMap: Record<string, React.ElementType> = {
  Heart, BookOpen, Sparkles, Apple,
};

type View = "categories" | "articles" | "article";

export default function LearnPage() {
  const language = useUIStore((s) => s.language);
  const [view, setView] = useState<View>("categories");
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [activeArticle, setActiveArticle] = useState<LearnArticle | null>(null);

  const { data: categories = [] } = useQuery({
    queryKey: ["learnCategories"],
    queryFn: learnApi.listCategories,
  });

  const { data: articles = [] } = useQuery({
    queryKey: ["learnArticles", activeSlug],
    queryFn: () => learnApi.getArticles(activeSlug!),
    enabled: !!activeSlug,
  });

  const openCategory = (slug: string) => {
    setActiveSlug(slug);
    setView("articles");
  };

  const openArticle = (article: LearnArticle) => {
    setActiveArticle(article);
    setView("article");
  };

  const gradients = [
    "from-dusty-rose-400 to-warm-peach-400",
    "from-lavender-400 to-dusty-rose-300",
    "from-sage-400 to-sage-500",
    "from-warm-peach-400 to-warm-peach-500",
  ];

  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      <AnimatePresence mode="wait">
        {/* ── Categories ── */}
        {view === "categories" && (
          <motion.div key="cats" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-1">Learn 📚</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Explore health topics at your own pace</p>

            <div className="space-y-3">
              {categories.map((cat: LearnCategory, i: number) => {
                const Icon = iconMap[cat.icon || "BookOpen"] || BookOpen;
                return (
                  <motion.div
                    key={cat.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <Card
                      className="cursor-pointer transition-all hover:shadow-md hover:scale-[1.01]"
                      onClick={() => openCategory(cat.slug)}
                    >
                      <CardContent className="flex items-center gap-4 p-4">
                        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r ${gradients[i % gradients.length]} shadow-sm`}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-800 dark:text-gray-100">{cat.name}</h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{cat.article_count} articles</p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
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
            <button onClick={() => setView("categories")} className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 mb-4 hover:text-dusty-rose-500">
              <ArrowLeft className="h-4 w-4" /> Back
            </button>

            <div className="space-y-3">
              {articles.map((article: LearnArticle, i: number) => {
                const title = article.title?.[language] || article.title?.en || "Untitled";
                return (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Card className="cursor-pointer transition-all hover:shadow-md" onClick={() => openArticle(article)}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-dusty-rose-100 dark:bg-dusty-rose-900/30 text-dusty-rose-600 dark:text-dusty-rose-300 capitalize">
                            {article.content_type}
                          </span>
                        </div>
                        <h3 className="font-semibold text-gray-800 dark:text-gray-100">{title}</h3>
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
          <motion.div key="detail" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <button onClick={() => setView("articles")} className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 mb-4 hover:text-dusty-rose-500">
              <ArrowLeft className="h-4 w-4" /> Back
            </button>

            <Card>
              <CardContent className="p-6">
                <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                  {activeArticle.title?.[language] || activeArticle.title?.en}
                </h1>
                <div className="prose prose-sm dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
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
