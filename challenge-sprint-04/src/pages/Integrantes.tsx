import { Linkedin, Github } from "lucide-react";

export function Integrantes() {
  const membros = [
    {
      nome: "Bruno Vinicius Barbosa",
      rm: "566366 / 1TDSPY",
      img: "/imgs/aluno1.jpeg",
      linkedin: "https://www.linkedin.com/in/brunovbarbosaa",
      github: "https://github.com/brunovinicius02",
    },
    {
      nome: "João Pedro Bitencourt Goldoni",
      rm: "564339 / 1TDSPX",
      img: "/imgs/aluno2.jpg",
      linkedin: "https://www.linkedin.com/in/joaopedrogoldoni",
      github: "https://github.com/JoaoPedroBitencourtGoldoni",
    },
    {
      nome: "Marina Tamagnini Magalhães",
      rm: "561786 / 1TDSPX",
      img: "/imgs/aluno3.jpg",
      linkedin: "https://www.linkedin.com/in/marina-t-36b14328b",
      github: "https://github.com/marina-2907/marina",
    },
  ];

  return (
    <main className="font-sans min-h-screen bg-gradient-to-b from-slate-50 to-white px-6 py-12">
      <section className="max-w-6xl mx-auto">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 text-orange-700 px-4 py-1.5 border border-orange-200">
            <span className="h-2 w-2 rounded-full bg-orange-500" />
            <span className="text-[13px] font-semibold tracking-wide">Equipe</span>
          </div>
          <h1 className="mt-3 text-3xl md:text-4xl font-extrabold text-[#0f1c3a]">
            Nosso Grupo
          </h1>
          <p className="mt-2 text-slate-600 max-w-3xl mx-auto">
            Estudantes da FIAP, apaixonados por tecnologia e inovação. Este projeto busca tornar a saúde digital mais acessível, humana e segura.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {membros.map((aluno) => (
            <article
              key={aluno.nome}
              className="bg-white/90 backdrop-blur p-7 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition text-center"
            >
              <img
                src={aluno.img}
                alt={aluno.nome}
                className="w-28 h-28 mx-auto rounded-full object-cover mb-5 ring-4 ring-orange-100"
              />
              <h3 className="text-[17px] font-extrabold text-[#0f1c3a]">{aluno.nome}</h3>
              <p className="text-sm text-slate-600 mb-5">{aluno.rm}</p>

              <div className="flex justify-center gap-3">
                <a
                  href={aluno.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-slate-700 hover:text-orange-600 font-semibold text-sm bg-slate-100 hover:bg-orange-50 border border-slate-200 hover:border-orange-200 px-3 py-2 rounded-xl transition"
                >
                  <Linkedin size={16} /> LinkedIn
                </a>
                <a
                  href={aluno.github}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-slate-700 hover:text-orange-600 font-semibold text-sm bg-slate-100 hover:bg-orange-50 border border-slate-200 hover:border-orange-200 px-3 py-2 rounded-xl transition"
                >
                  <Github size={16} /> GitHub
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
