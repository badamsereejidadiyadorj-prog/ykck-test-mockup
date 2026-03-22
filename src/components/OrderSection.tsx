import { useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import steelImg from "@/assets/ykck-steel.jpg";
import adventureImg from "@/assets/ykck-adventure.jpg";
import tritanImg from "@/assets/ykck-tritan.jpg";
import layersImg from "@/assets/ykck-layers.jpg";
import { toast } from "sonner";

const items = [
  { id: "edge", name: "Edge Bottle 450ml", price: 42, image: steelImg },
  { id: "trail", name: "Trail Flask 600ml", price: 48, image: adventureImg },
  { id: "tritan", name: "Tritan Tumbler 500ml", price: 36, image: tritanImg },
  { id: "thermal", name: "Thermal Cup 380ml", price: 52, image: layersImg },
];

const OrderSection = () => {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const ref = useScrollReveal();

  const updateQty = (id: string, delta: number) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) + delta),
    }));
  };

  const total = items.reduce((sum, item) => sum + (quantities[item.id] || 0) * item.price, 0);
  const hasItems = total > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasItems) return toast.error("Please select at least one item.");
    if (!name.trim() || !email.trim()) return toast.error("Please fill in your details.");
    toast.success("Order placed! We'll be in touch shortly.");
    setQuantities({});
    setName("");
    setEmail("");
  };

  return (
    <section id="order" className="relative py-24 lg:py-32 bg-primary text-primary-foreground overflow-hidden">
      {/* Vertical label — left */}
      <div className="absolute left-6 sm:left-10 top-1/2 -translate-y-1/2 z-10">
        <span
          className="font-display text-[9px] tracking-[0.4em] uppercase text-primary-foreground/30"
          style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
        >
          Place Order
        </span>
      </div>

      {/* Vertical label — right */}
      <div className="absolute right-6 sm:right-10 top-1/2 -translate-y-1/2 z-10">
        <span
          className="font-display text-[9px] tracking-[0.4em] uppercase text-primary-foreground/30"
          style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
        >
          Worldwide Shipping
        </span>
      </div>

      <div className="max-w-4xl mx-auto px-6 sm:px-16 lg:px-24" ref={ref}>
        <div data-reveal className="reveal-up mb-12 text-center">
          <p className="text-sm tracking-[0.3em] uppercase opacity-50 mb-3">Order</p>
          <h2 className="font-display text-4xl lg:text-5xl font-bold tracking-tight" style={{ lineHeight: 1.1 }}>
            Start your collection
          </h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div data-reveal className="reveal-up space-y-4 mb-8" style={{ transitionDelay: "100ms" }}>
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 p-4 border border-primary-foreground/10 hover:border-primary-foreground/20 transition-colors duration-200"
              >
                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-display font-semibold text-sm">{item.name}</h4>
                  <p className="text-sm opacity-60">${item.price}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button type="button" onClick={() => updateQty(item.id, -1)} className="w-8 h-8 border border-primary-foreground/20 text-sm hover:bg-primary-foreground/10 active:scale-95 transition-all duration-150 flex items-center justify-center">−</button>
                  <span className="w-6 text-center font-display text-sm tabular-nums">{quantities[item.id] || 0}</span>
                  <button type="button" onClick={() => updateQty(item.id, 1)} className="w-8 h-8 border border-primary-foreground/20 text-sm hover:bg-primary-foreground/10 active:scale-95 transition-all duration-150 flex items-center justify-center">+</button>
                </div>
              </div>
            ))}
          </div>

          <div data-reveal className="reveal-up flex justify-between items-center py-4 border-t border-primary-foreground/10 mb-8" style={{ transitionDelay: "200ms" }}>
            <span className="font-display font-semibold">Total</span>
            <span className="font-display text-2xl font-bold tabular-nums">${total}</span>
          </div>

          <div data-reveal className="reveal-up grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8" style={{ transitionDelay: "300ms" }}>
            <input type="text" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} className="bg-transparent border border-primary-foreground/20 px-4 py-3 text-sm placeholder:opacity-40 focus:outline-none focus:border-primary-foreground/50 transition-colors" />
            <input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-transparent border border-primary-foreground/20 px-4 py-3 text-sm placeholder:opacity-40 focus:outline-none focus:border-primary-foreground/50 transition-colors" />
          </div>

          <div data-reveal className="reveal-up text-center" style={{ transitionDelay: "400ms" }}>
            <button type="submit" className="bg-primary-foreground text-primary px-12 py-4 font-display font-semibold text-sm tracking-wide hover:opacity-90 active:scale-[0.97] transition-all duration-200 disabled:opacity-30" disabled={!hasItems}>
              Place Order — ${total}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default OrderSection;
