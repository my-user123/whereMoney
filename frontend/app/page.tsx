"use client";

import { ArrowRight, BarChart3, Bot, CheckCircle2, Download, LineChart, LockKeyhole, ShieldCheck, Sparkles, WalletCards } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getToken } from "@/lib/api/client";

const features = [
  { icon: Bot, title: "AI 智能记账", text: "用一句话记录收入支出，确认后再入账。" },
  { icon: LineChart, title: "消费结构洞察", text: "收入、支出、分类占比和趋势一眼看清。" },
  { icon: ShieldCheck, title: "预算与风险提示", text: "提前发现超支压力，帮你稳住现金流。" },
  { icon: Download, title: "月报导出", text: "后续支持 Excel / PDF 月报沉淀。" }
];

const transactions = [
  ["星巴克咖啡", "餐饮", "-36.00"],
  ["地铁 2 号线", "交通", "-6.00"],
  ["工资收入", "薪资", "+12,600.00"]
];

export default function LandingPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (getToken()) {
      router.replace("/dashboard");
      return;
    }
    setChecking(false);
  }, [router]);

  if (checking) {
    return <main className="min-h-screen bg-cream" />;
  }

  return (
    <main className="min-h-screen bg-cream text-charcoal">
      <header className="sticky top-0 z-20 border-b border-line bg-cream/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link className="flex items-center gap-2 font-semibold" href="/">
            <span className="grid h-8 w-8 place-items-center rounded-md border border-line">
              <WalletCards className="h-4 w-4 text-[#d4a017]" />
            </span>
            WhereMoney
          </Link>
          <nav className="hidden items-center gap-7 text-sm text-muted md:flex">
            <a href="#features">功能亮点</a>
            <a href="#preview">财务预览</a>
            <a href="#workflow">使用流程</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link className="rounded-md border border-[rgba(28,28,28,0.4)] px-4 py-2 text-sm" href="/auth/login">
              登录
            </Link>
            <Link className="rounded-md bg-charcoal px-4 py-2 text-sm text-[#fcfbf8] shadow-insetButton" href="/auth/register">
              免费注册
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl gap-10 px-4 pb-16 pt-14 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:pt-20">
        <div>
          <h1 className="max-w-xl text-5xl font-semibold leading-[1.05] tracking-[-1.2px] md:text-6xl">
            看清每一笔花销，掌控你的每一分钱
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-7 text-muted">
            WhereMoney 是面向学生、上班族和年轻家庭的 AI 智能记账工具，让自然语言记账、消费分析和财务趋势变成每天都能看懂的生活仪表盘。
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link className="inline-flex items-center justify-center gap-2 rounded-md bg-charcoal px-5 py-3 text-sm text-[#fcfbf8] shadow-insetButton" href="/auth/register">
              免费开始使用
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a className="inline-flex items-center justify-center rounded-md border border-[rgba(28,28,28,0.4)] px-5 py-3 text-sm" href="#preview">
              了解功能
            </a>
          </div>
          <div className="mt-12 grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-2xl font-semibold">3 步</p>
              <p className="mt-1 text-muted">完成一笔记账</p>
            </div>
            <div>
              <p className="text-2xl font-semibold">多币种</p>
              <p className="mt-1 text-muted">分币种统计</p>
            </div>
            <div>
              <p className="text-2xl font-semibold">AI</p>
              <p className="mt-1 text-muted">辅助分析</p>
            </div>
          </div>
        </div>

        <ProductPreview />
      </section>

      <section className="border-y border-line" id="features">
        <div className="mx-auto grid max-w-6xl gap-4 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div className="rounded-lg border border-line p-4" key={feature.title}>
                <Icon className="h-5 w-5 text-[#d4a017]" />
                <h2 className="mt-4 text-base font-medium">{feature.title}</h2>
                <p className="mt-2 text-sm leading-6 text-muted">{feature.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-16 lg:grid-cols-3" id="workflow">
        <div>
          <h2 className="text-3xl font-semibold tracking-[-0.6px]">一站式个人财务管理</h2>
          <p className="mt-4 text-sm leading-6 text-muted">
            从记录、分类、账户余额，到月度总结和导出，所有数据都围绕“理解钱花在哪里”展开。
          </p>
        </div>
        {["创建账户", "记录收支", "查看分析"].map((item, index) => (
          <div className="rounded-lg border border-line p-5" key={item}>
            <span className="grid h-9 w-9 place-items-center rounded-full border border-line text-sm">{index + 1}</span>
            <h3 className="mt-5 text-xl font-medium">{item}</h3>
            <p className="mt-2 text-sm leading-6 text-muted">
              {index === 0 ? "维护现金、银行卡、微信、支付宝等账户。" : index === 1 ? "手动或后续通过 AI 确认收入支出。" : "通过 Dashboard 和图表理解财务结构。"}
            </p>
          </div>
        ))}
      </section>
    </main>
  );
}

