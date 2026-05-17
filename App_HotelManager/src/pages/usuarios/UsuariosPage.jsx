import { useEffect, useState } from "react";
import api from "../../api/axios";
import Swal from "sweetalert2";

const UsuariosPage = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [modal, setModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [guardando, setGuardando] = useState(false);

  const [formulario, setFormulario] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    rol: "usuario",
    password: "",
    activo: true,
  });

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      const response = await api.get("usuarios/");
      setUsuarios(response.data);
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron cargar los usuarios",
        confirmButtonColor: "#334155",
      });
    }
  };

  const abrirModalCrear = () => {
    setEditando(null);
    setFormulario({
      username: "",
      first_name: "",
      last_name: "",
      email: "",
      rol: "usuario",
      password: "",
      activo: true,
    });
    setModal(true);
  };

  const abrirModalEditar = (usuario) => {
    setEditando(usuario.id);
    setFormulario({
      username: usuario.username,
      first_name: usuario.first_name || "",
      last_name: usuario.last_name || "",
      email: usuario.email || "",
      rol: usuario.rol,
      password: "",
      activo: usuario.activo,
    });
    setModal(true);
  };

  const cerrarModal = () => {
    setModal(false);
    setEditando(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormulario({
      ...formulario,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const guardarUsuario = async (e) => {
    e.preventDefault();

    if (!formulario.username.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Campo requerido",
        text: "El nombre de usuario es requerido",
        timer: 1800,
        showConfirmButton: false,
        confirmButtonColor: "#334155",
      });
      return;
    }

    if (!editando && formulario.password.length < 6) {
      Swal.fire({
        icon: "warning",
        title: "Contraseña débil",
        text: "La contraseña debe tener al menos 6 caracteres",
        timer: 1800,
        showConfirmButton: false,
        confirmButtonColor: "#334155",
      });
      return;
    }

    try {
      setGuardando(true);

      const data = { ...formulario };
      
      if (editando && !data.password) {
        delete data.password;
      }

      if (editando) {
        await api.patch(`usuarios/${editando}/`, data);
        Swal.fire({
          icon: "success",
          title: "Actualizado",
          text: "Usuario actualizado correctamente",
          timer: 1800,
          showConfirmButton: false,
          confirmButtonColor: "#334155",
        });
      } else {
        await api.post("usuarios/", data);
        Swal.fire({
          icon: "success",
          title: "Creado",
          text: "Usuario creado correctamente",
          timer: 1800,
          showConfirmButton: false,
          confirmButtonColor: "#334155",
        });
      }

      cerrarModal();
      cargarUsuarios();
    } catch (error) {
      console.log(error.response?.data || error);
      
      let mensaje = "No se pudo guardar el usuario.";
      if (error.response?.data?.username) {
        mensaje = "El nombre de usuario ya existe";
      } else if (error.response?.data?.email) {
        mensaje = "El email ya está registrado";
      }
      
      Swal.fire({
        icon: "error",
        title: "Error",
        text: mensaje,
        confirmButtonColor: "#334155",
      });
    } finally {
      setGuardando(false);
    }
  };

  const eliminarUsuario = async (id, username) => {
    const result = await Swal.fire({
      title: "¿Eliminar usuario?",
      text: `El usuario "${username}" será eliminado permanentemente.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#64748b",
    });

    if (!result.isConfirmed) return;

    try {
      await api.delete(`usuarios/${id}/`);
      
      Swal.fire({
        icon: "success",
        title: "Eliminado",
        text: "Usuario eliminado correctamente",
        timer: 1800,
        showConfirmButton: false,
        confirmButtonColor: "#334155",
      });
      
      cargarUsuarios();
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo eliminar el usuario.",
        confirmButtonColor: "#334155",
      });
    }
  };

  const cambiarEstado = async (usuario) => {
    const nuevoEstado = !usuario.activo;
    const accion = nuevoEstado ? "activar" : "desactivar";
    
    const result = await Swal.fire({
      title: `¿${accion === "activar" ? "Activar" : "Desactivar"} usuario?`,
      text: `El usuario "${usuario.username}" quedará ${accion === "activar" ? "activo" : "inactivo"}.`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: `Sí, ${accion}`,
      cancelButtonText: "Cancelar",
      confirmButtonColor: accion === "activar" ? "#16a34a" : "#dc2626",
      cancelButtonColor: "#64748b",
    });

    if (!result.isConfirmed) return;

    try {
      await api.patch(`usuarios/${usuario.id}/`, {
        activo: nuevoEstado,
      });

      Swal.fire({
        icon: "success",
        title: `${accion === "activar" ? "Activado" : "Desactivado"}`,
        text: `Usuario ${accion === "activar" ? "activado" : "desactivado"} correctamente`,
        timer: 1800,
        showConfirmButton: false,
        confirmButtonColor: "#334155",
      });

      cargarUsuarios();
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `No se pudo ${accion} el usuario.`,
        confirmButtonColor: "#334155",
      });
    }
  };

  return (
    <section className="w-full px-3 sm:px-6 py-4 sm:py-6">
      {/* Header - Responsive */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
        <div className="text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center justify-center sm:justify-start gap-2">
            <span className="text-3xl sm:text-4xl">👥</span>
            Gestión de Usuarios
          </h1>
          <p className="text-slate-500 mt-1 text-sm sm:text-base">
            Administra los usuarios del sistema
          </p>
        </div>

        <button
          onClick={abrirModalCrear}
          className="w-full sm:w-auto bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg text-sm sm:text-base"
        >
          <span className="text-lg sm:text-xl">＋</span>
          Nuevo Usuario
        </button>
      </div>

      {/* Tabla - Responsive */}
      <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        {/* Versión Desktop - Tabla */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b-2 border-slate-200">
              <tr>
                <th className="text-left px-4 sm:px-6 py-3 sm:py-4 font-semibold text-slate-600 text-sm sm:text-base">
                  Usuario
                </th>
                <th className="text-left px-4 sm:px-6 py-3 sm:py-4 font-semibold text-slate-600 text-sm sm:text-base">
                  Nombre
                </th>
                <th className="text-left px-4 sm:px-6 py-3 sm:py-4 font-semibold text-slate-600 text-sm sm:text-base">
                  Rol
                </th>
                <th className="text-left px-4 sm:px-6 py-3 sm:py-4 font-semibold text-slate-600 text-sm sm:text-base">
                  Estado
                </th>
                <th className="text-right px-4 sm:px-6 py-3 sm:py-4 font-semibold text-slate-600 text-sm sm:text-base">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="px-4 sm:px-6 py-3 sm:py-4 font-semibold text-slate-900 text-sm sm:text-base">
                    {usuario.username}
                  </td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4 text-slate-700 text-sm sm:text-base">
                    {usuario.first_name} {usuario.last_name}
                  </td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4">
                    <span className={`px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm font-semibold ${usuario.rol === "admin" ? "bg-purple-100 text-purple-700" : "bg-slate-100 text-slate-700"}`}>
                      {usuario.rol === "admin" ? "👑 Administrador" : "👤 Usuario"}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4">
                    <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${usuario.activo ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {usuario.activo ? "🟢 Activo" : "🔴 Inactivo"}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4">
                    <div className="flex items-center justify-end gap-2 sm:gap-3">
                      <button onClick={() => abrirModalEditar(usuario)} className="text-blue-500 hover:text-blue-700 transition-colors text-base sm:text-lg" title="Editar">✎</button>
                      <button onClick={() => cambiarEstado(usuario)} className="text-orange-500 hover:text-orange-700 transition-colors text-base sm:text-lg" title={usuario.activo ? "Desactivar" : "Activar"}>↻</button>
                      <button onClick={() => eliminarUsuario(usuario.id, usuario.username)} className="text-red-500 hover:text-red-700 transition-colors text-base sm:text-lg" title="Eliminar">🗑</button>
                    </div>
                  </td>
                </tr>
              ))}
              {usuarios.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-10 text-slate-500">
                    No hay usuarios registrados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Versión Móvil - Tarjetas */}
        <div className="md:hidden space-y-3 p-3">
          {usuarios.map((usuario) => (
            <div key={usuario.id} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{usuario.username}</h3>
                  <p className="text-slate-500 text-xs mt-0.5">{usuario.first_name} {usuario.last_name}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => abrirModalEditar(usuario)} className="text-blue-500 hover:text-blue-700 text-lg px-2 py-1" title="Editar">✎</button>
                  <button onClick={() => cambiarEstado(usuario)} className="text-orange-500 hover:text-orange-700 text-lg px-2 py-1" title={usuario.activo ? "Desactivar" : "Activar"}>↻</button>
                  <button onClick={() => eliminarUsuario(usuario.id, usuario.username)} className="text-red-500 hover:text-red-700 text-lg px-2 py-1" title="Eliminar">🗑</button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className={`px-2 py-1 rounded-md text-xs font-semibold ${usuario.rol === "admin" ? "bg-purple-100 text-purple-700" : "bg-slate-100 text-slate-700"}`}>
                  {usuario.rol === "admin" ? "👑 Administrador" : "👤 Usuario"}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${usuario.activo ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                  {usuario.activo ? "🟢 Activo" : "🔴 Inactivo"}
                </span>
              </div>
              {usuario.email && <p className="text-slate-500 text-xs mt-2 break-all">📧 {usuario.email}</p>}
            </div>
          ))}
          {usuarios.length === 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500">
              No hay usuarios registrados
            </div>
          )}
        </div>
      </div>

      {/* Modal para crear/editar usuario - Responsive */}
      {modal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-3 sm:px-4 backdrop-blur-sm overflow-y-auto py-4">
          <div className="bg-white rounded-xl sm:rounded-2xl w-full max-w-[95%] sm:max-w-xl p-4 sm:p-6 shadow-2xl my-auto">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-slate-700 to-slate-800 bg-clip-text text-transparent">
                {editando ? "✎ Editar Usuario" : "➕ Nuevo Usuario"}
              </h2>
              <button onClick={cerrarModal} className="text-2xl text-slate-400 hover:text-slate-600 transition-all w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100">×</button>
            </div>

            <form onSubmit={guardarUsuario} className="space-y-3 sm:space-y-4">
              <div>
                <label className="block font-semibold mb-1.5 sm:mb-2 text-slate-700 text-sm sm:text-base">Usuario *</label>
                <input type="text" name="username" value={formulario.username} onChange={handleChange} required className="w-full border-2 border-slate-200 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200 transition-all" placeholder="ej: jperez" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block font-semibold mb-1.5 sm:mb-2 text-slate-700 text-sm sm:text-base">Nombre</label>
                  <input type="text" name="first_name" value={formulario.first_name} onChange={handleChange} className="w-full border-2 border-slate-200 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200 transition-all" placeholder="Juan" />
                </div>
                <div>
                  <label className="block font-semibold mb-1.5 sm:mb-2 text-slate-700 text-sm sm:text-base">Apellido</label>
                  <input type="text" name="last_name" value={formulario.last_name} onChange={handleChange} className="w-full border-2 border-slate-200 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200 transition-all" placeholder="Pérez" />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1.5 sm:mb-2 text-slate-700 text-sm sm:text-base">Email</label>
                <input type="email" name="email" value={formulario.email} onChange={handleChange} className="w-full border-2 border-slate-200 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200 transition-all" placeholder="juan@ejemplo.com" />
              </div>

              <div>
                <label className="block font-semibold mb-1.5 sm:mb-2 text-slate-700 text-sm sm:text-base">Rol</label>
                <select name="rol" value={formulario.rol} onChange={handleChange} className="w-full border-2 border-slate-200 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200 transition-all">
                  <option value="usuario">👤 Usuario</option>
                  <option value="admin">👑 Administrador</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1.5 sm:mb-2 text-slate-700 text-sm sm:text-base">{editando ? "Nueva Contraseña (opcional)" : "Contraseña *"}</label>
                <input type="password" name="password" value={formulario.password} onChange={handleChange} required={!editando} className="w-full border-2 border-slate-200 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200 transition-all" placeholder={editando ? "Dejar en blanco para no cambiar" : "Mínimo 6 caracteres"} />
              </div>

              <label className="flex items-center gap-2 sm:gap-3 cursor-pointer py-1">
                <input type="checkbox" name="activo" checked={formulario.activo} onChange={handleChange} className="w-4 h-4 sm:w-5 sm:h-5 rounded border-slate-300" />
                <span className="text-sm sm:text-base text-slate-700 font-semibold">✅ Usuario activo</span>
              </label>

              <div className="flex flex-col sm:flex-row sm:justify-end gap-2 sm:gap-3 pt-3 sm:pt-4">
                <button type="button" onClick={cerrarModal} className="px-4 sm:px-5 py-2 sm:py-3 rounded-lg sm:rounded-xl border-2 border-slate-300 font-semibold text-sm hover:bg-slate-50 transition-all">Cancelar</button>
                <button type="submit" disabled={guardando} className="px-4 sm:px-5 py-2 sm:py-3 rounded-lg sm:rounded-xl bg-gradient-to-r from-slate-700 to-slate-800 text-white font-semibold hover:from-slate-800 hover:to-slate-900 disabled:opacity-60 transition-all shadow-md text-sm">
                  {guardando ? "Guardando..." : editando ? "✓ Guardar cambios" : "✓ Crear usuario"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default UsuariosPage;