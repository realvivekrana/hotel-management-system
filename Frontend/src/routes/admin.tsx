import { createFileRoute, Link, Outlet, redirect } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";
import { authApi } from "@/lib/api";
import { Building2, DoorOpen, LayoutDashboard, Users } from "lucide-react";

export const Route = createFileRoute("/admin")({
  beforeLoad: () => {
    if (typeof window === "undefined") return;
    const s = authApi.current();
    if (!s) throw redirect({ to: "/login", search: { redirect: "/admin" } });
    if (s.user.role !== "admin") throw redirect({ to: "/" });
  },
  head: () => ({ meta: [{ title: "Admin Dashboard — Royal Stay Inn" }] }),
  component: AdminLayout,
});

const nav = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/admin/hotels", label: "Hotels", icon: Building2, exact: false },
  { to: "/admin/rooms", label: "Rooms", icon: DoorOpen, exact: false },
  { to: "/admin/users", label: "Users", icon: Users, exact: false },
] as const;

function AdminLayout() {
  return (
    <SiteShell>
      {/* Admin header */}
      <div className="bg-gradient-to-br from-primary/10 to-amber-500/5 border-b-2 border-amber-400/15 px-4 sm:px-6 py-6 sm:py-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center gap-2 mb-1">
            <div className="h-1 w-8 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full" />
            <span className="text-xs font-bold uppercase tracking-widest text-amber-600">Admin</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl tracking-tight">Workspace</h1>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-8">
        {/* Mobile nav tabs */}
        <div className="flex gap-1 overflow-x-auto pb-1 mb-6 lg:hidden scrollbar-hide">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.exact }}
              className="flex items-center gap-1.5 shrink-0 rounded-xl px-4 py-2.5 text-sm font-semibold text-muted-foreground transition-all hover:bg-amber-50 hover:text-primary border-2 border-transparent"
              activeProps={{ className: "bg-primary/10 text-primary border-primary/20" }}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border-2 border-amber-400/20 bg-white p-3 shadow-lg">
              <nav className="space-y-1">
                {nav.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    activeOptions={{ exact: item.exact }}
                    className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-muted-foreground transition-all hover:bg-amber-50 hover:text-primary"
                    activeProps={{ className: "bg-primary/10 text-primary" }}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </aside>

          {/* Content */}
          <section className="min-w-0">
            <Outlet />
          </section>
        </div>
      </div>
    </SiteShell>
  );
}
