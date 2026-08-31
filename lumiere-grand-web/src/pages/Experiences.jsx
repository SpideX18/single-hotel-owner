import { Section } from "@/components/common/Section";
import { SmartImage } from "@/components/common/SmartImage";
import { PageHeader, SiteLayout } from "@/components/site/SiteLayout";
import { experiencesApi } from "@/hooks/useContent";
import { currency } from "@/lib/booking";

export default function ExperiencesPage() {
  const { data: experiences = [], isLoading } = experiencesApi.useList();

  return (
    <SiteLayout>
      <PageHeader eyebrow="Beyond the Room" title="Experiences" description="Curated activities and services available during your stay." />
      <Section>
        {isLoading ? (
          <p className="py-16 text-center text-sm text-muted-foreground">Loading experiences…</p>
        ) : experiences.length === 0 ? (
          <div className="border border-dashed border-border py-24 text-center">
            <p className="font-serif text-2xl">No experiences listed yet</p>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {experiences.map((e) => (
              <article key={e.id} className="border border-border bg-card">
                <div className="aspect-[4/3] overflow-hidden">
                  <SmartImage src={e.image} alt={e.name} className="size-full object-cover" />
                </div>
                <div className="p-6">
                  {e.category ? <p className="eyebrow">{e.category}</p> : null}
                  <h3 className="mt-2 font-serif text-xl">{e.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{e.description}</p>
                  <div className="mt-4 flex items-center justify-between text-sm">
                    <span className="font-serif text-lg text-gold">{currency(e.price, 0)}</span>
                    <span className="text-xs text-muted-foreground">{e.duration}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </Section>
    </SiteLayout>
  );
}
