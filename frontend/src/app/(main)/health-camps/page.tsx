"use client";

/**
 * Health Camps page — lists government and NGO health camps
 * fetched from the API with filters and rich UI.
 */

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Calendar, Building2, Search, Filter, ChevronDown, ChevronUp } from "lucide-react";
import { healthCampApi } from "@/lib/api";
import type { HealthCamp } from "@/types";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { useAuthStore } from "@/lib/stores";

export default function HealthCampsPage() {
  const { t } = useTranslation();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [stateFilter, setStateFilter] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data: campsData = [], isLoading } = useQuery<HealthCamp[]>({
    queryKey: ["healthCamps", stateFilter],
    queryFn: () => healthCampApi.list({ state: stateFilter || undefined, upcoming: true }),
    enabled: isAuthenticated,
  });
  const camps = Array.isArray(campsData) ? campsData : [];

  const states = [...new Set(camps.map((c) => c.state))].sort();

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const daysUntil = (dateStr: string) => {
    const diff = Math.ceil(
      (new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    if (diff === 0) return "Today";
    if (diff === 1) return "Tomorrow";
    if (diff < 0) return "Past";
    return `In ${diff} days`;
  };

  return (
    <div className="mx-auto max-w-lg px-4 py-6 pb-nav">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-1">
          {t("nav.healthCamps")} 🏥
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Upcoming government & NGO health camps near you
        </p>
      </motion.div>

      {/* Filter bar */}
      {states.length > 1 && (
        <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setStateFilter("")}
            className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              !stateFilter
                ? "bg-gradient-to-r from-dusty-rose-400 to-warm-peach-400 text-white shadow-sm"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            All States
          </button>
          {states.map((s) => (
            <button
              key={s}
              onClick={() => setStateFilter(s)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                stateFilter === s
                  ? "bg-gradient-to-r from-dusty-rose-400 to-warm-peach-400 text-white shadow-sm"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Loading skeleton */}
      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl border border-gray-200 dark:border-gray-700 p-4 animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && camps.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="text-5xl mb-4">🏕️</div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            No upcoming camps found.
          </p>
          <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
            Check back later for new health camp announcements.
          </p>
        </motion.div>
      )}

      {/* Camp list */}
      <div className="space-y-3">
        <AnimatePresence>
          {camps.map((camp, i) => {
            const isExpanded = expandedId === camp.id;
            const badge = daysUntil(camp.event_date);
            const isSoon = badge === "Today" || badge === "Tomorrow";

            return (
              <motion.div
                key={camp.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: i * 0.06 }}
              >
                <Card
                  className={`overflow-hidden transition-all cursor-pointer hover:shadow-md ${
                    isSoon ? "ring-2 ring-dusty-rose-300 dark:ring-dusty-rose-600" : ""
                  }`}
                  onClick={() => setExpandedId(isExpanded ? null : camp.id)}
                >
                  <CardContent className="p-4">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">
                          {camp.name}
                        </h3>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${
                              isSoon
                                ? "bg-dusty-rose-100 dark:bg-dusty-rose-900/50 text-dusty-rose-600 dark:text-dusty-rose-300"
                                : "bg-sage-100 dark:bg-sage-900/50 text-sage-600 dark:text-sage-300"
                            }`}
                          >
                            {badge}
                          </span>
                        </div>
                      </div>
                      <div className="shrink-0 text-gray-400 dark:text-gray-500">
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </div>
                    </div>

                    {/* Core info — always visible */}
                    <div className="mt-3 space-y-1.5">
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <MapPin className="h-3.5 w-3.5 shrink-0 text-dusty-rose-400" />
                        <span className="truncate">{camp.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <Calendar className="h-3.5 w-3.5 shrink-0 text-sage-400" />
                        <span>{formatDate(camp.event_date)}</span>
                      </div>
                    </div>

                    {/* Expanded details */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 space-y-2">
                            {camp.description && (
                              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                                {camp.description}
                              </p>
                            )}
                            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                              <Building2 className="h-3.5 w-3.5 shrink-0 text-lavender-400" />
                              <span>{camp.district}, {camp.state}</span>
                            </div>
                            {camp.organizer && (
                              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                <Building2 className="h-3.5 w-3.5 shrink-0 text-warm-peach-400" />
                                <span>{camp.organizer}</span>
                              </div>
                            )}
                            {camp.contact_phone && (
                              <a
                                href={`tel:${camp.contact_phone}`}
                                onClick={(e) => e.stopPropagation()}
                                className="flex items-center gap-2 text-xs text-dusty-rose-500 hover:text-dusty-rose-600 font-medium"
                              >
                                <Phone className="h-3.5 w-3.5 shrink-0" />
                                <span>{camp.contact_phone}</span>
                              </a>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
