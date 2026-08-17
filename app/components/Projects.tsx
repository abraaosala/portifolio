"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface Project {
  id: string;
  title: string;
  description: string;
  tags: string;
  liveUrl: string | null;
  githubUrl: string | null;
  featured: boolean;
}

const accents = ["#3b82f6", "#8b5cf6", "#f59e0b", "#10b981", "#ef4444"];

export default function Projects({ projects }: { projects: Project[] }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="projetos" className="min-h-screen py-24 px-6 relative">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(180deg, var(--bg-primary) 0%, var(--bg-secondary) 50%, var(--bg-primary) 100%)",
        }}
      />

      <div ref={ref} className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="section-label mb-4">Portfolio</p>
          <h2 className="section-title mb-4">
            Meus <span style={{ color: "var(--accent)" }}>Projetos</span>
          </h2>
          <div className="section-divider mx-auto mb-6" />
          <p className="max-w-2xl mx-auto leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            Alguns dos projetos que desenvolvi, demonstrando minhas habilidades
            em desenvolvimento full stack.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => {
            const accent = accents[index % accents.length];
            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <div className="card overflow-hidden h-full flex flex-col">
                  <div
                    className="h-40 relative overflow-hidden"
                    style={{
                      background: `linear-gradient(135deg, ${accent}15, ${accent}05)`,
                    }}
                  >
                    <div
                      className="absolute inset-0 opacity-[0.03]"
                      style={{
                        backgroundImage: "radial-gradient(circle at 1px 1px, currentColor 0.5px, transparent 0)",
                        backgroundSize: "20px 20px",
                        color: accent,
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div
                        className="text-5xl font-bold transition-all duration-500 group-hover:scale-110"
                        style={{ color: `${accent}20` }}
                      >
                        {project.title.charAt(0)}
                      </div>
                    </div>
                    <div
                      className="absolute bottom-0 left-0 right-0 h-12"
                      style={{
                        background: `linear-gradient(to top, var(--bg-elevated), transparent)`,
                      }}
                    />
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <h3
                      className="text-lg font-semibold mb-2 transition-colors duration-200"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {project.title}
                    </h3>
                    <p
                      className="text-sm mb-4 line-clamp-2 leading-relaxed flex-1"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {project.tags.split(",").map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-0.5 rounded"
                          style={{
                            backgroundColor: "var(--bg-tertiary)",
                            color: "var(--text-secondary)",
                          }}
                        >
                          {tag.trim()}
                        </span>
                      ))}
                    </div>

                    <div
                      className="flex gap-3 pt-3"
                      style={{ borderTop: "1px solid var(--border-subtle)" }}
                    >
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-sm font-medium transition-colors"
                          style={{ color: "var(--accent)" }}
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          Demo
                        </a>
                      )}
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-sm transition-colors"
                          style={{ color: "var(--text-muted)" }}
                        >
                          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                          </svg>
                          Codigo
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
