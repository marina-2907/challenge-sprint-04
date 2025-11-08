import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaUserCircle, FaBars, FaTimes } from "react-icons/fa";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // Fecha com ESC e trava o scroll quando o menu está aberto
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    if (menuOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.classList.remove("overflow-hidden");
    };
  }, [menuOpen]);

  const linkClass = (path: string) =>
    `relative pb-1 transition ${
      location.pathname === path
        ? "text-orange-400 after:w-full after:bg-orange-400"
        : "hover:text-orange-300 after:w-0 after:bg-white"
    } after:absolute after:h-[2px] after:bottom-0 after:left-0 after:transition-all after:duration-300`;

  return (
    <header className="font-sans bg-[#01014d] text-white shadow-xl sticky top-0 z-50 border-b border-white/10">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* LOGOS + NOME DO PROJETO */}
        <div className="flex items-center gap-4">
          {/* coloque os arquivos em /public/imgs e use src iniciando com /imgs */}
          <Link to="/" className="flex-shrink-0 hover:opacity-80 transition">
            <img src="public/imgs/image imrea 2.png" alt="IMREA" className="h-10" />
          </Link>
          <Link to="/" className="flex-shrink-0 hover:opacity-80 transition">
            <img src="public/imgs/NOVO-LOGO-HC-2022.png" alt="HC" className="h-10" />
          </Link>

          {/* Nome do Projeto e Equipe (desktop) */}
          <div className="hidden lg:flex flex-col leading-4 ml-2">
            <span className="text-xs font-bold tracking-wide">
              IMREA Assistente – Telemedicina HC
            </span>
            <span className="text-[10px] opacity-80">
              Desenvolvido por: Marina • João • Bruno
            </span>
          </div>
        </div>

        {/* NAV DESKTOP */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold tracking-wide">
          <Link to="/" className={linkClass("/")}>INÍCIO</Link>
          <Link to="/agendar" className={linkClass("/agendar")}>AGENDAR</Link>
          <Link to="/chat" className={linkClass("/chat")}>CHAT</Link>
          <Link to="/resultados" className={linkClass("/resultados")}>RESULTADOS</Link>
          <Link to="/integrantes" className={linkClass("/integrantes")}>INTEGRANTES</Link>
          <Link to="/faq" className={linkClass("/faq")}>FAQ</Link>
          <Link to="/contato" className={linkClass("/contato")}>CONTATO</Link>
        </nav>

        {/* LOGIN (desktop) */}
        <Link
          to="/login"
          className="hidden md:flex items-center gap-2 bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-md text-sm font-semibold shadow transition-colors duration-200"
        >
          <FaUserCircle className="text-xl" />
          <span>ENTRAR</span>
        </Link>

        {/* BOTÃO MENU MOBILE */}
        <button
          onClick={() => setMenuOpen(true)}
          className="md:hidden text-2xl hover:text-orange-400 transition"
          aria-label="Abrir menu"
          aria-expanded={menuOpen}
          aria-controls="mobile-drawer"
        >
          <FaBars />
        </button>
      </div>

      {/* MENU MOBILE (overlay e drawer com fundo 100% sólido) */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* OVERLAY SÓLIDO (sem transparência) */}
          <div
            className="fixed inset-0 bg-[#01014d]"
            onClick={() => setMenuOpen(false)}
          />

          {/* DRAWER com fundo sólido */}
          <div
            id="mobile-drawer"
            role="dialog"
            aria-modal="true"
            className="
              ml-auto h-full w-80 max-w-[85%]
              bg-[#0a0a3d] text-white
              border-l border-orange-500
              shadow-2xl
              animate-[drawerIn_.25s_ease-out]
              p-6 flex flex-col
            "
            style={{ willChange: "transform" }}
          >
            {/* Cabeçalho do menu */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex flex-col">
                <span className="text-sm font-bold tracking-wide text-orange-300">
                  IMREA Assistente – HCFMUSP
                </span>
                <span className="text-xs text-white/80">
                  Marina • João • Bruno
                </span>
              </div>
              <button
                onClick={() => setMenuOpen(false)}
                className="text-2xl hover:text-orange-400 transition"
                aria-label="Fechar menu"
              >
                <FaTimes />
              </button>
            </div>

            {/* Navegação */}
            <nav className="flex flex-col gap-5 text-lg font-semibold">
              <Link to="/" onClick={() => setMenuOpen(false)}>Início</Link>
              <Link to="/agendar" onClick={() => setMenuOpen(false)}>Agendar</Link>
              <Link to="/chat" onClick={() => setMenuOpen(false)}>Chat</Link>
              <Link to="/resultados" onClick={() => setMenuOpen(false)}>Resultados</Link>
              <Link to="/integrantes" onClick={() => setMenuOpen(false)}>Integrantes</Link>
              <Link to="/faq" onClick={() => setMenuOpen(false)}>FAQ</Link>
              <Link to="/contato" onClick={() => setMenuOpen(false)}>Contato</Link>

              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="mt-6 inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-md text-sm font-semibold transition"
              >
                <FaUserCircle className="text-xl" />
                <span>ENTRAR</span>
              </Link>
            </nav>
          </div>
        </div>
      )}

      {/* animação */}
      <style>
        {`
          @keyframes drawerIn {
            from { transform: translateX(100%); opacity: 1; }
            to   { transform: translateX(0%);   opacity: 1; }
          }
        `}
      </style>
    </header>
  );
}
