"use client";

//Imports de funciones
import { useRef, Ref, useEffect } from "react";
//Imports de componentes de UI
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
//Imports de containers
import MainContainer from "@/components/containers/main";
import SectionContainer from "@/components/containers/section";

export default function AboutPage() {
  //Elemento a mostrar
    const payments : Ref<HTMLElement> = useRef(null);
    const paymentsH : Ref<HTMLHeadingElement> = useRef(null);
  
    useEffect(() => {
      const currentHeader = paymentsH.current;
      const current = payments.current;
      if (!current || !currentHeader) return;
  
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            current.classList.remove("opacity-0");
            current.classList.add("show-element");
            
            currentHeader.classList.remove("opacity-0");
            currentHeader.classList.add("show-element");
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
      <main className="flex flex-col justify-start items-center px-4 pt-6 pb-15 gap-7">

        <h1 className="text-4xl bg-radial from-gradient-center via-gradient-borders to-gradient-borders font-bold bg-center bg-clip-text bg-size-[200%] text-transparent">
          Acerca de PrismaFlow
        </h1>

        <SectionContainer title="¿Porqué usar PrismaFlow?">
          <p><span className="text-resalted">PrismaFlow®</span> es una aplicación que no solo ofrece el clásico "todo en uno", en este proyecto nos importa la optimización del tuyo, ya sea con cosas básicas hasta con la organización de tu equipo o hasta de tus carpetas; junto a tu seguridad, lo cual es lo más importante, por lo que usamos buenas prácticas para guardar, y actualizar tus datos de manera segura hasta en casos de filtraciones</p>
        </SectionContainer>

        <SectionContainer title="Nuestro contacto" id="contacto">
          <p>Puedes contactarnos por nuestro correo <span className="text-resalted">contacto@prismaflow.dev</span> o puedes dejarnos una sugerencia en la sección de <a href="/help/sugerences" className="text-resalted underline">sugerencias</a>, y por último, en caso de tener un error también puedes <a href="/help/report" className="text-resalted underline">reportar un error</a>. Trataremos de darte la mayor prioridad posible, así que te pedimos de antemano paciencia.</p>
        </SectionContainer>

        <h2  className="text-3xl font-semibold text-resalted text-center w-full opacity-0" ref={paymentsH}>
          Nuestros planes <br />
          <p className="text-base font-normal text-zinc-100/70">Todos los pagos se hacen dentro de la aplicación</p>
        </h2>
        <section className="flex flex-wrap md:flex-row flex-col justify-center items-center gap-5 opacity-0" ref={payments}>
          <article
          className="flex flex-col justify-start items-start px-4 py-3 rounded-md bg-prices h-70 w-50 shadow-md shadow-prices/60">
            <h3 className="text-2xl flex flex-col pb-3 text-zinc-100 text-center font-bold w-full">
              $0
              <span className="text-base font-normal">Prueba</span>
            </h3>
            <ul>
              <li>✓ Flow diagram Tool</li>
              <li>✓ To Do List</li>
            </ul>
          </article>
          
          <article
          className="flex flex-col justify-start items-start px-4 py-3 rounded-md bg-prices h-80 gap-3 w-50 relative shadow-md shadow-prices/60">
            <label className="bg-resalted absolute rounded-sm p-1 text-sm shadow-lg shadow-resalted/20  -translate-x-5 -translate-y-7">Recomendado</label>
            <h3 className="text-2xl flex flex-col pb-3 text-zinc-100 text-center font-bold w-full">
              $4 USD
              <span className="text-base font-normal">Pro</span>
            </h3>
            <ul>
              <li>✓ Todo lo anterior</li>
              <li>✓ Proyectos ilimitados</li>
              <li>✓ ERD Tool</li>
            </ul>
          </article>
          
          <article
          className="flex flex-col justify-start items-start px-4 py-3 rounded-md bg-prices h-70 gap-3 w-50 shadow-md shadow-prices/60">
            <h3 className="text-2xl flex flex-col pb-3 text-zinc-100 text-center font-bold w-full">
              $10 USD
              <span className="text-base font-normal">Team</span>
            </h3>
            <ul>
              <li>✓ Todo lo anterior</li>
              <li>✓ Chat</li>
              <li>✓ Proyectos grupales</li>
            </ul>
          </article>
        </section>
      </main>
      <Footer />
    </MainContainer>
  )
}