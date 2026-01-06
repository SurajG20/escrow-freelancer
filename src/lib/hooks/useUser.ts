import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserByWallet, getUser, createUser, updateUser } from "../api/users";
import { User } from "@/types";

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
      queryClient.invalidateQueries({
        queryKey: ["user", "wallet", data.wallet_address],
      });
      queryClient.invalidateQueries({ queryKey: ["user", data.id] });
    },
  });
}


