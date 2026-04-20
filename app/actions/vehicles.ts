"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/app/db";
import { vehicles, type NewVehicle } from "@/app/db/schema";
import { eq, like, or, and } from "drizzle-orm";
import { z } from "zod";

const vehicleSchema = z.object({
  padron: z.string().min(1, "Padrón requerido").max(50),

  // 🔥 VALIDACIÓN MEJORADA DE PLACA
  placa: z
    .string()
    .min(1, "Placa requerida")
    .max(20)
    .transform((val) => val.toUpperCase().trim())
    .refine(
      (val) => /^[A-Z0-9-]+$/.test(val),
      "Placa inválida (solo letras, números y guiones)",
    ),

  marca: z.string().min(1, "Marca requerida").max(100),
  modelo: z.string().min(1, "Modelo requerido").max(100),
  conductor: z.string().min(1, "Conductor requerido").max(150),
  leasingUrl: z.string().optional(),
});

export type VehicleFilters = {
  search?: string;
  placa?: string;
  marca?: string;
  conductor?: string;
};

export async function getVehicles(filters: VehicleFilters = {}) {
  const { search, placa, marca, conductor } = filters;

  const conditions = [];

  if (placa) {
    conditions.push(eq(vehicles.placa, placa.toUpperCase()));
  }

  if (marca) {
    conditions.push(eq(vehicles.marca, marca));
  }

  if (conductor) {
    conditions.push(eq(vehicles.conductor, conductor));
  }

  if (search) {
    conditions.push(
      or(
        like(vehicles.placa, `%${search}%`),
        like(vehicles.marca, `%${search}%`),
        like(vehicles.conductor, `%${search}%`),
      ),
    );
  }

  // 🔥 QUERY CORRECTA (SIN reasignación)
  const result = await db
    .select()
    .from(vehicles)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(vehicles.id);

  return result;
}

export async function createVehicle(formData: FormData) {
  const raw = {
    padron: formData.get("padron"),
    placa: formData.get("placa"),
    marca: formData.get("marca"),
    modelo: formData.get("modelo"),
    conductor: formData.get("conductor"),
    leasingUrl: formData.get("leasingUrl"),
  };

  const validated = vehicleSchema.parse(raw);

  const newVehicle: NewVehicle = {
    padron: validated.padron,
    placa: validated.placa,
    marca: validated.marca,
    modelo: validated.modelo,
    conductor: validated.conductor,
    leasingUrl: validated.leasingUrl || null,
  };

  await db.insert(vehicles).values(newVehicle);

  revalidatePath("/");
}

export async function updateVehicle(id: number, formData: FormData) {
  const raw = {
    padron: formData.get("padron"),
    placa: formData.get("placa"),
    marca: formData.get("marca"),
    modelo: formData.get("modelo"),
    conductor: formData.get("conductor"),
    leasingUrl: formData.get("leasingUrl"), // ✅ AGREGA ESTO
  };

  const validated = vehicleSchema.parse(raw);

  await db
    .update(vehicles)
    .set({
      padron: validated.padron,
      placa: validated.placa,
      marca: validated.marca,
      modelo: validated.modelo,
      conductor: validated.conductor,
      leasingUrl: validated.leasingUrl || null,
    })
    .where(eq(vehicles.id, id));

  revalidatePath("/");
}

export async function deleteVehicle(id: number) {
  await db.delete(vehicles).where(eq(vehicles.id, id));
  revalidatePath("/maintenances");
  revalidatePath("/vehicles");
}

export async function getVehicleByPlaca(placa: string) {
  const result = await db
    .select()
    .from(vehicles)
    .where(eq(vehicles.placa, placa.toUpperCase()))
    .limit(1);

  return result[0];
}
export async function getAllPlacas() {
  const result = await db.select({ placa: vehicles.placa }).from(vehicles);
  return result.map((v) => v.placa);
}
