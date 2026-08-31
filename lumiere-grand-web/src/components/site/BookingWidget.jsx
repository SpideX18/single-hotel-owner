import { useNavigate } from "react-router-dom";
import { CalendarDays, ChevronDown, Search, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { addDays, formatDate, todayISO, toISO } from "@/lib/booking";
import { cn } from "@/lib/utils";

function Field({ label, children, className }) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-1.5 px-4 py-3", className)}>
      <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">{label}</span>
      {children}
    </div>
  );
}

export function BookingWidget({ className, compact = false, onSearch, initial }) {
  const navigate = useNavigate();
  const [checkIn, setCheckIn] = useState(initial?.checkIn ?? addDays(todayISO(), 1));
  const [checkOut, setCheckOut] = useState(initial?.checkOut ?? addDays(todayISO(), 4));
  const [guests, setGuests] = useState(initial?.guests ?? 2);
  const [roomCount, setRoomCount] = useState(initial?.rooms ?? 1);

  function submit() {
    if (checkOut <= checkIn) {
      toast.error("Check-out must be after check-in.");
      return;
    }
    if (onSearch) {
      onSearch({ checkIn, checkOut, guests, rooms: roomCount });
      return;
    }
    const params = new URLSearchParams({ checkIn, checkOut, guests: String(guests), rooms: String(roomCount) });
    navigate(`/availability?${params.toString()}`);
  }

  return (
    <div className={cn("panel w-full rounded-sm shadow-panel", compact ? "" : "backdrop-blur-xl", className)}>
      <div className="grid grid-cols-2 divide-border md:grid-cols-[1.1fr_1.1fr_1fr_0.9fr_auto] md:divide-x">
        <Field label="Check-in" className="border-b border-r border-border md:border-b-0 md:border-r-0">
          <DatePick
            value={checkIn}
            min={todayISO()}
            onChange={(v) => {
              setCheckIn(v);
              if (v >= checkOut) setCheckOut(addDays(v, 1));
            }}
          />
        </Field>
        <Field label="Check-out" className="border-b border-border md:border-b-0">
          <DatePick value={checkOut} min={addDays(checkIn, 1)} onChange={setCheckOut} />
        </Field>
        <Field label="Guests" className="border-r border-border md:border-r-0">
          <Stepper value={guests} min={1} max={8} onChange={setGuests} icon suffix={guests === 1 ? "Guest" : "Guests"} />
        </Field>
        <Field label="Rooms">
          <Stepper value={roomCount} min={1} max={4} onChange={setRoomCount} suffix={roomCount === 1 ? "Room" : "Rooms"} />
        </Field>
        <div className="col-span-2 border-t border-border p-3 md:col-span-1 md:border-t-0 md:p-2">
          <Button variant="gold" size="lg" className="h-full w-full md:px-8" onClick={submit}>
            <Search className="size-4" />
            Search Rooms
          </Button>
        </div>
      </div>
    </div>
  );
}

function DatePick({ value, onChange, min }) {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="flex items-center gap-2 text-left text-sm font-medium text-foreground transition-colors hover:text-gold">
          <CalendarDays className="size-4 shrink-0 text-gold" />
          <span className="truncate">{formatDate(value)}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0">
        <Calendar
          mode="single"
          selected={new Date(`${value}T00:00:00`)}
          defaultMonth={new Date(`${value}T00:00:00`)}
          disabled={{ before: new Date(`${min}T00:00:00`) }}
          onSelect={(d) => {
            if (d) {
              onChange(toISO(d));
              setOpen(false);
            }
          }}
        />
      </PopoverContent>
    </Popover>
  );
}

function Stepper({ value, onChange, min, max, suffix, icon }) {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="flex items-center gap-2 text-left text-sm font-medium text-foreground transition-colors hover:text-gold">
          {icon ? <Users className="size-4 shrink-0 text-gold" /> : null}
          <span className="truncate">
            {value} {suffix}
          </span>
          <ChevronDown className="size-3.5 shrink-0 text-muted-foreground" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-48">
        <div className="flex items-center justify-between">
          <span className="text-sm">{suffix}</span>
          <div className="flex items-center gap-3">
            <button
              className="flex size-7 items-center justify-center rounded-full border border-border text-sm disabled:opacity-40"
              disabled={value <= min}
              onClick={() => onChange(value - 1)}
              aria-label="Decrease"
            >
              −
            </button>
            <span className="w-4 text-center text-sm tabular-nums">{value}</span>
            <button
              className="flex size-7 items-center justify-center rounded-full border border-border text-sm disabled:opacity-40"
              disabled={value >= max}
              onClick={() => onChange(value + 1)}
              aria-label="Increase"
            >
              +
            </button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
