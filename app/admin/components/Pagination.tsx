"use client";

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ page, totalPages, total, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPages = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push("...");
      for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
        pages.push(i);
      }
      if (page < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  const btnStyle = (active = false, disabled = false) => ({
    minWidth: "36px",
    height: "36px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: active ? "600" : "400",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.4 : 1,
    backgroundColor: active ? "var(--accent)" : "transparent",
    color: active ? "#fff" : "var(--text-primary)",
    border: active ? "none" : "1px solid var(--border)",
    transition: "all 0.15s ease",
  });

  return (
    <div className="flex items-center justify-between mt-6">
      <span className="text-sm" style={{ color: "var(--text-muted)" }}>
        {total} item{total !== 1 ? "s" : ""} • Página {page} de {totalPages}
      </span>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(1)}
          disabled={page === 1}
          style={btnStyle(false, page === 1)}
          title="Primeira página"
        >
          «
        </button>
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          style={btnStyle(false, page === 1)}
          title="Página anterior"
        >
          ‹
        </button>

        {getPages().map((p, i) =>
          p === "..." ? (
            <span key={`dots-${i}`} className="px-1" style={{ color: "var(--text-muted)" }}>…</span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              style={btnStyle(p === page)}
            >
              {p}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          style={btnStyle(false, page === totalPages)}
          title="Próxima página"
        >
          ›
        </button>
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={page === totalPages}
          style={btnStyle(false, page === totalPages)}
          title="Última página"
        >
          »
        </button>
      </div>
    </div>
  );
}
