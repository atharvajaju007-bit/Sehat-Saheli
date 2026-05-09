"use client";

/**
 * Health Dashboard — cycle tracker, log periods, view analytics.
 */

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Calendar, Plus, Trash2, TrendingUp, Clock, Activity } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cycleApi } from "@/lib/api";
import { useToast, useAuthStore } from "@/lib/stores";
import type { CycleLog } from "@/types";
import { useTranslation } from "@/lib/i18n/useTranslation";

export default function DashboardPage() {
  const { t } = useTranslation();
  const toast = useToast();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ period_start: "", period_end: "", cycle_length: "", notes: "" });

  const { data: cyclesData = [] } = useQuery({
    queryKey: ["cycles"],
    queryFn: () => cycleApi.listCycles(),
    enabled: isAuthenticated,
  });
  const cycles = Array.isArray(cyclesData) ? cyclesData : [];

  const { data: analytics } = useQuery({
    queryKey: ["cycleAnalytics"],
    queryFn: cycleApi.analytics,
    enabled: isAuthenticated,
  });

  const { data: prediction } = useQuery({
    queryKey: ["cyclePrediction"],
    queryFn: cycleApi.predict,
    retry: false,
    enabled: isAuthenticated,
  });

  const logMutation = useMutation({
    mutationFn: cycleApi.logCycle,
    onSuccess: () => {
      toast.success("Period logged");
      setShowForm(false);
      setForm({ period_start: "", period_end: "", cycle_length: "", notes: "" });
      queryClient.invalidateQueries({ queryKey: ["cycles"] });
      queryClient.invalidateQueries({ queryKey: ["cycleAnalytics"] });
      queryClient.invalidateQueries({ queryKey: ["cyclePrediction"] });
    },
    onError: () => toast.error("Failed to log period"),
  });

  const deleteMutation = useMutation({
    mutationFn: cycleApi.deleteCycle,
    onSuccess: () => {
      toast.success("Entry deleted");
      queryClient.invalidateQueries({ queryKey: ["cycles"] });
      queryClient.invalidateQueries({ queryKey: ["cycleAnalytics"] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.period_start) return;
    logMutation.mutate({
      period_start: form.period_start,
      period_end: form.period_end || undefined,
      cycle_length: form.cycle_length ? parseInt(form.cycle_length) : undefined,
      notes: form.notes || undefined,
    });
  };

  const statCards = [
    { label: "Avg Cycle", value: analytics?.average_cycle_length ? `${analytics.average_cycle_length} days` : "—", icon: Clock, color: "text-dusty-rose-500" },
    { label: "Avg Period", value: analytics?.average_period_length ? `${analytics.average_period_length} days` : "—", icon: Activity, color: "text-lavender-500" },
    { label: "Total Logs", value: analytics?.total_logs ?? 0, icon: TrendingUp, color: "text-sage-500" },
  ];

  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-1">{t("dashboard.title")} ❤️</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{t("dashboard.subtitle")}</p>
      </motion.div>

      {/* Prediction card */}
      {prediction && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
          <Card className="mb-6 overflow-hidden border-0 bg-gradient-to-br from-dusty-rose-400 to-warm-peach-400 text-white shadow-lg">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-5 w-5" />
                <span className="text-sm font-semibold uppercase tracking-wide opacity-90">Next Period</span>
              </div>
              <p className="text-2xl font-bold mb-1">
                {new Date(prediction.predicted_start).toLocaleDateString("en-IN", { month: "long", day: "numeric" })}
              </p>
              <p className="text-sm opacity-80">
                Based on your last {prediction.based_on_entries} cycles (avg {prediction.average_cycle_length} days)
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {statCards.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.05 }}>
            <Card>
              <CardContent className="flex flex-col items-center p-3">
                <stat.icon className={`h-5 w-5 ${stat.color} mb-1`} />
                <span className="text-base font-bold text-gray-800 dark:text-gray-100">{stat.value}</span>
                <span className="text-[10px] text-gray-500 dark:text-gray-400">{stat.label}</span>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Log button */}
      <Button
        onClick={() => setShowForm(!showForm)}
        className="w-full mb-4 h-11 bg-gradient-to-r from-dusty-rose-400 to-warm-peach-400"
      >
        <Plus className="h-4 w-4 mr-1" /> {t("dashboard.logPeriod")}
      </Button>

      {/* Log form */}
      {showForm && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
          <Card className="mb-6">
            <CardContent className="p-4">
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <Label htmlFor="start">Start Date *</Label>
                  <Input id="start" type="date" value={form.period_start} onChange={(e) => setForm((f) => ({ ...f, period_start: e.target.value }))} required />
                </div>
                <div>
                  <Label htmlFor="end">End Date</Label>
                  <Input id="end" type="date" value={form.period_end} onChange={(e) => setForm((f) => ({ ...f, period_end: e.target.value }))} />
                </div>
                <div>
                  <Label htmlFor="length">Cycle Length (days)</Label>
                  <Input id="length" type="number" min={15} max={60} placeholder="e.g. 28" value={form.cycle_length} onChange={(e) => setForm((f) => ({ ...f, cycle_length: e.target.value }))} />
                </div>
                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Input id="notes" placeholder="How are you feeling?" value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} />
                </div>
                <Button type="submit" className="w-full" disabled={logMutation.isPending}>
                  {logMutation.isPending ? "Saving..." : "Save Entry"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Cycle history */}
      <h2 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-3 uppercase tracking-wide">{t("dashboard.history")}</h2>
      <div className="space-y-2">
        {cycles.length === 0 && (
          <p className="text-center text-sm text-gray-400 py-8">No entries yet. Log your first period above! 🌸</p>
        )}
        {cycles.map((log: CycleLog) => (
          <Card key={log.id}>
            <CardContent className="flex items-center justify-between p-3">
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                  {new Date(log.period_start).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                  {log.period_end && ` — ${new Date(log.period_end).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}`}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {log.cycle_length && `${log.cycle_length} day cycle`}
                  {log.notes && ` · ${log.notes}`}
                </p>
              </div>
              <button onClick={() => deleteMutation.mutate(log.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                <Trash2 className="h-4 w-4" />
              </button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
