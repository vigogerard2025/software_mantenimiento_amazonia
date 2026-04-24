"use client";

import { useState, useEffect } from "react";
import { Vehicle } from "@/app/db/schema";
import { Button } from "./ui/button";
import { PdfModal } from "./PdfModal";
import { getUltimoPreventivo } from "@/app/actions/maintenances";
import {
  getEstadoMantenimiento,
  EstadoDetalle,
} from "@/app/lib/maintenanceStatus";

interface VehicleCardProps {
  vehicle: Vehicle;
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (id: number) => void;
}

const getVehicleImage = (marca: string, modelo: string) => {
  const m = marca?.toLowerCase() || "";
  const mod = modelo?.toLowerCase() || "";
  if (m.includes("hyundai")) return "/cars/ex8.png";
  if (mod.includes("sd400")) return "/cars/sd400.jpg";
  if (/sd40[1-7]/.test(mod)) return "/cars/sd401.jpg";
  if (m.includes("jac")) return "/cars/sd401.jpg";
  return "/cars/ex8.png";
};

export function VehicleCard({ vehicle, onEdit, onDelete }: VehicleCardProps) {
  const [showPdf, setShowPdf] = useState(false);
  const [estado, setEstado] = useState<EstadoDetalle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEstado() {
      const ultimo = await getUltimoPreventivo(vehicle.placa);
      const estadoCalc = getEstadoMantenimiento(
        vehicle.kmActual ?? 0,
        ultimo?.km,
      );
      setEstado(estadoCalc);
      setLoading(false);
    }
    loadEstado();
  }, [vehicle]);

  const pdfFilename = vehicle.leasingUrl
    ? vehicle.leasingUrl.split("/").pop() || "contrato-leasing.pdf"
    : "contrato-leasing.pdf";

  const marcaUpper = (vehicle.marca || "").toUpperCase();

  return (
    <>
      <div
        style={{
          background: "linear-gradient(145deg, #ffffff, #f8fafc)",
          border: estado
            ? `1px solid ${estado.borderColor}`
            : "1px solid #e2e8f0",
          borderRadius: "20px",
          overflow: "hidden",
          boxShadow: "0 4px 24px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)",
          transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
          display: "flex",
          flexDirection: "column",
        }}
        className="hover:shadow-2xl hover:-translate-y-1"
      >
        {/* TOP ACCENT BAR */}
        <div
          style={{
            height: "4px",
            background: estado
              ? `linear-gradient(90deg, ${estado.color}, ${estado.color}88)`
              : "linear-gradient(90deg, #94a3b8, #cbd5e1)",
          }}
        />

        {/* HEADER */}
        <div
          style={{
            padding: "20px 20px 16px",
            background: `linear-gradient(135deg, ${estado?.bgColor || "#f8fafc"}, white)`,
            borderBottom: "1px solid #f1f5f9",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "#94a3b8",
                  letterSpacing: "0.12em",
                  marginBottom: "4px",
                }}
              >
                {marcaUpper} · {vehicle.modelo}
              </div>
              <h3
                style={{
                  fontSize: "24px",
                  fontWeight: 800,
                  color: "#0f172a",
                  letterSpacing: "-0.02em",
                  lineHeight: 1,
                }}
              >
                {vehicle.placa}
              </h3>
              <div
                style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}
              >
                Padrón {vehicle.padron}
              </div>
            </div>

            {/* ESTADO BADGE */}
            {estado && !loading && (
              <div
                style={{
                  background: estado.bgColor,
                  border: `1px solid ${estado.borderColor}`,
                  borderRadius: "100px",
                  padding: "4px 10px",
                  fontSize: "11px",
                  fontWeight: 700,
                  color: estado.color,
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  whiteSpace: "nowrap",
                }}
              >
                {estado.emoji}{" "}
                {estado.estado === "urgente"
                  ? "VENCIDO"
                  : estado.estado === "proximo"
                    ? "PRÓXIMO"
                    : estado.estado === "ok"
                      ? "OK"
                      : "—"}
              </div>
            )}
          </div>

          {/* VEHICLE IMAGE */}
          <div
            style={{
              marginTop: "12px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <img
              src={getVehicleImage(vehicle.marca, vehicle.modelo)}
              alt="Vehículo"
              style={{ height: "56px", objectFit: "contain", opacity: 0.85 }}
            />
          </div>
        </div>

        {/* BODY */}
        <div style={{ padding: "16px 20px", flex: 1 }}>
          {/* CONDUCTOR */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "14px",
            }}
          >
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #dbeafe, #bfdbfe)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "14px",
                flexShrink: 0,
              }}
            >
              👤
            </div>
            <div>
              <div
                style={{
                  fontSize: "10px",
                  fontWeight: 600,
                  color: "#94a3b8",
                  letterSpacing: "0.08em",
                }}
              >
                CONDUCTOR
              </div>
              <div
                style={{ fontSize: "13px", fontWeight: 600, color: "#1e293b" }}
              >
                {vehicle.conductor}
              </div>
            </div>
          </div>

          {/* KM + BARRA DE PROGRESO */}
          <div
            style={{
              background: "#f8fafc",
              borderRadius: "14px",
              padding: "14px",
              border: "1px solid #f1f5f9",
              marginBottom: "12px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "10px",
                    fontWeight: 600,
                    color: "#94a3b8",
                    letterSpacing: "0.08em",
                  }}
                >
                  KM ACTUAL
                </div>
                <div
                  style={{
                    fontSize: "20px",
                    fontWeight: 800,
                    color: "#0f172a",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {(vehicle.kmActual ?? 0).toLocaleString()}
                  <span
                    style={{
                      fontSize: "11px",
                      color: "#94a3b8",
                      fontWeight: 500,
                      marginLeft: "3px",
                    }}
                  >
                    km
                  </span>
                </div>
              </div>

              {estado && estado.kmRestantes !== undefined && (
                <div style={{ textAlign: "right" }}>
                  <div
                    style={{
                      fontSize: "10px",
                      fontWeight: 600,
                      color: "#94a3b8",
                      letterSpacing: "0.08em",
                    }}
                  >
                    FALTAN
                  </div>
                  <div
                    style={{
                      fontSize: "18px",
                      fontWeight: 800,
                      color: estado.color,
                    }}
                  >
                    {estado.kmRestantes.toLocaleString()}
                    <span
                      style={{
                        fontSize: "11px",
                        color: "#94a3b8",
                        fontWeight: 500,
                        marginLeft: "2px",
                      }}
                    >
                      km
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* BARRA DE PROGRESO */}
            {estado && estado.estado !== "sin_historial" && (
              <div>
                <div
                  style={{
                    height: "8px",
                    background: "#e2e8f0",
                    borderRadius: "100px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${estado.porcentaje}%`,
                      background:
                        estado.estado === "urgente"
                          ? "linear-gradient(90deg, #ef4444, #dc2626)"
                          : estado.estado === "proximo"
                            ? "linear-gradient(90deg, #f59e0b, #d97706)"
                            : "linear-gradient(90deg, #22c55e, #16a34a)",
                      borderRadius: "100px",
                      transition: "width 1s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    }}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "5px",
                  }}
                >
                  <span style={{ fontSize: "10px", color: "#94a3b8" }}>
                    Último preventivo
                  </span>
                  <span
                    style={{
                      fontSize: "10px",
                      color: estado.color,
                      fontWeight: 600,
                    }}
                  >
                    {estado.porcentaje}% del intervalo
                  </span>
                </div>
              </div>
            )}

            {estado?.estado === "sin_historial" && (
              <div
                style={{
                  fontSize: "11px",
                  color: "#94a3b8",
                  textAlign: "center",
                  padding: "4px 0",
                }}
              >
                Sin mantenimiento preventivo registrado
              </div>
            )}
          </div>

          {/* PDF LEASING */}
          {vehicle.leasingUrl && (
            <div style={{ marginBottom: "4px" }}>
              <button
                onClick={() => setShowPdf(true)}
                style={{
                  width: "100%",
                  padding: "9px",
                  background: "linear-gradient(135deg, #f0fdf4, #dcfce7)",
                  border: "1px solid #86efac",
                  borderRadius: "10px",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#15803d",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  transition: "all 0.2s",
                }}
                className="hover:brightness-95"
              >
                📄 Ver documentacion de la unidad
              </button>
            </div>
          )}
        </div>

        {/* FOOTER ACTIONS */}
        <div
          style={{
            padding: "12px 20px 16px",
            display: "flex",
            gap: "8px",
            borderTop: "1px solid #f1f5f9",
          }}
        >
          <button
            onClick={() => onEdit(vehicle)}
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
            onClick={() => onDelete(vehicle.id)}
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

      {showPdf && vehicle.leasingUrl && (
        <PdfModal
          url={vehicle.leasingUrl}
          filename={pdfFilename}
          onClose={() => setShowPdf(false)}
        />
      )}
    </>
  );
}
