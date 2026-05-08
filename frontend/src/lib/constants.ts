/**
 * Application-wide constants.
 */

export const APP_NAME = "Sehat Saheli";
export const APP_DESCRIPTION = "AI-powered multilingual health companion for adolescent girls";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
export const API_V1_URL = `${API_BASE_URL}/api/v1`;

export const SUPPORTED_LANGUAGES = [
  { code: "en" as const, name: "English", nativeName: "English" },
  { code: "hi" as const, name: "Hindi", nativeName: "हिन्दी" },
  { code: "mr" as const, name: "Marathi", nativeName: "मराठी" },
  { code: "bn" as const, name: "Bengali", nativeName: "বাংলা" },
  { code: "ta" as const, name: "Tamil", nativeName: "தமிழ்" },
  { code: "te" as const, name: "Telugu", nativeName: "తెలుగు" },
  { code: "kn" as const, name: "Kannada", nativeName: "ಕನ್ನಡ" },
  { code: "gu" as const, name: "Gujarati", nativeName: "ગુજરાતી" },
] as const;

export const COLORS = {
  dustyRose: "#D98C9B",
  warmPeach: "#F6C7A1",
  lavenderMist: "#C8B6E2",
  sageGreen: "#A8C3A0",
  creamWhite: "#FFF8F1",
} as const;

export const NAV_ITEMS = [
  { href: "/chat", label: "Chat", icon: "MessageCircle" },
  { href: "/learn", label: "Learn", icon: "BookOpen" },
  { href: "/quiz", label: "Quiz", icon: "Brain" },
  { href: "/dashboard", label: "Health", icon: "Heart" },
  { href: "/profile", label: "Profile", icon: "User" },
] as const;
