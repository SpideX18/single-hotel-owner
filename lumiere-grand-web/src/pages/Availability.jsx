import { useNavigate, useSearchParams } from "react-router-dom";

import { Section } from "@/components/common/Section";
import { BookingWidget } from "@/components/site/BookingWidget";
import { RoomCard } from "@/components/site/RoomCard";
import { PageHeader, SiteLayout } from "@/components/site/SiteLayout";
import { useRoomTypes } from "@/hooks/useRoomTypes";
import { useHotelSettings } from "@/hooks/useHotel";
import { addDays, todayISO } from "@/lib/booking";

export default function AvailabilityPage() {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const { data: roomTypes = [], isLoading } = useRoomTypes();
  const { data: hotel } = useHotelSettings();

  const checkIn = params.get("checkIn") || todayISO();
  const checkOut = params.get("checkOut") || addDays(todayISO(), 3);
  const guests = Number(params.get("guests") || 2);
  const rooms = Number(params.get("rooms") || 1);

  const results = roomTypes.filter((r) => r.active !== false && r.maxGuests >= guests);

  function handleSearch(next) {
    setParams({ checkIn: next.checkIn, checkOut: next.checkOut, guests: String(next.guests), rooms: String(next.rooms) });
  }

  return (
    <SiteLayout>
      <PageHeader eyebrow="Availability" title="Find Your Room" image={hotel?.heroImages?.[0] || hotel?.heroImage} />
      <Section className="pt-10">
        <BookingWidget initial={{ checkIn, checkOut, guests, rooms }} onSearch={handleSearch} />
      </Section>
      <Section className="pt-0">
        {isLoading ? (
          <p className="py-16 text-center text-sm text-muted-foreground">Checking availability…</p>
        ) : results.length === 0 ? (
          <div className="border border-dashed border-border py-24 text-center">
            <p className="font-serif text-2xl">No rooms match these dates</p>
            <p className="mt-2 text-sm text-muted-foreground">Try adjusting your guest count or dates above.</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {results.map((rt) => (
              <RoomCard
                key={rt.id}
                roomType={rt}
                compareSlot={
                  <button
                    onClick={() =>
                      navigate(
                        `/book/${rt.slug}?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}&rooms=${rooms}`
                      )
                    }
                    className="flex-1 border border-gold bg-gold px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                  >
                    Select
                  </button>
                }
              />
            ))}
          </div>
        )}
      </Section>
    </SiteLayout>
  );
}
