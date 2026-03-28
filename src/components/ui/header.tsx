//Contenedor del encabezado
export default function Header(props : any) {
  return (
    <header
    className="flex justify-between items-center p-3 bg-plum">
      <img src="/logos/large.svg" alt="PrismaFlow® large logo" 
      className="aspect-3/1 h-10 duration-200 hover:scale-110 hover:brightness-60 cursor-pointer"
      onClick={() => {
        window.location.href = "/"
      }}/>

      { props.isButtonInvisible ? null : (
        <a href="/download"
        className="bg-button px-4 py-1 rounded-md duration-200 hover:brightness-80 hover:scale-105 shadow-lg shadow-button/30">
          Descargar
        </a>
      ) }
    </header>
  )
}