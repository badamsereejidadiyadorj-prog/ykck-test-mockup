import { useScrollReveal } from "@/hooks/useScrollReveal";
import coffeeImg from "@/assets/ykck-coffee.jpg";

const features = [
  { title: "304 Stainless Steel", desc: "Medical-grade interior for pure taste and lasting durability." },
  { title: "Five-Layer Insulation", desc: "Vacuum lock design keeps drinks hot 12hrs, cold 24hrs." },
  { title: "Food-Grade Tritan", desc: "BPA-free, crystal-clear material — safe and beautiful." },
  { title: "Swiss Design Language", desc: "Geometric precision with tactile surfaces that feel intentional." },
];

const CraftSection = () => {
  const ref1 = useScrollReveal();
  const ref2 = useScrollReveal();

  return (
    <section id="craft" className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6">
        {/* Full-width image band */}
        <div ref={ref1} className="reveal-scale mb-20 relative overflow-hidden aspect-[21/9]">
          <img
            src={coffeeImg}
            alt="YKCK coffee machine setup"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex items-end p-8 lg:p-12">
            <p className="font-display text-2xl lg:text-3xl font-bold text-primary-foreground mix-blend-difference max-w-md" style={{ lineHeight: 1.2 }}>
              Where engineering
              <br />meets everyday ritual
            </p>
          </div>
        </div>

        {/* Features grid */}
        <div ref={ref2} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {features.map((f, i) => (
            <div
              key={f.title}
              data-reveal
              className="reveal-up"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="w-8 h-px bg-taupe mb-4" />
              <h3 className="font-display font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CraftSection;
