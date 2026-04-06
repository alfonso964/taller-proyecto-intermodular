import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import Navbar from './componentes/NavBar';
import Consulta from './pages/Consulta';
import PaginaServicios from './pages/PaginaServicios';
import Contacto from './pages/Contacto';

// Importamos las páginas de autenticación y gestión
import Login from './pages/Login';
import SignUp from './pages/SignUp'; 
import Admin from './pages/Admin';

// 1. IMPORTAMOS EL NUEVO COMPONENTE
import MisReparaciones from './pages/MisReparaciones'; 

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
          <Route path="/signup" element={<SignUp />} />
          
          <Route path="/admin" element={<Admin />} />
          
          <Route path="/mis-reparaciones" element={<MisReparaciones />} />

        </Routes>
      </BrowserRouter>
  )
}

export default App;