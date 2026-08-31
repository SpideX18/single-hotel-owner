import { Link } from "react-router-dom";
import { Check, Minus, X } from "lucide-react";
import { useEffect, useState } from "react";

import { Section } from "@/components/common/Section";
import { StarRating } from "@/components/common/StarRating";
import { SmartImage } from "@/components/common/SmartImage";
import { PageHeader, SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { useRoomTypes } from "@/hooks/useRoomTypes";
import { currency } from "@/lib/booking";
import { cn } from "@/lib/utils";

const MAX = 3;

export default function ComparePage() {
  const { data: roomTypes = [] } = useRoomTypes();
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    if (roomTypes.length && selected.length === 0) {
      setSelected(roomTypes.slice(0, MAX).map((r) => r.id));
    }
  }, [roomTypes]); // eslint-disable-line react-hooks/exhaustive-deps

  function toggle(id) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : prev.length >= MAX ? prev : [...prev, id]));
  }

  const chosen = roomTypes.filter((r) => selected.includes(r.id));
  const rt = (id) => roomTypes.find((r) => r.id === id);

  const rows = [
    { label: "Price per night", render: (id) => <span className="font-serif text-xl text-gold">{currency(rt(id).basePrice, 0)}</span> },
    { label: "Size", render: (id) => `${rt(id).sizeSqm} m²` },
    { label: "Max guests", render: (id) => `${rt(id).maxGuests}` },
    { label: "Bed", render: (id) => rt(id).bed },
    { label: "View", render: (id) => rt(id).view },
    { label: "Breakfast", render: (id) => <Yes on={rt(id).breakfastIncluded} /> },
    { label: "Bathtub", render: (id) => <Yes on={rt(id).bathtub} /> },
    { label: "Lounge", render: (id) => <Yes on={rt(id).lounge} /> },
    { label: "Butler service", render: (id) => <Yes on={rt(id).butler} /> },
    { label: "Guest rating", render: (id) => <StarRating value={rt(id).rating} showValue /> },
  ];

  return (
    <SiteLayout>
      <PageHeader eyebrow="Decide with confidence" title="Compare Rooms" description="Select up to three room types to see them side by side." />

      <Section>
        {roomTypes.length === 0 ? (
          <div className="border border-dashed border-border py-24 text-center">
            <p className="font-serif text-2xl">No rooms to compare yet</p>
          </div>
        ) : (
          <>
            <p className="eyebrow">
              Select rooms ({selected.length}/{MAX})
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              {roomTypes.map((r) => {
                const on = selected.includes(r.id);
                const disabled = !on && selected.length >= MAX;
                return (
                  <button
                    key={r.id}
                    onClick={() => toggle(r.id)}
                    disabled={disabled}
                    className={cn(
                      "flex items-center gap-2 border px-4 py-2.5 text-sm transition-colors",
                      on ? "border-gold bg-gold/10 text-foreground" : "border-border bg-card text-muted-foreground hover:border-gold/60",
                      disabled && "cursor-not-allowed opacity-40"
                    )}
                  >
                    {on ? <Check className="size-3.5 text-gold" /> : <span className="size-3.5" />}
                    {r.name}
                  </button>
                );
              })}
            </div>

            {chosen.length === 0 ? (
              <div className="mt-12 border border-dashed border-border py-24 text-center">
                <p className="font-serif text-2xl">Select a room to begin</p>
              </div>
            ) : (
              <div className="mt-12 -mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
                <table className="w-full min-w-[640px] border-collapse">
                  <thead>
                    <tr>
                      <th className="w-40 border-b border-border p-4 text-left align-bottom text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        Feature
                      </th>
                      {chosen.map((r) => (
                        <th key={r.id} className="border-b border-border p-4 text-left align-bottom">
                          <div className="aspect-[4/3] w-full overflow-hidden">
                            <SmartImage src={r.images?.[0]} alt={r.name} className="size-full object-cover" />
                          </div>
                          <p className="mt-4 font-serif text-xl">{r.name}</p>
                          <button onClick={() => toggle(r.id)} className="mt-1 inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-destructive">
                            <X className="size-3" /> Remove
                          </button>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => (
                      <tr key={row.label} className="border-b border-border">
                        <th className="p-4 text-left text-sm font-medium text-muted-foreground">{row.label}</th>
                        {chosen.map((r) => (
                          <td key={r.id} className="p-4 text-sm">
                            {row.render(r.id)}
                          </td>
                        ))}
                      </tr>
                    ))}
                    <tr>
                      <td className="p-4" />
                      {chosen.map((r) => (
                        <td key={r.id} className="p-4">
                          <Button asChild variant="gold" className="w-full">
                            <Link to={`/rooms/${r.slug}`}>View Room</Link>
                          </Button>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </Section>
    </SiteLayout>
  );
}

function Yes({ on }) {
  return on ? (
    <span className="inline-flex items-center gap-1.5 text-success">
      <Check className="size-4" /> Included
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 text-muted-foreground">
      <Minus className="size-4" /> Not included
    </span>
  );
}
