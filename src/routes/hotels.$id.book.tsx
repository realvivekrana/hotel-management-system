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

export const Route = createFileRoute("/hotels/$id/book")({
  beforeLoad: ({ params }) => {
    if (typeof window !== "undefined" && !authApi.current()) {
      throw redirect({ to: "/login", search: { redirect: `/hotels/${params.id}/book` } });
    }
  },
  head: () => ({ meta: [{ title: "Reserve — Stayhaven" }] }),
  component: BookingPage,
});

function BookingPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { session } = useAuth();
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [checkIn, setCheckIn] = useState(() => new Date().toISOString().slice(0, 10));
  const [checkOut, setCheckOut] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().slice(0, 10);
  });
  const [selected, setSelected] = useState<Record<string, number[]>>({}); // roomId -> roomNumbers

  useEffect(() => {
    hotelsApi.byId(id).then(setHotel);
    roomsApi.byHotel(id).then(setRooms);
  }, [id]);

  const nights = useMemo(() => {
    const start = new Date(checkIn).getTime();
    const end = new Date(checkOut).getTime();
    return Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
  }, [checkIn, checkOut]);

  const total = useMemo(() => {
    let t = 0;
    for (const r of rooms) {
      const count = (selected[r.id] || []).length;
      t += count * r.price * nights;
    }
    return t;
  }, [rooms, selected, nights]);

  const toggle = (roomId: string, n: number) => {
    setSelected((prev) => {
      const cur = prev[roomId] || [];
      const next = cur.includes(n) ? cur.filter((x) => x !== n) : [...cur, n];
      return { ...prev, [roomId]: next };
    });
  };

  const onReserve = async () => {
    if (!session) return;
    const dates = getDatesInRange(checkIn, checkOut);
    const entries = Object.entries(selected).filter(([, nums]) => nums.length > 0);
    if (entries.length === 0) {
      toast.error("Pick at least one room");
      return;
    }
    try {
      for (const [roomId, nums] of entries) {
        for (const n of nums) {
          await roomsApi.markUnavailable(roomId, n, dates);
        }
        await bookingsApi.create({
          userId: session.user.id,
          hotelId: id,
          roomId,
          roomNumbers: nums,
          dateStart: checkIn,
          dateEnd: checkOut,
          totalPrice: nums.length * (rooms.find((r) => r.id === roomId)?.price ?? 0) * nights,
        });
      }
      toast.success("Reservation confirmed");
      navigate({ to: "/bookings" });
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  if (!hotel) {
    return <SiteShell><div className="mx-auto max-w-3xl p-10 text-muted-foreground">Loading…</div></SiteShell>;
  }

  return (
    <SiteShell>
      <div className="mx-auto max-w-5xl px-6 py-12">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">Reserve</p>
        <h1 className="mt-1 font-serif text-4xl tracking-tight">{hotel.name}</h1>
        <p className="mt-1 text-muted-foreground">{hotel.address}, {hotel.city}</p>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <Card className="border-border/60 p-6">
              <h2 className="font-serif text-xl">Your stay</h2>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ci">Check-in</Label>
                  <Input id="ci" type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="co">Check-out</Label>
                  <Input id="co" type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
                </div>
              </div>
            </Card>

            <Card className="border-border/60 p-6">
              <h2 className="font-serif text-xl">Select rooms</h2>
              {rooms.length === 0 ? (
                <p className="mt-3 text-sm text-muted-foreground">No rooms available for this property.</p>
              ) : (
                <div className="mt-5 space-y-6">
                  {rooms.map((r) => (
                    <div key={r.id} className="rounded-xl border border-border/60 p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-serif text-lg">{r.title}</h3>
                          <p className="mt-1 text-sm text-muted-foreground">{r.description}</p>
                          <p className="mt-1 text-xs text-muted-foreground">Sleeps {r.maxPeople}</p>
                        </div>
                        <div className="text-right">
                          <div className="font-serif text-xl">${r.price}</div>
                          <div className="text-xs text-muted-foreground">/ night</div>
                        </div>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-3">
                        {r.roomNumbers.map((n) => {
                          const checked = (selected[r.id] || []).includes(n.number);
                          return (
                            <label key={n.number} className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm cursor-pointer transition ${checked ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}>
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

          <Card className="h-fit border-border/60 p-6 lg:sticky lg:top-24">
            <h3 className="font-serif text-xl">Order summary</h3>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between"><span>Nights</span><span>{nights}</span></div>
              <div className="flex justify-between"><span>Rooms</span><span>{Object.values(selected).flat().length}</span></div>
            </div>
            <div className="mt-5 border-t border-border pt-4">
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-muted-foreground">Total</span>
                <span className="font-serif text-3xl">${total}</span>
              </div>
            </div>
            <Button onClick={onReserve} size="lg" className="mt-5 w-full">Confirm reservation</Button>
            <p className="mt-3 text-center text-xs text-muted-foreground">You won't be charged yet.</p>
          </Card>
        </div>
      </div>
    </SiteShell>
  );
}