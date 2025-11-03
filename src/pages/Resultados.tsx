import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ConsultasApi, type Consulta } from "../services/Api";
import { CalendarDays, Clock, MapPin, RefreshCw, X, FileDown, Plus } from "lucide-react";

/* ——— Alerta simples lendo ?msg= da URL (feedback pós-ação) ——— */
function AlertFromQuery() {
  const { search } = useLocation();
  const params = useMemo(() => new URLSearchParams(search), [search]);
  const msg = params.get("msg");
  if (!msg) return null;
  return (
    <div className="mx-auto max-w-7xl mb-4 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 px-4 py-2">
      {decodeURIComponent(msg)}
    </div>
  );
}

/* ——— Helpers UI ——— */
const StatusPill = ({ status }: { status?: string }) => {
  const s = (status || "AGENDADA").toUpperCase();
  const map = {
    AGENDADA: "bg-blue-100 text-blue-800",
    CANCELADA: "bg-rose-100 text-rose-700",
    CONCLUIDA: "bg-emerald-100 text-emerald-700",
  } as const;
  const cls = map[s as keyof typeof map] ?? "bg-slate-100 text-slate-700";
  return <span className={`text-[11px] font-bold rounded-full px-2.5 py-1 ${cls}`}>{s}</span>;
};

const Skel = () => (
  <div className="animate-pulse rounded-2xl border border-slate-200 bg-white p-4">
    <div className="h-4 w-1/3 bg-slate-200 rounded" />
    <div className="mt-3 space-y-2">
      <div className="h-3 w-2/3 bg-slate-200 rounded" />
      <div className="h-3 w-1/2 bg-slate-200 rounded" />
      <div className="h-3 w-1/2 bg-slate-200 rounded" />
    </div>
    <div className="mt-4 grid grid-cols-3 gap-2">
      <div className="h-9 bg-slate-200 rounded" />
      <div className="h-9 bg-slate-200 rounded" />
      <div className="h-9 bg-slate-200 rounded" />
    </div>
  </div>
);

/* ——— Modais básicos ——— */
function ModalBase({
  title,
  onClose,
  children,
  footer,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4 bg-black/40">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-slate-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-extrabold text-[#0f1c3a]">{title}</h3>
          <button onClick={onClose} className="p-1.5 rounded hover:bg-slate-100">
            <X size={18} />
          </button>
        </div>
        <div className="mt-4">{children}</div>
        {footer && <div className="mt-4 flex justify-end gap-2">{footer}</div>}
      </div>
    </div>
  );
}

