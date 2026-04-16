import './App.css'
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
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
import DetalleCoche from './pages/DetalleCoche';
import Chatbot from './componentes/Chatbot'; // <--- IMPORTAMOS EL CHATBOT

// Creamos un componente para manejar la lógica de visibilidad
const ContenidoApp = () => {
  const location = useLocation();

  // Rutas donde NO quieres que aparezca el chatbot
  const rutasExcluidas = ['/reserva-ia', '/admin', '/admin/coches'];
  
  // Comprobamos si la ruta actual coincide con alguna de las excluidas
  const mostrarChatbot = !rutasExcluidas.some(ruta => location.pathname.startsWith(ruta));

  return (
    <>
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
      
      {mostrarChatbot && <Chatbot />}
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <ContenidoApp />
    </BrowserRouter>
  )
}

export default App;