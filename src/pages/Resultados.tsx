import { useNavigate } from "react-router-dom";

export function Resultados() {
  const navigate = useNavigate();

  const downloadFile = (filePath: string, fileName: string) => {
    const link = document.createElement("a");
    link.href = filePath;
    link.download = fileName;
    link.click();
  };

  const item = (img: string, label: string, key: string, file: string) => (
    <div
      key={key}
      className="flex flex-col items-center bg-white rounded-2xl p-8 w-full max-w-[260px] text-center shadow-md border border-slate-200
                 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-blue-400"
    >
      <img
        src={img}
        alt={label}
        className="h-32 w-32 object-contain rounded-xl mb-4 transition-transform duration-300 hover:scale-110"
      />
      <h3 className="text-xl font-semibold text-gray-800 mb-4">{label}</h3>

      <button
        onClick={() => downloadFile(file, `${label.toLowerCase()}.txt`)}
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold px-6 py-3 rounded-full shadow-md
                   hover:from-indigo-600 hover:to-blue-600 hover:shadow-lg transition-transform hover:-translate-y-0.5"
      >
        Baixar {label}
      </button>
    </div>
  );

  return (
    <main className="font-sans min-h-screen py-28 px-6 bg-gradient-to-br from-slate-50 via-white to-slate-100 flex flex-col items-center">
      <h1 className="text-4xl md:text-5xl font-extrabold text-blue-900 text-center mb-16 tracking-wide drop-shadow-sm">
        Resultados do Paciente
      </h1>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-12 w-full max-w-6xl justify-items-center">
        {item("imgs/exame.jpg", "Exames", "exames", "./txt/exames.txt")}
        {item("imgs/novo laudo.png", "Laudos", "laudos", "./txt/laudos.txt")}
        {item("imgs/receita.avif", "Receitas", "receitas", "./txt/receita.txt")}
        <div
          className="flex flex-col items-center bg-white rounded-2xl p-8 w-full max-w-[260px] text-center shadow-md border border-slate-200
                     transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-blue-400 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img
            src="imgs/voltar.png"
            alt="Voltar"
            className="h-32 w-32 object-contain rounded-xl mb-4 transition-transform duration-300 hover:scale-110"
          />
          <br></br><br></br>          
          <button
            className="w-full bg-gradient-to-r from-gray-400 to-gray-500 text-white font-semibold px-6 py-3 rounded-full shadow-md
                       hover:from-gray-500 hover:to-gray-400 hover:shadow-lg transition-transform hover:-translate-y-0.5"
          >
            Ir para Home
          </button>
        </div>
      </div>
    </main>
  );
}
