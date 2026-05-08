"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Layers } from "lucide-react";

const decks = [
  { title: "Female Anatomy", count: 12, color: "from-dusty-rose-400 to-dusty-rose-500", emoji: "🫀" },
  { title: "Puberty Changes", count: 10, color: "from-lavender-400 to-lavender-500", emoji: "🌱" },
  { title: "Reproductive Health", count: 8, color: "from-sage-400 to-sage-500", emoji: "🌸" },
  { title: "Nutrition Essentials", count: 15, color: "from-warm-peach-400 to-warm-peach-500", emoji: "🥗" },
];

export default function FlashcardsPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl font-bold text-gray-800 mb-1">Flashcards 🃏</h1>
        <p className="text-sm text-gray-500 mb-6">Interactive cards for quick learning</p>
      </motion.div>

      <div className="grid grid-cols-2 gap-3">
        {decks.map((deck, i) => (
          <motion.div
            key={deck.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="cursor-pointer hover:shadow-md transition-all hover:scale-[1.02] overflow-hidden">
              <div className={`h-24 bg-gradient-to-br ${deck.color} flex items-center justify-center`}>
                <span className="text-4xl">{deck.emoji}</span>
              </div>
              <CardContent className="p-3">
                <h3 className="text-sm font-semibold text-gray-800">{deck.title}</h3>
                <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
                  <Layers className="h-3 w-3" />
                  <span>{deck.count} cards</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <p className="text-center text-sm text-gray-400 mt-8">
        Swipeable flashcard experience coming soon! 🌸
      </p>
    </div>
  );
}
