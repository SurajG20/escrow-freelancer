"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  FileText,
  Send,
  Shield,
  AlertTriangle,
  Loader2,
  Edit2,
  X,
  Plus,
  Trash2,
  Save,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  useProjectWithMilestones,
  useUpdateProject,
  useSendForApproval,
  useApproveProject,
  useRejectProject,
} from "@/lib/hooks/useProjects";
import {
  useUpdateMilestone,
  useReplaceMilestones,
} from "@/lib/hooks/useMilestones";
import { useCreateDispute } from "@/lib/hooks/useDisputes";
import { useAuth } from "@/lib/hooks/useAuth";
import { useWallet } from "@/lib/hooks/useWallet";
import { useWalletClient } from "wagmi";
import { deployEscrowContract } from "@/lib/contracts/deploy";
import {
  depositFunds,
  releaseMilestoneFunds,
  submitMilestoneOnChain,
  approveMilestoneOnChain,
} from "@/lib/contracts/escrow";

import { format } from "date-fns";

// Note: params is a Promise in newer Next.js versions (15+)

type MilestoneForm = {
  id: string | number;
  title: string;
  amount: string;
  deadline: string;
  currency: "NATIVE" | "USDT";
  isNew?: boolean;
};

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  const [projectId, setProjectId] = useState<string | null>(null);
  const [loadingStates, setLoadingStates] = useState({
    submit: {} as Record<string, boolean>,
    approve: {} as Record<string, boolean>,
    deposit: false,
    sendApproval: false,
    approveProject: false,
    rejectProject: false,
    createDispute: false,
    saveEdit: false,
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editCounterpartyWallet, setEditCounterpartyWallet] = useState("");
  const [editMilestones, setEditMilestones] = useState<MilestoneForm[]>([]);
  const [editErrors, setEditErrors] = useState<Record<string, string>>({});
  const [showWalletWarning, setShowWalletWarning] = useState(false);
  const [originalCounterpartyWallet, setOriginalCounterpartyWallet] =
    useState("");
  const { address } = useAuth();
  const { chainId, chainConfig } = useWallet();
  const { data: walletClient } = useWalletClient();
  const updateMilestoneMutation = useUpdateMilestone();
  const replaceMilestonesMutation = useReplaceMilestones();
  const createDisputeMutation = useCreateDispute();
  const updateProjectMutation = useUpdateProject();
  const sendForApprovalMutation = useSendForApproval();
  const approveProjectMutation = useApproveProject();
  const rejectProjectMutation = useRejectProject();

  useEffect(() => {
    const loadParams = async () => {
      let id;
      if (params instanceof Promise) {
        const resolved = await params;
        id = resolved.id;
      } else {
        id = params.id;
      }
      setProjectId(id);
    };
    loadParams();
  }, [params]);

  const {
    data: project,
    isLoading,
    refetch,
  } = useProjectWithMilestones(projectId || "");

  const isAnyActionLoading = () => {
    return (
      loadingStates.deposit ||
      loadingStates.sendApproval ||
      loadingStates.approveProject ||
      loadingStates.rejectProject ||
      loadingStates.createDispute ||
      loadingStates.saveEdit ||
      Object.values(loadingStates.submit).some(Boolean) ||
      Object.values(loadingStates.approve).some(Boolean)
    );
  };

  useEffect(() => {
    if (project && !isEditMode) {
      setEditTitle(project.title);
      setEditDescription(project.description);
      const counterpartyWallet =
        address?.toLowerCase() === project.client_wallet.toLowerCase()
          ? project.freelancer_wallet || ""
          : project.client_wallet;
      setEditCounterpartyWallet(counterpartyWallet);
      setOriginalCounterpartyWallet(counterpartyWallet);
      setShowWalletWarning(false);
      if (project.milestones) {
        setEditMilestones(
          project.milestones.map((m) => ({
            id: m.id,
            title: m.title,
            amount: m.amount,
            deadline: format(new Date(m.deadline), "yyyy-MM-dd"),
            currency: m.currency,
          }))
        );
      }
    }
  }, [project, isEditMode, address]);

  const handleAction = async (action: string, milestoneId?: string) => {
    if (!milestoneId || !project) return;

    if (action === "submit") {
      if (project.status !== "active") {
        toast.error("Project Not Active", {
          id: `milestone-${milestoneId}`,
          description:
            project.status === "pending_approval"
              ? "Please wait for the project to be approved"
              : project.status === "approved"
                ? "Please deposit funds to activate the project"
                : "Project must be approved and funds deposited before submitting milestones",
        });
        return;
      }

      if (
        !project.onchain_address ||
        project.onchain_address === "Pending" ||
        !project.onchain_address.startsWith("0x") ||
        project.onchain_address.length !== 42
      ) {
        toast.error("Funds Not Deposited", {
          id: `milestone-${milestoneId}`,
          description:
            "Please deposit funds to the escrow contract before submitting milestones",
        });
        return;
      }
    }

    const actionKey = action === "submit" ? "submit" : "approve";
    setLoadingStates((prev) => ({
      ...prev,
      [actionKey]: {
        ...(prev[actionKey as keyof typeof prev] as Record<string, boolean>),
        [milestoneId]: true,
      },
    }));
    try {
      if (action === "submit") {
        if (!walletClient) {
          throw new Error("Wallet not connected");
        }

        const milestone = project.milestones?.find((m) => m.id === milestoneId);

        if (!milestone) {
          throw new Error("Milestone not found");
        }

        toast.loading("Submitting milestone on-chain...", {
          id: `milestone-${milestoneId}`,
        });

        await submitMilestoneOnChain(
          project.onchain_address,
          milestone.index,
          walletClient
        );

        await updateMilestoneMutation.mutateAsync({
          id: milestoneId,
          updates: { offchain_state: "submitted" },
        });

        toast.success("Milestone submitted!", {
          id: `milestone-${milestoneId}`,
          description: "Waiting for client approval",
        });
      } else if (action === "approve") {
        if (
          !project.onchain_address ||
          project.onchain_address === "Pending" ||
          !project.onchain_address.startsWith("0x") ||
          project.onchain_address.length !== 42
        ) {
          toast.error("Contract Not Deployed", {
            id: `milestone-${milestoneId}`,
            description:
              "Escrow contract must be deployed before approving milestones",
          });
          return;
        }

        if (!walletClient) {
          toast.error("Wallet Not Connected", {
            id: `milestone-${milestoneId}`,
            description:
              "Please connect your wallet to approve and release funds",
          });
          return;
        }

        const milestone = project.milestones?.find((m) => m.id === milestoneId);
        if (!milestone) {
          toast.error("Milestone Not Found", {
            id: `milestone-${milestoneId}`,
            description: "Could not find milestone to approve",
          });
          return;
        }

        toast.loading("Approving milestone...", {
          id: `milestone-${milestoneId}`,
        });

        try {
          toast.loading("Releasing funds to freelancer...", {
            id: `milestone-${milestoneId}-release`,
          });

          await approveMilestoneOnChain(
            project.onchain_address,
            milestone.index,
            walletClient
          );

          const releaseResult = await releaseMilestoneFunds(
            project.onchain_address,
            milestone.index,
            walletClient
          );
          await updateMilestoneMutation.mutateAsync({
            id: milestoneId,
            updates: {
              offchain_state: "released",
              onchain_state: releaseResult.transactionHash,
            },
          });

          toast.dismiss(`milestone-${milestoneId}-release`);
          toast.success("Milestone approved and funds released!", {
            id: `milestone-${milestoneId}`,
            description: `Transaction: ${releaseResult.transactionHash.substring(0, 10)}...`,
            duration: 6000,
          });
        } catch (releaseError) {
          toast.dismiss(`milestone-${milestoneId}-release`);
          const errorMessage =
            releaseError instanceof Error
              ? releaseError.message
              : "Failed to release funds";
          toast.error("Fund Release Failed", {
            id: `milestone-${milestoneId}`,
            description: errorMessage,
            duration: 6000,
          });
          throw releaseError;
        }
      }
      await refetch();
    } catch (error) {
      toast.error("Action Failed", {
        id: `milestone-${milestoneId}`,
        description:
          error instanceof Error ? error.message : "Failed to update milestone",
      });
    } finally {
      setLoadingStates((prev) => ({
        ...prev,
        [actionKey]: {
          ...(prev[actionKey as keyof typeof prev] as Record<string, boolean>),
          [milestoneId]: false,
        },
      }));
    }
  };

  const handleCreateDispute = async (milestoneId?: string) => {
    if (!project || !address) return;

    setLoadingStates((prev) => ({ ...prev, createDispute: true }));
    try {
      toast.loading("Creating dispute...", { id: "dispute" });
      await createDisputeMutation.mutateAsync({
        project_id: project.id,
        milestone_id: milestoneId,
        opened_by: address.toLowerCase(),
        status: "open",
      });
      toast.success("Dispute created!", {
        id: "dispute",
        description: "The dispute is now open for resolution",
        duration: 5000,
      });
      await refetch();
    } catch (error) {
      toast.error("Failed to Create Dispute", {
        id: "dispute",
        description:
          error instanceof Error ? error.message : "Please try again",
      });
    } finally {
      setLoadingStates((prev) => ({ ...prev, createDispute: false }));
    }
  };

  const handleDepositFunds = async () => {
    if (!project || !address || !chainId || !chainConfig) {
      toast.error("Wallet Not Connected", {
        description: "Please connect your wallet to deposit funds",
      });
      return;
    }

    const isClient =
      address.toLowerCase() === project.client_wallet.toLowerCase();
    if (!isClient) {
      toast.error("Permission Denied", {
        description: "Only the client can deposit funds",
      });
      return;
    }

    if (project.status !== "approved") {
      toast.error("Project Not Approved", {
        description:
          project.status === "pending_approval"
            ? "Please wait for the freelancer to approve the project"
            : project.status === "draft"
              ? "Please send the project for approval first"
              : "Project must be approved before depositing funds",
      });
      return;
    }

    if (
      project.onchain_address &&
      project.onchain_address !== "Pending" &&
      project.onchain_address.startsWith("0x") &&
      project.onchain_address.length === 42
    ) {
      toast.error("Contract Already Deployed", {
        description: "This project already has a deployed contract",
      });
      return;
    }

    setLoadingStates((prev) => ({ ...prev, deposit: true }));

    try {
      const milestones = project.milestones || [];

      if (!walletClient) {
        throw new Error("Wallet client not available");
      }

      if (!process.env.NEXT_PUBLIC_ESCROW_FACTORY_ADDRESS) {
        throw new Error(
          "Escrow contract is not configured. Please contact support."
        );
      }

      console.log("Starting contract deployment...");
      console.log(
        "Factory address:",
        process.env.NEXT_PUBLIC_ESCROW_FACTORY_ADDRESS
      );
      console.log("USDT address:", chainConfig.usdtContractAddress);

      toast.loading("Deploying escrow contract...", { id: "deploy" });

      const deployResult = await deployEscrowContract(
        {
          clientWallet: project.client_wallet,
          freelancerWallet: project.freelancer_wallet || "",
          milestones: milestones.map((m) => ({
            amount: m.amount,
            currency: m.currency,
          })),
          chainId: chainId as number,
        },
        walletClient
      );

      const deployedContractAddress = deployResult.contractAddress;

      toast.success("Escrow contract deployed!", { id: "deploy" });
      toast.loading("Depositing funds...", { id: "deposit" });
      const nativeTotal = milestones
        .filter((m) => m.currency === "NATIVE")
        .reduce((sum, m) => sum + parseFloat(m.amount || "0"), 0);
      const usdtTotal = milestones
        .filter((m) => m.currency === "USDT")
        .reduce((sum, m) => sum + parseFloat(m.amount || "0"), 0);

      if (nativeTotal > 0) {
        await depositFunds(
          deployedContractAddress,
          nativeTotal.toString(),
          "NATIVE",
          walletClient
        );
      }

      if (usdtTotal > 0) {
        await depositFunds(
          deployedContractAddress,
          usdtTotal.toString(),
          "USDT",
          walletClient
        );
      }

      toast.success("Funds deposited!", { id: "deposit" });
      toast.loading("Updating project...", { id: "update" });
      await updateProjectMutation.mutateAsync({
        id: project.id,
        updates: {
          onchain_address: deployedContractAddress,
          status: "active",
        },
      });

      await refetch();

      toast.success("Funds deposited successfully! Project is now active.", {
        id: "update",
        description: `Contract: ${deployedContractAddress.substring(0, 6)}...${deployedContractAddress.substring(38)}`,
        duration: 6000,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to deposit funds. Please try again.";

      toast.dismiss("deploy");
      toast.dismiss("deposit");
      toast.dismiss("update");

      toast.error("Deposit Failed", {
        description: errorMessage,
        duration: 6000,
      });
    } finally {
      setLoadingStates((prev) => ({ ...prev, deposit: false }));
    }
  };

  const handleEditMode = () => {
    if (!project) return;
    setIsEditMode(true);
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditErrors({});
    if (project) {
      setEditTitle(project.title);
      setEditDescription(project.description);
      const counterpartyWallet =
        address?.toLowerCase() === project.client_wallet.toLowerCase()
          ? project.freelancer_wallet || ""
          : project.client_wallet;
      setEditCounterpartyWallet(counterpartyWallet);
      if (project.milestones) {
        setEditMilestones(
          project.milestones.map((m) => ({
            id: m.id,
            title: m.title,
            amount: m.amount,
            deadline: format(new Date(m.deadline), "yyyy-MM-dd"),
            currency: m.currency,
          }))
        );
      }
    }
  };

  const validateEditForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!editTitle.trim()) {
      newErrors.title = "Project title is required";
    }

    if (!editDescription.trim()) {
      newErrors.description = "Description is required";
    }

    if (!editCounterpartyWallet.trim()) {
      newErrors.counterpartyWallet = "Counterparty wallet is required";
    } else if (
      !editCounterpartyWallet.match(/^0x[a-fA-F0-9]{40}$/i) &&
      !editCounterpartyWallet.includes("@")
    ) {
      newErrors.counterpartyWallet = "Invalid wallet address or email";
    }

    editMilestones.forEach((m, index) => {
      if (!m.title.trim()) {
        newErrors[`milestone_${m.id}_title`] =
          `Milestone ${index + 1} title is required`;
      }
      if (!m.amount.trim() || parseFloat(m.amount) <= 0) {
        newErrors[`milestone_${m.id}_amount`] =
          `Milestone ${index + 1} amount must be greater than 0`;
      }
      if (!m.deadline) {
        newErrors[`milestone_${m.id}_deadline`] =
          `Milestone ${index + 1} deadline is required`;
      } else if (new Date(m.deadline) < new Date()) {
        newErrors[`milestone_${m.id}_deadline`] =
          `Milestone ${index + 1} deadline must be in the future`;
      }
    });

    setEditErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveEdit = async () => {
    if (!project || !address || !chainId) return;

    if (!validateEditForm()) {
      return;
    }

    const isClient =
      address.toLowerCase() === project.client_wallet.toLowerCase();
    const newCounterpartyWallet = editCounterpartyWallet.toLowerCase();
    const walletChanged =
      originalCounterpartyWallet.toLowerCase() !== newCounterpartyWallet;

    if (walletChanged && !showWalletWarning) {
      setShowWalletWarning(true);
      toast.warning("Wallet Address Changed", {
        description:
          "You are changing the counterparty wallet address. This will require re-approval if the project was already sent for approval.",
        duration: 5000,
      });
      return;
    }

    setLoadingStates((prev) => ({ ...prev, saveEdit: true }));
    setEditErrors({});
    setShowWalletWarning(false);

    try {
      const clientWallet = isClient
        ? address.toLowerCase()
        : newCounterpartyWallet;
      const freelancerWallet = isClient
        ? newCounterpartyWallet
        : address.toLowerCase();

      await updateProjectMutation.mutateAsync({
        id: project.id,
        updates: {
          title: editTitle.trim(),
          description: editDescription.trim(),
          client_wallet: clientWallet,
          freelancer_wallet: freelancerWallet,
        },
      });

      const milestonesData = editMilestones.map((m, index) => ({
        index: index,
        title: m.title.trim(),
        description: "",
        amount: m.amount,
        currency: m.currency,
        chain_id: typeof chainId === "string" ? 56 : chainId,
        deadline: new Date(m.deadline).toISOString(),
      }));

      await replaceMilestonesMutation.mutateAsync({
        projectId: project.id,
        milestones: milestonesData,
      });

      await refetch();
      setIsEditMode(false);
      toast.success("Project updated successfully!");
    } catch (error) {
      console.error("Failed to update project:", error);
      toast.error("Update Failed", {
        description:
          error instanceof Error ? error.message : "Failed to update project",
      });
    } finally {
      setLoadingStates((prev) => ({ ...prev, saveEdit: false }));
    }
  };

  const addMilestone = () => {
    setEditMilestones([
      ...editMilestones,
      {
        id: Date.now(),
        title: "",
        amount: "",
        deadline: "",
        currency: editMilestones[0]?.currency || "NATIVE",
        isNew: true,
      },
    ]);
  };

  const removeMilestone = (id: string | number) => {
    if (editMilestones.length > 1) {
      setEditMilestones(editMilestones.filter((m) => m.id !== id));
    }
  };

  const updateMilestone = (
    id: string | number,
    updates: Partial<MilestoneForm>
  ) => {
    setEditMilestones(
      editMilestones.map((m) => (m.id === id ? { ...m, ...updates } : m))
    );
  };

  const handleSendForApproval = async () => {
    if (!project || !address) return;

    const isClient =
      address.toLowerCase() === project.client_wallet.toLowerCase();
    if (!isClient) {
      toast.error("Permission Denied", {
        description: "Only the client can send the project for approval",
      });
      return;
    }

    if (!project.freelancer_wallet) {
      toast.error("Missing Counterparty", {
        description:
          "Please set a freelancer wallet address before sending for approval",
      });
      return;
    }

    if (!project.milestones || project.milestones.length === 0) {
      toast.error("No Milestones", {
        description:
          "Please add at least one milestone before sending for approval",
      });
      return;
    }

    setLoadingStates((prev) => ({ ...prev, sendApproval: true }));
    try {
      toast.loading("Sending project for approval...", { id: "approval" });
      await sendForApprovalMutation.mutateAsync(project.id);
      await refetch();
      toast.success("Project sent for approval!", {
        id: "approval",
        description: "Waiting for freelancer to review and approve",
      });
    } catch (error) {
      console.error("Failed to send for approval:", error);
      toast.error("Failed to Send for Approval", {
        id: "approval",
        description:
          error instanceof Error ? error.message : "Please try again",
      });
    } finally {
      setLoadingStates((prev) => ({ ...prev, sendApproval: false }));
    }
  };

  const handleApproveProject = async () => {
    if (!project || !address) return;

    const isFreelancer =
      address.toLowerCase() === project.freelancer_wallet?.toLowerCase();
    if (!isFreelancer) {
      toast.error("Permission Denied", {
        description: "Only the freelancer can approve the project",
      });
      return;
    }

    setLoadingStates((prev) => ({ ...prev, approveProject: true }));
    try {
      toast.loading("Approving project...", { id: "approve" });
      await approveProjectMutation.mutateAsync(project.id);
      await refetch();
      toast.success("Project approved!", {
        id: "approve",
        description: "Client can now deposit funds",
      });
    } catch (error) {
      console.error("Failed to approve project:", error);
      toast.error("Failed to Approve", {
        id: "approve",
        description:
          error instanceof Error ? error.message : "Please try again",
      });
    } finally {
      setLoadingStates((prev) => ({ ...prev, approveProject: false }));
    }
  };

  const handleRejectProject = async () => {
    if (!project || !address) return;

    const isFreelancer =
      address.toLowerCase() === project.freelancer_wallet?.toLowerCase();
    if (!isFreelancer) {
      toast.error("Permission Denied", {
        description: "Only the freelancer can reject the project",
      });
      return;
    }

    setLoadingStates((prev) => ({ ...prev, rejectProject: true }));
    try {
      toast.loading("Rejecting project...", { id: "reject" });
      await rejectProjectMutation.mutateAsync(project.id);
      await refetch();
      toast.success("Project rejected", {
        id: "reject",
        description: "Project has been returned to draft status",
      });
    } catch (error) {
      console.error("Failed to reject project:", error);
      toast.error("Failed to Reject", {
        id: "reject",
        description:
          error instanceof Error ? error.message : "Please try again",
      });
    } finally {
      setLoadingStates((prev) => ({ ...prev, rejectProject: false }));
    }
  };

  if (isLoading || !projectId) {
    return (
      <div className="p-10 text-center">
        <Loader2 className="h-6 w-6 animate-spin mx-auto mb-4 text-muted-foreground" />
        <p>Loading project details...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-10 text-center">
        <p className="text-muted-foreground">Project not found</p>
        <Link
          href="/dashboard/projects"
          className="text-accent hover:underline mt-2 inline-block"
        >
          Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <Link
        href="/dashboard/projects"
        className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Projects
      </Link>

      {/* Header */}
      <div className="flex flex-col lg:flex-row gap-6 lg:items-start lg:justify-between">
        <div className="space-y-2">
          {isEditMode ? (
            <Input
              value={editTitle}
              onChange={(e) => {
                setEditTitle(e.target.value);
                if (editErrors.title)
                  setEditErrors({ ...editErrors, title: "" });
              }}
              className="text-3xl font-light"
              placeholder="Project title"
            />
          ) : (
            <h1 className="text-3xl font-light tracking-tight">
              {project.title}
            </h1>
          )}
          {editErrors.title && (
            <p className="text-xs text-red-500">{editErrors.title}</p>
          )}
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-white/50">
              {project.client_wallet.substring(0, 6)}...
              {project.client_wallet.substring(38)}
            </Badge>
            <Badge
              variant={
                project.status === "active"
                  ? "success"
                  : project.status === "approved"
                    ? "success"
                    : project.status === "pending_approval"
                      ? "warning"
                      : project.status === "in_dispute"
                        ? "destructive"
                        : "default"
              }
              className={
                project.status === "pending_approval"
                  ? "bg-amber-500/10 text-amber-600 border-none"
                  : project.status === "approved"
                    ? "bg-emerald-500/10 text-emerald-600 border-none"
                    : project.status === "active"
                      ? "bg-emerald-500/10 text-emerald-600 border-none"
                      : "bg-emerald-500/10 text-emerald-600 border-none"
              }
            >
              {project.status.replace("_", " ")}
            </Badge>
            <span className="text-sm text-muted-foreground font-mono">
              Contract: {project.onchain_address || "Pending"}
            </span>
          </div>
        </div>
        <div className="flex gap-3">
          {project.status === "draft" &&
            address?.toLowerCase() === project.client_wallet.toLowerCase() && (
              <>
                {!isEditMode ? (
                  <Button
                    variant="outline"
                    onClick={handleEditMode}
                    disabled={isAnyActionLoading()}
                    className="gap-2"
                  >
                    <Edit2 className="h-4 w-4" />
                    Edit Project
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      onClick={handleCancelEdit}
                      disabled={loadingStates.saveEdit}
                      className="gap-2"
                    >
                      <X className="h-4 w-4" />
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSaveEdit}
                      disabled={loadingStates.saveEdit || isAnyActionLoading()}
                      className="gap-2"
                    >
                      {loadingStates.saveEdit ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </>
                )}
              </>
            )}
          {project.onchain_address && project.onchain_address !== "Pending" && (
            <Button
              variant="outline"
              className="bg-white/40"
              onClick={() => {
                const explorerUrl =
                  chainConfig?.blockExplorerUrl || "https://bscscan.com";
                window.open(
                  `${explorerUrl}/address/${project.onchain_address}`,
                  "_blank"
                );
              }}
            >
              View Contract
            </Button>
          )}
          {project.status === "draft" &&
            address?.toLowerCase() === project.client_wallet.toLowerCase() &&
            !isEditMode && (
              <Button
                onClick={handleSendForApproval}
                disabled={
                  loadingStates.sendApproval ||
                  isAnyActionLoading() ||
                  !address ||
                  !project.freelancer_wallet ||
                  !project.milestones ||
                  project.milestones.length === 0
                }
                className="gap-2"
              >
                {loadingStates.sendApproval ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Send for Approval
                  </>
                )}
              </Button>
            )}
          {project.status === "pending_approval" &&
            address?.toLowerCase() ===
              project.freelancer_wallet?.toLowerCase() && (
              <>
                <Button
                  onClick={handleApproveProject}
                  disabled={
                    loadingStates.approveProject || isAnyActionLoading()
                  }
                  className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  {loadingStates.approveProject ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Approving...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      Approve Project
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleRejectProject}
                  disabled={loadingStates.rejectProject || isAnyActionLoading()}
                  className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  {loadingStates.rejectProject ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Rejecting...
                    </>
                  ) : (
                    <>
                      <X className="h-4 w-4" />
                      Reject
                    </>
                  )}
                </Button>
              </>
            )}
          {project.status === "approved" &&
            address?.toLowerCase() === project.client_wallet.toLowerCase() &&
            !isEditMode && (
              <Button
                onClick={handleDepositFunds}
                disabled={
                  loadingStates.deposit || isAnyActionLoading() || !address
                }
                className="gap-2"
              >
                {loadingStates.deposit ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Depositing...
                  </>
                ) : (
                  "Deposit Funds"
                )}
              </Button>
            )}
          {project.status === "active" && (
            <Badge
              variant="outline"
              className="bg-emerald-500/10 text-emerald-600 border-emerald-200"
            >
              Active
            </Badge>
          )}
        </div>
      </div>

      {(project.status === "pending_approval" ||
        project.status === "approved") && (
        <div
          className={cn(
            "rounded-lg border p-4",
            project.status === "pending_approval"
              ? "bg-amber-50 border-amber-200 text-amber-800"
              : "bg-emerald-50 border-emerald-200 text-emerald-800"
          )}
        >
          <div className="flex items-start gap-3">
            {project.status === "pending_approval" ? (
              <>
                <Clock className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Awaiting Approval</p>
                  <p className="text-sm mt-1">
                    {address?.toLowerCase() ===
                    project.client_wallet.toLowerCase()
                      ? "Waiting for the freelancer to review and approve this project."
                      : "Please review the project details and milestones. Click 'Approve Project' to proceed or 'Reject' to send it back for changes."}
                  </p>
                </div>
              </>
            ) : (
              <>
                <CheckCircle2 className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Project Approved</p>
                  <p className="text-sm mt-1">
                    {address?.toLowerCase() ===
                    project.client_wallet.toLowerCase()
                      ? "The project has been approved. You can now deposit funds to activate the escrow contract."
                      : "The project has been approved. Waiting for the client to deposit funds."}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content: Milestones & Description */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="">
            <CardHeader>
              <CardTitle className="text-lg">Description</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditMode ? (
                <div className="space-y-2">
                  <textarea
                    className="w-full min-h-[100px] px-3 py-2 rounded-lg border border-slate-200 bg-white/50 focus:outline-none focus:ring-2 focus:ring-accent/20 resize-none"
                    placeholder="Describe the project scope and requirements..."
                    value={editDescription}
                    onChange={(e) => {
                      setEditDescription(e.target.value);
                      if (editErrors.description)
                        setEditErrors({ ...editErrors, description: "" });
                    }}
                  />
                  {editErrors.description && (
                    <p className="text-xs text-red-500">
                      {editErrors.description}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground leading-relaxed">
                  {project.description}
                </p>
              )}
            </CardContent>
          </Card>

          {isEditMode && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Counterparty Wallet</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {showWalletWarning && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800 flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Wallet address changed</p>
                        <p className="text-xs mt-1">
                          Changing the counterparty wallet will require
                          re-approval if the project was already sent for
                          approval. Click &quot;Save Changes&quot; again to confirm.
                        </p>
                      </div>
                    </div>
                  )}
                  <Input
                    value={editCounterpartyWallet}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      setEditCounterpartyWallet(newValue);
                      if (editErrors.counterpartyWallet)
                        setEditErrors({
                          ...editErrors,
                          counterpartyWallet: "",
                        });
                      if (
                        originalCounterpartyWallet &&
                        newValue.toLowerCase() !==
                          originalCounterpartyWallet.toLowerCase()
                      ) {
                        setShowWalletWarning(true);
                      } else {
                        setShowWalletWarning(false);
                      }
                    }}
                    placeholder="0x..."
                  />
                  {editErrors.counterpartyWallet && (
                    <p className="text-xs text-red-500">
                      {editErrors.counterpartyWallet}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Milestones</h2>
            {isEditMode ? (
              <div className="space-y-3">
                {editMilestones.map((ms, index) => (
                  <div
                    key={ms.id}
                    className="flex gap-4 items-start bg-white/40 p-3 rounded-lg border border-slate-200"
                  >
                    <span className="pt-2 text-sm font-bold text-muted-foreground w-6">
                      {index + 1}.
                    </span>
                    <div className="flex-1 space-y-2">
                      <div className="space-y-1">
                        <label className="text-xs font-medium">
                          Description *
                        </label>
                        <Input
                          placeholder="Deliverable name"
                          value={ms.title}
                          onChange={(e) => {
                            updateMilestone(ms.id, { title: e.target.value });
                            if (editErrors[`milestone_${ms.id}_title`]) {
                              const newErrors = { ...editErrors };
                              delete newErrors[`milestone_${ms.id}_title`];
                              setEditErrors(newErrors);
                            }
                          }}
                        />
                        {editErrors[`milestone_${ms.id}_title`] && (
                          <p className="text-xs text-red-500">
                            {editErrors[`milestone_${ms.id}_title`]}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <div className="flex-1 space-y-1">
                          <label className="text-xs font-medium">
                            Amount *
                          </label>
                          <div className="flex gap-2">
                            <Input
                              type="number"
                              step="0.001"
                              placeholder="0.0"
                              value={ms.amount}
                              onChange={(e) => {
                                updateMilestone(ms.id, {
                                  amount: e.target.value,
                                });
                                if (editErrors[`milestone_${ms.id}_amount`]) {
                                  const newErrors = { ...editErrors };
                                  delete newErrors[`milestone_${ms.id}_amount`];
                                  setEditErrors(newErrors);
                                }
                              }}
                            />
                            <select
                              className="px-3 py-2 rounded-lg border border-slate-200 bg-white/50 focus:outline-none focus:ring-2 focus:ring-accent/20 text-sm"
                              value={ms.currency}
                              onChange={(e) =>
                                updateMilestone(ms.id, {
                                  currency: e.target.value as "NATIVE" | "USDT",
                                })
                              }
                            >
                              <option value="NATIVE">
                                {chainConfig?.nativeSymbol || "NATIVE"}
                              </option>
                              {chainConfig?.supportedTokens.includes(
                                "USDT"
                              ) && <option value="USDT">USDT</option>}
                            </select>
                          </div>
                          {editErrors[`milestone_${ms.id}_amount`] && (
                            <p className="text-xs text-red-500">
                              {editErrors[`milestone_${ms.id}_amount`]}
                            </p>
                          )}
                        </div>
                        <div className="w-40 space-y-1">
                          <label className="text-xs font-medium">
                            Deadline *
                          </label>
                          <Input
                            type="date"
                            value={ms.deadline}
                            onChange={(e) => {
                              updateMilestone(ms.id, {
                                deadline: e.target.value,
                              });
                              if (editErrors[`milestone_${ms.id}_deadline`]) {
                                const newErrors = { ...editErrors };
                                delete newErrors[`milestone_${ms.id}_deadline`];
                                setEditErrors(newErrors);
                              }
                            }}
                            min={new Date().toISOString().split("T")[0]}
                          />
                          {editErrors[`milestone_${ms.id}_deadline`] && (
                            <p className="text-xs text-red-500">
                              {editErrors[`milestone_${ms.id}_deadline`]}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    {editMilestones.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeMilestone(ms.id)}
                        className="text-muted-foreground hover:text-red-500 mt-6"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  variant="outline"
                  onClick={addMilestone}
                  className="w-full border-dashed border-muted-foreground/30 hover:border-accent hover:text-accent"
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Milestone
                </Button>
              </div>
            ) : project.milestones && project.milestones.length > 0 ? (
              <div className="space-y-3">
                {project.milestones.map((milestone) => {
                  const isClient =
                    address?.toLowerCase() ===
                    project.client_wallet.toLowerCase();
                  const isProjectActive = project.status === "active";
                  const hasFundsDeposited =
                    project.onchain_address &&
                    project.onchain_address !== "Pending" &&
                    project.onchain_address.startsWith("0x") &&
                    project.onchain_address.length === 42;
                  const canSubmit =
                    !isClient &&
                    milestone.offchain_state === "awaiting_submission" &&
                    isProjectActive &&
                    hasFundsDeposited;
                  const canSubmitButDisabled =
                    !isClient &&
                    milestone.offchain_state === "awaiting_submission" &&
                    (!isProjectActive || !hasFundsDeposited);
                  const canApprove =
                    isClient && milestone.offchain_state === "submitted";

                  return (
                    <div
                      key={milestone.id}
                      className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 hover:border-accent/30 transition-all duration-300"
                    >
                      <div
                        className={cn(
                          "absolute left-0 top-0 h-full w-1",
                          milestone.offchain_state === "released"
                            ? "bg-emerald-500"
                            : milestone.offchain_state === "approved"
                              ? "bg-emerald-500"
                              : milestone.offchain_state === "submitted"
                                ? "bg-orange-400"
                                : milestone.offchain_state === "disputed"
                                  ? "bg-red-500"
                                  : "bg-muted"
                        )}
                      />

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1 ml-3">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-foreground">
                              {milestone.title}
                            </h3>
                            {milestone.offchain_state === "released" && (
                              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                            )}
                            {milestone.offchain_state === "submitted" && (
                              <Clock className="h-4 w-4 text-orange-400" />
                            )}
                            {milestone.offchain_state === "disputed" && (
                              <AlertTriangle className="h-4 w-4 text-red-500" />
                            )}
                          </div>
                          {milestone.description && (
                            <p className="text-sm text-muted-foreground">
                              {milestone.description}
                            </p>
                          )}
                          <div className="flex gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />{" "}
                              {format(
                                new Date(milestone.deadline),
                                "MMM d, yyyy"
                              )}
                            </span>
                            <span className="flex items-center gap-1">
                              <FileText className="h-3 w-3" />{" "}
                              {milestone.amount}{" "}
                              {milestone.currency === "NATIVE"
                                ? chainConfig?.nativeSymbol || "NATIVE"
                                : milestone.currency}
                            </span>
                          </div>
                          {canSubmitButDisabled && (
                            <p className="text-xs text-amber-600 mt-1">
                              {!isProjectActive
                                ? "Project must be approved and funds deposited before submission"
                                : !hasFundsDeposited
                                  ? "Funds must be deposited to the escrow contract before submission"
                                  : "Waiting for project activation"}
                            </p>
                          )}
                        </div>
                        <div className="ml-3 sm:ml-0 flex gap-2">
                          {(canSubmit || canSubmitButDisabled) && (
                            <Button
                              size="sm"
                              className="w-full sm:w-auto"
                              onClick={() =>
                                handleAction("submit", milestone.id)
                              }
                              disabled={
                                canSubmitButDisabled ||
                                loadingStates.submit[milestone.id] ||
                                isAnyActionLoading()
                              }
                              title={
                                canSubmitButDisabled
                                  ? !isProjectActive
                                    ? "Project must be approved and funds deposited"
                                    : "Funds must be deposited"
                                  : undefined
                              }
                            >
                              {loadingStates.submit[milestone.id] ? (
                                <>
                                  <Loader2 className="h-3 w-3 animate-spin mr-1" />
                                  Submitting...
                                </>
                              ) : (
                                "Submit Work"
                              )}
                            </Button>
                          )}
                          {canApprove && (
                            <Button
                              size="sm"
                              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white"
                              onClick={() =>
                                handleAction("approve", milestone.id)
                              }
                              disabled={
                                loadingStates.approve[milestone.id] ||
                                isAnyActionLoading()
                              }
                            >
                              {loadingStates.approve[milestone.id] ? (
                                <>
                                  <Loader2 className="h-3 w-3 animate-spin mr-1" />
                                  Approving...
                                </>
                              ) : (
                                "Approve & Pay"
                              )}
                            </Button>
                          )}
                          {milestone.offchain_state === "released" && (
                            <Badge
                              variant="outline"
                              className="text-emerald-600 border-emerald-200 bg-emerald-50"
                            >
                              Paid & Released
                            </Badge>
                          )}
                          {milestone.offchain_state === "approved" && (
                            <Badge
                              variant="outline"
                              className="text-emerald-600 border-emerald-200 bg-emerald-50"
                            >
                              Approved
                            </Badge>
                          )}
                          {milestone.offchain_state ===
                            "awaiting_submission" && (
                            <Badge
                              variant="secondary"
                              className="bg-muted text-muted-foreground"
                            >
                              Awaiting Submission
                            </Badge>
                          )}
                          {milestone.offchain_state === "disputed" && (
                            <Badge variant="destructive">Disputed</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No milestones found for this project.
              </div>
            )}
          </div>
        </div>

        {/* Sidebar: State & Summary */}
        <div className="space-y-6">
          {/* Contract State Visualizer */}
          <Card className=" bg-gradient-to-br from-white to-accent/5 overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Shield className="h-4 w-4" /> Escrow State
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Simplified State Machine Viz */}
              <div className="relative flex flex-col gap-6 py-2">
                <div className="absolute left-[15px] top-2 h-full w-0.5 bg-border -z-10" />

                {[
                  "Deposited",
                  "Milestone Active",
                  "In Review",
                  "Completed",
                ].map((step, i) => {
                  const milestones = project.milestones || [];
                  const hasSubmitted = milestones.some(
                    (m) => m.offchain_state === "submitted"
                  );
                  const hasApproved = milestones.some(
                    (m) =>
                      m.offchain_state === "approved" ||
                      m.offchain_state === "released"
                  );
                  const stepIndex = hasApproved
                    ? 3
                    : hasSubmitted
                      ? 2
                      : project.status === "active"
                        ? 1
                        : 0;
                  const isActive = i <= stepIndex;

                  return (
                    <div key={step} className="flex items-center gap-3">
                      <div
                        className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold transition-colors z-10 bg-background",
                          isActive
                            ? "border-accent bg-accent text-white"
                            : "border-muted text-muted-foreground"
                        )}
                      >
                        {i + 1}
                      </div>
                      <span
                        className={cn(
                          "text-sm font-medium",
                          isActive ? "text-foreground" : "text-muted-foreground"
                        )}
                      >
                        {step}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Summary Stats */}
          <Card className="">
            <CardContent className="pt-6 space-y-4">
              {(() => {
                const milestones = project.milestones || [];
                const nativeMilestones = milestones.filter(
                  (m) => m.currency === "NATIVE"
                );
                const usdtMilestones = milestones.filter(
                  (m) => m.currency === "USDT"
                );
                const nativeTotal = nativeMilestones.reduce(
                  (sum, m) => sum + parseFloat(m.amount || "0"),
                  0
                );
                const usdtTotal = usdtMilestones.reduce(
                  (sum, m) => sum + parseFloat(m.amount || "0"),
                  0
                );
                const nativeSymbol = chainConfig?.nativeSymbol || "NATIVE";

                return (
                  <>
                    {nativeTotal > 0 && usdtTotal > 0 ? (
                      <>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground">
                            Total Contract Value (NATIVE)
                          </span>
                          <span className="font-mono font-medium text-lg">
                            {nativeTotal.toFixed(3)} {nativeSymbol}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground">
                            Total Contract Value (USDT)
                          </span>
                          <span className="font-mono font-medium text-lg">
                            {usdtTotal.toFixed(3)} USDT
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">
                          Total Contract Value
                        </span>
                        <span className="font-mono font-medium text-lg">
                          {(nativeTotal + usdtTotal).toFixed(3)}{" "}
                          {nativeTotal > 0 ? nativeSymbol : "USDT"}
                        </span>
                      </div>
                    )}
                    {nativeTotal > 0 && usdtTotal > 0 ? (
                      <>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground">
                            Released so far (NATIVE)
                          </span>
                          <span className="font-mono font-medium text-emerald-600">
                            {nativeMilestones
                              .filter((m) => m.offchain_state === "released")
                              .reduce(
                                (sum, m) => sum + parseFloat(m.amount || "0"),
                                0
                              )
                              .toFixed(3)}{" "}
                            {nativeSymbol}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground">
                            Released so far (USDT)
                          </span>
                          <span className="font-mono font-medium text-emerald-600">
                            {usdtMilestones
                              .filter((m) => m.offchain_state === "released")
                              .reduce(
                                (sum, m) => sum + parseFloat(m.amount || "0"),
                                0
                              )
                              .toFixed(3)}{" "}
                            USDT
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">
                          Released so far
                        </span>
                        <span className="font-mono font-medium text-emerald-600">
                          {milestones
                            .filter((m) => m.offchain_state === "released")
                            .reduce(
                              (sum, m) => sum + parseFloat(m.amount || "0"),
                              0
                            )
                            .toFixed(3)}{" "}
                          {nativeTotal > 0 ? nativeSymbol : "USDT"}
                        </span>
                      </div>
                    )}
                  </>
                );
              })()}
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                {project.milestones && project.milestones.length > 0 ? (
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all"
                    style={{
                      width: `${(project.milestones.filter((m) => m.offchain_state === "released").length / project.milestones.length) * 100}%`,
                    }}
                  />
                ) : (
                  <div className="h-full w-0 bg-emerald-500 rounded-full" />
                )}
              </div>

              <div className="pt-4 border-t border-slate-200">
                <Button
                  variant="ghost"
                  className="w-full text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={() => handleCreateDispute()}
                  disabled={loadingStates.createDispute || isAnyActionLoading()}
                >
                  {loadingStates.createDispute ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />{" "}
                      Creating...
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="h-4 w-4 mr-2" /> Raise Dispute
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Chat/Activity Placeholder */}
          <Card className=" h-64 flex flex-col">
            <CardHeader className="pb-2 border-b border-slate-200">
              <CardTitle className="text-sm">Activity</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto pt-4 space-y-4">
              <div className="text-xs text-muted-foreground text-center">
                Today
              </div>
              <div className="flex gap-2">
                <div className="h-6 w-6 rounded-full bg-blue-200" />
                <div className="bg-white/50 p-2 rounded-r-lg rounded-bl-lg text-sm max-w-[80%]">
                  Submitting the UI mocks for review.
                </div>
              </div>
            </CardContent>
            <div className="p-3 border-t border-slate-200">
              <div className="relative">
                <input
                  className="w-full bg-muted/50 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-accent"
                  placeholder="Type a message..."
                />
                <Send className="absolute right-3 top-2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
