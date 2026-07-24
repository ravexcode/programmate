//Next imports
import Link from "next/link";
import Image from "next/image";

//Services imports
import { getSessionStr } from "@/services/session.service";

//React imports
import { useEffect, useState } from "react";

function OptionsButton(props: {
  link: string,
  children: React.ReactNode
}){
  return (
    <li
    className="w-25 h-8 cursor-pointer rounded-sm duration-200 hover:bg-zinc-50/10 text-center">
      <Link
      href={props.link}
      className="w-full h-full flex items-center justify-center">
        {props.children}
      </Link>
    </li>
  )
}

export default function Header(){
  const [ signed, setSigned ] = useState<boolean>();

  useEffect(() => {
    const token = getSessionStr();
    setSigned(token ? true : false);
  }, []);

  return (
    <header
    className="text-zinc-50 flex justify-between items-center p-4 border-b border-neutral-800 text-sm sticky top-0 animate-slide-in-top z-10 backdrop-blur-xl bg-black/40 h-max">
      <Link href="/"
      className="duration-400 hover:brightness-150 relative">
        <Image src="/logos/large.svg" alt="Logo large made by RavexCode"
        width={100}
        height={24}
        className="h-6"/>
      </Link>

      <ul
      className="hidden md:flex gap-2 justify-center items-center">
        <OptionsButton link="/product"> Product </OptionsButton>
        <OptionsButton link="/pricing"> Pricing </OptionsButton>
        <OptionsButton link="/product#contact"> Contact </OptionsButton>
      </ul>
      
      <Link
      href={signed ? "/dashboard" : "/auth/signup"}
      className="bg-main hover:bg-main/80 duration-400 py-2 w-30 text-center text-sm tracking-wide rounded-md">
        {signed ? "Dashboard" : "Get started"}
      </Link>
    </header>
  )
}