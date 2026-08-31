import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useRoomTypes() {
  return useQuery({
    queryKey: ["room-types"],
    queryFn: async () => (await api.get("/room-types")).data,
    staleTime: 30_000,
  });
}

export function useRoomType(idOrSlug) {
  return useQuery({
    queryKey: ["room-type", idOrSlug],
    queryFn: async () => (await api.get(`/room-types/${idOrSlug}`)).data,
    enabled: !!idOrSlug,
  });
}

export function useCreateRoomType() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => (await api.post("/room-types", payload)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["room-types"] }),
  });
}

export function useUpdateRoomType() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, patch }) => (await api.put(`/room-types/${id}`, patch)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["room-types"] }),
  });
}

export function useDeleteRoomType() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => api.delete(`/room-types/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["room-types"] }),
  });
}

export function useUploadRoomTypeImages() {
  return useMutation({
    mutationFn: async ({ id, files }) => {
      const form = new FormData();
      Array.from(files).forEach((f) => form.append("images", f));
      const res = await api.post(`/room-types/${id}/images`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data.urls;
    },
  });
}
