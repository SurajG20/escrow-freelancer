// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title Escrow
 * @dev Escrow contract for milestone-based payments
 */
contract Escrow is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;

    enum MilestoneStatus {
        AwaitingSubmission,
        Submitted,
        Approved,
        Released,
        Disputed
    }

    struct Milestone {
        uint256 amount;
        bool isNative; // true for NATIVE (BNB), false for USDT
        MilestoneStatus status;
        bool exists;
    }

    address public client;
    address public freelancer;
    address public usdtToken; // USDT token address
    bool public isCancelled;
    bool public isDisputed;

    Milestone[] public milestones;
    uint256 public totalDepositedNative;
    uint256 public totalDepositedUSDT;

    event MilestoneCreated(uint256 indexed milestoneIndex, uint256 amount, bool isNative);
    event FundsDeposited(address indexed depositor, uint256 nativeAmount, uint256 usdtAmount);
    event MilestoneSubmitted(uint256 indexed milestoneIndex);
    event MilestoneApproved(uint256 indexed milestoneIndex);
    event MilestoneReleased(uint256 indexed milestoneIndex, uint256 amount, bool isNative);
    event ProjectCancelled();
    event DisputeRaised();

    modifier onlyClient() {
        require(msg.sender == client, "Only client can call this");
        _;
    }

    modifier onlyFreelancer() {
        require(msg.sender == freelancer, "Only freelancer can call this");
        _;
    }

    modifier onlyParties() {
        require(msg.sender == client || msg.sender == freelancer, "Only client or freelancer");
        _;
    }

    modifier notCancelled() {
        require(!isCancelled, "Project is cancelled");
        _;
    }

    modifier notDisputed() {
        require(!isDisputed, "Project is in dispute");
        _;
    }

    constructor(
        address _client,
        address _freelancer,
        address _usdtToken,
        uint256[] memory _milestoneAmounts,
        bool[] memory _milestoneIsNative
    ) Ownable(msg.sender) {
        require(_client != address(0), "Invalid client address");
        require(_freelancer != address(0), "Invalid freelancer address");
        require(_milestoneAmounts.length == _milestoneIsNative.length, "Array length mismatch");
        require(_milestoneAmounts.length > 0, "Must have at least one milestone");

        client = _client;
        freelancer = _freelancer;
        usdtToken = _usdtToken;

        for (uint256 i = 0; i < _milestoneAmounts.length; i++) {
            require(_milestoneAmounts[i] > 0, "Milestone amount must be greater than 0");
            milestones.push(Milestone({
                amount: _milestoneAmounts[i],
                isNative: _milestoneIsNative[i],
                status: MilestoneStatus.AwaitingSubmission,
                exists: true
            }));

            emit MilestoneCreated(i, _milestoneAmounts[i], _milestoneIsNative[i]);
        }
    }

    /**
     * @dev Deposit funds into escrow (both NATIVE and USDT)
     */
    function deposit() external payable onlyClient nonReentrant notCancelled {
        require(msg.value > 0 || totalDepositedNative == 0, "Must deposit native tokens");
        
        uint256 nativeAmount = msg.value;
        totalDepositedNative += nativeAmount;

        emit FundsDeposited(msg.sender, nativeAmount, 0);
    }

    /**
     * @dev Deposit USDT tokens into escrow
     */
    function depositUSDT(uint256 amount) external onlyClient nonReentrant notCancelled {
        require(amount > 0, "Amount must be greater than 0");
        require(usdtToken != address(0), "USDT token not set");

        IERC20(usdtToken).safeTransferFrom(msg.sender, address(this), amount);
        totalDepositedUSDT += amount;

        emit FundsDeposited(msg.sender, 0, amount);
    }

    /**
     * @dev Freelancer submits work for a milestone
     */
    function submitMilestone(uint256 milestoneIndex) external onlyFreelancer notCancelled notDisputed {
        require(milestoneIndex < milestones.length, "Invalid milestone index");
        Milestone storage milestone = milestones[milestoneIndex];
        require(milestone.status == MilestoneStatus.AwaitingSubmission, "Milestone not awaiting submission");

        milestone.status = MilestoneStatus.Submitted;
        emit MilestoneSubmitted(milestoneIndex);
    }

    /**
     * @dev Client approves a milestone
     */
    function approveMilestone(uint256 milestoneIndex) external onlyClient notCancelled notDisputed {
        require(milestoneIndex < milestones.length, "Invalid milestone index");
        Milestone storage milestone = milestones[milestoneIndex];
        require(milestone.status == MilestoneStatus.Submitted, "Milestone must be submitted first");

        milestone.status = MilestoneStatus.Approved;
        emit MilestoneApproved(milestoneIndex);
    }

    /**
     * @dev Release funds for an approved milestone
     */
    function releaseMilestone(uint256 milestoneIndex) external onlyClient nonReentrant notCancelled notDisputed {
        require(milestoneIndex < milestones.length, "Invalid milestone index");
        Milestone storage milestone = milestones[milestoneIndex];
        require(milestone.status == MilestoneStatus.Approved, "Milestone must be approved first");

        milestone.status = MilestoneStatus.Released;

        if (milestone.isNative) {
            require(totalDepositedNative >= milestone.amount, "Insufficient native balance");
            totalDepositedNative -= milestone.amount;
            (bool success, ) = payable(freelancer).call{value: milestone.amount}("");
            require(success, "Transfer failed");
        } else {
            require(totalDepositedUSDT >= milestone.amount, "Insufficient USDT balance");
            totalDepositedUSDT -= milestone.amount;
            IERC20(usdtToken).safeTransfer(freelancer, milestone.amount);
        }

        emit MilestoneReleased(milestoneIndex, milestone.amount, milestone.isNative);
    }

    /**
     * @dev Cancel project and refund remaining funds to client
     */
    function cancel() external onlyClient nonReentrant {
        require(!isCancelled, "Already cancelled");
        isCancelled = true;

        // Refund native tokens
        if (totalDepositedNative > 0) {
            (bool success, ) = payable(client).call{value: totalDepositedNative}("");
            require(success, "Refund failed");
            totalDepositedNative = 0;
        }

        // Refund USDT
        if (totalDepositedUSDT > 0 && usdtToken != address(0)) {
            IERC20(usdtToken).safeTransfer(client, totalDepositedUSDT);
            totalDepositedUSDT = 0;
        }

        emit ProjectCancelled();
    }

    /**
     * @dev Raise a dispute (can be called by either party)
     */
    function raiseDispute() external onlyParties notCancelled {
        require(!isDisputed, "Dispute already raised");
        isDisputed = true;
        emit DisputeRaised();
    }

    /**
     * @dev Resolve dispute and release funds (only owner/arbitrator)
     */
    function resolveDispute(uint256 milestoneIndex, bool releaseToFreelancer) external onlyOwner {
        require(isDisputed, "No active dispute");
        require(milestoneIndex < milestones.length, "Invalid milestone index");
        
        Milestone storage milestone = milestones[milestoneIndex];
        require(milestone.status != MilestoneStatus.Released, "Milestone already released");

        if (releaseToFreelancer) {
            milestone.status = MilestoneStatus.Released;
            if (milestone.isNative) {
                require(totalDepositedNative >= milestone.amount, "Insufficient native balance");
                totalDepositedNative -= milestone.amount;
                (bool success, ) = payable(freelancer).call{value: milestone.amount}("");
                require(success, "Transfer failed");
            } else {
                require(totalDepositedUSDT >= milestone.amount, "Insufficient USDT balance");
                totalDepositedUSDT -= milestone.amount;
                IERC20(usdtToken).safeTransfer(freelancer, milestone.amount);
            }
            emit MilestoneReleased(milestoneIndex, milestone.amount, milestone.isNative);
        } else {
            // Refund to client
            if (milestone.isNative) {
                require(totalDepositedNative >= milestone.amount, "Insufficient native balance");
                totalDepositedNative -= milestone.amount;
                (bool success, ) = payable(client).call{value: milestone.amount}("");
                require(success, "Refund failed");
            } else {
                require(totalDepositedUSDT >= milestone.amount, "Insufficient USDT balance");
                totalDepositedUSDT -= milestone.amount;
                IERC20(usdtToken).safeTransfer(client, milestone.amount);
            }
        }

        isDisputed = false;
    }

    /**
     * @dev Get milestone count
     */
    function getMilestoneCount() external view returns (uint256) {
        return milestones.length;
    }

    /**
     * @dev Get milestone details
     */
    function getMilestone(uint256 index) external view returns (
        uint256 amount,
        bool isNative,
        MilestoneStatus status
    ) {
        require(index < milestones.length, "Invalid milestone index");
        Milestone memory milestone = milestones[index];
        return (milestone.amount, milestone.isNative, milestone.status);
    }

    /**
     * @dev Get contract balances
     */
    function getBalances() external view returns (uint256 nativeBalance, uint256 usdtBalance) {
        return (address(this).balance, totalDepositedUSDT);
    }

    // Allow contract to receive native tokens
    receive() external payable {
        totalDepositedNative += msg.value;
    }
}

