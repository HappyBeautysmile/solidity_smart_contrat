// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

/// @title Voting with delegation.
contract Ballot {
    // This declares a new complex type which will
    // be used for variables later.
    // It will represesnt a single voter.
    struct Voter {
        uint256 weight; // weight is accmulated by delegation
        bool voted; // if true, that person already voted
        address delegate; // person delegated to
        uint256 vote; // index of the voted proposal
    }

    // This is a type for a single proposal.
    struct Proposal {
        bytes32 name; // short name (up to 32 bytes);
        uint256 voteCount; // number of accumulated votes
    }

    address public chairperson;

    // This declares a state variable that
    // stores a 'Voter' struct for each possible address.
    mapping(address => Voter) public voters;

    // A dynamically-sized array of 'Proposal' structs.
    Proposal[] public proposals;

    // Create a new ballot to choose one of 'proposalNames'.
    constructor(bytes32[] memory proposalNames) {
        chairperson = msg.sender;
        voters[chairperson].weight = 1;

        // For each of the provided proposal names,
        // create a new proposal object and add it
        // to the end of the array.
        for (uint256 i = 0; i < proposalNames.length; i++) {
            // `Proposal({...})` creates a tempory
            // Proposal object and `proposals.push(...)`
            // appends it to the end of `proposals`
            proposals.push(Proposal({name: proposalNames[i], voteCount: 0}));
        }
    }

    // Give `_voter` the right to vote on this ballot.
    // May only be called by `vhairperson`
    function giveRightToVote(address _voter) external {
        // If the first argument of `require` evaluates
        // to `false`, execution terminates and all
        // changes to the state and to Ether balances
        // are reverted.
        // This used to consume all gas in old EVM versions, but
        // not anymore.
        // It is often a good idea to use `require` to check if
        // functions are called correctly.
        // As a second argument, you can also provide an
        // explanation about what went wrong.
        require(
            msg.sender == chairperson,
            "Only chairperson can give right to vote."
        );
        require(!voters[_voter].voted, "The voter already voted.");
        require(voters[_voter].weight == 0, "Already became voter.");

        voters[_voter].weight = 1;
    }

    // Delegate your vote to the voter `_to`
    function delegate(address _to) external {
        // assigns reference
        Voter storage sender = voters[msg.sender];

        require(sender.weight != 0, "You have no right to vote.");
        require(!sender.voted, "You already voted.");
        require(_to != msg.sender, "Self-delegation is disallowed.");

        // Forward the delegation as long as
        // `_to` also delegated.
        // In general, such loops are very dangerous,
        // because if they run too long, they might
        // need more gas than is available in a block.
        // In this case, the delegation will not be excuted,
        // but in other situations, such loops might
        // cause a contract to get "stuck" completely.
        while (voters[_to].delegate != address(0)) {
            _to = voters[_to].delegate;

            // We found a loop in the delegation, not allowed.
            require(_to != msg.sender, "Found loop in delegation.");
        }

        Voter storage delegate_ = voters[_to];

        // Voters cannot delegate to accounts that cannot vote.
        require(delegate_.weight >= 1);

        // Since `sender` is a reference, this
        // modifies `voters[msg.sender]`.
        sender.voted = true;
        sender.delegate = _to;

        if (delegate_.voted) {
            // If the delegate already voted,
            // directly add to the number of votes.
            proposals[delegate_.vote].voteCount += sender.weight;
        } else {
            // If the delegate did not vote yet,
            // add to sender's weight.
            delegate_.weight += sender.weight;
        }
    }

    // Give the vote (including votes delegated to you)
    // to proposal `proposals[proposal].name`.
    function vote(uint256 _proposal) external {
        Voter storage sender = voters[msg.sender];

        require(sender.weight != 0, "Has no right to vote.");
        require(!sender.voted, "Already voted.");
        sender.voted = true;
        sender.vote = _proposal;

        // If `proposal` is out of the range of the array,
        // this will throw automatically and revert all
        // changes.
        proposals[_proposal].voteCount += sender.weight;
    }

    // @dev Computes the winning proposal taking all
    // previous votes into acount.
    function winningProposal() public view returns (uint256 winningProposal_) {
        uint256 winningVoteCount = 0;
        for (uint256 i = 0; i < proposals.length; i++) {
            if (proposals[i].voteCount > winningVoteCount) {
                winningVoteCount = proposals[i].voteCount;
                winningProposal_ = i;
            }
        }
    }

    // Calls winningProposal() function to get the index
    // of the winner contained in the proposals array and then
    // returns the name of the winner
    function winnerName() external view returns (bytes32 winnerName_) {
        winnerName_ = proposals[winningProposal()].name;
    }

    function getProposalsLength() external view returns (uint256) {
        return proposals.length;
    }
}
