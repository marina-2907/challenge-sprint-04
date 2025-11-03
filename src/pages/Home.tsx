import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Modal } from "../components/Modal";
import {
  ArrowRight,
  CalendarCheck,
  FileText,
  MessageCircle,
  CheckCircle2,
} from "lucide-react";

type ModalKey = "agendar" | "contato" | "chat" | "resultados" | null;

export function Home() {
  const navigate = useNavigate();
  const [open, setOpen] = useState<ModalKey>(null);
  const [pacienteNome, setPacienteNome] = useState<string | null>(null);

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
    <main className="min-h-dvh font-sans bg-white text-slate-900 overflow-x-hidden selection:bg-orange-500 selection:text-white">

      {/* ===== HERO (faixa azul-marinho) ===== */}
      <section className="relative bg-[#0f1c3a]">
        {/* manchas suaves */}
        <div className="pointer-events-none absolute -top-24 -right-24 w-[28rem] h-[28rem] rounded-full bg-orange-400/10 blur-[120px]" />
        <div className="pointer-events-none absolute -bottom-28 -left-28 w-[26rem] h-[26rem] rounded-full bg-orange-300/10 blur-[140px]" />

        <div className="relative mx-auto max-w-7xl px-6 md:px-10 py-14 md:py-20 grid md:grid-cols-2 gap-12 items-center">
          {/* Texto */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="text-white space-y-7"
          >
            {/* Saudação elegante */}
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-xl bg-white/10 border border-white/15 backdrop-blur">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-70" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-400" />
              </span>
              <span className="text-sm font-medium opacity-95">
                {saudacao}
                {pacienteNome ? (
                  <span> — <span className="text-orange-300 font-semibold">{pacienteNome}</span></span>
                ) : " — Bem-vindo(a)"}
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
              Cuidado digital, <span className="text-orange-400">simples</span> e humano
            </h1>

            <p className="text-lg leading-relaxed text-white/90 max-w-xl">
              Agende, confirme e acompanhe resultados em um só lugar — com foco em clareza,
              acessibilidade e redução de faltas.
            </p>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate("/agendar")}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold shadow-lg
                           bg-orange-600 text-white hover:bg-orange-700 transition focus:outline-none
                           focus-visible:ring-2 focus-visible:ring-white/70"
              >
                Agendar agora <ArrowRight size={18} />
              </button>

              <button
                onClick={() => navigate("/resultados")}
                className="px-6 py-3 rounded-lg font-semibold border border-white/25 text-white/95
                           hover:bg-white/10 transition focus:outline-none focus-visible:ring-2
                           focus-visible:ring-white/70"
              >
                Ver resultados
              </button>
            </div>
          </motion.div>

          {/* Cartão de destaques */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.05 }}
            className="rounded-2xl bg-white p-6 md:p-8 shadow-xl"
          >
            <h3 className="text-xl font-extrabold">Por que é melhor?</h3>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {[
                { k: "Consultas", v: "Tele / Presencial" },
                { k: "Exames", v: "Agende online" },
                { k: "Lembretes", v: "WhatsApp / E-mail" },
                { k: "Resultados", v: "Laudos seguros" },
              ].map(({ k, v }) => (
                <div key={k} className="rounded-lg border border-slate-200 p-3">
                  <div className="text-xs text-slate-500">{k}</div>
                  <div className="text-sm font-semibold">{v}</div>
                </div>
              ))}
            </div>
            <div className="mt-5 flex items-center gap-2 text-sm text-slate-700">
              <CheckCircle2 className="text-emerald-600" size={18} />
              <span>Fluxo rápido e inclusivo para reduzir faltas</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== SOBRE (faixa branca refinada) ===== */}
      <section id="sobre" className="relative isolate px-6 md:px-10 py-16 md:py-20 bg-white">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-300/60 to-transparent" />

        <div className="mx-auto max-w-7xl grid gap-12 md:grid-cols-2 items-start">
          {/* Lado esquerdo */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 text-orange-700 px-4 py-1.5 border border-orange-200">
              <span className="h-2 w-2 rounded-full bg-orange-500" />
              <span className="text-[13px] font-semibold tracking-wide">Sobre o projeto</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-extrabold">
              Telemedicina <span className="text-orange-600">IMREA + HC</span>
            </h2>

            <p className="text-slate-700 text-base md:text-lg leading-relaxed">
              Criado por estudantes da FIAP em parceria com IMREA + HC, o portal reduz faltas por
              esquecimento, facilita reagendamentos e centraliza o que importa — com linguagem clara e alto contraste.
            </p>

            <ul className="grid sm:grid-cols-2 gap-3">
              {[
                "Confirmação por WhatsApp/E-mail",
                "Agendamentos (tele, presencial e exames)",
                "Design inclusivo e acessível",
                "Suporte com passo a passo",
              ].map((t) => (
                <li key={t} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-3">
                  <span className="mt-0.5">
                    <CheckCircle2 size={18} className="text-orange-600" />
                  </span>
                  <span className="text-[15px] text-slate-800">{t}</span>
                </li>
              ))}
            </ul>

            <p className="text-slate-500 text-xs md:text-sm">
              *Projeto acadêmico — não substitui orientações médicas profissionais.*
            </p>
          </div>

          {/* Lado direito: linha do tempo */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-xl font-extrabold">Como funciona</h3>

            <ol className="relative mt-6 space-y-6">
              <span className="pointer-events-none absolute left-4 top-0 bottom-0 w-0.5 bg-orange-200" />
              {[
                {
                  icon: <CalendarCheck size={18} className="text-orange-600" />,
                  t: "Agende em minutos",
                  d: "Escolha data, formato e especialidade.",
                },
                {
                  icon: <MessageCircle size={18} className="text-orange-600" />,
                  t: "Confirme presença",
                  d: "Receba lembretes e confirme com 1 toque.",
                },
                {
                  icon: <FileText size={18} className="text-orange-600" />,
                  t: "Acompanhe laudos",
                  d: "Resultados e histórico em um só lugar.",
                },
                {
                  icon: <CheckCircle2 size={18} className="text-orange-600" />,
                  t: "Menos faltas",
                  d: "Comunicação clara e fluxo sem fricção.",
                },
              ].map((i, idx) => (
                <li key={i.t} className="relative pl-10">
                  <span className="absolute left-0 top-1.5 grid place-items-center h-8 w-8 rounded-full bg-orange-50 border border-orange-200">
                    {i.icon}
                  </span>
                  <div className="font-semibold">{i.t}</div>
                  <div className="text-sm text-slate-600">{i.d}</div>
                  {idx < 3 && <div className="mt-6 h-px bg-slate-100" />}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ===== SERVIÇOS (faixa branca com leve fundo) ===== */}
      <section id="servicos" className="relative isolate px-6 md:px-10 py-16 md:py-20 bg-gradient-to-b from-orange-50/60 to-white">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-300/60 to-transparent" />

        <div className="mx-auto max-w-7xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 border border-orange-200 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-orange-500" />
            <span className="text-[13px] font-semibold tracking-wide text-orange-700">Serviços</span>
          </div>

          <h2 className="mt-3 text-3xl md:text-4xl font-extrabold">
            Tudo que você precisa, <span className="text-orange-600">num só lugar</span>
          </h2>
          <p className="mt-2 text-slate-600">Agende, confirme e acompanhe — sem complicação.</p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mx-auto max-w-7xl">
          {[
            { title: "Agendamento", desc: "Telemedicina, presencial e exames.", icon: "⏱", path: "/agendar" },
            { title: "Resultados",  desc: "Seus laudos e históricos.",          icon: "📄", path: "/resultados" },
            { title: "Contato",     desc: "Suporte direto com atendimento.",    icon: "💬", path: "/contato" },
          ].map((c) => (
            <motion.article
              key={c.title}
              whileHover={{ y: -2 }}
              className="group cursor-pointer rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition
                         hover:shadow-lg hover:border-orange-300/70"
              onClick={() => navigate(c.path)}
            >
              <div className="h-1 w-12 rounded-full bg-orange-500/80 group-hover:w-16 transition-all" />
              <div className="mt-3 text-4xl">{c.icon}</div>
              <h3 className="mt-2 text-xl font-extrabold">{c.title}</h3>
              <p className="mt-1.5 text-slate-600 text-sm">{c.desc}</p>
              <div className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-orange-600">
                Acessar <ArrowRight size={16} />
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* ===== MODAIS ===== */}
      <Modal title="Nosso Chat" isOpen={open === "chat"} onClose={() => setOpen(null)}>
        <p className="text-slate-700">Em breve disponível.</p>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={() => setOpen(null)} className="px-4 py-2 rounded-md border border-slate-300 hover:bg-slate-50">Fechar</button>
          <button onClick={() => { setOpen(null); navigate("/chat"); }} className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700">Ir para o Chat</button>
        </div>
      </Modal>

      <Modal title="Resultados" isOpen={open === "resultados"} onClose={() => setOpen(null)}>
        <p className="text-slate-700">Acesse seus documentos com segurança.</p>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={() => setOpen(null)} className="px-4 py-2 rounded-md border border-slate-300 hover:bg-slate-50">Fechar</button>
          <button onClick={() => { setOpen(null); navigate("/resultados"); }} className="px-4 py-2 rounded-md bg-orange-600 text-white hover:bg-orange-700">Abrir Resultados</button>
        </div>
      </Modal>
    </main>
  );
}