export function Resultados() {
  const navigate = useNavigate();

  // ====== Estado CRUD ======
  const [lista, setLista] = useState<Consulta[]>([]);
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(true);

  // Reagendar
  const [editing, setEditing] = useState<{ id: number; data: string; hora: string } | null>(null);
  // Cancelar
  const [cancelando, setCancelando] = useState<{ id: number; motivo: string } | null>(null);

  async function carregar() {
    try {
      setLoading(true);
      const dados = await ConsultasApi.listar();
      setLista(dados);
      setErro("");
    } catch (e) {
      setErro((e as Error).message || "Erro ao carregar consultas.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void carregar();
  }, []);

  async function onReagendar() {
    if (!editing) return;
    try {
      await ConsultasApi.reagendar(editing.id, editing.data, editing.hora);
      setEditing(null);
      navigate("/resultados?msg=Consulta%20reagendada");
      await carregar();
    } catch (e) {
      alert("Erro ao reagendar: " + (e as Error).message);
    }
  }

  async function onCancelar() {
    if (!cancelando) return;
    try {
      await ConsultasApi.cancelar(cancelando.id, cancelando.motivo || "Sem motivo");
      setCancelando(null);
      navigate("/resultados?msg=Consulta%20cancelada");
      await carregar();
    } catch (e) {
      alert("Erro ao cancelar: " + (e as Error).message);
    }
  }

  async function onDelete(id: number) {
    if (!confirm("Confirma excluir esta consulta?")) return;
    try {
      await ConsultasApi.deletar(id);
      navigate("/resultados?msg=Consulta%20exclu%C3%ADda");
      await carregar();
    } catch (e) {
      alert("Erro ao excluir: " + (e as Error).message);
    }
  }

  // ====== Downloads ======
  const downloadFile = (filePath: string, fileName: string) => {
    const link = document.createElement("a");
    link.href = filePath;
    link.download = fileName;
    link.click();
  };

  const cardDownload = (img: string, label: string, key: string, file: string) => (
    <div
      key={key}
      className="group flex flex-col items-center bg-white rounded-2xl p-7 w-full max-w-[280px] text-center shadow-sm border border-slate-200
                 transition-all hover:-translate-y-1 hover:shadow-lg hover:border-orange-300/80"
    >
      <div className="relative">
        <img
          src={img}
          alt={label}
          className="h-28 w-28 object-contain rounded-xl mb-3 transition-transform group-hover:scale-105"
        />
        <span className="absolute -right-2 -top-2 inline-flex items-center justify-center h-7 w-7 rounded-full bg-orange-100 text-orange-700">
          <FileDown size={16} />
        </span>
      </div>
      <h3 className="text-base font-extrabold text-[#0f1c3a]">{label}</h3>

      <button
        onClick={() => downloadFile(file, `${label.toLowerCase()}.txt`)}
        className="mt-3 w-full inline-flex items-center justify-center gap-2 bg-orange-600 text-white font-semibold px-5 py-2.5 rounded-xl shadow
                   hover:bg-orange-700 transition"
      >
        Baixar {label}
      </button>
    </div>
  );

  return (
    <main className="font-sans min-h-screen py-10 md:py-16 px-6 bg-gradient-to-b from-slate-50 to-white">
      {/* Feedback via query string */}
      <AlertFromQuery />

      {/* Título */}
      <section className="mx-auto w-full max-w-7xl">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 text-orange-700 px-4 py-1.5 border border-orange-200">
            <span className="h-2 w-2 rounded-full bg-orange-500" />
            <span className="text-[13px] font-semibold tracking-wide">Resultados</span>
          </div>
          <h1 className="mt-3 text-3xl md:text-4xl font-extrabold text-[#0f1c3a]">
            Resultados do Paciente
          </h1>
        </div>

        {/* ====== BLOCO 1 — Minhas Consultas (CRUD) ====== */}
        <div className="mt-8 md:mt-12">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <h2 className="text-xl md:text-2xl font-extrabold text-[#0f1c3a]">
              Minhas Consultas
            </h2>
            <div className="flex gap-2">
              <button
                onClick={carregar}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                <RefreshCw size={16} /> Atualizar
              </button>
              <button
                onClick={() => navigate("/agendar")}
                className="inline-flex items-center gap-2 rounded-xl bg-orange-600 text-white font-semibold px-4 py-2 hover:bg-orange-700"
              >
                <Plus size={16} /> Nova consulta
              </button>
            </div>
          </div>

          {erro && (
            <p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 px-4 py-3">
              {erro}
            </p>
          )}

          {loading && (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Skel />
              <Skel />
              <Skel />
            </div>
          )}

          {!loading && !erro && (
            <>
              {lista.length === 0 ? (
                <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 text-slate-600">
                  Nenhuma consulta encontrada.
                </div>
              ) : (
                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {lista.map((c) => (
                    <article
                      key={c.id}
                      className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition"
                    >
                      <header className="flex items-center justify-between">
                        <h3 className="text-[15px] md:text-base font-extrabold text-[#0f1c3a]">
                          #{c.id} • {c.tipo ?? "Consulta"}
                        </h3>
                        <StatusPill status={c.status} />
                      </header>

                      <div className="mt-3 text-[13px] md:text-sm text-slate-700 space-y-1.5">
                        <p><b>Paciente:</b> {c.paciente}</p>
                        <p className="flex items-center gap-1">
                          <CalendarDays size={16} className="text-orange-600" />
                          <b>Data:</b>&nbsp;{c.data}
                        </p>
                        <p className="flex items-center gap-1">
                          <Clock size={16} className="text-orange-600" />
                          <b>Hora:</b>&nbsp;{c.hora}
                        </p>
                        {c.modalidade && (
                          <p><b>Modalidade:</b> {c.modalidade}</p>
                        )}
                        {c.unidade && (
                          <p className="flex items-start gap-1">
                            <MapPin size={16} className="text-orange-600 mt-0.5" />
                            <span><b>Unidade:</b> {c.unidade}</span>
                          </p>
                        )}
                      </div>

                      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <button
                          className="rounded-xl bg-amber-500 text-white font-semibold py-2 hover:bg-amber-600"
                          onClick={() => setEditing({ id: c.id, data: c.data, hora: c.hora })}
                        >
                          Reagendar
                        </button>
                        <button
                          className="rounded-xl bg-rose-500 text-white font-semibold py-2 hover:bg-rose-600"
                          onClick={() => setCancelando({ id: c.id, motivo: "" })}
                        >
                          Cancelar
                        </button>
                        <button
                          className="rounded-xl bg-slate-200 text-slate-800 font-semibold py-2 hover:bg-slate-300 sm:col-span-2"
                          onClick={() => onDelete(c.id)}
                        >
                          Excluir
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* ====== BLOCO 2 — Meus Documentos (Downloads) ====== */}
        <div className="mt-12 md:mt-16">
          <h2 className="text-xl md:text-2xl font-extrabold text-[#0f1c3a] mb-6">
            Meus Documentos
          </h2>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-8 w-full justify-items-center">
            {cardDownload("imgs/exame.jpg", "Exames", "exames", "./txt/exames.txt")}
            {cardDownload("imgs/novo laudo.png", "Laudos", "laudos", "./txt/laudos.txt")}
            {cardDownload("imgs/receita.avif", "Receitas", "receitas", "./txt/receita.txt")}
            <div
              className="group flex flex-col items-center bg-white rounded-2xl p-7 w-full max-w-[280px] text-center shadow-sm border border-slate-200
                         transition-all hover:-translate-y-1 hover:shadow-lg hover:border-slate-300 cursor-pointer"
              onClick={() => navigate("/")}
            >
              <img
                src="imgs/voltar.png"
                alt="Voltar"
                className="h-28 w-28 object-contain rounded-xl mb-3 transition-transform group-hover:scale-105"
              />
              <button className="w-full inline-flex items-center justify-center gap-2 bg-slate-600 text-white font-semibold px-5 py-2.5 rounded-xl shadow hover:bg-slate-700 transition">
                Ir para Home
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ====== Modal Reagendar ====== */}
      {editing && (
        <ModalBase
          title={`Reagendar #${editing.id}`}
          onClose={() => setEditing(null)}
          footer={
            <>
              <button
                className="px-4 py-2 rounded-xl bg-slate-200 text-slate-800 font-semibold hover:bg-slate-300"
                onClick={() => setEditing(null)}
              >
                Fechar
              </button>
              <button
                className="px-4 py-2 rounded-xl bg-orange-600 text-white font-semibold hover:bg-orange-700"
                onClick={onReagendar}
              >
                Salvar
              </button>
            </>
          }
        >
          <div className="grid gap-3">
            <label className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-slate-700">Data</span>
              <input
                type="date"
                className="rounded-xl border border-slate-300 p-2 focus:outline-none focus:ring-4 focus:ring-orange-200 focus:border-orange-500"
                value={editing.data}
                onChange={(e) => setEditing({ ...editing, data: e.target.value })}
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-slate-700">Hora</span>
              <input
                type="time"
                className="rounded-xl border border-slate-300 p-2 focus:outline-none focus:ring-4 focus:ring-orange-200 focus:border-orange-500"
                value={editing.hora}
                onChange={(e) => setEditing({ ...editing, hora: e.target.value })}
              />
            </label>
          </div>
        </ModalBase>
      )}

      {/* ====== Modal Cancelar ====== */}
      {cancelando && (
        <ModalBase
          title={`Cancelar #${cancelando.id}`}
          onClose={() => setCancelando(null)}
          footer={
            <>
              <button
                className="px-4 py-2 rounded-xl bg-slate-200 text-slate-800 font-semibold hover:bg-slate-300"
                onClick={() => setCancelando(null)}
              >
                Fechar
              </button>
              <button
                className="px-4 py-2 rounded-xl bg-rose-600 text-white font-semibold hover:bg-rose-700"
                onClick={onCancelar}
              >
                Confirmar cancelamento
              </button>
            </>
          }
        >
          <textarea
            className="w-full min-h-[110px] rounded-xl border border-slate-300 p-3 text-sm focus:outline-none focus:ring-4 focus:ring-rose-100 focus:border-rose-400"
            placeholder="Motivo do cancelamento"
            value={cancelando.motivo}
            onChange={(e) => setCancelando({ ...cancelando, motivo: e.target.value })}
          />
        </ModalBase>
      )}
    </main>
  );
}
