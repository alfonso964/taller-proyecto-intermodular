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

    // --- REDUCE DE BENEFICIO POR DÍA CON NOMBRES DESCRIPTIVOS ---
    const beneficioAgrupadoPorDia = filtradas.reduce((resumenDias, citaActual) => {
      const fechaClave = new Date(citaActual.fecha).toLocaleDateString();
      const manoDeObra = Number(citaActual.precio_mano_obra) || 0;
      
      const piezasDeEstaCita = piezasUsadas.filter(p => p.id_cita === citaActual.id);
      
      const margenPiezasCita = piezasDeEstaCita.reduce((acumuladoMargen, pieza) => {
        const precioVenta = Number(pieza.piezas?.precio) || 0;
        const precioCoste = Number(pieza.piezas?.precio_coste) || 0;
        const cantidadTotal = Number(pieza.cantidad) || 0;
        return acumuladoMargen + ((precioVenta - precioCoste) * cantidadTotal);
      }, 0);

      const beneficioTotalCita = manoDeObra + margenPiezasCita;

      if (resumenDias[fechaClave]) {
        resumenDias[fechaClave] = resumenDias[fechaClave] + beneficioTotalCita;
      } else {
        resumenDias[fechaClave] = beneficioTotalCita;
      }
      
      return resumenDias;
    }, {});

    return {
      labels: Object.keys(beneficioAgrupadoPorDia),
      datasets: [{
        label: 'Beneficio Bruto (€)',
        data: Object.values(beneficioAgrupadoPorDia),
        borderColor: '#38bdf8',
        backgroundColor: 'rgba(56, 189, 248, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#38bdf8',
        pointBorderColor: '#fff',
      }],
    };
  };

  const clasificarReparacion = (texto) => {
    if (!texto) return 'Otros';
    const t = texto.toLowerCase();
    
    if (t.includes('itv') || t.includes('inspeccion técnica') || t.includes('revisión oficial')) {
      return 'Pre-ITV';
    }
    if (t.includes('aire') || t.includes('ac') || t.includes('clima') || t.includes('calefaccion') || t.includes('compresor') || t.includes('carga gas')) {
      return 'Aire Acondicionado';
    }
    if (t.includes('rueda') || t.includes('neumatico') || t.includes('llanta') || t.includes('equilibrado') || t.includes('alineado') || t.includes('pinchazo')) {
      return 'Neumáticos';
    }
    if (t.includes('chapa') || t.includes('pintura') || t.includes('golpe') || t.includes('rallazo') || t.includes('parachoques') || t.includes('paragolpes') || t.includes('pulido') || t.includes('puerta') || t.includes('capó')) {
      return 'Chapa y Pintura';
    }
    if (t.includes('electronica') || t.includes('diagnosis') || t.includes('centralita') || t.includes('luces') || t.includes('bateria') || t.includes('fusible') || t.includes('sensor') || t.includes('abs') || t.includes('esp') || t.includes('cuadro')) {
      return 'Electrónica';
    }
    if (t.includes('motor') || t.includes('aceite') || t.includes('freno') || t.includes('mecanica') || t.includes('filtro') || t.includes('embrague') || t.includes('distribucion') || t.includes('correa') || t.includes('suspension') || t.includes('amortiguador') || t.includes('bujia') || t.includes('escape') || t.includes('culata')) {
      return 'Mecánica General';
    }
    return 'Otros';
  };

  const conteoPorCategorias = listaCitas.reduce((resumenCategorias, citaActual) => {
    const nombreCategoria = clasificarReparacion(citaActual.reparacion);
    
    if (resumenCategorias[nombreCategoria]) {
        resumenCategorias[nombreCategoria] = resumenCategorias[nombreCategoria] + 1;
    } else {
        resumenCategorias[nombreCategoria] = 1;
    }
    
    return resumenCategorias;
  }, {});

  const procesarTopPiezas = () => {
    const inventarioContado = piezasUsadas.reduce((hojaDeCalculo, registroActual) => {
      const nombrePieza = registroActual.piezas?.nombre || 'Desconocido';
      const cantidadUsada = Number(registroActual.cantidad) || 0;

      if (hojaDeCalculo[nombrePieza]) {
        hojaDeCalculo[nombrePieza] = hojaDeCalculo[nombrePieza] + cantidadUsada;
      } else {
        hojaDeCalculo[nombrePieza] = cantidadUsada;
      }

      return hojaDeCalculo;
    }, {});

    const top5 = Object.entries(inventarioContado)
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
              labels: Object.keys(conteoPorCategorias),
              datasets: [{
                label: 'Cantidad',
                data: Object.values(conteoPorCategorias),
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