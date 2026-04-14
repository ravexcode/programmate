export default function AuthForm(props: any){
  return (
    <form
    className="flex flex-col justify-start items-center px-6 py-3 text-text max-w-[95dvw] w-120 z-2 animate-fade-in-up overflow-hidden"
    onSubmit={props.onSubmit}
    ref={props.ref}>

      <a
      href="/"
      className="hover:brightness-80 duration-200">
        <img
        src="/logos/white.svg"
        alt="Prismaflow Icon made by RavexCode"
        className="aspect-square w-10"/>
      </a>

      <h2
      className="text-3xl">
        {props.title}
      </h2>

      <span className="h-5" />
      {props.children}

      <span className="h-10" />

      <button
      type="submit"
      className="w-full py-2 rounded-md bg-main cursor-pointer duration-300 hover:brightness-80 active:scale-95 disabled:hover:brightness-100 disabled:active:scale-100 disabled:cursor-wait disabled:grayscale"
      disabled={props.disponible ? true : false}>
        {props.sumbitText}
      </button>

      <p
      className="text-red-500 mb-2 mt-1">{props.message}</p>
    </form>
  )
}