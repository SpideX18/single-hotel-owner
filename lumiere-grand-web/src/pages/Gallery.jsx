import { SmartImage } from "@/components/common/SmartImage";
import { Section } from "@/components/common/Section";
import { PageHeader, SiteLayout } from "@/components/site/SiteLayout";
import { useHotelSettings } from "@/hooks/useHotel";
import { useRoomTypes } from "@/hooks/useRoomTypes";

export default function GalleryPage() {
  const { data: hotel } = useHotelSettings();
  const { data: roomTypes = [] } = useRoomTypes();

  const images = [
    ...(hotel?.heroImages || []),
    ...(hotel?.heroImage ? [hotel.heroImage] : []),
    ...roomTypes.flatMap((r) => r.images || []),
  ].filter(Boolean);

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Visual Tour"
        title="Gallery"
        description="A look at the property, rooms and grounds."
        image={hotel?.heroImages?.[0] || hotel?.heroImage}
      />
      <Section>
        {images.length === 0 ? (
          <div className="border border-dashed border-border py-24 text-center">
            <p className="font-serif text-2xl">No photos yet</p>
            <p className="mt-2 text-sm text-muted-foreground">
              The hotel admin can upload photos of the property and rooms from the dashboard.
            </p>
          </div>
        ) : (
          <div className="columns-1 gap-3 sm:columns-2 lg:columns-3 [&>*]:mb-3">
            {images.map((src, i) => (
              <SmartImage key={i} src={src} alt="" className="w-full break-inside-avoid object-cover" />
            ))}
          </div>
        )}
      </Section>
    </SiteLayout>
  );
}
