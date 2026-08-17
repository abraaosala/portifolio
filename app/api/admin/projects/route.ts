import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdminAuth, unauthorized } from "@/lib/admin-auth";

export async function GET(request: Request) {
  if (!(await verifyAdminAuth(request))) return unauthorized();

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "10")));
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    prisma.project.findMany({
      orderBy: { order: "asc" },
      skip,
      take: limit,
    }),
    prisma.project.count(),
  ]);

  return NextResponse.json({
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  });
}

export async function POST(request: Request) {
  if (!(await verifyAdminAuth(request))) return unauthorized();

  try {
    const body = await request.json();
    const { title, description, imageUrl, liveUrl, githubUrl, tags, featured, order } = body;

    if (!title || !description) {
      return NextResponse.json(
        { error: "Título e descrição são obrigatórios" },
        { status: 400 }
      );
    }

    const project = await prisma.project.create({
      data: {
        title,
        description,
        imageUrl: imageUrl || null,
        liveUrl: liveUrl || null,
        githubUrl: githubUrl || null,
        tags: tags || "",
        featured: featured || false,
        order: order || 0,
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Erro ao criar projeto" },
      { status: 500 }
    );
  }
}
