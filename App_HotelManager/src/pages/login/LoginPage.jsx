import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Swal from "sweetalert2";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formulario, setFormulario] = useState({
    username: "",
    password: "",
  });

  const [cargando, setCargando] = useState(false);

  const handleChange = (e) => {
    setFormulario({
      ...formulario,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);

    try {
      await login(formulario.username, formulario.password);
      
      // Mostrar mensaje de bienvenida
      Swal.fire({
        icon: "success",
        title: "¡Bienvenido!",
        text: `Has iniciado sesión correctamente.`,
        timer: 2000,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        },
      }).then(() => {
        navigate("/");
      });
      
    } catch (error) {
      // Mostrar error con SweetAlert
      let mensaje = "Usuario o contraseña incorrectos";
      
      if (error.response?.data?.expirado) {
        mensaje = error.response?.data?.mensaje || "Tu período de prueba ha terminado. Contacta al administrador.";
      } else if (error.response?.data?.error) {
        mensaje = error.response.data.error;
      }
      
      Swal.fire({
        icon: "error",
        title: "Error de inicio de sesión",
        text: mensaje,
        confirmButtonColor: "#1f2937",
        confirmButtonText: "Intentar de nuevo",
      });
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white border border-gray-300 rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-gray-900">
          HotelManager
        </h1>

        <p className="text-center text-gray-500 mt-2 mb-6">
          Inicia sesión para continuar
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Usuario
            </label>
            <input
              type="text"
              name="username"
              value={formulario.username}
              onChange={handleChange}
              placeholder="Ingrese su usuario"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-gray-800"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              name="password"
              value={formulario.password}
              onChange={handleChange}
              placeholder="Ingrese su contraseña"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-gray-800"
            />
          </div>

          <button
            type="submit"
            disabled={cargando}
            className="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 disabled:opacity-60 transition-all"
          >
            {cargando ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;