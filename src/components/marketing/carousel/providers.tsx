import Image from "next/image";
import Link from "next/link";

interface IconProps {
  src: string;
  alt: string;
  url: string;
  className?: string;
}

export default function ProvCarousel() {
  const icons: IconProps[] = [
    { src: "/icons/github.svg", alt: "Github", className: "h-10", url: "https://github.com/" },
    { src: "/icons/google.svg", alt: "Google", className: "h-10", url: "https://google.com/" },
    { src: "/icons/gitlab.svg", alt: "Gitlab", className: "h-10", url: "https://gitlab.com/" },
    { src: "/icons/slack.svg", alt: "Slack", className: "h-10", url: "https://slack.com/" },
  ];

  const duplicatedIcons = [...icons, ...icons, ...icons, ...icons];

  return (
    <section className="w-full py-10 relative flex flex-col items-center timeline-view-y animate-zoom-in animate-range-[entry_0%_cover_30%]">
      <div 
        className="w-full max-w-400 overflow-hidden select-none"
        style={{
          maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)'
        }}
      >
        <div className="flex w-max gap-16 md:gap-24 inverted-carousel">
          {duplicatedIcons.map((icon, index) => (
            <Link 
              href={icon.url}
              key={`carousel-${icon.alt}-${index}`}
              className="flex items-center justify-center grayscale opacity-70 hover:opacity-100 transition-all duration-300"
            >
              <Image
                src={icon.src}
                alt={icon.alt}
                width={150}
                height={150}
                loading="lazy"
                className={`object-contain max-w-none w-auto ${icon.className ?? ''}`}
              />
            </Link>
          ))}
        </div>
      </div>

      <p className="text-sm font-medium text-zinc-400 uppercase tracking-widest mb-8 text-center antialiased mt-10">
        Using safe providers
      </p>
    </section>
  );
}