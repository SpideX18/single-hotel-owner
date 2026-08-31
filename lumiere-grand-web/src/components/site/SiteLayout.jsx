import { MobileBottomNav, SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SmartImage } from "@/components/common/SmartImage";

export function SiteLayout({ children, transparentHeader = false }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader transparent={transparentHeader} />
      <main className={transparentHeader ? "flex-1" : "flex-1 pt-16 md:pt-20"}>{children}</main>
      <SiteFooter />
      <div className="h-14 md:hidden" />
      <MobileBottomNav />
    </div>
  );
}

export function PageHeader({ eyebrow, title, description, image }) {
  return (
    <section className="relative overflow-hidden border-b border-border bg-secondary">
      {image ? (
        <>
          <SmartImage src={image} alt="" className="absolute inset-0 size-full object-cover" />
          <div className="absolute inset-0 bg-primary/70" />
        </>
      ) : null}
      <div className="relative mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 md:py-24 lg:px-12">
        <p className={image ? "eyebrow text-gold" : "eyebrow"}>{eyebrow}</p>
        <h1 className={`display mt-4 text-4xl sm:text-5xl md:text-6xl ${image ? "text-primary-foreground" : "text-foreground"}`}>
          {title}
        </h1>
        {description ? (
          <p className={`mt-5 max-w-2xl text-sm leading-relaxed sm:text-base ${image ? "text-primary-foreground/75" : "text-muted-foreground"}`}>
            {description}
          </p>
        ) : null}
      </div>
    </section>
  );
}
