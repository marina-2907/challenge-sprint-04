import { useState, useEffect } from "react";
import { Modal } from "../components/Modal";

type ModalKey = "agendar" | "contato" | "chat" | "resultados" | null;

export function Home() {
  const [open, setOpen] = useState<ModalKey>(null);
  const [pacienteNome, setPacienteNome] = useState<string | null>(null);
  const slides = ["public/videos/video 1.mp4"]; 
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    const nome = localStorage.getItem("pacienteNome");
    if (nome) setPacienteNome(nome);
  }, []);

  return (
  
    <main className="font-sans text-gray-800 bg-gradient-to-b from-slate-50 to-white">
      
      {/* ===== HERO ===== */}
      <section className="relative h-[70vh] md:h-[60vh] flex items-center justify-start text-left overflow-hidden">
        <video
          key={slides[current]}
          className="absolute inset-0 w-full h-full object-cover brightness-80"
          src={slides[current]}
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        <div className="relative z-10 max-w-3xl mx-8 md:mx-20 space-y-6 text-white">
          {pacienteNome && (
            <h2 className="text-2xl md:text-3xl text-blue-200 font-semibold">
              Olá, {pacienteNome}!
            </h2>
          )}
          <h1 className="text-4xl md:text-5xl text-blue-100 font-extrabold leading-tight drop-shadow-lg">
            TELEMEDICINA IMREA + HC
          </h1>
          <p className="text-lg md:text-xl leading-relaxed text-gray-100/90">
            Atendimento online humanizado e seguro — agende consultas,
            acesse resultados e fale com nossos profissionais.
          </p>
          <a
            href="#sobre"
            className="inline-block bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-600 hover:to-blue-500 text-white font-semibold px-8 py-3 rounded-full shadow-lg transform hover:scale-105 transition"
          >
            Saiba mais
          </a>
        </div>
      </section>

      {/* ===== SOBRE ===== */}
      <section id="sobre" className="py-20 px-8">
        <div className="max-w-7xl mx-auto grid gap-16 md:grid-cols-2 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl font-extrabold text-blue-900 drop-shadow-sm">
              Sobre Nós
            </h2>
            <p className="text-lg leading-relaxed">
              Somos estudantes da FIAP apaixonados por tecnologia e inovação. Nosso objetivo é tornar a saúde mais acessível, inclusiva e humana, unindo experiência do usuário e eficiência técnica.
            </p>
            <p className="text-lg leading-relaxed">
              Este projeto de <strong className="text-blue-900">Telemedicina</strong> nasceu para facilitar agendamentos, consultas e o acesso a resultados de exames, com segurança e praticidade.
            </p>
            <p className="text-lg leading-relaxed">
              Acreditamos que <strong className="text-blue-900">inovação</strong> e <strong className="text-blue-900">empatia</strong> transformam o cuidado com a saúde.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6">
            {["imrea 2.webp","paciente 02.webp","paciente 01.webp","apresentação.jpeg"].map((img, i) => (
              <img
                key={i}
                src={`/imgs/${img}`}
                alt="Sobre nós"
                className="rounded-2xl shadow-2xl object-cover w-full h-64 md:h-72 hover:scale-105 transition-transform"
              />
            ))}
          </div>
        </div>
      </section>

      {/* ===== SERVIÇOS ===== */}
      <section className="py-24 px-8 bg-gradient-to-b from-white to-slate-100">
        <div className="max-w-6xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-extrabold text-blue-900 drop-shadow-sm">
            Nossos Serviços
          </h2>
          <p className="text-lg text-gray-700 mt-4">
            Tecnologia e segurança para o melhor atendimento.
          </p>
        </div>
        <div className="max-w-7xl mx-auto grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Agendamento Online",
              icon: "📅",
              desc: "Agende consultas e procedimentos em poucos cliques, com confirmação imediata e lembretes automáticos.",
              action: () => setOpen("agendar"),
            },
            {
              title: "Chat com Profissionais",
              icon: "💬",
              desc: "Converse em tempo real com a equipe para tirar dúvidas e receber orientações com segurança.",
              action: () => setOpen("chat"),
            },
            {
              title: "Resultados Online",
              icon: "📄",
              desc: "Acesse laudos e exames de forma prática e segura, podendo compartilhar com seu médico.",
              action: () => setOpen("resultados"),
            },
          ].map((card) => (
            <article
              key={card.title}
              onClick={card.action}
              className="bg-white/90 backdrop-blur-md border border-white p-10 rounded-3xl shadow-xl text-center hover:shadow-2xl hover:-translate-y-2 hover:scale-105 transition-transform cursor-pointer"
            >
              <div className="text-6xl mb-6 text-blue-700">{card.icon}</div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                {card.title}
              </h3>
              <p className="text-gray-700 leading-relaxed">{card.desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ===== MODAIS ===== */}
      <Modal title="Nosso Chat" isOpen={open === "chat"} onClose={() => setOpen(null)}>
        <p className="text-gray-600">Acesse nosso canal oficial.</p>
        <a className="text-blue-600 underline" href="#">
          Abrir chat
        </a>
      </Modal>
      <Modal title="Resultados" isOpen={open === "resultados"} onClose={() => setOpen(null)}>
        <p className="text-gray-600 mb-4">Acesse o portal de resultados.</p>
        <a className="text-blue-600 underline" href="/results">
          Abrir Resultados
        </a>
      </Modal>

      {/* ===== EQUIPE ===== */}
      <section className="py-24 px-8 bg-blue-50">
        <h2 className="text-4xl font-extrabold text-center text-blue-900 mb-16 drop-shadow-sm">
          Os Alunos
        </h2>
        <div className="max-w-7xl mx-auto grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              name: "Bruno Vinicius Barbosa",
              rm: "566366 / 1TDSPY",
              img: "/imgs/aluno1.jpeg",
              linkedin: "https://www.linkedin.com/in/brunovbarbosaa",
              github: "https://github.com/brunovinicius02",
            },
            {
              name: "João Pedro Bitencourt Goldoni",
              rm: "564339 / 1TDSPX",
              img: "/imgs/aluno2.jpg",
              linkedin: "https://www.linkedin.com/in/joaopedrogoldoni",
              github: "https://github.com/JoaoPedroBitencourtGoldoni",
            },
            {
              name: "Marina Tamagnini Magalhães",
              rm: "561786 / 1TDSPX",
              img: "/imgs/aluno3.jpg",
              linkedin: "https://www.linkedin.com/in/marina-t-36b14328b",
              github: "https://github.com/marina-2907/marina",
            },
          ].map((aluno) => (
            <div
              key={aluno.name}
              className="bg-white/90 backdrop-blur-lg p-10 rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-transform"
            >
              <img
                src={aluno.img}
                alt={aluno.name}
                className="w-40 h-40 mx-auto rounded-full object-cover mb-6 ring-4 ring-blue-200"
              />
              <h3 className="text-lg font-semibold text-gray-800">{aluno.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{aluno.rm}</p>
              <div className="flex justify-center gap-5">
                <a href={aluno.linkedin} target="_blank" rel="noreferrer">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/174/174857.png"
                    alt="LinkedIn"
                    className="w-8 h-8 hover:scale-110 transition-transform"
                  />
                </a>
                <a href={aluno.github} target="_blank" rel="noreferrer">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/25/25231.png"
                    alt="GitHub"
                    className="w-8 h-8 hover:scale-110 transition-transform"
                  />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
