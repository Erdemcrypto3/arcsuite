// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title ArcPoll
 * @notice Paid opinion polling platform for Arc L1.
 *         Projects pay to poll categorized wallet holders.
 *         Users earn soulbound points for responding.
 *
 *         MVP: Polls are shown to all matching wallets via frontend
 *         category matching — no per-wallet record generation needed.
 *         Users respond directly if their categories match.
 *
 * @dev Audit fixes applied (kimi_audit_v01, 2026-04-19):
 *      C-01: nonReentrant on approvePoll/rejectPoll
 *      H-02: O(1) audience size via category counters
 *      H-03: getLeaderboard removed (off-chain indexing)
 *      M-02: Events for all state changes
 *      M-03: MAX_POLL_DURATION deadline cap
 *      M-04: String length validation
 *      L-01: Comment fix (Ink → Arc)
 *      L-04: Pausable added
 *      L-05: Zero-address checks
 */
contract ArcPoll is Ownable, ReentrancyGuard, Pausable {
    // ──────────────────── Types ────────────────────

    enum PollStatus { PENDING, ACTIVE, REJECTED, CLOSED }

    struct UserProfile {
        bool registered;
        uint256 points;
        uint256 streak;
        uint256 lastResponseTime;
        uint32 categoryMask; // bitmask for up to 32 categories
        uint256 registeredAt;
    }

    struct Poll {
        address sender;
        string contentCID;       // Walrus blob ID for full body
        string[] options;
        uint32 targetCategory;   // category bitmask to match
        uint256 deadline;
        uint256 createdAt;
        PollStatus status;
        uint256 totalResponses;
        uint256 payment;         // USDC amount paid
    }

    // ──────────────────── Constants ────────────────────

    uint256 public constant MAX_POLL_DURATION = 30 days;         // [M-03]
    uint256 public constant MAX_STRING_LENGTH = 512;             // [M-04]
    uint256 public constant MAX_CID_LENGTH = 128;                // [M-04]

    uint256 public constant POINTS_REGISTER = 50;
    uint256 public constant POINTS_RESPOND = 10;
    uint256 public constant POINTS_EARLY_BIRD = 15;
    uint256 public constant POINTS_STREAK_BONUS = 20;
    uint256 public constant STREAK_THRESHOLD = 10;

    // ──────────────────── State ────────────────────

    IERC20 public paymentToken;  // USDC on Arc [L-01]
    address public treasury;

    // Category names (index → name) for frontend reference
    // NOTE: Categories are append-only by design (max 32)
    string[] public categories;

    // [H-02] O(1) audience size: category bit index → registered user count
    mapping(uint256 => uint256) public categoryUserCount;

    // Pricing tiers: maxAudience → price
    uint256[] public tierMaxAudience;
    uint256[] public tierPrice;

    // Users
    mapping(address => UserProfile) public users;
    address[] public userList;

    // Polls
    Poll[] public polls;

    // Responses: pollId → user → optionIndex (0 = not responded, actual = index + 1)
    mapping(uint256 => mapping(address => uint8)) public responses;
    // Vote counts: pollId → optionIndex → count
    mapping(uint256 => mapping(uint8 => uint256)) public optionVotes;

    // Verified senders (skip review)
    mapping(address => bool) public verifiedSenders;
    // Approved admins
    mapping(address => bool) public admins;

    // ──────────────────── Events ────────────────────

    event UserRegistered(address indexed user, uint32 categoryMask);
    event CategoriesUpdated(address indexed user, uint32 oldMask, uint32 newMask);
    event PollSubmitted(uint256 indexed pollId, address indexed sender, uint32 targetCategory, uint256 deadline);
    event PollApproved(uint256 indexed pollId);
    event PollRejected(uint256 indexed pollId);
    event PollClosed(uint256 indexed pollId);                    // [M-02]
    event PollResponse(uint256 indexed pollId, address indexed user, uint8 optionIndex);
    event PointsAwarded(address indexed user, uint256 amount, uint256 total);
    event PricingUpdated(uint256 tierCount);                     // [M-02]
    event CategoryAdded(uint256 indexed index, string name);     // [M-02]
    event TreasuryUpdated(address indexed oldTreasury, address indexed newTreasury); // [M-02]
    event PaymentTokenUpdated(address indexed oldToken, address indexed newToken);   // [M-02]

    // ──────────────────── Modifiers ────────────────────

    modifier onlyAdmin() {
        require(admins[msg.sender] || msg.sender == owner(), "Not admin");
        _;
    }

    // ──────────────────── Constructor ────────────────────

    constructor(address _paymentToken, address _treasury) Ownable(msg.sender) {
        require(_paymentToken != address(0), "Invalid token");   // [L-05]
        require(_treasury != address(0), "Invalid treasury");    // [L-05]

        paymentToken = IERC20(_paymentToken);
        treasury = _treasury;

        // Default categories
        categories.push("DeFi");           // bit 0
        categories.push("NFTs");           // bit 1
        categories.push("Gaming");         // bit 2
        categories.push("DAOs");           // bit 3
        categories.push("Infrastructure"); // bit 4
        categories.push("Social");         // bit 5
        categories.push("Trading");        // bit 6
        categories.push("Other");          // bit 7

        // Default pricing tiers
        tierMaxAudience.push(500);
        tierPrice.push(5e6);     // 5 USDC (6 decimals)
        tierMaxAudience.push(1000);
        tierPrice.push(10e6);    // 10 USDC
        tierMaxAudience.push(5000);
        tierPrice.push(25e6);    // 25 USDC
        tierMaxAudience.push(10000);
        tierPrice.push(50e6);    // 50 USDC
        tierMaxAudience.push(type(uint256).max);
        tierPrice.push(100e6);   // 100 USDC
    }

    // ──────────────────── User Functions ────────────────────

    function register(uint32 _categoryMask) external whenNotPaused {
        require(!users[msg.sender].registered, "Already registered");
        require(_categoryMask > 0, "Select at least one category");

        users[msg.sender] = UserProfile({
            registered: true,
            points: POINTS_REGISTER,
            streak: 0,
            lastResponseTime: 0,
            categoryMask: _categoryMask,
            registeredAt: block.timestamp
        });
        userList.push(msg.sender);

        // [H-02] Update category counters
        _incrementCategoryCounts(_categoryMask);

        emit UserRegistered(msg.sender, _categoryMask);
        emit PointsAwarded(msg.sender, POINTS_REGISTER, POINTS_REGISTER);
    }

    function updateCategories(uint32 _categoryMask) external whenNotPaused {
        require(users[msg.sender].registered, "Not registered");
        require(_categoryMask > 0, "Select at least one category");

        uint32 oldMask = users[msg.sender].categoryMask;
        users[msg.sender].categoryMask = _categoryMask;

        // [H-02] Update category counters
        _decrementCategoryCounts(oldMask);
        _incrementCategoryCounts(_categoryMask);

        emit CategoriesUpdated(msg.sender, oldMask, _categoryMask);
    }

    /// @notice Respond to a poll. User must be registered and categories must match.
    function respond(uint256 _pollId, uint8 _optionIndex) external whenNotPaused {
        Poll storage poll = polls[_pollId];
        require(poll.status == PollStatus.ACTIVE, "Poll not active");
        require(block.timestamp <= poll.deadline, "Deadline passed");
        require(users[msg.sender].registered, "Not registered");
        require(users[msg.sender].categoryMask & poll.targetCategory > 0, "Category mismatch");
        require(responses[_pollId][msg.sender] == 0, "Already responded");
        require(_optionIndex < poll.options.length, "Invalid option");

        // Store response (index + 1 so 0 means "not responded")
        responses[_pollId][msg.sender] = _optionIndex + 1;
        poll.totalResponses++;
        optionVotes[_pollId][_optionIndex]++;

        // Calculate points
        UserProfile storage user = users[msg.sender];
        uint256 pointsEarned = POINTS_RESPOND;

        // Early bird: responded before 50% of deadline
        uint256 halfwayPoint = poll.createdAt + (poll.deadline - poll.createdAt) / 2;
        if (block.timestamp <= halfwayPoint) {
            pointsEarned = POINTS_EARLY_BIRD;
        }

        // Streak bonus
        user.streak++;
        if (user.streak % STREAK_THRESHOLD == 0) {
            pointsEarned += POINTS_STREAK_BONUS;
        }
        user.lastResponseTime = block.timestamp;
        user.points += pointsEarned;

        emit PollResponse(_pollId, msg.sender, _optionIndex);
        emit PointsAwarded(msg.sender, pointsEarned, user.points);
    }

    // ──────────────────── Sender Functions ────────────────────

    /// @notice O(1) audience size using category counters [H-02]
    function getAudienceSize(uint32 _categoryMask) public view returns (uint256 count) {
        // Sum users across targeted categories (may overcount overlapping users,
        // but provides a fast upper-bound for pricing. Exact count available off-chain.)
        for (uint256 i = 0; i < categories.length; i++) {
            if (_categoryMask & uint32(1 << i) > 0) {
                count += categoryUserCount[i];
            }
        }
    }

    function getPrice(uint256 _audienceSize) public view returns (uint256) {
        for (uint256 i = 0; i < tierMaxAudience.length; i++) {
            if (_audienceSize <= tierMaxAudience[i]) {
                return tierPrice[i];
            }
        }
        return tierPrice[tierPrice.length - 1];
    }

    function submitPoll(
        string calldata _contentCID,
        string[] calldata _options,
        uint256 _deadline,
        uint32 _targetCategory
    ) external nonReentrant whenNotPaused returns (uint256 pollId) {
        require(_options.length >= 2 && _options.length <= 10, "2-10 options");
        require(_deadline > block.timestamp, "Deadline must be future");
        require(_deadline <= block.timestamp + MAX_POLL_DURATION, "Deadline too far"); // [M-03]
        require(_targetCategory > 0, "Must target a category");
        require(bytes(_contentCID).length <= MAX_CID_LENGTH, "CID too long");         // [M-04]

        // [M-04] Validate option string lengths
        for (uint256 i = 0; i < _options.length; i++) {
            require(bytes(_options[i]).length <= MAX_STRING_LENGTH, "Option too long");
        }

        // Calculate audience and price
        uint256 audience = getAudienceSize(_targetCategory);
        require(audience > 0, "No matching audience");
        uint256 price = getPrice(audience);

        // Collect payment
        require(paymentToken.transferFrom(msg.sender, address(this), price), "Payment failed");

        // Create poll
        pollId = polls.length;
        Poll storage poll = polls.push();
        poll.sender = msg.sender;
        poll.contentCID = _contentCID;
        poll.targetCategory = _targetCategory;
        poll.deadline = _deadline;
        poll.createdAt = block.timestamp;
        poll.payment = price;

        // Auto-approve for verified senders
        if (verifiedSenders[msg.sender]) {
            poll.status = PollStatus.ACTIVE;
        } else {
            poll.status = PollStatus.PENDING;
        }

        // Copy options
        for (uint256 i = 0; i < _options.length; i++) {
            poll.options.push(_options[i]);
        }

        emit PollSubmitted(pollId, msg.sender, _targetCategory, _deadline);
        return pollId;
    }

    // ──────────────────── Admin Functions ────────────────────

    function approvePoll(uint256 _pollId) external onlyAdmin nonReentrant { // [C-01]
        Poll storage poll = polls[_pollId];
        require(poll.status == PollStatus.PENDING, "Not pending");
        poll.status = PollStatus.ACTIVE;

        // Move payment to treasury
        paymentToken.transfer(treasury, poll.payment);

        emit PollApproved(_pollId);
    }

    function rejectPoll(uint256 _pollId) external onlyAdmin nonReentrant { // [C-01]
        Poll storage poll = polls[_pollId];
        require(poll.status == PollStatus.PENDING, "Not pending");
        poll.status = PollStatus.REJECTED;

        // Refund sender
        paymentToken.transfer(poll.sender, poll.payment);

        emit PollRejected(_pollId);
    }

    function closePoll(uint256 _pollId) external onlyAdmin {
        Poll storage poll = polls[_pollId];
        require(poll.status == PollStatus.ACTIVE, "Not active");
        poll.status = PollStatus.CLOSED;
        emit PollClosed(_pollId); // [M-02]
    }

    function setPricing(uint256[] calldata _maxAudience, uint256[] calldata _prices) external onlyAdmin {
        require(_maxAudience.length == _prices.length, "Length mismatch");
        delete tierMaxAudience;
        delete tierPrice;
        for (uint256 i = 0; i < _maxAudience.length; i++) {
            tierMaxAudience.push(_maxAudience[i]);
            tierPrice.push(_prices[i]);
        }
        emit PricingUpdated(_maxAudience.length); // [M-02]
    }

    function addCategory(string calldata _name) external onlyAdmin {
        require(categories.length < 32, "Max 32 categories");
        require(bytes(_name).length <= MAX_STRING_LENGTH, "Name too long"); // [M-04]
        uint256 idx = categories.length;
        categories.push(_name);
        emit CategoryAdded(idx, _name); // [M-02]
    }

    // ──────────────────── Owner Functions ────────────────────

    function addAdmin(address _admin) external onlyOwner {
        admins[_admin] = true;
    }

    function removeAdmin(address _admin) external onlyOwner {
        admins[_admin] = false;
    }

    function verifySender(address _sender) external onlyAdmin {
        verifiedSenders[_sender] = true;
    }

    function unverifySender(address _sender) external onlyAdmin {
        verifiedSenders[_sender] = false;
    }

    function setTreasury(address _treasury) external onlyOwner {
        require(_treasury != address(0), "Invalid treasury"); // [L-05]
        address old = treasury;
        treasury = _treasury;
        emit TreasuryUpdated(old, _treasury); // [M-02]
    }

    function setPaymentToken(address _token) external onlyOwner {
        require(_token != address(0), "Invalid token"); // [L-05]
        address old = address(paymentToken);
        paymentToken = IERC20(_token);
        emit PaymentTokenUpdated(old, _token); // [M-02]
    }

    function pause() external onlyOwner {      // [L-04]
        _pause();
    }

    function unpause() external onlyOwner {    // [L-04]
        _unpause();
    }

    // ──────────────────── View Functions ────────────────────

    /// @notice Get active polls matching a user's categories, with pagination [H-02]
    function getActivePolls(address _user, uint256 _offset, uint256 _limit)
        external view returns (uint256[] memory)
    {
        uint32 userMask = users[_user].categoryMask;
        uint256 totalPolls = polls.length;

        // First pass: collect matching IDs in a temp array
        uint256[] memory temp = new uint256[](totalPolls);
        uint256 matchCount = 0;
        for (uint256 i = 0; i < totalPolls; i++) {
            if (polls[i].status == PollStatus.ACTIVE &&
                block.timestamp <= polls[i].deadline &&
                userMask & polls[i].targetCategory > 0) {
                temp[matchCount++] = i;
            }
        }

        // Apply pagination
        if (_offset >= matchCount) {
            return new uint256[](0);
        }
        uint256 end = _offset + _limit;
        if (end > matchCount) end = matchCount;
        uint256 resultLen = end - _offset;

        uint256[] memory result = new uint256[](resultLen);
        for (uint256 i = 0; i < resultLen; i++) {
            result[i] = temp[_offset + i];
        }
        return result;
    }

    function getAllPollIds() external view returns (uint256) {
        return polls.length;
    }

    function getPollOptions(uint256 _pollId) external view returns (string[] memory) {
        return polls[_pollId].options;
    }

    function getPollResults(uint256 _pollId) external view returns (uint256[] memory) {
        uint256 optCount = polls[_pollId].options.length;
        uint256[] memory results = new uint256[](optCount);
        for (uint8 i = 0; i < optCount; i++) {
            results[i] = optionVotes[_pollId][i];
        }
        return results;
    }

    /// @notice Paginated user list for a category [H-02]
    function getRegisteredUsers(uint32 _categoryMask, uint256 _offset, uint256 _limit)
        external view returns (address[] memory)
    {
        uint256 total = userList.length;
        address[] memory temp = new address[](total);
        uint256 matchCount = 0;
        for (uint256 i = 0; i < total; i++) {
            if (users[userList[i]].categoryMask & _categoryMask > 0) {
                temp[matchCount++] = userList[i];
            }
        }

        if (_offset >= matchCount) {
            return new address[](0);
        }
        uint256 end = _offset + _limit;
        if (end > matchCount) end = matchCount;
        uint256 resultLen = end - _offset;

        address[] memory result = new address[](resultLen);
        for (uint256 i = 0; i < resultLen; i++) {
            result[i] = temp[_offset + i];
        }
        return result;
    }

    function getTotalUsers() external view returns (uint256) {
        return userList.length;
    }

    function getTotalPolls() external view returns (uint256) {
        return polls.length;
    }

    function getAllCategories() external view returns (string[] memory) {
        return categories;
    }

    /// @notice [H-03] Leaderboard removed — use off-chain indexing via PointsAwarded events.
    ///         Subgraph or indexer should track cumulative points per user.

    // ──────────────────── Internal Helpers ────────────────────

    /// @dev Increment category counters for each bit set in the mask [H-02]
    function _incrementCategoryCounts(uint32 _mask) internal {
        for (uint256 i = 0; i < categories.length; i++) {
            if (_mask & uint32(1 << i) > 0) {
                categoryUserCount[i]++;
            }
        }
    }

    /// @dev Decrement category counters for each bit set in the mask [H-02]
    function _decrementCategoryCounts(uint32 _mask) internal {
        for (uint256 i = 0; i < categories.length; i++) {
            if (_mask & uint32(1 << i) > 0) {
                categoryUserCount[i]--;
            }
        }
    }
}
