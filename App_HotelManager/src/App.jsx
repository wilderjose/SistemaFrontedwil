import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/protected/ProtectedRoute";
import Layout from "./components/layout/Layout";

import LoginPage from "./pages/login/LoginPage";
import UsuariosPage from "./pages/usuarios/UsuariosPage";
import AsignacionesPage from "./pages/asignaciones/AsignacionesPage";
import HabitacionesPage from "./pages/habitaciones/HabitacionesPage";
import ClientesPage from "./pages/clientes/ClientesPage";
import PerfilHotelPage from "./pages/perfilHotel/PerfilHotelPage";

// Componente para redirigir según el rol
const RedirectByRole = () => {
  const { usuario } = useAuth();
  const esAdmin = usuario?.rol === "admin";
  return <Navigate to={esAdmin ? "/usuarios" : "/asignaciones"} replace />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<RedirectByRole />} />
            
            <Route path="usuarios" element={<UsuariosPage />} />
            <Route path="asignaciones" element={<AsignacionesPage />} />
            <Route path="habitaciones" element={<HabitacionesPage />} />
            <Route path="clientes" element={<ClientesPage />} />
            <Route path="perfil-hotel" element={<PerfilHotelPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;