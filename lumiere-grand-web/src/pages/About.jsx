import { Section } from "@/components/common/Section";
import { SmartImage } from "@/components/common/SmartImage";
import { PageHeader, SiteLayout } from "@/components/site/SiteLayout";
import { useHotelSettings } from "@/hooks/useHotel";

export default function AboutPage() {
  const { data: hotel } = useHotelSettings();

  return (
    <SiteLayout>
      <PageHeader eyebrow="About" title={hotel?.name || "About Us"} image={hotel?.heroImages?.[0] || hotel?.heroImage} />
      <Section>
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <SmartImage src={hotel?.heroImage} alt={hotel?.name} className="aspect-[4/5] w-full object-cover" />
          <div>
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              {hotel?.description || "Add a longer description of your property's story from the admin dashboard."}
            </p>
            {hotel?.policies ? (
              <>
                <p className="eyebrow mt-8">Policies</p>
                <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">{hotel.policies}</p>
              </>
            ) : null}
            <dl className="mt-8 grid grid-cols-2 gap-6 text-sm">
              <div>
                <dt className="text-xs uppercase tracking-wider text-muted-foreground">Check-in</dt>
                <dd className="mt-1 font-medium">{hotel?.checkInTime || "—"}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-muted-foreground">Check-out</dt>
                <dd className="mt-1 font-medium">{hotel?.checkOutTime || "—"}</dd>
              </div>
            </dl>
          </div>
        </div>
      </Section>
    </SiteLayout>
  );
}
