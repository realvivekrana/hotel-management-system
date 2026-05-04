import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { hotelsApi, roomsApi } from "@/lib/api";
import type { Hotel, Room } from "@/lib/types";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/rooms")({
  component: AdminRooms,
});

function AdminRooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    hotelId: "",
    title: "",
    price: 100,
    maxPeople: 2,
    description: "",
    numbers: "",
  });

  const refresh = () => Promise.all([roomsApi.list(), hotelsApi.list()]).then(([r, h]) => {
    setRooms(r);
    setHotels(h);
  });
  useEffect(() => { refresh(); }, []);

  const create = async () => {
    if (!form.hotelId || !form.title) return toast.error("Hotel and title required");
    const numbers = form.numbers.split(",").map((n) => Number(n.trim())).filter((n) => !isNaN(n));
    if (numbers.length === 0) return toast.error("Add at least one room number");
    await roomsApi.create({
      hotelId: form.hotelId,
      title: form.title,
      price: Number(form.price),
      maxPeople: Number(form.maxPeople),
      description: form.description,
      roomNumbers: numbers.map((n) => ({ number: n, unavailableDates: [] })),
    });
    toast.success("Room created");
    setOpen(false);
    setForm({ hotelId: "", title: "", price: 100, maxPeople: 2, description: "", numbers: "" });
    refresh();
  };

  const remove = async (id: string) => {
    await roomsApi.remove(id);
    toast.success("Room removed");
    refresh();
  };

  return (
    <div>
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-serif text-4xl tracking-tight">Rooms</h1>
          <p className="mt-1 text-muted-foreground">Manage room types and inventory.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-1 h-4 w-4" /> New room</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create room</DialogTitle></DialogHeader>
            <div className="grid gap-4">
              <div>
                <Label className="mb-1.5 block">Hotel</Label>
                <Select value={form.hotelId} onValueChange={(v) => setForm({...form, hotelId: v})}>
                  <SelectTrigger><SelectValue placeholder="Choose hotel" /></SelectTrigger>
                  <SelectContent>
                    {hotels.map((h) => <SelectItem key={h.id} value={h.id}>{h.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div><Label className="mb-1.5 block">Title</Label><Input value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label className="mb-1.5 block">Price/night</Label><Input type="number" value={form.price} onChange={(e) => setForm({...form, price: Number(e.target.value)})} /></div>
                <div><Label className="mb-1.5 block">Max people</Label><Input type="number" value={form.maxPeople} onChange={(e) => setForm({...form, maxPeople: Number(e.target.value)})} /></div>
              </div>
              <div><Label className="mb-1.5 block">Description</Label><Textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} /></div>
              <div><Label className="mb-1.5 block">Room numbers (comma separated)</Label><Input placeholder="101, 102, 103" value={form.numbers} onChange={(e) => setForm({...form, numbers: e.target.value})} /></div>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={create}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mt-8 space-y-3">
        {rooms.map((r) => {
          const h = hotels.find((x) => x.id === r.hotelId);
          return (
            <Card key={r.id} className="flex items-center justify-between border-border/60 p-4">
              <div>
                <h3 className="font-medium">{r.title}</h3>
                <p className="text-xs text-muted-foreground">
                  {h?.name ?? "—"} · ${r.price}/night · sleeps {r.maxPeople} · {r.roomNumbers.length} rooms
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => remove(r.id)} className="text-destructive">
                <Trash2 className="h-4 w-4" />
              </Button>
            </Card>
          );
        })}
      </div>
    </div>
  );
}