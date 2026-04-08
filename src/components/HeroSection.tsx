import { useEffect, useState } from "react";
import heroImg from "@/assets/skincare-hero.jpg";

const HeroSection = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-background">
      {/* Vertical text — left */}
      <div
        className={`absolute left-6 sm:left-10 top-1/2 -translate-y-1/2 z-20 transition-all duration-1000 ${loaded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6"}`}
      >
        <span
          className="font-display text-[10px] sm:text-xs tracking-[0.4em] uppercase text-taupe"
          style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
        >
          Байгалийн гоо сайхан
        </span>
      </div>

      {/* Vertical text — right */}
      <div
        className={`absolute right-6 sm:right-10 top-1/2 -translate-y-1/2 z-20 transition-all duration-1000 delay-300 ${loaded ? "opacity-100 translate-x-0" : "opacity-0 translate-x-6"}`}
      >
        <span
          className="font-display text-[10px] sm:text-xs tracking-[0.4em] uppercase text-rose-gold"
          style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
        >
          Гиалурон · Ретинол · Витамин С
        </span>
      </div>

      {/* Thin vertical lines */}
      <div className="absolute left-20 sm:left-24 top-0 bottom-0 w-px bg-foreground/5 z-10" />
      <div className="absolute right-20 sm:right-24 top-0 bottom-0 w-px bg-foreground/5 z-10" />

      {/* Hero image — right side */}
      <div
        className={`absolute right-0 top-0 bottom-0 w-[55%] lg:w-[50%] z-0 transition-all duration-1000 delay-200 ${loaded ? "opacity-100 scale-100" : "opacity-0 scale-105"}`}
      >
        <img
          src={heroImg}
          alt="Гоёл арьс арчилгааны бүтээгдэхүүнүүд"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/30 to-transparent" />
      </div>

      {/* Overlaid text */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-16 lg:px-24 pt-24 pb-16 w-full">
        <div className="flex flex-col items-start max-w-lg">
          <p
            className={`text-[10px] tracking-[0.5em] uppercase text-taupe mb-8 transition-all duration-700 delay-100 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            Премиум арьс арчилгаа
          </p>

          <h1
            className={`font-display text-5xl sm:text-6xl lg:text-[5.5rem] font-bold tracking-tight mb-8 transition-all duration-1000 delay-200 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            style={{ lineHeight: 0.92 }}
          >
            <span className="block">Таны</span>
            <span className="block text-foreground/90">арьсны</span>
            <span className="block italic font-normal text-primary">гоо</span>
            <span className="block">сайхан</span>
          </h1>

          <p
            className={`text-muted-foreground text-sm sm:text-base max-w-sm mb-10 leading-relaxed transition-all duration-700 delay-500 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            Байгалийн гаралтай, шинжлэх ухааны дэвшилтэт найрлагатай
            арьс арчилгааны бүтээгдэхүүнүүд. Таны арьсанд зориулсан.
          </p>

          <div
            className={`flex gap-4 transition-all duration-700 delay-700 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            <button
              onClick={() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })}
              className="bg-primary text-primary-foreground px-8 py-3.5 text-xs font-medium tracking-widest uppercase hover:opacity-90 active:scale-[0.97] transition-all duration-200 rounded-sm"
            >
              Бүтээгдэхүүн
            </button>
            <button
              onClick={() => document.getElementById("craft")?.scrollIntoView({ behavior: "smooth" })}
              className="border border-foreground/15 text-foreground px-8 py-3.5 text-xs font-medium tracking-widest uppercase hover:bg-foreground/5 active:scale-[0.97] transition-all duration-200 rounded-sm"
            >
              Технологи
            </button>
          </div>
        </div>
      </div>

      {/* Bottom scroll indicator */}
      <div
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-20 transition-all duration-700 delay-1000 ${loaded ? "opacity-100" : "opacity-0"}`}
      >
        <span
          className="text-[9px] tracking-[0.4em] uppercase text-muted-foreground"
          style={{ writingMode: "vertical-rl" }}
        >
          Доош
        </span>
        <div className="w-px h-10 bg-foreground/15 animate-pulse" />
      </div>

      {/* Edition label */}
      <div
        className={`absolute bottom-8 right-6 sm:right-10 z-20 transition-all duration-700 delay-[800ms] ${loaded ? "opacity-100" : "opacity-0"}`}
      >
        <span
          className="font-display text-[9px] tracking-[0.3em] uppercase text-muted-foreground"
          style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
        >
          2026 Цуглуулга
        </span>
      </div>
    </section>
  );
};

export default HeroSection;
