"use client";

//Imports de componentes de UI
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
//Imports de containers
import MainContainer from "@/components/containers/main";
import SectionContainer from "@/components/containers/section";

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
        <p className="pt-2 max-w-150 text-center z-10 opacity-70">Mejora tu eficiencia de desarollo con nuestras herramientas pensadas y hechas a la medida para mejorar tu optimización.</p>

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

          <section className="flex flex-col md:flex-row justify-center items-center w-full">
            <div className="flex flex-col justify-start items-start">
              <h3></h3>
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </MainContainer>
  );
}