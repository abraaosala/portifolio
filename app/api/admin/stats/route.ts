import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdminAuth, unauthorized } from "@/lib/admin-auth";

export async function GET(request: Request) {
  if (!(await verifyAdminAuth(request))) return unauthorized();

  const [projects, skills, contacts, unreadContacts] = await Promise.all([
    prisma.project.count(),
    prisma.skill.count(),
    prisma.contact.count(),
    prisma.contact.count({ where: { read: false } }),
  ]);

  return NextResponse.json({
    projects,
    skills,
    contacts,
    unreadContacts,
  });
}
