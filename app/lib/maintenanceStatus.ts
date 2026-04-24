export function getEstadoMantenimiento(
  kmActual: number,
  ultimoPreventivoKm?: number,
) {
  if (!ultimoPreventivoKm) return "⚪ Sin historial";

  const diff = kmActual - ultimoPreventivoKm;

  if (diff > 5000) return "🔴 Atrasado";
  if (diff > 4000) return "🟡 Próximo";
  return "🟢 OK";
}
