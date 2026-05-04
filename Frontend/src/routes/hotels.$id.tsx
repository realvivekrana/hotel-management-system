import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteShell } from "@/components/site-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { hotelsApi } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import type { Hotel } from "@/lib/types";
import { ArrowLeft, Check, ChevronLeft, ChevronRight, MapPin, Star } from "lucide-react";

export const Route = createFileRoute("/hotels/$id")({
  head: () => ({ meta: [{ title: "Property Details — Royal Stay Inn" }] }),
  component: HotelDetailPage,
});

function HotelDetailPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { session } = useAuth();
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [active, setActive] = useState(0);

  useEffect(() => { hotelsApi.byId(id).then(setHotel); }, [id]);

  if (!hotel) {
    return (
      <SiteShell>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center space-y-3">
            <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto" />
            <p className="text-muted-foreground text-sm">Loading property…</p>
          </div>
        </div>
      </SiteShell>
    );
  }

  const onReserve = () => {
    if (!session) { navigate({ to: "/login", search: { redirect: `/hotels/${hotel.id}/book` } }); return; }
    navigate({ to: "/hotels/$id/book", params: { id: hotel.id } });
  };

  const prev = () => setActive((a) => (a - 1 + hotel.photos.length) % hotel.photos.length);
  const next = () => setActive((a) => (a + 1) % hotel.photos.length);

  return (
    <SiteShell>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-10">
        {/* Back */}
        <Link to="/hotels" className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors group">
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back to results
        </Link>

        {/* Title row */}
        <div className="mt-5 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-widest text-amber-600 font-bold">{hotel.type}</p>
            <h1 className="mt-1 font-serif text-3xl sm:text-4xl md:text-5xl tracking-tight leading-tight">{hotel.name}</h1>
            <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 shrink-0" /> {hotel.address}, {hotel.city}
            </p>
          </div>
          <span className="self-start flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-amber-500/30 shrink-0">
            <Star className="h-4 w-4 fill-current" /> {hotel.rating} Exceptional
          </span>
        </div>

        {/* Gallery */}
        <div className="mt-6 grid gap-3 md:grid-cols-4">
          {/* Main image with mobile swipe arrows */}
          <div className="md:col-span-3 relative group">
            <div className="aspect-[16/10] sm:aspect-[16/9] md:aspect-[16/10] overflow-hidden rounded-2xl">
              <img src={hotel.photos[active]} alt={hotel.name} className="h-full w-full object-cover transition-all duration-500" />
            </div>
            {/* Mobile nav arrows */}
            <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-white transition-all md:opacity-0 md:group-hover:opacity-100">
              <ChevronLeft className="h-5 w-5 text-primary" />
            </button>
            <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-white transition-all md:opacity-0 md:group-hover:opacity-100">
              <ChevronRight className="h-5 w-5 text-primary" />
            </button>
            {/* Dot indicators on mobile */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 md:hidden">
              {hotel.photos.map((_, i) => (
                <button key={i} onClick={() => setActive(i)} className={`h-1.5 rounded-full transition-all ${i === active ? "w-5 bg-white" : "w-1.5 bg-white/50"}`} />
              ))}
            </div>
          </div>
          {/* Thumbnails – hidden on mobile, shown on md+ */}
          <div className="hidden md:grid grid-cols-1 gap-3">
            {hotel.photos.map((p, i) => (
              <button key={p} onClick={() => setActive(i)}
                className={`aspect-square overflow-hidden rounded-xl transition-all duration-200 ${i === active ? "ring-2 ring-primary ring-offset-2" : "opacity-70 hover:opacity-100"}`}>
                <img src={p} alt="" loading="lazy" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="mt-8 sm:mt-12 grid gap-8 lg:grid-cols-[1fr_340px]">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl">{hotel.title}</h2>
            <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">{hotel.description}</p>

            <h3 className="mt-8 font-serif text-xl sm:text-2xl">What this place offers</h3>
            <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {hotel.amenities.map((a) => (
                <li key={a} className="flex items-center gap-2.5 text-sm p-2.5 rounded-xl bg-muted/40 hover:bg-amber-50 transition-colors">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-white shrink-0">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  {a}
                </li>
              ))}
            </ul>
          </div>

          {/* Booking card */}
          <div>
            <Card className="border-2 border-amber-400/20 p-5 sm:p-6 shadow-xl lg:sticky lg:top-24">
              <div className="flex items-baseline gap-1.5">
                <span className="font-serif text-3xl sm:text-4xl text-primary">₹{(hotel.cheapestPrice * 83).toLocaleString("en-IN")}</span>
                <span className="text-sm text-muted-foreground">/ night</span>
              </div>
              <p className="mt-1.5 text-sm text-muted-foreground">{hotel.distance} escape · taxes included</p>

              <div className="mt-5 grid grid-cols-2 gap-2 p-3 rounded-xl border-2 border-amber-400/20 bg-amber-50/50">
                <div className="border-r border-amber-400/20 pr-2">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Check-in</p>
                  <p className="text-sm font-semibold mt-0.5">Select date</p>
                </div>
                <div className="pl-2">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Check-out</p>
                  <p className="text-sm font-semibold mt-0.5">Select date</p>
                </div>
              </div>

              <Button onClick={onReserve} size="lg" className="mt-5 w-full bg-gradient-to-r from-primary to-primary/90 font-bold shadow-lg hover:shadow-xl hover:shadow-primary/30 transition-all text-base">
                {session ? "Reserve Now" : "Sign In to Reserve"}
              </Button>
              <div className="mt-4 space-y-2">
                {["Free cancellation", "No prepayment required", "Instant confirmation"].map((t) => (
                  <p key={t} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Check className="h-3.5 w-3.5 text-green-600 shrink-0" /> {t}
                  </p>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
