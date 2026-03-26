import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import Navbar from './componentes/NavBar';
import Consulta from './pages/Consulta';
import PaginaServicios from './pages/PaginaServicios';
import Contacto from './pages/Contacto';
// Añadimos los nuevos imports
import Login from './pages/Login';
import Admin from './pages/Admin';

function App() {

  return (
    <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path='/servicios' element={<PaginaServicios />} />
          <Route path="/reserva-ia" element={<Consulta />} />
          <Route path="/contacto" element={<Contacto />} />
          
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
          
          {/* <Route path="/historial" element={<div style={{paddingTop: '100px', color: 'white', textAlign: 'center'}}>Próximamente: Tu historial de reparaciones</div>} /> */}
        </Routes>
      </BrowserRouter>
  )
}

export default App