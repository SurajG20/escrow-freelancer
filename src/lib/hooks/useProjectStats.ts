import { useQuery } from "@tanstack/react-query";
import { getProjectStatsByWallet } from "@/lib/api/projectStats";

export function useProjectStats(wallet?: string) {
  return useQuery({
    queryKey: ["project-stats", wallet],
    queryFn: () => getProjectStatsByWallet(wallet!),
    enabled: !!wallet,
    staleTime: 30_000,
    refetchOnWindowFocus: true,
  });
}
