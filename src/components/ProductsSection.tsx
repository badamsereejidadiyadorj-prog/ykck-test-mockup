import { useScrollReveal } from "@/hooks/useScrollReveal";
import steelImg from "@/assets/ykck-steel.jpg";
import adventureImg from "@/assets/ykck-adventure.jpg";
import tritanImg from "@/assets/ykck-tritan.jpg";
import layersImg from "@/assets/ykck-layers.jpg";

const products = [
  { name: "Edge Bottle 450ml", tagline: "A cup with its own edges", price: "$42", image: steelImg },
  { name: "Trail Flask 600ml", tagline: "Adventure-ready companion", price: "$48", image: adventureImg },
  { name: "Tritan Tumbler 500ml", tagline: "Transparent, safe, beautiful", price: "$36", image: tritanImg },
  { name: "Thermal Cup 380ml", tagline: "Five-layer vacuum lock", price: "$52", image: layersImg },
];

const ProductsSection = () => {
  const sectionRef = useScrollReveal();

  return (
    <section id="products" className="relative py-24 lg:py-32 bg-card overflow-hidden">
      {/* Vertical label — left */}
      <div className="absolute left-6 sm:left-10 top-1/2 -translate-y-1/2 z-10">
        <span
          className="font-display text-[9px] tracking-[0.4em] uppercase text-concrete"
          style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
        >
          Collection
        </span>
      </div>

      {/* Vertical label — right */}
      <div className="absolute right-6 sm:right-10 top-1/2 -translate-y-1/2 z-10">
        <span
          className="font-display text-[9px] tracking-[0.4em] uppercase text-concrete"
          style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
        >
          04 Products
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-16 lg:px-24" ref={sectionRef}>
        <div data-reveal className="reveal-up mb-16">
          <p className="text-sm tracking-[0.3em] uppercase text-taupe mb-3">Collection</p>
          <h2 className="font-display text-4xl lg:text-5xl font-bold tracking-tight" style={{ lineHeight: 1.1 }}>
            Precision meets purpose
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, i) => (
            <div
              key={product.name}
              data-reveal
              className="reveal-up group cursor-pointer"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="relative overflow-hidden bg-secondary mb-4 aspect-[3/4]">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover img-parallax"
                />
                <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors duration-300" />
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-display font-semibold text-base">{product.name}</h3>
                  <p className="text-muted-foreground text-sm mt-0.5">{product.tagline}</p>
                </div>
                <span className="font-display font-semibold text-base">{product.price}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
