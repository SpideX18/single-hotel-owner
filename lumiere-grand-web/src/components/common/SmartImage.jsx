import { useEffect, useState } from "react";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Renders `src` when present and loadable; otherwise a soft placeholder
 * instead of a broken/blank area. Fallback is plain React state — no
 * direct DOM manipulation — so it can never stack on top of sibling
 * content or survive past the element it belongs to.
 */
export function SmartImage({ src, alt = "", className, iconClassName }) {
  const [failed, setFailed] = useState(false);

  // If the src changes (e.g. admin uploads a new image), give the new
  // one a fresh chance instead of staying stuck on a past failure.
  useEffect(() => {
    setFailed(false);
  }, [src]);

  const showPlaceholder = !src || failed;

  if (showPlaceholder) {
    return (
      <div className={cn("flex items-center justify-center bg-secondary text-muted-foreground", className)}>
        <ImageOff className={cn("size-6 opacity-40", iconClassName)} />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
