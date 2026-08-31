import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useMyBookings(enabled = true) {
  return useQuery({
    queryKey: ["bookings", "mine"],
    queryFn: async () => (await api.get("/bookings/mine")).data,
    enabled,
  });
}

export function useAllBookings(enabled = true) {
  return useQuery({
    queryKey: ["bookings", "all"],
    queryFn: async () => (await api.get("/bookings")).data,
    enabled,
  });
}

export function useCreateBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => (await api.post("/bookings", payload)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["bookings"] }),
  });
}

export function useUpdateBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, patch }) => (await api.put(`/bookings/${id}`, patch)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["bookings"] }),
  });
}

export function useCancelBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => (await api.post(`/bookings/${id}/cancel`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["bookings"] }),
  });
}
