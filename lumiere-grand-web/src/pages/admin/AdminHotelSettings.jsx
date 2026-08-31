import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Upload, X } from "lucide-react";

import { AdminLayout } from "@/pages/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SmartImage } from "@/components/common/SmartImage";
import { useHotelSettings, useUpdateHotelSettings, useUploadHotelImages } from "@/hooks/useHotel";
import { errorMessage } from "@/lib/api";

export default function AdminHotelSettings() {
  const { data: hotel, isLoading } = useHotelSettings();
  const update = useUpdateHotelSettings();
  const upload = useUploadHotelImages();
  const [form, setForm] = useState(null);
  const [amenityInput, setAmenityInput] = useState("");

  useEffect(() => {
    if (hotel && !form) setForm(hotel);
  }, [hotel]); // eslint-disable-line react-hooks/exhaustive-deps

  if (isLoading || !form) {
    return (
      <AdminLayout>
        <p className="text-sm text-muted-foreground">Loading…</p>
      </AdminLayout>
    );
  }

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function save() {
    try {
      await update.mutateAsync(form);
      toast.success("Hotel settings saved");
    } catch (err) {
      toast.error(errorMessage(err));
    }
  }

  async function handleHeroUpload(e, field) {
    const files = e.target.files;
    if (!files?.length) return;
    try {
      const urls = await upload.mutateAsync(files);
      if (field === "heroImage") set("heroImage", urls[0]);
      else set("heroImages", [...(form.heroImages || []), ...urls]);
      toast.success("Image uploaded");
    } catch (err) {
      toast.error(errorMessage(err, "Upload failed"));
    } finally {
      e.target.value = "";
    }
  }

  function addAmenity() {
    if (!amenityInput.trim()) return;
    set("amenities", [...(form.amenities || []), amenityInput.trim()]);
    setAmenityInput("");
  }

  return (
    <AdminLayout>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl">Hotel Settings</h1>
          <p className="mt-1 text-sm text-muted-foreground">This is what guests see across the public site.</p>
        </div>
        <Button variant="gold" onClick={save} disabled={update.isPending}>
          {update.isPending ? "Saving…" : "Save Changes"}
        </Button>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="border border-border bg-card p-6">
            <p className="font-serif text-lg">Identity</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Hotel name</Label>
                <Input value={form.name} onChange={(e) => set("name", e.target.value)} className="mt-1.5" />
              </div>
              <div>
                <Label>Tagline</Label>
                <Input value={form.tagline} onChange={(e) => set("tagline", e.target.value)} className="mt-1.5" />
              </div>
            </div>
            <div className="mt-4">
              <Label>Description</Label>
              <Textarea rows={4} value={form.description} onChange={(e) => set("description", e.target.value)} className="mt-1.5" />
            </div>
            <div className="mt-4">
              <Label>Policies (cancellation, house rules, etc.)</Label>
              <Textarea rows={4} value={form.policies} onChange={(e) => set("policies", e.target.value)} className="mt-1.5" />
            </div>
          </div>

          <div className="border border-border bg-card p-6">
            <p className="font-serif text-lg">Contact</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Address</Label>
                <Input value={form.address} onChange={(e) => set("address", e.target.value)} className="mt-1.5" />
              </div>
              <div>
                <Label>Phone</Label>
                <Input value={form.phone} onChange={(e) => set("phone", e.target.value)} className="mt-1.5" />
              </div>
              <div>
                <Label>Email</Label>
                <Input value={form.email} onChange={(e) => set("email", e.target.value)} className="mt-1.5" />
              </div>
              <div>
                <Label>Currency code</Label>
                <Input value={form.currency} onChange={(e) => set("currency", e.target.value)} className="mt-1.5" />
              </div>
              <div>
                <Label>Check-in time</Label>
                <Input value={form.checkInTime} onChange={(e) => set("checkInTime", e.target.value)} className="mt-1.5" />
              </div>
              <div>
                <Label>Check-out time</Label>
                <Input value={form.checkOutTime} onChange={(e) => set("checkOutTime", e.target.value)} className="mt-1.5" />
              </div>
              <div>
                <Label>Tax percent</Label>
                <Input
                  type="number"
                  value={form.taxPercent}
                  onChange={(e) => set("taxPercent", Number(e.target.value))}
                  className="mt-1.5"
                />
              </div>
            </div>
          </div>

          <div className="border border-border bg-card p-6">
            <p className="font-serif text-lg">Amenities</p>
            <div className="mt-4 flex gap-2">
              <Input
                value={amenityInput}
                onChange={(e) => setAmenityInput(e.target.value)}
                placeholder="e.g. Rooftop pool"
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addAmenity())}
              />
              <Button variant="quiet" onClick={addAmenity}>
                Add
              </Button>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {(form.amenities || []).map((a, i) => (
                <span key={i} className="inline-flex items-center gap-1.5 border border-border px-3 py-1.5 text-xs">
                  {a}
                  <button onClick={() => set("amenities", form.amenities.filter((_, idx) => idx !== i))}>
                    <X className="size-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="border border-border bg-card p-6">
            <p className="font-serif text-lg">Hero Image</p>
            <p className="mt-1 text-xs text-muted-foreground">Shown full-width on the homepage.</p>
            <div className="mt-4 aspect-video w-full overflow-hidden">
              <SmartImage src={form.heroImage} alt="" className="size-full object-cover" />
            </div>
            <label className="mt-3 flex cursor-pointer items-center justify-center gap-2 border border-dashed border-border py-3 text-sm text-muted-foreground hover:border-gold hover:text-gold">
              <Upload className="size-4" /> Upload hero image
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleHeroUpload(e, "heroImage")} />
            </label>
          </div>

          <div className="border border-border bg-card p-6">
            <p className="font-serif text-lg">Gallery Images</p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {(form.heroImages || []).map((img, i) => (
                <div key={i} className="group relative aspect-square overflow-hidden">
                  <SmartImage src={img} alt="" className="size-full object-cover" />
                  <button
                    onClick={() => set("heroImages", form.heroImages.filter((_, idx) => idx !== i))}
                    className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <X className="size-3" />
                  </button>
                </div>
              ))}
            </div>
            <label className="mt-3 flex cursor-pointer items-center justify-center gap-2 border border-dashed border-border py-3 text-sm text-muted-foreground hover:border-gold hover:text-gold">
              <Upload className="size-4" /> Add gallery images
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => handleHeroUpload(e, "heroImages")}
              />
            </label>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
