import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Renders `src` when present; otherwise a soft placeholder instead of a
 * broken <img>. This is what keeps the site error-free before the admin
 * has uploaded any photos, and if an uploaded URL ever 404s.
 */
export function SmartImage({ src, alt = "", className, iconClassName }) {
  if (!src) {
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
      onError={(e) => {
        e.currentTarget.onerror = null;
        e.currentTarget.style.display = "none";
        const parent = e.currentTarget.parentElement;
        if (parent && !parent.querySelector("[data-fallback]")) {
          const div = document.createElement("div");
          div.setAttribute("data-fallback", "1");
          div.className = e.currentTarget.className + " flex items-center justify-center bg-secondary";
          parent.appendChild(div);
        }
      }}
    />
  );
}
