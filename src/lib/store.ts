import { Project, MilestoneStatus } from "@/types";

type MockMilestone = {
  id: number;
  title: string;
  amount: string;
  deadline: string;
  status: string;
};

type MockProject = Omit<Project, "milestones"> & {
  pId?: string;
  client?: string;
  clientAddress?: string;
  freelancer?: string;
  freelancerAddress?: string;
  totalAmount?: string;
  releasedAmount?: string;
  createdAt?: string;
  contractAddress?: string;
  milestones?: MockMilestone[];
};

class MockStore {
  private projects: MockProject[] = [
    {
      id: "1",
      pId: "PROJ-101",
      title: "DeFi Dashboard Implementation",
      client: "Alpha Labs",
      clientAddress: "0x123...abc",
      freelancer: "Alice Studio",
      freelancerAddress: "0x789...xyz",
      totalAmount: "2.5 ETH",
      releasedAmount: "1.0 ETH",
      status: "active",
      description:
        "Implementation of the main dashboard with wallet connection, staking view, and analytics.",
      createdAt: "2026-01-01",
      contractAddress: "0x71C...9A21",
      onchain_address: "0x71C...9A21",
      client_wallet: "0x123...abc",
      freelancer_wallet: "0x789...xyz",
      chain_id: 56,
      created_at: "2026-01-01T00:00:00Z",
      updated_at: "2026-01-01T00:00:00Z",
      milestones: [
        {
          id: 1,
          title: "UI Implementation",
          amount: "1.0 ETH",
          deadline: "Jan 10, 2026",
          status: "Completed",
        },
        {
          id: 2,
          title: "Web3 Integration",
          amount: "1.0 ETH",
          deadline: "Jan 20, 2026",
          status: "In Progress",
        },
        {
          id: 3,
          title: "QA & Deployment",
          amount: "0.5 ETH",
          deadline: "Jan 25, 2026",
          status: "Locked",
        },
      ],
    },
    {
      id: "2",
      pId: "PROJ-102",
      title: "NFT Marketplace Audit",
      client: "OpenSea Clone",
      totalAmount: "4.0 ETH",
      releasedAmount: "0.0 ETH",
      status: "active",
      description: "Full security audit of the marketplace smart contracts.",
      createdAt: "2025-12-28",
      onchain_address: "0xABC...DEF",
      client_wallet: "0x456...def",
      chain_id: 56,
      created_at: "2025-12-28T00:00:00Z",
      updated_at: "2025-12-28T00:00:00Z",
      milestones: [
        {
          id: 1,
          title: "Audit Report",
          amount: "4.0 ETH",
          deadline: "Jan 15, 2026",
          status: "In Review",
        },
      ],
    },
    {
      id: "3",
      pId: "PROJ-103",
      title: "Solana Smart Contract",
      client: "SolDevs",
      status: "draft",
      totalAmount: "15 SOL",
      releasedAmount: "0 SOL",
      description: "Rust program for a token vesting schedule.",
      createdAt: "2026-01-03",
      onchain_address: "",
      client_wallet: "0x789...xyz",
      chain_id: 56,
      created_at: "2026-01-03T00:00:00Z",
      updated_at: "2026-01-03T00:00:00Z",
      milestones: [],
    },
  ];

  getProjects() {
    return this.projects;
  }

  getProjectById(id: string | number) {
    const idStr = String(id);
    return this.projects.find((p) => p.id === idStr);
  }

  updateMilestoneStatus(
    projectId: string | number,
    milestoneId: number,
    newStatus: MilestoneStatus,
  ) {
    const idStr = String(projectId);
    const project = this.projects.find((p) => p.id === idStr);
    if (!project) return;

    const milestone = project.milestones?.find((m) => m.id === milestoneId);
    if (!milestone) return;

    milestone.status = newStatus as string;

    if (newStatus === "approved" || newStatus === "released") {
    }
  }

  // Mock function to simulate blockchain delay
  async simulateTransaction(ms: number = 2000) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const mockStore = new MockStore();
