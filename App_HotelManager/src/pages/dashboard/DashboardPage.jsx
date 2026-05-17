import { useEffect, useState } from "react";
import api from "../../api/axios";

const DashboardPage = () => {
  const [resumen, setResumen] = useState(null);

  useEffect(() => {
    cargarResumen();
  }, []);

  const cargarResumen = async () => {
    try {
      const response = await api.get("dashboard/resumen/");
      setResumen(response.data);
    } catch (error) {
      console.log("Error cargando dashboard:", error);
    }
  };

  const cards = [
    {
      titulo: "Habitaciones",
      valor: resumen?.habitaciones_total || 0,
    },
    {
      titulo: "Disponibles",
      valor: resumen?.habitaciones_disponibles || 0,
    },
    {
      titulo: "Ocupadas",
      valor: resumen?.habitaciones_ocupadas || 0,
    },
    {
      titulo: "Clientes",
      valor: resumen?.clientes_total || 0,
    },
    {
      titulo: "Asignaciones activas",
      valor: resumen?.asignaciones_activas || 0,
    },
    {
      titulo: "Ingresos totales",
      valor: `C$ ${resumen?.ingresos_totales || 0}`,
    },
  ];

  return (
    <section>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Resumen general del estado actual del hotel.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {cards.map((card) => (
          <div
            key={card.titulo}
            className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm"
          >
            <p className="text-sm font-medium text-gray-500">{card.titulo}</p>
            <h2 className="text-3xl font-bold text-gray-900 mt-3">
              {card.valor}
            </h2>
          </div>
        ))}
      </div>
    </section>
  );
};

export default DashboardPage;