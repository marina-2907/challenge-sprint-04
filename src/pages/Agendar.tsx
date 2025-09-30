import { useState } from "react";

type Procedimento = string;
type Agendamento = {
  nome: string;
  idade: string;
  telefone: string;
  tipo: "Consulta" | "Exame";
  modalidade: "Presencial" | "Telemedicina";
  procedimento: Procedimento;
  data: string;
  hora: string;
  unidade: string;
};

const consultas: Procedimento[] = [
  "Fisioterapia",
  "Terapia Ocupacional",
  "Fonoaudiologia",
  "Psicologia",
];

const exames: Procedimento[] = [
  "Nutrição",
  "Odontologia",
  "Condicionamento Físico",
  "Hidroterapia",
  "Oficinas Terapêuticas",
  "Habilitação e Reabilitação Profissional",
];

export function Agendar() {
  const [etapa, setEtapa] = useState<"menu" | "consulta" | "exame" | "meus">("menu");
  const [form, setForm] = useState<Agendamento>({
    nome: "",
    idade: "",
    telefone: "",
    tipo: "Consulta",
    modalidade: "Presencial",
    procedimento: "",
    data: "",
    hora: "",
    unidade: "",
  });
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [confirmado, setConfirmado] = useState("");
  const [horaMsg, setHoraMsg] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));

    if (name === "hora") {
      setHoraMsg(
        isHorarioDisponivel(value)
          ? "Horário disponível!"
          : "Horário não disponível."
      );
    }
  };

  function isHorarioDisponivel(hora: string) {
    const [h, m] = hora.split(":").map(Number);
    if (!h || h < 7 || h > 18) return false;
    if (h === 18 && m > 0) return false;
    return true;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.nome ||
      !form.idade ||
      !form.telefone ||
      !form.procedimento ||
      !form.data ||
      !form.hora
    )
      return;

    if (!isHorarioDisponivel(form.hora)) {
      setHoraMsg(" Horário não disponível");
      return;
    }

    const unidade =
      Math.random() > 0.5
        ? "Rua Domingo de Soto 100 (Jardim Vila Mariana), São Paulo, SP"
        : "Rua Guaicurus 1274, São Paulo, SP, 05756-360";

    const novo = { ...form, unidade };
    setAgendamentos((prev) => [...prev, novo]);
    setConfirmado(`✅ ${form.tipo} (${form.modalidade}) agendado com sucesso!`);
    setForm({ ...form, procedimento: "", data: "", hora: "" });
    setEtapa("meus");
  };

  const blocoAgendamento = (tipo: "Consulta" | "Exame", procedimentos: Procedimento[]) => (
    <form onSubmit={handleSubmit} className="mt-10 bg-white shadow-xl rounded-2xl p-10 text-left space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <input
          name="nome"
          value={form.nome}
          onChange={handleChange}
          placeholder="Nome do paciente *"
          required
          className="p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500"
        />
        <input
          name="idade"
          value={form.idade}
          onChange={handleChange}
          placeholder="Idade *"
          required
          className="p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500"
        />
        <input
          name="telefone"
          value={form.telefone}
          onChange={handleChange}
          placeholder="Telefone *"
          required
          className="p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold text-slate-800 mb-2">
          Como deseja realizar o atendimento?
        </h3>
        <div className="flex gap-6">
          {["Presencial", "Telemedicina"].map((m) => (
            <label key={m} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="modalidade"
                value={m}
                checked={form.modalidade === m}
                onChange={handleChange}
              />
              {m}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-slate-800 mb-2">
          Escolha o procedimento:
        </h3>
        <div className="flex flex-wrap gap-4">
          {procedimentos.map((p) => (
            <button
              key={p}
              type="button"
              className={`px-4 py-2 rounded-lg border-2 transition font-medium
                ${form.procedimento === p
                  ? "bg-blue-600 border-blue-600 text-white"
                  : "border-blue-900 text-blue-900 hover:bg-blue-500 hover:text-white"
                }`}
              onClick={() => setForm({ ...form, tipo, procedimento: p })}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-slate-800 mb-2">
          Escolha a data e horário:
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            type="date"
            name="data"
            value={form.data}
            onChange={handleChange}
            required
            className="p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="time"
            name="hora"
            value={form.hora}
            onChange={handleChange}
            required
            className={`p-3 rounded-lg border focus:ring-2 focus:ring-blue-500
              ${horaMsg?.includes("não") ? "border-red-500" : "border-slate-300"}
            `}
          />
        </div>
      </div>

      {horaMsg && (
        <p
          className={`font-semibold ${
            horaMsg.includes("não") ? "text-red-600" : "text-green-600"
          }`}
        >
          {horaMsg}
        </p>
      )}

      {confirmado && <p className="text-green-600 font-semibold">{confirmado}</p>}

      <div className="flex justify-between gap-4 pt-4">
        <button
          type="submit"
          className="bg-blue-600 text-white font-bold px-8 py-3 rounded-lg hover:bg-blue-800 transition"
        >
          Confirmar Agendamento
        </button>
        <button
          type="button"
          onClick={() => setEtapa("menu")}
          className="bg-gray-400 text-white font-bold px-8 py-3 rounded-lg hover:bg-gray-600 transition"
        >
          Voltar sem Agendar
        </button>
      </div>
    </form>
  );

  return (
    <main className="font-sans bg-gradient-to-b from-slate-50 to-white py-50 px-6 flex justify-center">
      <div className="w-full max-w-4xl text-center">
        <h1 className="text-4xl font-extrabold mb-12 text-blue-900 drop-shadow-sm">
          Agenda de Consultas
        </h1>

        {etapa === "menu" && (
          <div className="flex flex-wrap justify-center gap-8">
            {[
              { label: "Agendar Consulta", next: "consulta" },
              { label: "Agendar Exame", next: "exame" },
              { label: "Meus Agendamentos", next: "meus" },
            ].map((b) => (
              <button
                key={b.next}
                onClick={() => setEtapa(b.next as never)}
                className="w-64 h-32 flex items-center justify-center
                  bg-blue-900 text-white rounded-xl font-bold text-lg
                  shadow-lg hover:scale-105 hover:bg-blue-700 transition"
              >
                {b.label}
              </button>
            ))}
          </div>
        )}

        {etapa === "consulta" && blocoAgendamento("Consulta", consultas)}
        {etapa === "exame" && blocoAgendamento("Exame", exames)}

        {etapa === "meus" && (
          <div className="mt-10 text-left">
            {agendamentos.length === 0 ? (
              <p className="text-slate-600">
                Você ainda não possui nenhum agendamento conosco.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {agendamentos.map((a, i) => (
                  <div key={i} className="bg-white rounded-xl p-6 shadow-md text-left hover:shadow-lg transition">
                    <h3 className="text-blue-900 font-semibold mb-2">
                      {a.tipo} ({a.modalidade}): {a.procedimento}
                    </h3>
                    <p><strong>Paciente:</strong> {a.nome} ({a.idade} anos)</p>
                    <p><strong>Telefone:</strong> {a.telefone}</p>
                    <p><strong>Data:</strong> {a.data}</p>
                    <p><strong>Horário:</strong> {a.hora}</p>
                    <p><strong>Local:</strong> {a.unidade}</p>
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={() => setEtapa("menu")}
              className="mt-8 px-8 py-3 bg-blue-900 text-white rounded-lg font-bold hover:bg-blue-600 transition"
            >
              Voltar para o Menu Principal
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
