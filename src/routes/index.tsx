import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { hotelsApi } from "@/lib/api";
import type { Hotel } from "@/lib/types";
import { ArrowRight, MapPin, Search, Star, Users } from "lucide-react";
import heroImg from "@/assets/hero-hotel.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Stayhaven — Find your perfect stay" },
      { name: "description", content: "Hand-picked hotels, villas and cabins worldwide. Search by destination and dates." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const navigate = useNavigate();
  const [city, setCity] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [featured, setFeatured] = useState<Hotel[]>([]);

  useEffect(() => {
    hotelsApi.featured().then(setFeatured);
  }, []);

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({
      to: "/hotels",
      search: {
        city: city || undefined,
        checkIn: checkIn || undefined,
        checkOut: checkOut || undefined,
        guests,
      },
    });
  };

  return (
    <SiteShell>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImg}
            alt="Resort at golden hour"
            className="h-full w-full object-cover"
            width={1920}
            height={1280}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/20 to-background" />
        </div>
        <div className="relative mx-auto max-w-7xl px-6 pb-32 pt-24 md:pb-44 md:pt-36">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/80 px-3 py-1 text-xs uppercase tracking-widest text-muted-foreground backdrop-blur">
              Curated stays · 60+ countries
            </span>
            <h1 className="mt-6 font-serif text-5xl leading-[1.05] tracking-tight md:text-7xl">
              Where the world<br />slows down.
            </h1>
            <p className="mt-5 max-w-lg text-lg text-muted-foreground">
              Hand-picked hotels, villas and cabins for travelers who value quiet luxury and a good view.
            </p>
          </div>

          {/* Search bar */}
          <form
            onSubmit={onSearch}
            className="relative mt-12 grid gap-2 rounded-2xl border border-border bg-card p-3 shadow-[var(--shadow-elegant)] md:mt-16 md:grid-cols-[1.2fr_1fr_1fr_0.7fr_auto] md:gap-0 md:p-2"
          >
            <div className="flex items-center gap-2 px-3 md:border-r md:border-border">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <Input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Where to?"
                className="border-0 shadow-none focus-visible:ring-0 px-0"
              />
            </div>
            <div className="flex items-center gap-2 px-3 md:border-r md:border-border">
              <span className="text-xs uppercase tracking-wider text-muted-foreground">In</span>
              <Input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="border-0 shadow-none focus-visible:ring-0 px-0"
              />
            </div>
            <div className="flex items-center gap-2 px-3 md:border-r md:border-border">
              <span className="text-xs uppercase tracking-wider text-muted-foreground">Out</span>
              <Input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="border-0 shadow-none focus-visible:ring-0 px-0"
              />
            </div>
            <div className="flex items-center gap-2 px-3">
              <Users className="h-4 w-4 text-muted-foreground" />
              <Input
                type="number"
                min={1}
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="border-0 shadow-none focus-visible:ring-0 px-0 w-16"
              />
            </div>
            <Button type="submit" size="lg" className="rounded-xl">
              <Search className="mr-2 h-4 w-4" /> Search
            </Button>
          </form>
        </div>
      </section>

      {/* Featured */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-serif text-4xl tracking-tight">Featured stays</h2>
            <p className="mt-2 text-muted-foreground">A few places we keep coming back to.</p>
          </div>
          <Link
            to="/hotels"
            className="hidden items-center gap-1 text-sm text-primary hover:underline md:inline-flex"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((h) => (
            <Link key={h.id} to="/hotels/$id" params={{ id: h.id }}>
              <Card className="group overflow-hidden border-border/60 transition-all hover:shadow-[var(--shadow-elegant)]">
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={h.photos[0]}
                    alt={h.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-muted-foreground">{h.type} · {h.city}</p>
                      <h3 className="mt-1 font-serif text-xl">{h.name}</h3>
                    </div>
                    <span className="flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground">
                      <Star className="h-3 w-3 fill-current" /> {h.rating}
                    </span>
                  </div>
                  <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{h.title}</p>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-lg font-semibold">${h.cheapestPrice}</span>
                    <span className="text-xs text-muted-foreground">/ night</span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Value prop strip */}
      <section className="border-y border-border/60 bg-card/50">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-3">
          {[
            { t: "Visited & vetted", d: "Every property is personally reviewed before it joins the collection." },
            { t: "Transparent pricing", d: "What you see is what you pay. No hidden resort fees, ever." },
            { t: "Real concierge", d: "Message a human from booking through check-out." },
          ].map((b) => (
            <div key={b.t}>
              <div className="h-px w-10 bg-primary" />
              <h3 className="mt-4 font-serif text-2xl">{b.t}</h3>
              <p className="mt-2 text-muted-foreground">{b.d}</p>
            </div>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
