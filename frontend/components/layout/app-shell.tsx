"use client";

import { BarChart3, Home, ListOrdered, Plus, Settings, Tags, WalletCards } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clsx } from "clsx";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth-store";

const nav = [
  { href: "/dashboard", label: "首页", icon: Home },
  { href: "/transactions", label: "账单", icon: ListOrdered },
  { href: "/transactions/new", label: "记一笔", icon: Plus },
  { href: "/accounts", label: "账户", icon: WalletCards },
  { href: "/categories", label: "分类", icon: Tags },
  { href: "/settings", label: "我的", icon: Settings }
];

export function AppShell({ children, title }: { children: React.ReactNode; title?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  return (
    <div className="min-h-screen bg-cream">
      <aside className="fixed left-0 top-0 hidden h-screen w-64 border-r border-line px-5 py-6 lg:block">
        <div className="mb-8 flex items-center gap-2">
          <BarChart3 className="h-6 w-6" />
          <span className="text-xl font-semibold">WhereMoney</span>
        </div>
        <nav className="grid gap-1">
          {nav.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                className={clsx(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm",
                  pathname === item.href ? "bg-[rgba(28,28,28,0.06)]" : "text-muted hover:bg-[rgba(28,28,28,0.04)]"
                )}
                href={item.href}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <main className="pb-24 lg:ml-64 lg:pb-0">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-cream/95 px-4 py-4 backdrop-blur lg:px-8">
          <div>
            <p className="text-xs text-muted">个人财务工作台</p>
            <h1 className="text-2xl font-semibold tracking-[-0.4px]">{title ?? "WhereMoney"}</h1>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              logout();
              router.replace("/auth/login");
            }}
          >
            退出
          </Button>
        </header>
        <div className="mx-auto max-w-6xl px-4 py-6 lg:px-8">{children}</div>
      </main>
      <nav className="fixed bottom-0 left-0 right-0 z-20 grid grid-cols-6 border-t border-line bg-cream px-1 py-2 lg:hidden">
        {nav.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              className={clsx("grid justify-items-center gap-1 rounded-md px-1 py-2 text-[11px]", pathname === item.href && "bg-[rgba(28,28,28,0.06)]")}
              href={item.href}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
