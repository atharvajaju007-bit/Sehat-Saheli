import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppProviders } from "@/providers/AppProviders";

export const metadata: Metadata = {
  title: "Sehat Saheli — Your Health Companion",
  description:
    "AI-powered multilingual health companion for adolescent girls. Learn about menstrual health, nutrition, hygiene, and more in your language.",
  manifest: "/manifest.json",
  keywords: [
    "health",
    "adolescent girls",
    "menstrual health",
    "nutrition",
    "puberty",
    "AI chatbot",
    "health education",
    "India",
  ],
  authors: [{ name: "Sehat Saheli" }],
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/icon-512.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#D98C9B",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Sehat Saheli" />
      </head>
      <body className="min-h-screen bg-cream">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
