import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useRooms() {
  return useQuery({
    queryKey: ["rooms"],
    queryFn: async () => (await api.get("/rooms")).data,
  });
}

export function useCreateRoom() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => (await api.post("/rooms", payload)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["rooms"] }),
  });
}

export function useUpdateRoom() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, patch }) => (await api.put(`/rooms/${id}`, patch)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["rooms"] }),
  });
}

export function useDeleteRoom() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => api.delete(`/rooms/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["rooms"] }),
  });
}
