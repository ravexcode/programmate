//Contenedor de secciones dentro del main
export default function SectionContainer(props: any){
  return (
    <section 
    className="w-[80dvw] px-4 py-3 bg-plum-section border-l-4 border-resalted rounded-lg flex flex-col justify-center items-start shadow-lg gap-2 show-element duration-250 hover:-translate-y-1 hover:shadow-resalted/30"
    id={props.id}>
      <h2
      className="text-xl bg-radial from-gradient-center via-gradient-borders to-gradient-borders font-bold bg-center bg-clip-text bg-size-[200%] text-transparent">
        {props.title}
      </h2>
      {props.children}
    </section>
  )
}