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
      name: "Abraao Xavier",
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
      { name: "PHP", level: 4 },
      { name: "PostgreSQL", level: 4 },
      { name: "SQLite", level: 4 },
      { name: "Docker", level: 3 },
      { name: "Git", level: 5 },
      { name: "Tailwind CSS", level: 5 },
      { name: "Prisma", level: 4 },
      { name: "Supabase", level: 4 },
      { name: "REST APIs", level: 5 },
      { name: "JWT Auth", level: 4 },
    ],
  });

  await prisma.project.createMany({
    data: [
      {
        title: "Portifolio Pessoal",
        description: "Site portfolio pessoal com Next.js 16, Prisma 7, Supabase PostgreSQL, tema light/dark e painel admin completo.",
        tags: "Next.js,TypeScript,Tailwind CSS,Prisma,Supabase",
        featured: true,
        order: 1,
        githubUrl: "https://github.com/abraaosala/portifolio",
      },
      {
        title: "LumiGo",
        description: "Sistema de Taxi por Aplicativo - API completa com autenticacao, gestao de motoristas e viagens em tempo real.",
        tags: "Node.js,TypeScript,PostgreSQL,WebSocket",
        featured: true,
        order: 2,
        githubUrl: "https://github.com/abraaosala/lumiGo",
      },
      {
        title: "Process - Sistema de Escola",
        description: "Sistema completo de gestao escolar com matriculas, notas, horarios e comunicacao entre professores e alunos.",
        tags: "Node.js,TypeScript,Database,CRUD",
        featured: true,
        order: 3,
        githubUrl: "https://github.com/abraaosala/process",
      },
      {
        title: "ERP Kuamanga",
        description: "Sistema web integrado para gestao de informacao na Kuamanga Consulting. Inclui modulos de vendas, stock e financeiro.",
        tags: "PHP,JavaScript,MySQL,ERP",
        featured: true,
        order: 4,
        githubUrl: "https://github.com/abraaosala/erp_kuamanga",
      },
      {
        title: "GTA Tech Frontend",
        description: "Frontend moderno para a GTA Tech com interface responsiva e integracao com API REST.",
        tags: "React,JavaScript,REST API,UI/UX",
        featured: false,
        order: 5,
        githubUrl: "https://github.com/abraaosala/gta-tech-frontend",
      },
      {
        title: "Tchiowa Framework",
        description: "Mini framework de autoria construido do zero com componentes customizados e sistema de rotas.",
        tags: "JavaScript,Framework,PHP,HTML/CSS",
        featured: false,
        order: 6,
        githubUrl: "https://github.com/abraaosala/tchiowa",
      },
      {
        title: "Is Kenda",
        description: "Site institucional para a Is Kenda com design moderno e sistema de gestao de conteudo.",
        tags: "HTML,CSS,JavaScript,UI/UX",
        featured: false,
        order: 7,
        githubUrl: "https://github.com/abraaosala/iskenda",
      },
      {
        title: "GTA API PHP",
        description: "API RESTful em PHP para alimentar o frontend do GTA Tech com autenticacao e gestao de dados.",
        tags: "PHP,REST API,MySQL,Authentication",
        featured: false,
        order: 8,
        githubUrl: "https://github.com/abraaosala/gta_api_php",
      },
      {
        title: "LLPhant PHP",
        description: "Micro framework PHP construido do zero com componentes Illuminate (Laravel) standalone. Sistema de chat com IA multi-provedor via Strategy + Factory Pattern.",
        tags: "PHP,Laravel,IA,Design Patterns",
        featured: true,
        order: 9,
        githubUrl: "https://github.com/abraaosala/llphant",
      },
      {
        title: "ACA - Gestao de Stock",
        description: "Sistema de gestao de stock com controle de entradas, saidas, relatorios e alertas de reposicao.",
        tags: "JavaScript,Database,CRUD,Relatorios",
        featured: false,
        order: 10,
        githubUrl: "https://github.com/abraaosala/aca",
      },
      {
        title: "Login Google",
        description: "Implementacao de autenticacao com Google OAuth 2.0 integrada com sistema de usuarios.",
        tags: "Node.js,OAuth,Google,Authentication",
        featured: false,
        order: 11,
        githubUrl: "https://github.com/abraaosala/login_google",
      },
      {
        title: "ICut - Encurtador de URL",
        description: "Sistema completo de encurtamento de URLs com API RESTful, estatisticas de acesso e painel de gestao.",
        tags: "Node.js,REST API,Database,Analytics",
        featured: true,
        order: 12,
        githubUrl: "https://github.com/abraaosala/icut",
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
