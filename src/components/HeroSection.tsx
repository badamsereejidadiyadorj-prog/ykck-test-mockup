import { useEffect, useState } from "react";
import lifestyleImg from "@/assets/ykck-lifestyle.jpg";

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
          Swiss Precision
        </span>
      </div>

      {/* Vertical text — right */}
      <div
        className={`absolute right-6 sm:right-10 top-1/2 -translate-y-1/2 z-20 transition-all duration-1000 delay-300 ${loaded ? "opacity-100 translate-x-0" : "opacity-0 translate-x-6"}`}
      >
        <span
          className="font-display text-[10px] sm:text-xs tracking-[0.4em] uppercase text-stone-warm"
          style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
        >
          304 Stainless · Tritan
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
          src={lifestyleImg}
          alt="Woman drinking from YKCK bottle"
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
            Design in Swiss
          </p>

          <h1
            className={`font-display text-6xl sm:text-7xl lg:text-[6.5rem] font-bold tracking-tight mb-8 transition-all duration-1000 delay-200 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            style={{ lineHeight: 0.88 }}
          >
            <span className="block">The</span>
            <span className="block text-foreground/90">soul</span>
            <span className="block">needs</span>
            <span className="block italic font-normal text-stone-warm">sharp</span>
            <span className="block">edges</span>
          </h1>

          <p
            className={`text-muted-foreground text-sm sm:text-base max-w-sm mb-10 leading-relaxed transition-all duration-700 delay-500 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            Premium drinkware crafted with 304 stainless steel
            and food-grade Tritan. Built to endure.
          </p>

          <div
            className={`flex gap-4 transition-all duration-700 delay-700 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            <button
              onClick={() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })}
              className="bg-primary text-primary-foreground px-8 py-3.5 text-xs font-medium tracking-widest uppercase hover:opacity-90 active:scale-[0.97] transition-all duration-200"
            >
              Explore
            </button>
            <button
              onClick={() => document.getElementById("craft")?.scrollIntoView({ behavior: "smooth" })}
              className="border border-foreground/15 text-foreground px-8 py-3.5 text-xs font-medium tracking-widest uppercase hover:bg-foreground/5 active:scale-[0.97] transition-all duration-200"
            >
              Our Craft
            </button>
          </div>
        </div>
      </div>

      {/* Bottom scroll indicator — vertical */}
      <div
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-20 transition-all duration-700 delay-1000 ${loaded ? "opacity-100" : "opacity-0"}`}
      >
        <span
          className="text-[9px] tracking-[0.4em] uppercase text-muted-foreground"
          style={{ writingMode: "vertical-rl" }}
        >
          Scroll
        </span>
        <div className="w-px h-10 bg-foreground/15 animate-pulse" />
      </div>

      {/* Edition label — vertical bottom right */}
      <div
        className={`absolute bottom-8 right-6 sm:right-10 z-20 transition-all duration-700 delay-[800ms] ${loaded ? "opacity-100" : "opacity-0"}`}
      >
        <span
          className="font-display text-[9px] tracking-[0.3em] uppercase text-muted-foreground"
          style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
        >
          Edition 2026
        </span>
      </div>
    </section>
  );
};

export default HeroSection;
