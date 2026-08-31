export function todayISO() {
  return toISO(new Date());
}

export function toISO(d) {
  const y = d.getFullYear();
  const m = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function addDays(iso, days) {
  const d = new Date(`${iso}T00:00:00`);
  d.setDate(d.getDate() + days);
  return toISO(d);
}

export function nightsBetween(checkIn, checkOut) {
  const a = new Date(`${checkIn}T00:00:00`);
  const b = new Date(`${checkOut}T00:00:00`);
  return Math.max(1, Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24)));
}

export function formatDate(iso, opts = { day: "numeric", month: "short", year: "numeric" }) {
  if (!iso) return "—";
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-GB", opts);
}

export function currency(value, fractionDigits = 2, code = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: code,
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value || 0);
}

/** Client-side preview only — the server recalculates and is authoritative. */
export function computePrice({ roomType, checkIn, checkOut, guests, rooms = 1, addons = [], taxPercent = 12 }) {
  const nights = nightsBetween(checkIn, checkOut);
  const nightlyRate = roomType?.basePrice || 0;
  const roomTotal = nights * nightlyRate * rooms;

  const addonLines = (addons || []).map((a) => {
    const quantity = a.unit === "guest" ? guests : a.unit === "night" ? nights : 1;
    const amount = a.price * quantity;
    const detail =
      a.unit === "guest"
        ? `${quantity} guest${quantity > 1 ? "s" : ""} × ${currency(a.price, 0)}`
        : a.unit === "night"
          ? `${nights} night${nights > 1 ? "s" : ""} × ${currency(a.price, 0)}`
          : currency(a.price, 0);
    return { label: a.label, detail, amount };
  });

  const addonTotal = addonLines.reduce((s, l) => s + l.amount, 0);
  const subtotal = round(roomTotal + addonTotal);
  const tax = round(subtotal * (taxPercent / 100));
  return { nights, nightlyRate, roomTotal, addonLines, addonTotal, subtotal, tax, total: round(subtotal + tax) };
}

function round(n) {
  return Math.round(n * 100) / 100;
}
