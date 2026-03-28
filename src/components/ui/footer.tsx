//Contendor especial de objetos de lista
function ListItem(props: any) {
  return (
    <li>
      <a href={props.link}
      className="hover:text-resalted hover:underline w-full">
        {props.children}
      </a>
    </li>
  )
}

//Contenedor del footer
export default function Footer() {
  return (
    <footer
    className="bg-black px-2 py-3 flex flex-col justify-center items-center gap-3 z-2">

      <h3 
      className="font-semibold text-lg">
        PrismaFlow® 2026
      </h3>

      <div className="flex flex-wrap justify-center gap-8 items-start md:justify-around md:w-full">

        <ul className="w-full flex flex-col justify-center items-center md:items-start md:w-auto">
          <li className="font-bold text-resalted"><h4> Acerca de </h4></li>
          <ListItem link="/about#contact"> Contacto </ListItem>
          <ListItem link="/forum"> Foro </ListItem>
          <ListItem link="/tyc"> Terminos y condiciones </ListItem>
        </ul>

        <ul className="w-full flex flex-col justify-center items-center md:items-start md:w-auto">
          <li className="font-bold text-resalted"><h4> Desarolladores </h4></li>
          <ListItem link="https://github.com/RDev00/prismaflow-opensource-repo"> Repositorio </ListItem>
          <ListItem link="/tecnologies/about"> Como manejamos los datos </ListItem>
          <ListItem link="/tecnologies"> Tecnologias </ListItem>
        </ul>

        <ul className="w-full flex flex-col justify-center items-center md:items-start md:w-auto">
          <li className="font-bold text-resalted"><h4> Asistencia </h4></li>
          <ListItem link="/help/report"> Reportar un error </ListItem>
          <ListItem link="/help/sugerences"> Sugerencias </ListItem>
          <ListItem link="/business/suscriptions/cancel"> Cancelar suscripción </ListItem>
        </ul>

        <ul className="w-full flex flex-col justify-center items-center md:items-start md:w-auto">
          <li className="font-bold text-resalted"><h4> Nuestras redes </h4></li>
          <ListItem link="/#"> Facebook </ListItem>
          <ListItem link="/#"> Instagram </ListItem>
          <ListItem link="/#"> X </ListItem>
          <ListItem link="/#"> Youtube </ListItem>
          <ListItem link="/#"> Canal de Whatsapp </ListItem>
          <ListItem link="/#"> Reddit </ListItem>
        </ul>

      </div>

    </footer>
  )
}