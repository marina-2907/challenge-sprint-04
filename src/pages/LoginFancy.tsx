import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";

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
  });
  const [errors, setErrors] = useState<{ [k: string]: string }>({});

  function validate() {
    const e: typeof errors = {};
    if (!form.name.trim()) e.name = "Informe seu nome";
    if (!/.+@.+\..+/.test(form.email)) e.email = "E-mail inválido";
    if (form.password.length < 6) e.password = "Mínimo 6 caracteres";
    if (modo === "signup" && form.password !== form.confirm)
      e.confirm = "As senhas não coincidem";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    localStorage.setItem("pacienteNome", form.name);
    if (modo === "signup") alert("🎉 Conta criada com sucesso!");
    navigate("/");
  }

  return (
    <main className="min-h-screen grid place-items-center relative p-8 text-[var(--ink)] overflow-hidden bg-gradient-to-br from-indigo-100 via-white to-cyan-50">
      {/* Fundo animado suave */}
      <div className="absolute inset-0 animate-floatBg bg-[radial-gradient(60%_60%_at_10%_10%,#a7c1ff40_0%,transparent_60%),radial-gradient(60%_60%_at_90%_20%,#7cf6ff30_0%,transparent_60%),radial-gradient(70%_70%_at_50%_100%,#b388ff30_0%,transparent_60%)]" />

      {/* Card principal */}
      <section className="relative w-full max-w-[1100px] grid md:grid-cols-[1.1fr_1fr] bg-white/80 backdrop-blur-2xl rounded-3xl shadow-2xl overflow-hidden border border-white/20">
        {/* Coluna da esquerda: hero */}
        <aside className="hidden md:flex flex-col justify-center gap-5 p-10 bg-gradient-to-b from-indigo-50 to-blue-100">
          <h1 className="text-[var(--brand)] text-3xl font-extrabold leading-tight">
            {modo === "login" ? "Acesse sua conta" : "Crie sua conta"}
            <span className="block text-[var(--brand-2)] font-extrabold">
              Telemedicina IMREA + HC
            </span>
          </h1>
          <p className="opacity-80 text-slate-700">
            Resultados, consultas e teleatendimento em um só lugar. Experiência
            segura e humanizada.
          </p>
          <ul className="grid gap-1 text-[var(--ink)] font-medium">
            <li>✔️ Resultados e laudos</li>
            <li>✔️ Agendamentos rápidos</li>
            <li>✔️ Telemedicina</li>
          </ul>
        </aside>

        {/* Coluna da direita: formulário */}
        <form
          onSubmit={submit}
          className={`flex flex-col gap-4 p-10 transition-all duration-300 ${
            modo === "signup" ? "bg-white/95 shadow-2xl" : "bg-white/90"
          }`}
        >
          <h2 className="text-2xl font-bold text-[var(--ink)]">
            {modo === "login" ? "Bem-vindo(a) 👋" : "Criar Conta"}
          </h2>
          <p className="text-[var(--muted)]">
            {modo === "login"
              ? "Entre para continuar"
              : "Preencha os campos para criar sua conta"}
          </p>

          {/* Nome */}
          <label className={`flex flex-col gap-1 ${errors.name && "text-red-500"}`}>
            <span className="font-semibold">Nome completo</span>
            <input
              className="rounded-xl border border-slate-300 p-3 focus:border-[var(--brand-2)] focus:ring-4 focus:ring-blue-200 outline-none"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            {errors.name && <small className="font-semibold">{errors.name}</small>}
          </label>

          {/* Email */}
          <label className={`flex flex-col gap-1 ${errors.email && "text-red-500"}`}>
            <span className="font-semibold">E-mail</span>
            <input
              type="email"
              placeholder="voce@exemplo.com"
              className="rounded-xl border border-slate-300 p-3 focus:border-[var(--brand-2)] focus:ring-4 focus:ring-blue-200 outline-none"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            {errors.email && <small className="font-semibold">{errors.email}</small>}
          </label>

          {/* Senha */}
          <label className={`flex flex-col gap-1 ${errors.password && "text-red-500"}`}>
            <span className="font-semibold">Senha</span>
            <div className="relative">
              <input
                type={showPwd ? "text" : "password"}
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-300 p-3 pr-12 focus:border-[var(--brand-2)] focus:ring-4 focus:ring-blue-200 outline-none"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
              {/* Botão olho */}
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowPwd((s) => !s)}
              >
                {showPwd ? <FiEyeOff size={22} /> : <FiEye size={22} />}
              </button>
            </div>
            {errors.password && <small className="font-semibold">{errors.password}</small>}
          </label>

          {/* Confirmar senha (signup) */}
          {modo === "signup" && (
            <label className={`flex flex-col gap-1 ${errors.confirm && "text-red-500"}`}>
              <span className="font-semibold">Confirmar Senha</span>
              <input
                type="password"
                placeholder="Repita a senha"
                className="rounded-xl border border-slate-300 p-3 focus:border-[var(--brand-2)] focus:ring-4 focus:ring-blue-200 outline-none"
                value={form.confirm}
                onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              />
              {errors.confirm && (
                <small className="font-semibold">{errors.confirm}</small>
              )}
            </label>
          )}

          {/* Checkbox + Esqueci a senha */}
          {modo === "login" && (
            <div className="flex items-center justify-between text-slate-900">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.remember}
                  onChange={(e) =>
                    setForm({ ...form, remember: e.target.checked })
                  }
                />
                Lembrar-me
              </label>
              <a href="#esqueci" className="text-[var(--brand-2)] font-semibold hover:underline">
                Esqueci a senha
              </a>
            </div>
          )}

          {/* Botão principal */}
          <button
            type="submit"
            className="mt-2 rounded-xl bg-gradient-to-r from-[var(--brand)] to-[var(--brand-2)] text-white font-extrabold py-3 shadow-lg hover:-translate-y-1 transition"
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
              <button
                type="button"
                className="text-[var(--brand-2)] font-bold hover:underline"
                onClick={() => setModo("signup")}
              >
                Criar conta
              </button>
            </p>
          ) : (
            <p className="text-slate-600 mt-1">
              Já tem conta?{" "}
              <button
                type="button"
                className="text-[var(--brand-2)] font-bold hover:underline"
                onClick={() => setModo("login")}
              >
                Entrar
              </button>
            </p>
          )}
        </form>
      </section>
    </main>
  );
}
