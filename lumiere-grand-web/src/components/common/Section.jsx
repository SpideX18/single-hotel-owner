import { cn } from "@/lib/utils";

export function Section({ children, className, id }) {
  return (
    <section id={id} className={cn("px-5 py-16 sm:px-8 md:py-24 lg:px-12", className)}>
      <div className="mx-auto w-full max-w-7xl">{children}</div>
    </section>
  );
}

export function SectionHeading({ eyebrow, title, description, align = "left", className, action }) {
  return (
    <div
      className={cn(
        "flex flex-col gap-5 md:flex-row md:items-end md:justify-between",
        align === "center" && "md:flex-col md:items-center",
        className
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "text-center")}>
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h2 className="display mt-3 text-3xl sm:text-4xl md:text-[2.75rem]">{title}</h2>
        {description ? (
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">{description}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
