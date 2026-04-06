import { useEffect, useState } from "react";
import { WifiOff } from "lucide-react";

/**
 * OfflineBanner — shows a friendly message when the device has no network
 * connectivity. Uses the browser's navigator.onLine and the online/offline
 * events so it reacts instantly when the connection drops or recovers.
 */
export default function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-destructive text-destructive-foreground px-4 py-3 flex items-center justify-center gap-3 shadow-lg">
      <WifiOff className="w-5 h-5 flex-shrink-0" />
      <p className="text-sm font-medium">
        You're offline — check your connection and try again.
      </p>
    </div>
  );
}
