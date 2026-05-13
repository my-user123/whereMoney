"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { accountApi, categoryApi, transactionApi } from "@/lib/api/endpoints";
import { toIsoLocalInputValue } from "@/lib/formatters/money";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { EmptyState, ErrorState, LoadingState } from "@/components/feedback/states";

export function TransactionForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [type, setType] = useState<"INCOME" | "EXPENSE">("EXPENSE");
  const [form, setForm] = useState({
    amount: "",
    accountId: "",
    categoryId: "",
    occurredAt: toIsoLocalInputValue(),
    note: ""
  });

  const accounts = useQuery({ queryKey: ["accounts"], queryFn: () => accountApi.list() });
  const categories = useQuery({ queryKey: ["categories", type], queryFn: () => categoryApi.list({ type }) });
  const selectedAccount = useMemo(
    () => accounts.data?.find((account) => account.id === form.accountId),
    [accounts.data, form.accountId]
  );

  const mutation = useMutation({
    mutationFn: () =>
      transactionApi.create({
        type,
        amount: form.amount,
        accountId: form.accountId,
        categoryId: form.categoryId,
        currency: selectedAccount?.currency ?? "CNY",
        occurredAt: new Date(form.occurredAt).toISOString(),
        note: form.note || undefined
      }),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["transactions"] }),
        queryClient.invalidateQueries({ queryKey: ["dashboard"] }),
        queryClient.invalidateQueries({ queryKey: ["accounts"] })
      ]);
      router.push("/transactions");
    }
  });

  if (accounts.isLoading || categories.isLoading) {
    return <LoadingState />;
  }
  if (accounts.isError || categories.isError) {
    return <ErrorState message="表单基础数据加载失败" />;
  }
  if (!accounts.data?.length) {
    return <EmptyState title="还没有可用账户，请先创建一个账户。" action={<Button onClick={() => router.push("/accounts")}>去创建账户</Button>} />;
  }
  if (!categories.data?.length) {
    return <EmptyState title="当前类型没有可用分类，请先创建分类。" action={<Button onClick={() => router.push("/categories")}>去创建分类</Button>} />;
  }

  return (
    <form className="grid gap-4 rounded-xl border border-line p-4" onSubmit={(event) => { event.preventDefault(); mutation.mutate(); }}>
      <div className="grid grid-cols-2 gap-2 rounded-md border border-line p-1">
        {(["EXPENSE", "INCOME"] as const).map((item) => (
          <button
            className={item === type ? "rounded bg-charcoal px-3 py-2 text-sm text-[#fcfbf8]" : "rounded px-3 py-2 text-sm text-muted"}
            key={item}
            type="button"
            onClick={() => {
              setType(item);
              setForm({ ...form, categoryId: "" });
            }}
          >
            {item === "EXPENSE" ? "支出" : "收入"}
          </button>
        ))}
      </div>
      <Field label="金额">
        <Input required inputMode="decimal" placeholder="28.00" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
      </Field>
      <Field label="账户">
        <Select required value={form.accountId} onChange={(e) => setForm({ ...form, accountId: e.target.value })}>
          <option value="">选择账户</option>
          {accounts.data.map((account) => (
            <option key={account.id} value={account.id}>
              {account.name} · {account.currency}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="分类">
        <Select required value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
          <option value="">选择分类</option>
          {categories.data.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="发生时间">
        <Input required type="datetime-local" value={form.occurredAt} onChange={(e) => setForm({ ...form, occurredAt: e.target.value })} />
      </Field>
      <Field label="备注">
        <Textarea value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
      </Field>
      {mutation.isError ? <p className="text-sm text-red-700">{mutation.error.message}</p> : null}
      <Button disabled={mutation.isPending} type="submit">
        {mutation.isPending ? "保存中..." : "保存账单"}
      </Button>
    </form>
  );
}
