"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface Skill {
  id: number;
  name: string;
  level: number;
}

export default function About({ skills }: { skills: Skill[] }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const stats = [
    { value: "3+", label: "Anos de Experiencia" },
    { value: "20+", label: "Projetos Concluidos" },
    { value: "100%", label: "Dedicacao" },
  ];

  return (
    <section id="sobre" className="min-h-screen py-24 px-6 relative">
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
          className="mb-16"
        >
          <p className="section-label mb-4">Quem sou</p>
          <h2 className="section-title mb-4">
            Sobre <span style={{ color: "var(--accent)" }}>Mim</span>
          </h2>
          <div className="section-divider" />
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            <p className="text-lg leading-relaxed" style={{ color: "var(--text-primary)" }}>
              Sou um desenvolvedor Full Stack apaixonado por criar solucoes web
              que fazem diferenca. Com experiencia em JavaScript, TypeScript,
              React, Next.js e Node.js, construo aplicacoes modernas e
              performaticas.
            </p>
            <p className="leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              Meu foco esta em desenvolver interfaces intuitivas e APIs
              robustas. Acredito que bom codigo e aquele que resolve problemas
              reais e entrega valor aos usuarios.
            </p>

            <div className="grid grid-cols-3 gap-4 pt-6">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                  className="card p-4 text-center"
                >
                  <div className="text-2xl md:text-3xl font-bold mb-1" style={{ color: "var(--accent)" }}>
                    {stat.value}
                  </div>
                  <div className="text-xs leading-tight" style={{ color: "var(--text-muted)" }}>
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-3"
          >
            <h3 className="text-lg font-semibold mb-8 flex items-center gap-3" style={{ color: "var(--text-primary)" }}>
              <span
                className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
                style={{ backgroundColor: "var(--accent-muted)", color: "var(--accent)" }}
              >
                &#9672;
              </span>
              Minhas Skills
            </h3>
            <div className="space-y-5">
              {skills.map((skill, index) => (
                <motion.div
                  key={skill.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.5 + index * 0.05 }}
                >
                  <div className="flex justify-between mb-2">
                    <span className="font-medium text-sm" style={{ color: "var(--text-primary)" }}>
                      {skill.name}
                    </span>
                    <span className="text-sm font-mono" style={{ color: "var(--accent)" }}>
                      {skill.level * 20}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: "var(--bg-tertiary)" }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={isInView ? { width: `${skill.level * 20}%` } : {}}
                      transition={{ duration: 1, delay: 0.6 + index * 0.05, ease: "easeOut" }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: "var(--accent)" }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
