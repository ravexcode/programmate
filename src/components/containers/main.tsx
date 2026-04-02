function ListItem(props: any) {
  return (
    <li>
      <a
      href={props.link}
      className="duration-100 hover:text-amethyst-300">
        {props.children}
      </a>
    </li>
  )
}

export default function MainContainer(props: any) {
  return (
    <div
    className="min-h-dvh grid grid-rows-[auto_1fr_auto] bg-background">
      <header
      className="flex p-4 justify-between items-center bg-black/20 backdrop-blur sticky top-0 z-5 show-element-top">
        <img src="/logos/large.svg" alt="PrismaFlow® Logo"
        className="w-30 duration-200 hover:brightness-80 cursor-pointer"
        onClick={() => {
          window.location.href = "/"
        }}/>

        <a
        href="/download"
        className="bg-primary px-4 py-2 rounded-full text-text cursor-pointer duration-200 hover:scale-105 shadow-lg hover:shadow-primary/30 hover:brightness-120 text-sm">
          Descargar
        </a>
      </header>

      {props.children}

      <footer
      className="bg-background-dark text-text text-center flex flex-col justify-center items-center p-4 z-2">
        <h2 
        className="font-semibold text-lg mb-3">
          PrismaFlow® - 2026
        </h2>

        <div className="flex md:flex-row flex-col justify-center items-center md:items-start gap-5 md:gap-20 w-full mb-3">

          <ul
          className="flex flex-col justify-center items-center md:items-start">
            <h3
            className="text-amethyst-400 font-semibold">
              About
            </h3>
            <ListItem link="/about"> More info </ListItem>
            <ListItem link="/about#prices"> Prices </ListItem>
            <ListItem link="/about#contact"> Contact us </ListItem>
            <ListItem link="/Blog"> Blog </ListItem>
          </ul>

          <ul
          className="flex flex-col justify-center items-center md:items-start">
            <h3
            className="text-amethyst-400 font-semibold">
              Developers
            </h3>
            <ListItem link="/devs"> More info </ListItem>
            <ListItem link="/devs#techs"> Technologies </ListItem>
            <ListItem link="/devs/docs"> Documentation </ListItem>
          </ul>
          
          <ul
          className="flex flex-col justify-center items-center md:items-start">
            <h3
            className="text-amethyst-400 font-semibold">
              Application
            </h3>
            <ListItem link="/app"> More info </ListItem>
            <ListItem link="/app#download"> Download </ListItem>
          </ul>
          
          <ul
          className="flex flex-col justify-center items-center md:items-start">
            <h3
            className="text-amethyst-400 font-semibold">
              Asistency
            </h3>
            <ListItem link="/asistency"> Asistency </ListItem>
            <ListItem link="/asistency/bugs/report"> Report an error </ListItem>
            <ListItem link="/asistency/bugs"> Bugs reports </ListItem>
            <ListItem link="/asistency/suggestions"> Make a suggestion </ListItem>
          </ul>
          
          <ul
          className="flex flex-col justify-center items-center md:items-start">
            <h3
            className="text-amethyst-400 font-semibold">
              Social media
            </h3>
            <ListItem link="https://youtube.com/@prismaflow"> Youtube </ListItem>
            <ListItem link="https://facebook.com/prismaflow"> Facebook </ListItem>
            <ListItem link="https://reddi.com/prismaflow"> Reddit </ListItem>
            <ListItem link="https://x.com/prismaflow"> X </ListItem>
          </ul>

        </div>

        <p
        className="w-full text-center">
          Icons made by <a
          href="https://home.streamlinehq.com/"
          className="text-amethyst-400 duration-300 hover:underline hover:brightness-120">
            StreamlineHQ
          </a>
        </p>

        <p
        className="w-full text-center">
          Powered by <a
          href="https://github.com/rdev00"
          className="text-amethyst-400 duration-300 hover:underline hover:brightness-120">
            RavexCode
          </a>
        </p>
      </footer>
    </div>
  )
}