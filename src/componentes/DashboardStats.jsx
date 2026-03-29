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
  
  // --- 1. FUNCIÓN DE CLASIFICACIÓN (Mapeo de reparaciones a categorías) ---
  const clasificarReparacion = (texto) => {
    if (!texto) return 'Otros';
    const t = texto.toLowerCase();
    
    if (t.includes('rueda') || t.includes('neumatico') || t.includes('llanta')) return 'Neumáticos';
    if (t.includes('aceite') || t.includes('filtro') || t.includes('revision') || t.includes('mantenimiento')) return 'Mantenimiento';
    if (t.includes('freno') || t.includes('pastilla') || t.includes('disco')) return 'Seguridad y Frenos';
    if (t.includes('motor') || t.includes('distribucion') || t.includes('escape') || t.includes('embrague')) return 'Mecánica General';
    if (t.includes('suspension') || t.includes('amortiguador')) return 'Suspensión';
    if (t.includes('luna') || t.includes('cristal') || t.includes('ventana') || t.includes('parabrisas')) return 'Cristalería';
    
    return 'Otros';
  };

  // --- 2. LÓGICA DE ACTIVIDAD DE CITAS (LÍNEAS) ---
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
      borderColor: '#38bdf8',
      backgroundColor: 'rgba(56, 189, 248, 0.1)',
      tension: 0.4,
      fill: true,
      pointBackgroundColor: '#38bdf8',
      pointBorderColor: '#fff',
      pointHoverRadius: 6,
    }],
  };

  // --- 3. LÓGICA DE REPARACIONES POR CATEGORÍA (BARRAS) ---
  const conteoCategorias = listaCitas.reduce((acc, cita) => {
    const categoria = clasificarReparacion(cita.reparacion);
    acc[categoria] = (acc[categoria] || 0) + 1;
    return acc;
  }, {});

  const dataBarras = {
    labels: Object.keys(conteoCategorias),
    datasets: [{
      label: 'Servicios por Categoría',
      data: Object.values(conteoCategorias),
      backgroundColor: [
        '#38bdf8', // Neumáticos
        '#818cf8', // Mantenimiento
        '#2dd4bf', // Mecánica General
        '#fbbf24', // Seguridad
        '#f472b6', // Suspensión
        '#a78bfa', // Cristalería
        '#94a3b8'  // Otros
      ],
      borderRadius: 8,
    }],
  };

  // --- 4. LÓGICA DE PIEZAS (TARTA) ---
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
      borderColor: '#1e293b', 
    }],
  };

  const opciones = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        position: 'bottom', 
        labels: { 
          color: '#e2e8f0', 
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
        <h3>📈 Actividad de Citas Reciente</h3>
        <div className="canvas-container">
            <Line data={dataLineas} options={opciones} />
        </div>
      </div>

      <div className="grafico-card">
        <h3>📊 Tipos de Reparación (Categorías)</h3>
        <div className="canvas-container">
            <Bar data={dataBarras} options={opciones} />
        </div>
      </div>
      
      <div className="grafico-card">
        <h3>🍰 Top 5 Piezas Usadas</h3>
        <div className="canvas-container">
            <Pie data={dataTarta} options={{ ...opciones, scales: {} }} />
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;