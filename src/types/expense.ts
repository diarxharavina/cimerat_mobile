export type ExpenseStatus = "pending" | "claimed_paid" | "confirmed" | "disputed";

export type Share = {
  user: string;
  amount: number;
  status: ExpenseStatus;
};

export type Expense = {
  id: string;
  flatId: string;
  title: string;
  period: string;
  amount: number;
  paidBy: string;
  shares: Share[];
  createdAt: string;
};
