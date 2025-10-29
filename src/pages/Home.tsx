import { useEffect, useMemo, useState } from "react";
import { Modal } from "../components/Modal";
import { useNavigate } from "react-router-dom";

type ModalKey = "agendar" | "contato" | "chat" | "resultados" | null;

export function Home() {
  const navigate = useNavigate();
  const [open, setOpen] = useState<ModalKey>(null);
  const [pacienteNome, setPacienteNome] = useState<string | null>(null);

  // Vite: /public -> use caminhos absolutos
  const slides = useMemo(() => ["/videos/video 1.mp4"], []);
  const [current] = useState(0); // 1 video: sem rotação p/ reduzir ruído

  // Saudação inteligente
  const saudacao = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return "Bom dia";
    if (h < 18) return "Boa tarde";
    return "Boa noite";
  }, []);

  useEffect(() => {
    const nome = localStorage.getItem("pacienteNome");
    if (nome) setPacienteNome(nome);
  }, []);

  return (
    <main className="font-sans bg-white text-slate-900">

      {/* ===== HERO minimal (overlay azul sólido, sem gradiente) ===== */}
      <section className="relative h-[58vh] md:h-[54vh] flex items-center overflow-hidden">
        <video
          key={slides[current]}
          className="absolute inset-0 w-full h-full object-cover brightness-95"
          src={slides[0]}
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="absolute inset-0 bg-blue-900/60" />

        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 md:px-8">
          <p className="text-blue-100 text-sm md:text-base">
            {saudacao}{pacienteNome ? `, ${pacienteNome}` : ""} — bem-vindo(a)
          </p>
          <h1 className="mt-1 text-3xl md:text-5xl font-extrabold text-white tracking-tight">
            Telemedicina IMREA + HC
          </h1>
          <p className="mt-3 max-w-2xl text-white/90 text-sm md:text-lg">
            Agende consultas, acesse resultados e obtenha suporte em poucos cliques.
          </p>

          {/* Ações rápidas “inteligentes” (chips) */}
          <div className="mt-5 flex flex-wrap gap-2">
            <button
              onClick={() => navigate("/agendar")}
              className="h-9 px-4 rounded-full bg-white text-blue-900 text-sm font-semibold hover:bg-blue-50 transition border border-blue-200"
            >
              Agendar agora
            </button>
            <button
              onClick={() => navigate("/resultados")}
              className="h-9 px-4 rounded-full bg-white/90 text-blue-900 text-sm font-semibold hover:bg-white transition border border-white/60"
            >
              Ver resultados
            </button>
            <button
              onClick={() => navigate("/contato")}
              className="h-9 px-4 rounded-full bg-white/90 text-blue-900 text-sm font-semibold hover:bg-white transition border border-white/60"
            >
              Contato
            </button>
          </div>
        </div>
      </section>

      {/* ===== SOBRE (compacto, alinhado ao azul) ===== */}
      <section id="sobre" className="py-14 px-6 md:px-8">
        <div className="max-w-6xl mx-auto grid gap-10 md:grid-cols-[1.1fr,1fr] items-start">
          <div className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-extrabold text-blue-900">Sobre nós</h2>
            <p className="text-sm md:text-base leading-relaxed text-slate-700">
              Plataforma acadêmica da FIAP focada em acessibilidade, segurança e simplicidade
              para o cuidado em saúde: agendamentos, teleatendimento e resultados em um só lugar.
            </p>
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => navigate("/agendar")}
                className="h-10 px-4 rounded-md bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition"
              >
                Agendar
              </button>
              <button
                onClick={() => navigate("/resultados")}
                className="h-10 px-4 rounded-md border border-slate-300 text-slate-800 text-sm font-semibold hover:bg-slate-50 transition"
              >
                Resultados
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {["imrea 2.webp","paciente 02.webp","paciente 01.webp","apresentação.jpeg"].map((img, i) => (
              <figure
                key={i}
                className="rounded-xl border border-slate-200 bg-white p-2 shadow-sm hover:shadow-md transition"
              >
                <img
                  src={`/imgs/${img}`}
                  alt="Telemedicina IMREA + HC"
                  className="rounded-lg object-cover w-full h-44 md:h-52"
                  loading="lazy"
                />
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SERVIÇOS — layout assimétrico, azul, sem gradiente ===== */}
      <section id="servicos" className="px-6 md:px-8 pb-16">
        <div className="mx-auto max-w-6xl mb-8">
          <h2 className="text-3xl md:text-4xl font-extrabold text-blue-900">Serviços</h2>
          <p className="text-sm md:text-base text-slate-600 mt-1">
            Atalhos principais do portal
          </p>
        </div>

        {/* Grid com card destaque + dois cards secundários */}
        <div className="mx-auto max-w-6xl grid gap-8 lg:grid-cols-3">
          {/* Destaque: Agendar (ocupa 2 colunas no desktop) */}
          <article
            className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm hover:shadow-lg transition
                       group"
            role="button"
            tabIndex={0}
            onClick={() => navigate("/agendar")}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && navigate("/agendar")}
            aria-label="Abrir Agendamento"
          >
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-lg bg-blue-50 ring-1 ring-blue-200 flex items-center justify-center">
                <span className="text-2xl">📅</span>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-semibold text-slate-900">Agendamento</h3>
                <p className="mt-1 text-slate-600">
                  Marque consultas e exames com data, hora e modalidade.
                </p>

                {/* Chips “inteligentes” de acesso rápido */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {["Consulta Presencial", "Telemedicina", "Exames"].map((c) => (
                    <span
                      key={c}
                      className="px-3 py-1 rounded-full border border-slate-200 text-xs font-medium text-slate-700
                                 group-hover:border-blue-300"
                    >
                      {c}
                    </span>
                  ))}
                </div>

                <button
                  className="mt-5 h-10 px-5 rounded-md bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate("/agendar");
                  }}
                >
                  Agendar agora
                </button>
              </div>
            </div>
          </article>

          {/* Secundário: Resultados */}
          <article
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-lg transition
                       focus-within:ring-2 ring-blue-300"
          >
            <div className="h-11 w-11 rounded-lg bg-blue-50 ring-1 ring-blue-200 flex items-center justify-center">
              <span className="text-xl">🧾</span>
            </div>
            <h3 className="mt-3 text-xl font-semibold">Resultados</h3>
            <p className="mt-1 text-slate-600">Laudos, exames e documentos em um só lugar.</p>

            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              <li>• Exames em TXT/PDF</li>
              <li>• Histórico por data</li>
              <li>• Download rápido</li>
            </ul>

            <button
              onClick={() => navigate("/resultados")}
              className="mt-4 h-9 px-4 rounded-md bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition"
            >
              Ver resultados
            </button>
          </article>

          {/* Secundário: Contato */}
          <article
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-lg transition
                       focus-within:ring-2 ring-blue-300 lg:col-start-3"
          >
            <div className="h-11 w-11 rounded-lg bg-blue-50 ring-1 ring-blue-200 flex items-center justify-center">
              <span className="text-xl">💬</span>
            </div>
            <h3 className="mt-3 text-xl font-semibold">Contato</h3>
            <p className="mt-1 text-slate-600">Canal direto com nosso suporte.</p>

            <div className="mt-3 grid gap-2 text-sm">
              <span className="text-slate-700">atendimento@imrea-hc.br</span>
              <span className="text-slate-700">Seg–Sex, 08:00–18:00</span>
            </div>

            <button
              onClick={() => navigate("/contato")}
              className="mt-4 h-9 px-4 rounded-md bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition"
            >
              Falar com suporte
            </button>
          </article>
        </div>
      </section>

      {/* ===== MODAIS ===== */}
      <Modal title="Nosso Chat" isOpen={open === "chat"} onClose={() => setOpen(null)}>
        <p className="text-slate-700">Canal oficial (em breve).</p>
        <button
          onClick={() => setOpen(null)}
          className="mt-4 h-10 px-4 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
        >
          Fechar
        </button>
      </Modal>

      <Modal title="Resultados" isOpen={open === "resultados"} onClose={() => setOpen(null)}>
        <p className="text-slate-700 mb-2">Acesse seus documentos.</p>
        <div className="flex gap-2">
          <button
            onClick={() => { setOpen(null); navigate("/resultados"); }}
            className="h-10 px-4 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
          >
            Abrir Resultados
          </button>
          <button
            onClick={() => setOpen(null)}
            className="h-10 px-4 rounded-md bg-slate-200 text-slate-800 font-semibold hover:bg-slate-300 transition"
          >
            Fechar
          </button>
        </div>
      </Modal>
    </main>
  );
}
