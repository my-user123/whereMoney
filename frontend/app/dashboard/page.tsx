"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Plus } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { AuthGuard } from "@/components/layout/auth-guard";
import { LoadingState, EmptyState, ErrorState } from "@/components/feedback/states";
import { analyticsApi, userApi } from "@/lib/api/endpoints";
import { formatAmount } from "@/lib/formatters/money";
import { TransactionList } from "@/features/transaction/transaction-list";

export default function DashboardPage() {
  const user = useQuery({ queryKey: ["me"], queryFn: userApi.me });
  const dashboard = useQuery({ queryKey: ["dashboard"], queryFn: () => analyticsApi.dashboard() });

  return (
    <AuthGuard>
      <AppShell title="首页">
        <div className="grid gap-5">
          <section className="rounded-xl border border-line p-5">
            <p className="text-sm text-muted">你好，{user.data?.nickname ?? "今天也记得看看钱去哪了"}</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {dashboard.isLoading ? <LoadingState /> : null}
              {dashboard.isError ? <ErrorState message="仪表盘加载失败" onRetry={() => dashboard.refetch()} /> : null}
              {dashboard.data?.summaryByCurrency.length ? (
                dashboard.data.summaryByCurrency.map((item) => (
                  <div className="rounded-lg border border-line p-4" key={item.currency}>
                    <p className="text-xs text-muted">{item.currency}</p>
                    <p className="mt-2 text-2xl font-semibold tracking-[-0.4px]">{formatAmount(item.balanceAmount)}</p>
                    <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                      <span className="text-green-700">收入 {formatAmount(item.incomeAmount)}</span>
                      <span className="text-orange-700">支出 {formatAmount(item.expenseAmount)}</span>
                    </div>
                  </div>
                ))
              ) : dashboard.data ? (
                <EmptyState title="本期还没有账单数据。" action={<Link className="text-sm underline" href="/transactions/new">去记一笔</Link>} />
              ) : null}
            </div>
          </section>
          <section className="grid gap-3 sm:grid-cols-3">
            <Link className="rounded-lg border border-line p-4" href="/transactions/new">
              <Plus className="mb-3 h-5 w-5" />
              <p className="font-medium">手动记账</p>
              <p className="mt-1 text-sm text-muted">记录一笔收入或支出</p>
            </Link>
            <Link className="rounded-lg border border-line p-4" href="/accounts">
              <p className="font-medium">账户管理</p>
              <p className="mt-1 text-sm text-muted">维护现金、银行卡和钱包</p>
            </Link>
            <Link className="rounded-lg border border-line p-4" href="/categories">
              <p className="font-medium">分类管理</p>
              <p className="mt-1 text-sm text-muted">整理收入和支出结构</p>
            </Link>
          </section>
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-xl font-semibold">近期账单</h2>
              <Link className="text-sm text-muted underline" href="/transactions">
                查看全部
              </Link>
            </div>
            {dashboard.data?.recentTransactions.length ? (
              <TransactionList items={dashboard.data.recentTransactions} />
            ) : (
              <EmptyState title="暂无近期账单。" action={<Link className="text-sm underline" href="/transactions/new">立即记账</Link>} />
            )}
          </section>
        </div>
      </AppShell>
    </AuthGuard>
  );
}
