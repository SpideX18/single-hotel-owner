import { Link } from "react-router-dom";
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Twitter } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useHotelSettings } from "@/hooks/useHotel";

const quickLinks = [
  { to: "/rooms", label: "Rooms" },
  { to: "/offers", label: "Offers" },
  { to: "/experiences", label: "Experiences" },
  { to: "/gallery", label: "Gallery" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export function SiteFooter() {
  const [email, setEmail] = useState("");
  const { data: hotel } = useHotelSettings();

  return (
    <footer className="border-t border-border bg-primary text-primary-foreground">
      <div className="mx-auto grid w-full max-w-7xl gap-12 px-5 py-16 sm:px-8 md:grid-cols-2 lg:grid-cols-4 lg:px-12">
        <div>
          <p className="font-serif text-2xl tracking-tight">{hotel?.name || "Your Hotel"}</p>
          {hotel?.tagline ? <p className="mt-2 text-sm text-primary-foreground/70">{hotel.tagline}</p> : null}
          <div className="mt-6 flex gap-3">
            {[Instagram, Facebook, Twitter, Linkedin].map((Icon, i) => (
              <button
                key={i}
                type="button"
                onClick={() => toast("Add your social profile links from the admin dashboard.")}
                className="flex size-9 items-center justify-center rounded-full border border-primary-foreground/20 text-primary-foreground/80 transition-colors hover:border-gold hover:text-gold"
                aria-label="Social profile"
              >
                <Icon className="size-4" />
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground/60">Quick Links</p>
          <ul className="mt-5 space-y-3 text-sm">
            {quickLinks.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-primary-foreground/80 transition-colors hover:text-gold">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground/60">Contact</p>
          <ul className="mt-5 space-y-4 text-sm text-primary-foreground/80">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-gold" />
              <span>{hotel?.address || "Add your address in the admin dashboard"}</span>
            </li>
            <li className="flex gap-3">
              <Phone className="mt-0.5 size-4 shrink-0 text-gold" />
              <span>{hotel?.phone || "—"}</span>
            </li>
            <li className="flex gap-3">
              <Mail className="mt-0.5 size-4 shrink-0 text-gold" />
              <span>{hotel?.email || "—"}</span>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground/60">Newsletter</p>
          <p className="mt-5 text-sm text-primary-foreground/70">Seasonal offers and news from the house.</p>
          <form
            className="mt-5 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
                toast.error("Please enter a valid email address.");
                return;
              }
              toast.success("Thank you — you are subscribed.");
              setEmail("");
            }}
          >
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              aria-label="Email address"
              maxLength={255}
              className="border-primary-foreground/20 bg-primary-foreground/5 text-primary-foreground placeholder:text-primary-foreground/40"
            />
            <Button type="submit" variant="gold">
              Join
            </Button>
          </form>
        </div>
      </div>

      <div className="border-t border-primary-foreground/10">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-5 py-6 text-xs text-primary-foreground/50 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
          <p>
            © {new Date().getFullYear()} {hotel?.name || "Your Hotel"}. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link to="/login" className="transition-colors hover:text-gold">
              Staff Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
