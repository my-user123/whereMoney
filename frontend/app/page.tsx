"use client";

import { ArrowRight, Bot, CircleDollarSign, Download, LineChart, PiggyBank, ReceiptText, ShieldCheck, Target, WalletCards } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getToken } from "@/lib/api/client";

const features = [
  { icon: Bot, title: "自然语言记账", text: "输入“今天午餐 28 元”，确认后自动归类入账。" },
  { icon: LineChart, title: "消费结构洞察", text: "按分类、账户、周期理解钱花在哪里。" },
  { icon: ShieldCheck, title: "预算风险提示", text: "预算、储蓄率和趋势变化会被重点提醒。" },
  { icon: Download, title: "月报导出", text: "把月度总结沉淀为 Excel / PDF 报告。" }
];

const tabs = ["首页", "账户", "预算", "记账", "报表", "目标"];

const previewMeta: Record<string, { label: string; title: string; detail: string; accent: string }> = {
  首页: { label: "总览", title: "今日财务概览", detail: "收入、支出、结余和目标进度集中呈现。", accent: "#d4a017" },
  账户: { label: "账户", title: "账户余额追踪", detail: "现金、银行卡、微信、支付宝分账户查看。", accent: "#2563eb" },
  预算: { label: "预算", title: "预算执行状态", detail: "提前发现接近预算线的消费分类。", accent: "#dc2626" },
  记账: { label: "记账", title: "快速确认收支", detail: "手动或 AI 解析后确认每一笔收入支出。", accent: "#16a34a" },
  报表: { label: "报表", title: "消费趋势分析", detail: "用月度趋势和分类占比理解消费结构。", accent: "#7c3aed" },
  目标: { label: "目标", title: "储蓄目标进度", detail: "把半年存款、旅行基金等目标拆成进度。", accent: "#ea580c" }
};

const transactions = [
  ["星巴克咖啡", "餐饮", "-36.00"],
  ["地铁 2 号线", "交通", "-6.00"],
  ["工资收入", "薪资", "+12,600.00"]
];

