import { createContext, useContext, useState, ReactNode, useCallback } from "react";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  qty: number;
};

type CartCtx = {
  items: CartItem[];
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  total: number;
  count: number;
};

const Ctx = createContext<CartCtx | null>(null);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const add: CartCtx["add"] = useCallback((item, qty = 1) => {
    setItems((prev) => {
      const ex = prev.find((p) => p.id === item.id);
      if (ex) return prev.map((p) => (p.id === item.id ? { ...p, qty: p.qty + qty } : p));
      return [...prev, { ...item, qty }];
    });
    setIsOpen(true);
  }, []);

  const remove = useCallback((id: string) => setItems((p) => p.filter((i) => i.id !== id)), []);
  const setQty = useCallback(
    (id: string, qty: number) =>
      setItems((p) => (qty <= 0 ? p.filter((i) => i.id !== id) : p.map((i) => (i.id === id ? { ...i, qty } : i)))),
    []
  );
  const clear = useCallback(() => setItems([]), []);

  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  const count = items.reduce((s, i) => s + i.qty, 0);

  return (
    <Ctx.Provider
      value={{
        items,
        isOpen,
        open: () => setIsOpen(true),
        close: () => setIsOpen(false),
        toggle: () => setIsOpen((o) => !o),
        add,
        remove,
        setQty,
        clear,
        total,
        count,
      }}
    >
      {children}
    </Ctx.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
