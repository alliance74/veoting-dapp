// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title Voting
 * @dev Decentralized polling/voting contract
 *      - Anyone can create a poll with multiple options
 *      - Each address can vote once per poll
 *      - Polls have a deadline (unix timestamp)
 */
contract Voting {
    // ─── Structs ────────────────────────────────────────────────────────────

    struct Poll {
        uint256 id;
        address creator;
        string question;
        string[] options;
        uint256[] votes;       // votes[i] = vote count for option i
        uint256 deadline;      // unix timestamp
        bool exists;
    }

    // ─── State ──────────────────────────────────────────────────────────────

    uint256 public pollCount;

    // pollId => Poll
    mapping(uint256 => Poll) private polls;

    // pollId => voter address => has voted
    mapping(uint256 => mapping(address => bool)) public hasVoted;

    // ─── Events ─────────────────────────────────────────────────────────────

    event PollCreated(
        uint256 indexed pollId,
        address indexed creator,
        string question,
        uint256 deadline
    );

    event Voted(
        uint256 indexed pollId,
        address indexed voter,
        uint256 optionIndex
    );

    // ─── Errors ─────────────────────────────────────────────────────────────

    error PollNotFound(uint256 pollId);
    error PollExpired(uint256 pollId);
    error AlreadyVoted(uint256 pollId, address voter);
    error InvalidOption(uint256 optionIndex, uint256 max);
    error InvalidInput(string reason);

    // ─── Functions ──────────────────────────────────────────────────────────

    /**
     * @notice Create a new poll
     * @param question    The poll question
     * @param options     Array of option labels (2–10 items)
     * @param durationMin How many minutes the poll stays open
     */
    function createPoll(
        string calldata question,
        string[] calldata options,
        uint256 durationMin
    ) external returns (uint256 pollId) {
        if (bytes(question).length == 0) revert InvalidInput("Empty question");
        if (options.length < 2 || options.length > 10)
            revert InvalidInput("Options must be 2-10");
        if (durationMin == 0) revert InvalidInput("Duration must be > 0");

        pollId = pollCount++;

        Poll storage p = polls[pollId];
        p.id       = pollId;
        p.creator  = msg.sender;
        p.question = question;
        p.deadline = block.timestamp + durationMin * 60;
        p.exists   = true;

        for (uint256 i = 0; i < options.length; i++) {
            p.options.push(options[i]);
            p.votes.push(0);
        }

        emit PollCreated(pollId, msg.sender, question, p.deadline);
    }

    /**
     * @notice Cast a vote on an existing poll
     * @param pollId      The poll to vote on
     * @param optionIndex Which option to vote for (0-indexed)
     */
    function vote(uint256 pollId, uint256 optionIndex) external {
        Poll storage p = polls[pollId];
        if (!p.exists) revert PollNotFound(pollId);
        if (block.timestamp > p.deadline) revert PollExpired(pollId);
        if (hasVoted[pollId][msg.sender])
            revert AlreadyVoted(pollId, msg.sender);
        if (optionIndex >= p.options.length)
            revert InvalidOption(optionIndex, p.options.length - 1);

        hasVoted[pollId][msg.sender] = true;
        p.votes[optionIndex]++;

        emit Voted(pollId, msg.sender, optionIndex);
    }

    /**
     * @notice Get full poll details
     */
    function getPoll(uint256 pollId)
        external
        view
        returns (
            uint256 id,
            address creator,
            string memory question,
            string[] memory options,
            uint256[] memory votes,
            uint256 deadline,
            bool active
        )
    {
        Poll storage p = polls[pollId];
        if (!p.exists) revert PollNotFound(pollId);

        return (
            p.id,
            p.creator,
            p.question,
            p.options,
            p.votes,
            p.deadline,
            block.timestamp <= p.deadline
        );
    }

    /**
     * @notice Convenience: check if caller has voted on a poll
     */
    function didIVote(uint256 pollId) external view returns (bool) {
        return hasVoted[pollId][msg.sender];
    }

    /**
     * @notice Get total polls count
     */
    function getTotalPolls() external view returns (uint256) {
        return pollCount;
    }
}

// NatSpec: @title Voting DApp v1.0

// License: MIT - Open Source

// Error codes: PollNotFound=1, Expired=2, AlreadyVoted=3, InvalidOption=4

// Validation order: question -> options length -> duration
