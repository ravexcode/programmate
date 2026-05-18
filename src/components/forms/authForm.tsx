export default function AuthForm(props: any){
  return (
    <form
    className="flex flex-col justify-start items-center px-6 py-3 max-w-120 text-text w-full z-2 animate-fade-in-up overflow-hidden"
    onSubmit={props.onSubmit}
    ref={props.ref}>
      <h2
      className="text-3xl font-medium tracking-wider">
        {props.title}
      </h2>

      <span className="h-5" />
      {props.children}

      <span className="h-10" />

      <button
      type="submit"
      className="w-full py-2 rounded-full tracking-wider font-medium text-lg bg-main cursor-pointer duration-300 hover:brightness-120 hover:-translate-y-0.5 disabled:hover:translate-y-0 active:scale-95 disabled:hover:brightness-100 disabled:active:scale-100 disabled:cursor-wait disabled:grayscale"
      disabled={props.disponible ? true : false}>
        {props.sumbitText}
      </button>

      <p
      className="text-red-500 mb-2 mt-1">{props.message}</p>
    </form>
  )
}