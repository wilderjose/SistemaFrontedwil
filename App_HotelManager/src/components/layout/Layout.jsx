import { Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Sidebar from "./Sidebar";

const Layout = () => {
  const { usuario } = useAuth();

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar fijo - no hace scroll */}
      <Sidebar />
      
      {/* Contenido principal - CON SCROLL */}
      <main className="flex-1 overflow-y-auto bg-slate-50">
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;