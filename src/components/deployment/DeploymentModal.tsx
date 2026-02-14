"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/Button";
import { Progress } from "@/components/ui/Progress";
import {
  X,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  FileText,
  Zap,
} from "lucide-react";
import { estimateDeployGas, type DeployGasEstimate } from "@/lib/contracts/deploy";
import type { ChainConfig } from "@/lib/config/chains";
import type { Project, Milestone } from "@/types";
import { cn } from "@/lib/utils";

export type DeploymentStep =
  | "idle"
  | "estimating"
  | "deploying"
  | "depositing"
  | "updating"
  | "success"
  | "error";

export interface DeploymentProgress {
  step: DeploymentStep;
  contractAddress?: string;
  transactionHash?: string;
  deployTransactionHash?: string;
  error?: string;
}

type ProjectWithMilestones = Project & { milestones: Milestone[] };

interface DeploymentModalProps {
  open: boolean;
  onClose: () => void;
  project: ProjectWithMilestones;
  chainConfig: ChainConfig | null;
  onDeploy: (onProgress: (p: DeploymentProgress) => void) => Promise<void>;
  walletClient: unknown;
}

const STEP_LABELS: Record<DeploymentStep, string> = {
  idle: "Ready",
  estimating: "Estimating gas...",
  deploying: "Deploying escrow contract...",
  depositing: "Depositing funds...",
  updating: "Updating project...",
  success: "Deployment complete",
  error: "Deployment failed",
};

function getStepIndex(step: DeploymentStep): number {
  const order: DeploymentStep[] = [
    "idle",
    "estimating",
    "deploying",
    "depositing",
    "updating",
    "success",
  ];
  const i = order.indexOf(step);
  return step === "error" ? -1 : Math.max(0, i);
}

