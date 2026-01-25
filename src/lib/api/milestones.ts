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
  }>,
): Promise<Milestone[]> {
  const { data, error } = await supabase
    .from("milestones")
    .insert(
      milestones.map((m) => ({
        ...m,
        offchain_state: "awaiting_submission",
      })),
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
    currency: "NATIVE" | "USDT";
    deadline: string;
    index: number;
    offchain_state: string;
    onchain_state: string;
  }>,
): Promise<Milestone> {
  // First verify the milestone exists
  const existingMilestone = await getMilestone(id);
  if (!existingMilestone) {
    throw new Error(`Milestone with id ${id} not found`);
  }

  // Filter out undefined values
  const cleanUpdates = Object.fromEntries(
    Object.entries(updates).filter(([, value]) => value !== undefined),
  );

  if (Object.keys(cleanUpdates).length === 0) {
    return existingMilestone;
  }

  const { data, error } = await supabase
    .from("milestones")
    .update(cleanUpdates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      throw new Error(
        `Milestone with id ${id} could not be updated. This may be due to Row Level Security policies or the milestone being deleted.`,
      );
    }
    throw new Error(`Failed to update milestone: ${error.message}`);
  }

  if (!data) {
    throw new Error(
      `Milestone with id ${id} update returned no data. This may be due to Row Level Security policies.`,
    );
  }

  return milestoneSchema.parse(data);
}

export async function deleteMilestone(id: string): Promise<void> {
  const { error } = await supabase.from("milestones").delete().eq("id", id);

  if (error) {
    throw new Error(`Failed to delete milestone: ${error.message}`);
  }
}

export async function deleteMilestonesByProject(
  projectId: string,
): Promise<void> {
  const { error } = await supabase
    .from("milestones")
    .delete()
    .eq("project_id", projectId);

  if (error) {
    throw new Error(`Failed to delete milestones: ${error.message}`);
  }
}

export async function replaceMilestones(
  projectId: string,
  milestones: Array<{
    index: number;
    title: string;
    description?: string;
    amount: string;
    currency: "NATIVE" | "USDT";
    chain_id: number;
    deadline: string;
  }>,
): Promise<Milestone[]> {
  const { error: deleteError } = await supabase
    .from("milestones")
    .delete()
    .eq("project_id", projectId);

  if (deleteError) {
    throw new Error(
      `Failed to delete existing milestones: ${deleteError.message}`,
    );
  }

  const { data, error: insertError } = await supabase
    .from("milestones")
    .insert(
      milestones.map((m) => ({
        project_id: projectId,
        ...m,
        offchain_state: "awaiting_submission",
      })),
    )
    .select();

  if (insertError) {
    throw new Error(`Failed to create milestones: ${insertError.message}`);
  }

  return milestonesArraySchema.parse(data);
}
