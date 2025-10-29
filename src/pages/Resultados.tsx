import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ConsultasApi, type Consulta } from "../services/Api";

// Alerta simples lendo ?msg= da URL (feedback pós-ação)
function AlertFromQuery() {
  const { search } = useLocation();
  const params = useMemo(() => new URLSearchParams(search), [search]);
  const msg = params.get("msg");
  if (!msg) return null;
  return (
    <div className="mx-auto max-w-6xl mb-6 rounded border border-green-200 bg-green-50 text-green-700 px-4 py-2">
      {decodeURIComponent(msg)}
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
    } catch (e) {
      setErro((e as Error).message);
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

  // ====== Cards de download (mantidos do seu layout) ======
  const downloadFile = (filePath: string, fileName: string) => {
    const link = document.createElement("a");
    link.href = filePath;
    link.download = fileName;
    link.click();
  };

  const cardDownload = (img: string, label: string, key: string, file: string) => (
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
    <main className="font-sans min-h-screen py-10 md:py-16 px-6 bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Feedback via query string */}
      <AlertFromQuery />

      <section className="mx-auto w-full max-w-7xl">
        <h1 className="text-3xl md:text-5xl font-extrabold text-blue-900 text-center tracking-wide drop-shadow-sm">
          Resultados do Paciente
        </h1>

        {/* ====== BLOCO 1 — Minhas Consultas (CRUD) ====== */}
        <div className="mt-8 md:mt-12">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <h2 className="text-xl md:text-2xl font-bold text-slate-800">
              Minhas Consultas
            </h2>
            <button
              onClick={() => navigate("/agendar")}
              className="rounded-xl bg-blue-600 text-white font-semibold px-4 py-2 hover:bg-blue-700"
            >
              + Nova consulta
            </button>
          </div>

          {erro && <p className="mt-4 text-red-600">{erro}</p>}
          {loading && <p className="mt-4">Carregando…</p>}

          {!loading && !erro && (
            <>
              {lista.length === 0 ? (
                <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-6 text-slate-600">
                  Nenhuma consulta encontrada.
                </div>
              ) : (
                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {lista.map((c) => (
                    <article
                      key={c.id}
                      className="flex flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition"
                    >
                      <header className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-slate-800">
                          #{c.id} • {c.tipo ?? "Consulta"}
                        </h3>
                        <span
                          className={`text-xs font-bold rounded px-2 py-1 ${
                            c.status === "AGENDADA"
                              ? "bg-blue-100 text-blue-800"
                              : c.status === "CANCELADA"
                              ? "bg-rose-100 text-rose-700"
                              : "bg-emerald-100 text-emerald-700"
                          }`}
                        >
                          {c.status}
                        </span>
                      </header>

                      <div className="mt-2 text-sm text-slate-600">
                        <p><strong>Paciente:</strong> {c.paciente}</p>
                        <p>
                          <strong>Data:</strong> {c.data} • <strong>Hora:</strong> {c.hora}
                        </p>
                        {c.modalidade && <p><strong>Modalidade:</strong> {c.modalidade}</p>}
                        {c.unidade && <p><strong>Unidade:</strong> {c.unidade}</p>}
                      </div>

                      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <button
                          className="rounded bg-amber-500 text-white font-semibold py-2 hover:bg-amber-600"
                          onClick={() => setEditing({ id: c.id, data: c.data, hora: c.hora })}
                        >
                          Reagendar
                        </button>
                        <button
                          className="rounded bg-rose-500 text-white font-semibold py-2 hover:bg-rose-600"
                          onClick={() => setCancelando({ id: c.id, motivo: "" })}
                        >
                          Cancelar
                        </button>
                        <button
                          className="rounded bg-slate-200 text-slate-800 font-semibold py-2 hover:bg-slate-300 sm:col-span-2"
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

        {/* ====== BLOCO 2 — Downloads (seu layout original) ====== */}
        <div className="mt-12 md:mt-16">
          <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-6">
            Meus Documentos
          </h2>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-8 md:gap-12 w-full justify-items-center">
            {cardDownload("imgs/exame.jpg", "Exames", "exames", "./txt/exames.txt")}
            {cardDownload("imgs/novo laudo.png", "Laudos", "laudos", "./txt/laudos.txt")}
            {cardDownload("imgs/receita.avif", "Receitas", "receitas", "./txt/receita.txt")}
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
              <button
                className="w-full bg-gradient-to-r from-gray-400 to-gray-500 text-white font-semibold px-6 py-3 rounded-full shadow-md
                           hover:from-gray-500 hover:to-gray-400 hover:shadow-lg transition-transform hover:-translate-y-0.5"
              >
                Ir para Home
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ====== Modal Reagendar ====== */}
      {editing && (
        <div className="fixed inset-0 bg-black/40 grid place-items-center p-4 z-50">
          <div className="w-full max-w-md rounded-2xl bg-white p-6">
            <h3 className="text-xl font-bold mb-3">
              Reagendar #{editing.id}
            </h3>
            <div className="grid gap-3">
              <input
                type="date"
                className="rounded border border-slate-300 p-2"
                value={editing.data}
                onChange={(e) => setEditing({ ...editing, data: e.target.value })}
              />
              <input
                type="time"
                className="rounded border border-slate-300 p-2"
                value={editing.hora}
                onChange={(e) => setEditing({ ...editing, hora: e.target.value })}
              />
              <div className="flex gap-2 justify-end">
                <button
                  className="px-4 py-2 rounded bg-slate-200"
                  onClick={() => setEditing(null)}
                >
                  Fechar
                </button>
                <button
                  className="px-4 py-2 rounded bg-blue-600 text-white"
                  onClick={onReagendar}
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ====== Modal Cancelar ====== */}
      {cancelando && (
        <div className="fixed inset-0 bg-black/40 grid place-items-center p-4 z-50">
          <div className="w-full max-w-md rounded-2xl bg-white p-6">
            <h3 className="text-xl font-bold mb-3">
              Cancelar #{cancelando.id}
            </h3>
            <textarea
              className="w-full min-h-[100px] rounded border border-slate-300 p-2"
              placeholder="Motivo do cancelamento"
              value={cancelando.motivo}
              onChange={(e) => setCancelando({ ...cancelando, motivo: e.target.value })}
            />
            <div className="mt-3 flex gap-2 justify-end">
              <button
                className="px-4 py-2 rounded bg-slate-200"
                onClick={() => setCancelando(null)}
              >
                Fechar
              </button>
              <button
                className="px-4 py-2 rounded bg-rose-600 text-white"
                onClick={onCancelar}
              >
                Confirmar cancelamento
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
