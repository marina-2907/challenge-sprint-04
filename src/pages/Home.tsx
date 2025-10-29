import { useEffect, useMemo, useState } from "react";
import { Modal } from "../components/Modal";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";



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
    <main className="font-sans bg-[#001C3A] text-white selection:bg-orange-500 selection:text-white">

  
      {/* HERO — versão animada, sem vídeo, azul + laranja */}
<section className="relative overflow-hidden bg-[#001C3A]">
  {/* Shapes decorativos (soft blur) */}
  <div className="pointer-events-none absolute -top-24 -left-24 h-[22rem] w-[22rem] rounded-full bg-orange-500/15 blur-[120px]" />
  <div className="pointer-events-none absolute -bottom-32 -right-20 h-[26rem] w-[26rem] rounded-full bg-sky-400/10 blur-[140px]" />

  <div className="mx-auto flex min-h-[66vh] max-w-6xl items-center px-6 py-14 md:px-10">
    <div className="w-full max-w-3xl">
      {/* Saudação */}
      <motion.p
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="text-sm tracking-wide text-white/80"
      >
        {saudacao}{pacienteNome ? `, ${pacienteNome}` : ""} — Bem-vindo(a)
      </motion.p>

      {/* Título com animação de máscara + letra */}
      <motion.h1
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: { staggerChildren: 0.04 }
          }
        }}
        className="mt-2 text-4xl font-extrabold leading-tight text-white md:text-6xl"
      >
        {"Telemedicina ".split("").map((ch, i) => (
          <motion.span
            key={`tele-${i}`}
            variants={{ hidden: { y: 24, opacity: 0 }, show: { y: 0, opacity: 1 } }}
          >
            {ch}
          </motion.span>
        ))}
        <span className="text-orange-500">IMREA + HC</span>
      </motion.h1>

      {/* Subtítulo com fade/slide */}
      <motion.p
        initial={{ y: 8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.25, duration: 0.5 }}
        className="mt-3 max-w-xl text-base leading-relaxed text-gray-200 md:text-lg"
      >
        Saúde digital acessível, segura e rápida. Agende consultas e acesse resultados em poucos cliques.
      </motion.p>

      {/* Ações — botões com “lift” e foco visível */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.45, duration: 0.5 }}
        className="mt-6 flex flex-wrap gap-3"
      >
        <motion.button
          whileHover={{ y: -2 }}
          whileTap={{ y: 0 }}
          onClick={() => navigate("/agendar")}
          className="px-6 py-3 rounded-md bg-orange-500 font-semibold text-white shadow-lg ring-0 transition hover:bg-orange-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-300"
        >
          Agendar agora
        </motion.button>

        <motion.button
          whileHover={{ y: -2 }}
          whileTap={{ y: 0 }}
          onClick={() => navigate("/resultados")}
          className="px-6 py-3 rounded-md border border-white/25 text-white/90 transition hover:border-white/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
        >
          Resultados
        </motion.button>

        <motion.button
          whileHover={{ y: -2 }}
          whileTap={{ y: 0 }}
          onClick={() => navigate("/contato")}
          className="px-6 py-3 rounded-md border border-white/25 text-white/90 transition hover:border-white/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
        >
          Suporte
        </motion.button>
      </motion.div>

      {/* Chips rápidos (com fricção visual mínima) */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65, duration: 0.45 }}
        className="mt-5 flex flex-wrap gap-2"
      >
        {["Consulta Presencial", "Telemedicina", "Exames"].map((chip) => (
          <span
            key={chip}
            className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-gray-200 backdrop-blur-md"
          >
            {chip}
          </span>
        ))}
      </motion.div>
    </div>
  </div>

  {/* Indicador de scroll suave */}
  <motion.div
    initial={{ opacity: 0, y: -6 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.9, duration: 0.6 }}
    className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2"
    aria-hidden
  >
    <div className="flex items-center gap-2 text-white/70 text-xs">
      <span className="h-5 w-px bg-white/40" />
      role para ver mais
      <span className="h-5 w-px bg-white/40" />
    </div>
  </motion.div>
</section>


      {/* SOBRE */}
