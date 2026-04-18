"use client";

import { useState } from "react";
import { VehicleList } from "@/app/components/VehicleList";
import { MaintenanceList } from "@/app/components/MaintenanceList";
import { motion } from "framer-motion";
import { InstallButton } from "@/app/components/InstallButton"; // 👈 IMPORTANTE
import { useEffect } from "react";

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
    <main className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6">
      {/* HEADER */}
      <div className="bg-white rounded-2xl shadow-md p-6 mb-6 flex flex-col md:flex-row justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Gestión de Flota</h1>
          <p className="text-gray-500 text-sm">
            Control de vehículos y mantenimientos
          </p>
        </div>

        <img
          className="h-auto object-contain mt-4 md:mt-0"
          src="/amazonia_logo.jpg"
          alt="Logo"
          style={{ width: "180px" }}
        />
      </div>

      {/* TABS */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setActiveTab("vehicles")}
          className={`px-5 py-2 rounded-full font-medium transition-all duration-300 ${
            activeTab === "vehicles"
              ? "bg-blue-600 text-white shadow-lg scale-105"
              : "bg-white text-gray-600 hover:bg-gray-100"
          }`}
        >
          🚗 Vehículos
        </button>

        <button
          onClick={() => setActiveTab("maintenances")}
          className={`px-5 py-2 rounded-full font-medium transition-all duration-300 ${
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
        className="bg-white rounded-2xl shadow-md p-6"
      >
        {activeTab === "vehicles" && <VehicleList />}
        {activeTab === "maintenances" && <MaintenanceList />}
      </motion.div>

      {/* 🔥 BOTÓN INSTALAR APP */}
      <InstallButton />
      <SWRegister />
    </main>
  );
}
