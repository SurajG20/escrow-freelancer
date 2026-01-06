import { supabase } from "../supabase/client";
import { Milestone } from "@/types";
import { milestoneSchema, milestonesArraySchema } from "../validation/schemas";

export async function listMilestones(projectId: string): Promise<Milestone[]> {
  const { data, error } = await supabase
    .from("milestones")
    .select("*")
    .eq("project_id", projectId)
    .order("index", { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch milestones: ${error.message}`);
  }

  return milestonesArraySchema.parse(data || []);
}

export async function getMilestone(id: string): Promise<Milestone | null> {
  const { data, error } = await supabase
    .from("milestones")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    throw new Error(`Failed to fetch milestone: ${error.message}`);
  }

  return milestoneSchema.parse(data);
}

export async function createMilestones(
  milestones: Array<{
    project_id: string;
    index: number;
    title: string;
    description?: string;
    amount: string;
    currency: "NATIVE" | "USDT";
    chain_id: number;
    deadline: string;
  }>
): Promise<Milestone[]> {
  const { data, error } = await supabase
    .from("milestones")
    .insert(
      milestones.map((m) => ({
        ...m,
        offchain_state: "awaiting_submission",
      }))
    )
    .select();

  if (error) {
    throw new Error(`Failed to create milestones: ${error.message}`);
  }

  return milestonesArraySchema.parse(data);
}

export async function updateMilestone(
  id: string,
  updates: Partial<{
    title: string;
    description: string;
    amount: string;
    deadline: string;
    offchain_state: string;
    onchain_state: string;
  }>
): Promise<Milestone> {
  const { data, error } = await supabase
    .from("milestones")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update milestone: ${error.message}`);
  }

  return milestoneSchema.parse(data);
}


