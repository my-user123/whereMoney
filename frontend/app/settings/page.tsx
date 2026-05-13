"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { AuthGuard } from "@/components/layout/auth-guard";
import { ErrorState, LoadingState } from "@/components/feedback/states";
import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/field";
import { userApi } from "@/lib/api/endpoints";

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const user = useQuery({ queryKey: ["me"], queryFn: userApi.me });
  const [form, setForm] = useState({ nickname: "", avatarUrl: "", defaultCurrency: "CNY", userType: "", timezone: "Asia/Shanghai" });
  const update = useMutation({
    mutationFn: () => userApi.updateProfile(form),
    onSuccess: async () => queryClient.invalidateQueries({ queryKey: ["me"] })
  });

  useEffect(() => {
    if (user.data) {
      setForm({
        nickname: user.data.nickname,
        avatarUrl: user.data.avatarUrl ?? "",
        defaultCurrency: user.data.defaultCurrency,
        userType: user.data.userType ?? "",
        timezone: user.data.timezone
      });
    }
  }, [user.data]);

  return (
    <AuthGuard>
      <AppShell title="我的">
        {user.isLoading ? <LoadingState /> : null}
        {user.isError ? <ErrorState message="资料加载失败" onRetry={() => user.refetch()} /> : null}
        {user.data ? (
          <form className="grid max-w-xl gap-4 rounded-xl border border-line p-4" onSubmit={(event) => { event.preventDefault(); update.mutate(); }}>
            <Field label="昵称">
              <Input required value={form.nickname} onChange={(e) => setForm({ ...form, nickname: e.target.value })} />
            </Field>
            <Field label="头像 URL">
              <Input value={form.avatarUrl} onChange={(e) => setForm({ ...form, avatarUrl: e.target.value })} />
            </Field>
            <Field label="默认币种">
              <Select value={form.defaultCurrency} onChange={(e) => setForm({ ...form, defaultCurrency: e.target.value })}>
                <option value="CNY">CNY</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="JPY">JPY</option>
              </Select>
            </Field>
            <Field label="用户类型">
              <Input value={form.userType} onChange={(e) => setForm({ ...form, userType: e.target.value })} />
            </Field>
            <Field label="时区">
              <Input value={form.timezone} onChange={(e) => setForm({ ...form, timezone: e.target.value })} />
            </Field>
            {update.isError ? <p className="text-sm text-red-700">{update.error.message}</p> : null}
            {update.isSuccess ? <p className="text-sm text-green-700">已保存</p> : null}
            <Button disabled={update.isPending} type="submit">{update.isPending ? "保存中..." : "保存资料"}</Button>
          </form>
        ) : null}
      </AppShell>
    </AuthGuard>
  );
}
