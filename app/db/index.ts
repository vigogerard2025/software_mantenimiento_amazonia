import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// La variable de entorno DATABASE_URL se define en .env.local
const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });
