"use client";

import { useState, useRef, useEffect } from "react";

interface Skill {
  id: string;
  name: string;
  level: number;
}

interface MultiSelectTagsProps {
  skills: Skill[];
  selected: string;
  onChange: (value: string) => void;
}

export default function MultiSelectTags({ skills, selected, onChange }: MultiSelectTagsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedNames = selected ? selected.split(",").map((s) => s.trim()).filter(Boolean) : [];

  const toggleSkill = (name: string) => {
    const updated = selectedNames.includes(name)
      ? selectedNames.filter((n) => n !== name)
      : [...selectedNames, name];
    onChange(updated.join(","));
  };

  const removeSkill = (name: string) => {
    onChange(selectedNames.filter((n) => n !== name).join(","));
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="input-field text-left flex items-center justify-between"
      >
        <span style={{ color: selectedNames.length ? "var(--text-primary)" : "var(--text-muted)" }}>
          {selectedNames.length ? `${selectedNames.length} selecionada(s)` : "Selecionar skills..."}
        </span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          style={{ color: "var(--text-muted)" }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div
          className="absolute z-50 w-full mt-1 max-h-60 overflow-y-auto rounded-lg"
          style={{
            backgroundColor: "var(--bg-elevated)",
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-lg)",
          }}
        >
          {skills.map((skill) => (
            <label
              key={skill.id}
              className="flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors"
              style={{ color: "var(--text-primary)" }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--accent-muted)"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
            >
              <input
                type="checkbox"
                checked={selectedNames.includes(skill.name)}
                onChange={() => toggleSkill(skill.name)}
                className="rounded"
              />
              <span className="text-sm">{skill.name}</span>
              <span className="text-xs ml-auto" style={{ color: "var(--text-muted)" }}>{skill.level}/5</span>
            </label>
          ))}
          {skills.length === 0 && (
            <p className="px-4 py-3 text-sm" style={{ color: "var(--text-muted)" }}>Nenhuma skill encontrada.</p>
          )}
        </div>
      )}

      {selectedNames.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {selectedNames.map((name) => (
            <span
              key={name}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium"
              style={{
                backgroundColor: "var(--accent-muted)",
                color: "var(--accent)",
              }}
            >
              {name}
              <button
                type="button"
                onClick={() => removeSkill(name)}
                className="ml-0.5 hover:opacity-70"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
