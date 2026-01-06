import { supabase } from "../supabase/client";
import { Project, Milestone } from "@/types";
import { projectSchema, projectsArraySchema, milestoneSchema, milestonesArraySchema } from "../validation/schemas";

export async function listProjects(filters?: {
  client_wallet?: string;
  freelancer_wallet?: string;
  chain_id?: number;
  status?: string;
}): Promise<Project[]> {
  let query = supabase.from("projects").select("*");

  if (filters?.client_wallet) {
    query = query.eq("client_wallet", filters.client_wallet);
  }
  if (filters?.freelancer_wallet) {
    query = query.eq("freelancer_wallet", filters.freelancer_wallet);
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

export async function getProjectWithMilestones(id: string): Promise<Project & { milestones: Milestone[] } | null> {
  const { data, error } = await supabase
    .from("projects")
    .select(`
      *,
      milestones (*)
    `)
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
    freelancer_wallet: string;
  }>
): Promise<Project> {
  const { data, error } = await supabase
    .from("projects")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update project: ${error.message}`);
  }

  return projectSchema.parse(data);
}


