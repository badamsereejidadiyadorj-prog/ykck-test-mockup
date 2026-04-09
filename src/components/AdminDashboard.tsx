import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";

interface Order {
  id: string;
  customer_name: string;
  total_amount: number;
  status: string;
  created_at: string;
  items: any;
}

interface Props {
  orders: Order[];
  products: any[];
  returns: any[];
}

const COLORS = ["hsl(350,30%,45%)", "hsl(350,25%,65%)", "hsl(20,12%,42%)", "hsl(30,20%,60%)"];

const AdminDashboard = ({ orders, products, returns }: Props) => {
  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total_amount), 0);
  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const pendingReturns = returns.filter((r) => r.status === "pending").length;

  // Status distribution
  const statusData = [
    { name: "Хүлээгдэж буй", value: orders.filter((o) => o.status === "pending").length },
    { name: "Баталгаажсан", value: orders.filter((o) => o.status === "confirmed").length },
    { name: "Хүргэгдсэн", value: orders.filter((o) => o.status === "delivered").length },
  ].filter((d) => d.value > 0);

  // Revenue by day (last 7 days)
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const key = d.toISOString().slice(0, 10);
    const dayOrders = orders.filter((o) => o.created_at.slice(0, 10) === key);
    return {
      day: `${d.getMonth() + 1}/${d.getDate()}`,
      revenue: dayOrders.reduce((s, o) => s + Number(o.total_amount), 0),
      count: dayOrders.length,
    };
  });

  // Top products
  const productSales: Record<string, number> = {};
  orders.forEach((o) => {
    const items = Array.isArray(o.items) ? o.items : [];
    items.forEach((item: any) => {
      productSales[item.name] = (productSales[item.name] || 0) + (item.qty || 1);
    });
  });
  const topProducts = Object.entries(productSales)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, qty]) => ({ name, qty }));

  const stats = [
    { label: "Нийт орлого", value: `₮${totalRevenue.toLocaleString()}` },
    { label: "Захиалга", value: orders.length },
    { label: "Хүлээгдэж буй", value: pendingOrders },
    { label: "Бүтээгдэхүүн", value: products.length },
    { label: "Буцаалт", value: pendingReturns },
  ];

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="border border-border rounded-sm p-4 bg-card">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">{s.label}</p>
            <p className="font-display text-xl font-bold mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue chart */}
        <div className="border border-border rounded-sm p-5 bg-card">
          <h3 className="font-display font-semibold text-sm mb-4">Сүүлийн 7 хоногийн орлого</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={last7}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(30,12%,87%)" />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v: number) => `₮${v.toLocaleString()}`} />
              <Line type="monotone" dataKey="revenue" stroke="hsl(350,30%,45%)" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Status pie */}
        <div className="border border-border rounded-sm p-5 bg-card">
          <h3 className="font-display font-semibold text-sm mb-4">Захиалгын төлөв</h3>
          {statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {statusData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-muted-foreground text-sm text-center py-16">Мэдээлэл байхгүй</p>
          )}
        </div>

        {/* Top products */}
        <div className="border border-border rounded-sm p-5 bg-card lg:col-span-2">
          <h3 className="font-display font-semibold text-sm mb-4">Шилдэг бүтээгдэхүүнүүд</h3>
          {topProducts.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={topProducts}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(30,12%,87%)" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="qty" fill="hsl(350,25%,65%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-muted-foreground text-sm text-center py-12">Борлуулалтын мэдээлэл байхгүй</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
