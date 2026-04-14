//Client page
"use client";

//Prebuilt components
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import SideBar from "@/components/containers/sidebar";

//React imports
import { useState, useEffect } from "react";
import { deleteCookie } from "cookies-next";

export default function ConfigurationPage(){
  const [ user, setUserData ] = useState({
    email: String,
    username: String,
  })

  return (
    <div
    className="grid grid-cols-[auto_1fr] bg-background relative animate-fade-in min-h-screen text-text">
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-main/10 blur-[100px] animate-pulse" />
      </div>

      <SideBar
      email="me@email.com"/>

      <section
      className="w-full flex flex-col justify-start items-center px-4 py-2 gap-2">
        <h2
        className="text-3xl font-semibold py-4 px-4 w-full text-start">
          Configuration
        </h2>

        <article
        className="w-[70%] py-3 rounded-lg flex justify-start items-center px-4 gap-5">
          <img
          src="/icons/buttons/profile.svg"
          alt="Icon made by RavexCode"
          className="aspect-square block w-10 "/>

          <div className="flex flex-col justify-start items-start">
            <p
            className="text-xl font-semibold"> Jhon Doe </p>
            <p
            className="text-sm font-light text-text/80"> me@email.com </p>
          </div>

          <button
          className="ml-auto cursor-pointer duration-200 hover:brightness-60"
          onClick={() => {
            deleteCookie("token");
            window.location.href = "/auth/login"
          }}>
            <img
            src="/icons/buttons/logout.svg"
            alt="Icon made by RavexCode"
            className="aspect-square block w-8"/>
          </button>
        </article>

      </section>
    </div>
  )
}