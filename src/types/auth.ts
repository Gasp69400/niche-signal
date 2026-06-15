export type Plan = "free" | "pro";

export interface Profile {
  id: string;
  email: string;
  plan: Plan;
}
