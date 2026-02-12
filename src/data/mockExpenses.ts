import type { Expense } from "../types/expense";

export const mockExpenses: Expense[] = [
  {
    id: "rent-march",
    flatId: "flat-dorm-12a",
    title: "Rent",
    period: "March",
    amount: 600,
    paidBy: "Arber",
    shares: [
      { user: "Arber", amount: 200, status: "confirmed" },
      { user: "Mark", amount: 200, status: "pending" },
      { user: "Driton", amount: 200, status: "claimed_paid" },
    ],
    createdAt: "2026-03-10T10:00:00.000Z",
  },
  {
    id: "internet-march",
    flatId: "flat-dorm-12a",
    title: "Internet",
    period: "March",
    amount: 45,
    paidBy: "Mark",
    shares: [
      { user: "Arber", amount: 15, status: "claimed_paid" },
      { user: "Mark", amount: 15, status: "confirmed" },
      { user: "Driton", amount: 15, status: "pending" },
    ],
    createdAt: "2026-03-07T10:00:00.000Z",
  },
  {
    id: "electricity-march",
    flatId: "flat-dorm-12a",
    title: "Electricity",
    period: "March",
    amount: 80,
    paidBy: "Driton",
    shares: [
      { user: "Arber", amount: 26.67, status: "pending" },
      { user: "Mark", amount: 26.67, status: "confirmed" },
      { user: "Driton", amount: 26.66, status: "claimed_paid" },
    ],
    createdAt: "2026-03-04T10:00:00.000Z",
  },
];
