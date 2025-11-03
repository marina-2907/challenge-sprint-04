import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ConsultasApi, type NovaConsulta } from "../services/Api";
import {
  CheckCircle2,
  CalendarDays,
  Clock,
  Phone,
  User2,
  MapPin,
  Stethoscope,
  FlaskConical,
  ClipboardList,
} from "lucide-react";

/* =============================== */
/* Helpers e Tipos                 */
/* =============================== */
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

const onlyDigits = (s: string) => s.replace(/\D/g, "");
const maskPhone = (v: string) => {
  const d = onlyDigits(v).slice(0, 11);
  if (!d) return "";
  if (d.length <= 2) return `(${d}`;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7, 11)}`;
};
const todayISO = () => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};
function isHorarioDisponivel(hora: string) {
  if (!hora) return false;
  const [h, m] = hora.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return false;
  if (h < 7 || h > 18) return false;
  if (h === 18 && m > 0) return false;
  return true;
}

/* =============================== */
/* Componente                      */
/* =============================== */
export function Agendar() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"consulta" | "exame" | "meus">("consulta");

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

  // mantém o tipo alinhado com a aba
  useEffect(() => {
    setForm((f) => ({ ...f, tipo: tab === "exame" ? "Exame" : "Consulta", procedimento: "" }));
  }, [tab]);

  const procedimentos = useMemo<Procedimento[]>(
    () => (tab === "exame" ? EXAMES : CONSULTAS),
    [tab]
  );

  const onChange =
    (name: keyof Agendamento) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const raw = e.target.value;
      let value = raw;
      if (name === "telefone") value = maskPhone(raw);
      if (name === "idade") value = onlyDigits(raw).slice(0, 3);
      const next = { ...form, [name]: value };
      setForm(next);
      if (name === "hora") {
        setHoraMsg(isHorarioDisponivel(value) ? "Horário disponível" : "Horário indisponível");
      }
    };

  const escolherProcedimento = (p: Procedimento) =>
    setForm((f) => ({ ...f, procedimento: p }));

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
    if (msg) return setErro(msg);

    const unidade =
      Math.random() > 0.5
        ? "Rua Domingo de Soto 100 (Jardim Vila Mariana), São Paulo, SP"
        : "Rua Guaicurus 1274, São Paulo, SP, 05756-360";

    const novoLocal: Agendamento = { ...form, unidade };
    setAgendamentos((prev) => [novoLocal, ...prev]);

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
      setTimeout(() => navigate("/resultados?msg=Agendado%20com%20sucesso"), 600);
      setForm((f) => ({ ...f, procedimento: "", data: "", hora: "" }));
      setTab("meus");
    } catch (e) {
      setErro((e as Error).message || "Erro ao agendar.");
    } finally {
      setLoading(false);
    }
  }

  /* =========== UI: Abas =========== */
  const Tabs = () => (
    <div className="mt-6 flex w-full justify-center">
      <div className="inline-flex rounded-2xl border border-slate-200 bg-white p-1 shadow-sm">
        {[
          { key: "consulta", label: "Consulta", icon: <Stethoscope size={16} /> },
          { key: "exame", label: "Exame", icon: <FlaskConical size={16} /> },
          { key: "meus", label: "Meus Agendamentos", icon: <ClipboardList size={16} /> },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key as typeof tab)}
            className={`px-4 py-2 rounded-xl text-sm font-bold inline-flex items-center gap-2 transition
              ${tab === t.key
                ? "bg-orange-600 text-white"
                : "text-slate-700 hover:bg-slate-50"}`}
          >
            {t.icon}{t.label}
          </button>
        ))}
      </div>
    </div>
  );

  /* =========== UI: Resumo lateral =========== */
  const ResumoSticky = () => (
    <aside className="hidden lg:block lg:col-span-1">
      <div className="sticky top-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="text-sm font-bold text-slate-800 mb-3">Resumo</div>
        <ul className="space-y-2 text-sm text-slate-700">
          <li className="flex items-center gap-2"><User2 size={16}/> <b>Paciente:</b>&nbsp;{form.nome || "—"}</li>
          <li className="flex items-center gap-2"><Phone size={16}/> <b>Telefone:</b>&nbsp;{form.telefone || "—"}</li>
          <li className="flex items-center gap-2"><CalendarDays size={16}/> <b>Data:</b>&nbsp;{form.data || "—"}</li>
          <li className="flex items-center gap-2"><Clock size={16}/> <b>Hora:</b>&nbsp;{form.hora || "—"}</li>
          <li className="flex items-center gap-2"><MapPin size={16}/> <b>Modalidade:</b>&nbsp;{form.modalidade}</li>
          <li><b>Tipo:</b> {form.tipo}</li>
          <li><b>Procedimento:</b> {form.procedimento || "—"}</li>
        </ul>
      </div>
    </aside>
  );

  /* =========== UI: Form principal =========== */
  const FormAgendar = () => (
    <form
      onSubmit={handleSubmit}
      className="lg:col-span-2 mt-6 bg-white/90 backdrop-blur rounded-2xl p-6 md:p-8 shadow-xl border border-slate-200/70 space-y-8"
    >
      {/* header modal/tipo */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-2xl md:text-3xl font-extrabold text-[#0f1c3a]">
          {tab === "exame" ? "Agendar Exame" : "Agendar Consulta"}
        </h2>
        <div className="flex gap-2">
          {(["Presencial", "Telemedicina"] as const).map((m) => (
            <label
              key={m}
              className={`cursor-pointer rounded-2xl border-2 px-4 py-2 text-sm font-semibold transition
              ${form.modalidade === m
                ? "bg-orange-600 border-orange-600 text-white"
                : "border-slate-300 text-slate-800 hover:bg-orange-50"}`}
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

      {/* linha 1 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <label className="flex flex-col gap-1">
          <span className="font-semibold text-slate-700">Nome do paciente *</span>
          <input
            name="nome"
            value={form.nome}
            onChange={onChange("nome")}
            placeholder="Ex.: Marina Tamagnini"
            className="p-3 rounded-xl border border-slate-300 focus:ring-4 focus:ring-orange-200 focus:border-orange-500 outline-none"
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
            className="p-3 rounded-xl border border-slate-300 focus:ring-4 focus:ring-orange-200 focus:border-orange-500 outline-none"
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
            className="p-3 rounded-xl border border-slate-300 focus:ring-4 focus:ring-orange-200 focus:border-orange-500 outline-none"
            required
            inputMode="tel"
          />
        </label>
      </div>

      {/* procedimentos */}
      <div>
        <h3 className="text-lg font-semibold text-slate-800 mb-2">Escolha o procedimento</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {procedimentos.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => escolherProcedimento(p)}
              className={`text-left px-4 py-3 rounded-xl border-2 transition text-sm font-semibold
                ${form.procedimento === p
                  ? "bg-[#0f1c3a] border-[#0f1c3a] text-white shadow"
                  : "border-slate-300 text-slate-800 hover:bg-slate-50"}`}
              aria-pressed={form.procedimento === p}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* data e hora */}
      <div>
        <h3 className="text-lg font-semibold text-slate-800 mb-2">Data e horário</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex flex-col gap-1">
            <span className="font-medium text-slate-700">Data *</span>
            <input
              type="date"
              name="data"
              value={form.data}
              min={todayISO()}
              onChange={onChange("data")}
              required
              className="p-3 rounded-xl border border-slate-300 focus:ring-4 focus:ring-orange-200 focus:border-orange-500 outline-none"
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
              className={`p-3 rounded-xl border outline-none focus:ring-4 focus:ring-orange-200 focus:border-orange-500 ${
                horaMsg?.includes("indisponível") ? "border-rose-500" : "border-slate-300"
              }`}
            />
          </label>
        </div>
        {horaMsg && (
          <p
            className={`mt-1 text-sm font-semibold ${
              horaMsg.includes("indisponível") ? "text-rose-600" : "text-emerald-600"
            }`}
          >
            {horaMsg}
          </p>
        )}
      </div>

      {/* alertas */}
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

      {/* ações */}
      <div className="flex flex-col sm:flex-row justify-between gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 bg-orange-600 text-white font-bold px-6 py-3 rounded-xl
                     hover:bg-orange-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
        >
          {loading ? "Agendando..." : "Confirmar Agendamento"}
          {!loading && <CheckCircle2 size={18} className="opacity-90" />}
        </button>
        <button
          type="button"
          onClick={() => setTab("consulta")}
          className="bg-white border border-slate-300 text-slate-800 font-bold px-6 py-3 rounded-xl hover:bg-slate-50 transition"
        >
          Voltar ao início
        </button>
      </div>
    </form>
  );

  /* =========== UI: Meus agendamentos =========== */
  const MeusCards = () => (
    <section className="lg:col-span-3">
      {agendamentos.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-600">
          Você ainda não possui nenhum agendamento.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {agendamentos.map((a, i) => (
            <article
              key={i}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition text-left"
            >
              <h3 className="text-[#0f1c3a] font-extrabold mb-2">
                {a.tipo} — {a.procedimento}
              </h3>
              <ul className="text-slate-700 text-sm space-y-1">
                <li><b>Paciente:</b> {a.nome} ({a.idade} anos)</li>
                <li><b>Telefone:</b> {a.telefone}</li>
                <li><b>Data:</b> {a.data} • <b>Hora:</b> {a.hora}</li>
                <li><b>Modalidade:</b> {a.modalidade}</li>
                <li><b>Unidade:</b> {a.unidade}</li>
              </ul>
            </article>
          ))}
        </div>
      )}
      <div className="mt-6">
        <button
          onClick={() => setTab("consulta")}
          className="px-6 py-3 rounded-xl bg-[#0f1c3a] text-white font-bold hover:bg-[#132857] transition"
        >
          Voltar para o menu
        </button>
      </div>
    </section>
  );

  /* =========== Render =========== */
  return (
    <main className="min-h-screen font-sans bg-gradient-to-b from-slate-50 to-white px-6 py-10 md:py-14">
      <div className="mx-auto w-full max-w-6xl">
        {/* título */}
        <header className="text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-3 text-[#0f1c3a]">
            Agendamentos
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Escolha o tipo de atendimento, selecione o procedimento e confirme seu horário.
          </p>
        </header>

        <Tabs />

        {/* grid principal */}
        <section className="mt-8 grid lg:grid-cols-3 gap-6 items-start">
          {(tab === "consulta" || tab === "exame") && (
            <>
              <ResumoSticky />
              <FormAgendar />
            </>
          )}
          {tab === "meus" && <MeusCards />}
        </section>
      </div>
    </main>
  );
}
