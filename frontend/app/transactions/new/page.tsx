"use client";

import { AppShell } from "@/components/layout/app-shell";
import { AuthGuard } from "@/components/layout/auth-guard";
import { TransactionForm } from "@/features/transaction/transaction-form";

export default function NewTransactionPage() {
  return (
    <AuthGuard>
      <AppShell title="记一笔">
        <TransactionForm />
      </AppShell>
    </AuthGuard>
  );
}
