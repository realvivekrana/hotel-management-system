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
  head: () => ({ meta: [{ title: "Admin — Stayhaven" }] }),
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
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
          <aside>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Admin</p>
            <h2 className="mt-1 font-serif text-2xl">Workspace</h2>
            <nav className="mt-6 space-y-1">
              {nav.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  activeOptions={{ exact: item.exact }}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                  activeProps={{ className: "bg-accent text-accent-foreground font-medium" }}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
            </nav>
          </aside>
          <section>
            <Outlet />
          </section>
        </div>
      </div>
    </SiteShell>
  );
}