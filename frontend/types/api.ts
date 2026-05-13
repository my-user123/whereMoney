export type ApiEnvelope<T> = {
  code: number;
  message: string;
  data: T;
};

export type PageResponse<T> = {
  total: number;
  page: number;
  size: number;
  list: T[];
};

export type AuthUser = {
  id: string;
  email: string;
  username: string;
  nickname: string;
  defaultCurrency: string;
};

export type AuthResponse = {
  token: string;
  user: AuthUser;
};

export type UserMe = AuthUser & {
  avatarUrl?: string | null;
  userType?: string | null;
  timezone: string;
};

export type Account = {
  id: string;
  name: string;
  type: "CASH" | "BANK_CARD" | "WECHAT" | "ALIPAY" | "OTHER";
  currency: string;
  initialBalance: string;
  currentBalance: string;
  color?: string | null;
  icon?: string | null;
  status: "ACTIVE" | "ARCHIVED" | "DISABLED";
};

export type Category = {
  id: string;
  name: string;
  type: "INCOME" | "EXPENSE";
  icon?: string | null;
  color?: string | null;
  isSystem: boolean;
  status: "ACTIVE" | "DISABLED";
};

export type Transaction = {
  id: string;
  type: "INCOME" | "EXPENSE";
  amount: string;
  currency: string;
  occurredAt: string;
  account: { id: string; name: string };
  category: { id: string; name: string; icon?: string | null; color?: string | null };
  note?: string | null;
  source: "MANUAL" | "AI_CONFIRMED" | "RECURRING_CONFIRMED";
};

export type DashboardSummary = {
  currency: string;
  incomeAmount: string;
  expenseAmount: string;
  balanceAmount: string;
  savingRate: number;
};

export type BudgetHighlight = {
  id: string;
  name: string;
  periodType: "WEEKLY" | "MONTHLY" | "YEARLY" | "CUSTOM";
  amount: string;
  usedAmount: string;
  usageRate: number;
  currency: string;
  status: string;
};

export type SavingGoalHighlight = {
  id: string;
  name: string;
  targetAmount: string;
  currentAmount: string;
  progressRate: number;
  currency: string;
  status: string;
};

export type Dashboard = {
  currencies: string[];
  summaryByCurrency: DashboardSummary[];
  budgetHighlights: BudgetHighlight[];
  savingGoalHighlights: SavingGoalHighlight[];
  recentTransactions: Transaction[];
  aiInsightSummary?: string | null;
};
