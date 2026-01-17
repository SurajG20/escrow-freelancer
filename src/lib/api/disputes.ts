import { supabase } from "../supabase/client";
import { Dispute } from "@/types";
import { disputeSchema, disputesArraySchema } from "../validation/schemas";

export async function listDisputes(filters?: {
  project_id?: string;
  milestone_id?: string;
  status?: string;
  chain_id?: number;
}): Promise<Dispute[]> {
  let query = supabase.from("disputes").select("*");

  if (filters?.project_id) {
    query = query.eq("project_id", filters.project_id);
  }
  if (filters?.milestone_id) {
    query = query.eq("milestone_id", filters.milestone_id);
  }
  if (filters?.status) {
    query = query.eq("status", filters.status);
  }
  if (filters?.chain_id) {
    query = query.eq("chain_id", filters.chain_id);
  }

  const { data, error } = await query.order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch disputes: ${error.message}`);
  }

  return disputesArraySchema.parse(data || []);
}

export async function getDispute(id: string): Promise<Dispute | null> {
  const { data, error } = await supabase
    .from("disputes")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    throw new Error(`Failed to fetch dispute: ${error.message}`);
  }

  return disputeSchema.parse(data);
}

export async function createDispute(dispute: {
  project_id: string;
  milestone_id?: string;
  opened_by: string;
  status?: string;
}): Promise<Dispute> {
  const { data, error } = await supabase
    .from("disputes")
    .insert({
      ...dispute,
      status: dispute.status || "open",
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create dispute: ${error.message}`);
  }

  return disputeSchema.parse(data);
}

export async function updateDispute(
  id: string,
  updates: Partial<{
    status: string;
    resolution: {
      split_percent?: number;
      decision?: string;
      votes?: Record<string, string>;
    };
  }>,
): Promise<Dispute> {
  const { data, error } = await supabase
    .from("disputes")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      throw new Error(
        `Dispute with id ${id} not found or could not be updated`,
      );
    }
    throw new Error(`Failed to update dispute: ${error.message}`);
  }

  if (!data) {
    throw new Error(`Dispute with id ${id} not found`);
  }

  return disputeSchema.parse(data);
}
