"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { AuthGuard } from "@/components/layout/auth-guard";
import { EmptyState, ErrorState, LoadingState } from "@/components/feedback/states";
import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/field";
import { categoryApi } from "@/lib/api/endpoints";

export default function CategoriesPage() {
  const queryClient = useQueryClient();
  const [type, setType] = useState<"EXPENSE" | "INCOME">("EXPENSE");
  const categories = useQuery({ queryKey: ["categories", type], queryFn: () => categoryApi.list({ type }) });
  const [form, setForm] = useState({ name: "", type: "EXPENSE" as "EXPENSE" | "INCOME", icon: "tag", color: "#1c1c1c" });
  const create = useMutation({
    mutationFn: () => categoryApi.create(form),
    onSuccess: async () => {
      setForm({ ...form, name: "" });
      await queryClient.invalidateQueries({ queryKey: ["categories"] });
    }
  });
  const disable = useMutation({
    mutationFn: categoryApi.disable,
    onSuccess: async () => queryClient.invalidateQueries({ queryKey: ["categories"] })
  });

  return (
    <AuthGuard>
      <AppShell title="分类">
        <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
          <section>
            <div className="mb-4 grid grid-cols-2 gap-2 rounded-md border border-line p-1">
              {(["EXPENSE", "INCOME"] as const).map((item) => (
                <button className={item === type ? "rounded bg-charcoal py-2 text-sm text-[#fcfbf8]" : "rounded py-2 text-sm text-muted"} key={item} onClick={() => setType(item)} type="button">
                  {item === "EXPENSE" ? "支出分类" : "收入分类"}
                </button>
              ))}
            </div>
            {categories.isLoading ? <LoadingState /> : null}
            {categories.isError ? <ErrorState message="分类加载失败" onRetry={() => categories.refetch()} /> : null}
            {categories.data?.length ? (
              <div className="grid gap-3">
                {categories.data.map((category) => (
                  <div className="flex items-center justify-between rounded-lg border border-line p-4" key={category.id}>
                    <div>
                      <p className="font-medium">{category.name}</p>
                      <p className="text-sm text-muted">{category.type} · {category.isSystem ? "系统默认" : "自定义"}</p>
                    </div>
                    <button className="text-xs text-muted underline" disabled={category.isSystem || disable.isPending} onClick={() => disable.mutate(category.id)}>
                      停用
                    </button>
                  </div>
                ))}
              </div>
            ) : categories.data ? <EmptyState title="当前类型还没有分类。" /> : null}
          </section>
          <form className="grid gap-4 rounded-xl border border-line p-4" onSubmit={(event) => { event.preventDefault(); create.mutate(); }}>
            <h2 className="text-xl font-semibold">新增分类</h2>
            <Field label="分类名">
              <Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </Field>
            <Field label="类型">
              <Select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as "EXPENSE" | "INCOME" })}>
                <option value="EXPENSE">支出</option>
                <option value="INCOME">收入</option>
              </Select>
            </Field>
            <Field label="图标">
              <Input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} />
            </Field>
            <Field label="颜色">
              <Input value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} />
            </Field>
            {create.isError ? <p className="text-sm text-red-700">{create.error.message}</p> : null}
            <Button disabled={create.isPending} type="submit">{create.isPending ? "保存中..." : "创建分类"}</Button>
          </form>
        </div>
      </AppShell>
    </AuthGuard>
  );
}
