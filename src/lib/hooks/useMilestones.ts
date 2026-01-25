import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  listMilestones,
  getMilestone,
  createMilestones,
  updateMilestone,
  deleteMilestone,
  deleteMilestonesByProject,
  replaceMilestones,
} from "../api/milestones";

export function useMilestones(projectId: string) {
  return useQuery({
    queryKey: ["milestones", projectId],
    queryFn: () => listMilestones(projectId),
    enabled: !!projectId,
    staleTime: 1000 * 60,
    refetchOnWindowFocus: true,
  });
}

export function useMilestone(id: string) {
  return useQuery({
    queryKey: ["milestone", id],
    queryFn: () => getMilestone(id),
    enabled: !!id,
    staleTime: 1000 * 60,
    refetchOnWindowFocus: true,
  });
}

export function useCreateMilestones() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMilestones,
    onSuccess: (data) => {
      if (data.length > 0) {
        queryClient.invalidateQueries({
          queryKey: ["milestones", data[0].project_id],
        });
        queryClient.invalidateQueries({
          queryKey: ["project", data[0].project_id],
        });
      }
    },
  });
}

export function useUpdateMilestone() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: string;
      updates: Parameters<typeof updateMilestone>[1];
    }) => updateMilestone(id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["milestones", data.project_id],
      });
      queryClient.invalidateQueries({
        queryKey: ["milestone", data.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["project", data.project_id],
      });
    },
  });
}

export function useDeleteMilestone() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, projectId }: { id: string; projectId: string }) => {
      return deleteMilestone(id).then(() => ({ id, projectId }));
    },
    onSuccess: ({ projectId }) => {
      queryClient.invalidateQueries({
        queryKey: ["milestones", projectId],
      });
      queryClient.invalidateQueries({
        queryKey: ["project", projectId],
      });
    },
  });
}

export function useDeleteMilestonesByProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (projectId: string) => deleteMilestonesByProject(projectId),
    onSuccess: (_, projectId) => {
      queryClient.invalidateQueries({
        queryKey: ["milestones", projectId],
      });
      queryClient.invalidateQueries({
        queryKey: ["project", projectId],
      });
    },
  });
}

export function useReplaceMilestones() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      milestones,
    }: {
      projectId: string;
      milestones: Parameters<typeof replaceMilestones>[1];
    }) => replaceMilestones(projectId, milestones),
    onSuccess: (data) => {
      if (data.length > 0) {
        queryClient.invalidateQueries({
          queryKey: ["milestones", data[0].project_id],
        });
        queryClient.invalidateQueries({
          queryKey: ["project", data[0].project_id],
        });
      }
    },
  });
}
