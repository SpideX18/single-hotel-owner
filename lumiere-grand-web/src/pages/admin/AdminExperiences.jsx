import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Upload } from "lucide-react";

import { AdminLayout } from "@/pages/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SmartImage } from "@/components/common/SmartImage";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { experiencesApi } from "@/hooks/useContent";
import { currency } from "@/lib/booking";
import { errorMessage } from "@/lib/api";

const empty = { name: "", category: "", description: "", price: 50, duration: "2 hours", image: "" };

export default function AdminExperiences() {
  const { data: experiences = [], isLoading } = experiencesApi.useList();
  const create = experiencesApi.useCreate();
  const update = experiencesApi.useUpdate();
  const remove = experiencesApi.useRemove();
  const uploadImage = experiencesApi.useUploadImage();

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(empty);

  function openCreate() {
    setEditingId(null);
    setForm(empty);
    setOpen(true);
  }
  function openEdit(x) {
    setEditingId(x.id);
    setForm(x);
    setOpen(true);
  }
  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    let targetId = editingId;

    // Not saved yet — create the record first so the upload attaches to
    // a real id. Avoids ever storing a temporary blob: link that dies
    // when the tab closes.
    if (!targetId) {
      if (!form.name) {
        toast.error("Add a name before uploading an image");
        e.target.value = "";
        return;
      }
      try {
        const created = await create.mutateAsync(form);
        targetId = created.id;
        setEditingId(created.id);
      } catch (err) {
        toast.error(errorMessage(err, "Could not save experience"));
        e.target.value = "";
        return;
      }
    }

    try {
      const url = await uploadImage.mutateAsync({ id: targetId, file });
      set("image", url);
    } catch (err) {
      toast.error(errorMessage(err, "Upload failed"));
    } finally {
      e.target.value = "";
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
          <h1 className="font-serif text-3xl">Experiences</h1>
          <p className="mt-1 text-sm text-muted-foreground">Activities and services guests can add to their stay.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="gold" onClick={openCreate}>
              <Plus className="size-4" /> Add Experience
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Experience" : "New Experience"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Name</Label>
                  <Input value={form.name} onChange={(e) => set("name", e.target.value)} className="mt-1.5" />
                </div>
                <div>
                  <Label>Category</Label>
                  <Input value={form.category} onChange={(e) => set("category", e.target.value)} className="mt-1.5" />
                </div>
              </div>
              <div>
                <Label>Description</Label>
                <Textarea rows={3} value={form.description} onChange={(e) => set("description", e.target.value)} className="mt-1.5" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Price</Label>
                  <Input type="number" value={form.price} onChange={(e) => set("price", Number(e.target.value))} className="mt-1.5" />
                </div>
                <div>
                  <Label>Duration</Label>
                  <Input value={form.duration} onChange={(e) => set("duration", e.target.value)} className="mt-1.5" />
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
        ) : experiences.length === 0 ? (
          <p className="text-sm text-muted-foreground">No experiences yet.</p>
        ) : (
          experiences.map((x) => (
            <div key={x.id} className="border border-border bg-card">
              <div className="aspect-video overflow-hidden">
                <SmartImage src={x.image} alt={x.name} className="size-full object-cover" />
              </div>
              <div className="p-4">
                <p className="font-serif text-lg">{x.name}</p>
                <p className="text-xs text-muted-foreground">{currency(x.price, 0)} · {x.duration}</p>
                <div className="mt-3 flex gap-2">
                  <Button variant="quiet" size="sm" className="flex-1" onClick={() => openEdit(x)}>
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => remove.mutate(x.id)}>
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
