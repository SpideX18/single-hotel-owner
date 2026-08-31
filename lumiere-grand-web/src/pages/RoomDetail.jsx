import { useParams, Link, useNavigate } from "react-router-dom";
import { BedDouble, Check, Maximize, Users } from "lucide-react";

import { Section } from "@/components/common/Section";
import { StarRating } from "@/components/common/StarRating";
import { SmartImage } from "@/components/common/SmartImage";
import { PageHeader, SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { useRoomType } from "@/hooks/useRoomTypes";
import { currency } from "@/lib/booking";

export default function RoomDetailPage() {
  const { slug } = useParams();
  const { data: roomType, isLoading, isError } = useRoomType(slug);
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <SiteLayout>
        <div className="pt-32 text-center text-sm text-muted-foreground">Loading room…</div>
      </SiteLayout>
    );
  }

  if (isError || !roomType) {
    return (
      <SiteLayout>
        <div className="flex flex-col items-center gap-4 pt-32 text-center">
          <p className="font-serif text-2xl">Room not found</p>
          <Button asChild variant="quiet">
            <Link to="/rooms">Back to rooms</Link>
          </Button>
        </div>
      </SiteLayout>
    );
  }

  const features = [
    { on: roomType.breakfastIncluded, label: "Breakfast included" },
    { on: roomType.bathtub, label: "Bathtub" },
    { on: roomType.lounge, label: "Lounge access" },
    { on: roomType.butler, label: "Butler service" },
  ].filter((f) => f.on);

  return (
    <SiteLayout>
      <PageHeader eyebrow={roomType.view || "Room"} title={roomType.name} image={roomType.images?.[0]} />

      <Section>
        <div className="grid gap-12 lg:grid-cols-3 lg:gap-16">
          <div className="lg:col-span-2">
            {roomType.images?.length > 1 ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {roomType.images.map((img, i) => (
                  <SmartImage key={i} src={img} alt={`${roomType.name} ${i + 1}`} className="aspect-square w-full object-cover" />
                ))}
              </div>
            ) : null}

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Users className="size-4 text-gold" /> Up to {roomType.maxGuests} guests
              </span>
              {roomType.bed ? (
                <span className="inline-flex items-center gap-1.5">
                  <BedDouble className="size-4 text-gold" /> {roomType.bed}
                </span>
              ) : null}
              {roomType.sizeSqm ? (
                <span className="inline-flex items-center gap-1.5">
                  <Maximize className="size-4 text-gold" /> {roomType.sizeSqm} m²
                </span>
              ) : null}
              {roomType.rating > 0 ? <StarRating value={roomType.rating} showValue /> : null}
            </div>

            <p className="mt-6 text-sm leading-relaxed text-muted-foreground sm:text-base">
              {roomType.longDescription || roomType.description}
            </p>

            {roomType.amenities?.length ? (
              <div className="mt-8">
                <p className="eyebrow">Amenities</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {roomType.amenities.map((a) => (
                    <span key={a} className="border border-border px-3 py-1.5 text-xs text-muted-foreground">
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            {features.length ? (
              <div className="mt-8">
                <p className="eyebrow">Included</p>
                <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                  {features.map((f) => (
                    <li key={f.label} className="inline-flex items-center gap-2 text-sm text-success">
                      <Check className="size-4" /> {f.label}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          <div>
            <div className="panel sticky top-24 rounded-sm p-6">
              <p className="font-serif text-3xl text-gold">{currency(roomType.basePrice, 0)}</p>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">per night</p>
              <Button variant="gold" size="lg" className="mt-6 w-full" onClick={() => navigate(`/book/${roomType.slug}`)}>
                Book This Room
              </Button>
              <Button asChild variant="quiet" size="lg" className="mt-3 w-full">
                <Link to="/rooms/compare">Compare with other rooms</Link>
              </Button>
            </div>
          </div>
        </div>
      </Section>
    </SiteLayout>
  );
}
