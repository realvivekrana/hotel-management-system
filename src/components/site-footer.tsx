export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-card/40">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-md bg-primary text-primary-foreground font-serif">S</div>
            <span className="font-serif text-lg">Stayhaven</span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Curated stays from cliffside resorts to forest cabins.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-medium">Explore</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>Destinations</li>
            <li>Boutique hotels</li>
            <li>Villas & cabins</li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-medium">Company</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>About</li>
            <li>Press</li>
            <li>Careers</li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-medium">Help</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>Contact</li>
            <li>Trust & safety</li>
            <li>Cancellation</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60 px-6 py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Stayhaven. Crafted with care.
      </div>
    </footer>
  );
}