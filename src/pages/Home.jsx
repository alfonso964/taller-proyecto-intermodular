import BannerMarcas from "../componentes/BannerMarcas"
import Footer from "../componentes/Footer"
import Hero from "../componentes/Hero"
import Navbar from "../componentes/NavBar"
import Servicios from "../componentes/Servicios"
import SobreNosotros from "../componentes/SobreNosotros"



function Home (){

    return(
        <div>
            <Navbar/>
            <Hero/>
            <Servicios/>
            <SobreNosotros/>
            <BannerMarcas/>
            <Footer/>
        </div>
    )

}

export default Home