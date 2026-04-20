CREATE TABLE "maintenance_records" (
	"id" serial PRIMARY KEY NOT NULL,
	"vehicle_placa" varchar(20) NOT NULL,
	"fecha" date NOT NULL,
	"ubicacion" varchar(255) NOT NULL,
	"km" integer NOT NULL,
	"tipo" varchar(50) NOT NULL,
	"mecanico" text,
	"descripcion" text
);
--> statement-breakpoint
ALTER TABLE "maintenance_plan" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "maintenance_tasks" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "maintenance_plan" CASCADE;--> statement-breakpoint
DROP TABLE "maintenance_tasks" CASCADE;--> statement-breakpoint
ALTER TABLE "vehicles" ALTER COLUMN "padron" SET DATA TYPE varchar(50);--> statement-breakpoint
ALTER TABLE "vehicles" ALTER COLUMN "padron" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "vehicles" ADD COLUMN "placa" varchar(20) NOT NULL;--> statement-breakpoint
ALTER TABLE "vehicles" ADD COLUMN "marca" varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE "vehicles" ADD COLUMN "modelo" varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE "vehicles" ADD COLUMN "conductor" varchar(150) NOT NULL;--> statement-breakpoint
ALTER TABLE "vehicles" ADD COLUMN "leasing_url" text;--> statement-breakpoint
ALTER TABLE "maintenance_records" ADD CONSTRAINT "maintenance_records_vehicle_placa_vehicles_placa_fk" FOREIGN KEY ("vehicle_placa") REFERENCES "public"."vehicles"("placa") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vehicles" DROP COLUMN "plate";--> statement-breakpoint
ALTER TABLE "vehicles" DROP COLUMN "brand";--> statement-breakpoint
ALTER TABLE "vehicles" DROP COLUMN "model";--> statement-breakpoint
ALTER TABLE "vehicles" DROP COLUMN "driver";--> statement-breakpoint
ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_placa_unique" UNIQUE("placa");