export function DeploymentModal({
  open,
  onClose,
  project,
  chainConfig,
  onDeploy,
  walletClient,
}: DeploymentModalProps) {
  const [gasEstimate, setGasEstimate] = useState<DeployGasEstimate | null>(null);
  const [gasLoading, setGasLoading] = useState(false);
  const [phase, setPhase] = useState<"preview" | "deploying" | "success" | "error">("preview");
  const [progress, setProgress] = useState<DeploymentProgress>({ step: "idle" });
  const [deploying, setDeploying] = useState(false);

  useEffect(() => {
    if (!open || !project?.milestones?.length || !walletClient) return;
    setPhase("preview");
    setProgress({ step: "idle" });
    setGasEstimate(null);
    setGasLoading(true);
    const config = {
      clientWallet: project.client_wallet,
      freelancerWallet: project.freelancer_wallet || "",
      milestones: project.milestones.map((m) => ({ amount: m.amount, currency: m.currency })),
      chainId: project.chain_id,
    };
    estimateDeployGas(config, walletClient as import("viem").WalletClient)
      .then((est) => setGasEstimate(est))
      .finally(() => setGasLoading(false));
  }, [open, project?.id, project?.client_wallet, project?.freelancer_wallet, project?.milestones, project?.chain_id, walletClient]);

  const handleDeploy = async () => {
    setDeploying(true);
    setPhase("deploying");
    setProgress({ step: "deploying" });
    try {
      await onDeploy(setProgress);
      setPhase("success");
    } catch (e) {
      setProgress({
        step: "error",
        error: e instanceof Error ? e.message : "Deployment failed",
      });
      setPhase("error");
    } finally {
      setDeploying(false);
    }
  };

  const handleClose = () => {
    if (!deploying) onClose();
  };

  const nativeTotal = (project?.milestones || [])
    .filter((m) => m.currency === "NATIVE")
    .reduce((sum, m) => sum + parseFloat(m.amount || "0"), 0);
  const usdtTotal = (project?.milestones || [])
    .filter((m) => m.currency === "USDT")
    .reduce((sum, m) => sum + parseFloat(m.amount || "0"), 0);
  const nativeSymbol = chainConfig?.nativeSymbol || "NATIVE";
  const explorerUrl = chainConfig?.blockExplorerUrl || "https://bscscan.com";
  const stepIndex = getStepIndex(progress.step);
  const progressPercent = phase === "deploying" ? (stepIndex / 4) * 100 : phase === "success" ? 100 : 0;

  if (!open) return null;

  const content = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div
        className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold">
            {phase === "preview" && "Deploy Escrow"}
            {phase === "deploying" && "Deploying..."}
            {phase === "success" && "Deployment Complete"}
            {phase === "error" && "Deployment Failed"}
          </h2>
          <button
            type="button"
            onClick={handleClose}
            disabled={deploying}
            className="p-1 rounded-lg text-muted-foreground hover:bg-slate-100 disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {phase === "preview" && (
            <>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <FileText className="h-4 w-4" /> Milestones
                </div>
                <ul className="rounded-lg border border-slate-200 divide-y divide-slate-100">
                  {(project.milestones || []).map((m, i) => (
                    <li
                      key={m.id}
                      className="flex justify-between items-center px-3 py-2 text-sm"
                    >
                      <span className="truncate pr-2">
                        {i + 1}. {m.title || `Milestone ${i + 1}`}
                      </span>
                      <span className="font-mono shrink-0">
                        {m.amount} {m.currency === "NATIVE" ? nativeSymbol : "USDT"}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total (NATIVE)</span>
                <span className="font-mono font-medium">
                  {nativeTotal > 0 ? `${nativeTotal.toFixed(3)} ${nativeSymbol}` : "—"}
                </span>
              </div>
              {usdtTotal > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total (USDT)</span>
                  <span className="font-mono font-medium">{usdtTotal.toFixed(3)} USDT</span>
                </div>
              )}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
                <Zap className="h-4 w-4 text-amber-500" />
                <span className="text-sm text-muted-foreground">Estimated gas</span>
                {gasLoading && (
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                )}
                {!gasLoading && gasEstimate && (
                  <span className="font-mono text-sm">
                    ~{Number(gasEstimate.estimatedCostFormatted).toFixed(4)} {gasEstimate.nativeSymbol}{" "}
                    <span className="text-muted-foreground">
                      ({gasEstimate.gasFormatted} gas)
                    </span>
                  </span>
                )}
                {!gasLoading && !gasEstimate && (
                  <span className="text-sm text-muted-foreground">Unable to estimate</span>
                )}
              </div>
              <div className="flex gap-3 pt-2">
                <Button variant="outline" onClick={handleClose} className="flex-1">
                  Cancel
                </Button>
                <Button
                  onClick={handleDeploy}
                  disabled={deploying || gasLoading}
                  className="flex-1 gap-2"
                >
                  {deploying ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Deploying...
                    </>
                  ) : (
                    "Deploy & Deposit"
                  )}
                </Button>
              </div>
            </>
          )}

          {phase === "deploying" && (
            <>
              <Progress value={progressPercent} max={100} className="h-2" />
              <div className="space-y-2 text-sm">
                {(["deploying", "depositing", "updating"] as const).map((step, i) => (
                  <div
                    key={step}
                    className={cn(
                      "flex items-center gap-2",
                      progress.step === step && "font-medium"
                    )}
                  >
                    {getStepIndex(progress.step) > getStepIndex(step) ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    ) : progress.step === step ? (
                      <Loader2 className="h-4 w-4 animate-spin text-accent shrink-0" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border-2 border-slate-200 shrink-0" />
                    )}
                    <span>{STEP_LABELS[step]}</span>
                  </div>
                ))}
              </div>
              {progress.contractAddress && (
                <div className="rounded-lg bg-slate-50 p-3 text-xs font-mono break-all">
                  Contract: {progress.contractAddress}
                </div>
              )}
              {progress.deployTransactionHash && (
                <div className="rounded-lg bg-slate-50 p-3 text-xs font-mono break-all">
                  Deploy tx: {progress.deployTransactionHash}
                </div>
              )}
            </>
          )}

          {phase === "success" && progress.contractAddress && (
            <>
              <div className="flex items-center gap-2 text-emerald-600">
                <CheckCircle2 className="h-5 w-5" />
                <span className="font-medium">Escrow deployed and funded</span>
              </div>
              <div className="rounded-lg border border-slate-200 p-3 space-y-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Contract address</span>
                  <p className="font-mono break-all mt-0.5">{progress.contractAddress}</p>
                </div>
                {progress.deployTransactionHash && (
                  <div>
                    <span className="text-muted-foreground">Transaction</span>
                    <p className="font-mono break-all mt-0.5">
                      {progress.deployTransactionHash}
                    </p>
                  </div>
                )}
              </div>
              <div className="flex gap-3">
                <a
                  href={`${explorerUrl}/address/${progress.contractAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <Button variant="outline" className="w-full gap-2">
                    <ExternalLink className="h-4 w-4" />
                    View on Explorer
                  </Button>
                </a>
                <Button onClick={handleClose} className="flex-1">
                  Close
                </Button>
              </div>
            </>
          )}

          {phase === "error" && (
            <>
              <div className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                <span className="font-medium">Deployment failed</span>
              </div>
              {progress.error && (
                <p className="text-sm text-muted-foreground rounded-lg bg-red-50 p-3 text-red-800">
                  {progress.error}
                </p>
              )}
              <Button onClick={handleClose} className="w-full">
                Close
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );

  return typeof document !== "undefined"
    ? createPortal(content, document.body)
    : null;
}
