"use client";

import { useEffect, useState } from "react";

export function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    await deferredPrompt.userChoice;

    setDeferredPrompt(null);
  };

  // 👇 si no está disponible, no mostrar nada
  if (!deferredPrompt) return null;

  return (
    <button
      onClick={handleInstall}
      className="fixed bottom-5 right-5 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl shadow-xl transition"
    >
      📲 Instalar App
    </button>
  );
}
