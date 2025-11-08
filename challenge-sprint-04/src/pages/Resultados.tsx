import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FileDown } from "lucide-react";

/* ——— Alerta simples lendo ?msg= da URL (feedback pós-ação) ——— */
function AlertFromQuery() {
  const { search } = useLocation();
  const params = useMemo(() => new URLSearchParams(search), [search]);
  const msg = params.get("msg");
  if (!msg) return null;
  return (
    <div className="mx-auto max-w-7xl mb-4 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 px-4 py-2">
      {decodeURIComponent(msg)}
    </div>
  );
}

/* ——— Helper p/ download simples ——— */
const downloadFile = (filePath: string, fileName: string) => {
  const link = document.createElement("a");
  link.href = filePath;
  link.download = fileName;
  link.click();
};

const cardDownload = (img: string, label: string, key: string, file: string) => (
  <div
    key={key}
    className="group flex flex-col items-center bg-white rounded-2xl p-7 w-full max-w-[280px] text-center shadow-sm border border-slate-200
               transition-all hover:-translate-y-1 hover:shadow-lg hover:border-orange-300/80"
  >
    <div className="relative">
      <img
        src={img}
        alt={label}
        className="h-28 w-28 object-contain rounded-xl mb-3 transition-transform group-hover:scale-105"
      />
      <span className="absolute -right-2 -top-2 inline-flex items-center justify-center h-7 w-7 rounded-full bg-orange-100 text-orange-700">
        <FileDown size={16} />
      </span>
    </div>
    <h3 className="text-base font-extrabold text-[#0f1c3a]">{label}</h3>

    <button
      onClick={() => downloadFile(file, `${label.toLowerCase()}.txt`)}
      className="mt-3 w-full inline-flex items-center justify-center gap-2 bg-orange-600 text-white font-semibold px-5 py-2.5 rounded-xl shadow
                 hover:bg-orange-700 transition"
    >
      Baixar {label}
    </button>
  </div>
);

export function Resultados() {
  const navigate = useNavigate();

  return (
    <main className="font-sans min-h-screen py-10 md:py-16 px-6 bg-gradient-to-b from-slate-50 to-white">
      {/* Feedback via query string */}
      <AlertFromQuery />

      {/* Cabeçalho */}
      <section className="mx-auto w-full max-w-7xl">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 text-orange-700 px-4 py-1.5 border border-orange-200">
            <span className="h-2 w-2 rounded-full bg-orange-500" />
            <span className="text-[13px] font-semibold tracking-wide">Resultados</span>
          </div>
          <h1 className="mt-3 text-3xl md:text-4xl font-extrabold text-[#0f1c3a]">
            Resultados do Paciente
          </h1>
          <p className="mt-2 text-slate-600">
            Acesse seus exames, laudos e receitas disponíveis para download.
          </p>
        </div>

        {/* ====== BLOCO — Meus Documentos (Downloads) ====== */}
        <div className="mt-10 md:mt-14">
          <h2 className="text-xl md:text-2xl font-extrabold text-[#0f1c3a] mb-6">Meus Documentos</h2>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-8 w-full justify-items-center">
            {cardDownload("imgs/exame.jpg", "Exames", "exames", "./txt/exames.txt")}
            {cardDownload("imgs/novo laudo.png", "Laudos", "laudos", "./txt/laudos.txt")}
            {cardDownload("imgs/receita.avif", "Receitas", "receitas", "./txt/receita.txt")}

            {/* Voltar para Home */}
            <div
              className="group flex flex-col items-center bg-white rounded-2xl p-7 w-full max-w-[280px] text-center shadow-sm border border-slate-200
                         transition-all hover:-translate-y-1 hover:shadow-lg hover:border-slate-300 cursor-pointer"
              onClick={() => navigate("/")}
            >
              <img
                src="imgs/voltar.png"
                alt="Voltar"
                className="h-28 w-28 object-contain rounded-xl mb-3 transition-transform group-hover:scale-105"
              />
              <button className="w-full inline-flex items-center justify-center gap-2 bg-slate-600 text-white font-semibold px-5 py-2.5 rounded-xl shadow hover:bg-slate-700 transition">
                Ir para Home
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
