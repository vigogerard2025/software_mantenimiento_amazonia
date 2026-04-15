"use client";
import { useState } from "react";
import { VehicleList } from "@/app/components/VehicleList";
import { MaintenanceList } from "@/app/components/MaintenanceList";
import { Button } from "@/app/components/ui/button";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"vehicles" | "maintenances">(
    "vehicles",
  );

  return (
    <main className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">
        Gestión de Flota y Mantenimiento
      </h1>
      <div className="flex gap-2 mb-6 border-b">
        <Button
          variant={activeTab === "vehicles" ? "primary" : "secondary"}
          onClick={() => setActiveTab("vehicles")}
        >
          Vehículos
        </Button>
        <Button
          variant={activeTab === "maintenances" ? "primary" : "secondary"}
          onClick={() => setActiveTab("maintenances")}
        >
          Mantenimientos
        </Button>
      </div>
      {activeTab === "vehicles" && <VehicleList />}
      {activeTab === "maintenances" && <MaintenanceList />}
    </main>
  );
}
