interface IconProps {
  src: string;
  alt: string;
  className: string;
}

export default function IconCarousel() {
  const icons: IconProps[] = [
    { src: "/icons/supabase.svg", alt: "Supabase", className: "h-10 opacity-70 hover:opacity-100 transition-opacity" },
    { src: "/icons/stripe.svg", alt: "Stripe", className: "h-8 opacity-70 hover:opacity-100 transition-opacity" },
    { src: "/icons/nextjs.svg", alt: "Next.js", className: "h-8 opacity-70 hover:opacity-100 transition-opacity" },
  ];

  return (
    <section className="mt-20 w-full py-10 relative flex flex-col items-center timeline-view-y animate-zoom-in animate-range-[entry_0%_cover_30%]">
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
        <div className="flex w-max gap-16 md:gap-24 animate-[carousel_20s_linear_infinite]">
          {[...icons, ...icons, ...icons].map((icon, index) => (
            <div key={index} className="flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300">
              <img
                src={icon.src}
                alt={icon.alt}
                className={`object-contain ${icon.className}`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}