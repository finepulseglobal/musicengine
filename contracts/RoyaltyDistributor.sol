// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract RoyaltyDistributor {
    
    struct RoyaltyPool {
        uint256 workId;
        uint256 totalAmount;
        uint256 distributedAmount;
        mapping(address => uint256) creatorShares;
        mapping(address => uint256) claimedAmounts;
        address[] creators;
        bool isActive;
    }
    
    struct PaymentSchedule {
        uint256 workId;
        address payer;
        uint256 amount;
        uint256 frequency; // seconds between payments
        uint256 nextPayment;
        uint256 remainingPayments;
        bool isActive;
    }
    
    uint256 private _poolIdCounter;
    uint256 private _scheduleIdCounter;
    
    mapping(uint256 => RoyaltyPool) public royaltyPools;
    mapping(uint256 => PaymentSchedule) public paymentSchedules;
    mapping(uint256 => uint256[]) public workPools;
    mapping(address => uint256[]) public creatorPools;
    
    address public copyrightRegistry;
    
    event RoyaltyPoolCreated(uint256 indexed poolId, uint256 indexed workId, uint256 amount);
    event RoyaltyDistributed(uint256 indexed poolId, address indexed creator, uint256 amount);
    event PaymentScheduleCreated(uint256 indexed scheduleId, uint256 indexed workId, address indexed payer);
    event ScheduledPaymentExecuted(uint256 indexed scheduleId, uint256 amount);
    
    constructor(address _copyrightRegistry) {
        copyrightRegistry = _copyrightRegistry;
    }
    
    function createRoyaltyPool(
        uint256 workId,
        address[] memory creators,
        uint256[] memory shares
    ) external payable returns (uint256) {
        require(msg.value > 0, "Payment required");
        require(creators.length > 0, "Creators required");
        require(creators.length == shares.length, "Length mismatch");
        require(_validateShares(shares), "Invalid shares");
        
        uint256 poolId = ++_poolIdCounter;
        
        RoyaltyPool storage pool = royaltyPools[poolId];
        pool.workId = workId;
        pool.totalAmount = msg.value;
        pool.distributedAmount = 0;
        pool.creators = creators;
        pool.isActive = true;
        
        for (uint i = 0; i < creators.length; i++) {
            pool.creatorShares[creators[i]] = shares[i];
            creatorPools[creators[i]].push(poolId);
        }
        
        workPools[workId].push(poolId);
        
        emit RoyaltyPoolCreated(poolId, workId, msg.value);
        return poolId;
    }
    
    function claimRoyalty(uint256 poolId) external {
        RoyaltyPool storage pool = royaltyPools[poolId];
        require(pool.isActive, "Pool not active");
        require(pool.creatorShares[msg.sender] > 0, "Not a creator");
        
        uint256 totalShare = (pool.totalAmount * pool.creatorShares[msg.sender]) / 10000;
        uint256 claimableAmount = totalShare - pool.claimedAmounts[msg.sender];
        
        require(claimableAmount > 0, "Nothing to claim");
        
        pool.claimedAmounts[msg.sender] += claimableAmount;
        pool.distributedAmount += claimableAmount;
        
        payable(msg.sender).transfer(claimableAmount);
        
        emit RoyaltyDistributed(poolId, msg.sender, claimableAmount);
    }
    
    function createPaymentSchedule(
        uint256 workId,
        uint256 paymentAmount,
        uint256 frequency,
        uint256 totalPayments
    ) external returns (uint256) {
        require(paymentAmount > 0, "Payment amount required");
        require(frequency > 0, "Frequency required");
        require(totalPayments > 0, "Total payments required");
        
        uint256 scheduleId = ++_scheduleIdCounter;
        
        paymentSchedules[scheduleId] = PaymentSchedule({
            workId: workId,
            payer: msg.sender,
            amount: paymentAmount,
            frequency: frequency,
            nextPayment: block.timestamp + frequency,
            remainingPayments: totalPayments,
            isActive: true
        });
        
        emit PaymentScheduleCreated(scheduleId, workId, msg.sender);
        return scheduleId;
    }
    
    function executeScheduledPayment(uint256 scheduleId) external payable {
        PaymentSchedule storage schedule = paymentSchedules[scheduleId];
        require(schedule.isActive, "Schedule not active");
        require(block.timestamp >= schedule.nextPayment, "Payment not due");
        require(msg.value >= schedule.amount, "Insufficient payment");
        require(msg.sender == schedule.payer, "Only payer can execute");
        
        // Get work creators from registry
        (bool success, bytes memory data) = copyrightRegistry.call(
            abi.encodeWithSignature("getWork(uint256)", schedule.workId)
        );
        require(success, "Failed to get work info");
        
        // Distribute payment (simplified - would need proper decoding)
        schedule.nextPayment = block.timestamp + schedule.frequency;
        schedule.remainingPayments--;
        
        if (schedule.remainingPayments == 0) {
            schedule.isActive = false;
        }
        
        emit ScheduledPaymentExecuted(scheduleId, msg.value);
    }
    
    function getClaimableAmount(uint256 poolId, address creator) external view returns (uint256) {
        RoyaltyPool storage pool = royaltyPools[poolId];
        if (!pool.isActive || pool.creatorShares[creator] == 0) return 0;
        
        uint256 totalShare = (pool.totalAmount * pool.creatorShares[creator]) / 10000;
        return totalShare - pool.claimedAmounts[creator];
    }
    
    function getPoolInfo(uint256 poolId) external view returns (
        uint256 workId,
        uint256 totalAmount,
        uint256 distributedAmount,
        address[] memory creators,
        bool isActive
    ) {
        RoyaltyPool storage pool = royaltyPools[poolId];
        return (
            pool.workId,
            pool.totalAmount,
            pool.distributedAmount,
            pool.creators,
            pool.isActive
        );
    }
    
    function getCreatorPools(address creator) external view returns (uint256[] memory) {
        return creatorPools[creator];
    }
    
    function _validateShares(uint256[] memory shares) private pure returns (bool) {
        uint256 total = 0;
        for (uint i = 0; i < shares.length; i++) {
            total += shares[i];
        }
        return total == 10000;
    }
}