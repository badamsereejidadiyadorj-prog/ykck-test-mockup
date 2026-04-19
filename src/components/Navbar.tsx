import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Search, X } from "lucide-react";
import { useCart } from "@/context/CartContext";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { count, open } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    window.dispatchEvent(new CustomEvent("product-search", { detail: query.trim() }));
    scrollTo("products");
    setSearchOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-background/90 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <span className="font-display text-2xl font-bold tracking-tight">
          ГОЁЛ<sup className="text-xs align-super text-muted-foreground">®</sup>
        </span>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide">
          <button onClick={() => scrollTo("products")} className="text-muted-foreground hover:text-foreground transition-colors duration-200">Бүтээгдэхүүн</button>
          <button onClick={() => scrollTo("craft")} className="text-muted-foreground hover:text-foreground transition-colors duration-200">Технологи</button>
          <button onClick={() => scrollTo("order")} className="text-muted-foreground hover:text-foreground transition-colors duration-200">Захиалга</button>
          <button onClick={() => scrollTo("returns")} className="text-muted-foreground hover:text-foreground transition-colors duration-200">Буцаалт</button>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setSearchOpen((s) => !s)}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-sm"
            aria-label="Хайх"
          >
            {searchOpen ? <X className="w-4 h-4" /> : <Search className="w-4 h-4" />}
          </button>
          <button
            onClick={open}
            className="relative p-2 text-muted-foreground hover:text-foreground transition-colors rounded-sm"
            aria-label="Сагс"
          >
            <ShoppingBag className="w-4 h-4" />
            {count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {count}
              </span>
            )}
          </button>
          <Link to="/admin" className="text-muted-foreground hover:text-foreground text-sm transition-colors hidden md:block">
            Админ
          </Link>
        </div>
      </div>

      {searchOpen && (
        <div className="border-t border-border bg-background/95 backdrop-blur-md">
          <form onSubmit={submitSearch} className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-3">
            <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Бүтээгдэхүүн хайх..."
              className="flex-1 bg-transparent border-0 outline-none text-sm placeholder:text-muted-foreground"
            />
            <button type="submit" className="text-xs font-medium text-primary hover:opacity-80">Хайх</button>
          </form>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
