"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { AuthGuard } from "@/components/layout/auth-guard";
import { EmptyState, ErrorState, LoadingState } from "@/components/feedback/states";
import { Button } from "@/components/ui/button";
import { transactionApi } from "@/lib/api/endpoints";
import { TransactionList } from "@/features/transaction/transaction-list";

export default function TransactionsPage() {
  const queryClient = useQueryClient();
  const transactions = useQuery({
    queryKey: ["transactions", 1],
    queryFn: () => transactionApi.list({ page: 1, size: 20 })
  });
  const remove = useMutation({
    mutationFn: transactionApi.remove,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["transactions"] }),
        queryClient.invalidateQueries({ queryKey: ["dashboard"] }),
        queryClient.invalidateQueries({ queryKey: ["accounts"] })
      ]);
    }
  });

  return (
    <AuthGuard>
      <AppShell title="账单">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-muted">默认按发生时间倒序展示</p>
          <Link href="/transactions/new">
            <Button type="button">记一笔</Button>
          </Link>
        </div>
        {transactions.isLoading ? <LoadingState /> : null}
        {transactions.isError ? <ErrorState message="账单加载失败" onRetry={() => transactions.refetch()} /> : null}
        {transactions.data?.list.length ? (
          <div className="grid gap-3">
            <TransactionList items={transactions.data.list} />
            {transactions.data.list.map((item) => (
              <div className="-mt-3 flex justify-end border-x border-b border-line px-4 pb-3" key={`actions-${item.id}`}>
                <button className="text-xs text-muted underline" disabled={remove.isPending} onClick={() => remove.mutate(item.id)}>
                  删除
                </button>
              </div>
            ))}
          </div>
        ) : transactions.data ? (
          <EmptyState title="暂无账单。" action={<Link className="text-sm underline" href="/transactions/new">立即记账</Link>} />
        ) : null}
        {remove.isError ? <p className="mt-3 text-sm text-red-700">{remove.error.message}</p> : null}
      </AppShell>
    </AuthGuard>
  );
}
