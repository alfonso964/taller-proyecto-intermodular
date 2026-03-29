import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,  
  LineElement, 
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import '../styles/DashboardStats.css'; 

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const DashboardStats = ({ listaCitas, piezasUsadas }) => {
  
  // Agrupamos citas por fecha
  const flujoFechas = listaCitas.reduce((acc, cita) => {
    const fecha = new Date(cita.fecha).toLocaleDateString();
    acc[fecha] = (acc[fecha] || 0) + 1;
    return acc;
  }, {});

  const dataLineas = {
    labels: Object.keys(flujoFechas).slice(-7), // Últimos 7 registros
    datasets: [{
      label: 'Citas registradas',
      data: Object.values(flujoFechas).slice(-7),
      borderColor: '#818cf8',
      backgroundColor: 'rgba(129, 140, 248, 0.2)',
      tension: 0.4,
      fill: true,
      pointBackgroundColor: '#818cf8',
    }],
  };

  // 2. Lógica para "Top Reparaciones" (Gráfico de Barras)
  const conteoReparaciones = listaCitas.reduce((acc, cita) => {
    const tipo = cita.reparacion || 'Otros';
    acc[tipo] = (acc[tipo] || 0) + 1;
    return acc;
  }, {});

  const dataBarras = {
    labels: Object.keys(conteoReparaciones),
    datasets: [{
      label: 'Número de Reparaciones',
      data: Object.values(conteoReparaciones),
      backgroundColor: 'rgba(56, 189, 248, 0.6)',
      borderColor: '#38bdf8',
      borderWidth: 1,
    }],
  };

  // 3. Lógica para "Uso de Piezas" (Gráfico de Tarta)
  const conteoPiezas = piezasUsadas.reduce((acc, p) => {
    const nombre = p.piezas?.nombre || 'Desconocido';
    acc[nombre] = (acc[nombre] || 0) + (p.cantidad || 0);
    return acc;
  }, {});

  const piezasOrdenadas = Object.entries(conteoPiezas)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const dataTarta = {
    labels: piezasOrdenadas.map(([nombre]) => nombre),
    datasets: [{
      label: 'Unidades Usadas',
      data: piezasOrdenadas.map(([, cantidad]) => cantidad),
      backgroundColor: ['#38bdf8', '#818cf8', '#fb7185', '#34d399', '#fbbf24'],
      borderWidth: 0,
    }],
  };

  const opciones = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        position: 'bottom', 
        labels: { color: '#94a3b8', padding: 20, font: { size: 12 } } 
      },
      tooltip: {
        backgroundColor: '#1e293b',
        titleColor: '#f8fafc',
        bodyColor: '#f8fafc',
        borderColor: '#38bdf8',
        borderWidth: 1
      }
    },
    scales: {
      y: { 
        beginAtZero: true,
        ticks: { color: '#94a3b8' }, 
        grid: { color: 'rgba(255,255,255,0.05)' } 
      },
      x: { 
        ticks: { color: '#94a3b8' }, 
        grid: { display: false } 
      }
    }
  };

  return (
    <div className="contenedor-graficos">
      {/* GRÁFICO DE FLUJO (Ancho completo arriba) */}
      <div className="grafico-card full-width">
        <h3>📈 Actividad de Citas</h3>
        <div style={{ height: '300px' }}>
            <Line data={dataLineas} options={opciones} />
        </div>
      </div>

      <div className="grafico-card">
        <h3>📊 Tipos de Reparación</h3>
        <div style={{ height: '300px' }}>
            <Bar data={dataBarras} options={opciones} />
        </div>
      </div>
      
      <div className="grafico-card">
        <h3>🍰 Top 5 Piezas</h3>
        <div style={{ height: '300px' }}>
            <Pie data={dataTarta} options={{ ...opciones, scales: {} }} />
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;