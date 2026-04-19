import { useEffect, useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/context/CartContext";
import { Search, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
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

const resolveImg = (url: string | null | undefined) => {
  if (!url) return creamImg;
  if (url.startsWith("http")) return url;
  return imageMap[url] || creamImg;
};

const fallbackProducts = [
  { id: "1", name: "Нүүрний тос 50мл", description: "Чийгшүүлэгч тос", price: 89000, image_url: "/product-cream" },
  { id: "2", name: "Сэргээх серум 30мл", description: "Идэвхтэй серум", price: 125000, image_url: "/product-serum" },
  { id: "3", name: "Цэвэрлэгч гель 200мл", description: "Зөөлөн цэвэрлэгч", price: 65000, image_url: "/product-cleanser" },
  { id: "4", name: "Нүдний крем 15мл", description: "Нүдний эргэн тойрны крем", price: 78000, image_url: "/product-eyecream" },
];

const ProductsSection = () => {
  const sectionRef = useScrollReveal();
  const { add } = useCart();
  const [search, setSearch] = useState("");

  useEffect(() => {
    const handler = (e: Event) => setSearch((e as CustomEvent<string>).detail || "");
    window.addEventListener("product-search", handler);
    return () => window.removeEventListener("product-search", handler);
  }, []);

  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*").eq("is_active", true).order("created_at");
      if (error) throw error;
      return data;
    },
  });

  const all: any[] = (products && products.length > 0 ? products : fallbackProducts) as any[];
  const q = search.trim().toLowerCase();
  const displayProducts = q
    ? all.filter((p) => p.name.toLowerCase().includes(q) || (p.description || "").toLowerCase().includes(q))
    : all;

  return (
    <section id="products" className="relative py-24 lg:py-32 bg-card overflow-hidden">
      <div className="absolute left-6 sm:left-10 top-1/2 -translate-y-1/2 z-10">
        <span className="font-display text-[9px] tracking-[0.4em] uppercase text-concrete" style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}>
          Цуглуулга
        </span>
      </div>
      <div className="absolute right-6 sm:right-10 top-1/2 -translate-y-1/2 z-10">
        <span className="font-display text-[9px] tracking-[0.4em] uppercase text-concrete" style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}>
          {String(displayProducts.length).padStart(2, "0")} Бүтээгдэхүүн
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-16 lg:px-24" ref={sectionRef}>
        <div data-reveal className="reveal-up mb-10 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-sm tracking-[0.3em] uppercase text-taupe mb-3">Бүтээгдэхүүн</p>
            <h2 className="font-display text-4xl lg:text-5xl font-bold tracking-tight" style={{ lineHeight: 1.1 }}>
              Арьсны гоо сайхны нууц
            </h2>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Хайх..."
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-input bg-background rounded-sm focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
        </div>

        {displayProducts.length === 0 ? (
          <p className="text-muted-foreground text-center py-16">"{search}" хайлтаар олдсонгүй.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayProducts.map((product: any, i: number) => (
              <div key={product.id} data-reveal className="reveal-up group" style={{ transitionDelay: `${i * 80}ms` }}>
                <div className="relative overflow-hidden bg-secondary mb-4 aspect-[3/4] rounded-sm">
                  <img
                    src={resolveImg(product.image_url)}
                    alt={product.name}
                    className="w-full h-full object-cover img-parallax"
                    loading="lazy"
                  />
                  <button
                    onClick={() => {
                      add({ id: product.id, name: product.name, price: Number(product.price), image_url: product.image_url ?? null });
                      toast.success(`${product.name} сагсанд нэмэгдлээ`);
                    }}
                    className="absolute bottom-3 left-3 right-3 bg-foreground text-background py-2.5 text-xs font-display font-semibold tracking-wide rounded-sm opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    Сагсанд нэмэх
                  </button>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-display font-semibold text-base">{product.name}</h3>
                    <p className="text-muted-foreground text-sm mt-0.5">{product.description}</p>
                  </div>
                  <span className="font-display font-semibold text-base">₮{Number(product.price).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductsSection;
