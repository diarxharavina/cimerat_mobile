export type ActivityType = "expense_created" | "share_claimed" | "share_confirmed";

export type ActivityEvent = {
  id: string;
  flatId: string;
  type: ActivityType;
  message: string;
  createdAt: string;
};
