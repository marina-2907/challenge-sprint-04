import { useState } from "react";
import { Link } from "react-router-dom";
import { FaUserCircle, FaBars, FaTimes } from "react-icons/fa";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      className="font-sans flex items-center justify-between px-6 py-5 bg-blue-900 text-white shadow-md relative z-50"
    >
      {/* ===== LOGOS ESQUERDA ===== */}
      <div className="flex items-center gap-4">
        <Link to="/" className="flex-shrink-0">
          <img
            src="public/imgs/image imrea 2.png"
            alt="Logo HC"
            className="h-12 w-auto hover:scale-105 transition-transform duration-300"
          />
        </Link>
        <Link to="/" className="flex-shrink-0">
          <img
            src="/imgs/NOVO-LOGO-HC-2022.png"
            alt="Logo IMREA"
            className="h-12 w-auto hover:scale-105 transition-transform duration-300"
          />
        </Link>
      </div>

      {/* ===== NAVEGAÇÃO DESKTOP ===== */}
      <nav className="hidden md:flex items-center gap-6 text-lg font-medium">
        <Link
          to="/agendar"
          className="px-4 py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-sky-600 to-blue-700 
          hover:from-orange-400 hover:to-pink-500 hover:text-white 
          shadow-md hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-0.5"
        >
          Agendar Consulta
        </Link>
        <Link
          to="/chat"
          className="px-4 py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-sky-600 to-blue-700 
          hover:from-orange-400 hover:to-pink-500 hover:text-white 
          shadow-md hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-0.5"
        >
          Nosso Chat
        </Link>
        <Link
          to="/resultados"
          className="px-4 py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-sky-600 to-blue-700 
          hover:from-orange-400 hover:to-pink-500 hover:text-white 
          shadow-md hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-0.5"
        >
          Resultados
        </Link>
        <Link
          to="/contato"
          className="px-4 py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-sky-600 to-blue-700 
          hover:from-orange-400 hover:to-pink-500 hover:text-white 
          shadow-md hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-0.5"
        >
          Contato
        </Link>
      </nav>

      {/* ===== BOTÃO LOGIN DESKTOP ===== */}
      <div className="hidden md:flex items-center gap-3">
        <Link
          to="/login"
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-md text-sm font-semibold shadow transition-colors duration-200"
        >
          <FaUserCircle className="text-xl" aria-hidden="true" />
          <span>ENTRAR</span>
        </Link>
      </div>

      {/* ===== HAMBÚRGUER MOBILE ===== */}
      <button
        className="md:hidden text-2xl focus:outline-none"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Abrir menu"
      >
        {menuOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* ===== MENU MOBILE ===== */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-blue-900 shadow-lg flex flex-col items-center gap-4 py-6 md:hidden animate-fade-in z-50">
          <Link
            to="/agendar"
            onClick={() => setMenuOpen(false)}
            className="block text-lg font-semibold hover:text-orange-400 transition-colors"
          >
            Agendar Consulta
          </Link>
          <Link
            to="/chat"
            onClick={() => setMenuOpen(false)}
            className="block text-lg font-semibold hover:text-orange-400 transition-colors"
          >
            Nosso Chat
          </Link>
          <Link
            to="/resultados"
            onClick={() => setMenuOpen(false)}
            className="block text-lg font-semibold hover:text-orange-400 transition-colors"
          >
            Resultados
          </Link>
          <Link
            to="/contato"
            onClick={() => setMenuOpen(false)}
            className="block text-lg font-semibold hover:text-orange-400 transition-colors"
          >
            Contato
          </Link>
          <Link
            to="/login"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-md text-sm font-semibold shadow transition-colors duration-200"
          >
            <FaUserCircle className="text-xl" />
            <span>ENTRAR</span>
          </Link>
        </div>
      )}
    </header>
  );
}