function ProductPreview() {
  return (
    <div className="rounded-xl border border-line p-4" id="preview">
      <div className="grid gap-4 rounded-lg border border-line p-4 lg:grid-cols-[180px_1fr]">
        <aside className="hidden border-r border-line pr-4 text-sm text-muted lg:block">
          {["首页", "账户", "预算", "记账", "报表", "目标"].map((item, index) => (
            <div className={index === 0 ? "mb-2 rounded-md bg-[rgba(28,28,28,0.06)] px-3 py-2 text-charcoal" : "mb-2 px-3 py-2"} key={item}>
              {item}
            </div>
          ))}
        </aside>
        <div>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="font-medium">早上好，周一！</p>
              <p className="text-sm text-muted">这是你今天的财务概览</p>
            </div>
            <span className="rounded-md border border-line px-3 py-2 text-sm">CNY</span>
          </div>
          <div className="rounded-lg border border-line p-4">
            <p className="text-sm text-muted">总资产净值</p>
            <div className="mt-2 flex items-end justify-between gap-4">
              <p className="text-4xl font-semibold tracking-[-0.8px]">¥128,750.00</p>
              <span className="text-sm text-green-700">较上月 +6.72%</span>
            </div>
            <div className="mt-6 h-24 rounded-md border border-line bg-[linear-gradient(180deg,rgba(28,28,28,0.03),transparent)] p-3">
              <svg className="h-full w-full" viewBox="0 0 420 90" preserveAspectRatio="none">
                <path d="M0 60 C40 54 50 48 86 52 C120 56 128 34 160 38 C200 42 204 28 246 34 C284 40 292 28 330 30 C372 32 382 18 420 12" fill="none" stroke="#d4a017" strokeWidth="3" />
              </svg>
            </div>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-4">
            {[["本月收入", "¥18,600.00"], ["本月支出", "¥8,340.00"], ["本月结余", "¥10,260.00"], ["储蓄率", "55%"]].map(([label, value]) => (
              <div className="rounded-lg border border-line p-3" key={label}>
                <p className="text-xs text-muted">{label}</p>
                <p className="mt-2 text-lg font-semibold">{value}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-lg border border-line p-4">
              <p className="font-medium">最近交易</p>
              <div className="mt-3 divide-y divide-line">
                {transactions.map(([name, type, amount]) => (
                  <div className="flex items-center justify-between py-2 text-sm" key={name}>
                    <span>{name}<span className="ml-2 text-muted">{type}</span></span>
                    <span className={amount.startsWith("+") ? "text-green-700" : "text-charcoal"}>{amount}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-lg border border-line p-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#d4a017]" />
                <p className="font-medium">AI 洞察</p>
              </div>
              <p className="mt-3 text-sm leading-6 text-muted">
                本月餐饮支出较上月增加，建议把日均餐饮控制在预算线以内。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
