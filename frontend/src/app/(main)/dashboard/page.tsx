"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, Activity, TrendingUp, Bell, Plus } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl font-bold text-gray-800 mb-1">Health Dashboard ❤️</h1>
        <p className="text-sm text-gray-500 mb-6">Track and understand your health journey</p>
      </motion.div>

      {/* Cycle Status Card */}
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
        <Card className="mb-4 overflow-hidden border-0 bg-gradient-to-br from-dusty-rose-400 via-dusty-rose-500 to-warm-peach-400 text-white shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm opacity-80 mb-1">Cycle Tracker</p>
                <h2 className="text-2xl font-bold">Start Tracking</h2>
              </div>
              <CalendarDays className="h-10 w-10 opacity-40" />
            </div>
            <Button className="bg-white text-dusty-rose-600 hover:bg-white/90 shadow-md">
              <Plus className="h-4 w-4 mr-1" />
              Log Period
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {[
          { title: "Symptoms", icon: Activity, desc: "Log today's symptoms", color: "text-lavender-500" },
          { title: "Predictions", icon: TrendingUp, desc: "View cycle predictions", color: "text-sage-500" },
          { title: "History", icon: CalendarDays, desc: "Past cycle records", color: "text-warm-peach-500" },
          { title: "Reminders", icon: Bell, desc: "Set health alerts", color: "text-dusty-rose-500" },
        ].map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.1 }}
          >
            <Card className="cursor-pointer hover:shadow-md transition-all">
              <CardContent className="p-4">
                <item.icon className={`h-6 w-6 ${item.color} mb-2`} />
                <h3 className="text-sm font-semibold text-gray-800">{item.title}</h3>
                <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <p className="text-center text-sm text-gray-400 mt-6">
        Analytics & charts coming in the next update! 📊
      </p>
    </div>
  );
}
