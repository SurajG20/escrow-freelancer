import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  listProjects,
  getProject,
  getProjectWithMilestones,
  createProject,
  updateProject,
} from "../api/projects";
import { Project } from "@/types";

export function useProjects(filters?: {
  client_wallet?: string;
  freelancer_wallet?: string;
  chain_id?: number;
  status?: string;
}) {
  return useQuery({
    queryKey: ["projects", filters],
    queryFn: () => listProjects(filters),
    staleTime: 1000 * 60,
    refetchOnWindowFocus: true,
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
    mutationFn: ({ id, updates }: { id: string; updates: Parameters<typeof updateProject>[1] }) =>
      updateProject(id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project", data.id] });
    },
  });
}


