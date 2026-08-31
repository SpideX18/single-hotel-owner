import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Upload } from "lucide-react";

import { AdminLayout } from "@/pages/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { SmartImage } from "@/components/common/SmartImage";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { offersApi } from "@/hooks/useContent";
import { errorMessage } from "@/lib/api";

const empty = { name: "", description: "", discountPercent: 10, validUntil: "", active: true, image: "" };

export default function AdminOffers() {
  const { data: offers = [], isLoading } = offersApi.useList();
  const create = offersApi.useCreate();
  const update = offersApi.useUpdate();
  const remove = offersApi.useRemove();
  const uploadImage = offersApi.useUploadImage();

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(empty);

  function openCreate() {
    setEditingId(null);
    setForm(empty);
    setOpen(true);
  }
  function openEdit(o) {
    setEditingId(o.id);
    setForm(o);
    setOpen(true);
  }
  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!editingId) {
      set("image", URL.createObjectURL(file));
      toast.message("Save the offer first, then re-open it to upload the real image.");
      return;
    }
    try {
      const url = await uploadImage.mutateAsync({ id: editingId, file });
      set("image", url);
    } catch (err) {
      toast.error(errorMessage(err, "Upload failed"));
    }
  }

  async function save() {
    if (!form.name) return toast.error("Name is required");
    try {
      if (editingId) await update.mutateAsync({ id: editingId, patch: form });
      else await create.mutateAsync(form);
      toast.success("Saved");
      setOpen(false);
    } catch (err) {
      toast.error(errorMessage(err));
    }
  }

  return (
    <AdminLayout>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl">Offers</h1>
          <p className="mt-1 text-sm text-muted-foreground">Seasonal packages shown on the public site.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="gold" onClick={openCreate}>
              <Plus className="size-4" /> Add Offer
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Offer" : "New Offer"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input value={form.name} onChange={(e) => set("name", e.target.value)} className="mt-1.5" />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea rows={3} value={form.description} onChange={(e) => set("description", e.target.value)} className="mt-1.5" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Discount %</Label>
                  <Input
                    type="number"
                    value={form.discountPercent}
                    onChange={(e) => set("discountPercent", Number(e.target.value))}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label>Valid until</Label>
                  <Input type="date" value={form.validUntil} onChange={(e) => set("validUntil", e.target.value)} className="mt-1.5" />
                </div>
              </div>
              <div>
                <Label>Image</Label>
                <div className="mt-2 aspect-video w-full overflow-hidden">
                  <SmartImage src={form.image} alt="" className="size-full object-cover" />
                </div>
                <label className="mt-2 flex cursor-pointer items-center justify-center gap-2 border border-dashed border-border py-3 text-sm text-muted-foreground hover:border-gold hover:text-gold">
                  <Upload className="size-4" /> Upload image
                  <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
                </label>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <Switch checked={form.active} onCheckedChange={(v) => set("active", v)} />
                Active
              </label>
              <Button variant="gold" className="w-full" onClick={save}>
                Save
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : offers.length === 0 ? (
          <p className="text-sm text-muted-foreground">No offers yet.</p>
        ) : (
          offers.map((o) => (
            <div key={o.id} className="border border-border bg-card">
              <div className="aspect-video overflow-hidden">
                <SmartImage src={o.image} alt={o.name} className="size-full object-cover" />
              </div>
              <div className="p-4">
                <p className="font-serif text-lg">{o.name}</p>
                <p className="text-xs text-muted-foreground">{o.active ? "Active" : "Inactive"}</p>
                <div className="mt-3 flex gap-2">
                  <Button variant="quiet" size="sm" className="flex-1" onClick={() => openEdit(o)}>
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => remove.mutate(o.id)}>
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </AdminLayout>
  );
}
