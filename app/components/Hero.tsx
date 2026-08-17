"use client";

import { motion } from "framer-motion";
import { useRef, useCallback, useState } from "react";
import Image from "next/image";
import LoginModal from "./LoginModal";

export default function Hero() {
  const [showLogin, setShowLogin] = useState(false);
  const lastClickTime = useRef(0);

  const handleDoubleClick = useCallback(() => {
    const now = Date.now();
    if (now - lastClickTime.current < 300) {
      setShowLogin(true);
    }
    lastClickTime.current = now;
  }, []);

  return (
    <>
      <section
        id="hero"
        onClick={handleDoubleClick}
        className="min-h-[70vh] flex flex-col items-center justify-center px-6 relative overflow-hidden cursor-default"
      >
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1920&q=80"
            alt=""
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0" style={{ backgroundColor: "rgba(0,0,0,0.65)" }} />
          <div className="absolute inset-0" style={{ backgroundColor: "var(--bg-primary)", opacity: 0.3 }} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 text-center max-w-4xl"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
            style={{
              backgroundColor: "rgba(255,255,255,0.1)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: "#22c55e" }} />
            <span className="text-sm font-medium text-white/80">
              Disponivel para projetos
            </span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="font-mono text-sm mb-4 tracking-[0.2em] uppercase"
            style={{ color: "var(--accent)" }}
          >
            Full Stack Developer
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-white"
          >
            Abraao Xavier
            <span className="block mt-1" style={{ color: "var(--accent)" }}>
              Sungo Sala
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-lg md:text-xl mb-10 max-w-xl mx-auto leading-relaxed text-white/70"
          >
            Construindo solucoes web modernas com foco em performance e
            experiencia do usuario.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <a href="#projetos" className="btn-primary">
              Ver Projetos
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
            <a
              href="#contato"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium text-white transition-all"
              style={{
                backgroundColor: "rgba(255,255,255,0.1)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              Fale Comigo
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-white/60 rounded-full mt-2"
            />
          </div>
        </motion.div>
      </section>

      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
    </>
  );
}
