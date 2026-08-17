import { prisma } from "@/lib/prisma";
import Hero from "./components/Hero";
import About from "./components/About";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";

export const dynamic = "force-dynamic";

function SectionDivider() {
  return (
    <div className="relative h-24 pointer-events-none" style={{ backgroundColor: "var(--bg-primary)" }}>
      <div
        className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px mx-auto max-w-4xl"
        style={{
          background: "linear-gradient(90deg, transparent, var(--border), transparent)",
        }}
      />
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
        style={{ backgroundColor: "var(--accent)", opacity: 0.4 }}
      />
    </div>
  );
}

async function getData() {
  try {
    const [projects, skills] = await Promise.all([
      prisma.project.findMany({ orderBy: { order: "asc" } }),
      prisma.skill.findMany({ orderBy: { level: "desc" } }),
    ]);
    return { projects, skills };
  } catch {
    return { projects: [], skills: [] };
  }
}

export default async function Home() {
  const { projects, skills } = await getData();

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg-primary)", color: "var(--text-primary)" }}>
      <a
        href="#hero"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:text-white focus:rounded-lg"
        style={{ backgroundColor: "var(--accent)" }}
      >
        Pular para o conteudo
      </a>
      <Navigation />
      <main>
        <Hero />
        <SectionDivider />
        <About skills={skills} />
        <SectionDivider />
        <Projects projects={projects} />
        <SectionDivider />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
