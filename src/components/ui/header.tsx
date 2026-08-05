//Next imports
import Link from "next/link";
import Image from "next/image";

//Services imports
import { getSessionStr } from "@/services/session.service";

//React imports
import { useState, useSyncExternalStore } from "react";

//Icons imports
import { IconMenu2, IconX } from "@tabler/icons-react";

function subscribeSigned(callback: () => void) {
  window.addEventListener("signin-change", callback);
  return () => window.removeEventListener("signin-change", callback);
}

function getSignedSnapshot() {
  return Boolean(getSessionStr());
}

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
  const [ menuOpen, setMenuOpen ] = useState(false);
  const signed = useSyncExternalStore(
    subscribeSigned,
    getSignedSnapshot,
    () => false
  );

  const mobileLinks = [
    { href: "/product", label: "Product" },
    { href: "/pricing", label: "Pricing" },
    { href: "/product#contact", label: "Contact" },
  ];

  return (
    <header
    className="relative text-zinc-50 flex justify-between items-center p-4 border-b border-neutral-800 text-sm sticky top-0 animate-slide-in-top z-10 backdrop-blur-xl bg-black/40 h-max">
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

      <div
      className="flex items-center gap-2">
        <Link
        href={signed ? "/dashboard" : "/auth/signup"}
        className="bg-main hover:bg-main/80 duration-400 py-2 w-30 text-center text-sm tracking-wide rounded-md">
          {signed ? "Dashboard" : "Get started"}
        </Link>

        <button
        type="button"
        aria-label="Toggle navigation menu"
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((value) => !value)}
        className="md:hidden flex items-center justify-center w-10 h-9 rounded-md duration-200 hover:bg-zinc-50/10 cursor-pointer">
          {
            menuOpen ? <IconX size={22} /> : <IconMenu2 size={22} />
          }
        </button>
      </div>

      {
        menuOpen && (
          <nav
          className="absolute top-full inset-x-0 md:hidden bg-neutral-950/95 backdrop-blur-xl border-b border-neutral-800 px-4 py-4 flex flex-col gap-1 animate-slide-in-top">
            {
              mobileLinks.map((link) => (
                <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-sm px-3 py-2 text-sm duration-200 hover:bg-zinc-50/10">
                  {link.label}
                </Link>
              ))
            }
          </nav>
        )
      }
    </header>
  )
}