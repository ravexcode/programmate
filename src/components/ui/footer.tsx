// Next imports
import Link from "next/link";
import Image from "next/image";

function CustomLi({ link, children }: { link: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={link}
        prefetch={false}
        className="text-sm md:text-base tracking-wide text-gray-400 duration-200 hover:text-blue-500">
        {children}
      </Link>
    </li>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-start">
      <h3 className="mb-4 text-lg font-medium tracking-widest text-white">
        {title}
      </h3>
      <ul className="flex flex-col gap-3">
        {children}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="relative bg-black text-white z-50 h-max">
      <div className="mx-auto px-6 lg:px-8 py-10">
        
        <div className="flex flex-col gap-12 xl:flex-row xl:justify-between">
          
          <div className="flex flex-col items-start">
            <Link href="/" prefetch={false} className="hover:opacity-80 transition-opacity">
              <Image
                src="/logos/white_gradient.svg"
                alt="NexZero logo"
                width={40}
                height={40}
                className="mb-4 aspect-square w-10"
                preload
                loading="eager"
              />
            </Link>
            <p className="max-w-xs text-gray-400 tracking-wider">
              Building your workflow with a single App
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:grid-cols-5 xl:mt-0 w-full xl:w-auto">
            <FooterColumn title="About">
              <CustomLi link="/product">More info</CustomLi>
              <CustomLi link="/">Home</CustomLi>
              <CustomLi link="/#pricing">Pricing</CustomLi>
            </FooterColumn>

            <FooterColumn title="Insiders">
              <CustomLi link="/insiders">More info</CustomLi>
              <CustomLi link="/insiders#arch">Architecture</CustomLi>
              <CustomLi link="/insiders#techs">Technologies</CustomLi>
              <CustomLi link="/insiders#lnt">Libraries</CustomLi>
            </FooterColumn>

            <FooterColumn title="Social media">
              <CustomLi link="/">Youtube</CustomLi>
              <CustomLi link="/">X (Twitter)</CustomLi>
              <CustomLi link="/">Reddit</CustomLi>
              <CustomLi link="/">Facebook</CustomLi>
            </FooterColumn>

            <FooterColumn title="Support">
              <CustomLi link="/support/bugs"> Report a bug </CustomLi>
              <CustomLi link="/support/suggestions"> Make a sugestion </CustomLi>
              <CustomLi link="/support/tickets"> Request a ticket </CustomLi>
            </FooterColumn>

            <FooterColumn title="Legal">
              <CustomLi link="/legal/tos">Terms of service</CustomLi>
              <CustomLi link="/legal/privacy">Privacy policy</CustomLi>
              <CustomLi link="/legal/license">License</CustomLi>
            </FooterColumn>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between border-t border-gray-800 pt-8 sm:flex-row gap-4">
          <p className="text-sm tracking-widest text-gray-500">
            © 2026 NexZero.
          </p>
          <p className="text-sm tracking-widest text-gray-500">
            Powered by{" "}
            <Link
              href="https://github.com/RDev00"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 duration-200 hover:text-blue-400 font-medium">
              RavexCode
            </Link>
          </p>
        </div>
        
      </div>
    </footer>
  );
}