import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useHotelSettings() {
  return useQuery({
    queryKey: ["hotel-settings"],
    queryFn: async () => (await api.get("/hotel")).data,
    staleTime: 60_000,
  });
}

export function useUpdateHotelSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (patch) => (await api.put("/hotel", patch)).data,
    onSuccess: (data) => qc.setQueryData(["hotel-settings"], data),
  });
}

export function useUploadHotelImages() {
  return useMutation({
    mutationFn: async (files) => {
      const form = new FormData();
      Array.from(files).forEach((f) => form.append("images", f));
      const res = await api.post("/hotel/images", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data.urls;
    },
  });
}
