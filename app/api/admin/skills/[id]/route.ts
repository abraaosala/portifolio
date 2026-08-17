import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdminAuth, unauthorized } from "@/lib/admin-auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await verifyAdminAuth(request))) return unauthorized();

  const { id } = await params;
  const skill = await prisma.skill.findUnique({
    where: { id },
  });

  if (!skill) {
    return NextResponse.json({ error: "Skill não encontrada" }, { status: 404 });
  }

  return NextResponse.json(skill);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await verifyAdminAuth(request))) return unauthorized();

  try {
    const { id } = await params;
    const body = await request.json();
    const { name, level, icon } = body;

    const skill = await prisma.skill.update({
      where: { id },
      data: {
        name,
        level: parseInt(level),
        icon: icon || null,
      },
    });

    return NextResponse.json(skill);
  } catch (error) {
    console.error("Error updating skill:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar skill" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await verifyAdminAuth(request))) return unauthorized();

  try {
    const { id } = await params;
    await prisma.skill.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting skill:", error);
    return NextResponse.json(
      { error: "Erro ao deletar skill" },
      { status: 500 }
    );
  }
}
