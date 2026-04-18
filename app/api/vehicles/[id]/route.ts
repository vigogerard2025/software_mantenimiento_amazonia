import { db } from "@/app/db";
import { vehicles } from "@/app/db/schema";
import { eq } from "drizzle-orm";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  const id = Number(params.id);

  await db.delete(vehicles).where(eq(vehicles.id, id));

  return Response.json({ success: true });
}
