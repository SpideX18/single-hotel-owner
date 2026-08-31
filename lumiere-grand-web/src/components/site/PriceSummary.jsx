import { currency, formatDate } from "@/lib/booking";
import { cn } from "@/lib/utils";

export function PriceSummary({ breakdown, roomName, checkIn, checkOut, guests, taxPercent = 12, className }) {
  return (
    <div className={cn("panel rounded-sm p-6", className)}>
      <p className="eyebrow">Price Breakdown</p>
      {roomName ? <h3 className="mt-3 font-serif text-xl">{roomName}</h3> : null}
      {checkIn && checkOut ? (
        <p className="mt-1 text-xs text-muted-foreground">
          {formatDate(checkIn)} → {formatDate(checkOut)} · {breakdown.nights} night{breakdown.nights === 1 ? "" : "s"}
          {guests ? ` · ${guests} guest${guests === 1 ? "" : "s"}` : ""}
        </p>
      ) : null}

      <dl className="mt-6 space-y-3 text-sm">
        <Row
          label={`${breakdown.nights} night${breakdown.nights === 1 ? "" : "s"} × ${currency(breakdown.nightlyRate, 0)}`}
          value={currency(breakdown.roomTotal)}
        />
        {breakdown.addonLines.map((l) => (
          <Row key={l.label} label={l.label} hint={l.detail} value={currency(l.amount)} muted />
        ))}
        <div className="hairline pt-1" />
        <Row label="Subtotal" value={currency(breakdown.subtotal)} />
        <Row label={`Taxes & fees (${taxPercent}%)`} value={currency(breakdown.tax)} muted />
      </dl>

      <div className="mt-5 flex items-baseline justify-between border-t border-border pt-5">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Total</span>
        <span className="font-serif text-3xl text-foreground">{currency(breakdown.total)}</span>
      </div>
    </div>
  );
}

function Row({ label, value, hint, muted, className }) {
  return (
    <div className={cn("flex items-start justify-between gap-6", className)}>
      <dt className={cn("min-w-0", muted && "text-muted-foreground")}>
        {label}
        {hint ? <span className="block text-[11px] text-muted-foreground">{hint}</span> : null}
      </dt>
      <dd className="shrink-0 tabular-nums">{value}</dd>
    </div>
  );
}
