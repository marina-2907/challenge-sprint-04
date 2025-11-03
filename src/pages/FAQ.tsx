import { useState } from "react";
import { ChevronDown } from "lucide-react";

type Question = { q: string; a: string; };

const questions: Question[] = [
  { q: "Como faço para agendar uma consulta?", a: "Acesse a aba Agendar, preencha seus dados e escolha data/horário disponíveis." },
  { q: "Posso cancelar ou remarcar minha consulta?", a: "Sim. Pelo sistema ou pelo canal de suporte você pode cancelar/remarcar." },
  { q: "O chat é com um médico ou assistente?", a: "Você fala com equipe técnica/assistentes; se preciso, encaminhamos ao profissional." },
  { q: "Os resultados ficam salvos no sistema?", a: "Sim. Laudos e históricos ficam disponíveis com segurança no portal." },
  { q: "O sistema é seguro?", a: "Seguimos padrões e criptografia para proteger seus dados." },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <main className="font-sans min-h-screen bg-gradient-to-b from-slate-50 to-white px-6 py-12">
      <section className="max-w-4xl mx-auto">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 text-orange-700 px-4 py-1.5 border border-orange-200">
            <span className="h-2 w-2 rounded-full bg-orange-500" />
            <span className="text-[13px] font-semibold tracking-wide">Dúvidas</span>
          </div>
          <h1 className="mt-3 text-3xl md:text-4xl font-extrabold text-[#0f1c3a]">
            Perguntas Frequentes (FAQ)
          </h1>
        </div>

        <div className="mt-8 space-y-4">
          {questions.map((item, i) => {
            const open = openIndex === i;
            return (
              <article
                key={i}
                onClick={() => setOpenIndex(open ? null : i)}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition cursor-pointer"
              >
                <header className="flex items-center justify-between px-5 py-4">
                  <h2 className="text-[15px] md:text-base font-semibold text-slate-800">
                    {item.q}
                  </h2>
                  <ChevronDown
                    size={18}
                    className={`text-slate-500 transition-transform ${open ? "rotate-180" : ""}`}
                  />
                </header>
                {open && (
                  <div className="px-5 pb-5 pt-0 text-slate-600">
                    {item.a}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
