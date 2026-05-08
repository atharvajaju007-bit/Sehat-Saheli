"use client";

/**
 * Landing / Onboarding page — first page users see.
 * Beautiful hero with animated elements and CTA buttons.
 */

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Heart, BookOpen, MessageCircle, Shield } from "lucide-react";
import { useAuthStore } from "@/lib/stores";

const features = [
  {
    icon: MessageCircle,
    title: "AI Health Companion",
    description: "Chat with Saheli about health topics in your language",
    color: "from-dusty-rose-400 to-warm-peach-400",
  },
  {
    icon: BookOpen,
    title: "Visual Learning",
    description: "Interactive lessons on health, hygiene, and nutrition",
    color: "from-lavender-400 to-dusty-rose-300",
  },
  {
    icon: Heart,
    title: "Health Tracker",
    description: "Track your cycle, symptoms, and get predictions",
    color: "from-sage-400 to-sage-500",
  },
  {
    icon: Shield,
    title: "Safe & Private",
    description: "Your data is secure and your privacy is our priority",
    color: "from-warm-peach-400 to-warm-peach-500",
  },
];

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export default function LandingPage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/chat");
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Decorative Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-dusty-rose-200/30 blur-3xl" />
        <div className="absolute -left-20 top-1/3 h-60 w-60 rounded-full bg-lavender-200/30 blur-3xl" />
        <div className="absolute bottom-20 right-10 h-40 w-40 rounded-full bg-warm-peach-200/30 blur-3xl" />
        <div className="absolute -bottom-10 left-1/4 h-52 w-52 rounded-full bg-sage-200/20 blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative mx-auto max-w-lg px-6 py-12">
        {/* Hero Section */}
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.div
            className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-dusty-rose-400 to-warm-peach-400 shadow-lg shadow-dusty-rose-200"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="text-5xl">🌸</span>
          </motion.div>

          <h1 className="mb-3 text-4xl font-bold">
            <span className="bg-gradient-to-r from-dusty-rose-500 via-lavender-500 to-sage-500 bg-clip-text text-transparent">
              Sehat Saheli
            </span>
          </h1>
          <p className="text-lg text-gray-500 font-medium">
            Your Health Companion 💜
          </p>
          <p className="mt-3 text-sm text-gray-400 leading-relaxed max-w-xs mx-auto">
            Learn about your body with a friendly AI assistant that speaks your language.
            Safe, private, and always here for you.
          </p>
        </motion.div>

        {/* Feature Cards */}
        <div className="mb-10 grid grid-cols-2 gap-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
              className="group rounded-2xl border border-white/60 bg-white/70 p-4 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.02]"
            >
              <div
                className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r ${feature.color} shadow-sm`}
              >
                <feature.icon className="h-5 w-5 text-white" />
              </div>
              <h3 className="mb-1 text-sm font-semibold text-gray-800">{feature.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA Buttons */}
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <Link href="/register" className="block">
            <Button className="w-full h-13 text-base font-semibold bg-gradient-to-r from-dusty-rose-400 to-warm-peach-400 shadow-lg shadow-dusty-rose-200/50 hover:shadow-xl transition-all">
              Get Started 🌺
            </Button>
          </Link>
          <Link href="/login" className="block">
            <Button variant="outline" className="w-full h-12 text-base">
              I already have an account
            </Button>
          </Link>
        </motion.div>

        {/* Language Support Badge */}
        <motion.p
          className="mt-8 text-center text-xs text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          Available in: English • हिन्दी • মাংলা • தமிழ் • తెలుగు • ಕನ್ನಡ • मराठी • ગુજરાતી
        </motion.p>
      </div>
    </div>
  );
}
