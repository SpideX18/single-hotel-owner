import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Section } from "@/components/common/Section";
import { PageHeader, SiteLayout } from "@/components/site/SiteLayout";
import { PriceSummary } from "@/components/site/PriceSummary";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/auth";
import { useRoomType } from "@/hooks/useRoomTypes";
import { useCreateBooking } from "@/hooks/useBookings";
import { useHotelSettings } from "@/hooks/useHotel";
import { computePrice, addDays, todayISO } from "@/lib/booking";
import { errorMessage } from "@/lib/api";

export default function BookingCheckoutPage() {
  const { slug } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: roomType, isLoading } = useRoomType(slug);
  const { data: hotel } = useHotelSettings();
  const createBooking = useCreateBooking();

  const checkIn = params.get("checkIn") || todayISO();
  const checkOut = params.get("checkOut") || addDays(todayISO(), 3);
  const guests = Number(params.get("guests") || 2);
  const rooms = Number(params.get("rooms") || 1);

  const [specialRequests, setSpecialRequests] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const breakdown = useMemo(
    () => (roomType ? computePrice({ roomType, checkIn, checkOut, guests, rooms, taxPercent: hotel?.taxPercent ?? 12 }) : null),
    [roomType, checkIn, checkOut, guests, rooms, hotel]
  );

  if (isLoading || !roomType) {
    return (
      <SiteLayout>
        <div className="pt-32 text-center text-sm text-muted-foreground">Loading…</div>
      </SiteLayout>
    );
  }

  if (!user) {
    return (
      <SiteLayout>
        <div className="flex flex-col items-center gap-4 px-5 pt-32 text-center">
          <p className="font-serif text-2xl">Sign in to complete your booking</p>
          <p className="max-w-sm text-sm text-muted-foreground">
            Create a free account or sign in — your selection for {roomType.name} will be waiting.
          </p>
          <div className="mt-2 flex gap-3">
            <Button asChild variant="gold">
              <Link to="/login" state={{ from: `/book/${slug}?${params.toString()}` }}>
                Sign In
              </Link>
            </Button>
            <Button asChild variant="quiet">
              <Link to="/register">Create Account</Link>
            </Button>
          </div>
        </div>
      </SiteLayout>
    );
  }

  if (user.role === "admin") {
    return (
      <SiteLayout>
        <div className="flex flex-col items-center gap-2 px-5 pt-32 text-center">
          <p className="font-serif text-2xl">Admin accounts can't place guest bookings</p>
          <p className="text-sm text-muted-foreground">Sign in with a guest account to book a room.</p>
        </div>
      </SiteLayout>
    );
  }

  async function submit() {
    setSubmitting(true);
    try {
      const booking = await createBooking.mutateAsync({
        roomTypeId: roomType.id,
        checkIn,
        checkOut,
        guests,
        rooms,
        specialRequests,
      });
      toast.success("Booking confirmed!");
      navigate(`/booking-confirmation/${booking.id}`);
    } catch (err) {
      toast.error(errorMessage(err, "Could not complete booking"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SiteLayout>
      <PageHeader eyebrow="Reserve" title="Complete Your Booking" />
      <Section>
        <div className="grid gap-12 lg:grid-cols-3 lg:gap-16">
          <div className="lg:col-span-2">
            <p className="eyebrow">Guest details</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Name</Label>
                <Input value={user.name} disabled className="mt-1.5" />
              </div>
              <div>
                <Label>Email</Label>
                <Input value={user.email} disabled className="mt-1.5" />
              </div>
            </div>

            <div className="mt-6">
              <Label htmlFor="requests">Special requests (optional)</Label>
              <Textarea
                id="requests"
                rows={4}
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                className="mt-1.5"
                placeholder="Late arrival, room preferences, celebrations…"
              />
            </div>

            <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
              Payment is collected at the property unless otherwise arranged. By continuing you agree to the hotel's
              cancellation policy.
            </p>

            <Button variant="gold" size="lg" className="mt-6 w-full sm:w-auto" onClick={submit} disabled={submitting}>
              {submitting ? "Confirming…" : "Confirm Booking"}
            </Button>
          </div>

          <div>
            <PriceSummary
              breakdown={breakdown}
              roomName={roomType.name}
              checkIn={checkIn}
              checkOut={checkOut}
              guests={guests}
              taxPercent={hotel?.taxPercent ?? 12}
              className="sticky top-24"
            />
          </div>
        </div>
      </Section>
    </SiteLayout>
  );
}
