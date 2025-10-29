
const RAW_BASE = (import.meta.env.VITE_API_URL ?? "").toString();
const BASE = RAW_BASE.replace(/\/+$/, "");
const join = (base: string, path: string) => {
  const p = String(path || "");
  if (!base) throw new Error("VITE_API_URL não configurada (.env).");
  return `${base}${p.startsWith("/") ? "" : "/"}${p}`;
};

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const url = join(BASE, path);
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} - ${url}\n${text}`);
  }

  // tenta JSON, senão retorna undefined (útil p/ DELETE 204)
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    return (await res.json()) as T;
  }
  return undefined as T;
}

export type Consulta = {
  id: number;
  paciente: string;
  data: string;            
  hora: string;            
  tipo: "Consulta" | "Exame";
  modalidade: "Presencial" | "Telemedicina";
  unidade: string;
  status: "AGENDADA" | "CANCELADA" | "REALIZADA";
};


export type NovaConsulta = Omit<Consulta, "id" | "status"> & {
  status?: Consulta["status"];
};
export const ConsultasApi = {
  listar: () => http<Consulta[]>("/consultas"),
  criar: (payload: NovaConsulta) =>
    http<Consulta>("/consultas", { method: "POST", body: JSON.stringify(payload) }),
  cancelar: (id: number, motivoCancel: string) =>
    http<Consulta>(`/consultas/${id}/cancelar`, {
      method: "PUT",
      body: JSON.stringify({ motivoCancel }),
    }),
  reagendar: (id: number, data: string, hora: string) =>
    http<Consulta>(`/consultas/${id}/reagendar`, {
      method: "PUT",
      body: JSON.stringify({ data, hora }),
    }),
  deletar: (id: number) =>
    http<void>(`/consultas/${id}`, { method: "DELETE" }),
};
