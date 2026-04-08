const Footer = () => (
  <footer className="relative py-16 border-t border-border overflow-hidden">
    {/* Vertical accent */}
    <div className="absolute left-6 sm:left-10 top-1/2 -translate-y-1/2">
      <span
        className="font-display text-[9px] tracking-[0.4em] uppercase text-concrete"
        style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
      >
        ГОЁЛ® 2026
      </span>
    </div>

    <div className="max-w-7xl mx-auto px-6 sm:px-16 lg:px-24 flex flex-col sm:flex-row items-center justify-between gap-4">
      <span className="font-display text-lg font-bold tracking-tight">
        ГОЁЛ<sup className="text-xs align-super text-muted-foreground">®</sup>
      </span>
      <p className="text-sm text-muted-foreground">Монголд бүтээгдсэн — Таны арьсанд зориулсан</p>
      <p className="text-xs text-muted-foreground">© 2026 ГОЁЛ. Бүх эрх хуулиар хамгаалагдсан.</p>
    </div>
  </footer>
);

export default Footer;
