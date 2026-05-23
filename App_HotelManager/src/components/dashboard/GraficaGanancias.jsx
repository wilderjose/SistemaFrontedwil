import { useEffect, useState } from "react";
import api from "../../api/axios";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LabelList,
} from "recharts";

const GraficaGanancias = () => {
  const [datos, setDatos] = useState([]);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const response = await api.get("dashboard/ganancias-mensuales/");
      setDatos(response.data);
    } catch (error) {
      console.log("Error cargando gráfica:", error);
    }
  };

  const formatearDinero = (valor) =>
    `C$ ${Number(valor || 0).toLocaleString()}`;

  return (
    <section className="w-full">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
          Dashboard financiero
        </h1>

        <p className="text-slate-500 mt-2 text-sm md:text-base">
          Ganancias mensuales generadas por las habitaciones.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl p-4 md:p-8 shadow-sm">
        <div className="mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-slate-900">
            Ganancias mensuales
          </h2>

          <p className="text-slate-500 mt-1 text-sm md:text-base">
            Los picos muestran el total ganado por mes.
          </p>
        </div>

        <div className="w-full overflow-x-auto pb-3">
          <div className="min-w-[650px] h-[360px] md:h-[430px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={datos}
                margin={{
                  top: 40,
                  right: 30,
                  left: 10,
                  bottom: 10,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />

                <XAxis dataKey="mes" stroke="#64748b" tickLine={false} />

                <YAxis
                  stroke="#64748b"
                  tickFormatter={(value) => `C$${value}`}
                  tickLine={false}
                />

                <Tooltip
                  formatter={(value) => [formatearDinero(value), "Ganancia"]}
                  labelFormatter={(label) => `Mes: ${label}`}
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "16px",
                    color: "#0f172a",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                  }}
                />

                <Line
                  type="monotone"
                  dataKey="total"
                  name="Ganancias"
                  stroke="#0f172a"
                  strokeWidth={4}
                  dot={{
                    r: 5,
                    fill: "#0f172a",
                    stroke: "#ffffff",
                    strokeWidth: 2,
                  }}
                  activeDot={{
                    r: 9,
                    fill: "#0f172a",
                    stroke: "#ffffff",
                    strokeWidth: 3,
                  }}
                  animationDuration={1800}
                >
                  <LabelList
                    dataKey="total"
                    position="top"
                    formatter={(value) => formatearDinero(value)}
                    fill="#0f172a"
                    fontSize={12}
                    fontWeight="bold"
                  />
                </Line>

                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#94a3b8"
                  strokeWidth={2}
                  strokeOpacity={0.5}
                  dot={false}
                  animationDuration={2200}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <p className="mt-3 text-xs text-slate-400 md:hidden">
          Desliza horizontalmente para ver la gráfica completa.
        </p>
      </div>
    </section>
  );
};

export default GraficaGanancias;