import { useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
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

const OrderSection = () => {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const ref = useScrollReveal();

  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*").eq("is_active", true).order("created_at");
      if (error) throw error;
      return data;
    },
  });

  const items = products || [];

  const updateQty = (id: string, delta: number) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) + delta),
    }));
  };

  const total = items.reduce((sum, item) => sum + (quantities[item.id] || 0) * Number(item.price), 0);
  const hasItems = total > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasItems) return toast.error("Бүтээгдэхүүн сонгоно уу.");
    if (!name.trim() || !phone.trim()) return toast.error("Мэдээллээ бөглөнө үү.");

    setSubmitting(true);
    const orderItems = items
      .filter((item) => (quantities[item.id] || 0) > 0)
      .map((item) => ({
        product_id: item.id,
        name: item.name,
        qty: quantities[item.id],
        price: Number(item.price),
      }));

    const { error } = await supabase.from("orders").insert({
      customer_name: name.trim(),
      phone: phone.trim(),
      items: orderItems,
      total_amount: total,
    });

    setSubmitting(false);
    if (error) return toast.error("Алдаа гарлаа. Дахин оролдоно уу.");
    toast.success("Захиалга амжилттай! Бид тантай холбогдох болно.");
    setQuantities({});
    setName("");
    setPhone("");
  };

  return (
    <section id="order" className="relative py-24 lg:py-32 bg-primary text-primary-foreground overflow-hidden">
      {/* Vertical label — left */}
      <div className="absolute left-6 sm:left-10 top-1/2 -translate-y-1/2 z-10">
        <span
          className="font-display text-[9px] tracking-[0.4em] uppercase text-primary-foreground/30"
          style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
        >
          Захиалга өгөх
        </span>
      </div>

      {/* Vertical label — right */}
      <div className="absolute right-6 sm:right-10 top-1/2 -translate-y-1/2 z-10">
        <span
          className="font-display text-[9px] tracking-[0.4em] uppercase text-primary-foreground/30"
          style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
        >
          Хүргэлт үнэгүй
        </span>
      </div>

      <div className="max-w-4xl mx-auto px-6 sm:px-16 lg:px-24" ref={ref}>
        <div data-reveal className="reveal-up mb-12 text-center">
          <p className="text-sm tracking-[0.3em] uppercase opacity-50 mb-3">Захиалга</p>
          <h2 className="font-display text-4xl lg:text-5xl font-bold tracking-tight" style={{ lineHeight: 1.1 }}>
            Арьс арчилгаагаа эхлүүлэх
          </h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div data-reveal className="reveal-up space-y-4 mb-8" style={{ transitionDelay: "100ms" }}>
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 p-4 border border-primary-foreground/10 hover:border-primary-foreground/20 transition-colors duration-200 rounded-sm"
              >
                <img src={imageMap[item.image_url || ""] || creamImg} alt={item.name} className="w-16 h-16 object-cover flex-shrink-0 rounded-sm" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-display font-semibold text-sm">{item.name}</h4>
                  <p className="text-sm opacity-60">₮{Number(item.price).toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button type="button" onClick={() => updateQty(item.id, -1)} className="w-8 h-8 border border-primary-foreground/20 text-sm hover:bg-primary-foreground/10 active:scale-95 transition-all duration-150 flex items-center justify-center rounded-sm">−</button>
                  <span className="w-6 text-center font-display text-sm tabular-nums">{quantities[item.id] || 0}</span>
                  <button type="button" onClick={() => updateQty(item.id, 1)} className="w-8 h-8 border border-primary-foreground/20 text-sm hover:bg-primary-foreground/10 active:scale-95 transition-all duration-150 flex items-center justify-center rounded-sm">+</button>
                </div>
              </div>
            ))}
          </div>

          <div data-reveal className="reveal-up flex justify-between items-center py-4 border-t border-primary-foreground/10 mb-8" style={{ transitionDelay: "200ms" }}>
            <span className="font-display font-semibold">Нийт</span>
            <span className="font-display text-2xl font-bold tabular-nums">₮{total.toLocaleString()}</span>
          </div>

          <div data-reveal className="reveal-up grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8" style={{ transitionDelay: "300ms" }}>
            <input type="text" placeholder="Таны нэр" value={name} onChange={(e) => setName(e.target.value)} className="bg-transparent border border-primary-foreground/20 px-4 py-3 text-sm placeholder:opacity-40 focus:outline-none focus:border-primary-foreground/50 transition-colors rounded-sm" />
            <input type="tel" placeholder="Утасны дугаар" value={phone} onChange={(e) => setPhone(e.target.value)} className="bg-transparent border border-primary-foreground/20 px-4 py-3 text-sm placeholder:opacity-40 focus:outline-none focus:border-primary-foreground/50 transition-colors rounded-sm" />
          </div>

          <div data-reveal className="reveal-up text-center" style={{ transitionDelay: "400ms" }}>
            <button
              type="submit"
              disabled={!hasItems || submitting}
              className="bg-primary-foreground text-primary px-12 py-4 font-display font-semibold text-sm tracking-wide hover:opacity-90 active:scale-[0.97] transition-all duration-200 disabled:opacity-30 rounded-sm"
            >
              {submitting ? "Илгээж байна..." : `Захиалга өгөх — ₮${total.toLocaleString()}`}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default OrderSection;
