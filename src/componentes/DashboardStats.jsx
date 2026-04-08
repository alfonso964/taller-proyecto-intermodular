/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
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
  Filler, 
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
  Legend,
  Filler 
);

const DashboardStats = ({ listaCitas = [], piezasUsadas = [] }) => {
  const [filtroTiempo, setFiltroTiempo] = useState('mes');

  // --- 1. LÓGICA DE BENEFICIO BRUTO ---
  const procesarBeneficioReal = () => {
    const ahora = new Date();
    const citasFinalizadas = listaCitas.filter(c => c.estado === 'FINALIZADA');

    const filtradas = citasFinalizadas.filter(cita => {
      const fechaCita = new Date(cita.fecha);
      if (filtroTiempo === 'mes') {
        return fechaCita > new Date(ahora.getFullYear(), ahora.getMonth() - 1, ahora.getDate());
      } else if (filtroTiempo === '6meses') {
        return fechaCita > new Date(ahora.getFullYear(), ahora.getMonth() - 6, ahora.getDate());
      } else {
        return fechaCita > new Date(ahora.getFullYear() - 1, ahora.getMonth(), ahora.getDate());
      }
    });

    filtradas.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

    const beneficioPorDia = filtradas.reduce((acc, cita) => {
      const f = new Date(cita.fecha).toLocaleDateString();
      const mo = Number(cita.precio_mano_obra) || 0;
      
      const piezasDeEstaCita = piezasUsadas.filter(p => p.id_cita === cita.id);
      const margenPiezas = piezasDeEstaCita.reduce((sub, p) => {
        const venta = Number(p.piezas?.precio) || 0;
        const coste = Number(p.piezas?.precio_coste) || 0;
        const cant  = Number(p.cantidad) || 0;
        return sub + ((venta - coste) * cant);
      }, 0);

      const totalBeneficio = mo + margenPiezas;
      acc[f] = (acc[f] || 0) + totalBeneficio;
      return acc;
    }, {});

    return {
      labels: Object.keys(beneficioPorDia),
      datasets: [{
        label: 'Beneficio Bruto (€)',
        data: Object.values(beneficioPorDia),
        borderColor: '#38bdf8',
        backgroundColor: 'rgba(56, 189, 248, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#38bdf8',
        pointBorderColor: '#fff',
      }],
    };
  };

  // --- 2. CATEGORÍAS (BARRAS CON COLORES) ---
  const clasificarReparacion = (texto) => {
    if (!texto) return 'Otros';
    const t = texto.toLowerCase();
    if (t.includes('rueda') || t.includes('neumatico')) return 'Neumáticos';
    if (t.includes('aceite') || t.includes('mantenimiento')) return 'Mantenimiento';
    if (t.includes('freno')) return 'Frenos';
    if (t.includes('motor')) return 'Mecánica';
    return 'Otros';
  };

  const conteoCategorias = listaCitas.reduce((acc, cita) => {
    const cat = clasificarReparacion(cita.reparacion);
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  // --- 3. LÓGICA DE TOP PIEZAS (FILTRADO Y AGRUPACIÓN) ---
  const procesarTopPiezas = () => {
    // Agrupamos por nombre de pieza y sumamos cantidades
    const agrupado = piezasUsadas.reduce((acc, p) => {
      const nombre = p.piezas?.nombre || 'Desconocido';
      acc[nombre] = (acc[nombre] || 0) + (Number(p.cantidad) || 0);
      return acc;
    }, {});

    // Convertimos a array, ordenamos de mayor a menor y cogemos las 5 primeras
    const top5 = Object.entries(agrupado)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    return {
      labels: top5.map(([nombre]) => nombre),
      datasets: [{
        data: top5.map(([, cantidad]) => cantidad),
        backgroundColor: ['#38bdf8', '#818cf8', '#2dd4bf', '#fbbf24', '#f472b6'],
        borderColor: '#1e293b',
        borderWidth: 2,
      }]
    };
  };

  const opcionesBase = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        position: 'bottom', 
        labels: { color: '#ffffff', font: { size: 12, weight: '600' } } 
      },
      tooltip: {
        backgroundColor: '#0f172a',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#38bdf8',
        borderWidth: 1,
      }
    },
    scales: {
      y: { 
        ticks: { color: '#ffffff' }, 
        grid: { color: 'rgba(255,255,255,0.05)' } 
      },
      x: { 
        ticks: { color: '#ffffff' }, 
        grid: { display: false } 
      }
    }
  };

  return (
    <div className="contenedor-graficos">
      <div className="grafico-card full-width">
        <div className="header-grafico">
          <h3>📈 Análisis de Beneficio Bruto (Mano de Obra + Margen Piezas)</h3>
          <div className="selector-periodo">
            <button className={filtroTiempo === 'mes' ? 'active' : ''} onClick={() => setFiltroTiempo('mes')}>Mes</button>
            <button className={filtroTiempo === '6meses' ? 'active' : ''} onClick={() => setFiltroTiempo('6meses')}>6 Meses</button>
            <button className={filtroTiempo === 'año' ? 'active' : ''} onClick={() => setFiltroTiempo('año')}>Año</button>
          </div>
        </div>
        <div className="canvas-container">
          <Line data={procesarBeneficioReal()} options={opcionesBase} />
        </div>
      </div>

      <div className="grafico-card">
        <h3>📊 Servicios por Categoría</h3>
        <div className="canvas-container">
          <Bar 
            data={{
              labels: Object.keys(conteoCategorias),
              datasets: [{
                label: 'Cantidad',
                data: Object.values(conteoCategorias),
                // Aquí asignamos un array de colores para que cada barra sea distinta
                backgroundColor: ['#38bdf8', '#818cf8', '#2dd4bf', '#fbbf24', '#f472b6'],
                borderRadius: 6
              }]
            }} 
            options={opcionesBase} 
          />
        </div>
      </div>

      <div className="grafico-card">
        <h3>🔧 Top 5 Piezas Utilizadas</h3>
        <div className="canvas-container">
          <Pie 
            data={procesarTopPiezas()} 
            options={{ ...opcionesBase, scales: {} }} 
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;