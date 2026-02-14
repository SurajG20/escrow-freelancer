import { supabase } from "../supabase/client";
import { User } from "@/types";
import { userSchema } from "../validation/schemas";

export async function getUserByWallet(
  walletAddress: string,
): Promise<User | null> {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("wallet_address", walletAddress.toLowerCase())
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }

  if (!data) {
    return null;
  }

  return userSchema.parse(data);
}

export async function getUser(id: string): Promise<User | null> {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }

  if (!data) {
    return null;
  }

  return userSchema.parse(data);
}

export async function getUsersByWallets(
  walletAddresses: string[],
): Promise<Map<string, User>> {
  const normalized = [...new Set(walletAddresses.map((w) => w.toLowerCase()).filter(Boolean))];
  if (normalized.length === 0) return new Map();

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .in("wallet_address", normalized);

  if (error) {
    throw new Error(`Failed to fetch users: ${error.message}`);
  }

  const map = new Map<string, User>();
  for (const row of data ?? []) {
    const user = userSchema.safeParse(row);
    if (user.success && user.data.wallet_address) {
      map.set(user.data.wallet_address.toLowerCase(), user.data);
    }
  }
  return map;
}

export async function getUsersByIds(ids: string[]): Promise<Map<string, User>> {
  const unique = [...new Set(ids.filter(Boolean))];
  if (unique.length === 0) return new Map();

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .in("id", unique);

  if (error) {
    throw new Error(`Failed to fetch users: ${error.message}`);
  }

  const map = new Map<string, User>();
  for (const row of data ?? []) {
    const user = userSchema.safeParse(row);
    if (user.success && user.data.id) {
      map.set(user.data.id, user.data);
    }
  }
  return map;
}

export async function createUser(user: {
  wallet_address: string;
  display_name?: string;
  bio?: string;
  avatar_url?: string;
  roles?: ("client" | "freelancer" | "arbitrator")[];
}): Promise<User> {
  const { data, error } = await supabase
    .from("users")
    .upsert(
      {
        ...user,
        wallet_address: user.wallet_address.toLowerCase(),
        roles: user.roles || ["client"],
      },
      {
        onConflict: "wallet_address",
        ignoreDuplicates: false,
      },
    )
    .select()
    .single();

  if (error) {
    if (error.code === "42501") {
      throw new Error(
        "Permission denied: RLS policy violation. Please run the init.sql script in Supabase.",
      );
    }
    if (error.code === "PGRST116") {
      const existingUser = await getUserByWallet(user.wallet_address);
      if (existingUser) {
        return existingUser;
      }
      throw new Error("User not found after creation");
    }
    throw new Error(
      `Failed to create user: ${error.message} (code: ${error.code})`,
    );
  }

  if (!data) {
    const existingUser = await getUserByWallet(user.wallet_address);
    if (existingUser) {
      return existingUser;
    }
    throw new Error("User creation returned no data");
  }

  return userSchema.parse(data);
}

export async function updateUser(
  id: string,
  updates: Partial<{
    display_name: string;
    bio: string;
    avatar_url: string;
    roles: ("client" | "freelancer" | "arbitrator")[];
    email_notifications: boolean;
    push_notifications: boolean;
  }>,
): Promise<User> {
  const { data, error } = await supabase
    .from("users")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update user: ${error.message}`);
  }

  return userSchema.parse(data);
}
