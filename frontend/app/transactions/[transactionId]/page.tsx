"use client";

import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/layout/app-shell";
import { AuthGuard } from "@/components/layout/auth-guard";
import { EmptyState, ErrorState, LoadingState } from "@/components/feedback/states";
import { transactionApi } from "@/lib/api/endpoints";
import { formatAmount } from "@/lib/formatters/money";

export default function TransactionDetailPage({ params }: { params: { transactionId: string } }) {
  const detail = useQuery({
    queryKey: ["transaction", params.transactionId],
    queryFn: () => transactionApi.detail(params.transactionId)
  });

  return (
    <AuthGuard>
      <AppShell title="账单详情">
        {detail.isLoading ? <LoadingState /> : null}
        {detail.isError ? <ErrorState message="账单详情加载失败" onRetry={() => detail.refetch()} /> : null}
        {detail.data ? (
          <div className="rounded-xl border border-line p-5">
            <p className="text-sm text-muted">{detail.data.type === "INCOME" ? "收入" : "支出"}</p>
            <p className="mt-2 text-4xl font-semibold tracking-[-0.8px]">{formatAmount(detail.data.amount, detail.data.currency)}</p>
            <div className="mt-6 grid gap-3 text-sm">
              <p>账户：{detail.data.account.name}</p>
              <p>分类：{detail.data.category.name}</p>
              <p>时间：{new Date(detail.data.occurredAt).toLocaleString()}</p>
              <p>来源：{detail.data.source}</p>
              <p>备注：{detail.data.note || "无"}</p>
            </div>
          </div>
        ) : detail.isSuccess ? <EmptyState title="账单不存在。" /> : null}
      </AppShell>
    </AuthGuard>
  );
}
