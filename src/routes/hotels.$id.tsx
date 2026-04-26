import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteShell } from "@/components/site-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { hotelsApi } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import type { Hotel } from "@/lib/types";
import { Check, MapPin, Star } from "lucide-react";

export const Route = createFileRoute("/hotels/$id")({
  head: () => ({
    meta: [{ title: "Property — Stayhaven" }],
  }),
  component: HotelDetailPage,
});

function HotelDetailPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { session } = useAuth();
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    hotelsApi.byId(id).then(setHotel);
  }, [id]);

  if (!hotel) {
    return (
      <SiteShell>
        <div className="mx-auto max-w-7xl px-6 py-20 text-muted-foreground">Loading…</div>
      </SiteShell>
    );
  }

  const onReserve = () => {
    if (!session) {
      navigate({ to: "/login", search: { redirect: `/hotels/${hotel.id}/book` } });
      return;
    }
    navigate({ to: "/hotels/$id/book", params: { id: hotel.id } });
  };

  return (
    <SiteShell>
      <div className="mx-auto max-w-7xl px-6 py-10">
        <Link to="/hotels" className="text-sm text-muted-foreground hover:text-foreground">← Back to results</Link>

        <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">{hotel.type}</p>
            <h1 className="mt-1 font-serif text-5xl tracking-tight">{hotel.name}</h1>
            <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" /> {hotel.address}, {hotel.city}
            </p>
          </div>
          <span className="flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground">
            <Star className="h-3.5 w-3.5 fill-current" /> {hotel.rating}
          </span>
        </div>

        {/* Gallery */}
        <div className="mt-8 grid gap-3 md:grid-cols-4">
          <div className="md:col-span-3">
            <div className="aspect-[16/10] overflow-hidden rounded-2xl">
              <img
                src={hotel.photos[active]}
                alt={hotel.name}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 md:grid-cols-1">
            {hotel.photos.map((p, i) => (
              <button
                key={p}
                onClick={() => setActive(i)}
                className={`aspect-square overflow-hidden rounded-xl transition ${i === active ? "ring-2 ring-primary" : "opacity-80 hover:opacity-100"}`}
              >
                <img src={p} alt="" loading="lazy" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_360px]">
          <div>
            <h2 className="font-serif text-3xl">{hotel.title}</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">{hotel.description}</p>

            <h3 className="mt-10 font-serif text-2xl">What this place offers</h3>
            <ul className="mt-4 grid grid-cols-2 gap-3">
              {hotel.amenities.map((a) => (
                <li key={a} className="flex items-center gap-2 text-sm">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-accent text-accent-foreground">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  {a}
                </li>
              ))}
            </ul>
          </div>

          <Card className="h-fit border-border/60 p-6 lg:sticky lg:top-24">
            <div className="flex items-baseline gap-1">
              <span className="font-serif text-3xl">${hotel.cheapestPrice}</span>
              <span className="text-sm text-muted-foreground">/ night</span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">Perfect for a {hotel.distance.toLowerCase()} escape.</p>
            <Button onClick={onReserve} size="lg" className="mt-5 w-full">
              {session ? "Reserve a room" : "Sign in to reserve"}
            </Button>
            <p className="mt-3 text-center text-xs text-muted-foreground">Free cancellation · No prepayment</p>
          </Card>
        </div>
      </div>
    </SiteShell>
  );
}