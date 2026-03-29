"use client";

//Imports de componentes de UI
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
//Imports de containers
import MainContainer from "@/components/containers/main";

export default function StartUpPage() {
  return (
    <MainContainer>
      <Header />

      <main className="flex flex-col justify-start items-center px-4 pt-6 pb-15 relative">
        {/*Circulos gradientes*/}
        <div className="absolute w-100 h-100 rounded-full blur-3xl bg-radial-[at_30%_30%] from-gradient-borders to-gradient-center z-1 -translate-x-50 -translate-y-10 opacity-20"></div>
        <div className="absolute w-100 h-100 rounded-full blur-3xl bg-radial-[at_30%_30%] from-gradient-borders to-gradient-center z-1 -translate-x-20 translate-y-20 opacity-20"></div>
        <div className="absolute w-100 h-100 rounded-full blur-3xl bg-radial-[at_30%_30%] from-gradient-borders to-gradient-center z-1 translate-x-40 opacity-20 hidden md:block"></div>
        <div className="absolute w-100 h-100 rounded-full blur-3xl bg-radial-[at_30%_30%] from-gradient-borders to-gradient-center z-1 translate-x-20 translate-y-40 opacity-20 hidden md:block"></div>

        <h2 className="text-4xl text-center font-medium max-w-[800px] tracking-wide text-white">
          Desarrolla tus aplicaciones con mayor facilidad <br />
            <span className="relative inline-block px-3 py-1 font-semibold text-white">

            <span className="absolute inset-0 rounded-sm bg-gradient-to-r from-button to-resalted opacity-80 translate-y-1"></span>

            <span className="relative z-10">
              y eficiencia
            </span>

          </span>
        </h2>
        <p className="pt-2 max-w-150 text-center z-10 opacity-70">Mejora tu eficiencia de desarollo con nuestras herramientas pensadas y hechas a la medida para mejorar tu optimización de tu proyecto.</p>

        <div className="flex gap-5 justify-center items-center w-full py-5 z-8">
          <a href="/download"
          className="bg-button px-3 py-1 rounded-full border-2 border-button duration-150 hover:brightness-120 hover:scale-105 shadow-lg shadow-button/10 hover:shadow-button/30 text-center">
            Empieza a crear
          </a>
          <a href="/"
          className="px-3 py-1 rounded-full border-2 border-resalted duration-150 hover:brightness-120 hover:scale-105 shadow-lg shadow-resalted/10 hover:shadow-resalted/30 text-center">
            Regresar al inicio
          </a>
        </div>

          <span className="h-10"></span>
        
        <div className="w-full flex flex-col justify-center items-center z-2 gap-5">

          <h2 className="text-3xl font-bold">Beneficios</h2>

          <section className="flex flex-col md:flex-row justify-center items-center md:items-start w-full gap-10 flex-wrap">

            <div className="flex flex-col justify-start items-start bg-plum-section p-3 rounded-md min-h-40 w-80 gap-1 border border-l-5 border-l-resalted border-resalted/50 shadow-lg duration-300 hover:shadow-button/30 hover:scale-105 hover:brightness-110">
              <div className="flex gap-2">
                <img src="\icons\easy-to-use.svg" alt="Credits to streamlinehq.com"
                className="invert aspect-square w-5" />
                <h3 className="text-lg font-medium">Uso fácil</h3>
              </div>
              <p className="text-sm opacity-90">Nuestras herramientas funcionan para cualquier tipo de usuario, desde los más experimentados, hasta los que van aprendiendo.</p>
            </div>

            <div className="flex flex-col justify-start items-start bg-plum-section p-3 rounded-md min-h-40 w-80 gap-1 border border-l-5 border-l-resalted border-resalted/50 shadow-lg duration-300 hover:shadow-button/30 hover:scale-105 hover:brightness-110">
              <div className="flex gap-2">
                <img src="\icons\flow.svg" alt="Credits to streamlinehq.com"
                className="invert aspect-square w-5" />
                <h3 className="text-lg font-medium">Mejor flujo de trabajo</h3>
              </div>
              <p className="text-sm opacity-90">Las herramientas que ofrecemos son útiles y completamente necesarias dentro del equipo de trabajo, optimizan el planteamiento de problema y ayudan a resolver problemas desde el minuto uno.</p>
            </div>

            <div className="flex flex-col justify-start items-start bg-plum-section p-3 rounded-md min-h-40 w-80 gap-1 border border-l-5 border-l-resalted border-resalted/50 shadow-lg duration-300 hover:shadow-button/30 hover:scale-105 hover:brightness-110">
              <div className="flex gap-2">
                <img src="\icons\price.svg" alt="Credits to streamlinehq.com"
                className="invert aspect-square w-5" />
                <h3 className="text-lg font-medium">Precios Accesibles</h3>
              </div>
              <p className="text-sm opacity-80">Nuestras herramientas funcionan para cualquier tipo de usuario, desde los más experimentados, hasta los que van aprendiendo.</p>
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </MainContainer>
  );
}