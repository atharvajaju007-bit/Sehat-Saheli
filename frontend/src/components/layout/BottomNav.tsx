"use client";

/**
 * Bottom navigation bar — primary navigation for mobile-first design.
 * Shows on all authenticated pages.
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageCircle, BookOpen, Brain, Heart, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const navItems = [
  { href: "/chat", label: "Chat", icon: MessageCircle },
  { href: "/learn", label: "Learn", icon: BookOpen },
  { href: "/quiz", label: "Quiz", icon: Brain },
  { href: "/dashboard", label: "Health", icon: Heart },
  { href: "/profile", label: "Profile", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-dusty-rose-100 bg-white/95 backdrop-blur-md safe-area-bottom">
      <div className="mx-auto flex max-w-lg items-center justify-around px-2 py-1">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex flex-col items-center gap-0.5 px-3 py-2 text-xs font-medium transition-colors duration-200",
                isActive ? "text-dusty-rose-600" : "text-gray-400 hover:text-gray-600"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -top-1 left-1/2 h-1 w-8 -translate-x-1/2 rounded-full bg-gradient-to-r from-dusty-rose-400 to-warm-peach-400"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              <Icon className={cn("h-5 w-5", isActive && "scale-110")} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
