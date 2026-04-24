export type EstadoMantenimiento =
  | "ok"
  | "proximo"
  | "urgente"
  | "sin_historial";

export interface EstadoDetalle {
  estado: EstadoMantenimiento;
  label: string;
  emoji: string;
  color: string;
  bgColor: string;
  borderColor: string;
  kmRestantes?: number;
  porcentaje: number; // 0-100 para barra de progreso
}

const INTERVALO_KM = 5000; // cada 5000 km toca preventivo

export function getEstadoMantenimiento(
  kmActual: number,
  ultimoPreventivoKm?: number,
): EstadoDetalle {
  if (!ultimoPreventivoKm) {
    return {
      estado: "sin_historial",
      label: "Sin historial",
      emoji: "⚪",
      color: "#6b7280",
      bgColor: "#f3f4f6",
      borderColor: "#d1d5db",
      porcentaje: 0,
    };
  }

  const kmRecorridos = kmActual - ultimoPreventivoKm;
  const porcentaje = Math.min(
    100,
    Math.round((kmRecorridos / INTERVALO_KM) * 100),
  );
  const kmRestantes = Math.max(0, INTERVALO_KM - kmRecorridos);

  if (kmRecorridos >= INTERVALO_KM) {
    return {
      estado: "urgente",
      label: "Mantenimiento vencido",
      emoji: "🔴",
      color: "#dc2626",
      bgColor: "#fef2f2",
      borderColor: "#fca5a5",
      kmRestantes: 0,
      porcentaje: 100,
    };
  }

  if (kmRecorridos >= INTERVALO_KM * 0.8) {
    // 80% del intervalo → Próximo
    return {
      estado: "proximo",
      label: `Próximo en ${kmRestantes.toLocaleString()} km`,
      emoji: "🟡",
      color: "#d97706",
      bgColor: "#fffbeb",
      borderColor: "#fcd34d",
      kmRestantes,
      porcentaje,
    };
  }

  return {
    estado: "ok",
    label: `OK — faltan ${kmRestantes.toLocaleString()} km`,
    emoji: "🟢",
    color: "#16a34a",
    bgColor: "#f0fdf4",
    borderColor: "#86efac",
    kmRestantes,
    porcentaje,
  };
}
