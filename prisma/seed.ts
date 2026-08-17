import "dotenv/config";
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

async function main() {
  const adapter = new PrismaPg({
    connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL!,
  });
  const prisma = new PrismaClient({ adapter });

  await prisma.contact.deleteMany();
  await prisma.project.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash("admin123", 10);
  await prisma.user.create({
    data: {
      email: "admin@abraao.dev",
      password: hashedPassword,
      name: "Admin",
    },
  });

  await prisma.skill.createMany({
    data: [
      { name: "JavaScript", level: 5 },
      { name: "TypeScript", level: 5 },
      { name: "React", level: 5 },
      { name: "Next.js", level: 5 },
      { name: "Node.js", level: 5 },
      { name: "Python", level: 4 },
      { name: "PostgreSQL", level: 4 },
      { name: "SQLite", level: 4 },
      { name: "Docker", level: 3 },
      { name: "Git", level: 5 },
      { name: "Tailwind CSS", level: 5 },
      { name: "Prisma", level: 4 },
    ],
  });

  await prisma.project.createMany({
    data: [
      {
        title: "Portfolio Pessoal",
        description: "Site portfólio pessoal com Next.js, Prisma e Supabase",
        tags: "Next.js,TypeScript,Tailwind CSS,Prisma",
        featured: true,
        order: 1,
      },
      {
        title: "E-commerce API",
        description: "API RESTful para loja virtual com autenticação JWT",
        tags: "Node.js,Express,PostgreSQL,JWT",
        featured: true,
        order: 2,
      },
      {
        title: "Chat em Tempo Real",
        description: "Aplicação de chat com WebSocket e React",
        tags: "React,Socket.io,Node.js,MongoDB",
        featured: true,
        order: 3,
      },
    ],
  });

  console.log("Seed data created!");
  console.log("Admin login: admin@abraao.dev / admin123");
  await prisma.$disconnect();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
