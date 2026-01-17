import { z } from "zod";

export const userSchema = z.object({
  id: z.string().uuid(),
  wallet_address: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  display_name: z.string().nullable(),
  bio: z.string().nullable(),
  avatar_url: z.union([z.string().url(), z.null(), z.literal("")]),
  roles: z.array(z.enum(["client", "freelancer", "arbitrator"])),
  created_at: z.string(),
  updated_at: z.string(),
});

export const milestoneSchema = z.object({
  id: z.string().uuid(),
  project_id: z.string().uuid(),
  index: z.number().int(),
  title: z.string(),
  description: z.string().optional(),
  amount: z.string(),
  currency: z.enum(["NATIVE", "USDT"]),
  chain_id: z.number().int(),
  deadline: z.string(),
  offchain_state: z.enum([
    "awaiting_submission",
    "submitted",
    "approved",
    "disputed",
    "released",
  ]),
  onchain_state: z
    .string()
    .nullish()
    .transform((val) => val ?? undefined),
  created_at: z.string(),
  updated_at: z.string(),
});

export const projectSchema = z.object({
  id: z.string().uuid(),
  onchain_address: z.string(),
  client_wallet: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  freelancer_wallet: z
    .string()
    .regex(/^0x[a-fA-F0-9]{40}$/)
    .optional(),
  chain_id: z.number().int(),
  title: z.string(),
  description: z.string(),
  status: z.enum([
    "draft",
    "pending_approval",
    "approved",
    "active",
    "in_dispute",
    "completed",
    "cancelled",
  ]),
  created_at: z.string(),
  updated_at: z.string(),
});

export const disputeSchema = z.object({
  id: z.string().uuid(),
  project_id: z.string().uuid(),
  milestone_id: z.string().uuid().optional(),
  opened_by: z.string(),
  status: z.enum(["open", "voting", "resolved"]),
  resolution: z
    .object({
      split_percent: z.number().optional(),
      decision: z.string().optional(),
      votes: z
        .record(z.string(), z.unknown())
        .transform((val) => {
          const result: Record<string, string> = {};
          for (const [key, value] of Object.entries(val)) {
            result[key] = String(value);
          }
          return result;
        })
        .optional(),
    })
    .optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const messageSchema = z.object({
  id: z.string().uuid(),
  project_id: z.string().uuid(),
  milestone_id: z.string().uuid().optional(),
  sender_id: z.string().uuid(),
  content: z.string(),
  attachments: z
    .array(
      z.object({
        url: z.string().url(),
        name: z.string(),
        type: z.string(),
      }),
    )
    .optional(),
  created_at: z.string(),
});

export const projectsArraySchema = z.array(projectSchema);
export const milestonesArraySchema = z.array(milestoneSchema);
export const disputesArraySchema = z.array(disputeSchema);
export const messagesArraySchema = z.array(messageSchema);
