import Image from 'next/image';

interface IconProps {
  src: string;
  alt: string;
  className: string;
  width: number;
}

export default function IconCarousel() {
  const icons: IconProps[] = [
    { src: "/icons/supabase.svg", alt: "Supabase icon made by RavexCode", className: "h-10 w-auto", width: 150 },
    { src: "/icons/stripe.svg", alt: "Stripe icon made by RavexCode", className: "h-8 w-auto", width: 120 },
    { src: "/icons/redis.svg", alt: "Redis icon made by RavexCode", className: "h-10 w-auto", width: 150 },
    { src: "/icons/nextjs.svg", alt: "Nextjs icon made by RavexCode", className: "h-8 w-auto", width: 120 },
  ];

  return (
    <section className="mt-20 bg-background z-2 w-full py-5 overflow-hidden animate-blurred-fade-in block">
  
      <div className="w-full overflow-hidden">
        
        <div className="flex w-max gap-15 carousel">
          {[...icons, ...icons].map((icon, index) => (
            <Image
              key={index}
              src={icon.src}
              alt={icon.alt}
              width={icon.width}
              height={100}
              className={`object-contain ${icon.className}`}
              priority
            />
          ))}
        </div>

      </div>
    </section>
  );
};