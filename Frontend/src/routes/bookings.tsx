import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteShell } from "@/components/site-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { authApi, bookingsApi, hotelsApi } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import type { Booking, Hotel } from "@/lib/types";
import { ArrowRight, Calendar, MapPin } from "lucide-react";

export const Route = createFileRoute("/bookings")({
  beforeLoad: () => {
    if (typeof window !== "undefined" && !authApi.current()) {
      throw redirect({ to: "/login", search: { redirect: "/bookings" } });
    }
  },
  head: () => ({ meta: [{ title: "My Bookings — Royal Stay Inn" }] }),
  component: BookingsPage,
});

function BookingsPage() {
  const { session } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [hotels, setHotels] = useState<Record<string, Hotel>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) return;
    bookingsApi.byUser(session.user.id).then(async (bs) => {
      setBookings(bs);
      const map: Record<string, Hotel> = {};
      for (const b of bs) {
        if (!map[b.hotelId]) { const h = await hotelsApi.byId(b.hotelId); if (h) map[b.hotelId] = h; }
      }
      setHotels(map);
      setLoading(false);
    });
  }, [session]);

  return (
    <SiteShell>
      {/* Page header */}
      <div className="bg-gradient-to-br from-primary/8 to-amber-500/5 border-b border-amber-400/15 px-4 sm:px-6 py-8 sm:py-10">
        <div className="mx-auto max-w-5xl">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-1 w-8 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full" />
            <span className="text-xs font-bold uppercase tracking-widest text-amber-600">Dashboard</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl tracking-tight">My Bookings</h1>
          <p className="mt-1 text-sm text-muted-foreground">Your upcoming and past stays</p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8 sm:py-10">
        {loading && (
          <div className="space-y-4">
            {[1, 2].map((i) => <div key={i} className="h-32 rounded-2xl bg-muted animate-pulse" />)}
          </div>
        )}

        {!loading && bookings.length === 0 && (
          <Card className="p-10 sm:p-16 text-center border-2 border-dashed border-amber-400/20">
            <div className="text-5xl mb-4">🏨</div>
            <h2 className="font-serif text-2xl">No bookings yet</h2>
            <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
              You haven't made any reservations. Explore our heritage properties and book your royal escape.
            </p>
            <Button asChild className="mt-6 bg-gradient-to-r from-primary to-primary/90 font-semibold shadow-md">
              <Link to="/hotels">Browse Properties <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </Card>
        )}

        {!loading && bookings.length > 0 && (
          <div className="space-y-4">
            {bookings.map((b) => {
              const h = hotels[b.hotelId];
              return (
                <Card key={b.id} className="overflow-hidden border-2 border-border/50 hover:border-amber-400/30 transition-all duration-300 hover:shadow-lg">
                  <div className="flex flex-col sm:flex-row">
                    {/* Image */}
                    {h && (
                      <div className="w-full sm:w-40 md:w-52 shrink-0 overflow-hidden">
                        <div className="aspect-[16/9] sm:aspect-auto sm:h-full">
                          <img src={h.photos[0]} alt={h.name} className="h-full w-full object-cover" loading="lazy" />
                        </div>
                      </div>
                    )}
                    {/* Content */}
                    <div className="flex flex-1 flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 sm:p-5">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-wider">
                            ✓ Confirmed
                          </span>
                        </div>
                        <h3 className="font-serif text-xl">{h?.name ?? "Property"}</h3>
                        <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5 shrink-0" /> {h?.city}
                        </p>
                        <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5 shrink-0" />
                          {b.dateStart} → {b.dateEnd} · Rooms {b.roomNumbers.join(", ")}
                        </p>
                      </div>
                      <div className="text-left sm:text-right shrink-0">
                        <div className="font-serif text-2xl sm:text-3xl text-primary">₹{(b.totalPrice * 83).toLocaleString("en-IN")}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">Total paid</div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </SiteShell>
  );
}
