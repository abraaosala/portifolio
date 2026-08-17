import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdminAuth, unauthorized } from "@/lib/admin-auth";

export async function GET(request: Request) {
  if (!(await verifyAdminAuth(request))) return unauthorized();

  const skills = await prisma.skill.findMany({
    orderBy: { level: "desc" },
  });
  return NextResponse.json(skills);
}

export async function POST(request: Request) {
  if (!(await verifyAdminAuth(request))) return unauthorized();

  try {
    const body = await request.json();
    const { name, level, icon } = body;

    if (!name || !level) {
      return NextResponse.json(
        { error: "Nome e nível são obrigatórios" },
        { status: 400 }
      );
    }

    const skill = await prisma.skill.create({
      data: {
        name,
        level: parseInt(level),
        icon: icon || null,
      },
    });

    return NextResponse.json(skill, { status: 201 });
  } catch (error) {
    console.error("Error creating skill:", error);
    return NextResponse.json(
      { error: "Erro ao criar skill" },
      { status: 500 }
    );
  }
}
