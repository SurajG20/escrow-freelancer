export function getUserFriendlyError(error: unknown): string {
  if (!error) {
    return "An unexpected error occurred. Please try again.";
  }

  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorString = errorMessage.toLowerCase();

  if (
    errorString.includes("user rejected") ||
    errorString.includes("user denied") ||
    errorString.includes("user cancelled") ||
    errorString.includes("rejected the request")
  ) {
    return "Transaction was cancelled. Please try again when ready.";
  }

  if (
    errorString.includes("insufficient funds") ||
    errorString.includes("insufficient balance") ||
    errorString.includes("balance too low")
  ) {
    return "Insufficient balance. Please ensure you have enough funds for the transaction and gas fees.";
  }

  if (
    errorString.includes("network") ||
    errorString.includes("rpc") ||
    errorString.includes("connection") ||
    errorString.includes("fetch")
  ) {
    return "Network error. Please check your internet connection and try again.";
  }

  if (
    errorString.includes("wrong network") ||
    errorString.includes("unsupported chain") ||
    errorString.includes("chain id")
  ) {
    return "Please switch to the correct network (BSC Testnet or BSC Mainnet) in your wallet.";
  }

  if (
    errorString.includes("contract") &&
    (errorString.includes("not found") ||
      errorString.includes("does not exist"))
  ) {
    return "Contract address not found. Please verify the contract is deployed correctly.";
  }

  if (
    errorString.includes("gas") ||
    errorString.includes("out of gas") ||
    errorString.includes("gas required exceeds")
  ) {
    return "Transaction failed due to gas issues. Please try again or increase gas limit.";
  }

  if (
    errorString.includes("revert") ||
    errorString.includes("execution reverted")
  ) {
    // Try to extract the revert reason
    const revertMatch = errorMessage.match(/revert\s+(.+)/i);
    if (revertMatch) {
      return `Transaction failed: ${revertMatch[1]}`;
    }
    return "Transaction failed. Please check that all conditions are met and try again.";
  }

  if (
    errorString.includes("wallet not connected") ||
    errorString.includes("no wallet") ||
    errorString.includes("connect your wallet")
  ) {
    return "Please connect your wallet to continue.";
  }

  if (errorString.includes("timeout") || errorString.includes("timed out")) {
    return "Transaction timed out. Please try again.";
  }

  if (
    errorString.includes("abi") ||
    errorString.includes("function not found")
  ) {
    return "Contract configuration error. Please contact support.";
  }

  if (
    errorString.includes("only client") ||
    errorString.includes("only freelancer")
  ) {
    return "You don't have permission to perform this action.";
  }

  if (errorString.includes("milestone must be")) {
    return "Invalid milestone state. Please check the milestone status.";
  }

  if (
    errorString.includes("project is cancelled") ||
    errorString.includes("project is in dispute")
  ) {
    return "This project cannot be modified in its current state.";
  }

  return errorMessage.length > 200
    ? "An error occurred. Please check the console for details."
    : errorMessage;
}
