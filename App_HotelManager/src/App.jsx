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

import GraficaGanancias from "./components/dashboard/GraficaGanancias";

// Redirección inicial
const RedirectByRole = () => {
  const { usuario } = useAuth();
  const esAdmin = usuario?.rol === "admin";

  return <Navigate to={esAdmin ? "/usuarios" : "/ganancias"} replace />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* LOGIN */}
          <Route path="/login" element={<LoginPage />} />

          {/* SISTEMA PROTEGIDO */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            {/* Redirección inicial */}
            <Route index element={<RedirectByRole />} />

            {/* Dashboard / gráficas */}
            <Route
              path="ganancias"
              element={<GraficaGanancias />}
            />

            {/* Usuarios */}
            <Route
              path="usuarios"
              element={<UsuariosPage />}
            />

            {/* Asignaciones */}
            <Route
              path="asignaciones"
              element={<AsignacionesPage />}
            />

            {/* Habitaciones */}
            <Route
              path="habitaciones"
              element={<HabitacionesPage />}
            />

            {/* Clientes */}
            <Route
              path="clientes"
              element={<ClientesPage />}
            />

            {/* Perfil Hotel */}
            <Route
              path="perfil-hotel"
              element={<PerfilHotelPage />}
            />
          </Route>

          {/* Ruta inválida */}
          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;