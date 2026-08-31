import { Link } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";

import { Section } from "@/components/common/Section";
import { PageHeader, SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/lib/auth";
import { useCancelBooking, useMyBookings } from "@/hooks/useBookings";
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

export default function MyBookingsPage() {
  const { user } = useAuth();
  const { data: bookings = [], isLoading } = useMyBookings();
  const { data: roomTypes = [] } = useRoomTypes();
  const cancelBooking = useCancelBooking();
  const [tab, setTab] = useState("upcoming");

  const today = new Date().toISOString().slice(0, 10);
  const upcoming = bookings.filter((b) => b.checkOut >= today && b.status !== "cancelled");
  const past = bookings.filter((b) => b.checkOut < today || b.status === "cancelled");
  const list = tab === "upcoming" ? upcoming : past;

  const roomName = (id) => roomTypes.find((r) => r.id === id)?.name || "Room";

  return (
    <SiteLayout>
      <PageHeader eyebrow="My Account" title={`Welcome back, ${user?.name?.split(" ")[0] || "Guest"}`} />
      <Section>
        <div className="flex gap-2 border-b border-border">
          {[
            { id: "upcoming", label: `Upcoming (${upcoming.length})` },
            { id: "past", label: `Past & Cancelled (${past.length})` },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "border-b-2 px-1 py-3 text-sm font-medium transition-colors",
                tab === t.id ? "border-gold text-foreground" : "border-transparent text-muted-foreground"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="mt-8 space-y-4">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading your bookings…</p>
          ) : list.length === 0 ? (
            <div className="border border-dashed border-border py-20 text-center">
              <p className="font-serif text-2xl">Nothing here yet</p>
              <Button asChild variant="gold" className="mt-6">
                <Link to="/availability">Book a Room</Link>
              </Button>
            </div>
          ) : (
            list.map((b) => (
              <div key={b.id} className="flex flex-col gap-4 border border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <p className="font-serif text-lg">{roomName(b.roomTypeId)}</p>
                    <span className={cn("rounded-full px-2.5 py-0.5 text-[11px] font-medium capitalize", statusStyle[b.status])}>
                      {b.status}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {formatDate(b.checkIn)} → {formatDate(b.checkOut)} · Ref {b.reference}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-serif text-xl text-gold">{currency(b.total)}</span>
                  {b.status === "pending" || b.status === "confirmed" ? (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          Cancel
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Cancel this booking?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will cancel your reservation for {roomName(b.roomTypeId)}. This can't be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Keep booking</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={async () => {
                              await cancelBooking.mutateAsync(b.id);
                              toast.success("Booking cancelled");
                            }}
                          >
                            Yes, cancel
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  ) : null}
                </div>
              </div>
            ))
          )}
        </div>
      </Section>
    </SiteLayout>
  );
}
