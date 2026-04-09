import { useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ReturnSection = () => {
  const ref = useScrollReveal();
  const [form, setForm] = useState({ order_id: "", customer_name: "", phone: "", email: "", reason: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.customer_name.trim() || !form.reason.trim()) return toast.error("Мэдээллээ бүрэн бөглөнө үү.");

    setSubmitting(true);
    const { error } = await supabase.from("returns").insert({
      order_id: form.order_id || undefined,
      customer_name: form.customer_name.trim(),
      phone: form.phone.trim() || null,
      email: form.email.trim() || null,
      reason: form.reason.trim(),
    } as any);

    setSubmitting(false);
    if (error) return toast.error("Алдаа гарлаа. Дахин оролдоно уу.");
    toast.success("Буцаалтын хүсэлт илгээгдлээ!");
    setForm({ order_id: "", customer_name: "", phone: "", email: "", reason: "" });
  };

  return (
    <section id="returns" className="relative py-24 lg:py-32 bg-card overflow-hidden">
      <div className="absolute left-6 sm:left-10 top-1/2 -translate-y-1/2 z-10">
        <span className="font-display text-[9px] tracking-[0.4em] uppercase text-muted-foreground/40" style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}>
          Бараа буцаалт
        </span>
      </div>

      <div className="max-w-xl mx-auto px-6 sm:px-16" ref={ref}>
        <div data-reveal className="reveal-up text-center mb-10">
          <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-3">Буцаалт</p>
          <h2 className="font-display text-3xl lg:text-4xl font-bold tracking-tight">Бараа буцаах хүсэлт</h2>
          <p className="text-muted-foreground text-sm mt-3">Худалдан авалтаас 14 хоногийн дотор буцаах боломжтой.</p>
        </div>

        <form onSubmit={handleSubmit} data-reveal className="reveal-up space-y-4" style={{ transitionDelay: "100ms" }}>
          <input
            type="text"
            placeholder="Таны нэр *"
            value={form.customer_name}
            onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
            className="w-full border border-input px-4 py-3 text-sm rounded-sm bg-background focus:outline-none focus:ring-1 focus:ring-ring"
            required
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="tel"
              placeholder="Утасны дугаар"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="border border-input px-4 py-3 text-sm rounded-sm bg-background focus:outline-none focus:ring-1 focus:ring-ring"
            />
            <input
              type="email"
              placeholder="Имэйл"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="border border-input px-4 py-3 text-sm rounded-sm bg-background focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
          <textarea
            placeholder="Буцаах шалтгаан *"
            value={form.reason}
            onChange={(e) => setForm({ ...form, reason: e.target.value })}
            className="w-full border border-input px-4 py-3 text-sm rounded-sm bg-background focus:outline-none focus:ring-1 focus:ring-ring"
            rows={3}
            required
          />
          <div className="text-center pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="bg-primary text-primary-foreground px-10 py-3 text-sm font-medium rounded-sm hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {submitting ? "Илгээж байна..." : "Хүсэлт илгээх"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default ReturnSection;
