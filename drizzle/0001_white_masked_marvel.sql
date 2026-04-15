CREATE TABLE "maintenance_plan" (
	"id" serial PRIMARY KEY NOT NULL,
	"vehicle_id" integer NOT NULL,
	"task_id" integer NOT NULL,
	"km_interval" integer NOT NULL,
	"status" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "maintenance_tasks" (
	"id" serial PRIMARY KEY NOT NULL,
	"category" varchar(100),
	"name" varchar(255) NOT NULL,
	"quantity" varchar(20),
	"unit" varchar(50),
	"vehicle_model" varchar(100)
);
--> statement-breakpoint
CREATE TABLE "vehicles" (
	"id" serial PRIMARY KEY NOT NULL,
	"padron" integer,
	"plate" varchar(20),
	"brand" varchar(100),
	"model" varchar(100) NOT NULL,
	"driver" varchar(200)
);
--> statement-breakpoint
DROP TABLE "products" CASCADE;