import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getUserByWallet,
  getUser,
  createUser,
  updateUser,
  getUsersByWallets,
  getUsersByIds,
} from "../api/users";
import type { User } from "@/types";

export function useUserByWallet(walletAddress: string | undefined) {
  return useQuery({
    queryKey: ["user", "wallet", walletAddress],
    queryFn: () => getUserByWallet(walletAddress!),
    enabled: !!walletAddress,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
}

export function useUser(id: string | undefined) {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => getUser(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
}

export function useUsersByWallets(walletAddresses: string[]) {
  const normalized = [...new Set(walletAddresses.map((w) => w.toLowerCase()).filter(Boolean))].sort();
  const key = normalized.join(",");
  return useQuery({
    queryKey: ["users", "wallets", key],
    queryFn: () => getUsersByWallets(normalized),
    enabled: normalized.length > 0,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
}

export function useUsersByIds(ids: string[]) {
  const unique = [...new Set(ids.filter(Boolean))].sort();
  const key = unique.join(",");
  return useQuery({
    queryKey: ["users", "ids", key],
    queryFn: () => getUsersByIds(unique),
    enabled: unique.length > 0,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
}

function truncateWallet(w: string): string {
  return w && w.length >= 42 ? `${w.slice(0, 6)}...${w.slice(-4)}` : "Unknown";
}

export function displayNameForUser(user: User | null | undefined, wallet?: string): string {
  const name = user?.display_name?.trim();
  if (name) return name;
  return truncateWallet(wallet ?? user?.wallet_address ?? "");
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["user", "wallet", data.wallet_address],
      });
      queryClient.invalidateQueries({ queryKey: ["user", data.id] });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: string;
      updates: Parameters<typeof updateUser>[1];
    }) => updateUser(id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
