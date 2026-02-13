import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Expense, ExpenseStatus, Share } from "../types/expense";
import { mockExpenses } from "../data/mockExpenses";
import { useActivity } from "./ActivityContext";

type ExpensesContextType = {
  expenses: Expense[];
  addExpense: (expense: Expense) => void;
  markAsPaid: (expenseId: string, user: string) => void;
  confirmPayments: (expenseId: string) => void;
  isHydrated: boolean;
};

const STORAGE_KEY = "cimerat.expenses.state";

const ExpensesContext = createContext<ExpensesContextType | undefined>(undefined);

function formatAmount(value: number) {
  return Number.isInteger(value) ? `€${value}` : `€${value.toFixed(2)}`;
}

export function ExpensesProvider({ children }: { children: React.ReactNode }) {
  const [expenses, setExpenses] = useState<Expense[]>(mockExpenses);
  const [isHydrated, setIsHydrated] = useState(false);
  const { logEvent } = useActivity();

  // Load once on startup
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (!mounted) return;

        if (raw) {
          const parsed = JSON.parse(raw) as Expense[];
          if (Array.isArray(parsed)) {
            // Basic sanity check: must have id/title fields if non-empty
            if (parsed.length === 0 || (parsed[0] && typeof parsed[0].id === "string")) {
              setExpenses(parsed);
            }
          }
        }
      } catch {
        // ignore
      } finally {
        if (mounted) setIsHydrated(true);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  // Persist on change (after hydration)
  useEffect(() => {
    if (!isHydrated) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(expenses)).catch(() => {});
  }, [expenses, isHydrated]);

  function addExpense(expense: Expense) {
    setExpenses((prev) => [expense, ...prev]);
    logEvent({
      flatId: expense.flatId,
      type: "expense_created",
      message: `${expense.paidBy} created ${expense.title} (${expense.period}) for ${formatAmount(
        expense.amount
      )}`,
    });
  }

  function markAsPaid(expenseId: string, user: string) {
    const expense = expenses.find((item) => item.id === expenseId);
    if (!expense) return;

    const hasPendingShare = expense.shares.some(
      (share) => share.user === user && share.status === "pending"
    );

    setExpenses((prev) =>
      prev.map((exp) => {
        if (exp.id !== expenseId) return exp;

        const updatedShares: Share[] = exp.shares.map((share) => {
          if (share.user === user && share.status === "pending") {
            const newStatus: ExpenseStatus = "claimed_paid";
            return { ...share, status: newStatus };
          }
          return share;
        });

        return { ...exp, shares: updatedShares };
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
      prev.map((exp) => {
        if (exp.id !== expenseId) return exp;

        const updatedShares: Share[] = exp.shares.map((share) => {
          if (share.status === "claimed_paid") {
            const newStatus: ExpenseStatus = "confirmed";
            return { ...share, status: newStatus };
          }
          return share;
        });

        return { ...exp, shares: updatedShares };
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

  const value = useMemo(
    () => ({ expenses, addExpense, markAsPaid, confirmPayments, isHydrated }),
    [expenses, isHydrated]
  );

  return <ExpensesContext.Provider value={value}>{children}</ExpensesContext.Provider>;
}

export function useExpenses() {
  const context = useContext(ExpensesContext);
  if (!context) throw new Error("useExpenses must be used within ExpensesProvider");
  return context;
}
