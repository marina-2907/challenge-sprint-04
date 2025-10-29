import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ConsultasApi, type NovaConsulta } from "../services/Api";

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

const CONSULTAS: Procedimento[] = [
  "Fisioterapia",
  "Terapia Ocupacional",
  "Fonoaudiologia",
  "Psicologia",
];

const EXAMES: Procedimento[] = [
  "Nutrição",
  "Odontologia",
  "Condicionamento Físico",
  "Hidroterapia",
  "Oficinas Terapêuticas",
  "Habilitação e Reabilitação Profissional",
];

// helpers sem libs
const onlyDigits = (s: string) => s.replace(/\D/g, "");
const maskPhone = (v: string) => {
  const d = onlyDigits(v).slice(0, 11);
  if (d.length <= 2) return `(${d}`;
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 11)
    return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  return v;
};

function isHorarioDisponivel(hora: string) {
  if (!hora) return false;
  const [h, m] = hora.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return false;
  if (h < 7 || h > 18) return false;
  if (h === 18 && m > 0) return false;
  return true;
}

export function Agendar() {
  const navigate = useNavigate();

  const [etapa, setEtapa] = useState<"menu" | "consulta" | "exame" | "meus">(
    "menu"
  );

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
  const [horaMsg, setHoraMsg] = useState<string | null>(null);
  const [erro, setErro] = useState("");
  const [okMsg, setOkMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const procedimentos = useMemo<Procedimento[]>(
    () => (etapa === "exame" ? EXAMES : CONSULTAS),
    [etapa]
  );

  const onChange =
    (name: keyof Agendamento) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const raw = e.target.value;
      let value = raw;

      if (name === "telefone") value = maskPhone(raw);
      if (name === "idade") value = onlyDigits(raw).slice(0, 3); // até 3 dígitos

      const next = { ...form, [name]: value };
      setForm(next);

      if (name === "hora") {
        setHoraMsg(
          isHorarioDisponivel(value) ? "Horário disponível!" : "Horário não disponível."
        );
      }
    };

  const escolherProcedimento = (p: Procedimento, tipo: "Consulta" | "Exame") => {
    setForm((f) => ({ ...f, tipo, procedimento: p }));
  };

  function validar(): string | null {
    if (!form.nome.trim()) return "Informe o nome do paciente.";
    if (!form.idade.trim()) return "Informe a idade.";
    const idadeNum = Number(form.idade);
    if (!Number.isFinite(idadeNum) || idadeNum <= 0) return "Idade inválida.";
    if (!form.telefone.trim() || onlyDigits(form.telefone).length < 10)
      return "Telefone inválido.";
    if (!form.procedimento) return "Escolha um procedimento.";
    if (!form.data) return "Escolha a data.";
    if (!form.hora) return "Escolha o horário.";
    if (!isHorarioDisponivel(form.hora)) return "Horário indisponível.";
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setOkMsg("");

    const msg = validar();
    if (msg) {
      setErro(msg);
      return;
    }

    // unidade escolhida automaticamente
    const unidade =
      Math.random() > 0.5
        ? "Rua Domingo de Soto 100 (Jardim Vila Mariana), São Paulo, SP"
        : "Rua Guaicurus 1274, São Paulo, SP, 05756-360";

    // Atualiza vitrine local
    const novoLocal: Agendamento = { ...form, unidade };
    setAgendamentos((prev) => [novoLocal, ...prev]);

    // Chamada real à API (POST)
    const payload: NovaConsulta = {
      paciente: form.nome,
      data: form.data,
      hora: form.hora,
      tipo: form.tipo,
      modalidade: form.modalidade,
      unidade,
      status: "AGENDADA",
    };

    try {
      setLoading(true);
      await ConsultasApi.criar(payload);
      setOkMsg("✅ Agendamento criado com sucesso!");
      // Redireciona para resultados com feedback
      setTimeout(() => {
        navigate("/resultados?msg=Agendado%20com%20sucesso");
      }, 600);
    } catch (e) {
      setErro((e as Error).message || "Erro ao agendar.");
    } finally {
      setLoading(false);
      // reseta campos sensíveis
      setForm((f) => ({ ...f, procedimento: "", data: "", hora: "" }));
      setEtapa("meus");
    }
  }

  const blocoAgendamento = (tipo: "Consulta" | "Exame") => (
    <form
      onSubmit={handleSubmit}
      className="mt-8 bg-white/90 backdrop-blur rounded-2xl p-6 md:p-10 shadow-2xl border border-white/20 text-left space-y-8"
    >
      {/* Cabeçalho da etapa */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-2xl md:text-3xl font-extrabold text-blue-900">
          {tipo === "Consulta" ? "Agendar Consulta" : "Agendar Exame"}
        </h2>
        <span className="px-3 py-1 text-sm font-bold rounded-full bg-blue-50 text-blue-700 border border-blue-200">
          {form.modalidade}
        </span>
      </div>

      {/* Linha 1: nome, idade, telefone */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <label className="flex flex-col gap-1">
          <span className="font-semibold text-slate-700">Nome do paciente *</span>
          <input
            name="nome"
            value={form.nome}
            onChange={onChange("nome")}
            placeholder="Ex.: Marina Tamagnini"
            className="p-3 rounded-xl border border-slate-300 focus:ring-4 focus:ring-blue-200 focus:border-blue-500 outline-none"
            required
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="font-semibold text-slate-700">Idade *</span>
          <input
            name="idade"
            value={form.idade}
            onChange={onChange("idade")}
            placeholder="Ex.: 20"
            className="p-3 rounded-xl border border-slate-300 focus:ring-4 focus:ring-blue-200 focus:border-blue-500 outline-none"
            required
            inputMode="numeric"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="font-semibold text-slate-700">Telefone *</span>
          <input
            name="telefone"
            value={form.telefone}
            onChange={onChange("telefone")}
            placeholder="(11) 90000-0000"
            className="p-3 rounded-xl border border-slate-300 focus:ring-4 focus:ring-blue-200 focus:border-blue-500 outline-none"
            required
            inputMode="tel"
          />
        </label>
      </div>

      {/* Modalidade */}
      <div>
        <h3 className="text-lg font-semibold text-slate-800 mb-2">
          Como deseja realizar o atendimento?
        </h3>
        <div className="flex flex-wrap gap-4">
          {(["Presencial", "Telemedicina"] as const).map((m) => (
            <label
              key={m}
              className={`cursor-pointer rounded-2xl border-2 px-4 py-2 font-medium transition
                ${
                  form.modalidade === m
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "border-blue-900 text-blue-900 hover:bg-blue-500 hover:text-white"
                }`}
            >
              <input
                type="radio"
                name="modalidade"
                value={m}
                checked={form.modalidade === m}
                onChange={onChange("modalidade")}
                className="sr-only"
              />
              {m}
            </label>
          ))}
        </div>
      </div>

      {/* Procedimentos */}
      <div>
        <h3 className="text-lg font-semibold text-slate-800 mb-2">
          Escolha o procedimento:
        </h3>
        <div className="flex flex-wrap gap-3">
          {procedimentos.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => escolherProcedimento(p, tipo)}
              className={`px-4 py-2 rounded-xl border-2 transition font-medium
                ${
                  form.procedimento === p
                    ? "bg-indigo-600 border-indigo-600 text-white"
                    : "border-indigo-900 text-indigo-900 hover:bg-indigo-500 hover:text-white"
                }`}
              aria-pressed={form.procedimento === p}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Data e hora */}
      <div>
        <h3 className="text-lg font-semibold text-slate-800 mb-2">
          Escolha a data e horário:
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex flex-col gap-1">
            <span className="font-medium text-slate-700">Data *</span>
            <input
              type="date"
              name="data"
              value={form.data}
              onChange={onChange("data")}
              required
              className="p-3 rounded-xl border border-slate-300 focus:ring-4 focus:ring-blue-200 focus:border-blue-500 outline-none"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="font-medium text-slate-700">Hora *</span>
            <input
              type="time"
              name="hora"
              value={form.hora}
              onChange={onChange("hora")}
              required
              className={`p-3 rounded-xl border focus:ring-4 focus:ring-blue-200 focus:border-blue-500 outline-none ${
                horaMsg?.includes("não") ? "border-red-500" : "border-slate-300"
              }`}
            />
          </label>
        </div>
        {horaMsg && (
          <p
            className={`mt-1 font-semibold ${
              horaMsg.includes("não") ? "text-red-600" : "text-green-600"
            }`}
            role="status"
          >
            {horaMsg}
          </p>
        )}
      </div>

      {/* Alertas */}
      {erro && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 text-rose-700 px-4 py-3">
          {erro}
        </div>
      )}
      {okMsg && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 px-4 py-3">
          {okMsg}
        </div>
      )}

      {/* Ações */}
      <div className="flex flex-col sm:flex-row justify-between gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
        >
          {loading ? "Agendando..." : "Confirmar Agendamento"}
        </button>
        <button
          type="button"
          onClick={() => setEtapa("menu")}
          className="bg-slate-200 text-slate-800 font-bold px-6 py-3 rounded-xl hover:bg-slate-300 transition"
        >
          Voltar sem Agendar
        </button>
      </div>
    </form>
  );

  return (
    <main className="font-sans min-h-screen bg-gradient-to-b from-slate-50 to-white px-6 py-10 md:py-14">
      <div className="mx-auto w-full max-w-6xl">
        <header className="text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-3 text-blue-900 drop-shadow-sm">
            Agenda de Consultas
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Escolha o tipo de atendimento, selecione o procedimento e confirme seu horário.
            Você também pode revisar seus agendamentos recentes.
          </p>
        </header>

        {/* MENU INICIAL */}
        {etapa === "menu" && (
          <section className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { label: "Agendar Consulta", next: "consulta" },
              { label: "Agendar Exame", next: "exame" },
              { label: "Meus Agendamentos", next: "meus" },
            ].map((b) => (
              <button
                key={b.next}
                onClick={() => setEtapa(b.next as never)}
                className="h-32 rounded-2xl bg-blue-900 text-white font-extrabold text-lg shadow-lg hover:scale-[1.02] hover:bg-blue-700 transition"
              >
                {b.label}
              </button>
            ))}
          </section>
        )}

        {/* FORMULÁRIOS */}
        {etapa === "consulta" && blocoAgendamento("Consulta")}
        {etapa === "exame" && blocoAgendamento("Exame")}

        {/* MEUS AGENDAMENTOS */}
        {etapa === "meus" && (
          <section className="mt-10">
            {agendamentos.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-600">
                Você ainda não possui nenhum agendamento conosco.
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {agendamentos.map((a, i) => (
                  <article
                    key={i}
                    className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition text-left"
                  >
                    <h3 className="text-blue-900 font-bold mb-2">
                      {a.tipo} ({a.modalidade}): {a.procedimento}
                    </h3>
                    <ul className="text-slate-700 text-sm space-y-1">
                      <li><strong>Paciente:</strong> {a.nome} ({a.idade} anos)</li>
                      <li><strong>Telefone:</strong> {a.telefone}</li>
                      <li><strong>Data:</strong> {a.data} • <strong>Hora:</strong> {a.hora}</li>
                      <li><strong>Unidade:</strong> {a.unidade}</li>
                    </ul>
                  </article>
                ))}
              </div>
            )}

            <div className="mt-6">
              <button
                onClick={() => setEtapa("menu")}
                className="px-6 py-3 rounded-xl bg-blue-900 text-white font-bold hover:bg-blue-700 transition"
              >
                Voltar para o Menu Principal
              </button>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
