export interface RequestTemplateProps {
  username: string;
  link: string,
}

export function RequestTemplate(props : RequestTemplateProps){
  return (
    <div
    className="w-150 px-6 py-10 rounded-xl bg-neutral-900 text-text text-center">
      <h2
      className="font-semibold tracking-wide text-xl">
        You've been recivied an new Project Request!
      </h2>

      <p
      className="mt-5">
        Hello {props.username.toLowerCase()}, you've been recivied a new project request.
      </p>

      <p
      className="mt-2 mb-10">
        To accept it you only need to press the button in the bottom of this email, if you don't want to get in the project just ignore this email.
      </p>

      <a
      href={props.link}
      className="px-10 py-2 rounded-full bg-main text-xs duration-400 hover:bg-blue-900">
        Accept
      </a>
      
      <footer
      className="opacity-80 mt-10 text-sm font-light">
        Prismaflow - 2026
      </footer>
    </div>
  )
}