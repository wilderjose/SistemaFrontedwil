import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react";

const Sidebar = () => {
  const { logout, usuario } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const esAdmin = usuario?.rol === "admin";
  const nombre = usuario?.first_name || usuario?.username || "Usuario";

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMobileOpen(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-md font-semibold transition-all duration-200 ${
      isActive
        ? "bg-slate-600 text-white shadow-md"
        : "text-slate-300 hover:bg-slate-700 hover:text-white"
    }`;

  const SidebarContent = () => (
    <>
      {/* Header del sidebar */}
      <div className="h-16 flex items-center px-4 sm:px-6 border-b border-slate-700">
        <h1 className="text-lg sm:text-xl font-bold flex items-center gap-2">
          <span>🏨</span>
          <span className="hidden sm:inline">HotelManager</span>
          <span className="sm:hidden">HM</span>
        </h1>
      </div>

      {/* Título del menú */}
      <div className="px-4 sm:px-6 mt-4 sm:mt-6 mb-2 sm:mb-3">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          {esAdmin ? "Administración" : "Menú Principal"}
        </p>
      </div>

      {/* Menú de navegación - flex-1 para ocupar todo el espacio disponible */}
      <nav className="px-2 sm:px-4 space-y-1 sm:space-y-2 flex-1">
        {esAdmin ? (
          <NavLink to="/usuarios" className={linkClass} onClick={() => setIsMobileOpen(false)}>
            <span className="text-yellow-400 text-lg sm:text-base">👥</span>
            <span className="text-sm sm:text-base">Usuarios</span>
          </NavLink>
        ) : (
          <>
            <NavLink to="/asignaciones" className={linkClass} onClick={() => setIsMobileOpen(false)}>
              <span className="text-yellow-400 text-lg sm:text-base">📅</span>
              <span className="text-sm sm:text-base">Asignaciones</span>
            </NavLink>

            <NavLink to="/habitaciones" className={linkClass} onClick={() => setIsMobileOpen(false)}>
              <span className="text-yellow-400 text-lg sm:text-base">🛏️</span>
              <span className="text-sm sm:text-base">Habitaciones</span>
            </NavLink>

            <NavLink to="/clientes" className={linkClass} onClick={() => setIsMobileOpen(false)}>
              <span className="text-yellow-400 text-lg sm:text-base">👤</span>
              <span className="text-sm sm:text-base">Clientes</span>
            </NavLink>

            <NavLink to="/perfil-hotel" className={linkClass} onClick={() => setIsMobileOpen(false)}>
              <span className="text-yellow-400 text-lg sm:text-base">⚙️</span>
              <span className="text-sm sm:text-base">Perfil del Hotel</span>
            </NavLink>
          </>
        )}
      </nav>

      {/* Sección de usuario y logout - SIEMPRE AL FINAL */}
      <div className="border-t border-slate-700 p-4 sm:p-6">
        {/* Información del usuario */}
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center font-bold text-sm sm:text-base shadow-md">
            {nombre.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm sm:text-base truncate">{nombre}</p>
            <p className="text-xs sm:text-sm text-slate-300">
              {esAdmin ? "Administrador" : "Usuario"}
            </p>
          </div>
        </div>

        {/* Botón de cerrar sesión */}
        <button 
          onClick={logout} 
          className="w-full text-left text-slate-300 hover:text-white hover:bg-slate-700 px-3 py-2 rounded-md transition-all duration-200 text-sm sm:text-base flex items-center gap-2"
        >
          <span>🚪</span>
          <span>Cerrar sesión</span>
        </button>
      </div>
    </>
  );

  // Versión para móvil
  if (isMobile) {
    return (
      <>
        {/* Botón de menú móvil */}
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="fixed top-4 right-4 z-50 bg-slate-800 text-white p-2 rounded-lg shadow-lg md:hidden"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Overlay para móvil */}
        {isMobileOpen && (
          <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsMobileOpen(false)} />
        )}

        {/* Sidebar móvil */}
        <aside className={`fixed top-0 left-0 h-full bg-slate-800 text-white transition-all duration-300 z-40 shadow-2xl ${isMobileOpen ? "w-64" : "w-0"} overflow-hidden md:hidden`}>
          <div className={`${isMobileOpen ? "block" : "hidden"} w-64 h-full flex flex-col`}>
            <SidebarContent />
          </div>
        </aside>

        {/* Sidebar desktop (visible cuando no es móvil) */}
        <aside className="hidden md:block w-64 h-screen sticky top-0 bg-slate-800 text-white shadow-xl flex flex-col">
          <SidebarContent />
        </aside>
      </>
    );
  }

  // Versión para desktop (grande)
  return (
    <aside className="hidden md:block w-64 h-screen sticky top-0 bg-slate-800 text-white shadow-xl flex flex-col">
      <SidebarContent />
    </aside>
  );
};

export default Sidebar;