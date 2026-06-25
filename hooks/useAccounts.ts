"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { AccountDTO, AccountSummary } from "@/types";

export function useAccounts() {
  return useQuery({
    queryKey: ["accounts"],
    queryFn: () => api.get<AccountDTO[]>("/api/accounts"),
  });
}

export function useAccountSummary() {
  return useQuery({
    queryKey: ["accounts", "summary"],
    queryFn: () => api.get<AccountSummary>("/api/accounts/summary"),
  });
}

export function useCreateAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { type: string; name: string; currency?: string }) =>
      api.post<AccountDTO>("/api/accounts", data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["accounts"] });
    },
  });
}

export function useToggleFreeze() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.patch<AccountDTO>(`/api/accounts/${id}/freeze`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["accounts"] });
    },
  });
}
