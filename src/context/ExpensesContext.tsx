import { createContext, useContext, useState } from "react";
import type { Expense, ExpenseStatus, Share } from "../types/expense";
import { mockExpenses } from "../data/mockExpenses";
import { useActivity } from "./ActivityContext";

type ExpensesContextType = {
  expenses: Expense[];
  addExpense: (expense: Expense) => void;
  markAsPaid: (expenseId: string, user: string) => void;
  confirmPayments: (expenseId: string) => void;
};

const ExpensesContext = createContext<ExpensesContextType | undefined>(undefined);

export function ExpensesProvider({ children }: { children: React.ReactNode }) {
  const [expenses, setExpenses] = useState<Expense[]>(mockExpenses);
  const { logEvent } = useActivity();

  function formatAmount(value: number) {
    return Number.isInteger(value) ? `€${value}` : `€${value.toFixed(2)}`;
  }

  function addExpense(expense: Expense) {
    setExpenses((prev) => [expense, ...prev]);
    logEvent({
      flatId: expense.flatId,
      type: "expense_created",
      message: `${expense.paidBy} created ${expense.title} (${expense.period}) for ${formatAmount(expense.amount)}`,
    });
  }

  function markAsPaid(expenseId: string, user: string) {
    const expense = expenses.find((item) => item.id === expenseId);
    if (!expense) return;

    const hasPendingShare = expense.shares.some(
      (share) => share.user === user && share.status === "pending"
    );

    setExpenses((prev) =>
      prev.map((expense) => {
        if (expense.id !== expenseId) return expense;

        const updatedShares: Share[] = expense.shares.map((share) => {
          if (share.user === user && share.status === "pending") {
            const newStatus: ExpenseStatus = "claimed_paid";
            return { ...share, status: newStatus };
          }
          return share;
        });

        return { ...expense, shares: updatedShares };
      })
    );

    if (hasPendingShare) {
      logEvent({
        flatId: expense.flatId,
        type: "share_claimed",
        message: `${user} marked as paid for ${expense.title} (${expense.period})`,
      });
    }
  }

  function confirmPayments(expenseId: string) {
    const expense = expenses.find((item) => item.id === expenseId);
    if (!expense) return;

    const claimedShares = expense.shares.filter((share) => share.status === "claimed_paid");

    setExpenses((prev) =>
      prev.map((expense) => {
        if (expense.id !== expenseId) return expense;

        const updatedShares: Share[] = expense.shares.map((share) => {
          if (share.status === "claimed_paid") {
            const newStatus: ExpenseStatus = "confirmed";
            return { ...share, status: newStatus };
          }
          return share;
        });

        return { ...expense, shares: updatedShares };
      })
    );

    claimedShares.forEach((share) => {
      logEvent({
        flatId: expense.flatId,
        type: "share_confirmed",
        message: `${expense.paidBy} confirmed ${share.user} for ${expense.title} (${expense.period})`,
      });
    });
  }

  return (
    <ExpensesContext.Provider
      value={{ expenses, addExpense, markAsPaid, confirmPayments }}
    >
      {children}
    </ExpensesContext.Provider>
  );
}

export function useExpenses() {
  const context = useContext(ExpensesContext);
  if (!context) {
    throw new Error("useExpenses must be used within ExpensesProvider");
  }
  return context;
}
