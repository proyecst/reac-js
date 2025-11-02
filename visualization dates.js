import React from 'react';
// Importa los componentes específicos de la librería Recharts
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Datos de ejemplo para el gráfico
const data = [
  { name: 'Enero', visitas: 4000, ventas: 2400 },
  { name: 'Febrero', visitas: 3000, ventas: 1398 },
  { name: 'Marzo', visitas: 2000, ventas: 9800 },
  { name: 'Abril', visitas: 2780, ventas: 3908 },
  { name: 'Mayo', visitas: 1890, ventas: 4800 },
  { name: 'Junio', visitas: 2390, ventas: 3800 },
];

function DataChart() {
  return (
    <div style={{ width: '100%', height: 350, marginTop: '50px' }}>
      <h2>Dashboard de Ventas Mensuales</h2>
      {/* ResponsiveContainer asegura que el gráfico se ajuste al tamaño de su contenedor */}
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          {/* Componente de cuadrícula */}
          <CartesianGrid strokeDasharray="3 3" />
          
          {/* Eje X (Categorías: Enero, Febrero, etc.) */}
          <XAxis dataKey="name" />
          
          {/* Eje Y (Valores: 0, 1000, 2000, etc.) */}
          <YAxis />
          
          {/* Tooltip (Caja que aparece al pasar el ratón) */}
          <Tooltip />
          
          {/* Leyenda */}
          <Legend />
          
          {/* Barras del gráfico */}
          <Bar dataKey="visitas" fill="#8884d8" name="Visitas al Sitio" />
          <Bar dataKey="ventas" fill="#82ca9d" name="Ventas Confirmadas" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default DataChart;