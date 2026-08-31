import { Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Section } from "@/components/common/Section";
import { PageHeader, SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useHotelSettings } from "@/hooks/useHotel";

export default function ContactPage() {
  const { data: hotel } = useHotelSettings();
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  function submit(e) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in every field.");
      return;
    }
    toast.success("Thank you — we'll be in touch shortly.");
    setForm({ name: "", email: "", message: "" });
  }

  return (
    <SiteLayout>
      <PageHeader eyebrow="Get in touch" title="Contact" />
      <Section>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <p className="eyebrow">Details</p>
            <ul className="mt-5 space-y-5 text-sm">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-gold" />
                <span className="text-muted-foreground">{hotel?.address || "Add your address in the admin dashboard"}</span>
              </li>
              <li className="flex gap-3">
                <Phone className="mt-0.5 size-4 shrink-0 text-gold" />
                <span className="text-muted-foreground">{hotel?.phone || "—"}</span>
              </li>
              <li className="flex gap-3">
                <Mail className="mt-0.5 size-4 shrink-0 text-gold" />
                <span className="text-muted-foreground">{hotel?.email || "—"}</span>
              </li>
            </ul>
          </div>

          <form onSubmit={submit} className="space-y-5">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="mt-1.5"
              />
            </div>
            <Button type="submit" variant="gold" size="lg">
              Send Message
            </Button>
          </form>
        </div>
      </Section>
    </SiteLayout>
  );
}
