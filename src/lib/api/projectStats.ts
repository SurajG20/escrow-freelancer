import { supabase } from "../supabase/client";

export type ProjectStats = {
  total_projects: number;
  active_projects: number;
  draft_projects: number;
  in_dispute_projects: number;
  completed_projects: number;
  pending_actions: number;
  total_locked: number;
};

export async function getProjectStatsByWallet(
  wallet: string
): Promise<ProjectStats> {
  const walletLower = wallet.toLowerCase();

  const { data: projects, error: projectError } = await supabase
    .from("projects")
    .select("id, status")
    .or(
      `client_wallet.eq.${walletLower},freelancer_wallet.eq.${walletLower}`
    );

  if (projectError) {
    throw new Error(projectError.message);
  }

  const total_projects = projects.length;
  const active_projects = projects.filter(p => p.status === "active").length;
  const draft_projects = projects.filter(p => p.status === "draft").length;
  const in_dispute_projects = projects.filter(
    p => p.status === "in_dispute"
  ).length;
  const completed_projects = projects.filter(
    p => p.status === "completed"
  ).length;

  const pending_actions = draft_projects + in_dispute_projects;

  let total_locked = 0;

  if (projects.length > 0) {
    const { data: milestones, error: milestoneError } = await supabase
      .from("milestones")
      .select("amount")
      .in(
        "project_id",
        projects.map(p => p.id)
      );

    if (milestoneError) {
      throw new Error(milestoneError.message);
    }

    total_locked = milestones.reduce(
      (sum, m) => sum + Number(m.amount || 0),
      0
    );
  }

  return {
    total_projects,
    active_projects,
    draft_projects,
    in_dispute_projects,
    completed_projects,
    pending_actions,
    total_locked,
  };
}
