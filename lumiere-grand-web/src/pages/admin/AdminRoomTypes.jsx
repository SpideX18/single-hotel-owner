import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Upload, X } from "lucide-react";

import { AdminLayout } from "@/pages/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { SmartImage } from "@/components/common/SmartImage";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  useCreateRoomType,
  useDeleteRoomType,
  useRoomTypes,
  useUpdateRoomType,
  useUploadRoomTypeImages,
} from "@/hooks/useRoomTypes";
import { currency } from "@/lib/booking";
import { errorMessage } from "@/lib/api";

const empty = {
  name: "",
  tagline: "",
  description: "",
  longDescription: "",
  basePrice: 100,
  sizeSqm: 30,
  maxGuests: 2,
  bed: "1 King Bed",
  view: "",
  amenities: [],
  images: [],
  breakfastIncluded: false,
  bathtub: false,
  lounge: false,
  butler: false,
  active: true,
};

export default function AdminRoomTypes() {
  const { data: roomTypes = [], isLoading } = useRoomTypes();
  const createRoomType = useCreateRoomType();
  const updateRoomType = useUpdateRoomType();
  const deleteRoomType = useDeleteRoomType();
  const uploadImages = useUploadRoomTypeImages();

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(empty);
  const [amenityInput, setAmenityInput] = useState("");

  function openCreate() {
    setEditingId(null);
    setForm(empty);
    setOpen(true);
  }

  function openEdit(rt) {
    setEditingId(rt.id);
    setForm(rt);
    setOpen(true);
  }

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleImageUpload(e) {
    const files = e.target.files;
    if (!files?.length) return;

    let targetId = editingId;

    // Not saved yet — create the record first (silently) so the upload
    // has a real id to attach to. This replaces the old "save first,
    // then re-open to add images" step, and means a real, permanent URL
    // is stored from the very first upload — never a temporary blob:
    // link that dies when the tab closes.
    if (!targetId) {
      if (!form.name || !form.basePrice) {
        toast.error("Add a name and price before uploading images");
        e.target.value = "";
        return;
      }
      try {
        const created = await createRoomType.mutateAsync(form);
        targetId = created.id;
        setEditingId(created.id);
      } catch (err) {
        toast.error(errorMessage(err, "Could not save room type"));
        e.target.value = "";
        return;
      }
    }

    try {
      const urls = await uploadImages.mutateAsync({ id: targetId, files });
      set("images", [...(form.images || []), ...urls]);
      toast.success(editingId ? "Images added" : "Room type created and images added");
    } catch (err) {
      toast.error(errorMessage(err, "Upload failed"));
    } finally {
      e.target.value = "";
    }
  }

  async function save() {
    if (!form.name || !form.basePrice) {
      toast.error("Name and price are required");
      return;
    }
    try {
      if (editingId) {
        await updateRoomType.mutateAsync({ id: editingId, patch: form });
        toast.success("Room type updated");
      } else {
        await createRoomType.mutateAsync(form);
        toast.success("Room type created");
      }
      setOpen(false);
    } catch (err) {
      toast.error(errorMessage(err));
    }
  }

  return (
    <AdminLayout>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl">Room Types</h1>
          <p className="mt-1 text-sm text-muted-foreground">The categories guests can book — e.g. Deluxe, Suite.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="gold" onClick={openCreate}>
              <Plus className="size-4" /> Add Room Type
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Room Type" : "New Room Type"}</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Name</Label>
                  <Input value={form.name} onChange={(e) => set("name", e.target.value)} className="mt-1.5" />
                </div>
                <div>
                  <Label>Price per night</Label>
                  <Input
                    type="number"
                    value={form.basePrice}
                    onChange={(e) => set("basePrice", Number(e.target.value))}
                    className="mt-1.5"
                  />
                </div>
              </div>

              <div>
                <Label>Short description (shown on cards)</Label>
                <Textarea rows={2} value={form.description} onChange={(e) => set("description", e.target.value)} className="mt-1.5" />
              </div>
              <div>
                <Label>Full description (shown on the room page)</Label>
                <Textarea
                  rows={4}
                  value={form.longDescription}
                  onChange={(e) => set("longDescription", e.target.value)}
                  className="mt-1.5"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <Label>Size (m²)</Label>
                  <Input type="number" value={form.sizeSqm} onChange={(e) => set("sizeSqm", Number(e.target.value))} className="mt-1.5" />
                </div>
                <div>
                  <Label>Max guests</Label>
                  <Input
                    type="number"
                    value={form.maxGuests}
                    onChange={(e) => set("maxGuests", Number(e.target.value))}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label>Bed configuration</Label>
                  <Input value={form.bed} onChange={(e) => set("bed", e.target.value)} className="mt-1.5" />
                </div>
              </div>
              <div>
                <Label>View</Label>
                <Input value={form.view} onChange={(e) => set("view", e.target.value)} className="mt-1.5" placeholder="e.g. Ocean View" />
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  ["breakfastIncluded", "Breakfast"],
                  ["bathtub", "Bathtub"],
                  ["lounge", "Lounge access"],
                  ["butler", "Butler service"],
                ].map(([key, label]) => (
                  <label key={key} className="flex items-center gap-2 text-sm">
                    <Switch checked={form[key]} onCheckedChange={(v) => set(key, v)} />
                    {label}
                  </label>
                ))}
              </div>

              <div>
                <Label>Amenities</Label>
                <div className="mt-1.5 flex gap-2">
                  <Input
                    value={amenityInput}
                    onChange={(e) => setAmenityInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        if (amenityInput.trim()) {
                          set("amenities", [...(form.amenities || []), amenityInput.trim()]);
                          setAmenityInput("");
                        }
                      }
                    }}
                    placeholder="e.g. Free WiFi"
                  />
                  <Button
                    variant="quiet"
                    type="button"
                    onClick={() => {
                      if (amenityInput.trim()) {
                        set("amenities", [...(form.amenities || []), amenityInput.trim()]);
                        setAmenityInput("");
                      }
                    }}
                  >
                    Add
                  </Button>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(form.amenities || []).map((a, i) => (
                    <span key={i} className="inline-flex items-center gap-1.5 border border-border px-2.5 py-1 text-xs">
                      {a}
                      <button onClick={() => set("amenities", form.amenities.filter((_, idx) => idx !== i))}>
                        <X className="size-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <Label>Images</Label>
                <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {(form.images || []).map((img, i) => (
                    <div key={i} className="group relative aspect-square overflow-hidden">
                      <SmartImage src={img} alt="" className="size-full object-cover" />
                      <button
                        onClick={() => set("images", form.images.filter((_, idx) => idx !== i))}
                        className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        <X className="size-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <label className="mt-2 flex cursor-pointer items-center justify-center gap-2 border border-dashed border-border py-3 text-sm text-muted-foreground hover:border-gold hover:text-gold">
                  <Upload className="size-4" /> Upload images
                  <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
                </label>
              </div>

              <label className="flex items-center gap-2 text-sm">
                <Switch checked={form.active} onCheckedChange={(v) => set("active", v)} />
                Visible on the public site
              </label>

              <Button variant="gold" className="w-full" onClick={save} disabled={createRoomType.isPending || updateRoomType.isPending}>
                {editingId ? "Save Changes" : "Create Room Type"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : roomTypes.length === 0 ? (
          <div className="col-span-full border border-dashed border-border py-16 text-center">
            <p className="font-serif text-xl">No room types yet</p>
            <p className="mt-1 text-sm text-muted-foreground">Add your first room type to start taking bookings.</p>
          </div>
        ) : (
          roomTypes.map((rt) => (
            <div key={rt.id} className="border border-border bg-card">
              <div className="aspect-video overflow-hidden">
                <SmartImage src={rt.images?.[0]} alt={rt.name} className="size-full object-cover" />
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-serif text-lg">{rt.name}</p>
                  {!rt.active ? <span className="text-[10px] uppercase text-muted-foreground">Hidden</span> : null}
                </div>
                <p className="mt-1 font-serif text-gold">{currency(rt.basePrice, 0)} / night</p>
                <div className="mt-4 flex gap-2">
                  <Button variant="quiet" size="sm" className="flex-1" onClick={() => openEdit(rt)}>
                    Edit
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Trash2 className="size-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete {rt.name}?</AlertDialogTitle>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteRoomType.mutate(rt.id)}>Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </AdminLayout>
  );
}
