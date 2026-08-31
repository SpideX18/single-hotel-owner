import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";

import { AdminLayout } from "@/pages/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateRoom, useDeleteRoom, useRooms, useUpdateRoom } from "@/hooks/useRooms";
import { useRoomTypes } from "@/hooks/useRoomTypes";
import { errorMessage } from "@/lib/api";
import { cn } from "@/lib/utils";

const statusStyle = {
  available: "bg-success/15 text-success",
  occupied: "bg-info/15 text-info",
  maintenance: "bg-warning/15 text-warning",
};

export default function AdminInventory() {
  const { data: rooms = [], isLoading } = useRooms();
  const { data: roomTypes = [] } = useRoomTypes();
  const createRoom = useCreateRoom();
  const updateRoom = useUpdateRoom();
  const deleteRoom = useDeleteRoom();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ number: "", floor: 1, roomTypeId: "" });

  const typeName = (id) => roomTypes.find((r) => r.id === id)?.name || "—";

  async function save() {
    if (!form.number || !form.roomTypeId) {
      toast.error("Room number and room type are required");
      return;
    }
    try {
      await createRoom.mutateAsync(form);
      toast.success("Room added");
      setForm({ number: "", floor: 1, roomTypeId: "" });
      setOpen(false);
    } catch (err) {
      toast.error(errorMessage(err));
    }
  }

  return (
    <AdminLayout>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl">Room Inventory</h1>
          <p className="mt-1 text-sm text-muted-foreground">Physical rooms and their live status.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="gold" disabled={roomTypes.length === 0}>
              <Plus className="size-4" /> Add Room
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Room</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Room number</Label>
                <Input value={form.number} onChange={(e) => setForm({ ...form, number: e.target.value })} className="mt-1.5" />
              </div>
              <div>
                <Label>Floor</Label>
                <Input
                  type="number"
                  value={form.floor}
                  onChange={(e) => setForm({ ...form, floor: Number(e.target.value) })}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label>Room type</Label>
                <Select value={form.roomTypeId} onValueChange={(v) => setForm({ ...form, roomTypeId: v })}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Select a room type" />
                  </SelectTrigger>
                  <SelectContent>
                    {roomTypes.map((rt) => (
                      <SelectItem key={rt.id} value={rt.id}>
                        {rt.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button variant="gold" className="w-full" onClick={save}>
                Add Room
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {roomTypes.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">Create a room type first, then add physical rooms against it.</p>
      ) : null}

      <div className="mt-8 overflow-x-auto border border-border bg-card">
        <table className="w-full min-w-[560px] text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
              <th className="p-4">Room</th>
              <th className="p-4">Floor</th>
              <th className="p-4">Type</th>
              <th className="p-4">Status</th>
              <th className="p-4" />
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td className="p-4 text-muted-foreground" colSpan={5}>
                  Loading…
                </td>
              </tr>
            ) : rooms.length === 0 ? (
              <tr>
                <td className="p-4 text-muted-foreground" colSpan={5}>
                  No rooms added yet.
                </td>
              </tr>
            ) : (
              rooms.map((r) => (
                <tr key={r.id} className="border-b border-border last:border-0">
                  <td className="p-4 font-medium">{r.number}</td>
                  <td className="p-4">{r.floor}</td>
                  <td className="p-4">{typeName(r.roomTypeId)}</td>
                  <td className="p-4">
                    <Select value={r.status} onValueChange={(v) => updateRoom.mutate({ id: r.id, patch: { status: v } })}>
                      <SelectTrigger className={cn("h-8 w-36 border-0 px-2.5 text-xs font-medium capitalize", statusStyle[r.status])}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="occupied">Occupied</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="p-4 text-right">
                    <Button variant="ghost" size="icon" onClick={() => deleteRoom.mutate(r.id)}>
                      <Trash2 className="size-4" />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
