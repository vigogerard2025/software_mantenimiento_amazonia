import {
  pgTable,
  serial,
  varchar,
  integer,
  boolean,
} from "drizzle-orm/pg-core";

export const vehicles = pgTable("vehicles", {
  id: serial("id").primaryKey(),
  model: varchar("model", { length: 100 }).notNull(),
  brand: varchar("brand", { length: 100 }),
});

export const maintenanceTasks = pgTable("maintenance_tasks", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
});

export const maintenancePlan = pgTable("maintenance_plan", {
  id: serial("id").primaryKey(),
  vehicleId: integer("vehicle_id").notNull(),
  taskId: integer("task_id").notNull(),
  kmInterval: integer("km_interval").notNull(),
  status: boolean("status").default(false),
});
