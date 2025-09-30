import { useState } from "react";

type Question = {
  q: string;
  a: string;
};

const questions: Question[] = [
  {
    q: "Como faço para agendar uma consulta?",
    a: "Você pode acessar a aba 'Agendar Consulta' no menu principal, preencher seus dados e escolher data e horário disponíveis.",
  },
  {
    q: "Posso cancelar ou remarcar minha consulta?",
    a: "Sim, é possível cancelar ou remarcar diretamente pelo sistema ou entrando em contato pelo nosso canal de suporte.",
  },
  {
    q: "O chat é com um médico ou assistente?",
    a: "Nosso chat conecta você com a equipe técnica e assistentes de saúde, que podem encaminhar para o profissional adequado.",
  },
  {
    q: "Os resultados ficam salvos no sistema?",
    a: "Sim, todos os resultados e laudos ficam armazenados de forma segura e podem ser acessados pelo portal a qualquer momento.",
  },
  {
    q: "O sistema é seguro?",
    a: "Sim, utilizamos criptografia e padrões de segurança para garantir a proteção dos dados dos pacientes.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <main className="px-6 py-16 bg-slate-50 min-h-screen font-sans">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-blue-900 text-center mb-12">
          Perguntas Frequentes (FAQ)
        </h1>

        <div className="space-y-6">
          {questions.map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-md p-6 cursor-pointer transition hover:shadow-lg"
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
            >
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800">
                  {item.q}
                </h2>
                <span className="text-blue-600 font-bold text-xl">
                  {openIndex === i ? "−" : "+"}
                </span>
              </div>
              {openIndex === i && (
                <p className="mt-4 text-gray-600 leading-relaxed">{item.a}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
