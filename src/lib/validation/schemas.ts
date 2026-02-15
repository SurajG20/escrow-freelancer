import { z } from "zod";

export const userSchema = z.object({
  id: z.string().uuid(),
  wallet_address: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  display_name: z.string().nullable(),
  bio: z.string().nullable(),
  avatar_url: z.union([z.string().url(), z.null(), z.literal("")]),
  roles: z.array(z.enum(["client", "freelancer", "arbitrator"])),
  email_notifications: z.boolean().optional().default(false),
  push_notifications: z.boolean().optional().default(false),
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
  rejection_reason: z.string().nullable().optional(),
  submission_content: z.string().nullable().optional(),
  submission_images: z.array(z.string()).nullable().optional(),
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
  rejection_reason: z.string().nullable().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

const resolutionSchema = z
  .object({
    decision: z.string().nullish().transform((v) => v ?? undefined),
    release_to_freelancer: z.boolean().nullish().transform((v) => v ?? undefined),
    resolved_at: z.string().nullish().transform((v) => v ?? undefined),
    resolved_by: z.string().nullish().transform((v) => v ?? undefined),
  })
  .nullish()
  .transform((v) => v ?? undefined);

export const disputeSchema = z.object({
  id: z.string().uuid(),
  project_id: z.string().uuid(),
  milestone_id: z.string().uuid().nullish().transform((v) => v ?? undefined),
  opened_by: z.string(),
  reason: z.string().nullish().transform((v) => v ?? undefined),
  status: z.enum(["open", "resolved"]),
  resolution: resolutionSchema,
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