export default function LandingPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [activeTab, setActiveTab] = useState("首页");

  useEffect(() => {
    if (getToken()) {
      router.replace("/dashboard");
      return;
    }
    setChecking(false);
  }, [router]);

  function scrollToSection(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  if (checking) {
    return <main className="min-h-screen bg-cream" />;
  }

  return (
    <main className="min-h-screen overflow-hidden bg-cream text-charcoal">
      <header className="sticky top-0 z-30 border-b border-line bg-cream/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link className="flex items-center gap-2 font-semibold" href="/">
            <span className="grid h-9 w-9 place-items-center rounded-md border border-line">
              <WalletCards className="h-4 w-4 text-[#d4a017]" />
            </span>
            <span className="text-lg">WhereMoney</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link className="rounded-md border border-[rgba(28,28,28,0.4)] px-4 py-2 text-sm" href="/auth/login">
              登录
            </Link>
            <Link className="hidden rounded-md bg-charcoal px-4 py-2 text-sm text-[#fcfbf8] shadow-insetButton sm:inline-flex" href="/auth/register">
              免费注册
            </Link>
          </div>
        </div>
      </header>

      <section id="preview" className="mx-auto grid max-w-6xl gap-8 px-4 pb-14 pt-12 sm:pt-16 lg:min-h-[calc(100vh-73px)] lg:grid-cols-[0.88fr_1.12fr] lg:items-center lg:gap-12">
        <div className="wm-fade-up">
          <p className="mb-4 inline-flex rounded-full border border-line px-3 py-1 text-xs text-muted">AI 智能记账与个人财务分析</p>
          <h1 className="max-w-xl text-[clamp(2.35rem,6vw,3.9rem)] font-semibold leading-[1.06]">
            让每一次消费，都有迹可循
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-muted sm:text-lg">
            从收入支出、分类预算到 AI 总结，WhereMoney 把个人财务拆成可理解、可行动的日常工作台。
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link className="inline-flex items-center justify-center gap-2 rounded-md bg-charcoal px-5 py-3 text-sm text-[#fcfbf8] shadow-insetButton" href="/auth/register">
              免费开始使用
              <ArrowRight className="h-4 w-4" />
            </Link>
            <button className="inline-flex items-center justify-center rounded-md border border-[rgba(28,28,28,0.4)] px-5 py-3 text-sm" type="button" onClick={() => scrollToSection("features")}>
              了解功能
            </button>
          </div>
          <div className="mt-10 grid grid-cols-3 gap-3 text-center text-sm sm:max-w-md">
            {[
              ["3 步", "完成一笔记账"],
              ["多币种", "分币种统计"],
              ["AI", "辅助分析"]
            ].map(([value, label]) => (
              <div key={value} className="rounded-md border border-line bg-white/35 p-3">
                <div className="text-2xl font-semibold">{value}</div>
                <div className="mt-1 text-xs text-muted">{label}</div>
              </div>
            ))}
          </div>
        </div>
        <ProductPreview activeTab={activeTab} setActiveTab={setActiveTab} />
      </section>

      <section id="features" className="border-y border-line bg-[#fbfaf6] px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-semibold sm:text-4xl">一站式个人财务管理</h2>
            <p className="mt-4 text-muted">功能围绕“记录、理解、调整”展开，不把用户淹没在复杂表格里。</p>
          </div>
          <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <article key={feature.title} className="wm-fade-up rounded-md border border-line bg-cream p-5" style={{ animationDelay: `${index * 90}ms` }}>
                <feature.icon className="h-5 w-5 text-[#d4a017]" />
                <h3 className="mt-5 text-lg font-semibold">{feature.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted">{feature.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="workflow" className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <h2 className="text-3xl font-semibold sm:text-4xl">从第一笔账开始建立财务认知</h2>
            <p className="mt-4 text-muted">先创建账户，再记录收支，最后通过仪表盘和月度总结持续调整。</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              ["1", "创建账户", "维护现金、银行卡、微信、支付宝等账户。"],
              ["2", "记录收支", "手动或后续通过 AI 确认收入支出。"],
              ["3", "查看分析", "用图表、预算和 AI 总结理解财务结构。"]
            ].map(([step, title, text]) => (
              <article key={step} className="rounded-md border border-line bg-white/35 p-5">
                <span className="grid h-10 w-10 place-items-center rounded-full border border-line text-sm">{step}</span>
                <h3 className="mt-10 text-xl font-semibold">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function ProductPreview({ activeTab, setActiveTab }: { activeTab: string; setActiveTab: (tab: string) => void }) {
  const meta = previewMeta[activeTab];
  return (
    <div className="wm-fade-up rounded-xl border border-line bg-white/35 p-2 shadow-focus sm:p-3" style={{ animationDelay: "120ms" }}>
      <div className="rounded-lg border border-line bg-cream p-3 sm:p-5">
        <div className="grid gap-4">
          <aside className="flex gap-2 overflow-x-auto border-b border-line pb-3">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`shrink-0 rounded-md px-4 py-3 text-center text-sm transition ${activeTab === tab ? "bg-[#ebe8df] text-charcoal shadow-insetButton" : "text-muted hover:bg-white/60 hover:text-charcoal"}`}
                type="button"
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </aside>
          <section className="min-w-0">
            <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-line px-2.5 py-1 text-xs text-muted">{meta.label}</span>
                  <span className="text-xs text-muted">早上好，周一</span>
                </div>
                <h2 className="mt-3 text-xl font-semibold sm:text-2xl">{meta.title}</h2>
                <p className="mt-1 text-sm leading-6 text-muted">{meta.detail}</p>
              </div>
              <span className="w-fit rounded-md border border-line bg-white/30 px-4 py-2 text-sm font-medium">CNY</span>
            </div>

            <div className="mt-5 grid gap-3 lg:grid-cols-[minmax(0,1.35fr)_minmax(210px,0.65fr)]">
              <div className="rounded-md border border-line bg-[#fbfaf6] p-4 sm:p-5">
                <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
                  <div className="min-w-0">
                    <p className="text-sm text-muted">总资产净值</p>
                    <p className="mt-2 whitespace-nowrap text-[clamp(2rem,3.6vw,2.65rem)] font-semibold leading-none">¥128,750.00</p>
                  </div>
                  <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                    较上月 +6.72%
                  </div>
                </div>
                <div className="mt-6 rounded-md border border-line bg-cream/70 p-3">
                  <svg className="h-28 w-full" viewBox="0 0 420 120" role="img" aria-label="财务趋势曲线">
                    <path d="M10 92 C58 78, 83 83, 116 65 S173 62, 210 73 S279 48, 320 47 S368 43, 410 25" fill="none" stroke={meta.accent} strokeLinecap="round" strokeWidth="4" className="wm-line-draw" />
                    <path d="M10 92 C58 78, 83 83, 116 65 S173 62, 210 73 S279 48, 320 47 S368 43, 410 25 L410 112 L10 112 Z" fill="url(#warmFill)" opacity="0.34" />
                    <defs>
                      <linearGradient id="warmFill" x1="0" x2="0" y1="0" y2="1">
                        <stop stopColor={meta.accent} />
                        <stop offset="1" stopColor="#f7f4ed" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
                {[
                  ["储蓄目标", "68%", Target],
                  ["预算健康", "良好", ShieldCheck]
                ].map(([label, value, Icon]) => (
                  <div key={label as string} className="rounded-md border border-line bg-white/35 p-4">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs text-muted">{label as string}</p>
                      <Icon className="h-4 w-4 text-[#d4a017]" />
                    </div>
                    <p className="mt-3 text-2xl font-semibold">{value as string}</p>
                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-line">
                      <div className="h-full rounded-full bg-[#d4a017]" style={{ width: label === "储蓄目标" ? "68%" : "82%" }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {[
                ["本月收入", "¥18,600.00", "text-emerald-700", CircleDollarSign],
                ["本月支出", "¥8,340.00", "text-red-700", ReceiptText],
                ["本月结余", "¥10,260.00", "text-charcoal", PiggyBank],
                ["储蓄率", "55%", "text-charcoal", Target]
              ].map(([label, value, tone, Icon]) => (
                <div key={label as string} className="rounded-md border border-line bg-white/35 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs leading-5 text-muted">{label as string}</p>
                    <Icon className="h-4 w-4 text-[#d4a017]" />
                  </div>
                  <p className={`mt-3 whitespace-nowrap text-[clamp(1.45rem,2.6vw,1.9rem)] font-semibold leading-tight ${tone as string}`}>{value as string}</p>
                </div>
              ))}
            </div>

            <div className="mt-3 grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(220px,0.82fr)]">
              <div className="rounded-md border border-line bg-white/35 p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">最近交易</h3>
                  <span className="rounded-full bg-[#ebe8df] px-2 py-1 text-xs text-muted">3 笔</span>
                </div>
                <div className="mt-4 grid gap-3 text-sm">
                  {transactions.map(([name, type, amount]) => (
                    <div key={name} className="flex items-center justify-between gap-3 border-b border-line pb-3 last:border-0 last:pb-0">
                      <span className="min-w-0">
                        <span className="block truncate">{name}</span>
                        <span className="text-muted">{type}</span>
                      </span>
                      <span className={amount.startsWith("+") ? "text-emerald-700" : "text-charcoal"}>{amount}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-md border border-line bg-[#fbfaf6] p-4">
                <div className="flex items-center gap-2 font-semibold">
                  <PiggyBank className="h-4 w-4 text-[#d4a017]" />
                  AI 洞察
                </div>
                <p className="mt-4 text-sm leading-6 text-muted">本月餐饮支出较上月增加，建议把日均餐饮控制在预算线以内。</p>
                <div className="mt-5 h-2 overflow-hidden rounded-full bg-line">
                  <div className="wm-soft-pulse h-2 w-[68%] rounded-full bg-[#d4a017]" />
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                  <span className="rounded-md border border-line px-3 py-2 text-muted">餐饮 +12%</span>
                  <span className="rounded-md border border-line px-3 py-2 text-muted">预算剩余 32%</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
