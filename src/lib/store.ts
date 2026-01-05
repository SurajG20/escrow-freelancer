import { Project, Milestone, MilestoneStatus, ProjectStatus } from "@/types";

// Mock Data Store
// In a real app, this would be Zustand or React Context + Wagmi
// For the prototype, we'll use a simple module-level state (resets on refresh) 
// or maybe just a simple helper to return data. 
// Actually, to show "state transitions" within a session, I'll make a tiny class-based store.

class MockStore {
    private projects: Project[] = [
        {
            id: 1,
            pId: "PROJ-101",
            title: "DeFi Dashboard Implementation",
            client: "Alpha Labs",
            clientAddress: "0x123...abc",
            freelancer: "Alice Studio",
            freelancerAddress: "0x789...xyz",
            totalAmount: "2.5 ETH",
            releasedAmount: "1.0 ETH",
            status: "Active",
            description: "Implementation of the main dashboard with wallet connection, staking view, and analytics.",
            createdAt: "2026-01-01",
            contractAddress: "0x71C...9A21",
            milestones: [
                { id: 1, title: "UI Implementation", amount: "1.0 ETH", deadline: "Jan 10, 2026", status: "Completed" },
                { id: 2, title: "Web3 Integration", amount: "1.0 ETH", deadline: "Jan 20, 2026", status: "In Progress" },
                { id: 3, title: "QA & Deployment", amount: "0.5 ETH", deadline: "Jan 25, 2026", status: "Locked" },
            ],
        },
        {
            id: 2,
            pId: "PROJ-102",
            title: "NFT Marketplace Audit",
            client: "OpenSea Clone",
            totalAmount: "4.0 ETH",
            releasedAmount: "0.0 ETH",
            status: "In Review",
            amount: "4.0 ETH",
            deadline: "5 days left",
            description: "Full security audit of the marketplace smart contracts.",
            createdAt: "2025-12-28",
            milestones: [
                { id: 1, title: "Audit Report", amount: "4.0 ETH", deadline: "Jan 15, 2026", status: "In Review" }
            ]
        } as any, // lazy typing for the mock list view items
        {
            id: 3,
            pId: "PROJ-103",
            title: "Solana Smart Contract",
            client: "SolDevs",
            status: "Pending",
            amount: "15 SOL",
            totalAmount: "15 SOL",
            releasedAmount: "0 SOL",
            deadline: "1 week left",
            description: "Rust program for a token vesting schedule.",
            createdAt: "2026-01-03",
            milestones: []
        } as any,
    ];

    getProjects() {
        return this.projects;
    }

    getProjectById(id: number) {
        return this.projects.find((p) => p.id === id);
    }

    updateMilestoneStatus(projectId: number, milestoneId: number, newStatus: MilestoneStatus) {
        const project = this.projects.find((p) => p.id === projectId);
        if (!project) return;

        const milestone = project.milestones.find((m) => m.id === milestoneId);
        if (!milestone) return;

        milestone.status = newStatus;

        // Simple logic to mock amount release
        if (newStatus === "Completed" || newStatus === "Released") {
            // Logic to parse "1.0 ETH" and add to released would go here in a real app
            // For now we just update the status visual
        }
    }

    // Mock function to simulate blockchain delay
    async simulateTransaction(ms: number = 2000) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

export const mockStore = new MockStore();
