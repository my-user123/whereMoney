"use client";

import { Apple, CheckCircle2, Eye, ShieldCheck, Wallet } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/field";
import { authApi } from "@/lib/api/endpoints";
import { useAuthStore } from "@/store/auth-store";

const categoryChips = ["餐饮", "交通", "购物", "娱乐", "薪资", "兼职"];

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [form, setForm] = useState({ username: "", password: "", nickname: "", defaultCurrency: "CNY" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const data = await authApi.register(form);
      setAuth(data.token, data.user);
      router.replace("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "注册失败");
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
              <Wallet className="h-4 w-4" />
            </span>
            WhereMoney
          </Link>
          <p className="text-sm text-muted">
            已有账号？{" "}
            <Link className="text-charcoal underline" href="/auth/login">
              去登录
            </Link>
          </p>
        </header>
        <div className="grid min-h-[680px] lg:grid-cols-[0.95fr_1.05fr]">
          <section className="border-b border-line p-6 lg:border-b-0 lg:border-r lg:p-10">
            <h1 className="max-w-md text-4xl font-semibold leading-[1.08] tracking-[-0.8px] md:text-5xl">
              开始你的财务管理之旅
            </h1>
            <p className="mt-5 max-w-md text-sm leading-6 text-muted">
              注册后即可获得默认分类，创建账户后就能开始记录收入支出，并在 Dashboard 查看财务概览。
            </p>
            <div className="mt-7 grid gap-3 text-sm">
              {["免费注册，快速上手", "默认分类已为你准备", "支持多币种账户", "数据安全，隐私保护"].map((item) => (
                <div className="flex items-center gap-2" key={item}>
                  <CheckCircle2 className="h-4 w-4 text-green-700" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <div className="mt-8 rounded-xl border border-line p-5">
              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-full border border-line">
                  <ShieldCheck className="h-5 w-5 text-[#d4a017]" />
                </span>
                <div>
                  <p className="font-medium">默认分类已准备好</p>
                  <p className="text-sm text-muted">注册后可按你的习惯继续编辑</p>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {categoryChips.map((item) => (
                  <span className="rounded-md border border-line px-3 py-2 text-sm" key={item}>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </section>

          <section className="flex items-center p-6 lg:p-10">
            <form className="w-full" onSubmit={submit}>
              <p className="text-sm text-muted">创建你的账号</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-[-0.6px]">让 WhereMoney 接住你的第一本账</h2>
              <div className="mt-8 grid gap-4">
                <Field label="用户名">
                  <Input required placeholder="用于登录的用户名" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
                </Field>
                <Field label="昵称">
                  <Input required placeholder="例如：小明" value={form.nickname} onChange={(e) => setForm({ ...form, nickname: e.target.value })} />
                </Field>
                <Field label="密码">
                  <div className="relative">
                    <Input required className="w-full pr-10" minLength={6} placeholder="至少 6 位密码" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                    <Eye className="pointer-events-none absolute right-3 top-3.5 h-4 w-4 text-muted" />
                  </div>
                </Field>
                <Field label="默认币种">
                  <Select value={form.defaultCurrency} onChange={(e) => setForm({ ...form, defaultCurrency: e.target.value })}>
                    <option value="CNY">CNY - 人民币</option>
                    <option value="USD">USD - 美元</option>
                    <option value="EUR">EUR - 欧元</option>
                    <option value="JPY">JPY - 日元</option>
                  </Select>
                </Field>
                <label className="flex items-start gap-2 text-xs leading-5 text-muted">
                  <input required className="mt-0.5 h-4 w-4 accent-charcoal" type="checkbox" />
                  我已阅读并同意用户协议和隐私政策
                </label>
                {error ? <p className="text-sm text-red-700">{error}</p> : null}
                <Button className="h-11 w-full" disabled={submitting} type="submit">
                  {submitting ? "注册中..." : "注册"}
                </Button>
                <div className="relative py-2 text-center text-xs text-muted">
                  <span className="bg-cream px-3">也可以用其他方式注册</span>
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
              </div>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}
