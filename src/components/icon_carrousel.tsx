// components/IconCarousel.tsx
import Image from 'next/image';

interface IconProps {
  src: string;
  alt: string;
  className: string;
  width: number;
}

export default function IconCarousel() {
  const icons: IconProps[] = [
    { src: "/icons/supabase.svg", alt: "Supabase", className: "h-10 w-auto opacity-70 hover:opacity-100 transition-opacity", width: 150 },
    { src: "/icons/stripe.svg", alt: "Stripe", className: "h-8 w-auto opacity-70 hover:opacity-100 transition-opacity", width: 120 },
    { src: "/icons/redis.svg", alt: "Redis", className: "h-10 w-auto opacity-70 hover:opacity-100 transition-opacity", width: 150 },
    { src: "/icons/nextjs.svg", alt: "Next.js", className: "h-8 w-auto opacity-70 hover:opacity-100 transition-opacity", width: 120 },
  ];

  return (
    <section className="mt-20 w-full py-10 relative z-10 flex flex-col items-center timeline-[view(y)] animate-zoom-in animate-range-[entry_0%_cover_30%]">
      <p className="text-sm font-medium text-text/50 uppercase tracking-widest mb-8 text-center">
        Powered by the best technologies
      </p>
      
      {/* Máscara de gradiente para difuminar los bordes izquierdo y derecho */}
      <div 
        className="w-full max-w-5xl overflow-hidden"
        style={{
          maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)'
        }}
      >
        <div className="flex w-max gap-16 md:gap-24 animate-[carousel_20s_linear_infinite] hover:[animation-play-state:paused]">
          {[...icons, ...icons, ...icons].map((icon, index) => (
            <div key={index} className="flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300">
              <Image
                src={icon.src}
                alt={icon.alt}
                width={icon.width}
                height={40}
                className={`object-contain ${icon.className}`}
                priority={index < 4}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}