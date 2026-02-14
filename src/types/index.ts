export type ProjectStatus =
  | "draft"
  | "pending_approval"
  | "approved"
  | "active"
  | "in_dispute"
  | "completed"
  | "cancelled";
export type MilestoneStatus =
  | "awaiting_submission"
  | "submitted"
  | "approved"
  | "disputed"
  | "released";
export type Currency = "NATIVE" | "USDT";
export type UserRole = "client" | "freelancer" | "arbitrator";
export type DisputeStatus = "open" | "voting" | "resolved";

export interface User {
  id: string;
  wallet_address: string;
  display_name?: string | null;
  bio?: string | null;
  avatar_url?: string | null;
  roles: UserRole[];
  email_notifications?: boolean;
  push_notifications?: boolean;
  created_at: string;
  updated_at: string;
}

export interface Milestone {
  id: string;
  project_id: string;
  index: number;
  title: string;
  description?: string;
  amount: string;
  currency: Currency;
  chain_id: number;
  deadline: string;
  offchain_state: MilestoneStatus;
  onchain_state?: string;
  rejection_reason?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  onchain_address: string;
  client_wallet: string;
  freelancer_wallet?: string;
  chain_id: number;
  title: string;
  description: string;
  status: ProjectStatus;
  rejection_reason?: string | null;
  created_at: string;
  updated_at: string;
  milestones?: Milestone[];
}

export interface Dispute {
  id: string;
  project_id: string;
  milestone_id?: string;
  opened_by: string;
  status: DisputeStatus;
  resolution?: {
    split_percent?: number;
    decision?: string;
    votes?: Record<string, string>;
  };
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  project_id: string;
  milestone_id?: string;
  sender_id: string;
  content: string;
  attachments?: Array<{
    url: string;
    name: string;
    type: string;
  }>;
  created_at: string;
}

export interface ReputationEvent {
  id: string;
  user_id: string;
  type:
    | "completed_milestone"
    | "dispute_win"
    | "dispute_loss"
    | "late_delivery"
    | "review_received";
  weight: number;
  metadata?: Record<string, unknown>;
  created_at: string;
}
