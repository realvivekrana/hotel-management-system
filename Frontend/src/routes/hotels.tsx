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
import { ArrowRight, Filter, MapPin, Search, Star, X } from "lucide-react";

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
  head: () => ({ meta: [{ title: "Search Properties — Royal Stay Inn" }] }),
  component: HotelsPage,
});

function HotelsPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/hotels" });
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [city, setCity] = useState(search.city);
  const [checkIn, setCheckIn] = useState(search.checkIn);
  const [checkOut, setCheckOut] = useState(search.checkOut);
  const [guests, setGuests] = useState(search.guests);
  const [range, setRange] = useState<[number, number]>([search.min, search.max]);

  useEffect(() => {
    setLoading(true);
    hotelsApi.list({ city: search.city || undefined, minPrice: search.min, maxPrice: search.max }).then((h) => {
      setHotels(h);
      setLoading(false);
    });
  }, [search.city, search.min, search.max]);

  const apply = () => {
    navigate({ search: { city: city || undefined, checkIn: checkIn || undefined, checkOut: checkOut || undefined, guests, min: range[0], max: range[1] } });
    setFiltersOpen(false);
  };

  const FilterPanel = () => (
    <div className="space-y-5">
      <div>
        <Label htmlFor="city" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Destination</Label>
        <div className="relative mt-1.5">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} placeholder="City or region" className="pl-9" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="ci" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Check-in</Label>
          <Input id="ci" type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="co" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Check-out</Label>
          <Input id="co" type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="mt-1.5" />
        </div>
      </div>
      <div>
        <Label htmlFor="g" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Guests</Label>
        <Input id="g" type="number" min={1} value={guests} onChange={(e) => setGuests(Number(e.target.value))} className="mt-1.5" />
      </div>
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Price / Night</Label>
          <span className="text-sm font-bold text-primary">₹{(range[0] * 83).toLocaleString("en-IN")} – ₹{(range[1] * 83).toLocaleString("en-IN")}</span>
        </div>
        <Slider min={0} max={1000} step={20} value={range} onValueChange={(v) => setRange([v[0], v[1]] as [number, number])} />
      </div>
      <Button className="w-full bg-gradient-to-r from-primary to-primary/90 font-semibold shadow-md hover:shadow-lg transition-all" onClick={apply}>
        Apply Filters
      </Button>
    </div>
  );

  return (
    <SiteShell>
      {/* Page header */}
      <div className="bg-gradient-to-br from-primary/8 to-amber-500/5 border-b border-amber-400/15 px-4 sm:px-6 py-8 sm:py-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-1 w-8 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full" />
            <span className="text-xs font-bold uppercase tracking-widest text-amber-600">Explore</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div>
              <h1 className="font-serif text-3xl sm:text-4xl tracking-tight">
                {search.city ? `Stays in ${search.city}` : "All Properties"}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {loading ? "Searching…" : `${hotels.length} ${hotels.length === 1 ? "property" : "properties"} found`}
              </p>
            </div>
            {/* Mobile filter toggle */}
            <Button
              variant="outline"
              className="lg:hidden flex items-center gap-2 border-2 border-amber-400/30 font-semibold self-start sm:self-auto"
              onClick={() => setFiltersOpen(true)}
            >
              <Filter className="h-4 w-4" /> Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      {filtersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setFiltersOpen(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto animate-fadeInUp">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-2xl">Refine Search</h2>
              <button onClick={() => setFiltersOpen(false)} className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-muted">
                <X className="h-4 w-4" />
              </button>
            </div>
            <FilterPanel />
          </div>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block lg:sticky lg:top-24 lg:self-start">
            <Card className="border-2 border-amber-400/20 p-6 shadow-lg">
              <h2 className="font-serif text-2xl mb-6">Refine Search</h2>
              <FilterPanel />
            </Card>
          </aside>

          {/* Results */}
          <section className="space-y-4 sm:space-y-5">
            {loading && (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-48 sm:h-56 rounded-2xl bg-muted animate-pulse" />
                ))}
              </div>
            )}

            {!loading && hotels.map((h) => (
              <Link key={h.id} to="/hotels/$id" params={{ id: h.id }}>
                <Card className="group flex flex-col sm:flex-row overflow-hidden border-2 border-border/50 hover:border-amber-400/40 transition-all duration-400 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-0.5">
                  {/* Image */}
                  <div className="relative w-full sm:w-64 md:w-72 shrink-0 overflow-hidden">
                    <div className="aspect-[16/9] sm:aspect-auto sm:h-full">
                      <img src={h.photos[0]} alt={h.name} loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-primary shadow-md">
                      {h.type}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold flex items-center gap-1">
                        <MapPin className="h-3 w-3" />{h.address}, {h.city}
                      </p>
                      <h3 className="mt-1.5 font-serif text-xl sm:text-2xl group-hover:text-primary transition-colors">{h.name}</h3>
                      <p className="mt-1 text-xs text-muted-foreground">{h.distance}</p>
                      <p className="mt-2.5 text-sm text-muted-foreground leading-relaxed line-clamp-2">{h.description}</p>
                    </div>
                    <div className="mt-4 flex items-end justify-between gap-3 flex-wrap">
                      <span className="flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1.5 text-xs font-bold text-amber-700">
                        <Star className="h-3 w-3 fill-amber-500 text-amber-500" /> {h.rating} Excellent
                      </span>
                      <div className="text-right">
                        <div className="font-serif text-2xl sm:text-3xl text-primary">₹{(h.cheapestPrice * 83).toLocaleString("en-IN")}</div>
                        <div className="text-xs text-muted-foreground">per night · incl. taxes</div>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}

            {!loading && hotels.length === 0 && (
              <Card className="p-12 sm:p-16 text-center border-2 border-dashed border-amber-400/20">
                <div className="text-4xl mb-4">🏨</div>
                <p className="font-serif text-xl text-foreground">No properties found</p>
                <p className="text-sm text-muted-foreground mt-2">Try adjusting your search criteria or price range.</p>
                <Button className="mt-6" onClick={() => { setCity(""); setRange([0, 1000]); apply(); }}>
                  Clear Filters
                </Button>
              </Card>
            )}
          </section>
        </div>
      </div>
    </SiteShell>
  );
}
