import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { LogOut, Menu, Shield, User as UserIcon, X } from "lucide-react";

export function SiteHeader() {
  const { session, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b-2 border-amber-400/20 bg-white/95 backdrop-blur-xl shadow-md shadow-primary/5">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          {/* Logo */}
          <Link to="/" onClick={close} className="flex items-center gap-2.5 group shrink-0">
            <div className="relative grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-primary via-primary-glow to-primary text-primary-foreground font-serif text-xl shadow-lg shadow-primary/30 transition-all duration-300 group-hover:scale-105">
              <span className="relative z-10">R</span>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-amber-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-serif text-lg tracking-tight bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent">
                Royal Stay Inn
              </span>
              <span className="text-[9px] uppercase tracking-widest text-amber-600 font-semibold">
                Heritage Luxury
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-7">
            {[
              { to: "/hotels", label: "Properties" },
              ...(session ? [{ to: "/bookings", label: "My Bookings" }] : []),
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="text-sm font-semibold text-muted-foreground hover:text-primary relative group transition-colors"
                activeProps={{ className: "text-primary" }}
              >
                {item.label}
                <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-500 to-amber-600 group-hover:w-full transition-all duration-300 rounded-full" />
              </Link>
            ))}
            {session?.user.role === "admin" && (
              <Link
                to="/admin"
                className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-primary relative group transition-colors"
                activeProps={{ className: "text-primary" }}
              >
                <Shield className="h-3.5 w-3.5" /> Admin
                <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-500 to-amber-600 group-hover:w-full transition-all duration-300 rounded-full" />
              </Link>
            )}
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-2">
            {session ? (
              <>
                <div className="flex items-center gap-2 rounded-full border-2 border-amber-400/30 bg-gradient-to-r from-amber-50 to-white px-4 py-2 shadow-sm">
                  <UserIcon className="h-3.5 w-3.5 text-primary" />
                  <span className="text-sm font-semibold">{session.user.username}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => { logout(); navigate({ to: "/" }); }}
                  className="hover:bg-destructive/10 hover:text-destructive rounded-full"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild className="font-semibold rounded-full">
                  <Link to="/login">Sign In</Link>
                </Button>
                <Button size="sm" asChild className="bg-gradient-to-r from-primary to-primary/90 shadow-md hover:shadow-lg transition-all rounded-full px-5 font-semibold">
                  <Link to="/signup">Get Started</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden flex items-center justify-center h-10 w-10 rounded-xl border-2 border-amber-400/30 bg-amber-50 text-primary transition-all hover:bg-amber-100"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {open && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={close} />
          {/* Panel */}
          <div className="absolute top-0 right-0 h-full w-72 bg-white shadow-2xl flex flex-col animate-slideInRight">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-amber-400/20 bg-gradient-to-r from-primary/5 to-amber-50">
              <div className="flex items-center gap-2">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-serif text-lg shadow-md">R</div>
                <span className="font-serif text-base text-primary">Royal Stay Inn</span>
              </div>
              <button onClick={close} className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-primary/10">
                <X className="h-4 w-4 text-primary" />
              </button>
            </div>

            {/* Nav Links */}
            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
              {[
                { to: "/", label: "Home", icon: "🏠" },
                { to: "/hotels", label: "Properties", icon: "🏨" },
                ...(session ? [{ to: "/bookings", label: "My Bookings", icon: "📋" }] : []),
                ...(session?.user.role === "admin" ? [{ to: "/admin", label: "Admin", icon: "⚙️" }] : []),
              ].map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={close}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-foreground hover:bg-amber-50 hover:text-primary transition-all"
                  activeProps={{ className: "bg-primary/10 text-primary" }}
                >
                  <span className="text-base">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Auth Section */}
            <div className="px-4 py-5 border-t border-amber-400/20 space-y-3">
              {session ? (
                <>
                  <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-amber-50 border border-amber-400/30">
                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white font-semibold text-sm">
                      {session.user.username[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{session.user.username}</p>
                      <p className="text-xs text-muted-foreground">Logged in</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full border-destructive/30 text-destructive hover:bg-destructive/5"
                    onClick={() => { logout(); navigate({ to: "/" }); close(); }}
                  >
                    <LogOut className="h-4 w-4 mr-2" /> Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" asChild className="w-full border-primary/30 font-semibold">
                    <Link to="/login" onClick={close}>Sign In</Link>
                  </Button>
                  <Button asChild className="w-full bg-gradient-to-r from-primary to-primary/90 font-semibold shadow-md">
                    <Link to="/signup" onClick={close}>Get Started</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
