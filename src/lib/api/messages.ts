import { supabase } from "../supabase/client";
import { Message } from "@/types";
import { messageSchema, messagesArraySchema } from "../validation/schemas";

export async function listMessages(filters: {
  project_id: string;
  milestone_id?: string;
}): Promise<Message[]> {
  let query = supabase
    .from("messages")
    .select("*")
    .eq("project_id", filters.project_id);

  if (filters.milestone_id) {
    query = query.eq("milestone_id", filters.milestone_id);
  }

  const { data, error } = await query.order("created_at", { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch messages: ${error.message}`);
  }

  return messagesArraySchema.parse(data || []);
}

export async function sendMessage(message: {
  project_id: string;
  milestone_id?: string;
  sender_id: string;
  content: string;
  attachments?: Array<{
    url: string;
    name: string;
    type: string;
  }>;
}): Promise<Message> {
  const { data, error } = await supabase
    .from("messages")
    .insert(message)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to send message: ${error.message}`);
  }

  return messageSchema.parse(data);
}


