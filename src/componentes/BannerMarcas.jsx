import "../styles/BannerMarcas.css";

function BannerMarcas() {
  const marcasOficiales = [
    {
      id: 1,
      nombre: "PEUGEOT",
      logo: "/logoPeugot.jpg",
      url: "https://www.peugeot.es"
    },
    {
      id: 2,
      nombre: "CITROËN",
      logo: "/logoCitroen.webp",
      url: "https://www.citroen.es",
      claseExtra: "ajuste-citroen" 
    },
    {
      id: 3,
      nombre: "DS AUTOMOBILES",
      logo: "logoDs.jpg",
      url: "https://www.dsautomobiles.es"
    }
  ];

  return (
    <section className="banner-marcas">
      <div className="banner-cabecera">
        <span className="texto-oficial">SERVICIO OFICIAL DE REPARACIÓN</span>
        <p className="garantia-texto">Garantía Certificada y Recambios Originales</p>
      </div>

      <div className="marcas-grid">
        {marcasOficiales.map((marca) => (
          <div key={marca.id} className="marca-tarjeta">
            <div className="marca-logo-wrapper">
              <img 
                src={marca.logo} 
                alt={marca.nombre} 
                className={marca.claseExtra || ""}
              />
            </div>
            <h3>{marca.nombre}</h3>
            <a 
              href={marca.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="boton-marca-info"
            >
              Más información
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}

export default BannerMarcas;