import { getCookie } from "cookies-next/client";

import { useState, useEffect } from "react";

function OptionsButton(props: any){
  return (
    <li>
      <a href={props.link}
       className="px-4 py-1 cursor-pointer opacity-80 rounded-md duration-200 hover:bg-ultramarine-50/10 hover:opacity-100">
        {props.children}
      </a>
    </li>
  )
}

export default function Header(props: any){
  const [ isSignedIn, setIsSignedIn ] = useState(false);

  useEffect(() => {
    const token = getCookie("token");

    if(token) {
      setIsSignedIn(true);
      return;
    }

    return;
  }, [])

  return (
    <header
    className="text-text flex justify-between items-center p-4 border-b border-ultramarine-50/30 text-sm sticky top-0 animate-slide-in-top z-10 backdrop-blur bg-black/40">
      <a href="/"
      className="duration-400 hover:brightness-150">
        <img src="/logos/large.svg" alt="Logo large made by RavexCode"
        className="h-6"/>
      </a>

      <ul
      className="hidden md:flex gap-5 justify-center items-center">
        <OptionsButton link="/about"> Product </OptionsButton>
        <OptionsButton link="/#pricing"> Pricing </OptionsButton>
        <OptionsButton link="/about#contact"> Contact </OptionsButton>
      </ul>

      <div className="min-w-30 flex justify-start items-center">
        { props.isAuthForm ? null :
          !isSignedIn ? (
            <div className="flex gap-5 justify-center items-center text-xs md:text-sm">
              <a
              href="/auth/register"
              className="px-4 py-1 cursor-pointer rounded-md border border-ultramarine-50/30 duration-300 hover:bg-ultramarine-50/20">
                Sign up
              </a>
              <a
              href="/auth/login"
              className="px-4 py-1 cursor-pointer rounded-md duration-300 bg-main hover:brightness-150">
                Log in
              </a>
            </div>
          ) : (
            <a
            href="/dashboard"
            className="px-4 py-1 cursor-pointer rounded-md duration-300 bg-main hover:brightness-150">
              Dashboard
            </a>
          )
}
      </div>
    </header>
  )
}