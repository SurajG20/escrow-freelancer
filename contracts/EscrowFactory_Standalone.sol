// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// OpenZeppelin IERC20 Interface (included inline)
interface IERC20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address to, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

// OpenZeppelin SafeERC20 Library (included inline)
library SafeERC20 {
    function safeTransfer(IERC20 token, address to, uint256 value) internal {
        (bool success, bytes memory data) = address(token).call(abi.encodeWithSelector(token.transfer.selector, to, value));
        require(success && (data.length == 0 || abi.decode(data, (bool))), "SafeERC20: transfer failed");
    }

    function safeTransferFrom(IERC20 token, address from, address to, uint256 value) internal {
        (bool success, bytes memory data) = address(token).call(abi.encodeWithSelector(token.transferFrom.selector, from, to, value));
        require(success && (data.length == 0 || abi.decode(data, (bool))), "SafeERC20: transferFrom failed");
    }
}

// OpenZeppelin Ownable (included inline)
abstract contract Ownable {
    address private _owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    constructor(address initialOwner) {
        _transferOwnership(initialOwner);
    }

    modifier onlyOwner() {
        _checkOwner();
        _;
    }

    function owner() public view virtual returns (address) {
        return _owner;
    }

    function _checkOwner() internal view virtual {
        require(owner() == msg.sender, "Ownable: caller is not the owner");
    }

    function _transferOwnership(address newOwner) internal virtual {
        address oldOwner = _owner;
        _owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }
}

// OpenZeppelin ReentrancyGuard (included inline)
abstract contract ReentrancyGuard {
    uint256 private constant _NOT_ENTERED = 1;
    uint256 private constant _ENTERED = 2;
    uint256 private _status;

    constructor() {
        _status = _NOT_ENTERED;
    }

    modifier nonReentrant() {
        require(_status != _ENTERED, "ReentrancyGuard: reentrant call");
        _status = _ENTERED;
        _;
        _status = _NOT_ENTERED;
    }
}

// Escrow Contract (included inline for factory)
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
        bool isNative;
        MilestoneStatus status;
        bool exists;
    }

    address public client;
    address public freelancer;
    address public usdtToken;
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
        address _owner,
        uint256[] memory _milestoneAmounts,
        bool[] memory _milestoneIsNative
    ) Ownable(_owner) {
        require(_client != address(0), "Invalid client address");
        require(_freelancer != address(0), "Invalid freelancer address");
        require(_owner != address(0), "Invalid owner address");
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

    function deposit() external payable onlyClient nonReentrant notCancelled {
        require(msg.value > 0 || totalDepositedNative == 0, "Must deposit native tokens");
        
        uint256 nativeAmount = msg.value;
        totalDepositedNative += nativeAmount;

        emit FundsDeposited(msg.sender, nativeAmount, 0);
    }

    function depositUSDT(uint256 amount) external onlyClient nonReentrant notCancelled {
        require(amount > 0, "Amount must be greater than 0");
        require(usdtToken != address(0), "USDT token not set");

        IERC20(usdtToken).safeTransferFrom(msg.sender, address(this), amount);
        totalDepositedUSDT += amount;

        emit FundsDeposited(msg.sender, 0, amount);
    }

    function submitMilestone(uint256 milestoneIndex) external onlyFreelancer notCancelled notDisputed {
        require(milestoneIndex < milestones.length, "Invalid milestone index");
        Milestone storage milestone = milestones[milestoneIndex];
        require(milestone.status == MilestoneStatus.AwaitingSubmission, "Milestone not awaiting submission");

        milestone.status = MilestoneStatus.Submitted;
        emit MilestoneSubmitted(milestoneIndex);
    }

    function approveMilestone(uint256 milestoneIndex) external onlyClient notCancelled notDisputed {
        require(milestoneIndex < milestones.length, "Invalid milestone index");
        Milestone storage milestone = milestones[milestoneIndex];
        require(milestone.status == MilestoneStatus.Submitted, "Milestone must be submitted first");

        milestone.status = MilestoneStatus.Approved;
        emit MilestoneApproved(milestoneIndex);
    }

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

    function cancel() external onlyClient nonReentrant {
        require(!isCancelled, "Already cancelled");
        isCancelled = true;

        if (totalDepositedNative > 0) {
            (bool success, ) = payable(client).call{value: totalDepositedNative}("");
            require(success, "Refund failed");
            totalDepositedNative = 0;
        }

        if (totalDepositedUSDT > 0 && usdtToken != address(0)) {
            IERC20(usdtToken).safeTransfer(client, totalDepositedUSDT);
            totalDepositedUSDT = 0;
        }

        emit ProjectCancelled();
    }

    function raiseDispute() external onlyParties notCancelled {
        require(!isDisputed, "Dispute already raised");
        isDisputed = true;
        emit DisputeRaised();
    }

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

    function resolveDisputeAll(bool releaseToFreelancer) external onlyOwner {
        require(isDisputed, "No active dispute");
        address to = releaseToFreelancer ? freelancer : client;
        for (uint256 i = 0; i < milestones.length; i++) {
            Milestone storage m = milestones[i];
            if (m.status == MilestoneStatus.Released) continue;
            m.status = MilestoneStatus.Released;
            if (m.isNative) {
                require(totalDepositedNative >= m.amount, "Insufficient native balance");
                totalDepositedNative -= m.amount;
                (bool success, ) = payable(to).call{value: m.amount}("");
                require(success, "Transfer failed");
            } else {
                require(totalDepositedUSDT >= m.amount, "Insufficient USDT balance");
                totalDepositedUSDT -= m.amount;
                IERC20(usdtToken).safeTransfer(to, m.amount);
            }
            emit MilestoneReleased(i, m.amount, m.isNative);
        }
        isDisputed = false;
    }

    function getMilestoneCount() external view returns (uint256) {
        return milestones.length;
    }

    function getMilestone(uint256 index) external view returns (
        uint256 amount,
        bool isNative,
        MilestoneStatus status
    ) {
        require(index < milestones.length, "Invalid milestone index");
        Milestone memory milestone = milestones[index];
        return (milestone.amount, milestone.isNative, milestone.status);
    }

    function getBalances() external view returns (uint256 nativeBalance, uint256 usdtBalance) {
        return (address(this).balance, totalDepositedUSDT);
    }

    receive() external payable {
        totalDepositedNative += msg.value;
    }
}

// EscrowFactory Contract
contract EscrowFactory is Ownable {
    address public usdtToken;
    address[] public escrows;
    mapping(address => address[]) public userEscrows;

    event EscrowCreated(address indexed escrow, address indexed client, address indexed freelancer);

    constructor(address _usdtToken) Ownable(msg.sender) {
        usdtToken = _usdtToken;
    }

    function createEscrow(
        address _client,
        address _freelancer,
        uint256[] memory _milestoneAmounts,
        bool[] memory _milestoneIsNative
    ) external returns (address) {
        Escrow escrow = new Escrow(
            _client,
            _freelancer,
            usdtToken,
            owner(),
            _milestoneAmounts,
            _milestoneIsNative
        );

        address escrowAddress = address(escrow);
        escrows.push(escrowAddress);
        userEscrows[_client].push(escrowAddress);
        userEscrows[_freelancer].push(escrowAddress);

        emit EscrowCreated(escrowAddress, _client, _freelancer);

        return escrowAddress;
    }

    function getEscrowCount() external view returns (uint256) {
        return escrows.length;
    }

    function getUserEscrows(address user) external view returns (address[] memory) {
        return userEscrows[user];
    }

    function getAllEscrows() external view returns (address[] memory) {
        return escrows;
    }
}
