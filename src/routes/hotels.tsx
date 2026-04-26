import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { SiteShell } from "@/components/site-shell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { hotelsApi } from "@/lib/api";
import type { Hotel } from "@/lib/types";
import { MapPin, Star } from "lucide-react";

const searchSchema = z.object({
  city: fallback(z.string(), "").default(""),
  checkIn: fallback(z.string(), "").default(""),
  checkOut: fallback(z.string(), "").default(""),
  guests: fallback(z.number(), 2).default(2),
  min: fallback(z.number(), 0).default(0),
  max: fallback(z.number(), 1000).default(1000),
});

export const Route = createFileRoute("/hotels")({
  validateSearch: zodValidator(searchSchema),
  head: () => ({
    meta: [
      { title: "Search stays — Stayhaven" },
      { name: "description", content: "Filter by destination, dates, guests and price." },
    ],
  }),
  component: HotelsPage,
});

function HotelsPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/hotels" });
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);

  // local form state (mirrors URL)
  const [city, setCity] = useState(search.city);
  const [checkIn, setCheckIn] = useState(search.checkIn);
  const [checkOut, setCheckOut] = useState(search.checkOut);
  const [guests, setGuests] = useState(search.guests);
  const [range, setRange] = useState<[number, number]>([search.min, search.max]);

  useEffect(() => {
    setLoading(true);
    hotelsApi
      .list({ city: search.city || undefined, minPrice: search.min, maxPrice: search.max })
      .then((h) => {
        setHotels(h);
        setLoading(false);
      });
  }, [search.city, search.min, search.max]);

  const apply = () => {
    navigate({
      search: {
        city: city || undefined,
        checkIn: checkIn || undefined,
        checkOut: checkOut || undefined,
        guests,
        min: range[0],
        max: range[1],
      },
    });
  };

  return (
    <SiteShell>
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
          {/* Filters */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <Card className="border-border/60 p-6">
              <h2 className="font-serif text-2xl">Search</h2>
              <div className="mt-6 space-y-4">
                <div>
                  <Label htmlFor="city">Destination</Label>
                  <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Anywhere" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="ci">Check-in</Label>
                    <Input id="ci" type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="co">Check-out</Label>
                    <Input id="co" type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
                  </div>
                </div>
                <div>
                  <Label htmlFor="g">Guests</Label>
                  <Input id="g" type="number" min={1} value={guests} onChange={(e) => setGuests(Number(e.target.value))} />
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <Label>Price per night</Label>
                    <span className="text-xs text-muted-foreground">${range[0]} – ${range[1]}</span>
                  </div>
                  <Slider
                    min={0}
                    max={1000}
                    step={20}
                    value={range}
                    onValueChange={(v) => setRange([v[0], v[1]] as [number, number])}
                    className="mt-3"
                  />
                </div>
                <Button className="w-full" onClick={apply}>Apply filters</Button>
              </div>
            </Card>
          </aside>

          {/* Results */}
          <section>
            <div className="flex items-end justify-between">
              <div>
                <h1 className="font-serif text-4xl tracking-tight">
                  {search.city ? `Stays in ${search.city}` : "All stays"}
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  {loading ? "Searching…" : `${hotels.length} ${hotels.length === 1 ? "property" : "properties"}`}
                </p>
              </div>
            </div>

            <div className="mt-8 space-y-5">
              {hotels.map((h) => (
                <Link key={h.id} to="/hotels/$id" params={{ id: h.id }}>
                  <Card className="group flex flex-col overflow-hidden border-border/60 transition-all hover:shadow-[var(--shadow-elegant)] md:flex-row">
                    <div className="aspect-[4/3] overflow-hidden md:aspect-auto md:w-72 md:shrink-0">
                      <img
                        src={h.photos[0]}
                        alt={h.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div className="flex flex-1 flex-col justify-between p-6">
                      <div>
                        <p className="text-xs uppercase tracking-widest text-muted-foreground">{h.type}</p>
                        <h3 className="mt-1 font-serif text-2xl">{h.name}</h3>
                        <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5" /> {h.address}, {h.city} · {h.distance}
                        </p>
                        <p className="mt-3 text-sm text-muted-foreground">{h.description}</p>
                      </div>
                      <div className="mt-5 flex items-end justify-between">
                        <span className="flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-xs font-medium text-accent-foreground">
                          <Star className="h-3 w-3 fill-current" /> {h.rating} Excellent
                        </span>
                        <div className="text-right">
                          <div className="font-serif text-2xl">${h.cheapestPrice}</div>
                          <div className="text-xs text-muted-foreground">per night · taxes included</div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
              {!loading && hotels.length === 0 && (
                <Card className="p-12 text-center text-muted-foreground">
                  No stays match your filters. Try widening the price range.
                </Card>
              )}
            </div>
          </section>
        </div>
      </div>
    </SiteShell>
  );
}