import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import Navbar from './componentes/NavBar';
import Consulta from './pages/Consulta';
import PaginaServicios from './pages/PaginaServicios';
import Contacto from './pages/Contacto';

// Importamos las páginas de autenticación y gestión
import Login from './pages/Login';
import SignUp from './pages/SignUp'; // <-- Añadimos este import
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
          
          {/* Rutas de Acceso */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} /> {/* <-- Nueva ruta de registro */}
          
          {/* Ruta de Administración */}
          <Route path="/admin" element={<Admin />} />
          
          {/* Ruta de Historial para clientes */}
          <Route path="/historial" element={
            <div style={{paddingTop: '100px', color: 'white', textAlign: 'center'}}>
              <h2>Mis Reparaciones</h2>
              <p>Próximamente: Tu historial de reparaciones y estado del vehículo.</p>
            </div>
          } />
        </Routes>
      </BrowserRouter>
  )
}

export default App;