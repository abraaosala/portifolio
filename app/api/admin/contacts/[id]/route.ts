import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdminAuth, unauthorized } from "@/lib/admin-auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await verifyAdminAuth(request))) return unauthorized();

  const { id } = await params;
  const contact = await prisma.contact.findUnique({
    where: { id: parseInt(id) },
  });

  if (!contact) {
    return NextResponse.json({ error: "Mensagem não encontrada" }, { status: 404 });
  }

  await prisma.contact.update({
    where: { id: parseInt(id) },
    data: { read: true },
  });

  return NextResponse.json(contact);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await verifyAdminAuth(request))) return unauthorized();

  try {
    const { id } = await params;
    await prisma.contact.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting contact:", error);
    return NextResponse.json(
      { error: "Erro ao deletar mensagem" },
      { status: 500 }
    );
  }
}
