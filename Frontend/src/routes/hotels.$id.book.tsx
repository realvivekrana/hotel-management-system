import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { SiteShell } from "@/components/site-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { authApi, bookingsApi, getDatesInRange, hotelsApi, roomsApi } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import type { Hotel, Room } from "@/lib/types";
import { toast } from "sonner";
import { ArrowLeft, BedDouble, Calendar, Users } from "lucide-react";

export const Route = createFileRoute("/hotels/$id/book")({
  beforeLoad: ({ params }) => {
    if (typeof window !== "undefined" && !authApi.current()) {
      throw redirect({ to: "/login", search: { redirect: `/hotels/${params.id}/book` } });
    }
  },
  head: () => ({ meta: [{ title: "Reserve — Royal Stay Inn" }] }),
  component: BookingPage,
});

function BookingPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { session } = useAuth();
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [checkIn, setCheckIn] = useState(() => new Date().toISOString().slice(0, 10));
  const [checkOut, setCheckOut] = useState(() => { const d = new Date(); d.setDate(d.getDate() + 2); return d.toISOString().slice(0, 10); });
  const [selected, setSelected] = useState<Record<string, number[]>>({});

  useEffect(() => {
    hotelsApi.byId(id).then(setHotel);
    roomsApi.byHotel(id).then(setRooms);
  }, [id]);

  const nights = useMemo(() => {
    const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime();
    return Math.max(1, Math.ceil(diff / 86400000));
  }, [checkIn, checkOut]);

  const total = useMemo(() => {
    let t = 0;
    for (const r of rooms) t += (selected[r.id] || []).length * r.price * nights;
    return t;
  }, [rooms, selected, nights]);

  const toggle = (roomId: string, n: number) => {
    setSelected((prev) => {
      const cur = prev[roomId] || [];
      return { ...prev, [roomId]: cur.includes(n) ? cur.filter((x) => x !== n) : [...cur, n] };
    });
  };

  const onReserve = async () => {
    if (!session) return;
    const entries = Object.entries(selected).filter(([, nums]) => nums.length > 0);
    if (!entries.length) { toast.error("Pick at least one room"); return; }
    try {
      const dates = getDatesInRange(checkIn, checkOut);
      for (const [roomId, nums] of entries) {
        for (const n of nums) await roomsApi.markUnavailable(roomId, n, dates);
        await bookingsApi.create({ userId: session.user.id, hotelId: id, roomId, roomNumbers: nums, dateStart: checkIn, dateEnd: checkOut, totalPrice: nums.length * (rooms.find((r) => r.id === roomId)?.price ?? 0) * nights });
      }
      toast.success("Reservation confirmed! 🎉");
      navigate({ to: "/bookings" });
    } catch (e) { toast.error((e as Error).message); }
  };

  if (!hotel) {
    return (
      <SiteShell>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        </div>
      </SiteShell>
    );
  }

  return (
    <SiteShell>
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-6 sm:py-10">
        {/* Back */}
        <button onClick={() => navigate({ to: "/hotels/$id", params: { id } })}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors group mb-5">
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back to property
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-1">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-600">Reserve</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl tracking-tight">{hotel.name}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{hotel.address}, {hotel.city}</p>

        <div className="mt-7 grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Left */}
          <div className="space-y-5">
            {/* Dates */}
            <Card className="border-2 border-amber-400/20 p-5">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="h-5 w-5 text-primary" />
                <h2 className="font-serif text-xl">Your Stay</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ci" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Check-in</Label>
                  <Input id="ci" type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="co" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Check-out</Label>
                  <Input id="co" type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="mt-1.5" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 px-4 py-3 rounded-xl bg-amber-50 border border-amber-400/20">
                <Calendar className="h-4 w-4 text-amber-600" />
                <span className="text-sm font-semibold text-amber-700">{nights} night{nights !== 1 ? "s" : ""} selected</span>
              </div>
            </Card>

            {/* Rooms */}
            <Card className="border-2 border-amber-400/20 p-5">
              <div className="flex items-center gap-2 mb-5">
                <BedDouble className="h-5 w-5 text-primary" />
                <h2 className="font-serif text-xl">Select Rooms</h2>
              </div>
              {rooms.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">No rooms available for this property.</p>
              ) : (
                <div className="space-y-4">
                  {rooms.map((r) => (
                    <div key={r.id} className="rounded-2xl border-2 border-border/50 hover:border-amber-400/40 transition-colors p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <h3 className="font-serif text-lg">{r.title}</h3>
                          <p className="mt-1 text-sm text-muted-foreground">{r.description}</p>
                          <p className="mt-1.5 flex items-center gap-1 text-xs text-muted-foreground">
                            <Users className="h-3 w-3" /> Sleeps {r.maxPeople}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="font-serif text-xl text-primary">₹{(r.price * 83).toLocaleString("en-IN")}</div>
                          <div className="text-xs text-muted-foreground">/ night</div>
                        </div>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {r.roomNumbers.map((n) => {
                          const checked = (selected[r.id] || []).includes(n.number);
                          return (
                            <label key={n.number}
                              className={`flex items-center gap-2 rounded-xl border-2 px-3 py-2 text-sm cursor-pointer transition-all ${checked ? "border-primary bg-primary/8 text-primary font-semibold" : "border-border hover:border-amber-400/50"}`}>
                              <Checkbox checked={checked} onCheckedChange={() => toggle(r.id, n.number)} />
                              Room {n.number}
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Summary */}
          <div>
            <Card className="border-2 border-amber-400/20 p-5 shadow-xl lg:sticky lg:top-24">
              <h3 className="font-serif text-xl mb-5">Order Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-border/40">
                  <span className="text-muted-foreground">Nights</span>
                  <span className="font-semibold">{nights}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border/40">
                  <span className="text-muted-foreground">Rooms selected</span>
                  <span className="font-semibold">{Object.values(selected).flat().length}</span>
                </div>
                <div className="flex items-baseline justify-between pt-3">
                  <span className="text-muted-foreground">Total</span>
                  <span className="font-serif text-3xl text-primary">₹{(total * 83).toLocaleString("en-IN")}</span>
                </div>
              </div>
              <Button onClick={onReserve} size="lg" className="mt-6 w-full bg-gradient-to-r from-primary to-primary/90 font-bold shadow-lg hover:shadow-xl transition-all">
                Confirm Reservation
              </Button>
              <p className="mt-3 text-center text-xs text-muted-foreground">You won't be charged yet · Free cancellation</p>
            </Card>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
