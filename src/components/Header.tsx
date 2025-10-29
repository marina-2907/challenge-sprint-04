import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaUserCircle, FaBars, FaTimes } from "react-icons/fa";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const linkClass = (path: string) =>
    `relative pb-1 transition ${
      location.pathname === path
        ? "text-orange-400 after:w-full after:bg-orange-400"
        : "hover:text-orange-300 after:w-0 after:bg-white"
    }
    after:absolute after:h-[2px] after:bottom-0 after:left-0 after:transition-all after:duration-300`;

  return (
    <header className="font-sans bg-[#01014d] text-white shadow-xl sticky top-0 z-50 backdrop-blur-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">

        {/* LOGOS */}
        <div className="flex items-center gap-4">
          <Link to="/" className="flex-shrink-0 hover:opacity-80 transition">
            <img src="public/imgs/image imrea 2.png" className="h-10" />
          </Link>
          <Link to="/" className="flex-shrink-0 hover:opacity-80 transition">
            <img src="/imgs/NOVO-LOGO-HC-2022.png" className="h-10" />
          </Link>
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

        {/* LOGIN */}
        <Link
          to="/login"
          className="hidden md:flex items-center gap-2 bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-md text-sm font-semibold shadow transition-colors duration-200"
        >
          <FaUserCircle className="text-xl" />
          <span>ENTRAR</span>
        </Link>

        {/* MENU MOBILE */}
        <button
          onClick={() => setMenuOpen(true)}
          className="md:hidden text-2xl hover:text-orange-400 transition"
        >
          <FaBars />
        </button>
      </div>

      {/* DRAWER MOBILE */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMenuOpen(false)} />
          <div className="ml-auto w-72 h-full bg-[#111] shadow-2xl p-6 flex flex-col border-l border-white/10 animate-slide-in">

            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold tracking-wide text-white">MENU</h2>
              <button onClick={() => setMenuOpen(false)} className="text-2xl hover:text-orange-400 transition">
                <FaTimes />
              </button>
            </div>

            <nav className="flex flex-col gap-5 text-lg font-semibold text-white">
              <Link to="/" onClick={() => setMenuOpen(false)}>Início</Link>
              <Link to="/agendar" onClick={() => setMenuOpen(false)}>Agendar</Link>
              <Link to="/chat" onClick={() => setMenuOpen(false)}>Chat</Link>
              <Link to="/resultados" onClick={() => setMenuOpen(false)}>Resultados</Link>
              <Link to="/integrantes" onClick={() => setMenuOpen(false)}>Integrantes</Link>
              <Link to="/faq" onClick={() => setMenuOpen(false)}>FAQ</Link>
              <Link to="/contato" onClick={() => setMenuOpen(false)}>Contato</Link>

              <Link
                to="/login"
                className="mt-4 flex items-center gap-2 bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-md text-sm font-semibold transition"
              >
                <FaUserCircle className="text-xl" />
                <span>ENTRAR</span>
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
