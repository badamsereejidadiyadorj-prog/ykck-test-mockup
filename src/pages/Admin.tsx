import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import type { Json } from "@/integrations/supabase/types";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "@/components/AdminDashboard";

const Admin = () => {
  const queryClient = useQueryClient();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"dashboard" | "products" | "orders" | "returns">("dashboard");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", description: "", price: "", category: "" });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  const { data: orders = [] } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!session,
  });

  const { data: products = [] } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!session,
  });

  const { data: returns = [] } = useQuery({
    queryKey: ["admin-returns"],
    queryFn: async () => {
      const { data, error } = await supabase.from("returns" as any).select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []) as any[];
    },
    enabled: !!session,
  });

  const uploadImage = async (file: File): Promise<string | null> => {
    const ext = file.name.split(".").pop();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from("product-images").upload(path, file);
    if (error) {
      toast.error("Зураг хуулахад алдаа гарлаа");
      return null;
    }
    const { data } = supabase.storage.from("product-images").getPublicUrl(path);
    return data.publicUrl;
  };

  const saveProduct = useMutation({
    mutationFn: async () => {
      let image_url: string | undefined;
      if (imageFile) {
        const url = await uploadImage(imageFile);
        if (url) image_url = url;
      }

      if (editingId) {
        const updateData: any = {
          name: form.name,
          description: form.description,
          price: Number(form.price),
          category: form.category,
        };
        if (image_url) updateData.image_url = image_url;
        const { error } = await supabase.from("products").update(updateData).eq("id", editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("products").insert({
          name: form.name,
          description: form.description,
          price: Number(form.price),
          image_url: image_url || "",
          category: form.category,
        });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success(editingId ? "Засагдлаа!" : "Нэмэгдлээ!");
      resetForm();
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

  const updateOrderStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("orders").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      toast.success("Төлөв шинэчлэгдлээ");
    },
  });

  const updateReturnStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("returns" as any).update({ status } as any).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-returns"] });
      toast.success("Буцаалтын төлөв шинэчлэгдлээ");
    },
  });

  const resetForm = () => {
    setForm({ name: "", description: "", price: "", category: "" });
    setImageFile(null);
    setShowForm(false);
    setEditingId(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const startEdit = (product: any) => {
    setForm({ name: product.name, description: product.description || "", price: String(product.price), category: product.category || "" });
    setEditingId(product.id);
    setShowForm(true);
    setImageFile(null);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-blue-100 text-blue-800",
    delivered: "bg-green-100 text-green-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  };

  const statusLabels: Record<string, string> = {
    pending: "Хүлээгдэж буй",
    confirmed: "Баталгаажсан",
    delivered: "Хүргэгдсэн",
    approved: "Зөвшөөрсөн",
    rejected: "Татгалзсан",
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Уншиж байна...</div>;
  if (!session) return <AdminLogin onLogin={() => {}} />;

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
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground hidden sm:block">{session.user.email}</span>
            <button onClick={handleLogout} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Гарах
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-1 mb-8 bg-muted p-1 rounded-sm w-fit flex-wrap">
          {(["dashboard", "orders", "products", "returns"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2 text-sm font-medium rounded-sm transition-colors ${tab === t ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"}`}
            >
              {t === "dashboard" ? "Хяналт" : t === "orders" ? `Захиалга (${orders.length})` : t === "products" ? `Бүтээгдэхүүн (${products.length})` : `Буцаалт (${returns.length})`}
            </button>
          ))}
        </div>

        {/* Dashboard */}
        {tab === "dashboard" && <AdminDashboard orders={orders} products={products} returns={returns} />}

        {/* Orders */}
        {tab === "orders" && (
          <div className="space-y-4">
            <h2 className="font-display text-2xl font-bold mb-4">Захиалгууд</h2>
            {orders.length === 0 && <p className="text-muted-foreground">Захиалга байхгүй.</p>}
            {orders.map((order) => {
              const orderItems = Array.isArray(order.items) ? order.items : [];
              return (
                <div key={order.id} className="border border-border rounded-sm p-5 bg-card">
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                    <div>
                      <p className="font-display font-semibold">{order.customer_name}</p>
                      <p className="text-sm text-muted-foreground">{order.phone} {order.email && `· ${order.email}`}</p>
                    </div>
                    <div className="text-right space-y-1">
                      <span className={`inline-block px-3 py-1 text-xs font-medium rounded-sm ${statusColors[order.status] || "bg-muted text-muted-foreground"}`}>
                        {statusLabels[order.status] || order.status}
                      </span>
                      <p className="font-display font-bold text-lg">₮{Number(order.total_amount).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {orderItems.map((item: Json, idx: number) => {
                      const i = item as Record<string, Json>;
                      return <span key={idx}>{String(i.name)} ×{String(i.qty)}{idx < orderItems.length - 1 ? ", " : ""}</span>;
                    })}
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <p className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleString("mn-MN")}</p>
                    <div className="flex gap-2">
                      {order.status === "pending" && (
                        <button onClick={() => updateOrderStatus.mutate({ id: order.id, status: "confirmed" })} className="px-3 py-1 text-xs border border-blue-300 text-blue-700 rounded-sm hover:bg-blue-50">
                          Батлах
                        </button>
                      )}
                      {order.status === "confirmed" && (
                        <button onClick={() => updateOrderStatus.mutate({ id: order.id, status: "delivered" })} className="px-3 py-1 text-xs border border-green-300 text-green-700 rounded-sm hover:bg-green-50">
                          Хүргэсэн
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Products */}
        {tab === "products" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-2xl font-bold">Бүтээгдэхүүн</h2>
              <button onClick={() => { resetForm(); setShowForm(!showForm); }} className="bg-primary text-primary-foreground px-5 py-2 text-sm font-medium rounded-sm hover:opacity-90 transition-opacity">
                {showForm && !editingId ? "Болих" : "+ Шинэ нэмэх"}
              </button>
            </div>

            {showForm && (
              <form onSubmit={(e) => { e.preventDefault(); saveProduct.mutate(); }} className="border border-border rounded-sm p-5 bg-card space-y-4 mb-6">
                <h3 className="font-display font-semibold text-sm">{editingId ? "Бүтээгдэхүүн засах" : "Шинэ бүтээгдэхүүн"}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input placeholder="Нэр" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="border border-input px-4 py-2.5 text-sm rounded-sm bg-background focus:outline-none focus:ring-1 focus:ring-ring" required />
                  <input placeholder="Үнэ (₮)" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="border border-input px-4 py-2.5 text-sm rounded-sm bg-background focus:outline-none focus:ring-1 focus:ring-ring" required />
                </div>
                <textarea placeholder="Тайлбар" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full border border-input px-4 py-2.5 text-sm rounded-sm bg-background focus:outline-none focus:ring-1 focus:ring-ring" rows={2} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Зураг</label>
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="w-full text-sm file:mr-3 file:px-3 file:py-2 file:border-0 file:bg-primary file:text-primary-foreground file:text-xs file:font-medium file:rounded-sm file:cursor-pointer" />
                  </div>
                  <input placeholder="Ангилал" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="border border-input px-4 py-2.5 text-sm rounded-sm bg-background focus:outline-none focus:ring-1 focus:ring-ring self-end" />
                </div>
                <div className="flex gap-3">
                  <button type="submit" disabled={saveProduct.isPending} className="bg-primary text-primary-foreground px-8 py-2.5 text-sm font-medium rounded-sm hover:opacity-90 transition-opacity disabled:opacity-50">
                    {saveProduct.isPending ? "Хадгалж байна..." : editingId ? "Хадгалах" : "Нэмэх"}
                  </button>
                  {editingId && (
                    <button type="button" onClick={resetForm} className="px-6 py-2.5 text-sm border border-input rounded-sm hover:bg-muted transition-colors">Болих</button>
                  )}
                </div>
              </form>
            )}

            <div className="space-y-3">
              {products.map((product) => (
                <div key={product.id} className="border border-border rounded-sm p-5 bg-card flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    {product.image_url && product.image_url.startsWith("http") && (
                      <img src={product.image_url} alt={product.name} className="w-12 h-12 object-cover rounded-sm flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-display font-semibold">{product.name}</p>
                        {!product.is_active && <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-sm">Идэвхгүй</span>}
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5 truncate">{product.description}</p>
                      <p className="font-display font-semibold mt-1">₮{Number(product.price).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => startEdit(product)} className="px-3 py-2 text-xs font-medium rounded-sm border border-input hover:bg-muted transition-colors">
                      Засах
                    </button>
                    <button
                      onClick={() => toggleActive.mutate({ id: product.id, is_active: product.is_active })}
                      className={`px-3 py-2 text-xs font-medium rounded-sm border transition-colors ${product.is_active ? "border-destructive/30 text-destructive hover:bg-destructive/5" : "border-green-300 text-green-700 hover:bg-green-50"}`}
                    >
                      {product.is_active ? "Идэвхгүй" : "Идэвхжүүлэх"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Returns */}
        {tab === "returns" && (
          <div className="space-y-4">
            <h2 className="font-display text-2xl font-bold mb-4">Буцаалтууд</h2>
            {returns.length === 0 && <p className="text-muted-foreground">Буцаалт байхгүй.</p>}
            {returns.map((ret: any) => (
              <div key={ret.id} className="border border-border rounded-sm p-5 bg-card">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-2">
                  <div>
                    <p className="font-display font-semibold">{ret.customer_name}</p>
                    <p className="text-sm text-muted-foreground">{ret.phone} {ret.email && `· ${ret.email}`}</p>
                  </div>
                  <span className={`inline-block px-3 py-1 text-xs font-medium rounded-sm ${statusColors[ret.status] || "bg-muted text-muted-foreground"}`}>
                    {statusLabels[ret.status] || ret.status}
                  </span>
                </div>
                <p className="text-sm mt-1">{ret.reason}</p>
                <div className="flex items-center justify-between mt-3">
                  <p className="text-xs text-muted-foreground">{new Date(ret.created_at).toLocaleString("mn-MN")}</p>
                  {ret.status === "pending" && (
                    <div className="flex gap-2">
                      <button onClick={() => updateReturnStatus.mutate({ id: ret.id, status: "approved" })} className="px-3 py-1 text-xs border border-green-300 text-green-700 rounded-sm hover:bg-green-50">
                        Зөвшөөрөх
                      </button>
                      <button onClick={() => updateReturnStatus.mutate({ id: ret.id, status: "rejected" })} className="px-3 py-1 text-xs border border-red-300 text-red-700 rounded-sm hover:bg-red-50">
                        Татгалзах
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
