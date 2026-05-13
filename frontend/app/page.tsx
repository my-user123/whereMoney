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

const previewMeta: Record<string, { label: string; title: string; detail: string; accent: string; delta: string }> = {
  首页: { label: "总览", title: "今日财务概览", detail: "收入、支出、结余和目标进度集中呈现。", accent: "#d4a017", delta: "+6.72%" },
  账户: { label: "账户", title: "账户余额追踪", detail: "现金、银行卡、微信、支付宝分账户查看。", accent: "#2563eb", delta: "+3.18%" },
  预算: { label: "预算", title: "预算执行状态", detail: "提前发现接近预算线的消费分类。", accent: "#dc2626", delta: "-4.20%" },
  记账: { label: "记账", title: "快速确认收支", detail: "手动或 AI 解析后确认每一笔收入支出。", accent: "#16a34a", delta: "+12 笔" },
  报表: { label: "报表", title: "消费趋势分析", detail: "用月度趋势和分类占比理解消费结构。", accent: "#7c3aed", delta: "+8.04%" },
  目标: { label: "目标", title: "储蓄目标进度", detail: "把半年存款、旅行基金等目标拆成进度。", accent: "#ea580c", delta: "68%" }
};

const previewData: Record<
  string,
  {
    primaryLabel: string;
    primaryValue: string;
    statusCards: Array<{ label: string; value: string; width: string; icon: typeof Target; detail: string; tone: string }>;
    metrics: Array<{ label: string; value: string; tone: string; icon: typeof Target }>;
    listTitle: string;
    listBadge: string;
    items: Array<[string, string, string]>;
    insight: string;
    tags: [string, string];
  }
