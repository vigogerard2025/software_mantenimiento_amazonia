import { db } from "@/app/db";
import { maintenanceRecords } from "@/app/db/schema";
import { eq } from "drizzle-orm";

export async function DELETE(
  req: Request,
  context: { params: { id: string } },
) {
  const id = Number(context.params.id);

  if (isNaN(id)) {
    return Response.json({ error: "ID inválido" }, { status: 400 });
  }

  await db.delete(maintenanceRecords).where(eq(maintenanceRecords.id, id));

  return Response.json({ success: true });
}
