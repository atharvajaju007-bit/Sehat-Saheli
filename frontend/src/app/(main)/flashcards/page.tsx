"use client";

/**
 * Flashcards page — browse decks, study cards with flip animation.
 */

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChevronLeft, ChevronRight, RotateCcw, Layers } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { flashcardApi } from "@/lib/api";
import { useUIStore, useToast } from "@/lib/stores";
import type { FlashcardDeck, FlashcardItem } from "@/types";

type View = "decks" | "study";

export default function FlashcardsPage() {
  const language = useUIStore((s) => s.language);
  const toast = useToast();
  const [view, setView] = useState<View>("decks");
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [cardIdx, setCardIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const { data: decks = [] } = useQuery({
    queryKey: ["flashcardDecks"],
    queryFn: flashcardApi.listDecks,
  });

  const { data: cards = [] } = useQuery({
    queryKey: ["flashcardCards", activeSlug],
    queryFn: () => flashcardApi.getDeckCards(activeSlug!),
    enabled: !!activeSlug,
  });

  const openDeck = async (slug: string) => {
    setActiveSlug(slug);
    setCardIdx(0);
    setFlipped(false);
    setView("study");
  };

  const nextCard = () => {
    if (cardIdx < cards.length - 1) {
      setFlipped(false);
      setTimeout(() => setCardIdx((i) => i + 1), 150);
    } else {
      toast.success("Deck complete! 🎉");
    }
  };

  const prevCard = () => {
    if (cardIdx > 0) {
      setFlipped(false);
      setTimeout(() => setCardIdx((i) => i - 1), 150);
    }
  };

  const card = cards[cardIdx];
  const front = card?.front?.[language] || card?.front?.en || "";
  const back = card?.back?.[language] || card?.back?.en || "";

  const gradients = [
    "from-dusty-rose-400 to-warm-peach-400",
    "from-lavender-400 to-dusty-rose-300",
    "from-sage-400 to-sage-500",
    "from-warm-peach-400 to-warm-peach-500",
  ];

  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      <AnimatePresence mode="wait">
        {/* ── Deck List ── */}
        {view === "decks" && (
          <motion.div key="decks" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-1">Flashcards 🃏</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Swipe through cards to learn key health facts</p>

            <div className="space-y-3">
              {decks.map((deck: FlashcardDeck, i: number) => (
                <motion.div
                  key={deck.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Card className="cursor-pointer transition-all hover:shadow-md hover:scale-[1.01]" onClick={() => openDeck(deck.slug)}>
                    <CardContent className="flex items-center gap-4 p-4">
                      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r ${gradients[i % gradients.length]} shadow-sm`}>
                        <Layers className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-800 dark:text-gray-100">{deck.name}</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{deck.description}</p>
                      </div>
                      <span className="text-sm font-medium text-dusty-rose-500">{deck.card_count} cards</span>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}

              {decks.length === 0 && (
                <p className="text-center text-sm text-gray-400 py-8">No flashcard decks available yet 🌸</p>
              )}
            </div>
          </motion.div>
        )}

        {/* ── Study View ── */}
        {view === "study" && card && (
          <motion.div key="study" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <button onClick={() => setView("decks")} className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 mb-4 hover:text-dusty-rose-500">
              <ArrowLeft className="h-4 w-4" /> Back to Decks
            </button>

            {/* Progress */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Card {cardIdx + 1} of {cards.length}
              </span>
              <span className="text-xs text-gray-400">Tap card to flip</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-gray-200 dark:bg-gray-700 mb-6">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-lavender-400 to-dusty-rose-400"
                animate={{ width: `${((cardIdx + 1) / cards.length) * 100}%` }}
              />
            </div>

            {/* Flip Card */}
            <div
              className="perspective-1000 cursor-pointer mb-6"
              onClick={() => setFlipped(!flipped)}
              style={{ perspective: "1000px" }}
            >
              <motion.div
                className="relative w-full"
                style={{ transformStyle: "preserve-3d" }}
                animate={{ rotateY: flipped ? 180 : 0 }}
                transition={{ duration: 0.5, type: "spring", stiffness: 200, damping: 20 }}
              >
                {/* Front */}
                <div
                  className="w-full min-h-[240px] rounded-2xl bg-gradient-to-br from-dusty-rose-50 to-lavender-50 dark:from-gray-800 dark:to-gray-750 border border-dusty-rose-100 dark:border-gray-700 p-6 flex flex-col items-center justify-center text-center shadow-md"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <span className="text-xs font-medium text-dusty-rose-400 mb-3 uppercase tracking-wide">Question</span>
                  <p className="text-lg font-semibold text-gray-800 dark:text-gray-100 leading-relaxed">{front}</p>
                </div>

                {/* Back */}
                <div
                  className="w-full min-h-[240px] rounded-2xl bg-gradient-to-br from-sage-50 to-warm-peach-50 dark:from-gray-800 dark:to-gray-750 border border-sage-200 dark:border-gray-700 p-6 flex flex-col items-center justify-center text-center shadow-md absolute top-0 left-0"
                  style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                >
                  <span className="text-xs font-medium text-sage-500 mb-3 uppercase tracking-wide">Answer</span>
                  <p className="text-base text-gray-700 dark:text-gray-200 leading-relaxed whitespace-pre-line">{back}</p>
                </div>
              </motion.div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between gap-3">
              <Button variant="outline" onClick={prevCard} disabled={cardIdx === 0} className="flex-1">
                <ChevronLeft className="h-4 w-4 mr-1" /> Previous
              </Button>
              <Button
                variant="outline"
                onClick={() => setFlipped(!flipped)}
                className="px-4"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button onClick={nextCard} disabled={cardIdx >= cards.length - 1} className="flex-1 bg-gradient-to-r from-dusty-rose-400 to-warm-peach-400">
                Next <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
