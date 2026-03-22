import { useState, useEffect } from "react";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-background/90 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <span className="font-display text-2xl font-bold tracking-tight">
          YKCK<sup className="text-xs align-super text-muted-foreground">®</sup>
        </span>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide">
          <button onClick={() => scrollTo("products")} className="text-muted-foreground hover:text-foreground transition-colors duration-200">Products</button>
          <button onClick={() => scrollTo("craft")} className="text-muted-foreground hover:text-foreground transition-colors duration-200">Craft</button>
          <button onClick={() => scrollTo("order")} className="text-muted-foreground hover:text-foreground transition-colors duration-200">Order</button>
        </div>
        <button
          onClick={() => scrollTo("order")}
          className="bg-primary text-primary-foreground px-5 py-2 text-sm font-medium tracking-wide hover:opacity-90 active:scale-[0.97] transition-all duration-200"
        >
          Shop Now
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