<section id="sobre" className="py-20 px-6 md:px-10 bg-[#001C3A] text-white">
  <div className="max-w-6xl mx-auto grid gap-12 md:grid-cols-[0.9fr,1.2fr] items-start">

    {/* Texto institucional */}
    <div className="space-y-6">
      <h3 className="text-3xl md:text-4xl font-extrabold leading-tight">
        Sobre <span className="text-orange-500">o Projeto</span>
      </h3>

      <p className="text-gray-300 text-sm md:text-base leading-relaxed">
        Este projeto acadêmico foi desenvolvido com o objetivo de aproximar
        pacientes do Instituto de Medicina Física e Reabilitação do Hospital das Clínicas,
        utilizando recursos digitais para facilitar a comunicação, organização e
        acompanhamento clínico.
      </p>

      <p className="text-gray-300 text-sm md:text-base leading-relaxed">
        A solução centraliza funcionalidades essenciais como teleatendimento,
        lembretes, suporte e acesso a documentos, reduzindo processos burocráticos
        e evitando ausências em consultas — um desafio recorrente em sistemas
        hospitalares modernos.
      </p>

      <p className="text-gray-300 text-sm md:text-base leading-relaxed">
        Além disso, o projeto reforça pilares como acessibilidade, clareza visual
        e boa experiência do usuário, assegurando que qualquer paciente possa
        navegar com autonomia, incluindo pessoas com limitações motoras ou cognitivas.
      </p>

      {/* Pilares resumidos */}
      <ul className="grid gap-3 md:grid-cols-2 pt-2">
        {[
          "Redução do absenteísmo",
          "Centralização das informações do paciente",
          "Fluxo simplificado de agendamentos",
          "Apoio em reabilitação digital",
        ].map((p) => (
          <li
            key={p}
            className="flex items-start gap-2 text-gray-200 text-sm"
          >
            <span className="text-orange-500 text-lg">•</span>
            {p}
          </li>
        ))}
      </ul>
    </div>
  </div>
</section>

      {/* SERVIÇOS */}
      <section id="servicos" className="pt-20 pb-16 px-6 md:px-10">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold">
            Serviços <span className="text-orange-500">Disponíveis</span>
          </h2>
          <p className="mt-2 text-gray-300 text-sm md:text-base">
            Acesso essencial ao seu cuidado
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {[
            {
              title: "Agendamento",
              desc: "Telemedicina, presencial e exames.",
              icon: "⏱",
              action: () => navigate("/agendar"),
            },
            {
              title: "Resultados",
              desc: "Seus laudos e históricos.",
              icon: "📄",
              action: () => navigate("/resultados"),
            },
            {
              title: "Contato",
              desc: "Suporte direto com atendimento.",
              icon: "💬",
              action: () => navigate("/contato"),
            },
          ].map((c) => (
            <article
              key={c.title}
              onClick={c.action}
              className="cursor-pointer text-left rounded-xl bg-white/5 border border-white/10 hover:border-orange-500 p-7 transition shadow-md hover:shadow-orange-600/20 backdrop-blur-md"
            >
              <div className="text-4xl mb-4">{c.icon}</div>
              <h3 className="text-xl font-bold">{c.title}</h3>
              <p className="mt-2 text-gray-300 text-sm">{c.desc}</p>
              <button className="mt-5 px-4 py-2 rounded-md bg-orange-500 hover:bg-orange-600 text-sm font-semibold transition">
                Acessar
              </button>
            </article>
          ))}
        </div>
      </section>

      {/* MODAIS */}
      <Modal title="Nosso Chat" isOpen={open === "chat"} onClose={() => setOpen(null)}>
        <p className="text-gray-200">Em breve disponível.</p>
        <button
          onClick={() => setOpen(null)}
          className="mt-4 px-4 py-2 bg-orange-500 rounded-md hover:bg-orange-600 font-semibold"
        >
          Fechar
        </button>
      </Modal>

      <Modal title="Resultados" isOpen={open === "resultados"} onClose={() => setOpen(null)}>
        <p className="text-gray-200 mb-3">Consultar documentos.</p>
        <button
          onClick={() => {
            setOpen(null);
            navigate("/resultados");
          }}
          className="px-4 py-2 bg-orange-500 rounded-md hover:bg-orange-600 mr-2 font-semibold"
        >
          Abrir
        </button>
        <button
          onClick={() => setOpen(null)}
          className="px-4 py-2 border border-white/20 hover:border-white/60 rounded-md font-semibold"
        >
          Fechar
        </button>
      </Modal>
    </main>
  );
}
