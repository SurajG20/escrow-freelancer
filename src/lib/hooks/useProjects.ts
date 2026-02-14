import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  listProjects,
  getProject,
  getProjectWithMilestones,
  createProject,
  updateProject,
  sendForApproval,
  approveProject,
  rejectProject,
} from "../api/projects";

export function useProjects(filters?: {
  client_wallet?: string;
  freelancer_wallet?: string;
  wallet_address?: string;
  chain_id?: number;
  status?: string;
}) {
  return useQuery({
    queryKey: ["projects", filters],
    queryFn: () => listProjects(filters),
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
}

export function useProject(id: string) {
  return useQuery({
    queryKey: ["project", id],
    queryFn: () => getProject(id),
    enabled: !!id,
    staleTime: 1000 * 60,
    refetchOnWindowFocus: true,
  });
}

export function useProjectWithMilestones(id: string) {
  return useQuery({
    queryKey: ["project", id, "with-milestones"],
    queryFn: () => getProjectWithMilestones(id),
    enabled: !!id,
    staleTime: 1000 * 60,
    refetchOnWindowFocus: true,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: string;
      updates: Parameters<typeof updateProject>[1];
    }) => updateProject(id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project", data.id] });
      queryClient.invalidateQueries({
        queryKey: ["project", data.id, "with-milestones"],
      });
    },
  });
}

export function useSendForApproval() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sendForApproval,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project", data.id] });
    },
  });
}

export function useApproveProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: approveProject,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project", data.id] });
    },
  });
}

export function useRejectProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      rejection_reason,
    }: {
      id: string;
      rejection_reason?: string | null;
    }) => rejectProject(id, rejection_reason),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project", data.id] });
      queryClient.invalidateQueries({
        queryKey: ["project", data.id, "with-milestones"],
      });
    },
  });
}
