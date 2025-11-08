import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2, CalendarDays, Clock, Phone, User2, MapPin,
  Stethoscope, FlaskConical, ClipboardList
} from "lucide-react";

/* =============================== */
/* Tipos e helpers                 */
/* =============================== */
type Status = "AGENDADA" | "CANCELADA" | "CONCLUIDA";
type Procedimento = string;

type Consulta = {
  id: number;
  paciente: string;
  tipo: "Consulta" | "Exame";
  modalidade: "Presencial" | "Telemedicina";
  unidade: string;
  data: string;   // yyyy-mm-dd
  hora: string;   // HH:mm
  status: Status; // default: AGENDADA
  procedimento?: Procedimento;
};

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

const CONSULTAS: Procedimento[] = ["Fisioterapia","Terapia Ocupacional","Fonoaudiologia","Psicologia"];
const EXAMES: Procedimento[] = [
  "Nutrição","Odontologia","Condicionamento Físico","Hidroterapia",
  "Oficinas Terapêuticas","Habilitação e Reabilitação Profissional",
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
// ===== formatações e janelas =====
const fmtDataBr = (isoDate: string) => {
  const [y, m, d] = isoDate.split("-").map(Number);
  if (!y || !m || !d) return isoDate;
  return `${String(d).padStart(2,"0")}/${String(m).padStart(2,"0")}/${y}`;
};
const addMinutesToHHMM = (hhmm: string, minutes: number) => {
  const [h, m] = hhmm.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return hhmm;
  const base = new Date();
  base.setHours(h, m, 0, 0);
  base.setMinutes(base.getMinutes() + minutes);
  const hh = String(base.getHours()).padStart(2, "0");
  const mm = String(base.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
};
const toDate = (dateISO: string, timeHHMM: string) => {
  const [y, m, d] = dateISO.split("-").map(Number);
  const [hh, mm] = timeHHMM.split(":").map(Number);
  const dt = new Date(y, (m ?? 1) - 1, d ?? 1, hh ?? 0, mm ?? 0, 0, 0);
  return dt;
};
const humanDayTag = (dateISO: string) => {
  const target = toDate(dateISO, "00:00");
  const today = new Date();
  const zero = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate());
  const diffDays = Math.round((zero(target).getTime() - zero(today).getTime())/86400000);
  if (diffDays === 0) return "Hoje";
  if (diffDays === 1) return "Amanhã";
  if (diffDays === -1) return "Ontem";
  return diffDays > 1 ? `Em ${diffDays} dias` : `${Math.abs(diffDays)} dia(s) atrás`;
};

/* =============================== */
/* "Banco" local (consultas)       */
/* =============================== */
const LS_KEY = "consultas";
function getConsultas(): Consulta[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    const arr = raw ? (JSON.parse(raw) as Consulta[]) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}
function saveConsultas(list: Consulta[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(list));
}
function nextId(list: Consulta[]) {
  return list.length ? Math.max(...list.map((c) => c.id)) + 1 : 1;
}

/* =============================== */
/* Componente                      */
/* =============================== */
export function Agendar() {
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

  // Lista que aparece em "Meus Agendamentos": vem do storage (Consulta[])
  const [minhas, setMinhas] = useState<Consulta[]>([]);
  const [horaMsg, setHoraMsg] = useState<string | null>(null);
  const [erro, setErro] = useState("");
  const [okMsg, setOkMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // manter tipo alinhado com a aba
  useEffect(() => {
    setForm((f) => ({ ...f, tipo: tab === "exame" ? "Exame" : "Consulta", procedimento: "" }));
  }, [tab]);

  function recarregarMinhas() {
    const all = getConsultas();
    all.sort((a, b) => b.id - a.id); // mostrar mais recentes primeiro
    setMinhas(all);
  }
  useEffect(() => {
    recarregarMinhas();
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
    if (!form.telefone.trim() || onlyDigits(form.telefone).length < 10) return "Telefone inválido.";
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

    // unidade "fake" (pode virar select)
    const unidade =
      Math.random() > 0.5
        ? "Rua Domingo de Soto 100 (Jardim Vila Mariana), São Paulo, SP"
        : "Rua Guaicurus 1274, São Paulo, SP, 05756-360";

    try {
      setLoading(true);

      const list = getConsultas();
      const nova: Consulta = {
        id: nextId(list),
        paciente: form.nome.trim(),
        tipo: form.tipo,
        modalidade: form.modalidade,
        unidade,
        data: form.data,
        hora: form.hora,
        status: "AGENDADA",
        procedimento: form.procedimento,
      };

      const updated = [nova, ...list];
      saveConsultas(updated);

      // já atualiza a UI imediatamente
      setMinhas((prev) => [nova, ...prev]);
      setOkMsg("Agendamento criado com sucesso!");
      setTab("meus");

      // limpa só o necessário
      setForm((f) => ({ ...f, procedimento: "", data: "", hora: "" }));

      // rolar até os cards
      setTimeout(() => {
        const el = document.getElementById("meus-agendamentos");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 0);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setErro(err?.message || "Erro ao agendar.");
    } finally {
      setLoading(false);
    }
  }

  /* =========== UI: Abas =========== */
  const NavTabs = () => (
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
              ${tab === t.key ? "bg-orange-600 text-white" : "text-slate-700 hover:bg-slate-50"}`}
          >
            {t.icon}{t.label}
          </button>
        ))}
      </div>
    </div>
  );

  /* =========== Pílula de status =========== */
  const StatusPill = ({ status }: { status: Status }) => {
    const map: Record<Status, string> = {
      AGENDADA: "bg-blue-100 text-blue-800",
      CANCELADA: "bg-rose-100 text-rose-700",
      CONCLUIDA: "bg-emerald-100 text-emerald-700",
    };
    return (
      <span className={`text-[11px] font-bold rounded-full px-2.5 py-1 ${map[status]}`}>
        {status}
      </span>
    );
  };

  /* =========== Resumo lateral =========== */
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

  /* =========== Form principal (Agendar) =========== */
  const FormAgendar = () => (
    <form
      onSubmit={handleSubmit}
      className="lg:col-span-2 mt-6 bg-white/90 backdrop-blur rounded-2xl p-6 md:p-8 shadow-xl border border-slate-200/70 space-y-8"
    >
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

  /* =========== Meus agendamentos (cards bonitos + tolerância) =========== */
  const MeusCards = () => (
    <section id="meus-agendamentos" className="lg:col-span-3">
      {minhas.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-600">
          Você ainda não possui nenhum agendamento.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {minhas.map((c) => {
            const chegadaLimite = addMinutesToHHMM(c.hora, 10); // tolerância 10 min
            const dayTag = humanDayTag(c.data);
            const dt = toDate(c.data, c.hora);
            const now = new Date();
            let chip = "Próximo";
            if (dt.toDateString() === now.toDateString()) chip = "Hoje";
            if (dt.getTime() < now.getTime()) chip = "Passado";

            return (
              <article
                key={c.id}
                className="relative bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition text-left"
              >
                <div className="absolute -top-2 -right-2 px-2 py-0.5 text-[11px] font-bold rounded-full border border-slate-200 bg-white">
                  #{c.id}
                </div>

                <div className="flex items-center justify-between">
                  <h3 className="text-[#0f1c3a] font-extrabold">
                    {c.tipo}{c.procedimento ? ` · ${c.procedimento}` : ""}
                  </h3>
                  <StatusPill status={c.status} />
                </div>

                <div className="mt-3 space-y-2 text-slate-700 text-sm">
                  <div className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold border border-slate-200 bg-slate-50">
                    <span className={`h-2 w-2 rounded-full ${chip === "Passado" ? "bg-slate-400" : chip === "Hoje" ? "bg-amber-500" : "bg-emerald-500"}`} />
                    {dayTag}
                  </div>

                  <p className="flex items-center gap-2">
                    <CalendarDays size={16} className="text-orange-600" />
                    <b>Data:</b>&nbsp;{fmtDataBr(c.data)}
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock size={16} className="text-orange-600" />
                    <b>Hora:</b>&nbsp;{c.hora}
                  </p>
                  <p className="flex items-start gap-2">
                    <MapPin size={16} className="text-orange-600 mt-0.5" />
                    <span><b>Unidade:</b> {c.unidade} <i className="text-slate-500">({c.modalidade})</i></span>
                  </p>

                  <div className="mt-2 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800 px-3 py-2">
                    <b>Tolerância:</b> chegue até <b>{chegadaLimite}</b> (10 min de atraso).
                  </div>
                </div>
              </article>
            );
          })}
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
        <header className="text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-3 text-[#0f1c3a]">
            Agendamentos
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Escolha o tipo de atendimento, selecione o procedimento e confirme seu horário.
          </p>
          {okMsg && (
            <div className="mx-auto mt-3 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 px-4 py-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-[13px] font-semibold">{okMsg}</span>
            </div>
          )}
          {erro && (
            <div className="mx-auto mt-3 inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 text-rose-700 px-4 py-1.5">
              <span className="h-2 w-2 rounded-full bg-rose-500" />
              <span className="text-[13px] font-semibold">{erro}</span>
            </div>
          )}
        </header>

        <NavTabs />

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
