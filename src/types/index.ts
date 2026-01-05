export type ProjectStatus = "Draft" | "Pending" | "Active" | "In Review" | "Disputed" | "Completed" | "Cancelled";
export type MilestoneStatus = "Draft" | "Locked" | "In Progress" | "In Review" | "Completed" | "Disputed" | "Released";

export interface User {
    id: string;
    name: string;
    role: "Client" | "Freelancer" | "Arbitrator";
    walletAddress?: string;
    avatar?: string;
    reputation: number;
}

export interface Milestone {
    id: number;
    title: string;
    description?: string;
    amount: string; // Keeping as string for now to support "1.5 ETH" format easily in UI, realistically would be BigInt or number
    deadline: string;
    status: MilestoneStatus;
}

export interface Project {
    id: number; // Using number for mock ID simplicity
    pId?: string; // e.g. "PROJ-101"
    title: string;
    client: string; // Client Name
    clientAddress?: string;
    freelancer?: string; // Freelancer Name
    freelancerAddress?: string;
    totalAmount: string; // e.g. "2.5 ETH"
    releasedAmount: string;
    status: ProjectStatus;
    description: string;
    createdAt: string;
    contractAddress?: string; // Mock address
    milestones: Milestone[];
}
