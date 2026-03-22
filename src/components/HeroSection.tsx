import heroImg from "@/assets/ykck-soul.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <img
          src={heroImg}
          alt="YKCK premium bottles on concrete"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/60 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-16 w-full">
        <div className="max-w-xl">
          <p className="text-sm tracking-[0.3em] uppercase text-taupe mb-4 animate-text-reveal">
            Design in Swiss
          </p>
          <h1
            className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-[0.95] tracking-tight mb-6"
            style={{ lineHeight: 1 }}
          >
            The soul
            <br />
            needs sharp
            <br />
            edges
          </h1>
          <p className="text-muted-foreground text-lg max-w-md mb-10 leading-relaxed">
            Premium drinkware crafted with 304 stainless steel and food-grade Tritan.
            Built to endure. Designed to inspire.
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })}
              className="bg-primary text-primary-foreground px-8 py-3.5 text-sm font-medium tracking-wide hover:opacity-90 active:scale-[0.97] transition-all duration-200"
            >
              Explore Collection
            </button>
            <button
              onClick={() => document.getElementById("craft")?.scrollIntoView({ behavior: "smooth" })}
              className="border border-foreground/20 text-foreground px-8 py-3.5 text-sm font-medium tracking-wide hover:bg-foreground/5 active:scale-[0.97] transition-all duration-200"
            >
              Our Craft
            </button>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground">
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <div className="w-px h-8 bg-foreground/20 animate-pulse" />
      </div>
    </section>
  );
};

export default HeroSection;
