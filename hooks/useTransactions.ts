"use client";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { api, buildQuery } from "@/lib/api-client";
import type {
  TxnPage,
  TransactionDTO,
  TxnStats,
  MonthlyPoint,
  CategorySlice,
} from "@/types";

export interface TxnFilters {
  type?: string;
  category?: string;
  accountId?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
}

export function useTransactions(filters: TxnFilters = {}) {
  return useInfiniteQuery({
    queryKey: ["transactions", filters],
    initialPageParam: undefined as string | undefined,
    queryFn: ({ pageParam }) =>
      api.get<TxnPage>(
        "/api/transactions" +
          buildQuery({ ...filters, cursor: pageParam }),
      ),
    getNextPageParam: (last) => last.nextCursor ?? undefined,
  });
}

export function useRecentTransactions(limit = 5) {
  return useQuery({
    queryKey: ["transactions", "recent", limit],
    queryFn: () =>
      api
        .get<TxnPage>("/api/transactions" + buildQuery({ limit }))
        .then((p) => p.data),
  });
}

export function useTransaction(id: string | null) {
  return useQuery({
    queryKey: ["transaction", id],
    enabled: !!id,
    queryFn: () => api.get<TransactionDTO>(`/api/transactions/${id}`),
  });
}

export function useTxnStats(filters: { startDate?: string; endDate?: string } = {}) {
  return useQuery({
    queryKey: ["transactions", "stats", filters],
    queryFn: () => api.get<TxnStats>("/api/transactions/stats" + buildQuery(filters)),
  });
}

export function useMonthly() {
  return useQuery({
    queryKey: ["transactions", "monthly"],
    queryFn: () => api.get<MonthlyPoint[]>("/api/transactions/monthly"),
  });
}

export function useByCategory() {
  return useQuery({
    queryKey: ["transactions", "by-category"],
    queryFn: () => api.get<CategorySlice[]>("/api/transactions/by-category"),
  });
}