> = {
  首页: {
    primaryLabel: "总资产净值",
    primaryValue: "¥128,750.00",
    statusCards: [
      { label: "储蓄目标", value: "68%", width: "68%", icon: Target, detail: "半年存款目标", tone: "text-charcoal" },
      { label: "预算健康", value: "良好", width: "82%", icon: ShieldCheck, detail: "预算剩余 32%", tone: "text-emerald-700" }
    ],
    metrics: [
      { label: "本月收入", value: "¥18,600.00", tone: "text-emerald-700", icon: CircleDollarSign },
      { label: "本月支出", value: "¥8,340.00", tone: "text-red-700", icon: ReceiptText },
      { label: "本月结余", value: "¥10,260.00", tone: "text-charcoal", icon: PiggyBank },
      { label: "储蓄率", value: "55%", tone: "text-charcoal", icon: Target }
    ],
    listTitle: "最近交易",
    listBadge: "3 笔",
    items: [
      ["星巴克咖啡", "餐饮", "-36.00"],
      ["地铁 2 号线", "交通", "-6.00"],
      ["工资收入", "薪资", "+12,600.00"]
    ],
    insight: "本月餐饮支出较上月增加，建议把日均餐饮控制在预算线以内。",
    tags: ["餐饮 +12%", "预算剩余 32%"]
  },
  账户: {
    primaryLabel: "账户总余额",
    primaryValue: "¥128,750.00",
    statusCards: [
      { label: "活跃账户", value: "4 个", width: "80%", icon: WalletCards, detail: "现金/银行卡/微信/支付宝", tone: "text-charcoal" },
      { label: "主账户占比", value: "62%", width: "62%", icon: CircleDollarSign, detail: "招商银行卡", tone: "text-blue-700" }
    ],
    metrics: [
      { label: "银行卡", value: "¥92,500.00", tone: "text-charcoal", icon: WalletCards },
      { label: "微信零钱", value: "¥3,240.00", tone: "text-charcoal", icon: CircleDollarSign },
      { label: "支付宝", value: "¥28,600.00", tone: "text-charcoal", icon: CircleDollarSign },
      { label: "现金", value: "¥4,410.00", tone: "text-charcoal", icon: CircleDollarSign }
    ],
    listTitle: "账户变动",
    listBadge: "4 个",
    items: [
      ["招商银行卡", "主账户", "¥92,500.00"],
      ["支付宝余额", "电子钱包", "¥28,600.00"],
      ["微信零钱", "日常消费", "¥3,240.00"]
    ],
    insight: "银行卡仍是主要资金池，日常消费账户余额适中，可以继续保持分账户管理。",
    tags: ["主账户 62%", "电子钱包 25%"]
  },
  预算: {
    primaryLabel: "本月预算剩余",
    primaryValue: "¥3,660.00",
    statusCards: [
      { label: "预算健康", value: "良好", width: "82%", icon: ShieldCheck, detail: "总体未超支", tone: "text-emerald-700" },
      { label: "高风险分类", value: "1 个", width: "42%", icon: ReceiptText, detail: "餐饮接近预算线", tone: "text-red-700" }
    ],
    metrics: [
      { label: "月预算", value: "¥12,000.00", tone: "text-charcoal", icon: Target },
      { label: "已使用", value: "¥8,340.00", tone: "text-red-700", icon: ReceiptText },
      { label: "剩余额度", value: "¥3,660.00", tone: "text-emerald-700", icon: PiggyBank },
      { label: "使用率", value: "69.5%", tone: "text-charcoal", icon: LineChart }
    ],
    listTitle: "预算分类",
    listBadge: "4 类",
    items: [
      ["餐饮预算", "已用 84%", "¥420 剩余"],
      ["交通预算", "已用 51%", "¥392 剩余"],
      ["娱乐预算", "已用 38%", "¥620 剩余"]
    ],
    insight: "餐饮预算已经进入高关注区，建议接下来优先控制外食和饮品支出。",
    tags: ["餐饮 84%", "交通 51%"]
  },
  记账: {
    primaryLabel: "今日已记账",
    primaryValue: "12 笔",
    statusCards: [
      { label: "待确认", value: "2 笔", width: "30%", icon: ReceiptText, detail: "AI 解析后待确认", tone: "text-charcoal" },
      { label: "完成率", value: "86%", width: "86%", icon: ShieldCheck, detail: "今日记录完整度", tone: "text-emerald-700" }
    ],
    metrics: [
      { label: "收入笔数", value: "1 笔", tone: "text-emerald-700", icon: CircleDollarSign },
      { label: "支出笔数", value: "11 笔", tone: "text-red-700", icon: ReceiptText },
      { label: "平均支出", value: "¥42.80", tone: "text-charcoal", icon: LineChart },
      { label: "AI 解析", value: "5 笔", tone: "text-charcoal", icon: Bot }
    ],
    listTitle: "待确认记录",
    listBadge: "2 笔",
    items: [
      ["午餐 28 元", "AI 识别：餐饮", "待确认"],
      ["打车 19 元", "AI 识别：交通", "待确认"],
      ["便利店", "手动记录", "-12.00"]
    ],
    insight: "今天的小额消费较多，建议晚上统一确认待处理记录，避免漏账。",
    tags: ["待确认 2", "AI 解析 5"]
  },
  报表: {
    primaryLabel: "本月净结余",
    primaryValue: "¥10,260.00",
    statusCards: [
      { label: "同比趋势", value: "+8.04%", width: "76%", icon: LineChart, detail: "较上月改善", tone: "text-emerald-700" },
      { label: "最大支出", value: "餐饮", width: "58%", icon: ReceiptText, detail: "占支出 31%", tone: "text-charcoal" }
    ],
    metrics: [
      { label: "餐饮占比", value: "31%", tone: "text-charcoal", icon: ReceiptText },
      { label: "交通占比", value: "17%", tone: "text-charcoal", icon: LineChart },
      { label: "购物占比", value: "14%", tone: "text-charcoal", icon: CircleDollarSign },
      { label: "娱乐占比", value: "9%", tone: "text-charcoal", icon: PiggyBank }
    ],
    listTitle: "分类排行",
    listBadge: "Top 3",
    items: [
      ["餐饮", "本月最高", "¥2,585.00"],
      ["交通", "通勤稳定", "¥1,418.00"],
      ["购物", "较上月下降", "¥1,168.00"]
    ],
    insight: "消费结构整体稳定，餐饮仍是最大的弹性支出项，可以作为下月优化重点。",
    tags: ["餐饮 31%", "购物 -6%"]
  },
  目标: {
    primaryLabel: "储蓄目标进度",
    primaryValue: "68%",
    statusCards: [
      { label: "目标金额", value: "¥20,000", width: "100%", icon: Target, detail: "半年存款计划", tone: "text-charcoal" },
      { label: "已存金额", value: "¥13,600", width: "68%", icon: PiggyBank, detail: "还差 ¥6,400", tone: "text-emerald-700" }
    ],
    metrics: [
      { label: "目标金额", value: "¥20,000", tone: "text-charcoal", icon: Target },
      { label: "已完成", value: "¥13,600", tone: "text-emerald-700", icon: PiggyBank },
      { label: "剩余", value: "¥6,400", tone: "text-charcoal", icon: CircleDollarSign },
      { label: "预计完成", value: "2 月", tone: "text-charcoal", icon: LineChart }
    ],
    listTitle: "目标拆解",
    listBadge: "3 项",
    items: [
      ["旅行基金", "进度 68%", "¥13,600"],
      ["月存计划", "本月目标", "¥3,000"],
      ["自动提醒", "每周复盘", "开启"]
    ],
    insight: "储蓄目标推进顺利，如果本月继续保持 55% 储蓄率，预计可提前完成。",
    tags: ["进度 68%", "还差 32%"]
  }
};

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
  const data = previewData[activeTab];
  const [activeMetric, setActiveMetric] = useState("总资产净值");
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
                onClick={() => {
                  setActiveTab(tab);
                  setActiveMetric(tab === "目标" ? "储蓄目标" : tab === "预算" ? "预算健康" : "总资产净值");
                }}
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
                <button
                  className="grid w-full gap-4 rounded-md text-left transition hover:bg-white/30 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start"
                  type="button"
                  onClick={() => setActiveMetric("总资产净值")}
                >
                  <div className="min-w-0">
                    <p className="text-sm text-muted">{data.primaryLabel}</p>
                    <p className="mt-2 whitespace-nowrap text-[clamp(2rem,3.6vw,2.65rem)] font-semibold leading-none">{data.primaryValue}</p>
                  </div>
                  <div className="w-fit rounded-full border border-emerald-200 bg-emerald-50/70 px-3 py-1.5 text-xs text-emerald-700 sm:justify-self-end">
                    较上月 {meta.delta}
                  </div>
                </button>
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
                {data.statusCards.map(({ label, value, width, icon: Icon, detail, tone }) => (
                  <button
                    key={label}
                    className={`rounded-md border border-line bg-white/35 p-4 text-left transition hover:-translate-y-0.5 hover:bg-white/60 hover:shadow-focus ${activeMetric === label ? "ring-2 ring-[#d4a017]/35" : ""}`}
                    type="button"
                    onClick={() => setActiveMetric(label)}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs text-muted">{label}</p>
                      <Icon className="h-4 w-4 text-[#d4a017]" />
                    </div>
                    <p className={`mt-3 text-2xl font-semibold ${tone}`}>{value}</p>
                    <p className="mt-1 text-xs text-muted">{detail}</p>
                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-line">
                      <div className="wm-progress-fill h-full rounded-full bg-[#d4a017]" style={{ width }} />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {data.metrics.map(({ label, value, tone, icon: Icon }) => (
                <button
                  key={label}
                  className={`rounded-md border border-line bg-white/35 p-4 text-left transition hover:-translate-y-0.5 hover:bg-white/60 hover:shadow-focus ${activeMetric === label ? "ring-2 ring-[#d4a017]/35" : ""}`}
                  type="button"
                  onClick={() => setActiveMetric(label)}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs leading-5 text-muted">{label}</p>
                    <Icon className="h-4 w-4 text-[#d4a017]" />
                  </div>
                  <p className={`mt-3 whitespace-nowrap text-[clamp(1.45rem,2.6vw,1.9rem)] font-semibold leading-tight ${tone}`}>{value}</p>
                </button>
              ))}
            </div>

            <div className="mt-3 grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(220px,0.82fr)]">
              <div className="rounded-md border border-line bg-white/35 p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{data.listTitle}</h3>
                  <span className="rounded-full bg-[#ebe8df] px-2 py-1 text-xs text-muted">{data.listBadge}</span>
                </div>
                <div className="mt-4 grid gap-3 text-sm">
                  {data.items.map(([name, type, amount]) => (
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
                <p className="mt-4 text-sm leading-6 text-muted">
                  {data.insight}
                </p>
                <div className="mt-5 h-2 overflow-hidden rounded-full bg-line">
                  <div className="wm-soft-pulse h-2 w-[68%] rounded-full bg-[#d4a017]" />
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                  <span className="rounded-md border border-line px-3 py-2 text-muted">{data.tags[0]}</span>
                  <span className="rounded-md border border-line px-3 py-2 text-muted">{data.tags[1]}</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
