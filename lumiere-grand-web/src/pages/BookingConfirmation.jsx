import { Link, useParams } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";

import { Section } from "@/components/common/Section";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { useMyBookings } from "@/hooks/useBookings";
import { useRoomType } from "@/hooks/useRoomTypes";
import { currency, formatDate } from "@/lib/booking";

export default function BookingConfirmationPage() {
  const { id } = useParams();
  const { data: bookings = [], isLoading } = useMyBookings();
  const booking = bookings.find((b) => b.id === id);
  const { data: roomType } = useRoomType(booking?.roomTypeId);

  return (
    <SiteLayout>
      <Section className="pt-32">
        <div className="mx-auto max-w-lg text-center">
          <CheckCircle2 className="mx-auto size-12 text-success" />
          <h1 className="display mt-6 text-3xl sm:text-4xl">Booking Confirmed</h1>

          {isLoading ? (
            <p className="mt-4 text-sm text-muted-foreground">Loading your confirmation…</p>
          ) : !booking ? (
            <p className="mt-4 text-sm text-muted-foreground">We couldn't find that booking.</p>
          ) : (
            <div className="mt-8 border border-border bg-card p-6 text-left">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">Reference</p>
                <p className="font-mono text-sm">{booking.reference}</p>
              </div>
              <div className="hairline my-4" />
              <p className="font-serif text-xl">{roomType?.name || "Your room"}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {formatDate(booking.checkIn)} → {formatDate(booking.checkOut)}
              </p>
              <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                <span className="text-sm text-muted-foreground">Total</span>
                <span className="font-serif text-2xl text-gold">{currency(booking.total)}</span>
              </div>
            </div>
          )}

          <div className="mt-8 flex justify-center gap-3">
            <Button asChild variant="gold">
              <Link to="/my-bookings">View My Bookings</Link>
            </Button>
            <Button asChild variant="quiet">
              <Link to="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      </Section>
    </SiteLayout>
  );
}
