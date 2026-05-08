"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Settings, LogOut, ChevronRight, Globe, Bell, Shield } from "lucide-react";
import { useAuthStore, useUIStore } from "@/lib/stores";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const language = useUIStore((s) => s.language);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const menuItems = [
    { icon: Globe, label: "Language", value: language.toUpperCase(), href: "#" },
    { icon: Bell, label: "Notifications", value: "On", href: "#" },
    { icon: Shield, label: "Privacy", value: "", href: "#" },
    { icon: Settings, label: "Settings", value: "", href: "#" },
  ];

  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        {/* Profile Header */}
        <Card className="mb-6 overflow-hidden border-0 bg-gradient-to-br from-lavender-400 to-dusty-rose-400 text-white shadow-lg">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
              <User className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold">{user?.name || "Guest"}</h2>
              <p className="text-sm opacity-80">{user?.phone || "Not logged in"}</p>
              {user?.age && <p className="text-xs opacity-60 mt-0.5">Age: {user.age}</p>}
            </div>
          </CardContent>
        </Card>

        {/* Menu Items */}
        <Card className="mb-6">
          <CardContent className="p-2">
            {menuItems.map((item) => (
              <button
                key={item.label}
                className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm transition-colors hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <item.icon className="h-4.5 w-4.5 text-gray-400" />
                  <span className="text-gray-700">{item.label}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-400">
                  {item.value && <span className="text-xs">{item.value}</span>}
                  <ChevronRight className="h-4 w-4" />
                </div>
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Logout */}
        <Button
          variant="outline"
          className="w-full border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </motion.div>
    </div>
  );
}
