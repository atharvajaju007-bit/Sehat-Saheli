/**
 * Offline fallback page — shown when the user is offline and navigates to an uncached page.
 */

import { WifiOff } from "lucide-react";

export default function OfflinePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-6 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-warm-peach-300 to-dusty-rose-300 shadow-lg">
        <WifiOff className="h-10 w-10 text-white" />
      </div>
      <h1 className="mb-2 text-2xl font-bold text-gray-800">You&apos;re Offline</h1>
      <p className="max-w-xs text-sm text-gray-500 leading-relaxed">
        Don&apos;t worry! Your data is saved locally. When you&apos;re back online, everything will sync automatically. 🌸
      </p>
      <p className="mt-6 text-xs text-gray-400">
        You can still browse previously loaded content.
      </p>
    </div>
  );
}
