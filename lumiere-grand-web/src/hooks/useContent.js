import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

function collectionHooks(name) {
  return {
    useList: (opts = {}) =>
      useQuery({ queryKey: [name], queryFn: async () => (await api.get(`/${name}`)).data, ...opts }),
    useCreate: () => {
      const qc = useQueryClient();
      return useMutation({
        mutationFn: async (payload) => (await api.post(`/${name}`, payload)).data,
        onSuccess: () => qc.invalidateQueries({ queryKey: [name] }),
      });
    },
    useUpdate: () => {
      const qc = useQueryClient();
      return useMutation({
        mutationFn: async ({ id, patch }) => (await api.put(`/${name}/${id}`, patch)).data,
        onSuccess: () => qc.invalidateQueries({ queryKey: [name] }),
      });
    },
    useRemove: () => {
      const qc = useQueryClient();
      return useMutation({
        mutationFn: async (id) => api.delete(`/${name}/${id}`),
        onSuccess: () => qc.invalidateQueries({ queryKey: [name] }),
      });
    },
    useUploadImage: () => {
      return useMutation({
        mutationFn: async ({ id, file }) => {
          const form = new FormData();
          form.append("image", file);
          const res = await api.post(`/${name}/${id}/image`, form, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          return res.data.url;
        },
      });
    },
  };
}

export const offersApi = collectionHooks("offers");
export const experiencesApi = collectionHooks("experiences");

export function useReviews() {
  return useQuery({ queryKey: ["reviews"], queryFn: async () => (await api.get("/reviews")).data });
}
export function useAllReviews(enabled = true) {
  return useQuery({
    queryKey: ["reviews", "all"],
    queryFn: async () => (await api.get("/reviews/all")).data,
    enabled,
  });
}
export function useCreateReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => (await api.post("/reviews", payload)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["reviews"] }),
  });
}
export function useUpdateReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, patch }) => (await api.put(`/reviews/${id}`, patch)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["reviews"] }),
  });
}

export function useNotifications(enabled = true) {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: async () => (await api.get("/notifications")).data,
    enabled,
    refetchInterval: 30_000,
  });
}
export function useMarkNotificationRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => (await api.put(`/notifications/${id}/read`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });
}

export function useDashboardStats(enabled = true) {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => (await api.get("/dashboard/stats")).data,
    enabled,
    refetchInterval: 60_000,
  });
}
