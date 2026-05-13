"use client";

import type { Transaction } from "@/types/api";
import { formatAmount } from "@/lib/formatters/money";

export function TransactionList({ items }: { items: Transaction[] }) {
  return (
    <div className="divide-y divide-line rounded-lg border border-line">
      {items.map((item) => (
        <div className="flex items-center justify-between gap-3 px-4 py-3" key={item.id}>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{item.category.name}</p>
            <p className="truncate text-xs text-muted">
              {item.account.name} · {new Date(item.occurredAt).toLocaleString()} · {item.note || "无备注"}
            </p>
          </div>
          <span className={item.type === "INCOME" ? "text-sm text-green-700" : "text-sm text-orange-700"}>
            {item.type === "INCOME" ? "+" : "-"}
            {formatAmount(item.amount, item.currency)}
          </span>
        </div>
      ))}
    </div>
  );
}
