"use client";

import { useState } from "react";
import { VehicleList } from "@/app/components/VehicleList";
import { MaintenanceList } from "@/app/components/MaintenanceList";
import { motion, AnimatePresence } from "framer-motion";
import { InstallButton } from "@/app/components/InstallButton";
import { SWRegister } from "./components/SWRegister";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"vehicles" | "maintenances">(
    "vehicles",
  );

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #0f172a 0%, #1e293b 40%, #0f172a 100%)",
        padding: "0",
        fontFamily: "'Inter', sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* BACKGROUND ORBS */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: "none",
          zIndex: 0,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-20%",
            left: "-10%",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-20%",
            right: "-10%",
            width: "700px",
            height: "700px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "40%",
            right: "20%",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(16,185,129,0.04) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* GRID LINES */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
          linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
        `,
          backgroundSize: "60px 60px",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "20px 16px 40px",
        }}
      >
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "32px",
            padding: "20px 28px",
            background: "rgba(255,255,255,0.04)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "24px",
            boxShadow:
              "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.2em",
                color: "#10b981",
                textTransform: "uppercase",
                marginBottom: "6px",
              }}
            >
              ● Sistema de Gestión
            </div>
            <h1
              style={{
                fontSize: "clamp(22px, 4vw, 36px)",
                fontWeight: 900,
                color: "#f8fafc",
                letterSpacing: "-0.03em",
                lineHeight: 1,
                margin: 0,
              }}
            >
              Gestión de Flota
            </h1>
            <p
              style={{ color: "#64748b", fontSize: "13px", margin: "4px 0 0" }}
            >
              Control de vehículos y mantenimientos
            </p>
          </div>

          <img
            src="/amazonia_logo.jpg"
            alt="Amazonia Tours"
            style={{
              height: "clamp(44px, 8vw, 64px)",
              objectFit: "contain",
              borderRadius: "12px",
              opacity: 0.9,
            }}
          />
        </motion.div>

        {/* TABS */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          style={{
            display: "flex",
            gap: "8px",
            marginBottom: "24px",
            background: "rgba(255,255,255,0.04)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "18px",
            padding: "6px",
            width: "fit-content",
          }}
        >
          <TabButton
            active={activeTab === "vehicles"}
            onClick={() => setActiveTab("vehicles")}
            icon="🚗"
            label="Vehículos"
            activeColor="#3b82f6"
          />
          <TabButton
            active={activeTab === "maintenances"}
            onClick={() => setActiveTab("maintenances")}
            icon="🔧"
            label="Mantenimientos"
            activeColor="#10b981"
          />
        </motion.div>

        {/* CONTENT */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 16, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.99 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            style={{
              background: "rgba(255,255,255,0.96)",
              backdropFilter: "blur(20px)",
              borderRadius: "24px",
              padding: "24px",
              boxShadow:
                "0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            {activeTab === "vehicles" && <VehicleList />}
            {activeTab === "maintenances" && <MaintenanceList />}
          </motion.div>
        </AnimatePresence>
      </div>

      <InstallButton />
      <SWRegister />
    </main>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label,
  activeColor,
}: {
  active: boolean;
  onClick: () => void;
  icon: string;
  label: string;
  activeColor: string;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "10px 20px",
        borderRadius: "12px",
        border: "none",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: 700,
        transition: "all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
        display: "flex",
        alignItems: "center",
        gap: "7px",
        background: active ? activeColor : "transparent",
        color: active ? "white" : "#64748b",
        boxShadow: active ? `0 4px 16px ${activeColor}44` : "none",
        transform: active ? "scale(1.02)" : "scale(1)",
      }}
    >
      <span>{icon}</span>
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
