import { Link } from "react-router-dom";
import { BedDouble, Maximize, Users } from "lucide-react";

import { StarRating } from "@/components/common/StarRating";
import { SmartImage } from "@/components/common/SmartImage";
import { Button } from "@/components/ui/button";
import { currency } from "@/lib/booking";
import { cn } from "@/lib/utils";

export function RoomCard({ roomType, className, compareSlot }) {
  return (
    <article
      className={cn(
        "group flex flex-col overflow-hidden border border-border bg-card transition-all duration-500 hover:shadow-lift",
        className
      )}
    >
      <Link to={`/rooms/${roomType.slug}`} className="relative block aspect-[4/3] overflow-hidden">
        <SmartImage
          src={roomType.images?.[0]}
          alt={roomType.name}
          className="size-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
        />
        {roomType.view ? (
          <span className="absolute left-4 top-4 bg-background/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground backdrop-blur">
            {roomType.view}
          </span>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-serif text-2xl leading-snug">{roomType.name}</h3>
            {roomType.rating > 0 ? <StarRating value={roomType.rating} className="mt-2" showValue /> : null}
          </div>
          <div className="text-right">
            <p className="font-serif text-2xl text-gold">{currency(roomType.basePrice, 0)}</p>
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">per night</p>
          </div>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{roomType.description}</p>

        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Users className="size-3.5 text-gold" /> {roomType.maxGuests} Guests
          </span>
          {roomType.bed ? (
            <span className="inline-flex items-center gap-1.5">
              <BedDouble className="size-3.5 text-gold" /> {roomType.bed}
            </span>
          ) : null}
          {roomType.sizeSqm ? (
            <span className="inline-flex items-center gap-1.5">
              <Maximize className="size-3.5 text-gold" /> {roomType.sizeSqm} m²
            </span>
          ) : null}
        </div>

        {roomType.amenities?.length ? (
          <div className="mt-5 flex flex-wrap gap-2">
            {roomType.amenities.slice(0, 4).map((a) => (
              <span key={a} className="border border-border px-2.5 py-1 text-[11px] text-muted-foreground">
                {a}
              </span>
            ))}
          </div>
        ) : null}

        <div className="mt-6 flex items-center gap-3 pt-2">
          <Button asChild variant="quiet" className="flex-1">
            <Link to={`/rooms/${roomType.slug}`}>View Room</Link>
          </Button>
          {compareSlot}
        </div>
      </div>
    </article>
  );
}
