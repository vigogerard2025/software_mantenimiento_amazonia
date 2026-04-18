"use client";

import { useEffect } from "react";

export function InstallButton() {
  useEffect(() => {
    window.addEventListener("beforeinstallprompt", () => {
      console.log("🔥 PWA LISTA PARA INSTALAR");
    });
  }, []);

  return (
    <button className="fixed bottom-5 right-5 bg-red-600 text-white px-4 py-2 rounded-xl">
      BOTÓN TEST
    </button>
  );
}
