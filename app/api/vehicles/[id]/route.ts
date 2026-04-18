import { db } from "@/app/db";
import { vehicles } from "@/app/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params; // 👈 IMPORTANTE

  await db.delete(vehicles).where(eq(vehicles.id, Number(id)));

  return Response.json({ success: true });
}
