import {
  pgTable,
  serial,
  varchar,
  integer,
  date,
  text,
  unique,
} from "drizzle-orm/pg-core";

// Tabla de vehículos
export const vehicles = pgTable("vehicles", {
  id: serial("id").primaryKey(),
  padron: varchar("padron", { length: 50 }).notNull(),
  placa: varchar("placa", { length: 20 }).notNull().unique(),
  marca: varchar("marca", { length: 100 }).notNull(),
  modelo: varchar("modelo", { length: 100 }).notNull(),
  conductor: varchar("conductor", { length: 150 }).notNull(),
});
// Tabla de mantenimientos
export const maintenanceRecords = pgTable("maintenance_records", {
  id: serial("id").primaryKey(),
  vehiclePlaca: varchar("vehicle_placa", { length: 20 })
    .notNull()
    .references(() => vehicles.placa, { onDelete: "cascade" }),
  fecha: date("fecha", { mode: "string" }).notNull(),
  ubicacion: varchar("ubicacion", { length: 255 }).notNull(),
  km: integer("km").notNull(),
  tipo: varchar("tipo", { length: 50 }).notNull(), // ej: "5K", "10K", "20K", "30K"
  mecanico: text("mecanico"),
  descripcion: text("descripcion"),
});

export type Vehicle = typeof vehicles.$inferSelect;
export type NewVehicle = typeof vehicles.$inferInsert;
export type MaintenanceRecord = typeof maintenanceRecords.$inferSelect;
export type NewMaintenance = typeof maintenanceRecords.$inferInsert;
