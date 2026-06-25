"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { FxRate, NotificationDTO } from "@/types";

export function useFxRates() {
  return useQuery({
    queryKey: ["fx"],
    queryFn: () => api.get<FxRate[]>("/api/fx"),
    staleTime: 5 * 60 * 1000,
    refetchInterval: 60 * 1000,
  });
}

export function useNotifications() {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: () =>
      api.get<{ data: NotificationDTO[]; unread: number }>("/api/notifications"),
    refetchInterval: 60 * 1000,
  });
}

export function useMarkNotificationsRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id?: string) =>
      api.patch("/api/notifications", id ? { id } : {}),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });
}
