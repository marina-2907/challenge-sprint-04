import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";

type Sexo = "Feminino" | "Masculino" | "Outro" | "Prefiro não dizer";

type Paciente = {
  id: number;
  nome: string;
  email: string;           // sempre em minúsculas
  senha: string;
  sexo: Sexo | "";
  cpf: string;             // só dígitos
  data_nascimento: string; // yyyy-mm-dd
};

/* ----------------------- "Banco" local ----------------------- */
const LS_KEY = "pacientes";

function getPacientes(): Paciente[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as Paciente[]) : [];
  } catch {
    return [];
  }
}
function savePacientes(list: Paciente[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(list));
}
function nextId(list: Paciente[]) {
  return list.length ? Math.max(...list.map((p) => p.id)) + 1 : 1;
}

/* ----------------------- Componente ----------------------- */
export function LoginFancy() {
  const navigate = useNavigate();

  const [modo, setModo] = useState<"login" | "signup">("login");
  const [showPwd, setShowPwd] = useState(false);
  const [showPwd2, setShowPwd2] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
    sexo: "" as Sexo | "",
    cpf: "",
    dataNascimento: "",
  });

  const [errors, setErrors] = useState<{ [k: string]: string }>({});
  const [globalError, setGlobalError] = useState("");

  /* ----------------------- helpers ----------------------- */
  const onlyDigits = (s: string) => s.replace(/\D/g, "");

  function isAdultEnough(dateIso: string, minAge = 13) {
    if (!dateIso) return false;
    const b = new Date(dateIso);
    if (Number.isNaN(b.getTime())) return false;
    const diff = Date.now() - b.getTime();
    const age = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
    return age >= minAge;
  }

  // **REMOVIDO** isValidCPF — não vamos mais validar dígitos/algoritmo

  const formatCPF = (v: string) => {
    const d = onlyDigits(v).slice(0, 11);
    if (d.length <= 3) return d;
    if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
    if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
    return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
  };

  /* ----------------------- validação ----------------------- */
  function validate() {
    const e: typeof errors = {};
    const email = form.email.trim().toLowerCase();

    if (!/.+@.+\..+/.test(email)) e.email = "E-mail inválido";
    if (form.password.length < 6) e.password = "Mínimo 6 caracteres";

    if (modo === "signup") {
      if (!form.name.trim()) e.name = "Informe seu nome completo";
      if (form.password !== form.confirm) e.confirm = "As senhas não coincidem";
      if (!form.sexo) e.sexo = "Selecione seu sexo";
      if (!form.cpf.trim()) e.cpf = "Informe o CPF"; // **AGORA SÓ OBRIGATÓRIO**
      // **SEM** checar algoritmo/11 dígitos
      if (!form.dataNascimento) e.dataNascimento = "Informe sua data";
      else if (!isAdultEnough(form.dataNascimento)) e.dataNascimento = "Idade mínima: 13 anos";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  /* ----------------------- fluxos locais ----------------------- */
  async function handleSignupLocal() {
    const list = getPacientes();
    const email = form.email.trim().toLowerCase();
    const cpf = onlyDigits(form.cpf); // armazena só dígitos (qualquer combinação)

    // bloqueia duplicados (mesmo aceitando qualquer CPF)
    if (list.some((p) => p.email.toLowerCase() === email)) {
      setErrors((prev) => ({ ...prev, email: "E-mail já cadastrado" }));
    }
    if (list.some((p) => p.cpf === cpf)) {
      setErrors((prev) => ({ ...prev, cpf: "CPF já cadastrado" }));
    }
    if (list.some((p) => p.email.toLowerCase() === email || p.cpf === cpf)) {
      throw new Error("Dados já cadastrados");
    }

    const novo: Paciente = {
      id: nextId(list),
      nome: form.name.trim(),
      email,
      senha: form.password,
      sexo: form.sexo,
      cpf,
      data_nascimento: form.dataNascimento,
    };

    savePacientes([...list, novo]);

    // “sessão”
    localStorage.setItem("pacienteNome", novo.nome);
    localStorage.setItem("pacienteEmail", novo.email);
    localStorage.setItem("pacienteCPF", novo.cpf);
    localStorage.setItem("pacienteSexo", String(novo.sexo));
    localStorage.setItem("pacienteNascimento", novo.data_nascimento);

    return "Conta criada com sucesso!";
  }

  async function handleLoginLocal() {
    const list = getPacientes();
    const email = form.email.trim().toLowerCase();
    const found = list.find((p) => p.email.toLowerCase() === email);

    if (!found || found.senha !== form.password) {
      setErrors((prev) => ({ ...prev, password: "Credenciais inválidas" }));
      throw new Error("Credenciais inválidas");
    }

    localStorage.setItem("pacienteNome", found.nome);
    localStorage.setItem("pacienteEmail", found.email);
    localStorage.setItem("pacienteCPF", found.cpf);
    localStorage.setItem("pacienteSexo", String(found.sexo));
    localStorage.setItem("pacienteNascimento", found.data_nascimento);

    return "Login realizado!";
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setGlobalError("");
    if (!validate()) return;

    try {
      setSubmitting(true);
      const msg = modo === "signup" ? await handleSignupLocal() : await handleLoginLocal();
      navigate(`/?msg=${encodeURIComponent(msg)}`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      if (!Object.keys(errors).length) setGlobalError(err?.message || "Erro inesperado");
    } finally {
      setSubmitting(false);
    }
  }

  /* ----------------------- UX: limpar erros ao digitar/trocar modo ----------------------- */
  useEffect(() => {
    setErrors({});
    setGlobalError("");
  }, [modo]);

  function onField<K extends keyof typeof form>(key: K) {
    return (ev: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const v = ev.target.value;
      const value =
        key === "cpf" ? formatCPF(v) // continua formatando, mas NÃO valida
        : key === "email" ? v.trimStart()
        : v;
      setForm((f) => ({ ...f, [key]: value }));

      if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
      if (globalError) setGlobalError("");
    };
  }

  /* ----------------------- UI ----------------------- */
  return (
    <main className="font-sans min-h-screen grid place-items-center p-6 bg-gradient-to-br from-indigo-100 via-white to-cyan-100">
      <section className="relative max-w-[1050px] w-full grid md:grid-cols-[1fr_1fr] bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl border border-white/30 overflow-hidden">
        {/* Lateral */}
        <aside className="hidden md:flex flex-col justify-center gap-6 p-10 bg-gradient-to-b from-blue-50 to-indigo-100">
          <h1 className="text-blue-900 text-3xl font-extrabold leading-tight">
            Telemedicina <span className="block text-indigo-800">IMREA + HC</span>
          </h1>
          <ul className="grid gap-1 text-slate-700 font-medium text-sm">
            <li>✅ Teleatendimento rápido</li>
            <li>✅ Resultados organizados</li>
            <li>✅ Suporte imediato</li>
          </ul>
        </aside>

        {/* Form */}
        <form onSubmit={submit} className={`flex flex-col gap-4 p-8 transition-all duration-300 ${modo === "signup" ? "bg-white/95 shadow-inner" : "bg-white/90"}`}>
          <h2 className="text-2xl font-bold text-blue-900">
            {modo === "login" ? "Bem-vindo(a) 👋" : "Criar Conta"}
          </h2>
          <p className="text-gray-500 text-sm">
            {modo === "login" ? "Entre para continuar" : "Preencha os campos abaixo"}
          </p>

          {globalError && (
            <div className="rounded-lg border border-red-200 bg-red-50 text-red-700 px-3 py-2 text-sm">
              {globalError}
            </div>
          )}

          {modo === "signup" && (
            <label className={`flex flex-col gap-1 ${errors.name && "text-red-500"}`}>
              <span className="font-medium text-sm">Nome completo</span>
              <input
                placeholder="Digite seu nome"
                className="rounded-xl border border-slate-300 p-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                value={form.name}
                onChange={onField("name")}
                autoComplete="name"
              />
              {errors.name && <small>{errors.name}</small>}
            </label>
          )}

          <label className={`flex flex-col gap-1 ${errors.email && "text-red-500"}`}>
            <span className="font-medium text-sm">E-mail</span>
            <input
              className="rounded-xl border border-slate-300 p-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              value={form.email}
              onChange={onField("email")}
              autoComplete={modo === "login" ? "email" : "new-email"}
              inputMode="email"
            />
            {errors.email && <small>{errors.email}</small>}
          </label>

          <label className={`flex flex-col gap-1 ${errors.password && "text-red-500"}`}>
            <span className="font-medium text-sm">Senha</span>
            <div className="relative">
              <input
                type={showPwd ? "text" : "password"}
                className="w-full rounded-xl border border-slate-300 p-3 pr-12 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                value={form.password}
                onChange={onField("password")}
                autoComplete={modo === "login" ? "current-password" : "new-password"}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowPwd((v) => !v)}
                aria-label={showPwd ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPwd ? <FiEyeOff size={22} /> : <FiEye size={22} />}
              </button>
            </div>
            {errors.password && <small>{errors.password}</small>}
          </label>

          {modo === "signup" && (
            <>
              <label className={`flex flex-col gap-1 ${errors.confirm && "text-red-500"}`}>
                <span>Confirmar Senha</span>
                <div className="relative">
                  <input
                    type={showPwd2 ? "text" : "password"}
                    className="w-full rounded-xl border border-slate-300 p-3 pr-12"
                    value={form.confirm}
                    onChange={onField("confirm")}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowPwd2((v) => !v)}
                    aria-label={showPwd2 ? "Ocultar confirmação" : "Mostrar confirmação"}
                  >
                    {showPwd2 ? <FiEyeOff size={22} /> : <FiEye size={22} />}
                  </button>
                </div>
                {errors.confirm && <small>{errors.confirm}</small>}
              </label>

              <label className={`flex flex-col gap-1 ${errors.sexo && "text-red-500"}`}>
                <span>Sexo</span>
                <select
                  className="rounded-xl border border-slate-300 p-3 bg-white"
                  value={form.sexo}
                  onChange={onField("sexo")}
                >
                  <option value="">Selecione</option>
                  <option value="Feminino">Feminino</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Outro">Outro</option>
                  <option value="Prefiro não dizer">Prefiro não dizer</option>
                </select>
                {errors.sexo && <small>{errors.sexo}</small>}
              </label>

              <label className={`flex flex-col gap-1 ${errors.cpf && "text-red-500"}`}>
                <span>CPF</span>
                <input
                  placeholder="000.000.000-00"
                  className="rounded-xl border border-slate-300 p-3"
                  value={form.cpf}
                  onChange={onField("cpf")}
                  inputMode="numeric"
                />
                {errors.cpf && <small>{errors.cpf}</small>}
              </label>

              <label className={`flex flex-col gap-1 ${errors.dataNascimento && "text-red-500"}`}>
                <span>Data de nascimento</span>
                <input
                  type="date"
                  className="rounded-xl border border-slate-300 p-3"
                  value={form.dataNascimento}
                  onChange={onField("dataNascimento")}
                />
                {errors.dataNascimento && <small>{errors.dataNascimento}</small>}
              </label>
            </>
          )}

          <button
            type="submit"
            disabled={submitting}
            className={`mt-2 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 text-white font-extrabold py-3 shadow-lg transition ${
              submitting ? "opacity-70 cursor-not-allowed" : "hover:-translate-y-1"
            }`}
          >
            {submitting
              ? modo === "login" ? "Entrando..." : "Criando conta..."
              : modo === "login" ? "Entrar" : "Criar Conta"}
          </button>

          <div className="text-sm text-center text-slate-600">
            {modo === "login" ? (
              <>
                Não tem conta?
                <button
                  type="button"
                  className="text-indigo-600 font-bold ml-1 hover:underline"
                  onClick={() => setModo("signup")}
                >
                  Criar Conta
                </button>
              </>
            ) : (
              <>
                Já possui conta?
                <button
                  type="button"
                  className="text-indigo-600 font-bold ml-1 hover:underline"
                  onClick={() => setModo("login")}
                >
                  Entrar
                </button>
              </>
            )}
          </div>
        </form>
      </section>
    </main>
  );
}
