import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteShell } from "@/components/site-shell";
import { Card } from "@/components/ui/card";
import { authApi, bookingsApi, hotelsApi } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import type { Booking, Hotel } from "@/lib/types";
import { Calendar } from "lucide-react";

export const Route = createFileRoute("/bookings")({
  beforeLoad: () => {
    if (typeof window !== "undefined" && !authApi.current()) {
      throw redirect({ to: "/login", search: { redirect: "/bookings" } });
    }
  },
  head: () => ({ meta: [{ title: "My bookings — Stayhaven" }] }),
  component: BookingsPage,
});

function BookingsPage() {
  const { session } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [hotels, setHotels] = useState<Record<string, Hotel>>({});

  useEffect(() => {
    if (!session) return;
    bookingsApi.byUser(session.user.id).then(async (bs) => {
      setBookings(bs);
      const map: Record<string, Hotel> = {};
      for (const b of bs) {
        if (!map[b.hotelId]) {
          const h = await hotelsApi.byId(b.hotelId);
          if (h) map[b.hotelId] = h;
        }
      }
      setHotels(map);
    });
  }, [session]);

  return (
    <SiteShell>
      <div className="mx-auto max-w-5xl px-6 py-12">
        <h1 className="font-serif text-4xl tracking-tight">Your bookings</h1>
        <p className="mt-1 text-muted-foreground">Upcoming and past stays.</p>

        {bookings.length === 0 ? (
          <Card className="mt-8 p-12 text-center text-muted-foreground">
            You haven't booked anything yet. <Link to="/hotels" className="text-primary hover:underline">Browse stays</Link>.
          </Card>
        ) : (
          <div className="mt-8 space-y-4">
            {bookings.map((b) => {
              const h = hotels[b.hotelId];
              return (
                <Card key={b.id} className="flex flex-col gap-4 border-border/60 p-5 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-4">
                    {h && (
                      <img src={h.photos[0]} alt={h.name} className="h-20 w-28 rounded-lg object-cover" loading="lazy" />
                    )}
                    <div>
                      <h3 className="font-serif text-xl">{h?.name ?? "Property"}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{h?.city}</p>
                      <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        {b.dateStart} → {b.dateEnd} · Rooms {b.roomNumbers.join(", ")}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-serif text-2xl">${b.totalPrice}</div>
                    <div className="text-xs text-muted-foreground">Confirmed</div>
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