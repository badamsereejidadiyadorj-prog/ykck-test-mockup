import { useCart } from "@/context/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "sonner";
import { X, Minus, Plus, Trash2 } from "lucide-react";
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

const resolveImg = (url: string | null) => {
  if (!url) return creamImg;
  if (url.startsWith("http")) return url;
  return imageMap[url] || creamImg;
};

const CartDrawer = () => {
  const { items, isOpen, close, setQty, remove, total, clear } = useCart();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return toast.error("Сагс хоосон байна");
    if (!name.trim() || !phone.trim()) return toast.error("Нэр, утсаа бөглөнө үү");
    setSubmitting(true);
    const { error } = await supabase.from("orders").insert({
      customer_name: name.trim(),
      phone: phone.trim(),
      items: items.map((i) => ({ product_id: i.id, name: i.name, qty: i.qty, price: i.price })),
      total_amount: total,
    });
    setSubmitting(false);
    if (error) return toast.error("Алдаа гарлаа");
    toast.success("Захиалга амжилттай!");
    clear();
    setName("");
    setPhone("");
    close();
  };

  return (
    <>
      <div
        onClick={close}
        className={`fixed inset-0 bg-foreground/40 z-[60] transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />
      <aside
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-background z-[70] shadow-2xl transition-transform duration-300 flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h3 className="font-display text-lg font-bold tracking-tight">Сагс ({items.length})</h3>
          <button onClick={close} className="p-2 hover:bg-muted rounded-sm transition-colors" aria-label="Хаах">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-12">Сагс хоосон байна.</p>
          ) : (
            items.map((i) => (
              <div key={i.id} className="flex gap-3 pb-4 border-b border-border last:border-0">
                <img src={resolveImg(i.image_url)} alt={i.name} className="w-16 h-20 object-cover rounded-sm flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-display font-semibold text-sm truncate">{i.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">₮{i.price.toLocaleString()}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button onClick={() => setQty(i.id, i.qty - 1)} className="w-7 h-7 border border-input rounded-sm hover:bg-muted flex items-center justify-center">
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-6 text-center text-sm tabular-nums">{i.qty}</span>
                    <button onClick={() => setQty(i.id, i.qty + 1)} className="w-7 h-7 border border-input rounded-sm hover:bg-muted flex items-center justify-center">
                      <Plus className="w-3 h-3" />
                    </button>
                    <button onClick={() => remove(i.id)} className="ml-auto p-1.5 text-muted-foreground hover:text-destructive transition-colors" aria-label="Устгах">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <div className="font-display font-semibold text-sm tabular-nums">₮{(i.price * i.qty).toLocaleString()}</div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <form onSubmit={submit} className="border-t border-border p-5 space-y-3 bg-card">
            <div className="flex justify-between items-center">
              <span className="font-display font-semibold">Нийт</span>
              <span className="font-display text-xl font-bold tabular-nums">₮{total.toLocaleString()}</span>
            </div>
            <input
              type="text"
              placeholder="Таны нэр"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-input px-3 py-2.5 text-sm rounded-sm bg-background focus:outline-none focus:ring-1 focus:ring-ring"
            />
            <input
              type="tel"
              placeholder="Утасны дугаар"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border border-input px-3 py-2.5 text-sm rounded-sm bg-background focus:outline-none focus:ring-1 focus:ring-ring"
            />
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary text-primary-foreground py-3 font-display font-semibold text-sm rounded-sm hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {submitting ? "Илгээж байна..." : "Захиалга өгөх"}
            </button>
          </form>
        )}
      </aside>
    </>
  );
};

export default CartDrawer;
