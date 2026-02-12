import type { Expense } from "../types/expense";

export type BalancesResult = {
  youOwe: number; // money you need to pay to others
  youAreOwed: number; // money others need to pay you
  net: number; // + means you should receive, - means you owe
};

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

/**
 * Rules:
 * - For each expense:
 *   - payer is owed money from each other roommate whose share is NOT confirmed
 *   - a roommate owes payer for their share if their share is NOT confirmed
 * - claimed_paid is still treated as NOT confirmed (still pending until payer confirms)
 */
export function calculateBalancesForUser(
  expenses: Expense[],
  currentFlatId: string | null,
  currentUser: string
): BalancesResult {
  if (!currentFlatId) return { youOwe: 0, youAreOwed: 0, net: 0 };

  let youOwe = 0;
  let youAreOwed = 0;

  for (const exp of expenses) {
    if (exp.flatId !== currentFlatId) continue;

    for (const share of exp.shares) {
      if (share.user === exp.paidBy) continue; // payer doesn't owe themselves

      const isConfirmed = share.status === "confirmed";
      if (isConfirmed) continue;

      // Someone owes payer this share.amount
      if (currentUser === exp.paidBy) {
        // You are the payer => you're owed by others
        youAreOwed += share.amount;
      } else if (currentUser === share.user) {
        // You are the roommate => you owe payer
        youOwe += share.amount;
      }
    }
  }

  youOwe = round2(youOwe);
  youAreOwed = round2(youAreOwed);

  return {
    youOwe,
    youAreOwed,
    net: round2(youAreOwed - youOwe),
  };
}
