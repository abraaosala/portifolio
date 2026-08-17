import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="text-7xl font-bold text-emerald-400 mb-4">404</div>
        <h2 className="text-2xl font-bold text-white mb-2">Pagina nao encontrada</h2>
        <p className="text-zinc-400 mb-6">
          A pagina que voce procura nao existe ou foi movida.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors"
        >
          Voltar ao inicio
        </Link>
      </div>
    </div>
  );
}
