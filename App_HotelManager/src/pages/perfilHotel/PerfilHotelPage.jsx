import { useEffect, useState } from "react";
import api from "../../api/axios";
import Swal from "sweetalert2";

const PerfilHotelPage = () => {
  const [perfilId, setPerfilId] = useState(null);
  const [nombre, setNombre] = useState("");
  const [logoActual, setLogoActual] = useState(null);
  const [logoNuevo, setLogoNuevo] = useState(null);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    cargarPerfil();
  }, []);

  const cargarPerfil = async () => {
    try {
      const response = await api.get("perfil-hotel/");
      const perfiles = response.data;

      if (perfiles.length > 0) {
        const perfil = perfiles[0];

        setPerfilId(perfil.id);
        setNombre(perfil.nombre || "");
        setLogoActual(perfil.logo || null);
      }
    } catch (error) {
      console.log("Error cargando perfil:", error);

      Swal.fire({
        icon: "error",
        title: "Error al cargar",
        text: "No se pudo cargar el perfil del hotel.",
        confirmButtonColor: "#334155",
      });
    }
  };

  const guardarPerfil = async (e) => {
    e.preventDefault();

    if (!nombre.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Campo requerido",
        text: "Debe ingresar el nombre del hotel.",
        timer: 1800,
        showConfirmButton: false,
        confirmButtonColor: "#334155",
      });
      return;
    }

    try {
      setGuardando(true);

      const formData = new FormData();
      formData.append("nombre", nombre);

      if (logoNuevo) {
        formData.append("logo", logoNuevo);
      }

      if (perfilId) {
        await api.patch(`perfil-hotel/${perfilId}/`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        await api.post("perfil-hotel/", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      await cargarPerfil();
      setLogoNuevo(null);

      Swal.fire({
        icon: "success",
        title: "Perfil guardado",
        text: "El perfil del hotel se guardó correctamente.",
        timer: 1800,
        showConfirmButton: false,
        confirmButtonColor: "#334155",
      });
    } catch (error) {
      console.log("Error guardando perfil:", error.response?.data || error);

      Swal.fire({
        icon: "error",
        title: "Error al guardar",
        text: "No se pudo guardar el perfil del hotel. Verifique los datos e intente nuevamente.",
        confirmButtonColor: "#334155",
      });
    } finally {
      setGuardando(false);
    }
  };

  return (
    <section>
      <div className="mb-7">
        <h1 className="text-4xl font-bold text-slate-900">
          Perfil del Hotel
        </h1>

        <p className="text-slate-500 mt-2">
          Configura el nombre y logo de tu hotel
        </p>
      </div>

      <form
        onSubmit={guardarPerfil}
        className="bg-white border border-slate-200 rounded-2xl p-7 max-w-2xl"
      >
        <div className="mb-6">
          <label className="block font-semibold text-slate-900 mb-2">
            Nombre del Hotel
          </label>

          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej: Hotel Flores"
            required
            className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-slate-700"
          />
        </div>

        <div className="mb-7">
          <label className="block font-semibold text-slate-900 mb-3">
            Logo del Hotel
          </label>

          <div className="flex items-center gap-4">
            <div className="w-28 h-28 rounded-xl border border-dashed border-slate-300 flex items-center justify-center overflow-hidden bg-slate-50">
              {logoActual || logoNuevo ? (
                <img
                  src={logoNuevo ? URL.createObjectURL(logoNuevo) : logoActual}
                  alt="Logo del hotel"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-slate-400 text-sm text-center">
                  Sin logo
                </span>
              )}
            </div>

            <div>
              <label className="inline-flex items-center justify-center px-5 py-3 rounded-lg border border-slate-300 font-semibold cursor-pointer hover:bg-slate-50">
                Cambiar logo
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/gif"
                  onChange={(e) => setLogoNuevo(e.target.files[0])}
                  className="hidden"
                />
              </label>

              <p className="text-sm text-slate-400 mt-2">
                PNG, JPG o GIF
              </p>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={guardando}
          className="bg-slate-700 hover:bg-slate-800 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-60"
        >
          {guardando ? "Guardando..." : "Guardar cambios"}
        </button>
      </form>
    </section>
  );
};

export default PerfilHotelPage;