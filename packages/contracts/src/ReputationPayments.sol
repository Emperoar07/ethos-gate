// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title ReputationPayments
 * @notice Simple escrow contract for reputation-gated payments
 * @dev Used for staking, deposits, and payment escrow in Ethos Reputation Gate
 */
contract ReputationPayments is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    IERC20 public immutable usdc;
    address public treasury;
    uint256 public paymentTimeout;

    struct Stake {
        uint256 amount;
        uint256 timestamp;
        bool active;
    }

    struct Payment {
        address payer;
        address recipient;
        uint256 amount;
        uint256 timestamp;
        PaymentStatus status;
    }

    enum PaymentStatus {
        Pending,
        Completed,
        Refunded,
        Slashed
    }

    mapping(address => Stake) public stakes;
    mapping(uint256 => Payment) public payments;
    uint256 public paymentCounter;

    event Staked(address indexed user, uint256 amount, uint256 timestamp);
    event StakeWithdrawn(address indexed user, uint256 amount);
    event StakeSlashed(address indexed user, uint256 amount);

    event PaymentCreated(
        uint256 indexed paymentId,
        address indexed payer,
        address indexed recipient,
        uint256 amount
    );
    event PaymentCompleted(uint256 indexed paymentId);
    event PaymentRefunded(uint256 indexed paymentId);
    event PaymentSlashed(uint256 indexed paymentId);

    event TreasuryUpdated(address indexed newTreasury);

    constructor(address _usdc, address _treasury) Ownable(msg.sender) {
        require(_usdc != address(0), "Invalid USDC address");
        require(_treasury != address(0), "Invalid treasury address");

        usdc = IERC20(_usdc);
        treasury = _treasury;
        paymentTimeout = 7 days;
    }

    function stake(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be > 0");
        require(!stakes[msg.sender].active, "Already have active stake");

        usdc.safeTransferFrom(msg.sender, address(this), amount);

        stakes[msg.sender] = Stake({
            amount: amount,
            timestamp: block.timestamp,
            active: true
        });

        emit Staked(msg.sender, amount, block.timestamp);
    }

    function withdrawStake() external nonReentrant {
        Stake storage userStake = stakes[msg.sender];
        require(userStake.active, "No active stake");

        uint256 amount = userStake.amount;
        userStake.active = false;
        userStake.amount = 0;

        usdc.safeTransfer(msg.sender, amount);

        emit StakeWithdrawn(msg.sender, amount);
    }

    function slashStake(address user) external onlyOwner nonReentrant {
        Stake storage userStake = stakes[user];
        require(userStake.active, "No active stake");

        uint256 amount = userStake.amount;
        userStake.active = false;
        userStake.amount = 0;

        usdc.safeTransfer(treasury, amount);

        emit StakeSlashed(user, amount);
    }

    function createPayment(address recipient, uint256 amount) external nonReentrant returns (uint256) {
        require(recipient != address(0), "Invalid recipient");
        require(amount > 0, "Amount must be > 0");

        usdc.safeTransferFrom(msg.sender, address(this), amount);

        uint256 paymentId = paymentCounter++;
        payments[paymentId] = Payment({
            payer: msg.sender,
            recipient: recipient,
            amount: amount,
            timestamp: block.timestamp,
            status: PaymentStatus.Pending
        });

        emit PaymentCreated(paymentId, msg.sender, recipient, amount);
        return paymentId;
    }

    function completePayment(uint256 paymentId) external nonReentrant {
        Payment storage payment = payments[paymentId];
        require(payment.payer == msg.sender, "Only payer can complete");
        require(payment.status == PaymentStatus.Pending, "Payment not pending");

        payment.status = PaymentStatus.Completed;

        usdc.safeTransfer(payment.recipient, payment.amount);

        emit PaymentCompleted(paymentId);
    }

    function refundPayment(uint256 paymentId) external nonReentrant {
        Payment storage payment = payments[paymentId];
        require(payment.payer == msg.sender, "Only payer can refund");
        require(payment.status == PaymentStatus.Pending, "Payment not pending");

        payment.status = PaymentStatus.Refunded;

        usdc.safeTransfer(payment.payer, payment.amount);

        emit PaymentRefunded(paymentId);
    }

    function slashPayment(uint256 paymentId) external onlyOwner nonReentrant {
        Payment storage payment = payments[paymentId];
        require(payment.status == PaymentStatus.Pending, "Payment not pending");

        payment.status = PaymentStatus.Slashed;

        usdc.safeTransfer(treasury, payment.amount);

        emit PaymentSlashed(paymentId);
    }

    function claimExpiredPayment(uint256 paymentId) external nonReentrant {
        Payment storage payment = payments[paymentId];
        require(payment.status == PaymentStatus.Pending, "Payment not pending");
        require(payment.recipient == msg.sender, "Only recipient can claim");
        require(block.timestamp >= payment.timestamp + paymentTimeout, "Payment not expired");

        payment.status = PaymentStatus.Completed;
        usdc.safeTransfer(payment.recipient, payment.amount);

        emit PaymentCompleted(paymentId);
    }

    function refundExpiredPayment(uint256 paymentId) external nonReentrant {
        Payment storage payment = payments[paymentId];
        require(payment.status == PaymentStatus.Pending, "Payment not pending");
        require(payment.payer == msg.sender, "Only payer can refund");
        require(block.timestamp >= payment.timestamp + paymentTimeout, "Payment not expired");

        payment.status = PaymentStatus.Refunded;
        usdc.safeTransfer(payment.payer, payment.amount);

        emit PaymentRefunded(paymentId);
    }

    function updateTreasury(address newTreasury) external onlyOwner {
        require(newTreasury != address(0), "Invalid address");
        treasury = newTreasury;
        emit TreasuryUpdated(newTreasury);
    }

    function updatePaymentTimeout(uint256 newTimeout) external onlyOwner {
        require(newTimeout > 0, "Invalid timeout");
        paymentTimeout = newTimeout;
    }

    function getStake(address user) external view returns (Stake memory) {
        return stakes[user];
    }

    function getPayment(uint256 paymentId) external view returns (Payment memory) {
        return payments[paymentId];
    }

    function hasActiveStake(address user) external view returns (bool) {
        return stakes[user].active;
    }
}
