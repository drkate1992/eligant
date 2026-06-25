"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { BeneficiaryDTO } from "@/types";

function invalidateMoney(qc: ReturnType<typeof useQueryClient>) {
  qc.invalidateQueries({ queryKey: ["accounts"] });
  qc.invalidateQueries({ queryKey: ["transactions"] });
}

export function useBeneficiaries() {
  return useQuery({
    queryKey: ["beneficiaries"],
    queryFn: () => api.get<BeneficiaryDTO[]>("/api/beneficiaries"),
  });
}

export function useAddBeneficiary() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      api.post<BeneficiaryDTO>("/api/beneficiaries", data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["beneficiaries"] }),
  });
}

export function useDeleteBeneficiary() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.del(`/api/beneficiaries/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["beneficiaries"] }),
  });
}

export function useToggleFavoriteBeneficiary() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.patch(`/api/beneficiaries/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["beneficiaries"] }),
  });
}

export function useInternalTransfer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      api.post<{ reference: string }>("/api/transfers/internal", data),
    onSuccess: () => invalidateMoney(qc),
  });
}

export function useExternalTransfer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      api.post<{ reference: string }>("/api/transfers/external", data),
    onSuccess: () => invalidateMoney(qc),
  });
}
