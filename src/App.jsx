import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import Navbar from './componentes/NavBar';
import Consulta from './pages/Consulta';
import PaginaServicios from './pages/PaginaServicios';
import Contacto from './pages/Contacto';

function App() {

  return(
    <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path='/servicios' element = {<PaginaServicios/>} />
          <Route path="/reserva-ia" element={<Consulta />} />
          <Route path="/contacto" element={<Contacto/>} />
        </Routes>
      </BrowserRouter>

  )
}
  
export default App


