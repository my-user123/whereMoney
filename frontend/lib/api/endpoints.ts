"use client";

import { apiRequest, toQuery } from "@/lib/api/client";
import type { Account, AuthResponse, Category, Dashboard, PageResponse, Transaction, UserMe } from "@/types/api";

type TransactionInput = {
  type: "INCOME" | "EXPENSE";
  amount: string;
  currency: string;
  accountId: string;
  categoryId: string;
  occurredAt: string;
  note?: string;
};

export const authApi = {
  login: (body: { email: string; password: string }) =>
    apiRequest<AuthResponse>("/api/v1/auth/login", { method: "POST", body: JSON.stringify(body) }),
  loginWithCode: (body: { email: string; code: string }) =>
    apiRequest<AuthResponse>("/api/v1/auth/login/code", { method: "POST", body: JSON.stringify(body) }),
  requestCode: (body: { email: string }) =>
    apiRequest<{ expiresInSeconds: number }>("/api/v1/auth/verification-codes", {
      method: "POST",
      body: JSON.stringify(body)
    }),
  register: (body: { email: string; password: string }) =>
    apiRequest<AuthResponse>("/api/v1/auth/register", { method: "POST", body: JSON.stringify(body) })
};

export const userApi = {
  me: () => apiRequest<UserMe>("/api/v1/users/me"),
  updateProfile: (body: Partial<UserMe>) =>
    apiRequest<UserMe>("/api/v1/users/me/profile", { method: "PUT", body: JSON.stringify(body) })
};

export const accountApi = {
  list: (status = "ACTIVE") => apiRequest<Account[]>(`/api/v1/accounts${toQuery({ status })}`),
  create: (body: Omit<Account, "id" | "currentBalance" | "status">) =>
    apiRequest<Account>("/api/v1/accounts", { method: "POST", body: JSON.stringify(body) }),
  update: (id: string, body: Omit<Account, "id" | "currentBalance" | "status">) =>
    apiRequest<Account>(`/api/v1/accounts/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  archive: (id: string) => apiRequest<Account>(`/api/v1/accounts/${id}/archive`, { method: "PATCH" })
};

export const categoryApi = {
  list: (params: { type?: string; status?: string } = {}) =>
    apiRequest<Category[]>(`/api/v1/categories${toQuery({ status: "ACTIVE", ...params })}`),
  create: (body: Pick<Category, "name" | "type" | "icon" | "color">) =>
    apiRequest<Category>("/api/v1/categories", { method: "POST", body: JSON.stringify(body) }),
  update: (id: string, body: Pick<Category, "name" | "type" | "icon" | "color">) =>
    apiRequest<Category>(`/api/v1/categories/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  disable: (id: string) => apiRequest<Category>(`/api/v1/categories/${id}/disable`, { method: "PATCH" })
};

export const transactionApi = {
  list: (params: Record<string, string | number | undefined>) =>
    apiRequest<PageResponse<Transaction>>(`/api/v1/transactions${toQuery(params)}`),
  detail: (id: string) => apiRequest<Transaction>(`/api/v1/transactions/${id}`),
  create: (body: TransactionInput) => apiRequest<Transaction>("/api/v1/transactions", { method: "POST", body: JSON.stringify(body) }),
  update: (id: string, body: TransactionInput) =>
    apiRequest<Transaction>(`/api/v1/transactions/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  remove: (id: string) => apiRequest<void>(`/api/v1/transactions/${id}`, { method: "DELETE" })
};

export const analyticsApi = {
  dashboard: (params: { periodStart?: string; periodEnd?: string } = {}) =>
    apiRequest<Dashboard>(`/api/v1/analytics/dashboard${toQuery(params)}`)
};
