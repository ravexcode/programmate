//Next imports
import Link from "next/link";

//Hooks imports
import { useGetToken } from "@/hooks/useCookies";

//React imports
import { useState, useEffect } from "react";

function OptionsButton(props: {
  link: string,
  children: React.ReactNode
}){
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

export default function Header(){
  const [ isSignedIn, setIsSignedIn ] = useState(false);

  useEffect(() => {
    const token = useGetToken();

    if(token) {
      setIsSignedIn(true);
      return;
    }

    return;
  }, [])

  return (
    <header
    className="text-zinc-50 flex justify-between items-center p-4 border-b border-neutral-800 text-sm sticky top-0 animate-slide-in-top z-10 backdrop-blur-xl bg-black/40 h-max">
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
      className="bg-main hover:bg-main/80 duration-400 py-2 w-30 text-center text-sm tracking-wide rounded-md">
        {isSignedIn ? "Dashboard" : "Get started"}
      </Link>
    </header>
  )
}