import { supabase } from "../supabase/client";
import { Project, Milestone } from "@/types";
import {
  projectSchema,
  projectsArraySchema,
  milestonesArraySchema,
} from "../validation/schemas";

export async function listProjects(filters?: {
  client_wallet?: string;
  freelancer_wallet?: string;
  wallet_address?: string;
  chain_id?: number;
  status?: string;
}): Promise<Project[]> {
  let query = supabase.from("projects").select("*");

  if (filters?.wallet_address) {
    // Auto-match: Show projects where user is either client or freelancer
    const wallet = filters.wallet_address.toLowerCase();
    query = query.or(
      `client_wallet.eq.${wallet},freelancer_wallet.eq.${wallet}`,
    );
  } else {
    if (filters?.client_wallet) {
      query = query.eq("client_wallet", filters.client_wallet);
    }
    if (filters?.freelancer_wallet) {
      query = query.eq("freelancer_wallet", filters.freelancer_wallet);
    }
  }
  if (filters?.chain_id) {
    query = query.eq("chain_id", filters.chain_id);
  }
  if (filters?.status) {
    query = query.eq("status", filters.status);
  }

  const { data, error } = await query.order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch projects: ${error.message}`);
  }

  return projectsArraySchema.parse(data || []);
}

export async function getProject(id: string): Promise<Project | null> {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    throw new Error(`Failed to fetch project: ${error.message}`);
  }

  return projectSchema.parse(data);
}

export async function getProjectWithMilestones(
  id: string,
): Promise<(Project & { milestones: Milestone[] }) | null> {
  const { data, error } = await supabase
    .from("projects")
    .select(
      `
      *,
      milestones (*)
    `,
    )
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    throw new Error(`Failed to fetch project: ${error.message}`);
  }

  const project = projectSchema.parse(data);
  const milestones = milestonesArraySchema.parse(data.milestones || []);

  return { ...project, milestones };
}

export async function createProject(project: {
  onchain_address: string;
  client_wallet: string;
  freelancer_wallet?: string;
  chain_id: number;
  title: string;
  description: string;
  status?: string;
}): Promise<Project> {
  const { data, error } = await supabase
    .from("projects")
    .insert({
      ...project,
      status: project.status || "draft",
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create project: ${error.message}`);
  }

  return projectSchema.parse(data);
}

export async function updateProject(
  id: string,
  updates: Partial<{
    title: string;
    description: string;
    status: string;
    client_wallet: string;
    freelancer_wallet: string;
    onchain_address: string;
    rejection_reason: string | null;
  }>,
): Promise<Project> {
  // First verify the project exists
  const existingProject = await getProject(id);
  if (!existingProject) {
    throw new Error(`Project with id ${id} not found`);
  }

  // Filter out undefined values to avoid unnecessary updates
  const cleanUpdates = Object.fromEntries(
    Object.entries(updates).filter(([, value]) => value !== undefined),
  );

  if (Object.keys(cleanUpdates).length === 0) {
    // No actual updates, return existing project
    return existingProject;
  }

  const { data, error } = await supabase
    .from("projects")
    .update(cleanUpdates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(`[updateProject] Error updating project ${id}:`, error);
    if (error.code === "PGRST116") {
      throw new Error(
        `Project with id ${id} could not be updated. This may be due to Row Level Security policies or the project being deleted. Original error: ${error.message}`,
      );
    }
    throw new Error(`Failed to update project: ${error.message}`);
  }

  if (!data) {
    throw new Error(
      `Project with id ${id} update returned no data. This may be due to Row Level Security policies.`,
    );
  }

  return projectSchema.parse(data);
}

export async function sendForApproval(id: string): Promise<Project> {
  const existingProject = await getProject(id);
  if (!existingProject) {
    throw new Error(`Project with id ${id} not found`);
  }

  const { data, error } = await supabase
    .from("projects")
    .update({ status: "pending_approval", rejection_reason: null })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      throw new Error(
        `Project with id ${id} could not be updated. This may be due to Row Level Security policies.`,
      );
    }
    throw new Error(`Failed to send project for approval: ${error.message}`);
  }

  if (!data) {
    throw new Error(
      `Project with id ${id} update returned no data. This may be due to Row Level Security policies.`,
    );
  }

  return projectSchema.parse(data);
}

export async function approveProject(id: string): Promise<Project> {
  // Verify project exists first
  const existingProject = await getProject(id);
  if (!existingProject) {
    throw new Error(`Project with id ${id} not found`);
  }

  const { data, error } = await supabase
    .from("projects")
    .update({ status: "approved" })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      throw new Error(
        `Project with id ${id} could not be updated. This may be due to Row Level Security policies.`,
      );
    }
    throw new Error(`Failed to approve project: ${error.message}`);
  }

  if (!data) {
    throw new Error(
      `Project with id ${id} update returned no data. This may be due to Row Level Security policies.`,
    );
  }

  return projectSchema.parse(data);
}

export async function rejectProject(
  id: string,
  rejection_reason?: string | null,
): Promise<Project> {
  const existingProject = await getProject(id);
  if (!existingProject) {
    throw new Error(`Project with id ${id} not found`);
  }

  const { data, error } = await supabase
    .from("projects")
    .update({
      status: "draft",
      rejection_reason: rejection_reason ?? null,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      throw new Error(
        `Project with id ${id} could not be updated. This may be due to Row Level Security policies.`,
      );
    }
    throw new Error(`Failed to reject project: ${error.message}`);
  }

  if (!data) {
    throw new Error(
      `Project with id ${id} update returned no data. This may be due to Row Level Security policies.`,
    );
  }

  return projectSchema.parse(data);
}
