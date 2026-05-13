"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { AuthGuard } from "@/components/layout/auth-guard";
import { EmptyState, ErrorState, LoadingState } from "@/components/feedback/states";
import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/field";
import { accountApi } from "@/lib/api/endpoints";
import { formatAmount } from "@/lib/formatters/money";

export default function AccountsPage() {
  const queryClient = useQueryClient();
  const accounts = useQuery({ queryKey: ["accounts"], queryFn: () => accountApi.list() });
  const [form, setForm] = useState({ name: "", type: "CASH", currency: "CNY", initialBalance: "0.00", color: "#1c1c1c", icon: "wallet" });
  const create = useMutation({
    mutationFn: () => accountApi.create(form as never),
    onSuccess: async () => {
      setForm({ ...form, name: "", initialBalance: "0.00" });
      await queryClient.invalidateQueries({ queryKey: ["accounts"] });
    }
  });
  const archive = useMutation({
    mutationFn: accountApi.archive,
    onSuccess: async () => queryClient.invalidateQueries({ queryKey: ["accounts"] })
  });

  return (
    <AuthGuard>
      <AppShell title="账户">
        <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
          <section>
            {accounts.isLoading ? <LoadingState /> : null}
            {accounts.isError ? <ErrorState message="账户加载失败" onRetry={() => accounts.refetch()} /> : null}
            {accounts.data?.length ? (
              <div className="grid gap-3">
                {accounts.data.map((account) => (
                  <div className="flex items-center justify-between rounded-lg border border-line p-4" key={account.id}>
                    <div>
                      <p className="font-medium">{account.name}</p>
                      <p className="text-sm text-muted">{account.type} · {account.currency}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatAmount(account.currentBalance, account.currency)}</p>
                      <button className="mt-1 text-xs text-muted underline" disabled={archive.isPending} onClick={() => archive.mutate(account.id)}>
                        归档
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : accounts.data ? <EmptyState title="还没有账户，请先创建一个。" /> : null}
          </section>
          <form className="grid gap-4 rounded-xl border border-line p-4" onSubmit={(event) => { event.preventDefault(); create.mutate(); }}>
            <h2 className="text-xl font-semibold">新增账户</h2>
            <Field label="账户名">
              <Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </Field>
            <Field label="类型">
              <Select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                <option value="CASH">现金</option>
                <option value="BANK_CARD">银行卡</option>
                <option value="WECHAT">微信</option>
                <option value="ALIPAY">支付宝</option>
                <option value="OTHER">其他</option>
              </Select>
            </Field>
            <Field label="币种">
              <Input required maxLength={3} value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value.toUpperCase() })} />
            </Field>
            <Field label="初始余额">
              <Input required inputMode="decimal" value={form.initialBalance} onChange={(e) => setForm({ ...form, initialBalance: e.target.value })} />
            </Field>
            {create.isError ? <p className="text-sm text-red-700">{create.error.message}</p> : null}
            <Button disabled={create.isPending} type="submit">{create.isPending ? "保存中..." : "创建账户"}</Button>
          </form>
        </div>
      </AppShell>
    </AuthGuard>
  );
}
