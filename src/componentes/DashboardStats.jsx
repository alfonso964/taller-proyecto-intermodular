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
  
  const flujoFechas = listaCitas.reduce((acc, cita) => {
    const fecha = new Date(cita.fecha).toLocaleDateString();
    acc[fecha] = (acc[fecha] || 0) + 1;
    return acc;
  }, {});

  const dataLineas = {
    labels: Object.keys(flujoFechas).slice(-7),
    datasets: [{
      label: 'Citas registradas',
      data: Object.values(flujoFechas).slice(-7),
      borderColor: '#38bdf8', // Azul brillante
      backgroundColor: 'rgba(56, 189, 248, 0.1)',
      tension: 0.4,
      fill: true,
      pointBackgroundColor: '#38bdf8',
      pointBorderColor: '#fff',
      pointHoverRadius: 6,
    }],
  };

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
      backgroundColor: '#38bdf8', // Color sólido para mejor visibilidad
      borderRadius: 5,
    }],
  };

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
      data: piezasOrdenadas.map(([, cantidad]) => cantidad),
      backgroundColor: ['#38bdf8', '#818cf8', '#2dd4bf', '#fbbf24', '#f472b6'],
      borderWidth: 2,
      borderColor: '#1e293b', // Separación entre trozos con el color de fondo
    }],
  };

  // CONFIGURACIÓN GLOBAL DE COLORES PARA GRÁFICOS
  const opciones = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        position: 'bottom', 
        labels: { 
          color: '#e2e8f0', // Texto de leyenda casi blanco
          padding: 20, 
          font: { size: 12, weight: '500' } 
        } 
      },
      tooltip: {
        backgroundColor: '#0f172a',
        titleColor: '#f8fafc',
        bodyColor: '#f8fafc',
        borderColor: '#38bdf8',
        borderWidth: 1,
        padding: 12
      }
    },
    scales: {
      y: { 
        beginAtZero: true,
        ticks: { color: '#94a3b8', font: { size: 11 } }, 
        grid: { color: 'rgba(255,255,255,0.05)' } 
      },
      x: { 
        ticks: { color: '#94a3b8', font: { size: 11 } }, 
        grid: { display: false } 
      }
    }
  };

  return (
    <div className="contenedor-graficos">
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