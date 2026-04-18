"use server";
//vive en el servidor no en la computadora
//computadora especial que guarda informacion y la entrega cuando le piden
//Cuaderno donde anotas todo lo que le haces a tus buses
//Robot ayudante que guarda, busca, edita y borra esas anotaciones automáticamente.
import { revalidatePath } from "next/cache";

import { db } from "@/app/db";
//db base de datos -cuadernito
import { maintenanceRecords, type NewMaintenance } from "../db/schema";
//maintanceRecords -tabla donde guardas mantenimientos
import { eq, and, between, gte, lte, like } from "drizzle-orm";
//reglas para buscar
import { z } from "zod";
//el profe que revisa datos
const maintenanceSchema = z.object({
  //z.object() crea reglas
  vehiclePlaca: z.string().min(1, "Placa requerida"),
  fecha: z.string().min(1, "Fecha requerida"),
  ubicacion: z.string().min(1, "Ubicación requerida"),
  km: z.coerce.number().int().min(0, "KM no negativo"),
  tipo: z.string().min(1, "Tipo requerido"),
  mecanico: z.string().min(1, "Mecánico requerido"), // 👈 NUEVO
  descripcion: z.string().optional(),

  //.string Esto debe ser texto
  //.min Debe tener al menos 1 letra
  //.number esto debe ser un numero
  //.coerce.number() Si viene como texto, conviértelo a número
  //.int Debe ser número entero
  //.min(0)No puede ser negativo
  //.optional Esto puede venir… o no
});
//Revision estricta de datos  antes de guardarlos
export type MaintenanceFilters = {
  //Así deben verse los filtros
  //export Esto lo pueden usar otros archivos
  vehiclePlaca?: string;
  //quiero solo mantenimientos de este bus
  fromDate?: string;
  //Quiero ver desde esta fecha
  toDate?: string;
  //hasta esta fecha
  minKm?: number;
  //“Solo quiero ver mantenimientos entre estos kilómetros minimo
  maxKm?: number;
  //“Solo quiero ver mantenimientos entre estos kilómetros maximo
  tipo?: string;
  //Solo quiero ver este tipo de mantenimiento
  //? Esto es opcional
};
//lista de opciones para buscar
export async function getMaintenances(filters: MaintenanceFilters = {}) {
  const conditions = [];
  //crea una lista de reglas
  if (filters.vehiclePlaca) {
    conditions.push(eq(maintenanceRecords.vehiclePlaca, filters.vehiclePlaca));
    //ed igual a
    //conditions.push Va agregando reglas si existen
  }

  if (filters.fromDate && filters.toDate) {
    conditions.push(
      between(maintenanceRecords.fecha, filters.fromDate, filters.toDate),
      //between entre dos valores
    );
  } else {
    if (filters.fromDate) {
      conditions.push(gte(maintenanceRecords.fecha, filters.fromDate));
      //gte mayor o igual que
    }
    if (filters.toDate) {
      conditions.push(lte(maintenanceRecords.fecha, filters.toDate));
      //lte menor o igual que
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
    //and "y tambien"
    //si hay reglas → las usa ✅
    //si no hay reglas → muestra todo 😎
    .orderBy(maintenanceRecords.fecha);

  return result;
}
//Muestrame los mantenimientos que cumplan estas condiciones
export async function createMaintenance(formData: FormData) {
  //Llena este formulario y guarda Mantenimiento
  const raw = {
    vehiclePlaca: formData.get("vehiclePlaca"),
    fecha: formData.get("fecha"),
    ubicacion: formData.get("ubicacion"),
    km: formData.get("km"),
    tipo: formData.get("tipo"),
    mecanico: formData.get("mecanico"), // 👈 NUEVO
    descripcion: formData.get("descripcion"),
    //El robot lee:
    // placa 🚗
    // fecha 📅
    // ubicación 📍
    // km 🔢
    // tipo 🔧
    // descripción
  };

  const validated = maintenanceSchema.parse(raw);
  //Revision y validacion de que este todo bien
  const newData: NewMaintenance = {
    //Ordena todo bonito antes de guardar
    vehiclePlaca: validated.vehiclePlaca,
    fecha: validated.fecha,
    ubicacion: validated.ubicacion,
    km: validated.km,
    tipo: validated.tipo,
    mecanico: validated.mecanico, // 👈 NUEVO
    descripcion: validated.descripcion ?? "",
  };

  await db.insert(maintenanceRecords).values(newData);
  //Es como escribir en el cuaderno
  revalidatePath("/");
  //Actualizar página
  // es como decir Oye, vuelve a cargar todo
}

export async function updateMaintenance(id: number, formData: FormData) {
  //🗣️ “Corrige este mantenimiento”
  const raw = {
    vehiclePlaca: formData.get("vehiclePlaca"),
    fecha: formData.get("fecha"),
    ubicacion: formData.get("ubicacion"),
    km: formData.get("km"),
    tipo: formData.get("tipo"),
    mecanico: String(formData.get("mecanico") ?? ""),
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
      mecanico: validated.mecanico, // 👈 NUEVO
      descripcion: validated.descripcion ?? "",
    })
    //Cambia los datos viejos por los nuevos
    .where(eq(maintenanceRecords.id, id));
  //Busca el que tenga este ID”
  revalidatePath("/");
}

export async function deleteMaintenance(id: number) {
  //Borra este mantenimiento
  await db.delete(maintenanceRecords).where(eq(maintenanceRecords.id, id));
  revalidatePath("/");
}
// //Tu app funciona así:

// 🧑‍💻 usuario escribe
// 📦 se envía como FormData
// 🤖 servidor procesa
// 🧪 valida
// 💾 guarda
// 🔄 actualiza
// 👀 usuario ve cambios
