"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, Calendar } from "lucide-react";

const sampleCamps = [
  { name: "Aarogya Health Camp", location: "Pune, Maharashtra", date: "May 15, 2026", phone: "+91-9876543210" },
  { name: "National Anaemia Camp", location: "Nashik, Maharashtra", date: "May 20, 2026", phone: "+91-9876543211" },
  { name: "Women's Health Drive", location: "Kolhapur, Maharashtra", date: "June 1, 2026", phone: "+91-9876543212" },
];

export default function HealthCampsPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl font-bold text-gray-800 mb-1">Health Camps 🏥</h1>
        <p className="text-sm text-gray-500 mb-6">Nearby government health camp alerts</p>
      </motion.div>

      <div className="space-y-3">
        {sampleCamps.map((camp, i) => (
          <motion.div
            key={camp.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="hover:shadow-md transition-all">
              <CardContent className="p-4">
                <h3 className="text-sm font-semibold text-gray-800 mb-2">{camp.name}</h3>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <MapPin className="h-3.5 w-3.5 text-dusty-rose-400" />
                    <span>{camp.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Calendar className="h-3.5 w-3.5 text-sage-400" />
                    <span>{camp.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Phone className="h-3.5 w-3.5 text-lavender-400" />
                    <span>{camp.phone}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
