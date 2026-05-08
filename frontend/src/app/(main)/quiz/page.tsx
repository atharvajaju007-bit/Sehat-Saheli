"use client";

import { motion } from "framer-motion";
import { Brain, Trophy, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function QuizPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl font-bold text-gray-800 mb-1">Quiz Time! 🧠</h1>
        <p className="text-sm text-gray-500 mb-6">Test your health knowledge and earn points</p>
      </motion.div>

      {/* Daily Quiz Card */}
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
        <Card className="mb-6 overflow-hidden border-0 bg-gradient-to-br from-lavender-400 to-dusty-rose-400 text-white shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="h-5 w-5" />
              <span className="text-sm font-semibold uppercase tracking-wide opacity-90">Daily Challenge</span>
            </div>
            <h2 className="text-lg font-bold mb-2">Today&apos;s Health Quiz</h2>
            <p className="text-sm opacity-80 mb-4">5 questions • Earn up to 50 points</p>
            <Button className="bg-white text-dusty-rose-600 hover:bg-white/90 shadow-md">
              Start Quiz 🚀
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: "Quizzes", value: "0", icon: Brain },
          { label: "Streak", value: "0 days", icon: Zap },
          { label: "Points", value: "0", icon: Trophy },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.1 }}
          >
            <Card>
              <CardContent className="flex flex-col items-center p-4">
                <stat.icon className="h-5 w-5 text-dusty-rose-400 mb-1" />
                <span className="text-lg font-bold text-gray-800">{stat.value}</span>
                <span className="text-xs text-gray-500">{stat.label}</span>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <p className="text-center text-sm text-gray-400 mt-8">
        More quizzes coming in the next update! 🌸
      </p>
    </div>
  );
}
