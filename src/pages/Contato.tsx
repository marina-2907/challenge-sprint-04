import { Phone, MapPin, Globe2 } from "lucide-react";

export function Contato() {
  return (
    <main className="font-sans min-h-screen bg-gradient-to-b from-slate-50 to-white px-6 py-12">
      <section className="max-w-6xl mx-auto">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 text-orange-700 px-4 py-1.5 border border-orange-200">
            <span className="h-2 w-2 rounded-full bg-orange-500" />
            <span className="text-[13px] font-semibold tracking-wide">Fale Conosco</span>
          </div>
          <h1 className="mt-3 text-3xl md:text-4xl font-extrabold text-[#0f1c3a]">
            Entre em Contato
          </h1>
          <p className="mt-2 text-slate-600 max-w-2xl mx-auto">
            Estamos disponíveis para esclarecer dúvidas, receber sugestões e ajudar no que for necessário.
          </p>
        </div>

        <div className="mt-10 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <article className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition">
            <div className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-orange-100 text-orange-700 mb-4">
              <Phone size={18} />
            </div>
            <h2 className="text-xl font-extrabold text-[#0f1c3a] mb-1">Telefone</h2>
            <p className="text-slate-700 text-lg">(11) 5180-7800</p>
          </article>

          <article className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition">
            <div className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-orange-100 text-orange-700 mb-4">
              <MapPin size={18} />
            </div>
            <h2 className="text-xl font-extrabold text-[#0f1c3a] mb-1">Endereço</h2>
            <p className="text-slate-700 text-lg">
              Rua Domingo de Soto, 100 – Vila Mariana, São Paulo
            </p>
          </article>

          <article className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition">
            <div className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-orange-100 text-orange-700 mb-4">
              <Globe2 size={18} />
            </div>
            <h2 className="text-xl font-extrabold text-[#0f1c3a] mb-1">Site Oficial</h2>
            <a
              href="https://redelucymontoro.org.br/site/"
              target="_blank"
              rel="noreferrer"
              className="text-slate-700 text-lg hover:text-orange-600 hover:underline break-all"
            >
              imrea.org.br
            </a>
          </article>
        </div>
      </section>
    </main>
  );
}
