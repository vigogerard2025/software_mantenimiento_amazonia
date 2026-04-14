"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/app/db";
import { maintenancePlan, vehicles, maintenanceTasks } from "@/app/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

// ✅ Schema de validación
const maintenanceSchema = z.object({
  vehicleId: z.coerce.number(),
  taskId: z.coerce.number(),
  kmInterval: z.coerce.number().int().min(0),
  status: z.coerce.boolean().optional(),
});

// 🔍 Obtener todo el plan de mantenimiento
export async function getMaintenancePlan() {
  return await db
    .select({
      id: maintenancePlan.id,
      vehicleId: maintenancePlan.vehicleId,
      taskId: maintenancePlan.taskId,
      vehicle: vehicles.model,
      task: maintenanceTasks.name,
      kmInterval: maintenancePlan.kmInterval,
      status: maintenancePlan.status,
    })
    .from(maintenancePlan)
    .leftJoin(vehicles, eq(maintenancePlan.vehicleId, vehicles.id))
    .leftJoin(
      maintenanceTasks,
      eq(maintenancePlan.taskId, maintenanceTasks.id),
    );
}

// ➕ Crear mantenimiento
export async function createMaintenance(formData: FormData) {
  const rawData = {
    vehicleId: formData.get("vehicleId"),
    taskId: formData.get("taskId"),
    kmInterval: formData.get("kmInterval"),
    status: formData.get("status"),
  };

  const validated = maintenanceSchema.parse(rawData);

  await db.insert(maintenancePlan).values({
    vehicleId: validated.vehicleId,
    taskId: validated.taskId,
    kmInterval: validated.kmInterval,
    status: validated.status ?? false,
  });

  revalidatePath("/");
}

// ✏️ Actualizar
export async function updateMaintenance(id: number, formData: FormData) {
  const rawData = {
    vehicleId: formData.get("vehicleId"),
    taskId: formData.get("taskId"),
    kmInterval: formData.get("kmInterval"),
    status: formData.get("status"),
  };

  const validated = maintenanceSchema.parse(rawData);

  await db
    .update(maintenancePlan)
    .set({
      vehicleId: validated.vehicleId,
      taskId: validated.taskId,
      kmInterval: validated.kmInterval,
      status: validated.status ?? false,
    })
    .where(eq(maintenancePlan.id, id));

  revalidatePath("/");
}

// ❌ Eliminar
export async function deleteMaintenance(id: number) {
  await db.delete(maintenancePlan).where(eq(maintenancePlan.id, id));
  revalidatePath("/");
}
