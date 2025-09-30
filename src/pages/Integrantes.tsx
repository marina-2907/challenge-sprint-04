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
    <main className="px-6 py-16 bg-gradient-to-b from-slate-50 to-white min-h-screen font-sans">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold text-blue-900 text-center mb-12">
          Nosso Grupo
        </h1>

        <p className="text-center text-lg text-gray-600 max-w-3xl mx-auto mb-16">
          Somos estudantes da FIAP apaixonados por tecnologia e inovação.
          Este projeto foi desenvolvido com o objetivo de transformar
          a saúde digital em algo mais acessível, humano e seguro.
        </p>

        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
          {membros.map((aluno) => (
            <div
              key={aluno.nome}
              className="bg-white/90 backdrop-blur-lg p-8 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-transform text-center"
            >
              <img
                src={aluno.img}
                alt={aluno.nome}
                className="w-32 h-32 mx-auto rounded-full object-cover mb-6 ring-4 ring-blue-200"
              />
              <h3 className="text-lg font-semibold text-gray-800">
                {aluno.nome}
              </h3>
              <p className="text-sm text-gray-600 mb-4">{aluno.rm}</p>
              <div className="flex justify-center gap-5">
                <a href={aluno.linkedin} target="_blank" rel="noreferrer">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/174/174857.png"
                    alt="LinkedIn"
                    className="w-7 h-7 hover:scale-110 transition-transform"
                  />
                </a>
                <a href={aluno.github} target="_blank" rel="noreferrer">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/25/25231.png"
                    alt="GitHub"
                    className="w-7 h-7 hover:scale-110 transition-transform"
                  />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
