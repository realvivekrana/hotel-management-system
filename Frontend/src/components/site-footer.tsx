import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="border-t-2 border-amber-400/20 bg-gradient-to-b from-background to-primary/5">
      {/* Main Grid */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-2 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 group w-fit">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-serif text-xl shadow-lg shadow-primary/20">R</div>
              <div className="flex flex-col leading-none">
                <span className="font-serif text-lg text-primary">Royal Stay Inn</span>
                <span className="text-[9px] uppercase tracking-widest text-amber-600 font-semibold">Heritage Luxury</span>
              </div>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-xs">
              Experience the grandeur of India's finest heritage hotels. Royal hospitality, timeless elegance.
            </p>
            {/* Social */}
            <div className="mt-5 flex gap-2.5">
              {[
                { label: "Facebook", path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" },
                { label: "Instagram", path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z" },
                { label: "Twitter", path: "M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" },
              ].map((s) => (
                <a key={s.label} href="#" aria-label={s.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-amber-400/30 bg-amber-50 text-primary hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 hover:scale-110 hover:shadow-md hover:shadow-primary/30">
                  <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24"><path d={s.path} /></svg>
                </a>
              ))}
            </div>
          </div>

          {/* Discover */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-foreground mb-4 flex items-center gap-2">
              <span className="h-1 w-4 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full inline-block" />
              Discover
            </h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              {["Destinations", "Luxury Hotels", "Heritage Resorts", "Palace Hotels", "Beach Resorts"].map((l) => (
                <li key={l}>
                  <a href="#" className="hover:text-primary transition-colors hover:translate-x-1 inline-block duration-200">{l}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-foreground mb-4 flex items-center gap-2">
              <span className="h-1 w-4 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full inline-block" />
              Company
            </h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              {["About Us", "Careers", "Press & Media", "Partnerships", "Blog"].map((l) => (
                <li key={l}>
                  <a href="#" className="hover:text-primary transition-colors hover:translate-x-1 inline-block duration-200">{l}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-foreground mb-4 flex items-center gap-2">
              <span className="h-1 w-4 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full inline-block" />
              Support
            </h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              {["Help Center", "Contact Us", "Privacy Policy", "Terms of Service", "Cancellation"].map((l) => (
                <li key={l}>
                  <a href="#" className="hover:text-primary transition-colors hover:translate-x-1 inline-block duration-200">{l}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-12 rounded-2xl bg-gradient-to-r from-primary/8 to-amber-500/8 border-2 border-amber-400/20 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
            <div className="flex-1">
              <h4 className="font-serif text-xl text-foreground">Stay in the loop</h4>
              <p className="mt-1 text-sm text-muted-foreground">Get exclusive deals and heritage travel stories.</p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 sm:w-56 rounded-xl border-2 border-amber-400/30 bg-white px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors"
              />
              <button className="shrink-0 rounded-xl bg-gradient-to-r from-primary to-primary/90 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:shadow-lg hover:shadow-primary/30 transition-all">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-amber-400/20 px-4 sm:px-6 py-5">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Royal Stay Inn. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span className="text-amber-500">✦</span>
            <span>Crafted with excellence for luxury travelers</span>
            <span className="text-amber-500">✦</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
