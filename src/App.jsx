import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import Navbar from './componentes/NavBar';
import Consulta from './pages/Consulta';
import PaginaServicios from './pages/PaginaServicios';
import Contacto from './pages/Contacto';
import Login from './pages/Login';
import SignUp from './pages/SignUp'; 
import Admin from './pages/Admin';
import MisReparaciones from './pages/MisReparaciones'; 
import PaginaVentaCoches from './pages/AdminCoches';
import CatalogoCoches from './pages/CatalogoCoches';
import DetalleCoche from './pages/DetalleCoche'; // <--- NUEVA IMPORTACIÓN

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/servicios' element={<PaginaServicios />} />
        <Route path="/reserva-ia" element={<Consulta />} />
        <Route path="/coches" element={<CatalogoCoches />} />
        <Route path="/coches/:id" element={<DetalleCoche />} />
        
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/coches" element={<PaginaVentaCoches />} />
        <Route path="/mis-reparaciones" element={<MisReparaciones />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;