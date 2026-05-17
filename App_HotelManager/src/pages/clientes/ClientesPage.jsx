import { useEffect, useState } from "react";
import api from "../../api/axios";

const ClientesPage = () => {
  const [clientes, setClientes] = useState([]);
  const [buscar, setBuscar] = useState("");
  const [modal, setModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [guardando, setGuardando] = useState(false);

  const [formulario, setFormulario] = useState({
    nombre: "",
    apellido: "",
    cedula: "",
    telefono: "",
    nacionalidad: "",
  });

  useEffect(() => {
    cargarClientes();
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      cargarClientes();
    }, 400);

    return () => clearTimeout(delay);
  }, [buscar]);

  const cargarClientes = async () => {
    try {
      const url = buscar.trim()
        ? `clientes/?buscar=${buscar}`
        : "clientes/";

      const response = await api.get(url);
      setClientes(response.data);
    } catch (error) {
      console.log("Error cargando clientes:", error);
    }
  };

  const abrirModalCrear = () => {
    setEditando(null);
    setFormulario({
      nombre: "",
      apellido: "",
      cedula: "",
      telefono: "",
      nacionalidad: "",
    });
    setModal(true);
  };

  const abrirModalEditar = (cliente) => {
    setEditando(cliente.id);
    setFormulario({
      nombre: cliente.nombre,
      apellido: cliente.apellido,
      cedula: cliente.cedula,
      telefono: cliente.telefono,
      nacionalidad: cliente.nacionalidad || "",
    });
    setModal(true);
  };

  const cerrarModal = () => {
    setModal(false);
    setEditando(null);
  };

  const handleChange = (e) => {
    setFormulario({
      ...formulario,
      [e.target.name]: e.target.value,
    });
  };

  const guardarCliente = async (e) => {
    e.preventDefault();

    try {
      setGuardando(true);

      if (editando) {
        await api.put(`clientes/${editando}/`, formulario);
      } else {
        await api.post("clientes/", formulario);
      }

      cerrarModal();
      cargarClientes();
    } catch (error) {
      console.log("Error guardando cliente:", error.response?.data || error);
      alert("No se pudo guardar el cliente.");
    } finally {
      setGuardando(false);
    }
  };

  const eliminarCliente = async (id) => {
    const confirmar = window.confirm("¿Desea eliminar este cliente?");
    if (!confirmar) return;

    try {
      await api.delete(`clientes/${id}/`);
      cargarClientes();
    } catch (error) {
      console.log("Error eliminando cliente:", error);
      alert("No se pudo eliminar el cliente.");
    }
  };

  return (
    <section>
      <div className="flex items-start justify-between mb-7">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <span>👤</span>
            Clientes
          </h1>

          <p className="text-slate-500 mt-2">
            {clientes.length} cliente(s) registrado(s)
          </p>
        </div>

        <button
          onClick={abrirModalCrear}
          className="bg-slate-700 hover:bg-slate-800 text-white px-5 py-3 rounded-lg font-semibold flex items-center gap-2"
        >
          <span>＋</span>
          Nuevo Cliente
        </button>
      </div>

      <div className="mb-6">
        <input
          type="text"
          value={buscar}
          onChange={(e) => setBuscar(e.target.value)}
          placeholder="🔍  Buscar por nombre, cédula, teléfono o nacionalidad..."
          className="w-full border border-slate-200 rounded-lg px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-slate-700"
        />
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left px-6 py-4 font-semibold text-slate-600">
                Nombre
              </th>
              <th className="text-left px-6 py-4 font-semibold text-slate-600">
                Cédula / ID
              </th>
              <th className="text-left px-6 py-4 font-semibold text-slate-600">
                Teléfono
              </th>
              <th className="text-left px-6 py-4 font-semibold text-slate-600">
                Nacionalidad
              </th>
              <th className="text-right px-6 py-4 font-semibold text-slate-600">
                Acciones
              </th>
            </tr>
          </thead>

          <tbody>
            {clientes.map((cliente) => (
              <tr key={cliente.id} className="border-b border-slate-100">
                <td className="px-6 py-5 font-medium text-slate-900">
                  {cliente.nombre} {cliente.apellido}
                </td>
                <td className="px-6 py-5 text-slate-600">
                  {cliente.cedula}
                </td>
                <td className="px-6 py-5 text-slate-600">
                  {cliente.telefono}
                </td>
                <td className="px-6 py-5 text-slate-600">
                  {cliente.nacionalidad || "-"}
                </td>
                <td className="px-6 py-5">
                  <div className="flex justify-end gap-5">
                    <button
                      onClick={() => abrirModalEditar(cliente)}
                      className="text-slate-900 hover:text-blue-600"
                    >
                      ✎
                    </button>

                    <button
                      onClick={() => eliminarCliente(cliente.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      🗑
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {clientes.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-10 text-slate-500">
                  No hay clientes registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-7">
              <h2 className="text-2xl font-bold text-slate-900">
                {editando ? "Editar Cliente" : "Nuevo Cliente"}
              </h2>

              <button
                onClick={cerrarModal}
                className="text-2xl text-slate-500 hover:text-slate-700"
              >
                ×
              </button>
            </div>

            <form onSubmit={guardarCliente}>
              <div className="grid grid-cols-2 gap-4 mb-5">
                <div>
                  <label className="block font-semibold mb-2">Nombre *</label>
                  <input
                    type="text"
                    name="nombre"
                    value={formulario.nombre}
                    onChange={handleChange}
                    required
                    className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-slate-700"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-2">Apellido *</label>
                  <input
                    type="text"
                    name="apellido"
                    value={formulario.apellido}
                    onChange={handleChange}
                    required
                    className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-slate-700"
                  />
                </div>
              </div>

              <div className="mb-5">
                <label className="block font-semibold mb-2">
                  Cédula / Documento *
                </label>
                <input
                  type="text"
                  name="cedula"
                  value={formulario.cedula}
                  onChange={handleChange}
                  placeholder="Número de identificación"
                  required
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-slate-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div>
                  <label className="block font-semibold mb-2">Teléfono *</label>
                  <input
                    type="text"
                    name="telefono"
                    value={formulario.telefono}
                    onChange={handleChange}
                    placeholder="+57 300 000 0000"
                    required
                    className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-slate-700"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-2">
                    Nacionalidad
                  </label>
                  <input
                    type="text"
                    name="nacionalidad"
                    value={formulario.nacionalidad}
                    onChange={handleChange}
                    placeholder="Colombiano/a"
                    className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-slate-700"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={cerrarModal}
                  className="px-5 py-3 rounded-lg border border-slate-300 font-semibold"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={guardando}
                  className="px-5 py-3 rounded-lg bg-slate-700 text-white font-semibold hover:bg-slate-800 disabled:opacity-60"
                >
                  {guardando
                    ? "Guardando..."
                    : editando
                    ? "Guardar cambios"
                    : "Registrar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default ClientesPage;