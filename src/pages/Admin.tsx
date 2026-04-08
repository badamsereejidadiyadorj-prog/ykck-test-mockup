import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import type { Json } from "@/integrations/supabase/types";

const Admin = () => {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<"products" | "orders">("orders");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", price: "", image_url: "", category: "" });

  const { data: orders } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: products } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const addProduct = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("products").insert({
        name: form.name,
        description: form.description,
        price: Number(form.price),
        image_url: form.image_url,
        category: form.category,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Бүтээгдэхүүн нэмэгдлээ!");
      setForm({ name: "", description: "", price: "", image_url: "", category: "" });
      setShowForm(false);
    },
    onError: () => toast.error("Алдаа гарлаа"),
  });

  const toggleActive = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase.from("products").update({ is_active: !is_active }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-blue-100 text-blue-800",
    delivered: "bg-green-100 text-green-800",
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="font-display text-xl font-bold tracking-tight">
              ГОЁЛ<sup className="text-xs align-super text-muted-foreground">®</sup>
            </Link>
            <span className="text-muted-foreground text-sm">/ Админ</span>
          </div>
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Нүүр хуудас
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-1 mb-8 bg-muted p-1 rounded-sm w-fit">
          <button
            onClick={() => setTab("orders")}
            className={`px-6 py-2 text-sm font-medium rounded-sm transition-colors ${tab === "orders" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"}`}
          >
            Захиалгууд ({orders?.length || 0})
          </button>
          <button
            onClick={() => setTab("products")}
            className={`px-6 py-2 text-sm font-medium rounded-sm transition-colors ${tab === "products" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"}`}
          >
            Бүтээгдэхүүн ({products?.length || 0})
          </button>
        </div>

        {/* Orders Tab */}
        {tab === "orders" && (
          <div className="space-y-4">
            <h2 className="font-display text-2xl font-bold mb-4">Захиалгууд</h2>
            {orders?.length === 0 && <p className="text-muted-foreground">Захиалга байхгүй байна.</p>}
            <div className="space-y-3">
              {orders?.map((order) => {
                const orderItems = Array.isArray(order.items) ? order.items : [];
                return (
                  <div key={order.id} className="border border-border rounded-sm p-5 bg-card">
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                      <div>
                        <p className="font-display font-semibold">{order.customer_name}</p>
                        <p className="text-sm text-muted-foreground">{order.phone} {order.email && `· ${order.email}`}</p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-block px-3 py-1 text-xs font-medium rounded-sm ${statusColors[order.status] || "bg-muted text-muted-foreground"}`}>
                          {order.status === "pending" ? "Хүлээгдэж буй" : order.status === "confirmed" ? "Баталгаажсан" : order.status === "delivered" ? "Хүргэгдсэн" : order.status}
                        </span>
                        <p className="font-display font-bold text-lg mt-1">₮{Number(order.total_amount).toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {orderItems.map((item: Json, idx: number) => {
                        const i = item as Record<string, Json>;
                        return (
                          <span key={idx}>
                            {String(i.name)} ×{String(i.qty)}
                            {idx < orderItems.length - 1 ? ", " : ""}
                          </span>
                        );
                      })}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(order.created_at).toLocaleString("mn-MN")}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Products Tab */}
        {tab === "products" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-2xl font-bold">Бүтээгдэхүүн</h2>
              <button
                onClick={() => setShowForm(!showForm)}
                className="bg-primary text-primary-foreground px-5 py-2 text-sm font-medium rounded-sm hover:opacity-90 transition-opacity"
              >
                {showForm ? "Болих" : "+ Шинэ нэмэх"}
              </button>
            </div>

            {showForm && (
              <form
                onSubmit={(e) => { e.preventDefault(); addProduct.mutate(); }}
                className="border border-border rounded-sm p-5 bg-card space-y-4 mb-6"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    placeholder="Нэр"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="border border-input px-4 py-2.5 text-sm rounded-sm bg-background focus:outline-none focus:ring-1 focus:ring-ring"
                    required
                  />
                  <input
                    placeholder="Үнэ (₮)"
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="border border-input px-4 py-2.5 text-sm rounded-sm bg-background focus:outline-none focus:ring-1 focus:ring-ring"
                    required
                  />
                </div>
                <textarea
                  placeholder="Тайлбар"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full border border-input px-4 py-2.5 text-sm rounded-sm bg-background focus:outline-none focus:ring-1 focus:ring-ring"
                  rows={2}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    placeholder="Зургийн URL"
                    value={form.image_url}
                    onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                    className="border border-input px-4 py-2.5 text-sm rounded-sm bg-background focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                  <input
                    placeholder="Ангилал"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="border border-input px-4 py-2.5 text-sm rounded-sm bg-background focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
                <button
                  type="submit"
                  disabled={addProduct.isPending}
                  className="bg-primary text-primary-foreground px-8 py-2.5 text-sm font-medium rounded-sm hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {addProduct.isPending ? "Нэмж байна..." : "Нэмэх"}
                </button>
              </form>
            )}

            <div className="space-y-3">
              {products?.map((product) => (
                <div key={product.id} className="border border-border rounded-sm p-5 bg-card flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-display font-semibold">{product.name}</p>
                      {!product.is_active && (
                        <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-sm">Идэвхгүй</span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">{product.description}</p>
                    <p className="font-display font-semibold mt-1">₮{Number(product.price).toLocaleString()}</p>
                  </div>
                  <button
                    onClick={() => toggleActive.mutate({ id: product.id, is_active: product.is_active })}
                    className={`px-4 py-2 text-xs font-medium rounded-sm border transition-colors ${
                      product.is_active
                        ? "border-destructive/30 text-destructive hover:bg-destructive/5"
                        : "border-green-300 text-green-700 hover:bg-green-50"
                    }`}
                  >
                    {product.is_active ? "Идэвхгүй болгох" : "Идэвхжүүлэх"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
