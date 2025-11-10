const BASE = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

// ====== VALIDAÇÕES ======

/**
 * Valida e formata telefone brasileiro
 * Aceita: (11) 98765-4321, 11987654321, 11 98765-4321
 * Retorna: telefone formatado ou null se inválido
 */
export function validarTelefone(telefone: string): string | null {
  // Remove tudo exceto números
  const numeros = telefone.replace(/\D/g, "");
  
  // Valida quantidade de dígitos (10 ou 11)
  if (numeros.length !== 10 && numeros.length !== 11) {
    return null;
  }
  
  // Valida DDD (primeira parte)
  const ddd = parseInt(numeros.substring(0, 2));
  if (ddd < 11 || ddd > 99) {
    return null;
  }
  
  return numeros; // Retorna só números
}

/**
 * Formata telefone para exibição
 */
export function formatarTelefone(telefone: string): string {
  const numeros = telefone.replace(/\D/g, "");
  
  if (numeros.length === 11) {
    return `(${numeros.substring(0, 2)}) ${numeros.substring(2, 7)}-${numeros.substring(7)}`;
  } else if (numeros.length === 10) {
    return `(${numeros.substring(0, 2)}) ${numeros.substring(2, 6)}-${numeros.substring(6)}`;
  }
  
  return telefone;
}

// ====== TIPOS USADOS PELO FRONTEND ======

export type NovaConsulta = {
  nome: string;
  idade: string;
  telefone: string;
  modalidade: "Presencial" | "Telemedicina";
  procedimento: string;
  data: string;
  hora: string;
  unidade: string;
};

export type Consulta = {
  id: number;
  nome: string;
  idade: string;
  telefone: string;
  tipo: "Consulta" | "Exame";
  modalidade: "Presencial" | "Telemedicina";
  procedimento: string;
  data: string;
  hora: string;
  unidade: string;
  status: "AGENDADA" | "CANCELADA" | "REAGENDADA";
  motivoCancel?: string;
};

export type DadosPaciente = {
  encontrado: boolean;
  mensagem?: string;
  paciente?: {
    id: number;
    nome: string;
    cpf: string;
    email: string;
    telefone: string;
    dataNascimento: string;
    sexo: string;
  };
  receitas?: Array<{
    id: number;
    dataEmissao: string;
    observacoes: string;
    medico: string;
    especialidade: string;
    itens: Array<{
      medicamento: string;
      dosagem: string;
      frequencia: string;
      duracaoDias: number;
      instrucoes: string;
    }>;
  }>;
  prontuarios?: Array<{
    id: number;
    descricao: string;
    dataRegistro: string;
    medico: string;
    especialidade: string;
  }>;
};

// ====== FUNÇÕES HTTP ======

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  
  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status}: ${msg || res.statusText}`);
  }
  
  try {
    return (await res.json()) as T;
  } catch {
    return undefined as T;
  }
}

// ====== API DE CONSULTAS/AGENDAMENTOS ======

export const ConsultasApi = {
  /**
   * Lista todos os agendamentos
   */
  listar: async (): Promise<Consulta[]> => {
    return await http<Consulta[]>("/agendamentos");
  },

  /**
   * Cria um novo agendamento (COM VALIDAÇÃO)
   */
  criar: async (payload: NovaConsulta): Promise<Consulta> => {
    // Valida telefone antes de enviar
    const telefoneValido = validarTelefone(payload.telefone);
    if (!telefoneValido) {
      throw new Error("Telefone inválido. Use formato: (11) 98765-4321");
    }

    // Envia com telefone formatado
    const payloadFormatado = {
      ...payload,
      telefone: telefoneValido,
    };

    return await http<Consulta>("/agendamentos", {
      method: "POST",
      body: JSON.stringify(payloadFormatado),
    });
  },

  /**
   * Busca agendamentos por telefone
   */
  buscarPorTelefone: async (telefone: string): Promise<Consulta[]> => {
    const telefoneValido = validarTelefone(telefone);
    if (!telefoneValido) {
      throw new Error("Telefone inválido");
    }
    return await http<Consulta[]>(`/agendamentos/telefone/${telefoneValido}`);
  },
};

// ====== API DE DADOS DO PACIENTE ======

export const PacienteApi = {
  /**
   * Busca dados completos do paciente por telefone
   * Retorna: paciente, receitas e prontuários
   */
  buscarDadosPorTelefone: async (telefone: string): Promise<DadosPaciente> => {
    const telefoneValido = validarTelefone(telefone);
    if (!telefoneValido) {
      throw new Error("Telefone inválido. Use formato: (11) 98765-4321");
    }
    return await http<DadosPaciente>(`/paciente-dados/telefone/${telefoneValido}`);
  },
};

// ====== APIs ANTIGAS (MANTER PARA COMPATIBILIDADE) ======

export type PacienteBackend = {
  id: number;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  dataNascimento: string;
  sexo: string;
};

export type MedicoBackend = {
  id: number;
  nome: string;
  crm: string;
  especialidade: string;
};

export const PacientesApi = {
  listar: () => http<PacienteBackend[]>("/pacientes"),
  buscar: (id: number) => http<PacienteBackend>(`/pacientes/${id}`),
  criar: (payload: Omit<PacienteBackend, "id">) =>
    http<PacienteBackend>("/pacientes", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};

export const MedicosApi = {
  listar: () => http<MedicoBackend[]>("/medicos"),
  buscar: (id: number) => http<MedicoBackend>(`/medicos/${id}`),
  buscarPorEspecialidade: (especialidade: string) =>
    http<MedicoBackend[]>(`/medicos/especialidade/${especialidade}`),
};
