"use client";

import { CheckCircle2, Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
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
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (countdown <= 0) {
      return;
    }
    const timer = window.setTimeout(() => setCountdown((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [countdown]);

  async function requestCode() {
    setError("");
    if (!form.email) {
      setError("请先输入邮箱");
      return;
    }
    try {
      const data = await authApi.requestCode({ email: form.email });
      setCountdown(data.expiresInSeconds);
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
    <main className="min-h-screen bg-cream px-4 py-5 text-charcoal sm:py-8">
      {redirecting ? <RedirectOverlay /> : null}
      <div className="mx-auto flex min-h-[calc(100vh-40px)] max-w-6xl flex-col">
        <header className="flex items-center justify-between">
          <Link className="flex items-center gap-2 font-semibold" href="/">
            <span className="grid h-9 w-9 place-items-center rounded-md border border-line text-[#d4a017]">
              <LockKeyhole className="h-4 w-4" />
            </span>
            WhereMoney
          </Link>
          <p className="text-sm text-muted">
            还没有账号？{" "}
            <Link className="font-medium text-charcoal underline" href="/auth/register">
              立即注册
            </Link>
          </p>
        </header>

        <section className="grid flex-1 items-center gap-8 py-10 lg:grid-cols-[0.92fr_1.08fr] lg:gap-12">
          <div className="wm-fade-up hidden lg:block">
            <p className="inline-flex rounded-full border border-line px-3 py-1 text-xs text-muted">欢迎回来</p>
            <h1 className="mt-5 max-w-xl text-5xl font-semibold leading-[1.06]">继续掌控你的个人财务节奏</h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-muted">
              登录后查看账户余额、近期交易、预算状态与 AI 洞察，让每一次消费都能被理解和追踪。
            </p>
            <div className="mt-8 grid max-w-lg gap-3">
              {["邮箱密码或验证码登录", "预算与支出趋势同步查看", "登录成功后自动进入 Dashboard"].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-emerald-700" />
                  {item}
                </div>
              ))}
            </div>
            <div className="mt-10 rounded-md border border-line bg-white/30 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-muted">本月结余</p>
                  <p className="mt-2 text-4xl font-semibold">¥7,376.50</p>
                </div>
                <span className="rounded-full border border-emerald-200 bg-emerald-50/70 px-3 py-1.5 text-xs text-emerald-700">+6.0%</span>
              </div>
              <svg className="mt-6 h-24 w-full" viewBox="0 0 420 110" role="img" aria-label="结余趋势">
                <path className="wm-line-draw" d="M10 82 C65 65, 112 74, 164 50 S250 62, 300 39 S365 42, 410 24" fill="none" stroke="#16a34a" strokeLinecap="round" strokeWidth="4" />
              </svg>
            </div>
          </div>

          <div className="wm-fade-up mx-auto w-full max-w-[520px] rounded-xl border border-line bg-[#fbfaf6] p-5 shadow-focus sm:p-7 lg:justify-self-end" style={{ animationDelay: "90ms" }}>
            <div className="mb-7">
              <p className="text-sm text-muted">登录账户</p>
              <h2 className="mt-2 text-3xl font-semibold sm:text-4xl">欢迎回到 WhereMoney</h2>
            </div>

            <div className="grid grid-cols-2 rounded-md border border-line bg-cream p-1 text-sm">
              <button className={`rounded px-3 py-2.5 transition ${mode === "password" ? "bg-charcoal text-white shadow-insetButton" : "text-muted hover:text-charcoal"}`} type="button" onClick={() => setMode("password")}>
                邮箱密码
              </button>
              <button className={`rounded px-3 py-2.5 transition ${mode === "code" ? "bg-charcoal text-white shadow-insetButton" : "text-muted hover:text-charcoal"}`} type="button" onClick={() => setMode("code")}>
                邮箱验证码
              </button>
            </div>

            <form className="mt-6 grid gap-5" onSubmit={submit}>
              <Field label="邮箱">
                <Input required className="h-12 w-full bg-cream" type="email" placeholder="name@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </Field>

              {mode === "password" ? (
                <Field label="密码">
                  <div className="relative">
                    <Input required minLength={6} type={showPassword ? "text" : "password"} placeholder="请输入密码" className="h-12 w-full bg-cream pr-11" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
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
              ) : (
                <Field label="验证码">
                  <div className="grid gap-2 sm:grid-cols-[1fr_132px]">
                    <Input
                      required
                      className="h-12 w-full bg-cream"
                      inputMode="numeric"
                      maxLength={6}
                      pattern="[0-9]{6}"
                      placeholder="6 位验证码"
                      title="请输入 6 位数字验证码"
                      value={form.code}
                      onChange={(e) => setForm({ ...form, code: e.target.value.replace(/\D/g, "").slice(0, 6) })}
                    />
                    <Button className="h-12" type="button" variant="outline" disabled={countdown > 0} onClick={requestCode}>
                      {countdown > 0 ? `${countdown}s` : "获取验证码"}
                    </Button>
                  </div>
                  <p className="text-xs text-muted">验证码 60 秒内有效，过期后需要重新获取。</p>
                </Field>
              )}

              {error ? <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}

              <Button className="h-12 text-base" disabled={submitting} type="submit">
                {submitting ? "登录中..." : "登录"}
              </Button>
            </form>

            {mode === "code" ? (
              <p className="mt-5 flex items-center gap-2 text-xs text-muted">
                <Mail className="h-4 w-4" />
                使用邮箱收到的一次性验证码登录。
              </p>
            ) : null}

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
