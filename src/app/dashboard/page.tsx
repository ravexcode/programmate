//Client
"use client";

//React imports
import { useEffect, useState } from "react";

//Components imports
import SideBar from "@/components/containers/sidebar";
import { getCookie } from "cookies-next";
import { deleteCookie } from "cookies-next/client";

// 1. Tipado fuerte: Evitamos usar 'any' para un código más profesional y seguro.
interface ProjectCardProps {
  title: string;
  description: string;
}

export function ProjectCard({ title, description }: ProjectCardProps) {
  return (
    <article 
      className="group relative w-full max-w-sm flex flex-col rounded-xl border border-ultramarine-50/10 bg-ultramarine-900/40 p-5 shadow-lg backdrop-blur-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:border-ultramarine-50/30 hover:bg-ultramarine-900/60 hover:shadow-xl hover:shadow-ultramarine-800/40 cursor-pointer"
    >
      <header className="flex items-start justify-between mb-3">
        {/* 2. Tipografía: tracking-tight le da un toque moderno y line-clamp evita que un título largo rompa el diseño */}
        <h3 className="text-lg font-semibold text-white tracking-tight line-clamp-1">
          {title}
        </h3>
        
        {/* 3. Botón: Área de clic más grande (h-8 w-8) pero visualmente sutil, usando un icono SVG real */}
        <button 
          aria-label="Opciones del proyecto"
          className="flex h-8 w-8 -mr-2 -mt-2 items-center justify-center rounded-full text-ultramarine-200 transition-colors hover:bg-ultramarine-50/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-ultramarine-400"
          onClick={(e) => e.stopPropagation()} // Evita que el clic en el botón active el clic de la tarjeta
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="1"></circle>
            <circle cx="12" cy="5" r="1"></circle>
            <circle cx="12" cy="19" r="1"></circle>
          </svg>
        </button>
      </header>

      {/* 4. Descripción: leading-relaxed mejora la lectura y line-clamp-3 mantiene todas las tarjetas del mismo tamaño */}
      <p className="text-sm text-ultramarine-100/70 line-clamp-3 leading-relaxed">
        {description}
      </p>
      
      {/* Elemento decorativo opcional: Un brillo sutil que aparece al hacer hover */}
      <div className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-br from-ultramarine-400/0 via-ultramarine-400/0 to-ultramarine-400/0 transition-colors duration-500 group-hover:from-ultramarine-400/5"></div>
    </article>
  )
}

export default function Dashboard(){
  //User's data
  const [ user, setUser ] = useState({
    email: "",
    name: ""
  });

  //Function to update user's data
  const updateUserData = async(token: any) => {
    //Fetch to user api
    const res = await fetch(`/api/users/me/${token}`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        "x-api-key": process.env.NEXT_PUBLIC_API_KEY || "",
      }
    });

    //Gets the user data
    const data = await res.json();
    
    //Verifies if status is OK
    if(res.status === 200) {
      const identity = data.user.identities[0];

      setUser({
        "email": identity.email,
        "name": identity.identity_data.name,
      });
      return;
    }

    window.location.href = "/auth/login";
  }

  useEffect(() => {
    const token = getCookie("token");
    if(!token) return;
    updateUserData(token);
  }, []);

  return (
    <div className="min-h-screen bg-background grid grid-cols-[auto_1fr] overflow-hidden text-text">
      <SideBar email={user.email || "Loading..."} />

      <main className="relative flex flex-col h-screen overflow-y-auto px-4 py-8 md:px-8 md:py-10">
        
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          <div className="absolute left-1/2 top-0 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-main/10 blur-[100px] animate-pulse" />
        </div>

        <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col gap-10">
          
          <header className="flex flex-col gap-2">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
              Welcome back{user.name ? ", " + user.name : ""}!
            </h2>
            <p className="text-text/70 text-sm md:text-base">
              There are your recent projects
            </p>
          </header>
          
          <section className="flex flex-col gap-6">
            
            <div className="flex w-full items-center justify-between">
              <h3 className="text-xl font-semibold tracking-tight text-white/90">
                Projects
              </h3>

              <button className="flex items-center gap-2 bg-main px-4 py-2 text-sm font-medium text-white rounded-lg transition-all duration-300 hover:bg-main/80 focus:outline-none focus:ring-2 focus:ring-main/50 focus:ring-offset-2 focus:ring-offset-background active:scale-95 cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Create new
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <ProjectCard
                title="Prismaflow"
                description="Ejemplo de proyecto base para evaluar el diseño."
              />
              <ProjectCard
                title="Prismaflow"
                description="Ejemplo de proyecto base para evaluar el diseño."
              />
              <ProjectCard
                title="Prismaflow"
                description="Ejemplo de proyecto base para evaluar el diseño."
              />
              <ProjectCard
                title="Prismaflow"
                description="Ejemplo de proyecto base para evaluar el diseño."
              />
              <ProjectCard
                title="Prismaflow"
                description="Ejemplo de proyecto base para evaluar el diseño."
              />
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}