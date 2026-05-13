"use client";

import { CheckCircle2, Eye, EyeOff, Wallet } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { authApi } from "@/lib/api/endpoints";
import { useAuthStore } from "@/store/auth-store";

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [form, setForm] = useState({ email: "", password: "" });
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    if (!agreed) {
      setError("请先阅读并同意用户协议和隐私政策");
      return;
    }
    setSubmitting(true);
    try {
      const data = await authApi.register(form);
      setAuth(data.token, data.user);
      setRedirecting(true);
      window.setTimeout(() => router.replace("/dashboard"), 650);
    } catch (err) {
      setError(err instanceof Error ? err.message : "注册失败");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-cream px-4 py-6 text-charcoal">
      {redirecting ? <RedirectOverlay /> : null}
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-xl border border-line lg:min-h-[760px] lg:grid-cols-[0.95fr_1.05fr]">
        <section className="wm-fade-up border-b border-line p-6 sm:p-8 lg:border-b-0 lg:border-r lg:p-12">
          <Link className="flex items-center gap-2 font-semibold" href="/">
            <span className="grid h-9 w-9 place-items-center rounded-md border border-line text-[#d4a017]">
              <Wallet className="h-4 w-4" />
            </span>
            WhereMoney
          </Link>
          <div className="mt-12 max-w-xl">
            <p className="text-sm text-muted">创建你的账号</p>
            <h1 className="mt-4 text-[clamp(2.4rem,7vw,4.8rem)] font-semibold leading-[1.04]">开始你的财务管理之旅</h1>
            <p className="mt-5 text-sm leading-6 text-muted sm:text-base">
              使用邮箱和密码即可注册，进入系统后再按个人习惯完善账户与偏好设置。
            </p>
          </div>
          <div className="mt-8 grid gap-3 text-sm">
            {["邮箱注册，快速上手", "进入系统后完善账户", "数据安全，隐私保护"].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-700" />
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="wm-fade-up flex items-center p-6 sm:p-8 lg:p-12" style={{ animationDelay: "120ms" }}>
          <div className="w-full">
            <div className="mb-10 flex items-center justify-between gap-4 text-sm">
              <span className="text-muted">已有账号？</span>
              <Link className="font-medium underline" href="/auth/login">
                去登录
              </Link>
            </div>
            <h2 className="text-3xl font-semibold sm:text-4xl">注册 WhereMoney</h2>
            <form className="mt-8 grid gap-5" onSubmit={submit}>
              <Field label="邮箱">
                <Input required className="h-12 w-full" type="email" placeholder="name@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </Field>
              <Field label="密码">
                <div className="relative w-full">
                  <Input required minLength={6} type={showPassword ? "text" : "password"} placeholder="至少 6 位密码" className="h-12 w-full pr-11" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                  <button
                    aria-label={showPassword ? "隐藏密码" : "显示密码"}
                    className="absolute right-3 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center text-muted transition hover:text-charcoal"
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </Field>
              <label className="flex items-start gap-2 text-sm text-muted">
                <input className="mt-1 h-4 w-4" type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
                <span>我已阅读并同意用户协议和隐私政策</span>
              </label>
              {error ? <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
              <Button className="h-12 text-base" disabled={submitting} type="submit">
                {submitting ? "注册中..." : "注册"}
              </Button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}

function RedirectOverlay() {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-cream/80 backdrop-blur-sm">
      <div className="rounded-xl border border-line bg-cream p-6 text-center shadow-focus">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-charcoal text-white">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <p className="mt-4 font-semibold">注册成功</p>
        <p className="mt-2 text-sm text-muted">正在进入财务工作台...</p>
        <div className="mt-5 h-1 w-52 overflow-hidden rounded-full bg-line">
          <div className="h-full w-2/3 animate-pulse rounded-full bg-[#d4a017]" />
        </div>
      </div>
    </div>
  );
}
