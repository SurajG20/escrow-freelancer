import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  listDisputes,
  getDispute,
  createDispute,
  updateDispute,
} from "../api/disputes";

export function useDisputes(filters?: {
  project_id?: string;
  milestone_id?: string;
  status?: string;
  chain_id?: number;
}) {
  return useQuery({
    queryKey: ["disputes", filters],
    queryFn: () => listDisputes(filters),
    staleTime: 1000 * 60,
    refetchOnWindowFocus: true,
  });
}

export function useDispute(id: string) {
  return useQuery({
    queryKey: ["dispute", id],
    queryFn: () => getDispute(id),
    enabled: !!id,
    staleTime: 1000 * 60,
    refetchOnWindowFocus: true,
  });
}

export function useCreateDispute() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDispute,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["disputes"] });
      queryClient.invalidateQueries({
        queryKey: ["project", data.project_id],
      });
    },
  });
}

export function useUpdateDispute() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: string;
      updates: Parameters<typeof updateDispute>[1];
    }) => updateDispute(id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["disputes"] });
      queryClient.invalidateQueries({ queryKey: ["dispute", data.id] });
      queryClient.invalidateQueries({
        queryKey: ["project", data.project_id],
      });
    },
  });
}
