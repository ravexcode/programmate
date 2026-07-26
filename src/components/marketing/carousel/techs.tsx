import Link from "next/link";

interface IconProps {
  src: string;
  alt: string;
  url: string;
  className?: string;
}

export default function TechCarousel() {
  const icons: IconProps[] = [
    { src: "/icons/supabase.svg", alt: "Supabase", className: "h-10", url: "https://supabase.com/" },
    { src: "/icons/stripe.svg", alt: "Stripe", className: "h-8", url: "https://stripe.com/" },
    { src: "/icons/nextjs.svg", alt: "Next.js", className: "h-8", url: "https://nextjs.org/" },
    { src: "/icons/resend.svg", alt: "Resend", className: "h-8", url: "https://resend.com/" },
    { src: "/icons/reactflow.svg", alt: "React flow", className: "h-10", url: "https://reactflow.dev/" },
  ];

  const duplicatedIcons = [...icons, ...icons, ...icons, ...icons];

  return (
    <section className="mt-20 w-full py-10 relative flex flex-col items-center timeline-view-y animate-zoom-in animate-range-[entry_0%_cover_30%]">
      <p className="text-sm font-medium text-zinc-400 uppercase tracking-widest mb-8 text-center antialiased">
        Powered by the best technologies
      </p>
      
      <div 
        className="w-full max-w-400 overflow-hidden select-none"
        style={{
          maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)'
        }}
      >
        <div className="flex w-max gap-16 md:gap-24 carousel">
          {duplicatedIcons.map((icon, index) => (
            <Link 
              href={icon.url}
              key={`carousel-${icon.alt}-${index}`}
              className="flex items-center justify-center grayscale opacity-70 hover:opacity-100 transition-all duration-300"
            >
              <img
                src={icon.src}
                alt={icon.alt}
                loading="lazy"
                className={`object-contain min-w-max max-w-none w-auto ${icon.className ?? ''}`}
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}