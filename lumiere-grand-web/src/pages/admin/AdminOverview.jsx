import { BedDouble, CalendarCheck, DoorOpen, MessageSquareWarning, TrendingUp, Users } from "lucide-react";

import { AdminLayout } from "@/pages/admin/AdminLayout";
import { useDashboardStats } from "@/hooks/useContent";
import { useAllBookings } from "@/hooks/useBookings";
import { useRoomTypes } from "@/hooks/useRoomTypes";
import { currency, formatDate } from "@/lib/booking";

const cards = [
  { key: "revenue", label: "Revenue Collected", icon: TrendingUp, format: (v) => currency(v, 0) },
  { key: "activeBookings", label: "Active Bookings", icon: CalendarCheck },
  { key: "occupancyRate", label: "Occupancy Rate", icon: DoorOpen, format: (v) => `${v}%` },
  { key: "totalGuests", label: "Registered Guests", icon: Users },
];

export default function AdminOverview() {
  const { data: stats } = useDashboardStats();
  const { data: bookings = [] } = useAllBookings();
  const { data: roomTypes = [] } = useRoomTypes();

  const recent = [...bookings].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 6);
  const roomName = (id) => roomTypes.find((r) => r.id === id)?.name || "Room";

  return (
    <AdminLayout>
      <h1 className="font-serif text-3xl">Overview</h1>
      <p className="mt-1 text-sm text-muted-foreground">Snapshot of how the property is performing.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.key} className="border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{c.label}</p>
              <c.icon className="size-4 text-gold" />
            </div>
            <p className="mt-3 font-serif text-3xl">
              {stats ? (c.format ? c.format(stats[c.key]) : stats[c.key]) : "—"}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="border border-border bg-card p-5 lg:col-span-2">
          <p className="font-serif text-lg">Recent Bookings</p>
          <div className="mt-4 space-y-3">
            {recent.length === 0 ? (
              <p className="text-sm text-muted-foreground">No bookings yet.</p>
            ) : (
              recent.map((b) => (
                <div key={b.id} className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0">
                  <div>
                    <p className="text-sm font-medium">{roomName(b.roomTypeId)}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(b.checkIn)} → {formatDate(b.checkOut)}
                    </p>
                  </div>
                  <span className="font-serif text-gold">{currency(b.total)}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="border border-border bg-card p-5">
          <p className="font-serif text-lg">Today</p>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Arrivals</dt>
              <dd className="font-medium">{stats?.arrivalsToday ?? "—"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Departures</dt>
              <dd className="font-medium">{stats?.departuresToday ?? "—"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Room Types Listed</dt>
              <dd className="font-medium">{stats?.roomTypeCount ?? "—"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="inline-flex items-center gap-1.5 text-muted-foreground">
                <MessageSquareWarning className="size-3.5" /> Reviews to moderate
              </dt>
              <dd className="font-medium">{stats?.pendingReviews ?? "—"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="inline-flex items-center gap-1.5 text-muted-foreground">
                <BedDouble className="size-3.5" /> Total rooms
              </dt>
              <dd className="font-medium">{stats?.totalRooms ?? "—"}</dd>
            </div>
          </dl>
        </div>
      </div>
    </AdminLayout>
  );
}
