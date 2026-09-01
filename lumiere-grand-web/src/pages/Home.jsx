import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Sparkles } from "lucide-react";

import { Section, SectionHeading } from "@/components/common/Section";
import { StarRating } from "@/components/common/StarRating";
import { SmartImage } from "@/components/common/SmartImage";
import { BookingWidget } from "@/components/site/BookingWidget";
import { ReviewCard } from "@/components/site/ReviewCard";
import { RoomCard } from "@/components/site/RoomCard";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { useHotelSettings } from "@/hooks/useHotel";
import { useRoomTypes } from "@/hooks/useRoomTypes";
import { offersApi, experiencesApi, useReviews } from "@/hooks/useContent";
import { currency } from "@/lib/booking";

export default function Home() {
  const { data: hotel } = useHotelSettings();
  const { data: roomTypes = [] } = useRoomTypes();
  const { data: offers = [] } = offersApi.useList();
  const { data: experiences = [] } = experiencesApi.useList();
  const { data: reviews = [] } = useReviews();

  const featured = roomTypes.filter((r) => r.active !== false).slice(0, 3);
  const activeOffers = offers.filter((o) => o.active).slice(0, 3);
  const topExperiences = experiences.slice(0, 4);
  const topReviews = reviews.slice(0, 3);

  return (
    <SiteLayout transparentHeader>
      {/* Hero */}
      <section className="relative overflow-hidden bg-primary">
        <SmartImage
          src={hotel?.heroImage}
          alt={hotel?.name || "Hotel"}
          className="slow-zoom absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/35 to-black/80" />

        <div className="relative mx-auto flex min-h-[78vh] w-full max-w-7xl flex-col justify-center px-5 py-24 sm:px-8 lg:px-12">
          <div className="fade-up max-w-3xl">
            {hotel?.tagline ? (
              <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-white/70">{hotel.tagline}</p>
            ) : null}
            <h1 className="display mt-5 text-[3.25rem] text-white sm:text-7xl lg:text-[5.5rem]">
              {hotel?.name || "Your Hotel"}
            </h1>
            {hotel?.description ? (
              <p className="mt-6 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">{hotel.description}</p>
            ) : null}
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button asChild variant="gold" size="xl">
                <Link to="/availability">Check Availability</Link>
              </Button>
              <Button asChild variant="glass" size="xl">
                <Link to="/rooms">Explore Rooms</Link>
              </Button>
            </div>
          </div>

          <div className="mt-12 w-full max-w-6xl">
            <BookingWidget />
          </div>
        </div>
      </section>

      {/* Hotel info */}
      <Section>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="relative">
            <SmartImage
              src={hotel?.heroImages?.[0] || hotel?.heroImage}
              alt={hotel?.name}
              className="aspect-[4/5] w-full object-cover"
            />
          </div>

          <div>
            <p className="eyebrow">The House</p>
            <h2 className="display mt-4 text-3xl sm:text-4xl md:text-5xl">Welcome to {hotel?.name || "our hotel"}</h2>
            <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
              <p>
                {hotel?.description ||
                  "Add a description of your property from the admin dashboard — guests will see it here."}
              </p>
            </div>

            {hotel?.address ? (
              <div className="mt-7 flex flex-wrap items-center gap-6 text-sm">
                <span className="inline-flex items-center gap-2 text-muted-foreground">
                  <MapPin className="size-4 text-gold" /> {hotel.address}
                </span>
              </div>
            ) : null}

            {hotel?.amenities?.length ? (
              <ul className="mt-8 grid grid-cols-2 gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
                {hotel.amenities.map((a) => (
                  <li key={a} className="flex items-center gap-2.5 text-muted-foreground">
                    <span className="size-1 rounded-full bg-gold" />
                    {a}
                  </li>
                ))}
              </ul>
            ) : null}

            <Button asChild variant="quiet" size="lg" className="mt-9">
              <Link to="/about">
                Discover Our Story <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </Section>

      {/* Rooms */}
      <Section className="bg-secondary/60">
        <SectionHeading
          eyebrow="Accommodation"
          title="Rooms & Suites"
          description="Explore our room categories and find the right fit for your stay."
          action={
            <Button asChild variant="quiet" size="lg">
              <Link to="/rooms">View All Rooms</Link>
            </Button>
          }
        />
        {featured.length === 0 ? (
          <EmptyRow label="No room types have been added yet." />
        ) : (
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((rt) => (
              <RoomCard key={rt.id} roomType={rt} />
            ))}
          </div>
        )}
      </Section>

      {/* Offers */}
      {activeOffers.length > 0 ? (
        <Section>
          <SectionHeading
            eyebrow="Seasonal"
            title="Curated Offers"
            description="Considered packages for every kind of stay."
            action={
              <Button asChild variant="quiet" size="lg">
                <Link to="/offers">All Offers</Link>
              </Button>
            }
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {activeOffers.map((o) => (
              <Link key={o.id} to="/offers" className="group relative flex aspect-[4/5] flex-col justify-end overflow-hidden p-7">
                <SmartImage
                  src={o.image}
                  alt={o.name}
                  className="absolute inset-0 size-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                <div className="relative">
                  {o.discountPercent > 0 ? (
                    <span className="inline-block bg-gold px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary-foreground">
                      {o.discountPercent}% Off
                    </span>
                  ) : null}
                  <h3 className="mt-4 font-serif text-2xl text-white">{o.name}</h3>
                  <p className="mt-2 text-sm text-white/75">{o.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </Section>
      ) : null}

      {/* Experiences */}
      {topExperiences.length > 0 ? (
        <Section className="bg-primary text-primary-foreground">
          <SectionHeading
            eyebrow="Beyond the Room"
            title="Experiences"
            className="[&_h2]:text-primary-foreground [&_p:last-child]:text-primary-foreground/70"
            action={
              <Button asChild variant="goldOutline" size="lg">
                <Link to="/experiences">Explore Experiences</Link>
              </Button>
            }
          />
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {topExperiences.map((e) => (
              <Link key={e.id} to="/experiences" className="group">
                <div className="aspect-[3/4] overflow-hidden">
                  <SmartImage
                    src={e.image}
                    alt={e.name}
                    className="size-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
                  />
                </div>
                <p className="eyebrow mt-5">{e.category}</p>
                <h3 className="mt-2 font-serif text-xl text-primary-foreground">{e.name}</h3>
                <p className="mt-2 text-sm text-primary-foreground/60">
                  {currency(e.price, 0)} · {e.duration}
                </p>
              </Link>
            ))}
          </div>
        </Section>
      ) : null}

      {/* Reviews */}
      {topReviews.length > 0 ? (
        <Section>
          <SectionHeading eyebrow="Guest Voices" title="What Our Guests Say" />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {topReviews.map((r) => (
              <ReviewCard key={r.id} review={r} />
            ))}
          </div>
        </Section>
      ) : null}

      {/* Closing CTA */}
      <section className="relative overflow-hidden bg-primary">
        <div className="relative mx-auto max-w-3xl px-5 py-24 text-center sm:px-8 md:py-32">
          <Sparkles className="mx-auto size-6 text-gold" />
          <h2 className="display mt-6 text-3xl text-primary-foreground sm:text-5xl">Your suite is ready when you are</h2>
          <p className="mt-5 text-sm leading-relaxed text-primary-foreground/70 sm:text-base">
            Check live availability, compare suites and reserve in under two minutes.
          </p>
          <Button asChild variant="gold" size="xl" className="mt-9">
            <Link to="/availability">Check Availability</Link>
          </Button>
        </div>
      </section>
    </SiteLayout>
  );
}

function EmptyRow({ label }) {
  return (
    <div className="mt-12 border border-dashed border-border py-16 text-center">
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
