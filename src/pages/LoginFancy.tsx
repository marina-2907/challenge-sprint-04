import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";

type Sexo = "Feminino" | "Masculino" | "Outro" | "Prefiro não dizer";

export function LoginFancy() {
  const navigate = useNavigate();
  const [showPwd, setShowPwd] = useState(false);
  const [modo, setModo] = useState<"login" | "signup">("login");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
    remember: true,
    sexo: "" as Sexo | "",
    cpf: "",
    dataNascimento: "",
  });

  const [errors, setErrors] = useState<{ [k: string]: string }>({});



   
  // ✅ sem erro agora
  const onlyDigits = (s: string) => s.replace(/\D/g, "");

  function isAdultEnough(dateIso: string, minAge = 13) {
    if (!dateIso) return false;
    const b = new Date(dateIso);
    if (Number.isNaN(b.getTime())) return false;
    const diff = new Date().getTime() - b.getTime();
    const age = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
    return age >= minAge;
  }

  const isValidCPF = (cpfRaw: string) => {
    const cpf = onlyDigits(cpfRaw);
    if (cpf.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(cpf)) return false;
    const calc = (slice: string) =>
      [...slice].reduce((acc, v, i) => acc + Number(v) * (slice.length + 1 - i), 0);
    const d1 = (calc(cpf.slice(0, 9)) * 10) % 11 % 10;
    const d2 = (calc(cpf.slice(0, 10)) * 10) % 11 % 10;
    return d1 === Number(cpf[9]) && d2 === Number(cpf[10]);
  };

  function validate() {
    const e: typeof errors = {};

    if (!/.+@.+\..+/.test(form.email)) e.email = "E-mail inválido";
    if (form.password.length < 6) e.password = "Mínimo 6 caracteres";

    if (modo === "signup" && !form.name.trim()) e.name = "Informe seu nome completo";
    if (modo === "signup" && form.password !== form.confirm)
      e.confirm = "As senhas não coincidem";

    if (modo === "signup") {
      if (!form.sexo) e.sexo = "Selecione seu sexo";
      if (!form.cpf.trim()) e.cpf = "Informe o CPF";
      else if (!isValidCPF(form.cpf)) e.cpf = "CPF inválido";
      if (!form.dataNascimento) e.dataNascimento = "Informe sua data";
      else if (!isAdultEnough(form.dataNascimento))
        e.dataNascimento = "Idade mínima: 13 anos";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    const nomeParaSalvar = form.name.trim() || "Paciente";
    localStorage.setItem("pacienteNome", nomeParaSalvar);
    localStorage.setItem("pacienteEmail", form.email);

    if (modo === "signup") {
      localStorage.setItem("pacienteCPF", onlyDigits(form.cpf));
      localStorage.setItem("pacienteSexo", String(form.sexo));
      localStorage.setItem("pacienteNascimento", form.dataNascimento);
      alert("🎉 Conta criada com sucesso!");
    } else {
      alert("✔️ Login realizado!");
    }

    navigate("/");
  }

  const formatCPF = (v: string) => {
    const d = onlyDigits(v).slice(0, 11);
    if (d.length <= 3) return d;
    if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
    if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3,6)}.${d.slice(6)}`;
    return `${d.slice(0, 3)}.${d.slice(3,6)}.${d.slice(6,9)}-${d.slice(9)}`;
  };

  return (
    <main className="font-sans min-h-screen grid place-items-center p-6 bg-gradient-to-br from-indigo-100 via-white to-cyan-100">
      <section className="relative max-w-[1050px] w-full grid md:grid-cols-[1fr_1fr] bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl border border-white/30 overflow-hidden">

        {/* Lateral */}
        <aside className="hidden md:flex flex-col justify-center gap-6 p-10 bg-gradient-to-b from-blue-50 to-indigo-100">
          <h1 className="text-blue-900 text-3xl font-extrabold leading-tight">
            Telemedicina
            <span className="block text-indigo-800">IMREA + HC</span>
          </h1>

          <ul className="grid gap-1 text-slate-700 font-medium text-sm">
            <li>✅ Teleatendimento rápido</li>
            <li>✅ Resultados organizados</li>
            <li>✅ Suporte imediato</li>
          </ul>
        </aside>

        {/* Form */}
        <form
          onSubmit={submit}
          className={`flex flex-col gap-4 p-8 transition-all duration-300 ${modo === "signup" ? "bg-white/95 shadow-inner" : "bg-white/90"}`}
        >
          <h2 className="text-2xl font-bold text-blue-900">
            {modo === "login" ? "Bem-vindo(a) 👋" : "Criar Conta"}
          </h2>

          <p className="text-gray-500 text-sm">
            {modo === "login" ? "Entre para continuar" : "Preencha os campos abaixo"}
          </p>

          <label className="flex flex-col gap-1">
            <span className="font-medium text-sm">Nome completo</span>
            <input
              placeholder="Digite seu nome"
              className="rounded-xl border border-slate-300 p-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </label>

          {/* Email */}
          <label className={`flex flex-col gap-1 ${errors.email && "text-red-500"}`}>
            <span className="font-medium text-sm">E-mail</span>
            <input
              className="rounded-xl border border-slate-300 p-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            {errors.email && <small>{errors.email}</small>}
          </label>

          {/* Senha */}
          <label className={`flex flex-col gap-1 ${errors.password && "text-red-500"}`}>
            <span className="font-medium text-sm">Senha</span>
            <div className="relative">
              <input
                type={showPwd ? "text" : "password"}
                className="w-full rounded-xl border border-slate-300 p-3 pr-12 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowPwd(!showPwd)}
              >
                {showPwd ? <FiEyeOff size={22} /> : <FiEye size={22} />}
              </button>
            </div>
            {errors.password && <small>{errors.password}</small>}
          </label>

          {/* Signup extra fields */}
          {modo === "signup" && (
            <>
              <label className="flex flex-col gap-1">
                <span>Confirmar Senha</span>
                <input
                  type="password"
                  className="rounded-xl border border-slate-300 p-3"
                  value={form.confirm}
                  onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                />
              </label>

              <label className="flex flex-col gap-1">
                <span>Sexo</span>
                <select
                  className="rounded-xl border border-slate-300 p-3 bg-white"
                  value={form.sexo}
                  onChange={(e) => setForm({ ...form, sexo: e.target.value as Sexo })}
                >
                  <option value="">Selecione</option>
                  <option value="Feminino">Feminino</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Outro">Outro</option>
                  <option value="Prefiro não dizer">Prefiro não dizer</option>
                </select>
              </label>

              <label className="flex flex-col gap-1">
                <span>CPF</span>
                <input
                  placeholder="000.000.000-00"
                  className="rounded-xl border border-slate-300 p-3"
                  value={form.cpf}
                  onChange={(e) => setForm({ ...form, cpf: formatCPF(e.target.value) })}
                />
              </label>

              <label className="flex flex-col gap-1">
                <span>Data de nascimento</span>
                <input
                  type="date"
                  className="rounded-xl border border-slate-300 p-3"
                  value={form.dataNascimento}
                  onChange={(e) => setForm({ ...form, dataNascimento: e.target.value })}
                />
              </label>
            </>
          )}

          <button
            type="submit"
            className="mt-2 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 text-white font-extrabold py-3 shadow-lg hover:-translate-y-1 transition"
          >
            {modo === "login" ? "Entrar" : "Criar Conta"}
          </button>

          <div className="text-sm text-center text-slate-600">
            {modo === "login" ? (
              <>
                Não tem conta?
                <span
                  className="text-indigo-600 font-bold ml-1 hover:underline cursor-pointer"
                  onClick={() => setModo("signup")}
                >
                  Criar Conta
                </span>
              </>
            ) : (
              <>
                Já possui conta?
                <span
                  className="text-indigo-600 font-bold ml-1 hover:underline cursor-pointer"
                  onClick={() => setModo("login")}
                >
                  Entrar
                </span>
              </>
            )}
          </div>
        </form>
      </section>
    </main>
  );
}
