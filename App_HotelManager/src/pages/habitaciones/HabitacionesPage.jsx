import { useEffect, useState } from "react";
import api from "../../api/axios";
import Swal from "sweetalert2";

const HabitacionesPage = () => {
  const [habitaciones, setHabitaciones] = useState([]);
  const [modal, setModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [tasaCambio, setTasaCambio] = useState(36.5);
  const [monedaVisualizacion, setMonedaVisualizacion] = useState(localStorage.getItem("monedaVisualizacion") || "NIO");

  const [formulario, setFormulario] = useState({
    nombre: "",
    piso: 1,
    capacidad: 1,
    precio: "",
    tipo_cobro: "noche",
    aire_acondicionado: false,
    activa: true,
    moneda: "NIO",
  });

  useEffect(() => {
    cargarHabitaciones();
    cargarTasaCambio();
  }, []);

  useEffect(() => {
    localStorage.setItem("monedaVisualizacion", monedaVisualizacion);
  }, [monedaVisualizacion]);

  const cargarHabitaciones = async () => {
    try {
      const response = await api.get("habitaciones/");
      setHabitaciones(response.data);
    } catch (error) {
      console.log("Error cargando habitaciones:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron cargar las habitaciones.",
      });
    }
  };

  const cargarTasaCambio = async () => {
    try {
      const tasaGuardada = localStorage.getItem("tasaCambio");
      if (tasaGuardada) {
        setTasaCambio(parseFloat(tasaGuardada));
      }
    } catch (error) {
      console.log("Error cargando tasa de cambio:", error);
    }
  };

  const actualizarTasaCambio = () => {
    Swal.fire({
      title: "💱 Tasa de Cambio",
      html: `
        <div class="text-left">
          <p class="mb-2 text-sm text-gray-600">1 USD = ? Córdobas</p>
          <input type="number" id="tasa" class="swal2-input" placeholder="36.50" step="0.01" value="${tasaCambio}">
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Guardar",
      cancelButtonText: "Cancelar",
      preConfirm: () => {
        const tasa = document.getElementById("tasa").value;
        if (!tasa || isNaN(tasa) || parseFloat(tasa) <= 0) {
          Swal.showValidationMessage("Ingrese una tasa válida");
          return false;
        }
        return parseFloat(tasa);
      },
    }).then((result) => {
      if (result.isConfirmed) {
        setTasaCambio(result.value);
        localStorage.setItem("tasaCambio", result.value);
        Swal.fire({
          icon: "success",
          title: "Tasa actualizada",
          text: `1 USD = ${result.value} Córdobas`,
          timer: 2000,
          showConfirmButton: false,
        });
      }
    });
  };

  // Función para convertir a número de forma segura
  const toNumber = (value) => {
    if (value === null || value === undefined || value === "") return 0;
    const num = Number(value);
    return isNaN(num) ? 0 : num;
  };

  // Función CORREGIDA para formatear el precio según la moneda de visualización
  const formatearPrecioMostrar = (precioOriginal, monedaOriginal) => {
    const precioNum = toNumber(precioOriginal);
    
    // Si la moneda de visualización es la misma que la moneda original, mostrar sin conversión
    if (monedaVisualizacion === monedaOriginal) {
      const symbol = monedaVisualizacion === "USD" ? "$" : "C$";
      return `${symbol} ${precioNum.toFixed(2)}`;
    }
    
    // Si son diferentes, convertir CORRECTAMENTE
    if (monedaVisualizacion === "USD" && monedaOriginal === "NIO") {
      // CONVERSIÓN CORRECTA: De Córdobas a Dólares (DIVIDIR)
      // Ejemplo: 2880 C$ ÷ 36.5 = 78.90 USD
      const convertido = precioNum / tasaCambio;
      return `$${convertido.toFixed(2)}`;
    } else if (monedaVisualizacion === "NIO" && monedaOriginal === "USD") {
      // CONVERSIÓN CORRECTA: De Dólares a Córdobas (MULTIPLICAR)
      // Ejemplo: 80 USD × 36.5 = 2920 C$
      const convertido = precioNum * tasaCambio;
      return `C$${convertido.toFixed(2)}`;
    }
    
    // Fallback
    return `${precioNum.toFixed(2)}`;
  };

  // Obtener el precio convertido para mostrar la equivalencia
  const obtenerPrecioConvertido = (precioOriginal, monedaOriginal) => {
    const precioNum = toNumber(precioOriginal);
    
    if (monedaVisualizacion === "USD" && monedaOriginal === "NIO") {
      return { moneda: "USD", valor: (precioNum / tasaCambio).toFixed(2), simbolo: "$" };
    } else if (monedaVisualizacion === "NIO" && monedaOriginal === "USD") {
      return { moneda: "NIO", valor: (precioNum * tasaCambio).toFixed(2), simbolo: "C$" };
    }
    return null;
  };

  const abrirModalCrear = () => {
    setEditando(null);
    setFormulario({
      nombre: "",
      piso: 1,
      capacidad: 1,
      precio: "",
      tipo_cobro: "noche",
      aire_acondicionado: false,
      activa: true,
      moneda: monedaVisualizacion,
    });
    setModal(true);
  };

  const abrirModalEditar = (habitacion) => {
    setEditando(habitacion.id);
    setFormulario({
      nombre: habitacion.nombre,
      piso: habitacion.piso,
      capacidad: habitacion.capacidad,
      precio: habitacion.precio,
      tipo_cobro: habitacion.tipo_cobro,
      aire_acondicionado: habitacion.aire_acondicionado,
      activa: habitacion.activa,
      moneda: habitacion.moneda || "NIO",
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

  const guardarHabitacion = async (e) => {
    e.preventDefault();

    if (!formulario.nombre.trim()) {
      Swal.fire({
        icon: "warning",
        text: "El nombre de la habitación es requerido",
        timer: 1800,
        showConfirmButton: false,
      });
      return;
    }

    const precioNum = toNumber(formulario.precio);
    if (precioNum <= 0) {
      Swal.fire({
        icon: "warning",
        text: "El precio debe ser mayor a 0",
        timer: 1800,
        showConfirmButton: false,
      });
      return;
    }

    try {
      setGuardando(true);

      const data = {
        nombre: formulario.nombre,
        piso: Number(formulario.piso),
        capacidad: Number(formulario.capacidad),
        precio: precioNum,
        tipo_cobro: formulario.tipo_cobro,
        moneda: formulario.moneda,
        aire_acondicionado: formulario.aire_acondicionado,
        activa: true,
      };

      if (editando) {
        await api.put(`habitaciones/${editando}/`, data);
        Swal.fire({
          icon: "success",
          title: "Actualizada",
          text: "Habitación actualizada correctamente",
          timer: 1800,
          showConfirmButton: false,
        });
      } else {
        await api.post("habitaciones/", data);
        Swal.fire({
          icon: "success",
          title: "Creada",
          text: "Habitación creada correctamente",
          timer: 1800,
          showConfirmButton: false,
        });
      }

      cerrarModal();
      cargarHabitaciones();
    } catch (error) {
      console.log("Error guardando habitación:", error.response?.data || error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "No se pudo guardar la habitación.",
      });
    } finally {
      setGuardando(false);
    }
  };

  const eliminarHabitacion = async (habitacion) => {
    const result = await Swal.fire({
      title: "¿Eliminar habitación?",
      text: `La habitación ${habitacion.nombre} quedará inactiva.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#dc2626",
    });

    if (!result.isConfirmed) return;

    try {
      await api.patch(`habitaciones/${habitacion.id}/`, {
        activa: false,
      });
      
      Swal.fire({
        icon: "success",
        title: "Eliminada",
        text: "Habitación eliminada correctamente",
        timer: 1800,
        showConfirmButton: false,
      });
      
      cargarHabitaciones();
    } catch (error) {
      console.log("Error desactivando habitación:", error.response?.data || error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo eliminar la habitación.",
      });
    }
  };

  const habitacionesPorPiso = habitaciones.reduce((grupos, habitacion) => {
    const piso = habitacion.piso;
    if (!grupos[piso]) {
      grupos[piso] = [];
    }
    grupos[piso].push(habitacion);
    return grupos;
  }, {});

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <section className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6 sm:mb-8">
          <div className="text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 flex items-center justify-center sm:justify-start gap-3">
              <span className="text-3xl sm:text-4xl">🛏️</span>
              Habitaciones
            </h1>
            <p className="text-slate-500 mt-2 text-sm sm:text-base">
              {habitaciones.length} habitación(es) registrada(s)
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {/* Selector de moneda de visualización */}
            <div className="flex gap-2">
              <button
                onClick={() => setMonedaVisualizacion("NIO")}
                className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                  monedaVisualizacion === "NIO"
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md"
                    : "bg-white text-slate-700 border-2 border-slate-200 hover:border-blue-300"
                }`}
              >
                <span>C$</span>
                <span className="text-sm">Córdobas</span>
              </button>
              <button
                onClick={() => setMonedaVisualizacion("USD")}
                className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                  monedaVisualizacion === "USD"
                    ? "bg-gradient-to-r from-green-600 to-green-700 text-white shadow-md"
                    : "bg-white text-slate-700 border-2 border-slate-200 hover:border-green-300"
                }`}
              >
                <span>$</span>
                <span className="text-sm">Dólares</span>
              </button>
            </div>

            <button
              onClick={actualizarTasaCambio}
              className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 shadow-md text-sm"
              title="Actualizar tasa de cambio USD a NIO"
            >
              <span>💱</span>
              <span className="hidden sm:inline">1 USD = {tasaCambio} NIO</span>
              <span className="sm:hidden">Tasa</span>
            </button>

            <button
              onClick={abrirModalCrear}
              className="bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg text-sm sm:text-base"
            >
              <span className="text-lg sm:text-xl">＋</span>
              Nueva Habitación
            </button>
          </div>
        </div>

        {/* Indicador de moneda actual */}
        <div className="mb-4 p-3 bg-slate-100 rounded-lg text-center">
          <p className="text-sm text-slate-600">
            Mostrando precios en <strong>{monedaVisualizacion === "USD" ? "Dólares ($)" : "Córdobas (C$)"}</strong>
            {monedaVisualizacion === "USD" && (
              <span className="ml-2 text-xs text-amber-600">(Tasa: 1 USD = {tasaCambio} NIO)</span>
            )}
          </p>
        </div>

        {/* Lista de habitaciones por piso */}
        {Object.keys(habitacionesPorPiso).sort((a, b) => a - b).map((piso) => (
          <div key={piso} className="mb-8 sm:mb-10">
            <div className="mb-3 sm:mb-4">
              <h2 className="text-base sm:text-lg font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <span className="w-1 h-6 bg-slate-400 rounded-full"></span>
                Piso {piso}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-5">
              {habitacionesPorPiso[piso].map((habitacion) => {
                const precioMostrado = formatearPrecioMostrar(habitacion.precio, habitacion.moneda);
                const precioConvertido = obtenerPrecioConvertido(habitacion.precio, habitacion.moneda);
                
                return (
                  <div
                    key={habitacion.id}
                    className={`group bg-white rounded-xl sm:rounded-2xl border-2 p-4 sm:p-5 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${
                      habitacion.tipo_cobro === "mensual"
                        ? "border-purple-200 hover:border-purple-400"
                        : "border-green-200 hover:border-green-400"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-base sm:text-lg font-bold text-slate-900">
                          {habitacion.nombre}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                          📍 Piso {habitacion.piso} · 👥 Cap. {habitacion.capacidad}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          💰 Precio original en {habitacion.moneda === "USD" ? "Dólares" : "Córdobas"}
                        </p>
                      </div>

                      <div className="flex gap-2 sm:gap-3">
                        <button
                          onClick={() => abrirModalEditar(habitacion)}
                          className="text-slate-400 hover:text-blue-600 transition-colors text-base sm:text-lg"
                          title="Editar"
                        >
                          ✎
                        </button>
                        <button
                          onClick={() => eliminarHabitacion(habitacion)}
                          className="text-slate-400 hover:text-red-600 transition-colors text-base sm:text-lg"
                          title="Eliminar"
                        >
                          🗑
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 sm:mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-xl sm:text-2xl font-bold text-slate-900">
                            {precioMostrado}
                          </span>
                          <span className="text-slate-400 text-xs sm:text-sm">
                            /{habitacion.tipo_cobro === "mensual" ? "mes" : "noche"}
                          </span>
                        </div>
                        {precioConvertido && (
                          <p className="text-xs text-blue-600 mt-1">
                            ≈ {precioConvertido.simbolo} {precioConvertido.valor} {precioConvertido.moneda}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {habitacion.aire_acondicionado && (
                          <span className="px-2 sm:px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                            ❄ A/C
                          </span>
                        )}
                        <span
                          className={`px-2 sm:px-3 py-1 rounded-full text-xs font-bold ${
                            habitacion.tipo_cobro === "mensual"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {habitacion.tipo_cobro === "mensual"
                            ? "📅 Mensual"
                            : "🌙 Por noche"}
                        </span>
                        <span
                          className={`px-2 sm:px-3 py-1 rounded-full text-xs font-bold ${
                            habitacion.moneda === "USD"
                              ? "bg-green-100 text-green-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {habitacion.moneda === "USD" ? "💵 USD" : "💰 NIO"}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {habitaciones.length === 0 && (
          <div className="bg-white border-2 border-slate-200 rounded-xl sm:rounded-2xl p-8 sm:p-12 text-center text-slate-500">
            <span className="text-5xl sm:text-6xl mb-4 block">🏨</span>
            <p className="text-base sm:text-lg">No hay habitaciones registradas.</p>
            <button
              onClick={abrirModalCrear}
              className="mt-4 bg-slate-700 hover:bg-slate-800 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all"
            >
              + Crear primera habitación
            </button>
          </div>
        )}

        {/* Modal para crear/editar habitación */}
        {modal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-3 sm:px-4 backdrop-blur-sm overflow-y-auto py-4">
            <div className="bg-white rounded-xl sm:rounded-2xl w-full max-w-[95%] sm:max-w-lg p-4 sm:p-6 shadow-2xl my-auto">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-slate-700 to-slate-800 bg-clip-text text-transparent">
                  {editando ? "✎ Editar Habitación" : "➕ Nueva Habitación"}
                </h2>
                <button
                  onClick={cerrarModal}
                  className="text-2xl text-slate-400 hover:text-slate-600 transition-all w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100"
                >
                  ×
                </button>
              </div>

              <form onSubmit={guardarHabitacion}>
                {/* Tipo de cobro */}
                <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4 sm:mb-5">
                  <button
                    type="button"
                    onClick={() =>
                      setFormulario({
                        ...formulario,
                        tipo_cobro: "noche",
                      })
                    }
                    className={`py-3 sm:py-4 rounded-lg sm:rounded-xl border-2 font-bold text-xs sm:text-sm transition-all ${
                      formulario.tipo_cobro === "noche"
                        ? "bg-gradient-to-r from-slate-700 to-slate-800 text-white border-slate-800 shadow-md"
                        : "bg-white text-slate-700 border-slate-200 hover:border-slate-400"
                    }`}
                  >
                    🌙 Por noche
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setFormulario({
                        ...formulario,
                        tipo_cobro: "mensual",
                      })
                    }
                    className={`py-3 sm:py-4 rounded-lg sm:rounded-xl border-2 font-bold text-xs sm:text-sm transition-all ${
                      formulario.tipo_cobro === "mensual"
                        ? "bg-gradient-to-r from-slate-700 to-slate-800 text-white border-slate-800 shadow-md"
                        : "bg-white text-slate-700 border-slate-200 hover:border-slate-400"
                    }`}
                  >
                    📅 Mensual
                  </button>
                </div>

                {/* Moneda del precio - IMPORTANTE */}
                <div className="mb-4 sm:mb-5">
                  <label className="block font-semibold mb-1.5 sm:mb-2 text-slate-700 text-sm sm:text-base">
                    ¿En qué moneda estás ingresando el precio? *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setFormulario({
                          ...formulario,
                          moneda: "NIO",
                        })
                      }
                      className={`py-3 rounded-lg border-2 font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                        formulario.moneda === "NIO"
                          ? "bg-blue-600 text-white border-blue-600 shadow-md"
                          : "bg-white text-slate-700 border-slate-200 hover:border-blue-300"
                      }`}
                    >
                      <span className="text-lg">C$</span>
                      <span>Córdobas (NIO)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setFormulario({
                          ...formulario,
                          moneda: "USD",
                        })
                      }
                      className={`py-3 rounded-lg border-2 font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                        formulario.moneda === "USD"
                          ? "bg-green-600 text-white border-green-600 shadow-md"
                          : "bg-white text-slate-700 border-slate-200 hover:border-green-300"
                      }`}
                    >
                      <span className="text-lg">$</span>
                      <span>Dólares (USD)</span>
                    </button>
                  </div>
                  <p className="text-xs text-amber-600 mt-2">
                    ⚠️ IMPORTANTE: El precio que ingreses abajo será guardado en la moneda que selecciones aquí
                  </p>
                </div>

                {/* Nombre */}
                <div className="mb-4 sm:mb-5">
                  <label className="block font-semibold mb-1.5 sm:mb-2 text-slate-700 text-sm sm:text-base">
                    Nombre de la habitación *
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={formulario.nombre}
                    onChange={handleChange}
                    placeholder="Ej: Habitación 101, Suite Premium, etc."
                    required
                    className="w-full border-2 border-slate-200 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200 transition-all"
                  />
                </div>

                {/* Piso y Precio */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-5">
                  <div>
                    <label className="block font-semibold mb-1.5 sm:mb-2 text-slate-700 text-sm sm:text-base">
                      Piso *
                    </label>
                    <input
                      type="number"
                      name="piso"
                      min="1"
                      value={formulario.piso}
                      onChange={handleChange}
                      required
                      className="w-full border-2 border-slate-200 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1.5 sm:mb-2 text-slate-700 text-sm sm:text-base">
                      Precio ({formulario.moneda === "USD" ? "USD" : "NIO"}) *
                    </label>
                    <input
                      type="number"
                      name="precio"
                      min="0"
                      step="0.01"
                      value={formulario.precio}
                      onChange={handleChange}
                      placeholder={formulario.moneda === "USD" ? "Ej: 80" : "Ej: 2880"}
                      required
                      className="w-full border-2 border-slate-200 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200 transition-all"
                    />
                  </div>
                </div>

                {/* Capacidad y Aire acondicionado */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
                  <div>
                    <label className="block font-semibold mb-1.5 sm:mb-2 text-slate-700 text-sm sm:text-base">
                      Capacidad (personas)
                    </label>
                    <input
                      type="number"
                      name="capacidad"
                      min="1"
                      value={formulario.capacidad}
                      onChange={handleChange}
                      required
                      className="w-full border-2 border-slate-200 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200 transition-all"
                    />
                  </div>
                  <label className="flex items-center gap-2 sm:gap-3 mt-0 sm:mt-8 font-semibold text-slate-700 text-sm sm:text-base cursor-pointer">
                    <input
                      type="checkbox"
                      name="aire_acondicionado"
                      checked={formulario.aire_acondicionado}
                      onChange={handleChange}
                      className="w-4 h-4 sm:w-5 sm:h-5 rounded border-slate-300"
                    />
                    ❄ Aire acondicionado
                  </label>
                </div>

                {/* Botones */}
                <div className="flex flex-col sm:flex-row sm:justify-end gap-2 sm:gap-3">
                  <button
                    type="button"
                    onClick={cerrarModal}
                    className="px-4 sm:px-5 py-2 sm:py-3 rounded-lg sm:rounded-xl border-2 border-slate-300 font-semibold text-sm hover:bg-slate-50 transition-all"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={guardando}
                    className="px-4 sm:px-5 py-2 sm:py-3 rounded-lg sm:rounded-xl bg-gradient-to-r from-slate-700 to-slate-800 text-white font-semibold hover:from-slate-800 hover:to-slate-900 disabled:opacity-60 transition-all shadow-md text-sm"
                  >
                    {guardando
                      ? "Guardando..."
                      : editando
                      ? "✓ Guardar cambios"
                      : "✓ Crear habitación"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default HabitacionesPage;