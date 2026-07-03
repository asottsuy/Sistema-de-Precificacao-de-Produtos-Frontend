import React, { useState } from "react";
// 1. Importações do React Router
import { Link, NavLink as RouterNavLink } from "react-router-dom";
// 2. Removido o 'Link' daqui para evitar conflito
import {
  DollarSign,
  BarChart2,
  LayoutDashboard,
  Utensils,
  Menu,
  X,
} from "lucide-react";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-white border-b border-slate-100 sticky top-0 z-50 shadow-sm backdrop-blur-md bg-white/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* 1. LOGO */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="bg-indigo-600 p-2 rounded-lg text-white flex items-center justify-center shadow-md shadow-indigo-100">
              <DollarSign className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-800">
              Precifica
            </span>
          </Link>

          {/* 2. NAVEGAÇÃO DESKTOP */}
          <nav className="hidden md:flex space-x-1 items-center">
            <CustomNavLink to="/ingredientes">
              <LayoutDashboard className="w-4 h-4" />
              Ingredientes
            </CustomNavLink>

            <CustomNavLink to="/produtos">
              <Utensils className="w-4 h-4" />
              Produtos
            </CustomNavLink>

            <CustomNavLink to="/painel-indicadores">
              <BarChart2 className="w-4 h-4" />
              Painel Indicadores
            </CustomNavLink>
          </nav>

          {/* 3. PERFIL / USUÁRIO (DIREITA) */}
          <div className="hidden md:flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-slate-700 leading-none">
                Felipe F.
              </p>
              <span className="text-xs text-slate-400">Admin</span>
            </div>
            <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-medium text-sm shadow-sm">
              FF
            </div>
          </div>

          {/* BOTÃO MOBILE */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-500 hover:text-slate-700 p-2 rounded-md focus:outline-none"
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* MENU MOBILE */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-slate-100 px-4 pt-2 pb-4 space-y-1 animate-fade-in">
          <MobileNavLink to="/ingredientes" onClick={() => setIsOpen(false)}>
            Ingredientes
          </MobileNavLink>
          <MobileNavLink to="/produtos" onClick={() => setIsOpen(false)}>
            Produtos
          </MobileNavLink>
          <MobileNavLink
            to="/PainelIndicadores"
            onClick={() => setIsOpen(false)}
          >
            Painel Indicadores
          </MobileNavLink>

          <div className="pt-4 border-t border-slate-100 flex items-center gap-3 px-3">
            <div className="h-9 w-9 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium text-sm">
              FF
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700">Felipe F.</p>
              <p className="text-xs text-slate-400">Admin</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

// Sub-componente auxiliar para Desktop (Usa RouterNavLink para detectar rota ativa automaticamente)
function CustomNavLink({
  to,
  children,
}: {
  to: string;
  children: React.ReactNode;
}) {
  return (
    <RouterNavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
          isActive
            ? "bg-indigo-50 text-indigo-600"
            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
        }`
      }
    >
      {children}
    </RouterNavLink>
  );
}

// Sub-componente auxiliar para Mobile
function MobileNavLink({
  to,
  children,
  onClick,
}: {
  to: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <RouterNavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `block px-3 py-2.5 rounded-lg text-base font-medium ${
          isActive
            ? "bg-indigo-50 text-indigo-600 font-semibold"
            : "text-slate-600 hover:bg-slate-50"
        }`
      }
    >
      {children}
    </RouterNavLink>
  );
}
