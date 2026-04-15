"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/app/db";
import { maintenanceRecords, type NewMaintenance } from "../db/schema";
import { eq, and, between, gte, lte, like } from "drizzle-orm";
import { z } from "zod";

const maintenanceSchema = z.object({
  vehiclePlaca: z.string().min(1, "Placa requerida"),
  fecha: z.string().min(1, "Fecha requerida"),
  ubicacion: z.string().min(1, "Ubicación requerida"),
  km: z.coerce.number().int().min(0, "KM no negativo"),
  tipo: z.string().min(1, "Tipo requerido"),
  descripcion: z.string().optional(),
});

export type MaintenanceFilters = {
  vehiclePlaca?: string;
  fromDate?: string;
  toDate?: string;
  minKm?: number;
  maxKm?: number;
  tipo?: string;
};

export async function getMaintenances(filters: MaintenanceFilters = {}) {
  const conditions = [];

  if (filters.vehiclePlaca) {
    conditions.push(eq(maintenanceRecords.vehiclePlaca, filters.vehiclePlaca));
  }

  if (filters.fromDate && filters.toDate) {
    conditions.push(
      between(maintenanceRecords.fecha, filters.fromDate, filters.toDate),
    );
  } else {
    if (filters.fromDate) {
      conditions.push(gte(maintenanceRecords.fecha, filters.fromDate));
    }
    if (filters.toDate) {
      conditions.push(lte(maintenanceRecords.fecha, filters.toDate));
    }
  }

  if (filters.minKm !== undefined) {
    conditions.push(gte(maintenanceRecords.km, filters.minKm));
  }

  if (filters.maxKm !== undefined) {
    conditions.push(lte(maintenanceRecords.km, filters.maxKm));
  }

  if (filters.tipo) {
    conditions.push(eq(maintenanceRecords.tipo, filters.tipo));
  }

  // 🔥 QUERY LIMPIA (SIN reasignación)
  const result = await db
    .select()
    .from(maintenanceRecords)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(maintenanceRecords.fecha);

  return result;
}

export async function createMaintenance(formData: FormData) {
  const raw = {
    vehiclePlaca: formData.get("vehiclePlaca"),
    fecha: formData.get("fecha"),
    ubicacion: formData.get("ubicacion"),
    km: formData.get("km"),
    tipo: formData.get("tipo"),
    descripcion: formData.get("descripcion"),
  };

  const validated = maintenanceSchema.parse(raw);

  const newData: NewMaintenance = {
    vehiclePlaca: validated.vehiclePlaca,
    fecha: validated.fecha,
    ubicacion: validated.ubicacion,
    km: validated.km,
    tipo: validated.tipo,
    descripcion: validated.descripcion ?? "",
  };

  await db.insert(maintenanceRecords).values(newData);

  revalidatePath("/");
}

export async function updateMaintenance(id: number, formData: FormData) {
  const raw = {
    vehiclePlaca: formData.get("vehiclePlaca"),
    fecha: formData.get("fecha"),
    ubicacion: formData.get("ubicacion"),
    km: formData.get("km"),
    tipo: formData.get("tipo"),
    descripcion: formData.get("descripcion"),
  };

  const validated = maintenanceSchema.parse(raw);

  await db
    .update(maintenanceRecords)
    .set({
      vehiclePlaca: validated.vehiclePlaca,
      fecha: validated.fecha,
      ubicacion: validated.ubicacion,
      km: validated.km,
      tipo: validated.tipo,
      descripcion: validated.descripcion ?? "",
    })
    .where(eq(maintenanceRecords.id, id));

  revalidatePath("/");
}

export async function deleteMaintenance(id: number) {
  await db.delete(maintenanceRecords).where(eq(maintenanceRecords.id, id));
  revalidatePath("/");
}
