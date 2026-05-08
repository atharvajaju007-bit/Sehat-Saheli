"use client";

import { motion } from "framer-motion";
import { BookOpen, Droplets, Heart, Salad, Sparkles, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const categories = [
  { icon: Droplets, title: "Menstrual Health", description: "Understanding your cycle", color: "from-dusty-rose-400 to-dusty-rose-500", count: 5 },
  { icon: Heart, title: "Reproductive System", description: "Learn about your body", color: "from-lavender-400 to-lavender-500", count: 4 },
  { icon: ShieldCheck, title: "Anaemia Awareness", description: "Symptoms & prevention", color: "from-sage-400 to-sage-500", count: 3 },
  { icon: Sparkles, title: "Hygiene", description: "Personal care practices", color: "from-warm-peach-400 to-warm-peach-500", count: 4 },
  { icon: Salad, title: "Nutrition", description: "Healthy eating habits", color: "from-sage-400 to-sage-600", count: 5 },
  { icon: BookOpen, title: "Puberty", description: "Growing up changes", color: "from-lavender-400 to-dusty-rose-400", count: 4 },
];

export default function LearnPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-xl font-bold text-gray-800 mb-1">Learn 📚</h1>
        <p className="text-sm text-gray-500 mb-6">Explore health topics through visual content</p>
      </motion.div>

      <div className="space-y-3">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.title}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
          >
            <Card className="cursor-pointer hover:shadow-md transition-all hover:scale-[1.01]">
              <CardContent className="flex items-center gap-4 p-4">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r ${cat.color} shadow-sm`}>
                  <cat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-800">{cat.title}</h3>
                  <p className="text-xs text-gray-500">{cat.description}</p>
                </div>
                <span className="text-xs font-medium text-gray-400 bg-gray-100 rounded-full px-2.5 py-1">
                  {cat.count} lessons
                </span>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
