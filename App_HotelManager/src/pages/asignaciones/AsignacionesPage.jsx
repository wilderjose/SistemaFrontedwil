import { useEffect, useState } from "react";
import api from "../../api/axios";
import Swal from "sweetalert2";
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, PDFViewer , Image} from '@react-pdf/renderer';

// ============================================
// ESTILOS DEL PDF
// ============================================
const pdfStyles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    borderBottom: 2,
    borderBottomColor: '#f59e0b',
    paddingBottom: 20,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logo: {
    fontSize: 40,
  },
  hotelName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  hotelSubtitle: {
    fontSize: 10,
    color: '#64748b',
    marginTop: 4,
  },
  facturaNumber: {
    textAlign: 'right',
  },
  facturaLabel: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#f59e0b',
  },
  facturaId: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 5,
  },
  hotelInfo: {
    fontSize: 9,
    color: '#64748b',
    marginTop: 10,
  },
  clientSection: {
    marginBottom: 30,
    padding: 15,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#f59e0b',
    paddingLeft: 8,
  },
  clientInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  clientData: {
    flex: 1,
  },
  clientRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  clientLabel: {
    fontSize: 10,
    color: '#64748b',
    width: 80,
  },
  clientValue: {
    fontSize: 10,
    color: '#1e293b',
    fontWeight: 'bold',
  },
  table: {
    marginBottom: 30,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f59e0b',
    padding: 10,
    borderRadius: 5,
  },
  tableHeaderCell: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#ffffff',
    flex: 1,
  },
  tableRow: {
    flexDirection: 'row',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  tableCell: {
    fontSize: 9,
    color: '#1e293b',
    flex: 1,
  },
  totalsSection: {
    marginTop: 20,
    alignItems: 'flex-end',
  },
  totalRow: {
    flexDirection: 'row',
    marginBottom: 5,
    width: 250,
  },
  totalLabel: {
    fontSize: 11,
    color: '#64748b',
    flex: 1,
  },
  totalValue: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1e293b',
    flex: 1,
    textAlign: 'right',
  },
  grandTotal: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 2,
    borderTopColor: '#f59e0b',
  },
  grandTotalLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#f59e0b',
  },
  grandTotalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f59e0b',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 15,
  },
  footerText: {
    fontSize: 8,
    color: '#94a3b8',
    marginBottom: 4,
  },
  thankYou: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#f59e0b',
    marginTop: 5,
  },
});

// ============================================
// COMPONENTE PDF DE FACTURA
// ============================================
// ============================================
// COMPONENTE PDF DE FACTURA CON LOGO
// ============================================
const FacturaPDF = ({ data, hotelPerfil }) => {
  const {
    numeroFactura = `FAC-${Date.now()}`,
    fecha = new Date().toLocaleDateString("es-ES"),
    cliente = "Cliente sin especificar",
    habitacion = "N/A",
    piso = "1",
    capacidad = "1",
    fechaIngreso = new Date().toLocaleDateString(),
    fechaSalida = new Date().toLocaleDateString(),
    total = 0,
    metodoPago = "Efectivo",
    habitacionTipo = "Estándar",
    noches = 1,
    monedaOriginal = "NIO",
  } = data;

  const symbol = monedaOriginal === "USD" ? "$" : "C$";
  const hotelNombre = hotelPerfil?.nombre || "HotelManager";

  const formatear = (valor) => `${symbol} ${Number(valor || 0).toFixed(2)}`;

  return (
    <Document>
      <Page size="A4" style={pdfStyles.page}>
        <View style={pdfStyles.header}>
          <View>
            <Text style={pdfStyles.hotelName}>{hotelNombre}</Text>
            <Text style={pdfStyles.hotelSubtitle}>Factura de alojamiento</Text>
          </View>

          <View style={pdfStyles.facturaNumber}>
            <Text style={pdfStyles.facturaLabel}>FACTURA</Text>
            <Text style={pdfStyles.facturaId}>{numeroFactura}</Text>
            <Text style={{ fontSize: 9, color: "#64748b", marginTop: 5 }}>
              Fecha: {fecha}
            </Text>
          </View>
        </View>

        <View style={pdfStyles.hotelInfo}>
          <Text>Dirección: {hotelPerfil?.direccion || "No registrada"}</Text>
          <Text>Teléfono: {hotelPerfil?.telefono || "No registrado"}</Text>
          <Text>Email: {hotelPerfil?.email || "No registrado"}</Text>
          <Text>RFC: {hotelPerfil?.rfc || "No registrado"}</Text>
        </View>

        <View style={pdfStyles.clientSection}>
          <Text style={pdfStyles.sectionTitle}>Datos del cliente</Text>

          <View style={pdfStyles.clientRow}>
            <Text style={pdfStyles.clientLabel}>Cliente:</Text>
            <Text style={pdfStyles.clientValue}>{cliente}</Text>
          </View>

          <View style={pdfStyles.clientRow}>
            <Text style={pdfStyles.clientLabel}>Habitación:</Text>
            <Text style={pdfStyles.clientValue}>{habitacion}</Text>
          </View>

          <View style={pdfStyles.clientRow}>
            <Text style={pdfStyles.clientLabel}>Tipo:</Text>
            <Text style={pdfStyles.clientValue}>{habitacionTipo}</Text>
          </View>

          <View style={pdfStyles.clientRow}>
            <Text style={pdfStyles.clientLabel}>Piso:</Text>
            <Text style={pdfStyles.clientValue}>{piso}</Text>
          </View>

          <View style={pdfStyles.clientRow}>
            <Text style={pdfStyles.clientLabel}>Capacidad:</Text>
            <Text style={pdfStyles.clientValue}>{capacidad}</Text>
          </View>
        </View>

        <View style={pdfStyles.table}>
          <View style={pdfStyles.tableHeader}>
            <Text style={pdfStyles.tableHeaderCell}>Check-in</Text>
            <Text style={pdfStyles.tableHeaderCell}>Check-out</Text>
            <Text style={pdfStyles.tableHeaderCell}>Noches</Text>
            <Text style={pdfStyles.tableHeaderCell}>Método</Text>
          </View>

          <View style={pdfStyles.tableRow}>
            <Text style={pdfStyles.tableCell}>{fechaIngreso}</Text>
            <Text style={pdfStyles.tableCell}>{fechaSalida}</Text>
            <Text style={pdfStyles.tableCell}>{noches}</Text>
            <Text style={pdfStyles.tableCell}>{metodoPago}</Text>
          </View>
        </View>

        <View style={pdfStyles.totalsSection}>
          <View style={[pdfStyles.totalRow, pdfStyles.grandTotal]}>
            <Text style={pdfStyles.grandTotalLabel}>TOTAL</Text>
            <Text style={pdfStyles.grandTotalValue}>{formatear(total)}</Text>
          </View>
        </View>

        <View style={pdfStyles.footer}>
          <Text style={pdfStyles.footerText}>
            Gracias por su preferencia.
          </Text>
          <Text style={pdfStyles.thankYou}>
            {hotelNombre} - Su mejor elección
          </Text>
        </View>
      </Page>
    </Document>
  );
};

