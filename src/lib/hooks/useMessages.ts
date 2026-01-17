import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listMessages, sendMessage } from "../api/messages";
import { Message } from "@/types";

export function useMessages(projectId: string, milestoneId?: string) {
  return useQuery({
    queryKey: ["messages", projectId, milestoneId],
    queryFn: () =>
      listMessages({ project_id: projectId, milestone_id: milestoneId }),
    enabled: !!projectId,
    staleTime: 1000 * 30,
    refetchOnWindowFocus: true,
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sendMessage,
    onMutate: async (newMessage) => {
      await queryClient.cancelQueries({
        queryKey: ["messages", newMessage.project_id, newMessage.milestone_id],
      });

      const previousMessages = queryClient.getQueryData<Message[]>([
        "messages",
        newMessage.project_id,
        newMessage.milestone_id,
      ]);

      const optimisticMessage: Message = {
        id: `temp-${Date.now()}`,
        project_id: newMessage.project_id,
        milestone_id: newMessage.milestone_id,
        sender_id: newMessage.sender_id,
        content: newMessage.content,
        attachments: newMessage.attachments,
        created_at: new Date().toISOString(),
      };

      queryClient.setQueryData<Message[]>(
        ["messages", newMessage.project_id, newMessage.milestone_id],
        (old = []) => [...old, optimisticMessage],
      );

      return { previousMessages };
    },
    onError: (err, newMessage, context) => {
      if (context?.previousMessages) {
        queryClient.setQueryData(
          ["messages", newMessage.project_id, newMessage.milestone_id],
          context.previousMessages,
        );
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["messages", data.project_id, data.milestone_id],
      });
    },
  });
}
