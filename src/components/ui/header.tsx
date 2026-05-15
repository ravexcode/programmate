//Next imports
import { getCookie } from "cookies-next/client";
import Link from "next/link";

//React imports
import { useState, useEffect } from "react";

function OptionsButton(props: any){
  return (
    <li>
      <Link
      href={props.link}
      className="px-8 py-2 cursor-pointer opacity-80 rounded-full duration-200 hover:bg-ultramarine-50/10 hover:opacity-100">
        {props.children}
      </Link>
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
    className="text-text flex justify-between items-center p-4 border-b border-ultramarine-50/30 text-sm sticky top-0 animate-slide-in-top z-10 backdrop-blur-xl bg-black/40 h-max">
      <Link href="/"
      className="duration-400 hover:brightness-150 relative">
        <img src="/logos/large.svg" alt="Logo large made by RavexCode"
        className="h-6"/>
      </Link>

      <ul
      className="hidden md:flex gap-2 justify-center items-center">
        <OptionsButton link="/about#features"> Product </OptionsButton>
        <OptionsButton link="/#pricing"> Pricing </OptionsButton>
        <OptionsButton link="/about#contact"> Contact </OptionsButton>
      </ul>
      
      <Link
      href={isSignedIn ? "/dashboard" : "/auth/register"}
      className="bg-main hover:bg-main/80 duration-400 py-2 px-6 text-center text-sm tracking-wide rounded-full">
        {isSignedIn ? "Dashboard" : "Get started"}
      </Link>
    </header>
  )
}