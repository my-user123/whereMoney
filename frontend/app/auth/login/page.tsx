"use client";

import { CheckCircle2, Eye, LineChart, LockKeyhole, Mail, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { authApi } from "@/lib/api/endpoints";
import { useAuthStore } from "@/store/auth-store";

type LoginMode = "password" | "code";

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [mode, setMode] = useState<LoginMode>("password");
  const [form, setForm] = useState({ email: "", password: "", code: "" });
  const [countdown, setCountdown] = useState(0);
  const [devCode, setDevCode] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (countdown <= 0) {
      return;
    }
    const timer = window.setTimeout(() => setCountdown((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [countdown]);

  async function requestCode() {
    setError("");
    setDevCode("");
    if (!form.email) {
      setError("请先输入邮箱");
      return;
    }
    try {
      const data = await authApi.requestCode({ email: form.email });
      setCountdown(data.expiresInSeconds);
      setDevCode(data.devCode);
    } catch (err) {
      setError(err instanceof Error ? err.message : "验证码发送失败");
    }
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const data =
        mode === "password"
          ? await authApi.login({ email: form.email, password: form.password })
          : await authApi.loginWithCode({ email: form.email, code: form.code });
      setAuth(data.token, data.user);
      setRedirecting(true);
      window.setTimeout(() => router.replace("/dashboard"), 650);
    } catch (err) {
      setError(err instanceof Error ? err.message : "登录失败");
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
              <LockKeyhole className="h-4 w-4" />
            </span>
            WhereMoney
          </Link>
          <div className="mt-12 max-w-xl">
            <p className="text-sm text-muted">欢迎回来</p>
            <h1 className="mt-4 text-[clamp(2.4rem,7vw,4.8rem)] font-semibold leading-[1.04]">你的财务状况，一目了然</h1>
            <p className="mt-5 text-sm leading-6 text-muted sm:text-base">
              登录后进入个人财务工作台，继续查看账户余额、近期交易、消费结构和 AI 洞察。
            </p>
          </div>
          <div className="mt-8 grid gap-3 text-sm">
            {["邮箱密码或验证码登录", "多维度分析，发现消费规律", "预算管理，控制支出", "数据安全，隐私保护"].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-700" />
                {item}
              </div>
            ))}
          </div>
          <div className="mt-10 rounded-md border border-line bg-white/30 p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm text-muted">本月结余</p>
                <p className="mt-1 text-3xl font-semibold">¥7,376.50</p>
              </div>
              <span className="text-sm text-emerald-700">+6.0%</span>
            </div>
            <svg className="mt-6 h-24 w-full" viewBox="0 0 420 110" role="img" aria-label="结余趋势">
              <path className="wm-line-draw" d="M10 82 C65 65, 112 74, 164 50 S250 62, 300 39 S365 42, 410 24" fill="none" stroke="#16a34a" strokeLinecap="round" strokeWidth="4" />
            </svg>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-md border border-line p-4">
                <LineChart className="h-4 w-4 text-[#d4a017]" />
                <p className="mt-3 text-sm font-semibold">支出占比</p>
                <p className="mt-2 text-xs text-muted">餐饮 31% · 交通 17%</p>
              </div>
              <div className="rounded-md border border-line p-4">
                <Sparkles className="h-4 w-4 text-[#d4a017]" />
                <p className="mt-3 text-sm font-semibold">AI 洞察</p>
                <p className="mt-2 text-xs text-muted">本月订阅支出略高</p>
              </div>
            </div>
          </div>
        </section>

        <section className="wm-fade-up flex items-center p-6 sm:p-8 lg:p-12" style={{ animationDelay: "120ms" }}>
          <div className="w-full">
            <div className="mb-10 flex items-center justify-between gap-4 text-sm">
              <span className="text-muted">还没有账号？</span>
              <Link className="font-medium underline" href="/auth/register">
                立即注册
              </Link>
            </div>
            <h2 className="text-3xl font-semibold sm:text-4xl">登录 WhereMoney</h2>
            <div className="mt-6 grid grid-cols-2 rounded-md border border-line p-1 text-sm">
              <button className={`rounded px-3 py-2 ${mode === "password" ? "bg-charcoal text-white" : "text-muted"}`} type="button" onClick={() => setMode("password")}>
                邮箱密码
              </button>
              <button className={`rounded px-3 py-2 ${mode === "code" ? "bg-charcoal text-white" : "text-muted"}`} type="button" onClick={() => setMode("code")}>
                邮箱验证码
              </button>
            </div>
            <form className="mt-6 grid gap-5" onSubmit={submit}>
              <Field label="邮箱">
                <Input required type="email" placeholder="name@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </Field>
              {mode === "password" ? (
                <Field label="密码">
                  <div className="relative">
                    <Input required minLength={6} type="password" placeholder="请输入密码" className="pr-10" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                    <Eye className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-muted" />
                  </div>
                </Field>
              ) : (
                <Field label="验证码">
                  <div className="grid gap-2 sm:grid-cols-[1fr_132px]">
                    <Input required inputMode="numeric" maxLength={6} pattern="\\d{6}" placeholder="6 位验证码" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />
                    <Button type="button" variant="outline" disabled={countdown > 0} onClick={requestCode}>
                      {countdown > 0 ? `${countdown}s` : "获取验证码"}
                    </Button>
                  </div>
                  {devCode ? <span className="text-xs text-muted">开发环境验证码：{devCode}</span> : null}
                </Field>
              )}
              {error ? <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
              <Button className="h-12 text-base" disabled={submitting} type="submit">
                {submitting ? "登录中..." : "登录"}
              </Button>
            </form>
            <p className="mt-6 flex items-center gap-2 text-xs text-muted">
              <Mail className="h-4 w-4" />
              验证码 60 秒内有效，过期后需要重新获取。
            </p>
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
        <p className="mt-4 font-semibold">登录成功</p>
        <p className="mt-2 text-sm text-muted">正在进入财务工作台...</p>
        <div className="mt-5 h-1 w-52 overflow-hidden rounded-full bg-line">
          <div className="h-full w-2/3 animate-pulse rounded-full bg-[#d4a017]" />
        </div>
      </div>
    </div>
  );
}
