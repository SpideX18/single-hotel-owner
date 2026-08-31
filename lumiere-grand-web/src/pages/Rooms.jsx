import { Link } from "react-router-dom";
import { GitCompareArrows } from "lucide-react";
import { useMemo, useState } from "react";

import { Section } from "@/components/common/Section";
import { RoomCard } from "@/components/site/RoomCard";
import { PageHeader, SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRoomTypes } from "@/hooks/useRoomTypes";
import { useHotelSettings } from "@/hooks/useHotel";

export default function RoomsPage() {
  const { data: roomTypes = [], isLoading } = useRoomTypes();
  const { data: hotel } = useHotelSettings();
  const [sort, setSort] = useState("recommended");
  const [guests, setGuests] = useState("any");

  const list = useMemo(() => {
    let out = roomTypes.filter((r) => r.active !== false);
    if (guests !== "any") out = out.filter((r) => r.maxGuests >= Number(guests));
    if (sort === "price-asc") out = [...out].sort((a, b) => a.basePrice - b.basePrice);
    if (sort === "price-desc") out = [...out].sort((a, b) => b.basePrice - a.basePrice);
    if (sort === "size") out = [...out].sort((a, b) => b.sizeSqm - a.sizeSqm);
    return out;
  }, [roomTypes, sort, guests]);

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Accommodation"
        title="Rooms & Suites"
        description={hotel?.name ? `Explore the room categories at ${hotel.name}.` : "Explore our room categories."}
        image={hotel?.heroImages?.[0] || hotel?.heroImage}
      />

      <Section className="py-10 md:py-12">
        <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Showing <strong className="text-foreground">{list.length}</strong> room type{list.length === 1 ? "" : "s"}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Select value={guests} onValueChange={setGuests}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Guests" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any guests</SelectItem>
                <SelectItem value="2">2+ guests</SelectItem>
                <SelectItem value="3">3+ guests</SelectItem>
                <SelectItem value="4">4+ guests</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recommended">Recommended</SelectItem>
                <SelectItem value="price-asc">Price: low to high</SelectItem>
                <SelectItem value="price-desc">Price: high to low</SelectItem>
                <SelectItem value="size">Largest first</SelectItem>
              </SelectContent>
            </Select>
            <Button asChild variant="quiet">
              <Link to="/rooms/compare">
                <GitCompareArrows className="size-4" /> Compare
              </Link>
            </Button>
          </div>
        </div>
      </Section>

      <Section className="pt-0">
        {isLoading ? (
          <p className="py-16 text-center text-sm text-muted-foreground">Loading rooms…</p>
        ) : list.length === 0 ? (
          <div className="border border-dashed border-border py-24 text-center">
            <p className="font-serif text-2xl">No rooms match yet</p>
            <p className="mt-2 text-sm text-muted-foreground">
              {roomTypes.length === 0
                ? "The hotel admin hasn't added any room types yet — check back soon."
                : "Try relaxing the guest requirement."}
            </p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {list.map((rt) => (
              <RoomCard key={rt.id} roomType={rt} />
            ))}
          </div>
        )}
      </Section>
    </SiteLayout>
  );
}
