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
import { hotelsApi } from "@/lib/api";
import type { Hotel } from "@/lib/types";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/hotels")({
  component: AdminHotels,
});

const blank = {
  name: "",
  type: "Hotel",
  city: "",
  address: "",
  distance: "",
  title: "",
  description: "",
  cheapestPrice: 100,
  rating: 8.5,
  photo: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200",
  amenities: "",
};

function AdminHotels() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(blank);

  const refresh = () => hotelsApi.list().then(setHotels);
  useEffect(() => { refresh(); }, []);

  const create = async () => {
    if (!form.name || !form.city) return toast.error("Name and city are required");
    await hotelsApi.create({
      name: form.name,
      type: form.type,
      city: form.city,
      address: form.address,
      distance: form.distance,
      title: form.title,
      description: form.description,
      cheapestPrice: Number(form.cheapestPrice),
      rating: Number(form.rating),
      photos: [form.photo],
      featured: false,
      rooms: [],
      amenities: form.amenities.split(",").map((s) => s.trim()).filter(Boolean),
    });
    toast.success("Hotel created");
    setOpen(false);
    setForm(blank);
    refresh();
  };

  const remove = async (id: string) => {
    await hotelsApi.remove(id);
    toast.success("Hotel removed");
    refresh();
  };

  return (
    <div>
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-serif text-4xl tracking-tight">Hotels</h1>
          <p className="mt-1 text-muted-foreground">Add, edit and remove properties.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-1 h-4 w-4" /> New hotel</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader><DialogTitle>Create hotel</DialogTitle></DialogHeader>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Name"><Input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} /></Field>
              <Field label="Type"><Input value={form.type} onChange={(e) => setForm({...form, type: e.target.value})} /></Field>
              <Field label="City"><Input value={form.city} onChange={(e) => setForm({...form, city: e.target.value})} /></Field>
              <Field label="Address"><Input value={form.address} onChange={(e) => setForm({...form, address: e.target.value})} /></Field>
              <Field label="Distance"><Input value={form.distance} onChange={(e) => setForm({...form, distance: e.target.value})} /></Field>
              <Field label="Cheapest price"><Input type="number" value={form.cheapestPrice} onChange={(e) => setForm({...form, cheapestPrice: Number(e.target.value)})} /></Field>
              <Field label="Rating"><Input type="number" step="0.1" value={form.rating} onChange={(e) => setForm({...form, rating: Number(e.target.value)})} /></Field>
              <Field label="Photo URL"><Input value={form.photo} onChange={(e) => setForm({...form, photo: e.target.value})} /></Field>
              <div className="sm:col-span-2"><Field label="Title"><Input value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} /></Field></div>
              <div className="sm:col-span-2"><Field label="Description"><Textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} /></Field></div>
              <div className="sm:col-span-2"><Field label="Amenities (comma separated)"><Input value={form.amenities} onChange={(e) => setForm({...form, amenities: e.target.value})} /></Field></div>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={create}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mt-8 space-y-3">
        {hotels.map((h) => (
          <Card key={h.id} className="flex items-center justify-between border-border/60 p-4">
            <div className="flex items-center gap-4">
              <img src={h.photos[0]} alt="" className="h-14 w-20 rounded-md object-cover" />
              <div>
                <h3 className="font-medium">{h.name}</h3>
                <p className="text-xs text-muted-foreground">{h.type} · {h.city} · ${h.cheapestPrice}/night</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => remove(h.id)} className="text-destructive">
              <Trash2 className="h-4 w-4" />
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="mb-1.5 block">{label}</Label>
      {children}
    </div>
  );
}