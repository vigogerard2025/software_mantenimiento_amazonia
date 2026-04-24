"use client";

import { useState } from "react";
import { MaintenanceRecord } from "@/app/db/schema";

interface MaintenanceCardProps {
  maintenance: MaintenanceRecord;
  onEdit: (maintenance: MaintenanceRecord) => void;
  onDelete: (id: number) => void;
}

const tipoConfig = {
  Preventivo: {
    bg: "linear-gradient(135deg, #f0fdf4, #dcfce7)",
    border: "#86efac",
    color: "#15803d",
    icon: "🛡️",
    accent: "#16a34a",
  },
  Correctivo: {
    bg: "linear-gradient(135deg, #fff7ed, #ffedd5)",
    border: "#fdba74",
    color: "#c2410c",
    icon: "🔧",
    accent: "#ea580c",
  },
};

export function MaintenanceCard({
  maintenance,
  onEdit,
  onDelete,
}: MaintenanceCardProps) {
  const [showDesc, setShowDesc] = useState(false);

  const config =
    tipoConfig[maintenance.tipo as keyof typeof tipoConfig] ||
    tipoConfig.Correctivo;

  const fechaFormateada = maintenance.fecha
    ? new Date(maintenance.fecha + "T00:00:00").toLocaleDateString("es-PE", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : maintenance.fecha;

  return (
    <div
      style={{
        background: "linear-gradient(145deg, #ffffff, #f8fafc)",
        border: `1px solid ${config.border}`,
        borderRadius: "20px",
        overflow: "hidden",
        boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
        transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
        display: "flex",
        flexDirection: "column",
      }}
      className="hover:shadow-2xl hover:-translate-y-1"
    >
      {/* ACCENT BAR */}
      <div
        style={{
          height: "4px",
          background: `linear-gradient(90deg, ${config.accent}, ${config.accent}66)`,
        }}
      />

      {/* HEADER */}
      <div
        style={{
          padding: "18px 20px 14px",
          background: config.bg,
          borderBottom: "1px solid #f1f5f9",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              background: "white",
              border: `1px solid ${config.border}`,
              borderRadius: "100px",
              padding: "3px 10px",
              fontSize: "11px",
              fontWeight: 700,
              color: config.color,
              marginBottom: "8px",
            }}
          >
            {config.icon} {maintenance.tipo.toUpperCase()}
          </div>
          <h3
            style={{
              fontSize: "22px",
              fontWeight: 800,
              color: "#0f172a",
              letterSpacing: "-0.02em",
              lineHeight: 1,
            }}
          >
            {maintenance.vehiclePlaca}
          </h3>
        </div>

        <div
          style={{
            background: "white",
            borderRadius: "12px",
            padding: "8px 12px",
            textAlign: "right",
            border: "1px solid #f1f5f9",
            boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
          }}
        >
          <div
            style={{
              fontSize: "9px",
              fontWeight: 700,
              color: "#94a3b8",
              letterSpacing: "0.1em",
            }}
          >
            KM
          </div>
          <div
            style={{ fontSize: "16px", fontWeight: 800, color: config.accent }}
          >
            {maintenance.km.toLocaleString()}
          </div>
        </div>
      </div>

      {/* BODY */}
      <div style={{ padding: "16px 20px", flex: 1 }}>
        {/* GRID DE INFO */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "10px",
            marginBottom: "12px",
          }}
        >
          <InfoChip icon="📅" label="FECHA" value={fechaFormateada} />
          <InfoChip
            icon="👨‍🔧"
            label="MECÁNICO"
            value={maintenance.mecanico || "—"}
          />
          <InfoChip
            icon="📍"
            label="UBICACIÓN"
            value={maintenance.ubicacion}
            fullWidth
          />
        </div>

        {/* DESCRIPCIÓN */}
        {maintenance.descripcion && (
          <div>
            <button
              onClick={() => setShowDesc(!showDesc)}
              style={{
                width: "100%",
                padding: "8px 12px",
                background: showDesc ? "#eff6ff" : "#f8fafc",
                border: `1px solid ${showDesc ? "#bfdbfe" : "#e2e8f0"}`,
                borderRadius: "10px",
                fontSize: "12px",
                fontWeight: 600,
                color: showDesc ? "#1d4ed8" : "#64748b",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                transition: "all 0.2s",
              }}
            >
              <span>📝 Descripción</span>
              <span
                style={{
                  transition: "transform 0.2s",
                  transform: showDesc ? "rotate(180deg)" : "rotate(0deg)",
                }}
              >
                ▼
              </span>
            </button>

            {showDesc && (
              <div
                style={{
                  marginTop: "8px",
                  padding: "12px",
                  background: "#f8fafc",
                  borderRadius: "10px",
                  fontSize: "12px",
                  color: "#475569",
                  lineHeight: 1.6,
                  whiteSpace: "pre-line",
                  border: "1px solid #e2e8f0",
                }}
              >
                {maintenance.descripcion}
              </div>
            )}
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div
        style={{
          padding: "12px 20px 16px",
          display: "flex",
          gap: "8px",
          borderTop: "1px solid #f1f5f9",
        }}
      >
        <button
          onClick={() => onEdit(maintenance)}
          style={{
            flex: 1,
            padding: "9px",
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: "10px",
            fontSize: "13px",
            fontWeight: 600,
            color: "#475569",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          className="hover:bg-gray-100"
        >
          ✏️ Editar
        </button>
        <button
          onClick={() => onDelete(maintenance.id)}
          style={{
            flex: 1,
            padding: "9px",
            background: "#fff1f2",
            border: "1px solid #fecdd3",
            borderRadius: "10px",
            fontSize: "13px",
            fontWeight: 600,
            color: "#e11d48",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          className="hover:bg-red-100"
        >
          🗑️ Eliminar
        </button>
      </div>
    </div>
  );
}

function InfoChip({
  icon,
  label,
  value,
  fullWidth,
}: {
  icon: string;
  label: string;
  value: string;
  fullWidth?: boolean;
}) {
  return (
    <div
      style={{
        background: "#f8fafc",
        border: "1px solid #f1f5f9",
        borderRadius: "10px",
        padding: "8px 10px",
        gridColumn: fullWidth ? "1 / -1" : undefined,
      }}
    >
      <div
        style={{
          fontSize: "9px",
          fontWeight: 700,
          color: "#94a3b8",
          letterSpacing: "0.1em",
          marginBottom: "2px",
        }}
      >
        {icon} {label}
      </div>
      <div
        style={{
          fontSize: "12px",
          fontWeight: 600,
          color: "#1e293b",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {value}
      </div>
    </div>
  );
}
