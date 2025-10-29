import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";

/**
 * Componente LoginFancy (React + TSX + Tailwind)
 * - modo "login": email + senha (opcional lembrar)
 * - modo "signup": solicita nome, email, senha, confirmar senha, sexo, CPF e data de nascimento
 * - validações básicas incluídas (email, senha >=6, senhas iguais, CPF 11 dígitos, data válida e idade >=13)
 */

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
    dataNascimento: "", // ISO yyyy-mm-dd
  });

  const [errors, setErrors] = useState<{ [k: string]: string }>({});

  // helpers
  const onlyDigits = (s: string) => s.replace(/\D/g, "");
  const isAdultEnough = (dateIso: string, minAge = 13) => {
    if (!dateIso) return false;
    const b = new Date(dateIso);
    if (Number.isNaN(b.getTime())) return false;
    const diff = new Date().getTime() - b.getTime();
    const age = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
    return age >= minAge;
  };

  // CPF validation (básica: 11 dígitos + verificação de repetidos)
  const isValidCPF = (cpfRaw: string) => {
    const cpf = onlyDigits(cpfRaw);
    if (cpf.length !== 11) return false;
    // block sequences like 11111111111
    if (/^(\d)\1{10}$/.test(cpf)) return false;
    // validação dos dígitos verificadores (algoritmo comum)
    const calc = (slice: string) =>
      [...slice].reduce((acc, v, i) => acc + Number(v) * (slice.length + 1 - i), 0);
    const d1 = (calc(cpf.slice(0, 9)) * 10) % 11 % 10;
    const d2 = (calc(cpf.slice(0, 10)) * 10) % 11 % 10;
    return d1 === Number(cpf[9]) && d2 === Number(cpf[10]);
  };

  function validate() {
    const e: typeof errors = {};
    // nome apenas para signup
    if (modo === "signup" && !form.name.trim()) e.name = "Informe seu nome completo";
    if (!/.+@.+\..+/.test(form.email)) e.email = "E-mail inválido";
    if (form.password.length < 6) e.password = "Mínimo 6 caracteres";
    if (modo === "signup" && form.password !== form.confirm)
      e.confirm = "As senhas não coincidem";

    if (modo === "signup") {
      // sexo
      if (!form.sexo) e.sexo = "Selecione seu sexo";
      // cpf
      if (!form.cpf.trim()) e.cpf = "Informe o CPF";
      else if (!isValidCPF(form.cpf)) e.cpf = "CPF inválido";
      // data de nascimento
      if (!form.dataNascimento) e.dataNascimento = "Informe a data de nascimento";
      else if (!isAdultEnough(form.dataNascimento))
        e.dataNascimento = "Idade mínima: 13 anos";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    // Simulação de cadastro/login: guardar nome e email localmente
    localStorage.setItem("pacienteNome", form.name || "");
    localStorage.setItem("pacienteEmail", form.email);
    if (modo === "signup") {
      // armazene dados essenciais para demo (NUNCA faça isso em produção com dados sensíveis)
      localStorage.setItem("pacienteCPF", onlyDigits(form.cpf));
      localStorage.setItem("pacienteSexo", String(form.sexo));
      localStorage.setItem("pacienteNascimento", form.dataNascimento);
      alert("🎉 Conta criada com sucesso!");
    } else {
      // login: aqui normalmente chamaria API de autenticação
      alert("✔️ Login realizado (simulação)");
    }
    navigate("/");
  }

  // máscara simples para CPF (visual)
  const formatCPF = (v: string) => {
    const d = onlyDigits(v).slice(0, 11);
    if (d.length <= 3) return d;
    if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
    if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
    return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
  };

  return (
    <main className="font-sans min-h-screen grid place-items-center relative p-6 text-gray-800 overflow-hidden bg-gradient-to-br from-indigo-100 via-white to-cyan-50">
      <div className="absolute inset-0 animate-floatBg bg-[radial-gradient(60%_60%_at_10%_10%,#a7c1ff40_0%,transparent_60%),radial-gradient(60%_60%_at_90%_20%,#7cf6ff30_0%,transparent_60%),radial-gradient(70%_70%_at_50%_100%,#b388ff30_0%,transparent_60%)]" />

      <section className="relative w-full max-w-[1100px] grid md:grid-cols-[1.1fr_1fr] bg-white/80 backdrop-blur-2xl rounded-3xl shadow-2xl overflow-hidden border border-white/20">
        <aside className="hidden md:flex flex-col justify-center gap-5 p-10 bg-gradient-to-b from-indigo-50 to-blue-100">
          <h1 className="text-blue-900 text-3xl font-extrabold leading-tight">
            {modo === "login" ? "Acesse sua conta" : "Crie sua conta"}
            <span className="block text-indigo-700 font-extrabold">Telemedicina IMREA + HC</span>
          </h1>
          <p className="opacity-80 text-slate-700">
            Resultados, consultas e teleatendimento em um só lugar. Experiência segura e humanizada.
          </p>
          <ul className="grid gap-1 text-slate-800 font-medium">
            <li>✔️ Resultados e laudos</li>
            <li>✔️ Agendamentos rápidos</li>
            <li>✔️ Telemedicina</li>
          </ul>
        </aside>

        <form
          onSubmit={submit}
          className={`flex flex-col gap-4 p-8 transition-all duration-300 ${modo === "signup" ? "bg-white/95 shadow-2xl" : "bg-white/90"}`}
        >
          <h2 className="text-2xl font-bold text-blue-900">{modo === "login" ? "Bem-vindo(a) 👋" : "Criar Conta"}</h2>
          <p className="text-gray-500">
            {modo === "login" ? "Entre para continuar" : "Preencha os campos para criar sua conta"}
          </p>

          {/* Nome (signup) */}
          {modo === "signup" && (
            <label className={`flex flex-col gap-1 ${errors.name && "text-red-500"}`}>
              <span className="font-semibold">Nome completo</span>
              <input
                className="rounded-xl border border-slate-300 p-3 focus:border-indigo-500 focus:ring-4 focus:ring-blue-200 outline-none"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "err-name" : undefined}
              />
              {errors.name && <small id="err-name" className="font-semibold">{errors.name}</small>}
            </label>
          )}

          {/* Email */}
          <label className={`flex flex-col gap-1 ${errors.email && "text-red-500"}`}>
            <span className="font-semibold">E-mail</span>
            <input
              type="email"
              placeholder="voce@exemplo.com"
              className="rounded-xl border border-slate-300 p-3 focus:border-indigo-500 focus:ring-4 focus:ring-blue-200 outline-none"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "err-email" : undefined}
            />
            {errors.email && <small id="err-email" className="font-semibold">{errors.email}</small>}
          </label>

          {/* Senha */}
          <label className={`flex flex-col gap-1 ${errors.password && "text-red-500"}`}>
            <span className="font-semibold">Senha</span>
            <div className="relative">
              <input
                type={showPwd ? "text" : "password"}
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-300 p-3 pr-12 focus:border-indigo-500 focus:ring-4 focus:ring-blue-200 outline-none"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? "err-password" : undefined}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowPwd((s) => !s)}
                aria-label={showPwd ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPwd ? <FiEyeOff size={22} /> : <FiEye size={22} />}
              </button>
            </div>
            {errors.password && <small id="err-password" className="font-semibold">{errors.password}</small>}
          </label>

          {/* Confirmar senha (signup) */}
          {modo === "signup" && (
            <label className={`flex flex-col gap-1 ${errors.confirm && "text-red-500"}`}>
              <span className="font-semibold">Confirmar Senha</span>
              <input
                type="password"
                placeholder="Repita a senha"
                className="rounded-xl border border-slate-300 p-3 focus:border-indigo-500 focus:ring-4 focus:ring-blue-200 outline-none"
                value={form.confirm}
                onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                aria-invalid={!!errors.confirm}
                aria-describedby={errors.confirm ? "err-confirm" : undefined}
              />
              {errors.confirm && <small id="err-confirm" className="font-semibold">{errors.confirm}</small>}
            </label>
          )}

          {/* Campos extras para signup: sexo, cpf, dataNascimento */}
          {modo === "signup" && (
            <>
              {/* Sexo */}
              <label className={`flex flex-col gap-1 ${errors.sexo && "text-red-500"}`}>
                <span className="font-semibold">Sexo</span>
                <select
                  className="rounded-xl border border-slate-300 p-3 focus:border-indigo-500 focus:ring-4 focus:ring-blue-200 outline-none bg-white"
                  value={form.sexo}
                  onChange={(e) => setForm({ ...form, sexo: e.target.value as Sexo })}
                  aria-invalid={!!errors.sexo}
                  aria-describedby={errors.sexo ? "err-sexo" : undefined}
                >
                  <option value="">Selecione</option>
                  <option value="Feminino">Feminino</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Outro">Outro</option>
                  <option value="Prefiro não dizer">Prefiro não dizer</option>
                </select>
                {errors.sexo && <small id="err-sexo" className="font-semibold">{errors.sexo}</small>}
              </label>

              {/* CPF */}
              <label className={`flex flex-col gap-1 ${errors.cpf && "text-red-500"}`}>
                <span className="font-semibold">CPF</span>
                <input
                  inputMode="numeric"
                  placeholder="000.000.000-00"
                  className="rounded-xl border border-slate-300 p-3 focus:border-indigo-500 focus:ring-4 focus:ring-blue-200 outline-none"
                  value={form.cpf}
                  onChange={(e) => setForm({ ...form, cpf: formatCPF(e.target.value) })}
                  aria-invalid={!!errors.cpf}
                  aria-describedby={errors.cpf ? "err-cpf" : undefined}
                />
                {errors.cpf && <small id="err-cpf" className="font-semibold">{errors.cpf}</small>}
              </label>

              {/* Data de nascimento */}
              <label className={`flex flex-col gap-1 ${errors.dataNascimento && "text-red-500"}`}>
                <span className="font-semibold">Data de nascimento</span>
                <input
                  type="date"
                  className="rounded-xl border border-slate-300 p-3 focus:border-indigo-500 focus:ring-4 focus:ring-blue-200 outline-none"
                  value={form.dataNascimento}
                  onChange={(e) => setForm({ ...form, dataNascimento: e.target.value })}
                  aria-invalid={!!errors.dataNascimento}
                  aria-describedby={errors.dataNascimento ? "err-data" : undefined}
                />
                {errors.dataNascimento && <small id="err-data" className="font-semibold">{errors.dataNascimento}</small>}
              </label>
            </>
          )}

          {/* Checkbox + Esqueci a senha (login) */}
          {modo === "login" && (
            <div className="flex items-center justify-between text-slate-800">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.remember}
                  onChange={(e) => setForm({ ...form, remember: e.target.checked })}
                />
                Lembrar-me
              </label>
              <a href="#esqueci" className="text-indigo-600 font-semibold hover:underline">Esqueci a senha</a>
            </div>
          )}

          {/* Botão principal */}
          <button
            type="submit"
            className="mt-2 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 text-white font-extrabold py-3 shadow-lg hover:-translate-y-1 transition"
          >
            {modo === "login" ? "Entrar" : "Criar Conta"}
          </button>

          {/* Divider */}
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-slate-500">
            <span className="h-px bg-slate-200" />
            ou
            <span className="h-px bg-slate-200" />
          </div>

          {/* Alternar login/signup */}
          {modo === "login" ? (
            <p className="text-slate-600 mt-1">
              Não tem conta?{" "}
              <button type="button" className="text-indigo-600 font-bold hover:underline" onClick={() => setModo("signup")}>
                Criar conta
              </button>
            </p>
          ) : (
            <p className="text-slate-600 mt-1">
              Já tem conta?{" "}
              <button type="button" className="text-indigo-600 font-bold hover:underline" onClick={() => setModo("login")}>
                Entrar
              </button>
            </p>
          )}
        </form>
      </section>
    </main>
  );
}