// ============================================
// MODAL DE FACTURA
// ============================================
// ============================================
// MODAL DE FACTURA CON PERFIL DEL HOTEL
// ============================================
const FacturaModal = ({ facturaData, onClose }) => {
  const [showPreview, setShowPreview] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [hotelPerfil, setHotelPerfil] = useState(null);
  const symbol = facturaData.monedaOriginal === "USD" ? "$" : "C$";

  useEffect(() => {
    cargarPerfilHotel();
  }, []);

  const cargarPerfilHotel = async () => {
    try {
      const response = await api.get("perfil-hotel/");
      if (response.data && response.data.length > 0) {
        setHotelPerfil(response.data[0]);
      }
    } catch (error) {
      console.log("Error cargando perfil del hotel:", error);
    }
  };

  const enviarPorWhatsApp = () => {
    setEnviando(true);
    
    const hotelNombre = hotelPerfil?.nombre || "HotelManager";
    
    const mensaje = `🏨 *${hotelNombre.toUpperCase()} - FACTURA* 🏨
━━━━━━━━━━━━━━━━━━━━━━
 *Factura #:* ${facturaData.numeroFactura}
 *Fecha:* ${facturaData.fecha}
━━━━━━━━━━━━━━━━━━━━━━

  *Cliente:* ${facturaData.cliente}
  *Habitación:* ${facturaData.habitacion} (${facturaData.habitacionTipo})
  *Check-in:* ${facturaData.fechaIngreso}
  *Check-out:* ${facturaData.fechaSalida}
  *Noches:* ${facturaData.noches}

━━━━━━━━━━━━━━━━━━━━━━
💰 *DETALLE DE PAGO*
━━━━━━━━━━━━━━━━━━━━━━
 
 *TOTAL:* ${symbol}${facturaData.total.toFixed(2)}
 *Método de pago:* ${facturaData.metodoPago}

━━━━━━━━━━━━━━━━━━━━━━
 *¡Gracias por su preferencia!*
 *${hotelNombre} - Su mejor elección*`;
    
    const mensajeCodificado = encodeURIComponent(mensaje);
    window.open(`https://wa.me/?text=${mensajeCodificado}`, '_blank');
    setTimeout(() => setEnviando(false), 1000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" style={{ backdropFilter: 'blur(4px)' }}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-auto">
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-t-2xl p-6 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                {hotelPerfil?.logo ? (
                  <img src={hotelPerfil.logo} alt="Logo" className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <span className="text-3xl">🏨</span>
                )}
                <h2 className="text-2xl font-bold text-white">Factura Digital - {hotelPerfil?.nombre || "HotelManager"}</h2>
              </div>
              <p className="text-yellow-100">Descarga o comparte la factura en PDF</p>
            </div>
            <button onClick={onClose} className="text-white hover:bg-yellow-700 rounded-lg p-2 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <button onClick={() => setShowPreview(!showPreview)} className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 shadow-md">
              <span>👁️</span>{showPreview ? 'Ocultar vista previa' : 'Ver vista previa'}
            </button>

            <PDFDownloadLink
              document={<FacturaPDF data={facturaData} hotelPerfil={hotelPerfil} />}
              fileName={`factura_${facturaData.numeroFactura}.pdf`}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 shadow-md text-center"
            >
              {({ loading }) => (<><span>📥</span>{loading ? 'Generando PDF...' : 'Descargar PDF'}</>)}
            </PDFDownloadLink>

            <button onClick={enviarPorWhatsApp} disabled={enviando} className={`px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 shadow-md ${enviando ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white'}`}>
              <span>📲</span>{enviando ? 'Enviando...' : 'Enviar por WhatsApp'}
            </button>
          </div>

          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><span>📊</span>Resumen de Factura</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg p-3 shadow-sm"><p className="text-xs text-gray-500">N° Factura</p><p className="font-bold text-gray-800 text-sm">{facturaData.numeroFactura}</p></div>
              <div className="bg-white rounded-lg p-3 shadow-sm"><p className="text-xs text-gray-500">Cliente</p><p className="font-bold text-gray-800 text-sm">{facturaData.cliente}</p></div>
              <div className="bg-white rounded-lg p-3 shadow-sm"><p className="text-xs text-gray-500">Habitación</p><p className="font-bold text-gray-800 text-sm">{facturaData.habitacion}</p></div>
              <div className="bg-yellow-50 rounded-lg p-3 border-2 border-yellow-200"><p className="text-xs text-yellow-600">Total a pagar</p><p className="font-bold text-yellow-600 text-xl">{symbol}{facturaData.total.toFixed(2)}</p></div>
            </div>
          </div>

          {showPreview && (
            <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
              <div className="bg-gray-800 text-white px-4 py-2 flex justify-between items-center">
                <span className="font-semibold flex items-center gap-2"><span>📄</span>Vista previa de factura</span>
                <button onClick={() => setShowPreview(false)} className="text-gray-400 hover:text-white">✕</button>
              </div>
              <div className="h-[600px] bg-gray-100">
                <PDFViewer width="100%" height="100%" className="border-0">
                  <FacturaPDF data={facturaData} hotelPerfil={hotelPerfil} />
                </PDFViewer>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
// ============================================
// COMPONENTE PRINCIPAL - ASIGNACIONES PAGE
// ============================================
const AsignacionesPage = () => {
  const [habitaciones, setHabitaciones] = useState([]);
  const [asignacionesActivas, setAsignacionesActivas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [busquedaCliente, setBusquedaCliente] = useState("");
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [habitacionesLimpieza, setHabitacionesLimpieza] = useState([]);

  const [modalIngreso, setModalIngreso] = useState(false);
  const [habitacionSeleccionada, setHabitacionSeleccionada] = useState(null);
  const [asignacionReanudar, setAsignacionReanudar] = useState(null);

  const [meses, setMeses] = useState(1);
  const [noches, setNoches] = useState(1);
  const [personaAdicional, setPersonaAdicional] = useState(false);
  const [cantidadPersonasAdicionales, setCantidadPersonasAdicionales] = useState(0);
  const [cargoAdicional, setCargoAdicional] = useState(0);
  const [guardando, setGuardando] = useState(false);

  const [showFacturaModal, setShowFacturaModal] = useState(false);
  const [facturaDataActual, setFacturaDataActual] = useState(null);

  const [resumen, setResumen] = useState({ total: 0, disponibles: 0, limpiando: 0, ocupadas: 0 });

  useEffect(() => { cargarDatos(); }, []);

  useEffect(() => {
    const delay = setTimeout(() => { buscarClientes(); }, 350);
    return () => clearTimeout(delay);
  }, [busquedaCliente]);

  const cargarDatos = async () => {
    try {
      const [habitacionesRes, resumenRes, asignacionesRes, limpiezaRes] = await Promise.all([
        api.get("habitaciones/?disponibles=true"),
        api.get("habitaciones/resumen/"),
        api.get("asignaciones/activas/"),
        api.get("habitaciones/?estado=limpieza")
      ]);
      setHabitaciones(habitacionesRes.data);
      setResumen(resumenRes.data);
      setAsignacionesActivas(asignacionesRes.data);
      setHabitacionesLimpieza(limpiezaRes.data);
    } catch (error) {
      console.log("Error cargando asignaciones:", error);
      Swal.fire({ icon: "error", title: "Error", text: "No se pudieron cargar las asignaciones." });
    }
  };

  const buscarClientes = async () => {
    if (busquedaCliente.trim().length < 2) { setClientes([]); return; }
    try {
      const response = await api.get(`clientes/?buscar=${busquedaCliente}`);
      setClientes(response.data);
    } catch (error) { console.log("Error buscando clientes:", error); }
  };

  const formatearPrecio = (precio, moneda) => {
    const precioNum = Number(precio) || 0;
    const symbol = moneda === "USD" ? "$" : "C$";
    return `${symbol} ${precioNum.toFixed(2)}`;
  };

  const abrirModalIngreso = (habitacion, asignacion = null) => {
    if (habitacion.estado !== 'disponible') {
      Swal.fire({ icon: "warning", title: "No disponible", text: `La habitación ${habitacion.nombre} no está disponible actualmente.`, timer: 2000, showConfirmButton: false });
      return;
    }
    
    setHabitacionSeleccionada(habitacion);
    setAsignacionReanudar(asignacion);
    setModalIngreso(true);
    setMeses(1);
    setNoches(1);
    setBusquedaCliente("");
    
    if (asignacion) {
      setClienteSeleccionado({
        id: parseInt(asignacion.cliente_id),
        nombre: asignacion.cliente_nombre?.split(' ')[0] || '',
        apellido: asignacion.cliente_nombre?.split(' ').slice(1).join(' ') || '',
        asignacionOriginalId: asignacion.id
      });
      setBusquedaCliente(asignacion.cliente_nombre || "");
    } else {
      setClienteSeleccionado(null);
    }
    
    setClientes([]);
    setPersonaAdicional(false);
    setCantidadPersonasAdicionales(0);
    setCargoAdicional(0);
  };

  const cerrarModalIngreso = () => { setModalIngreso(false); setHabitacionSeleccionada(null); setAsignacionReanudar(null); };

  const seleccionarCliente = (cliente) => {
    setClienteSeleccionado({ id: parseInt(cliente.id), nombre: cliente.nombre, apellido: cliente.apellido });
    setBusquedaCliente(`${cliente.nombre} ${cliente.apellido}`);
    setClientes([]);
  };

  const generarFacturaProfesional = (data) => {
    const habitacion = data.habitacion_data || data;
    const cliente = data.cliente_data || (data.cliente_nombre ? { nombre: data.cliente_nombre, apellido: '' } : null);
    let nochesCount = 1;
    if (data.fecha_inicio && data.fecha_fin && data.fecha_inicio !== "No registrada" && data.fecha_fin !== "No registrada") {
      const inicio = new Date(data.fecha_inicio), fin = new Date(data.fecha_fin);
      nochesCount = Math.ceil(Math.abs(fin - inicio) / (1000 * 60 * 60 * 24)) || 1;
    } else if (data.noches) nochesCount = data.noches;
    const total = parseFloat(data.total || habitacion?.precio || 0);
    const subtotal = total; // Ignorar subtotal original y recalcular
    const impuesto =0;
    setFacturaDataActual({
      numeroFactura: `FAC-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      fecha: new Date().toLocaleDateString('es-ES'),
      cliente: cliente ? `${cliente.nombre} ${cliente.apellido}`.trim() : (data.cliente_nombre || "Cliente"),
      habitacion: habitacion?.nombre || data.habitacion_nombre || "N/A",
      piso: habitacion?.piso || data.piso || "1",
      capacidad: habitacion?.capacidad || data.capacidad || "2",
      fechaIngreso: data.fecha_inicio && data.fecha_inicio !== "No registrada" ? data.fecha_inicio : new Date().toLocaleDateString(),
      fechaSalida: data.fecha_fin && data.fecha_fin !== "No registrada" ? data.fecha_fin : new Date().toLocaleDateString(),
      servicios: data.servicios_extra || [],
      subtotal, impuesto, total,
      metodoPago: data.metodo_pago || "Efectivo",
      habitacionTipo: habitacion?.tipo_cobro === "mensual" ? "Mensual" : (habitacion?.tipo_cobro === "noche" ? "Por noche" : "Estándar"),
      noches: nochesCount,
      monedaOriginal: habitacion?.moneda || "NIO"
    });
    setShowFacturaModal(true);
  };

  const enviarFacturaWhatsappSimple = (data) => generarFacturaProfesional(data);

  // ... (todo el código anterior hasta la función reanudarContrato)

const reanudarContrato = async (asignacion) => {
  if (!asignacion.habitacion_data) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "No se pudo encontrar la información de la habitación.",
    });
    return;
  }

  // Obtener el ID del cliente correctamente
  const clienteId = asignacion.cliente; // En tu serializer es 'cliente', no 'cliente_id'
  if (!clienteId) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "No se pudo identificar al cliente para reanudar el contrato.",
    });
    return;
  }

  const result = await Swal.fire({
    title: "¿Reanudar contrato?",
    text: `¿Reanudar contrato de ${asignacion.cliente_nombre} en ${asignacion.habitacion_nombre}?`,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Sí, reanudar",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#8b5cf6",
  });

  if (!result.isConfirmed) return;

  try {
    setGuardando(true);
    
    // PASO 1: Finalizar la asignación actual
    // Esto cambia la asignación a 'finalizada' y la habitación a 'limpieza'
    await api.post(`asignaciones/${asignacion.id}/finalizar/`);
    
    // PASO 2: Marcar la habitación como disponible
    await api.post(`habitaciones/${asignacion.habitacion_data.id}/marcar_lista/`);
    
    // PASO 3: Crear nueva asignación
    // Ahora el cliente NO tiene asignación activa y la habitación está disponible
    const nuevaAsignacion = {
      habitacion: parseInt(asignacion.habitacion_data.id),
      cliente: parseInt(clienteId),
      meses: asignacion.habitacion_data.tipo_cobro === "mensual" ? 1 : 0,
      noches: asignacion.habitacion_data.tipo_cobro === "noche" ? 1 : 0,
      persona_adicional: false,
      cantidad_personas_adicionales: 0,
      cargo_adicional: 0,
    };
    
    console.log("Datos para reanudar:", nuevaAsignacion);
    
    const response = await api.post("asignaciones/", nuevaAsignacion);
    console.log("Respuesta:", response.data);
    
    Swal.fire({
      icon: "success",
      title: "Contrato reanudado",
      text: "El contrato se ha reanudado correctamente.",
      timer: 1800,
      showConfirmButton: false,
    });
    
    cargarDatos();
  } catch (error) {
    console.error("Error detallado al reanudar:", error.response?.data);
    
    let mensaje = "No se pudo reanudar el contrato.";
    if (error.response?.data?.non_field_errors) {
      mensaje = error.response.data.non_field_errors[0];
    } else if (error.response?.data) {
      const errorData = error.response.data;
      if (typeof errorData === "object") {
        const errores = Object.entries(errorData)
          .map(([campo, err]) => `${campo}: ${err}`)
          .join("\n");
        mensaje = errores;
      } else {
        mensaje = String(errorData);
      }
    }
    
    Swal.fire({
      icon: "error",
      title: "Error al reanudar",
      text: mensaje,
    });
  } finally {
    setGuardando(false);
  }
};
// ... (resto del código)
  const finalizarAsignacion = async (asignacion) => {
    const result = await Swal.fire({ title: "¿Finalizar asignación?", text: `La habitación ${asignacion.habitacion_nombre} pasará a limpieza.`, icon: "warning", showCancelButton: true, confirmButtonText: "Sí, finalizar", cancelButtonText: "Cancelar", confirmButtonColor: "#334155", cancelButtonColor: "#64748b" });
    if (!result.isConfirmed) return;
    try {
      await api.post(`asignaciones/${asignacion.id}/finalizar/`);
      Swal.fire({ icon: "success", title: "Finalizada", text: "La habitación pasó a limpieza.", timer: 1800, showConfirmButton: false });
      cargarDatos();
    } catch (error) { console.log("Error finalizando asignación:", error); Swal.fire({ icon: "error", title: "Error", text: "No se pudo finalizar la asignación." }); }
  };

  const precio = Number(habitacionSeleccionada?.precio || 0);
  const cantidad = habitacionSeleccionada?.tipo_cobro === "mensual" ? meses : noches;
  const subtotal = precio * cantidad;
  const total = subtotal + Number(cargoAdicional || 0);

  const confirmarIngreso = async () => {
    if (!habitacionSeleccionada) { Swal.fire({ icon: "warning", text: "Seleccione una habitación", timer: 1800, showConfirmButton: false }); return; }
    
    // Verificar que la habitación siga disponible antes de asignar
    try {
      const habitacionActual = await api.get(`habitaciones/${habitacionSeleccionada.id}/`);
      if (habitacionActual.data.estado !== 'disponible') {
        Swal.fire({ icon: "error", title: "No disponible", text: `La habitación ${habitacionSeleccionada.nombre} ya no está disponible.`, timer: 2000, showConfirmButton: false });
        cerrarModalIngreso();
        cargarDatos();
        return;
      }
    } catch (error) { console.log("Error verificando habitación:", error); }

    if (!clienteSeleccionado || !clienteSeleccionado.id) { Swal.fire({ icon: "warning", text: "Seleccione un cliente válido", timer: 1800, showConfirmButton: false }); return; }

    try {
      setGuardando(true);
      if (asignacionReanudar && clienteSeleccionado.asignacionOriginalId) {
        try { await api.post(`asignaciones/${clienteSeleccionado.asignacionOriginalId}/finalizar/`); } catch (error) { console.error("Error al finalizar asignación anterior:", error); }
      }
      await api.post("asignaciones/", {
        habitacion: parseInt(habitacionSeleccionada.id),
        cliente: parseInt(clienteSeleccionado.id),
        meses: habitacionSeleccionada.tipo_cobro === "mensual" ? parseInt(meses) : 0,
        noches: habitacionSeleccionada.tipo_cobro === "noche" ? parseInt(noches) : 0,
        persona_adicional: Boolean(personaAdicional),
        cantidad_personas_adicionales: personaAdicional ? parseInt(cantidadPersonasAdicionales) : 0,
        cargo_adicional: parseFloat(cargoAdicional) || 0,
      });
      Swal.fire({ icon: "success", title: asignacionReanudar ? "Contrato reanudado" : "Ingreso confirmado", text: "La habitación ahora aparece como ocupada.", timer: 1800, showConfirmButton: false });
      cerrarModalIngreso();
      cargarDatos();
    } catch (error) {
      console.error("Error:", error.response?.data);
      let mensaje = "No se pudo confirmar el ingreso.";
      if (error.response?.data?.non_field_errors) mensaje = error.response.data.non_field_errors[0];
      else if (error.response?.data) {
        const errorData = error.response.data;
        if (typeof errorData === "object") mensaje = Object.entries(errorData).map(([campo, err]) => `${campo}: ${err}`).join("\n");
        else mensaje = String(errorData);
      }
      Swal.fire({ icon: "error", title: "Error", text: mensaje });
    } finally { setGuardando(false); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <section className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between mb-6 sm:mb-8">
          <div className="text-center lg:text-left">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 flex items-center justify-center lg:justify-start gap-3"><span className="text-3xl sm:text-4xl">🛏️</span>Asignación de Habitaciones</h1>
            <p className="text-slate-500 mt-2 text-sm sm:text-base">{resumen.total} habitación(es) — {resumen.disponibles} disponible(s), {resumen.limpiando} limpiando, {resumen.ocupadas} ocupada(s)</p>
          </div>
          <button onClick={() => { if (habitaciones.length === 0) { Swal.fire({ text: "No hay habitaciones disponibles", timer: 1800, showConfirmButton: false }); return; } abrirModalIngreso(habitaciones[0]); }} className="w-full sm:w-auto bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg text-sm sm:text-base"><span className="text-lg sm:text-xl">＋</span>Nuevo Ingreso</button>
        </div>

        {/* Tarjetas de resumen */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl sm:rounded-2xl px-4 sm:px-6 py-4 sm:py-5 flex items-center gap-4 sm:gap-5 shadow-sm"><div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-green-500 text-white flex items-center justify-center text-xl sm:text-2xl shadow-md">✓</div><div><h2 className="text-2xl sm:text-3xl font-bold text-green-700">{resumen.disponibles}</h2><p className="text-green-600 font-medium text-sm sm:text-base">Disponibles</p></div></div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl sm:rounded-2xl px-4 sm:px-6 py-4 sm:py-5 flex items-center gap-4 sm:gap-5 shadow-sm"><div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-500 text-white flex items-center justify-center text-xl sm:text-2xl shadow-md">✨</div><div><h2 className="text-2xl sm:text-3xl font-bold text-blue-700">{resumen.limpiando}</h2><p className="text-blue-600 font-medium text-sm sm:text-base">Limpiando</p></div></div>
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded-xl sm:rounded-2xl px-4 sm:px-6 py-4 sm:py-5 flex items-center gap-4 sm:gap-5 shadow-sm sm:col-span-2 lg:col-span-1"><div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-yellow-500 text-white flex items-center justify-center text-xl sm:text-2xl shadow-md">◷</div><div><h2 className="text-2xl sm:text-3xl font-bold text-yellow-700">{resumen.ocupadas}</h2><p className="text-yellow-600 font-medium text-sm sm:text-base">Ocupadas</p></div></div>
        </div>

        {/* Habitaciones Disponibles */}
        <div className="mb-3 sm:mb-4"><h2 className="text-lg sm:text-xl font-bold text-slate-800 flex items-center gap-2"><span className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full animate-pulse"></span>Habitaciones Disponibles</h2></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-5 mb-8 sm:mb-12">
          {habitaciones.map((habitacion) => (
            <div key={habitacion.id} className={`group bg-white rounded-xl sm:rounded-2xl border-2 p-4 sm:p-5 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${habitacion.tipo_cobro === "mensual" ? "border-purple-200 hover:border-purple-400" : "border-green-200 hover:border-green-400"}`}>
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-3">
                <div><h3 className="text-lg sm:text-xl font-bold text-slate-900">{habitacion.nombre}</h3><p className="text-xs sm:text-sm text-slate-500 mt-1">📍 Piso {habitacion.piso} · 👥 Cap. {habitacion.capacidad}</p></div>
                <div className="flex flex-wrap items-center gap-2">
                  {habitacion.aire_acondicionado && <span className="px-2 sm:px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">❄ A/C</span>}
                  <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-bold ${habitacion.tipo_cobro === "mensual" ? "bg-purple-100 text-purple-700" : "bg-green-100 text-green-700"}`}>{habitacion.tipo_cobro === "mensual" ? "📅 Mensual" : "🌙 Por noche"}</span>
                  <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-bold ${habitacion.moneda === "USD" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>{habitacion.moneda === "USD" ? "💵 USD" : "💰 NIO"}</span>
                </div>
              </div>
              <div className="mt-3 sm:mt-4"><div className="flex items-baseline gap-1"><span className="text-2xl sm:text-3xl font-bold text-slate-900">{formatearPrecio(habitacion.precio, habitacion.moneda)}</span><span className="text-slate-400 text-sm">/{habitacion.tipo_cobro === "mensual" ? "mes" : "noche"}</span></div></div>
              <div className="mt-4 sm:mt-5 flex gap-2">
                <button onClick={() => abrirModalIngreso(habitacion)} className="flex-1 bg-slate-700 hover:bg-slate-800 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm transition-all">Asignar</button>
                <button onClick={() => enviarFacturaWhatsappSimple(habitacion)} className="bg-green-500 hover:bg-green-600 text-white w-10 h-10 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl font-bold transition-all text-lg" title="Generar Factura">📄</button>
              </div>
            </div>
          ))}
          {habitaciones.length === 0 && <div className="col-span-full bg-white border-2 border-slate-200 rounded-xl sm:rounded-2xl p-6 sm:p-8 text-center text-slate-500">No hay habitaciones disponibles.</div>}
        </div>

        {/* Habitaciones en Limpieza */}
        <div className="mb-3 sm:mb-4 mt-6 sm:mt-8"><h2 className="text-lg sm:text-xl font-bold text-slate-800 flex items-center gap-2"><span className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-500 rounded-full animate-pulse"></span>Habitaciones en Limpieza</h2></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-5 mb-8 sm:mb-12">
          {habitacionesLimpieza.map((habitacion) => (
            <div key={habitacion.id} className="bg-white rounded-xl sm:rounded-2xl border-2 border-blue-200 p-4 sm:p-5 shadow-md hover:shadow-lg transition-all">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-3"><div><h3 className="text-lg sm:text-xl font-bold text-slate-900">{habitacion.nombre}</h3><p className="text-xs sm:text-sm text-slate-500 mt-1">📍 Piso {habitacion.piso} · 👥 Cap. {habitacion.capacidad}</p></div><span className="w-fit px-2 sm:px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">🧹 En limpieza</span></div>
              <div className="mt-4 sm:mt-5"><button onClick={async () => { const result = await Swal.fire({ title: "¿Habitación lista?", text: `${habitacion.nombre} volverá a estar disponible.`, icon: "question", showCancelButton: true, confirmButtonText: "Sí, está lista", cancelButtonText: "Cancelar", confirmButtonColor: "#16a34a" }); if (!result.isConfirmed) return; try { await api.post(`habitaciones/${habitacion.id}/marcar_lista/`); Swal.fire({ icon: "success", title: "Lista", text: "La habitación volvió a estar disponible.", timer: 1600, showConfirmButton: false }); cargarDatos(); } catch (error) { Swal.fire({ icon: "error", title: "Error", text: "No se pudo cambiar el estado." }); } }} className="w-full bg-green-600 hover:bg-green-700 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm transition-all">✓ Marcar como lista</button></div>
            </div>
          ))}
          {habitacionesLimpieza.length === 0 && <div className="col-span-full bg-white border-2 border-slate-200 rounded-xl sm:rounded-2xl p-6 sm:p-8 text-center text-slate-500">No hay habitaciones en limpieza.</div>}
        </div>

        {/* Habitaciones Ocupadas */}
        <div className="mb-3 sm:mb-4 mt-6 sm:mt-8"><h2 className="text-lg sm:text-xl font-bold text-slate-800 flex items-center gap-2"><span className="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-500 rounded-full animate-pulse"></span>Habitaciones Ocupadas</h2></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-5">
          {asignacionesActivas.map((asignacion) => (
            <div key={asignacion.id} className="bg-white rounded-xl sm:rounded-2xl border-2 border-yellow-200 p-4 sm:p-5 shadow-md hover:shadow-lg transition-all">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-3"><div><h3 className="text-lg sm:text-xl font-bold text-slate-900">{asignacion.habitacion_nombre}</h3><p className="text-xs sm:text-sm text-slate-600 mt-1 break-words">👤 {asignacion.cliente_nombre}</p></div><span className="w-fit px-2 sm:px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700">🔴 Ocupada</span></div>
              <div className="mt-3 sm:mt-4 space-y-1 sm:space-y-2 text-xs sm:text-sm text-slate-600 bg-slate-50 rounded-lg sm:rounded-xl p-2 sm:p-3">
                <p className="flex justify-between"><strong>📅 Inicio:</strong><span className="text-right ml-2">{asignacion.fecha_inicio}</span></p>
                <p className="flex justify-between"><strong>⏰ Fin:</strong><span className="text-right ml-2">{asignacion.fecha_fin}</span></p>
                <p className="flex justify-between font-bold text-slate-900"><strong>💰 Total:</strong><span className="text-right ml-2">{formatearPrecio(asignacion.total, asignacion.habitacion_data?.moneda || "NIO")}</span></p>
              </div>
              <div className="mt-4 sm:mt-5 flex flex-col sm:flex-row gap-2 sm:gap-3">
                <button onClick={() => enviarFacturaWhatsappSimple(asignacion)} className="flex-1 bg-green-500 hover:bg-green-600 text-white px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm transition-all">📄 Factura</button>
                {asignacion.habitacion_data?.tipo_cobro === "mensual" && <button onClick={() => reanudarContrato(asignacion)} disabled={guardando} className="flex-1 bg-purple-500 hover:bg-purple-600 text-white px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm transition-all disabled:opacity-50">↻ Reanudar</button>}
                <button onClick={() => finalizarAsignacion(asignacion)} className="flex-1 bg-slate-700 hover:bg-slate-800 text-white px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm transition-all">Confirma Salida</button>
              </div>
            </div>
          ))}
          {asignacionesActivas.length === 0 && <div className="col-span-full bg-white border-2 border-slate-200 rounded-xl sm:rounded-2xl p-6 sm:p-8 text-center text-slate-500">No hay habitaciones ocupadas actualmente.</div>}
        </div>

        {/* Modal de Ingreso/Reanudación */}
        {modalIngreso && habitacionSeleccionada && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-3 sm:px-4 backdrop-blur-sm overflow-y-auto py-4">
            <div className="bg-white rounded-xl sm:rounded-2xl w-full max-w-[95%] sm:max-w-md p-4 sm:p-6 shadow-2xl my-auto">
              <div className="flex justify-between items-center mb-4 sm:mb-6"><h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-purple-600 to-slate-700 bg-clip-text text-transparent">{asignacionReanudar ? "↻ Reanudar Contrato" : habitacionSeleccionada.tipo_cobro === "mensual" ? "📅 Nuevo Contrato Mensual" : "🌙 Nuevo Ingreso por Noche"}</h2><button onClick={cerrarModalIngreso} className="text-slate-400 hover:text-slate-600 text-2xl transition-all w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100">×</button></div>
              <div className="bg-purple-50 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-4 sm:mb-5 border border-purple-200"><p className="text-xs sm:text-sm font-semibold mb-2 sm:mb-3 text-purple-800">{habitacionSeleccionada.tipo_cobro === "mensual" ? "📆 ¿Cuántos meses?" : "🌙 ¿Cuántas noches?"}</p><div className="grid grid-cols-4 gap-1.5 sm:gap-2">{[1,2,3,4,5,6,7,8,9,10,11,12].map((num) => (<button key={num} onClick={() => habitacionSeleccionada.tipo_cobro === "mensual" ? setMeses(num) : setNoches(num)} className={`py-1.5 sm:py-2 rounded-lg sm:rounded-xl border-2 text-xs sm:text-sm font-semibold transition-all ${cantidad === num ? "bg-purple-600 text-white border-purple-600 shadow-md" : "bg-white text-slate-700 border-slate-200 hover:border-purple-300 hover:bg-purple-50"}`}>{num}</button>))}</div></div>
              <div className="mb-4 sm:mb-5"><p className="text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2 text-slate-700">🏠 Habitación</p><div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm inline-block shadow-md">{habitacionSeleccionada.nombre} · {formatearPrecio(habitacionSeleccionada.precio, habitacionSeleccionada.moneda)}</div></div>
              <div className="mb-4 sm:mb-5 relative"><label className="block text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2 text-slate-700">👤 Buscar Cliente</label><input type="text" value={busquedaCliente} onChange={(e) => { setBusquedaCliente(e.target.value); setClienteSeleccionado(null); }} placeholder="Nombre, cédula o teléfono..." className="w-full border-2 border-slate-200 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-sm outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition-all" />
                {clientes.length > 0 && (<div className="absolute left-0 right-0 mt-2 bg-white border-2 border-slate-200 rounded-lg sm:rounded-xl shadow-lg z-50 max-h-40 sm:max-h-48 overflow-y-auto">{clientes.map((cliente) => (<button key={cliente.id} onClick={() => seleccionarCliente(cliente)} className="w-full text-left px-3 sm:px-4 py-2 sm:py-3 hover:bg-purple-50 transition-all text-sm"><p className="font-semibold text-slate-900">{cliente.nombre} {cliente.apellido}</p><p className="text-xs text-slate-500 mt-0.5">🆔 {cliente.cedula} · 📞 {cliente.telefono}</p></button>))}</div>)}
                {clienteSeleccionado && (<p className="text-xs text-green-600 font-semibold mt-2 flex items-center gap-1">✓ Cliente seleccionado: {clienteSeleccionado.nombre} {clienteSeleccionado.apellido}</p>)}
              </div>
              <div className="border-2 border-yellow-200 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 mb-4 sm:mb-5 bg-yellow-50"><label className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm font-semibold text-slate-700 cursor-pointer"><input type="checkbox" checked={personaAdicional} onChange={(e) => { setPersonaAdicional(e.target.checked); if (!e.target.checked) { setCantidadPersonasAdicionales(0); setCargoAdicional(0); } }} className="w-3.5 h-3.5 sm:w-4 sm:h-4" />👥 Persona adicional</label>
                {personaAdicional && (<div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mt-3 sm:mt-4"><div><label className="text-xs font-semibold text-slate-600">Cantidad</label><input type="number" min="1" value={cantidadPersonasAdicionales} onChange={(e) => setCantidadPersonasAdicionales(e.target.value)} className="w-full border-2 border-slate-200 rounded-lg sm:rounded-xl px-2 sm:px-3 py-1.5 sm:py-2 mt-1 text-sm focus:border-purple-400 outline-none" /></div><div><label className="text-xs font-semibold text-slate-600">Cargo adicional ({habitacionSeleccionada?.moneda === "USD" ? "USD" : "NIO"})</label><input type="number" min="0" value={cargoAdicional} onChange={(e) => setCargoAdicional(e.target.value)} className="w-full border-2 border-slate-200 rounded-lg sm:rounded-xl px-2 sm:px-3 py-1.5 sm:py-2 mt-1 text-sm focus:border-purple-400 outline-none" /></div></div>)}
              </div>
              <div className="mb-4 sm:mb-6 bg-slate-50 rounded-lg sm:rounded-xl p-3 sm:p-4"><p className="text-xs sm:text-sm font-semibold mb-2 sm:mb-3 text-slate-700">💰 Resumen del cobro</p><div className="space-y-1.5 sm:space-y-2"><div className="flex justify-between text-xs sm:text-sm text-slate-600"><span className="break-words pr-2">{habitacionSeleccionada.nombre} × {cantidad} {habitacionSeleccionada.tipo_cobro === "mensual" ? "mes(es)" : "noche(s)"}</span><span>{formatearPrecio(subtotal, habitacionSeleccionada.moneda)}</span></div>{Number(cargoAdicional) > 0 && (<div className="flex justify-between text-xs sm:text-sm text-slate-600"><span>Cargo adicional</span><span>{formatearPrecio(cargoAdicional, habitacionSeleccionada.moneda)}</span></div>)}<div className="flex justify-between font-bold text-slate-900 pt-1.5 sm:pt-2 border-t border-slate-200"><span>Total</span><span className="text-base sm:text-xl text-purple-600">{formatearPrecio(total, habitacionSeleccionada.moneda)}</span></div></div></div>
              <div className="flex flex-col sm:flex-row sm:justify-end gap-2 sm:gap-3"><button onClick={cerrarModalIngreso} className="px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl border-2 border-slate-300 font-semibold text-sm hover:bg-slate-50 transition-all">Cancelar</button><button onClick={confirmarIngreso} disabled={guardando} className="px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold hover:from-purple-700 hover:to-purple-800 disabled:opacity-60 transition-all shadow-md text-sm">{guardando ? "Guardando..." : asignacionReanudar ? "↻ Reanudar Contrato" : "✓ Confirmar Contrato"}</button></div>
            </div>
          </div>
        )}

        {showFacturaModal && facturaDataActual && (<FacturaModal facturaData={facturaDataActual} onClose={() => setShowFacturaModal(false)} />)}
      </section>
    </div>
  );
};

export default AsignacionesPage;