import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function StarRating({ value = 0, size = 14, className, showValue = false }) {
  return (
    <span className={cn("inline-flex items-center gap-1", className)} aria-label={`${value} out of 5`}>
      <span className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            width={size}
            height={size}
            className={cn("shrink-0", i <= Math.round(value) ? "fill-gold text-gold" : "text-border")}
          />
        ))}
      </span>
      {showValue ? <span className="text-xs font-medium tabular-nums">{Number(value).toFixed(1)}</span> : null}
    </span>
  );
}
