import { supabase } from "../supabase/client";
import { Milestone } from "@/types";
import { milestoneSchema, milestonesArraySchema } from "../validation/schemas";
import { getProject } from "./projects";

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
    rejection_reason: string | null;
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

  if (cleanUpdates.offchain_state === "submitted") {
    cleanUpdates.rejection_reason = null;
    const project = await getProject(existingMilestone.project_id);
    if (!project) {
      throw new Error("Project not found");
    }
    if (project.status !== "active") {
      throw new Error(
        project.status === "pending_approval"
          ? "Project must be approved before submitting milestones"
          : project.status === "approved"
            ? "Funds must be deposited to activate the project before submitting milestones"
            : "Project must be approved and funds deposited before submitting milestones"
      );
    }
    const hasValidContract =
      project.onchain_address &&
      project.onchain_address !== "Pending" &&
      project.onchain_address.startsWith("0x") &&
      project.onchain_address.length === 42;
    if (!hasValidContract) {
      throw new Error(
        "Funds must be deposited to the escrow contract before submitting milestones"
      );
    }
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

export async function updateMilestoneByProjectAndIndex(
  projectId: string,
  index: number,
  updates: Parameters<typeof updateMilestone>[1],
): Promise<Milestone> {
  const cleanUpdates = Object.fromEntries(
    Object.entries(updates).filter(([, value]) => value !== undefined),
  );
  if (Object.keys(cleanUpdates).length === 0) {
    const milestone = (await listMilestones(projectId)).find(
      (m) => m.index === index,
    );
    if (!milestone) {
      throw new Error(
        `Milestone with index ${index} not found for project ${projectId}`,
      );
    }
    return milestone;
  }

  const { data, error } = await supabase
    .from("milestones")
    .update(cleanUpdates)
    .eq("project_id", projectId)
    .eq("index", index)
    .select()
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      throw new Error(
        `Milestone with index ${index} not found for project ${projectId}`,
      );
    }
    throw new Error(`Failed to update milestone: ${error.message}`);
  }
  if (!data) {
    throw new Error(
      `Milestone with index ${index} not found for project ${projectId}`,
    );
  }
  return milestoneSchema.parse(data);
}

export async function rejectMilestone(
  id: string,
  rejection_reason: string,
): Promise<Milestone> {
  const existing = await getMilestone(id);
  if (!existing) {
    throw new Error(`Milestone with id ${id} not found`);
  }
  if (existing.offchain_state !== "submitted") {
    throw new Error("Only submitted milestones can be rejected");
  }

  const { data, error } = await supabase
    .from("milestones")
    .update({
      offchain_state: "awaiting_submission",
      rejection_reason: rejection_reason || null,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to reject milestone: ${error.message}`);
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

export async function setAllMilestonesReleasedForProject(
  projectId: string,
): Promise<void> {
  const { error } = await supabase
    .from("milestones")
    .update({ offchain_state: "released" })
    .eq("project_id", projectId);

  if (error) {
    throw new Error(`Failed to set milestones released: ${error.message}`);
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
