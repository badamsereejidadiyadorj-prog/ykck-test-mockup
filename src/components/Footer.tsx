const Footer = () => (
  <footer className="relative py-16 border-t border-border overflow-hidden">
    {/* Vertical accent */}
    <div className="absolute left-6 sm:left-10 top-1/2 -translate-y-1/2">
      <span
        className="font-display text-[9px] tracking-[0.4em] uppercase text-concrete"
        style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
      >
        YKCK® 2026
      </span>
    </div>

    <div className="max-w-7xl mx-auto px-6 sm:px-16 lg:px-24 flex flex-col sm:flex-row items-center justify-between gap-4">
      <span className="font-display text-lg font-bold tracking-tight">
        YKCK<sup className="text-xs align-super text-muted-foreground">®</sup>
      </span>
      <p className="text-sm text-muted-foreground">Design in Swiss — Crafted for everywhere</p>
      <p className="text-xs text-muted-foreground">© 2026 YKCK. All rights reserved.</p>
    </div>
  </footer>
);

export default Footer;
