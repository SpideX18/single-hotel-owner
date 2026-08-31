import { BadgeCheck } from "lucide-react";

import { StarRating } from "@/components/common/StarRating";
import { formatDate } from "@/lib/booking";
import { cn } from "@/lib/utils";

export function ReviewCard({ review, className }) {
  return (
    <figure className={cn("flex h-full flex-col border border-border bg-card p-7", className)}>
      <StarRating value={review.rating} />
      <blockquote className="mt-5 flex-1">
        {review.title ? <p className="font-serif text-xl leading-snug text-foreground">"{review.title}"</p> : null}
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{review.comment}</p>
      </blockquote>
      {review.response ? (
        <p className="mt-4 border-l-2 border-gold/50 pl-4 text-xs italic leading-relaxed text-muted-foreground">
          Hotel response: {review.response}
        </p>
      ) : null}
      <figcaption className="mt-6 flex items-center justify-between border-t border-border pt-4">
        <div>
          <p className="text-sm font-semibold">{review.guestName}</p>
          {review.verified ? (
            <p className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-muted-foreground">
              <BadgeCheck className="size-3.5 text-gold" /> Verified Guest
            </p>
          ) : null}
        </div>
        <span className="text-[11px] text-muted-foreground">{formatDate(review.date)}</span>
      </figcaption>
    </figure>
  );
}
