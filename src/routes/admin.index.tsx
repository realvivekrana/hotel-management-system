import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { bookingsApi, hotelsApi, roomsApi, usersApi } from "@/lib/api";

export const Route = createFileRoute("/admin/")({
  component: AdminOverview,
});

function AdminOverview() {
  const [stats, setStats] = useState({ hotels: 0, rooms: 0, users: 0, bookings: 0, revenue: 0 });

  useEffect(() => {
    Promise.all([hotelsApi.list(), roomsApi.list(), usersApi.list(), bookingsApi.list()]).then(
      ([h, r, u, b]) => {
        setStats({
          hotels: h.length,
          rooms: r.length,
          users: u.length,
          bookings: b.length,
          revenue: b.reduce((s, x) => s + x.totalPrice, 0),
        });
      },
    );
  }, []);

  const tiles = [
    { label: "Hotels", value: stats.hotels },
    { label: "Rooms", value: stats.rooms },
    { label: "Users", value: stats.users },
    { label: "Bookings", value: stats.bookings },
    { label: "Revenue", value: `$${stats.revenue}` },
  ];

  return (
    <div>
      <h1 className="font-serif text-4xl tracking-tight">Overview</h1>
      <p className="mt-1 text-muted-foreground">A quick read on what's happening.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tiles.map((t) => (
          <Card key={t.label} className="border-border/60 p-6">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">{t.label}</p>
            <p className="mt-2 font-serif text-4xl">{t.value}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}