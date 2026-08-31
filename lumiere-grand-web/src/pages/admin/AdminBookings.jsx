import { useState } from "react";

import { AdminLayout } from "@/pages/admin/AdminLayout";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useAllBookings, useUpdateBooking } from "@/hooks/useBookings";
import { useRoomTypes } from "@/hooks/useRoomTypes";
import { currency, formatDate } from "@/lib/booking";
import { cn } from "@/lib/utils";

const statusStyle = {
  pending: "bg-warning/15 text-warning",
  confirmed: "bg-success/15 text-success",
  "checked-in": "bg-info/15 text-info",
  "checked-out": "bg-muted text-muted-foreground",
  cancelled: "bg-destructive/15 text-destructive",
};

export default function AdminBookings() {
  const { data: bookings = [], isLoading } = useAllBookings();
  const { data: roomTypes = [] } = useRoomTypes();
  const updateBooking = useUpdateBooking();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const roomName = (id) => roomTypes.find((r) => r.id === id)?.name || "Room";

  const filtered = bookings
    .filter((b) => statusFilter === "all" || b.status === statusFilter)
    .filter((b) => !search || b.reference.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <AdminLayout>
      <h1 className="font-serif text-3xl">Bookings</h1>
      <p className="mt-1 text-sm text-muted-foreground">All reservations across the property.</p>

      <div className="mt-6 flex flex-wrap gap-3">
        <Input placeholder="Search by reference…" value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-xs" />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="checked-in">Checked-in</SelectItem>
            <SelectItem value="checked-out">Checked-out</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mt-6 overflow-x-auto border border-border bg-card">
        <table className="w-full min-w-[760px] text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
              <th className="p-4">Reference</th>
              <th className="p-4">Room</th>
              <th className="p-4">Dates</th>
              <th className="p-4">Total</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td className="p-4 text-muted-foreground" colSpan={5}>
                  Loading…
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td className="p-4 text-muted-foreground" colSpan={5}>
                  No bookings found.
                </td>
              </tr>
            ) : (
              filtered.map((b) => (
                <tr key={b.id} className="border-b border-border last:border-0">
                  <td className="p-4 font-mono text-xs">{b.reference}</td>
                  <td className="p-4">{roomName(b.roomTypeId)}</td>
                  <td className="p-4 text-xs text-muted-foreground">
                    {formatDate(b.checkIn)} → {formatDate(b.checkOut)}
                  </td>
                  <td className="p-4 font-serif text-gold">{currency(b.total)}</td>
                  <td className="p-4">
                    <Select value={b.status} onValueChange={(v) => updateBooking.mutate({ id: b.id, patch: { status: v } })}>
                      <SelectTrigger className={cn("h-8 w-36 border-0 px-2.5 text-xs font-medium capitalize", statusStyle[b.status])}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="checked-in">Checked-in</SelectItem>
                        <SelectItem value="checked-out">Checked-out</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
