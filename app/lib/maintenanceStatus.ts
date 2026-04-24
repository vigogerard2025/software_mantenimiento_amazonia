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
  if (!ultimoPreventivoKm && ultimoPreventivoKm !== 0) {
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

  // 🔥 Calcula el siguiente múltiplo de 5000
  const siguienteMantenimiento =
    Math.ceil(kmActual / INTERVALO_KM) * INTERVALO_KM;

  // 🔥 El mantenimiento anterior (bloque)
  const mantenimientoAnterior = siguienteMantenimiento - INTERVALO_KM;

  // 🔥 Cuánto has avanzado en este bloque
  const kmRecorridos = kmActual - mantenimientoAnterior;

  const porcentaje = Math.min(
    100,
    Math.round((kmRecorridos / INTERVALO_KM) * 100),
  );

  const kmRestantes = siguienteMantenimiento - kmActual;

  // 🔴 YA SE PASÓ DEL BLOQUE
  if (kmActual >= siguienteMantenimiento) {
    return {
      estado: "urgente",
      label: `Mantenimiento vencido (${siguienteMantenimiento.toLocaleString()} km)`,
      emoji: "🔴",
      color: "#dc2626",
      bgColor: "#fef2f2",
      borderColor: "#fca5a5",
      kmRestantes: 0,
      porcentaje: 100,
    };
  }

  // 🟡 CERCA (80%)
  if (porcentaje >= 80) {
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

  // 🟢 TODO OK
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
