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

  // --- 2. CATEGORÍAS ULTRA-COMPLETAS ---
  const clasificarReparacion = (texto) => {
    if (!texto) return 'Otros';
    const t = texto.toLowerCase();
    
    // 1. PRE-ITV
    if (t.includes('itv') || t.includes('inspeccion técnica') || t.includes('revisión oficial')) {
      return 'Pre-ITV';
    }

    // 2. AIRE ACONDICIONADO
    if (t.includes('aire') || t.includes('ac') || t.includes('clima') || t.includes('calefaccion') || t.includes('compresor') || t.includes('carga gas')) {
      return 'Aire Acondicionado';
    }

    // 3. NEUMÁTICOS
    if (t.includes('rueda') || t.includes('neumatico') || t.includes('llanta') || t.includes('equilibrado') || t.includes('alineado') || t.includes('pinchazo')) {
      return 'Neumáticos';
    }

    // 4. CHAPA Y PINTURA
    if (t.includes('chapa') || t.includes('pintura') || t.includes('golpe') || t.includes('rallazo') || t.includes('parachoques') || t.includes('paragolpes') || t.includes('pulido') || t.includes('puerta') || t.includes('capó')) {
      return 'Chapa y Pintura';
    }

    // 5. ELECTRÓNICA
    if (t.includes('electronica') || t.includes('diagnosis') || t.includes('centralita') || t.includes('luces') || t.includes('bateria') || t.includes('fusible') || t.includes('sensor') || t.includes('abs') || t.includes('esp') || t.includes('cuadro')) {
      return 'Electrónica';
    }

    // 6. MECÁNICA GENERAL
    if (t.includes('motor') || t.includes('aceite') || t.includes('freno') || t.includes('mecanica') || t.includes('filtro') || t.includes('embrague') || t.includes('distribucion') || t.includes('correa') || t.includes('suspension') || t.includes('amortiguador') || t.includes('bujia') || t.includes('escape') || t.includes('culata')) {
      return 'Mecánica General';
    }
    
    return 'Otros';
  };

  const conteoCategorias = listaCitas.reduce((acc, cita) => {
    const cat = clasificarReparacion(cita.reparacion);
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  // --- 3. LÓGICA DE TOP PIEZAS ---
  const procesarTopPiezas = () => {
    const agrupado = piezasUsadas.reduce((acc, p) => {
      const nombre = p.piezas?.nombre || 'Desconocido';
      acc[nombre] = (acc[nombre] || 0) + (Number(p.cantidad) || 0);
      return acc;
    }, {});

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
                backgroundColor: ['#38bdf8', '#818cf8', '#2dd4bf', '#fbbf24', '#f472b6', '#a855f7', '#64748b'],
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