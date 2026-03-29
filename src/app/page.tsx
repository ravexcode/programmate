"use client";

//Imports de funciones
import { useState, useRef, Ref, useEffect } from "react";

//Imports de componentes de UI
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
//Imports de containers
import MainContainer from "@/components/containers/main";
import SectionContainer from "@/components/containers/section";

//Página principal
export default function Home() {
  //Estado de Q activo
  const [activeQ, setActiveQ] = useState(1);

  //Información de las Q
  const roadmapData = [
    {
      id: 1,
      title: "Q1: Planteamiento",
      desc: "Esta fase está enfocada en administrar cómo se desarrollará la app, las funciones que tendrá, su principal atractivo y cuál será el público objetivo... ¿Qué hace mi app especial? o ¿Qué distingue mi app de las otras?",
    },
    {
      id: 2,
      title: "Q2: Diseño",
      desc: "Los puntos a alcanzar dentro de esta fase es tener un diseño de logos, de la aplicación, de la página web y hasta estructura completa... enfocándonos en darle una identidad a nuestra aplicación.",
    },
    {
      id: 3,
      title: "Q3: Configuración de proyecto",
      desc: "Esta fase busca crear cosas esenciales como el repositorio, las bases para iniciar una beta que por lo menos sea entendible y empezar a usar los bocetos como base.",
    },
    {
      id: 4,
      title: "Q4: BetaTesting",
      desc: "Se enfoca en obtener reseñas, tanto positivas como negativas, identificando las funcionales de las inválidas. Estas se atienden con actualizaciones.",
    },
    {
      id: 5,
      title: "Q5: Lanzamiento oficial",
      desc: "Si se llega a esta fase indica que nuestro proyecto ha funcionado y ha llegado al público que buscábamos, o en su defecto tiene el uso esperado dentro del planteamiento.",
    },
    {
      id: 6,
      title: "Q6: Mantenimiento",
      desc: "Nos enfocamos en seguir las sugerencias de nuestra comunidad, actualizar la aplicación con arreglo de errores, mejoras de código o cambios de diseño para perfeccionar la app.",
    },
  ];

  //Elemento a mostrar
  const roadmapElement : Ref<HTMLElement> = useRef(null);

  useEffect(() => {
    const current = roadmapElement.current;
    if (!current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          current.classList.remove("opacity-0");
          current.classList.add("show-element");
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(current);

    return () => observer.disconnect();
  }, []);

  return (
    <MainContainer>
      <Header />

      <main className="flex flex-col justify-start items-center gap-7 px-2 pt-5 pb-10 w-full h-full">
        
        <section
        className="relative w-full max-w-[80dvw] min-h-50 flex flex-col justify-center items-center bg-cover bg-center bg-norepeat py-4 px-4 gap-3 show-element">

          <img src="/images/background_1.jpg" alt="PrismaFlow® Background" className="object-cover w-full h-full absolute z-1 brightness-60 rounded-lg" />

          <h1 
          className="max-w-180 text-center text-xl md:text-3xl z-2">
            La <span className="text-resalted">herramienta</span> para desarolladores hecha para desarolladores
          </h1>

          <a href="/about/startup"
          className="bg-button px-4 py-1 rounded-md duration-200 hover:brightness-80 hover:scale-105 z-2 shadow-lg shadow-button/30">
            Ver startup
          </a>

        </section>

        <SectionContainer title="¿Qué es PrismaFlow®?">
          <p><span className="text-resalted">PrismaFlow®</span> es una aplicación diseñada para optimizar y elevar la eficiencia en cualquier proyecto de desarrollo, ya sea que estés trabajando en sitios web basados en WordPress, aplicaciones web personalizadas o soluciones profesionales de mayor escala. Su enfoque integral permite a equipos y desarrolladores gestionar flujos de trabajo, automatizar tareas repetitivas y mantener un control claro del progreso, lo que se traduce en entregas más rápidas, menos errores y una mejor colaboración entre los miembros del equipo. Ideal tanto para freelancers como para empresas, <span className="text-resalted">PrismaFlow®</span> se adapta a tus necesidades específicas sin sacrificar simplicidad ni potencia.</p>
          <a href="/about" className="bg-button px-4 py-1 rounded-md duration-200 hover:brightness-80 hover:scale-105 z-2 shadow-lg shadow-button/30 mx-auto my-2">Explorar ahora</a>
        </SectionContainer>

        {/*Roadmap section*/}
        <section ref={roadmapElement} className="flex flex-col justify-center items-center w-full px-4 gap-8 opacity-0">
      
          {/* Título */}
          <h2 className="text-3xl bg-radial from-gradient-center via-gradient-borders to-gradient-borders font-bold bg-center bg-clip-text bg-size-[200%] text-black/0">Nuestro Roadmap</h2>

          {/* Contenedor del Roadmap */}
          <section className="flex flex-col lg:flex-row justify-center items-stretch gap-4 w-full max-w-6xl">
            {roadmapData.map((item) => {
              const isActive = activeQ === item.id;

              return (
                <article
                  key={item.id}
                  onClick={() => setActiveQ(item.id)}
                  className={`
                    group cursor-pointer rounded-xl overflow-hidden border border-white/10 transition-all duration-500 ease-in-out
                    ${isActive ? "md:flex-[2] bg-plum-section shadow-lg shadow-plum-section/20" : "md:flex-[1] bg-plum-section/40 hover:bg-plum-section/70"}
                  `}
                >
                  <div className="p-5 h-full flex flex-col justify-start">
                    {/* Cabecera de la tarjeta */}
                    <h3 
                      className={`font-bold transition-colors duration-300 ${isActive ? "text-resalted text-xl" : "text-gray-400 text-lg group-hover:text-gray-200 whitespace-nowrap md:truncate"}`}
                    >
                      {item.title}
                    </h3>

                    {/* Contenido expandible usando Grid para animar la altura (Height transition) */}
                    <div 
                      className={`grid transition-all duration-500 ease-in-out ${isActive ? "grid-rows-[1fr] opacity-100 mt-4" : "grid-rows-[0fr] opacity-0 mt-0"}`}
                    >
                      <div className="overflow-hidden">
                        <p className="text-gray-300 text-sm leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        </section>
      </main>

      <Footer />
    </MainContainer>
  );
}
