import { Link } from "react-router-dom";

import { Section } from "@/components/common/Section";
import { SmartImage } from "@/components/common/SmartImage";
import { PageHeader, SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { offersApi } from "@/hooks/useContent";
import { formatDate } from "@/lib/booking";

export default function OffersPage() {
  const { data: offers = [], isLoading } = offersApi.useList();
  const active = offers.filter((o) => o.active);

  return (
    <SiteLayout>
      <PageHeader eyebrow="Seasonal" title="Offers & Packages" description="Considered packages curated for every kind of stay." />
      <Section>
        {isLoading ? (
          <p className="py-16 text-center text-sm text-muted-foreground">Loading offers…</p>
        ) : active.length === 0 ? (
          <div className="border border-dashed border-border py-24 text-center">
            <p className="font-serif text-2xl">No offers right now</p>
            <p className="mt-2 text-sm text-muted-foreground">Check back soon, or view our rooms directly.</p>
            <Button asChild variant="quiet" className="mt-6">
              <Link to="/rooms">Browse Rooms</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2">
            {active.map((o) => (
              <article key={o.id} className="grid overflow-hidden border border-border bg-card sm:grid-cols-2">
                <div className="aspect-[4/3] sm:aspect-auto">
                  <SmartImage src={o.image} alt={o.name} className="size-full object-cover" />
                </div>
                <div className="flex flex-col p-6">
                  {o.discountPercent > 0 ? (
                    <span className="w-fit bg-gold px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary-foreground">
                      {o.discountPercent}% Off
                    </span>
                  ) : null}
                  <h3 className="mt-3 font-serif text-2xl">{o.name}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{o.description}</p>
                  {o.validUntil ? (
                    <p className="mt-4 text-xs text-muted-foreground">Valid until {formatDate(o.validUntil)}</p>
                  ) : null}
                  <Button asChild variant="gold" className="mt-5 w-fit">
                    <Link to="/availability">Check Availability</Link>
                  </Button>
                </div>
              </article>
            ))}
          </div>
        )}
      </Section>
    </SiteLayout>
  );
}
