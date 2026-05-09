"use client";

/**
 * Quiz page — category selection, interactive quiz flow, and stats.
 */

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Trophy, Zap, ArrowLeft, CheckCircle2, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { quizApi } from "@/lib/api";
import { useUIStore, useToast, useAuthStore } from "@/lib/stores";
import type { QuizQuestion, QuizCategory } from "@/types";
import { useTranslation } from "@/lib/i18n/useTranslation";

type View = "categories" | "quiz" | "result";

export default function QuizPage() {
  const language = useUIStore((s) => s.language);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { t } = useTranslation();
  const toast = useToast();
  const queryClient = useQueryClient();

  const [view, setView] = useState<View>("categories");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correctAnswer, setCorrectAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(0);

  // Fetch categories
  const { data: categoriesData = [] } = useQuery({
    queryKey: ["quizCategories"],
    queryFn: quizApi.listCategories,
    enabled: isAuthenticated,
  });
  const categories = Array.isArray(categoriesData) ? categoriesData : [];

  // Fetch stats
  const { data: stats } = useQuery({
    queryKey: ["quizStats"],
    queryFn: quizApi.getStats,
    enabled: isAuthenticated,
  });

  // Submit answer mutation
  const submitMutation = useMutation({
    mutationFn: ({ quizId, option }: { quizId: string; option: number }) =>
      quizApi.submitAttempt(quizId, { selected_option: option }),
    onSuccess: (result) => {
      setCorrectAnswer(result.correct_option);
      if (result.attempt.is_correct) {
        setScore((s) => s + result.attempt.score);
      }
      setAnswered((a) => a + 1);
      queryClient.invalidateQueries({ queryKey: ["quizStats"] });
    },
    onError: () => toast.error("Failed to submit answer"),
  });

  const startQuiz = async (slug: string) => {
    try {
      const qs = await quizApi.getByCategory(slug);
      if (qs.length === 0) {
        toast.info("No questions available yet");
        return;
      }
      setQuestions(qs);
      setActiveCategory(slug);
      setCurrentIdx(0);
      setSelected(null);
      setCorrectAnswer(null);
      setScore(0);
      setAnswered(0);
      setView("quiz");
    } catch {
      toast.error("Failed to load quiz");
    }
  };

  const handleSelect = (optionIdx: number) => {
    if (selected !== null) return; // already answered
    setSelected(optionIdx);
    submitMutation.mutate({ quizId: questions[currentIdx].id, option: optionIdx });
  };

  const nextQuestion = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((i) => i + 1);
      setSelected(null);
      setCorrectAnswer(null);
    } else {
      setView("result");
    }
  };

  const q = questions[currentIdx];
  const questionText = q?.question?.[language] || q?.question?.en || "";
  const options = q?.options?.[language] || q?.options?.en || [];

  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      <AnimatePresence mode="wait">
        {/* ── Categories View ── */}
        {view === "categories" && (
          <motion.div key="cats" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-1">{t("quiz.title")} 🧠</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{t("quiz.subtitle")}</p>

            {/* Stats bar */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { label: "Quizzes", value: stats?.total_attempts ?? 0, icon: Brain },
                { label: "Score", value: stats?.total_score ?? 0, icon: Trophy },
                { label: "Accuracy", value: `${stats?.accuracy ?? 0}%`, icon: Zap },
              ].map((stat, i) => (
                <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                  <Card>
                    <CardContent className="flex flex-col items-center p-4">
                      <stat.icon className="h-5 w-5 text-dusty-rose-400 mb-1" />
                      <span className="text-lg font-bold text-gray-800 dark:text-gray-100">{stat.value}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</span>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Category cards */}
            <h2 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-3 uppercase tracking-wide">Choose a Topic</h2>
            <div className="space-y-3">
              {categories.map((cat: QuizCategory, i: number) => (
                <motion.div key={cat.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.05 }}>
                  <Card
                    className="cursor-pointer transition-all hover:shadow-md hover:scale-[1.01]"
                    onClick={() => startQuiz(cat.slug)}
                  >
                    <CardContent className="flex items-center justify-between p-4">
                      <div>
                        <h3 className="font-semibold text-gray-800 dark:text-gray-100">{cat.name}</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{cat.description}</p>
                      </div>
                      <span className="text-sm font-medium text-dusty-rose-500">{cat.quiz_count} Qs</span>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── Quiz View ── */}
        {view === "quiz" && q && (
          <motion.div key="quiz" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <button onClick={() => setView("categories")} className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 mb-4 hover:text-dusty-rose-500">
              <ArrowLeft className="h-4 w-4" /> {t("common.back")}
            </button>

            {/* Progress */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Question {currentIdx + 1} of {questions.length}
              </span>
              <span className="text-sm font-bold text-dusty-rose-500">{t("quiz.score")}: {score}</span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700 mb-6">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-dusty-rose-400 to-warm-peach-400"
                animate={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
                transition={{ type: "spring" }}
              />
            </div>

            {/* Question */}
            <Card className="mb-6">
              <CardContent className="p-5">
                <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-lavender-100 dark:bg-lavender-900/30 text-lavender-600 dark:text-lavender-300 mb-3">
                  {q.difficulty}
                </span>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{questionText}</h2>
              </CardContent>
            </Card>

            {/* Options */}
            <div className="space-y-3">
              {options.map((opt: string, idx: number) => {
                let borderColor = "border-gray-200 dark:border-gray-700";
                let bg = "";
                if (selected !== null && correctAnswer !== null) {
                  if (idx === correctAnswer) {
                    borderColor = "border-green-400";
                    bg = "bg-green-50 dark:bg-green-900/20";
                  } else if (idx === selected && idx !== correctAnswer) {
                    borderColor = "border-red-400";
                    bg = "bg-red-50 dark:bg-red-900/20";
                  }
                } else if (idx === selected) {
                  borderColor = "border-dusty-rose-400";
                }

                return (
                  <motion.button
                    key={idx}
                    onClick={() => handleSelect(idx)}
                    disabled={selected !== null}
                    className={`w-full text-left rounded-xl border-2 p-4 transition-all ${borderColor} ${bg} disabled:cursor-default`}
                    whileTap={selected === null ? { scale: 0.98 } : {}}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-300 dark:border-gray-600 text-sm font-medium text-gray-600 dark:text-gray-300">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{opt}</span>
                      </div>
                      {selected !== null && correctAnswer !== null && idx === correctAnswer && (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      )}
                      {selected !== null && correctAnswer !== null && idx === selected && idx !== correctAnswer && (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Next button */}
            {selected !== null && correctAnswer !== null && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
                <Button onClick={nextQuestion} className="w-full h-12 text-base font-semibold bg-gradient-to-r from-dusty-rose-400 to-warm-peach-400">
                  {currentIdx < questions.length - 1 ? `${t("quiz.next")} →` : `${t("quiz.results")} 🎉`}
                </Button>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* ── Results View ── */}
        {view === "result" && (
          <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-dusty-rose-400 to-warm-peach-400 shadow-lg">
              <Trophy className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">Quiz Complete! 🎉</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              You scored <span className="font-bold text-dusty-rose-500">{score}</span> points
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-green-500">{answered > 0 ? Math.round((score / (answered * 10)) * 100) : 0}%</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Accuracy</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-lavender-500">{answered}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Answered</p>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-3">
              <Button onClick={() => startQuiz(activeCategory!)} className="w-full h-12 bg-gradient-to-r from-dusty-rose-400 to-warm-peach-400">
                {t("quiz.tryAgain")} 🔄
              </Button>
              <Button variant="outline" onClick={() => setView("categories")} className="w-full h-12">
                Choose Another Topic
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
