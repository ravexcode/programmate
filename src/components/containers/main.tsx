//Contenedor principal dentro de las secciones

export default function MainContainer(props: any){
  return (
    <div className="grid grid-rows-[auto_1fr_auto] min-h-dvh bg-plum text-zinc-100">
      {props.children}
    </div>
  );
}