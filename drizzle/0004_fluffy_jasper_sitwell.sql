ALTER TABLE "maintenance_records" RENAME COLUMN "vehicle_placa" TO "placa";--> statement-breakpoint
ALTER TABLE "maintenance_records" DROP CONSTRAINT "maintenance_records_vehicle_placa_vehicles_placa_fk";
--> statement-breakpoint
ALTER TABLE "maintenance_records" ADD CONSTRAINT "maintenance_records_placa_vehicles_placa_fk" FOREIGN KEY ("placa") REFERENCES "public"."vehicles"("placa") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "maintenance_records" ADD CONSTRAINT "maintenance_records_placa_unique" UNIQUE("placa");