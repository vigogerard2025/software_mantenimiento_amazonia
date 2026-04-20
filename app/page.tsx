"use client";

import { useState, useEffect } from "react";
import { VehicleList } from "@/app/components/VehicleList";
import { MaintenanceList } from "@/app/components/MaintenanceList";
import { motion } from "framer-motion";
import { InstallButton } from "@/app/components/InstallButton";

export function SWRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then(() => console.log("SW registrado"))
        .catch((err) => console.log("SW error", err));
    }
  }, []);
  return null;
}

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"vehicles" | "maintenances">(
    "vehicles",
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-3 sm:p-6">
      {/* HEADER */}
      <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 mb-4 sm:mb-6 flex flex-row justify-between items-center gap-3">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-3xl font-bold text-gray-800 leading-tight">
            Gestión de Flota
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-0.5">
            Control de vehículos y mantenimientos
          </p>
        </div>

        <img
          className="h-auto object-contain flex-shrink-0"
          src="/amazonia_logo.jpg"
          alt="Logo Amazonia Tours"
          style={{ width: "clamp(80px, 20vw, 160px)" }}
        />
      </div>

      {/* TABS */}
      <div className="flex gap-2 sm:gap-3 mb-4 sm:mb-6">
        <button
          onClick={() => setActiveTab("vehicles")}
          className={`flex-1 sm:flex-none px-4 sm:px-5 py-2 rounded-full font-medium text-sm sm:text-base transition-all duration-300 ${
            activeTab === "vehicles"
              ? "bg-blue-600 text-white shadow-lg scale-105"
              : "bg-white text-gray-600 hover:bg-gray-100"
          }`}
        >
          🚗 Vehículos
        </button>

        <button
          onClick={() => setActiveTab("maintenances")}
          className={`flex-1 sm:flex-none px-4 sm:px-5 py-2 rounded-full font-medium text-sm sm:text-base transition-all duration-300 ${
            activeTab === "maintenances"
              ? "bg-green-600 text-white shadow-lg scale-105"
              : "bg-white text-gray-600 hover:bg-gray-100"
          }`}
        >
          🔧 Mantenimientos
        </button>
      </div>

      {/* CONTENIDO */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-2xl shadow-md p-3 sm:p-6"
      >
        {activeTab === "vehicles" && <VehicleList />}
        {activeTab === "maintenances" && <MaintenanceList />}
      </motion.div>

      <InstallButton />
      <SWRegister />
    </main>
  );
}
