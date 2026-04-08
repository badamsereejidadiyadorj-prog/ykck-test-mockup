import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import creamImg from "@/assets/product-cream.jpg";
import serumImg from "@/assets/product-serum.jpg";
import cleanserImg from "@/assets/product-cleanser.jpg";
import eyecreamImg from "@/assets/product-eyecream.jpg";

const imageMap: Record<string, string> = {
  "/product-cream": creamImg,
  "/product-serum": serumImg,
  "/product-cleanser": cleanserImg,
  "/product-eyecream": eyecreamImg,
};

const fallbackProducts = [
  { id: "1", name: "Нүүрний тос 50мл", description: "Чийгшүүлэгч тос", price: 89000, image_url: "/product-cream" },
  { id: "2", name: "Сэргээх серум 30мл", description: "Идэвхтэй серум", price: 125000, image_url: "/product-serum" },
  { id: "3", name: "Цэвэрлэгч гель 200мл", description: "Зөөлөн цэвэрлэгч", price: 65000, image_url: "/product-cleanser" },
  { id: "4", name: "Нүдний крем 15мл", description: "Нүдний эргэн тойрны крем", price: 78000, image_url: "/product-eyecream" },
];

const ProductsSection = () => {
  const sectionRef = useScrollReveal();

  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*").eq("is_active", true).order("created_at");
      if (error) throw error;
      return data;
    },
  });

  const displayProducts = products && products.length > 0 ? products : fallbackProducts;

  return (
    <section id="products" className="relative py-24 lg:py-32 bg-card overflow-hidden">
      {/* Vertical label — left */}
      <div className="absolute left-6 sm:left-10 top-1/2 -translate-y-1/2 z-10">
        <span
          className="font-display text-[9px] tracking-[0.4em] uppercase text-concrete"
          style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
        >
          Цуглуулга
        </span>
      </div>

      {/* Vertical label — right */}
      <div className="absolute right-6 sm:right-10 top-1/2 -translate-y-1/2 z-10">
        <span
          className="font-display text-[9px] tracking-[0.4em] uppercase text-concrete"
          style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
        >
          {String(displayProducts.length).padStart(2, "0")} Бүтээгдэхүүн
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-16 lg:px-24" ref={sectionRef}>
        <div data-reveal className="reveal-up mb-16">
          <p className="text-sm tracking-[0.3em] uppercase text-taupe mb-3">Бүтээгдэхүүн</p>
          <h2 className="font-display text-4xl lg:text-5xl font-bold tracking-tight" style={{ lineHeight: 1.1 }}>
            Арьсны гоо сайхны нууц
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayProducts.map((product, i) => (
            <div
              key={product.id}
              data-reveal
              className="reveal-up group cursor-pointer"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="relative overflow-hidden bg-secondary mb-4 aspect-[3/4] rounded-sm">
                <img
                  src={imageMap[product.image_url || ""] || creamImg}
                  alt={product.name}
                  className="w-full h-full object-cover img-parallax"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors duration-300" />
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-display font-semibold text-base">{product.name}</h3>
                  <p className="text-muted-foreground text-sm mt-0.5">{product.description}</p>
                </div>
                <span className="font-display font-semibold text-base">₮{product.price.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
