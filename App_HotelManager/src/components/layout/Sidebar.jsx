import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react";
import { BsCalendarCheck } from "react-icons/bs";
import { HiOutlineUserGroup } from "react-icons/hi2";
import { MdBedroomParent } from "react-icons/md";
import { FaUserCheck } from "react-icons/fa6";
import { FaHotel } from "react-icons/fa6";
import { CiLogout } from "react-icons/ci";
import { FaChartBar } from "react-icons/fa";
import { MdOutlinePersonAdd } from "react-icons/md";

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
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${
      isActive
        ? "bg-slate-900 text-white shadow-md"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
    }`;

  const SidebarContent = () => (
    <>
      <div className="h-16 flex items-center px-4 sm:px-6 border-b border-slate-200 bg-white">
        <h1 className="text-lg sm:text-xl font-bold flex items-center gap-2 text-slate-900">
          <span>
            <FaHotel />
          </span>
          <span className="hidden sm:inline">HotelManager</span>
          <span className="sm:hidden">HM</span>
        </h1>
      </div>

      <div className="px-4 sm:px-6 mt-5 mb-3">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          {esAdmin ? "Administración" : "Menú Principal"}
        </p>
      </div>

      <nav className="px-3 sm:px-4 space-y-2 flex-1">
        {esAdmin ? (
          <NavLink to="/usuarios" className={linkClass} onClick={() => setIsMobileOpen(false)}>
            <span className="text-lg sm:text-base">
              <HiOutlineUserGroup />
            </span>
            <span className="text-sm sm:text-base">Usuarios</span>
          </NavLink>
        ) : (
          <>


          <NavLink
                  to="/ganancias"
                  className={linkClass}
                  onClick={() => setIsMobileOpen(false)}
                >
                  <span className="text-lg sm:text-base">
                    <FaChartBar />
                  </span>

                  <span className="text-sm sm:text-base">
                    Ganancias
                  </span>
                </NavLink>

            <NavLink to="/asignaciones" className={linkClass} onClick={() => setIsMobileOpen(false)}>
              <span className="text-lg sm:text-base">
                <BsCalendarCheck />
              </span>
              <span className="text-sm sm:text-base">Asignaciones</span>
            </NavLink>

            <NavLink to="/habitaciones" className={linkClass} onClick={() => setIsMobileOpen(false)}>
              <span className="text-lg sm:text-base">
                <MdBedroomParent />
              </span>
              <span className="text-sm sm:text-base">Habitaciones</span>
            </NavLink>

            <NavLink to="/clientes" className={linkClass} onClick={() => setIsMobileOpen(false)}>
              <span className="text-lg sm:text-base">
                <FaUserCheck />
              </span>
              <span className="text-sm sm:text-base">Clientes</span>
            </NavLink>

            <NavLink to="/perfil-hotel" className={linkClass} onClick={() => setIsMobileOpen(false)}>
              <span className="text-lg sm:text-base">
                <MdOutlinePersonAdd />
              </span>
              <span className="text-sm sm:text-base">Perfil del Hotel</span>
            </NavLink>
          </>
        )}
      </nav>

      <div className="border-t border-slate-200 p-4 sm:p-6 bg-white">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold shadow-sm">
            {nombre.charAt(0).toUpperCase()}
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm sm:text-base truncate text-slate-900">
              {nombre}
            </p>
            <p className="text-xs sm:text-sm text-slate-500">
              {esAdmin ? "Administrador" : "Usuario"}
            </p>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full text-left text-slate-600 hover:text-red-600 hover:bg-red-50 px-3 py-2.5 rounded-xl transition-all duration-200 text-sm sm:text-base flex items-center gap-2 font-semibold"
        >
          <span>
            <CiLogout />
          </span>
          <span>Cerrar sesión</span>
        </button>
      </div>
    </>
  );

  if (isMobile) {
    return (
      <>
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="fixed top-4 right-4 z-50 bg-white text-slate-900 border border-slate-200 p-2 rounded-lg shadow-lg md:hidden"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {isMobileOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-40 md:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
        )}

        <aside
          className={`fixed top-0 left-0 h-full bg-white text-slate-900 transition-all duration-300 z-40 shadow-2xl border-r border-slate-200 ${
            isMobileOpen ? "w-64" : "w-0"
          } overflow-hidden md:hidden`}
        >
          <div className={`${isMobileOpen ? "block" : "hidden"} w-64 h-full flex flex-col`}>
            <SidebarContent />
          </div>
        </aside>

        <aside className="hidden md:block w-64 h-screen sticky top-0 bg-white text-slate-900 shadow-sm border-r border-slate-200 flex flex-col">
          <SidebarContent />
        </aside>
      </>
    );
  }

  return (
    <aside className="hidden md:block w-64 h-screen sticky top-0 bg-white text-slate-900 shadow-sm border-r border-slate-200 flex flex-col">
      <SidebarContent />
    </aside>
  );
};

export default Sidebar;