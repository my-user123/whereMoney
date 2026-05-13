"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authApi } from "@/lib/api/endpoints";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const data = await authApi.login(form);
      setAuth(data.token, data.user);
      router.replace("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "登录失败");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <form className="w-full max-w-sm rounded-xl border border-line p-6" onSubmit={submit}>
        <p className="text-sm text-muted">WhereMoney</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-[-0.6px]">欢迎回来</h1>
        <div className="mt-6 grid gap-4">
          <Field label="用户名">
            <Input required value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
          </Field>
          <Field label="密码">
            <Input required type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </Field>
          {error ? <p className="text-sm text-red-700">{error}</p> : null}
          <Button disabled={submitting} type="submit">
            {submitting ? "登录中..." : "登录"}
          </Button>
          <Link className="text-center text-sm text-muted underline" href="/auth/register">
            还没有账号？注册
          </Link>
        </div>
      </form>
    </main>
  );
}
