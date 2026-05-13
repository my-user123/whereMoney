"use client";

import { Apple, CheckCircle2, Eye, LineChart, LockKeyhole, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { authApi } from "@/lib/api/endpoints";
import { useAuthStore } from "@/store/auth-store";

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
    <main className="min-h-screen bg-cream px-4 py-6 text-charcoal">
      <div className="mx-auto max-w-6xl rounded-xl border border-line">
        <header className="flex items-center justify-between border-b border-line px-5 py-4">
          <Link className="flex items-center gap-2 font-semibold" href="/">
            <span className="grid h-8 w-8 place-items-center rounded-md border border-line text-[#d4a017]">
              <LockKeyhole className="h-4 w-4" />
            </span>
            WhereMoney
          </Link>
          <p className="text-sm text-muted">
            还没有账号？{" "}
            <Link className="text-charcoal underline" href="/auth/register">
              立即注册
            </Link>
          </p>
        </header>
        <div className="grid min-h-[660px] lg:grid-cols-[1.05fr_0.95fr]">
          <section className="border-b border-line p-6 lg:border-b-0 lg:border-r lg:p-10">
            <h1 className="max-w-md text-4xl font-semibold leading-[1.08] tracking-[-0.8px] md:text-5xl">
              你的财务状况，一目了然
            </h1>
            <p className="mt-5 max-w-md text-sm leading-6 text-muted">
              回到你的个人财务工作台，继续查看账户余额、近期交易、消费结构和 AI 洞察。
            </p>
            <div className="mt-7 grid gap-3 text-sm">
              {["AI 智能记账，省时省力", "多维度分析，发现消费规律", "预算管理，控制支出", "数据安全，隐私保护"].map((item) => (
                <div className="flex items-center gap-2" key={item}>
                  <CheckCircle2 className="h-4 w-4 text-green-700" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <div className="mt-8 rounded-xl border border-line p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted">本月结余</p>
                  <p className="mt-1 text-3xl font-semibold tracking-[-0.6px]">¥7,376.50</p>
                </div>
                <span className="text-sm text-green-700">+6.0%</span>
              </div>
              <div className="mt-5 h-24 rounded-md border border-line p-3">
                <svg className="h-full w-full" preserveAspectRatio="none" viewBox="0 0 360 90">
                  <path d="M0 68 C48 54 64 60 96 50 C134 38 144 34 186 42 C224 50 238 20 276 28 C318 36 328 14 360 18" fill="none" stroke="#16a34a" strokeWidth="3" />
                </svg>
              </div>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-line p-4">
                <LineChart className="h-5 w-5 text-[#d4a017]" />
                <p className="mt-3 text-sm font-medium">支出占比</p>
                <p className="mt-1 text-xs text-muted">餐饮 31% · 交通 17%</p>
              </div>
              <div className="rounded-lg border border-line p-4">
                <Sparkles className="h-5 w-5 text-[#d4a017]" />
                <p className="mt-3 text-sm font-medium">AI 洞察</p>
                <p className="mt-1 text-xs text-muted">本月订阅支出略高</p>
              </div>
            </div>
          </section>

          <section className="flex items-center p-6 lg:p-10">
            <form className="w-full" onSubmit={submit}>
              <p className="text-sm text-muted">欢迎回来</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-[-0.6px]">登录你的 WhereMoney 账户</h2>
              <div className="mt-8 grid gap-4">
                <Field label="用户名">
                  <Input required placeholder="请输入用户名" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
                </Field>
                <Field label="密码">
                  <div className="relative">
                    <Input required className="w-full pr-10" placeholder="请输入密码" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                    <Eye className="pointer-events-none absolute right-3 top-3.5 h-4 w-4 text-muted" />
                  </div>
                </Field>
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 text-muted">
                    <input className="h-4 w-4 accent-charcoal" type="checkbox" />
                    记住我
                  </label>
                  <button className="text-muted underline" type="button">
                    忘记密码？
                  </button>
                </div>
                {error ? <p className="text-sm text-red-700">{error}</p> : null}
                <Button className="h-11 w-full" disabled={submitting} type="submit">
                  {submitting ? "登录中..." : "登录"}
                </Button>
                <div className="relative py-2 text-center text-xs text-muted">
                  <span className="bg-cream px-3">其他登录方式</span>
                  <div className="-mt-2 border-t border-line" />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {["G", "微信"].map((item) => (
                    <button className="h-11 rounded-md border border-line text-sm" key={item} type="button">
                      {item}
                    </button>
                  ))}
                  <button className="grid h-11 place-items-center rounded-md border border-line" type="button">
                    <Apple className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-center text-xs leading-5 text-muted">
                  登录即表示你同意用户协议和隐私政策
                </p>
              </div>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}
