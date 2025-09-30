import { useState } from "react";
import { Link } from "react-router-dom";
import { FaUserCircle, FaBars, FaTimes } from "react-icons/fa";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="font-sans flex items-center justify-between px-4 sm:px-6 py-4 bg-blue-900 text-white shadow-md sticky top-0 z-50">
    
      <div className="flex items-center gap-3 sm:gap-4">
        <Link to="/" className="flex-shrink-0">
          <img
            src="public/imgs/image imrea 2.png"
            alt="Logo HC"
            className="h-10 sm:h-12 w-auto hover:scale-105 transition-transform duration-300"
          />
        </Link>
        <Link to="/" className="flex-shrink-0">
          <img
            src="/imgs/NOVO-LOGO-HC-2022.png"
            alt="Logo IMREA"
            className="h-10 sm:h-12 w-auto hover:scale-105 transition-transform duration-300"
          />
        </Link>
      </div>

    
      <div className="flex items-center gap-3">
        <Link
          to="/login"
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 px-3 sm:px-4 py-2 rounded-md text-sm font-semibold shadow transition-colors duration-200"
        >
          <FaUserCircle className="text-lg sm:text-xl" aria-hidden="true" />
          <span>ENTRAR</span>
        </Link>

        <button
          className="text-2xl focus:outline-none hover:text-orange-400 transition"
          onClick={() => setMenuOpen(true)}
          aria-label="Abrir menu"
        >
          <FaBars />
        </button>
      </div>

      {/* ===== MENU LATERAL ===== */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
          />

          {/* Drawer */}
          <div className="ml-auto w-72 sm:w-80 h-full bg-gradient-to-b from-blue-900 to-blue-700 shadow-2xl flex flex-col p-6 animate-slide-in rounded-l-2xl">
            {/* Header Drawer */}
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold text-white">Menu</h2>
              <button
                onClick={() => setMenuOpen(false)}
                className="text-2xl hover:text-orange-400 transition"
              >
                <FaTimes />
              </button>
            </div>

            {/* Links */}
            <nav className="flex flex-col gap-5 text-lg font-semibold">
              <Link
                to="/"
                onClick={() => setMenuOpen(false)}
                className="hover:text-orange-400 transition"
              >
                Página Inicial
              </Link>
              <Link
                to="/agendar"
                onClick={() => setMenuOpen(false)}
                className="hover:text-orange-400 transition"
              >
                Agendar Consulta
              </Link>
              <Link
                to="/chat"
                onClick={() => setMenuOpen(false)}
                className="hover:text-orange-400 transition"
              >
                Nosso Chat
              </Link>
              <Link
                to="/resultados"
                onClick={() => setMenuOpen(false)}
                className="hover:text-orange-400 transition"
              >
                Resultados
              </Link>
              <Link
                to="/integrantes"
                onClick={() => setMenuOpen(false)}
                className="hover:text-orange-400 transition"
              >
                Integrantes
              </Link>
              <Link
                to="/faq"
                onClick={() => setMenuOpen(false)}
                className="hover:text-orange-400 transition"
              >
                FAQ
              </Link>
              <Link
                to="/contato"
                onClick={() => setMenuOpen(false)}
                className="hover:text-orange-400 transition"
              >
                Contato
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}

