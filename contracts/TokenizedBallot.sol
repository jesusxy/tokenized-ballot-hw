// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IERC20Votes is IERC20 {
    function getPastVotes(address, uint256) external view returns (uint256);
    function mint(address to, uint256 amount) external;
    function burn(address from, uint256 amount) external;
    function buyTokens() external payable;
}

contract TokenizedBallot is Ownable {
    uint256 public referenceBlock;
    IERC20Votes public tokenContract;

    struct Proposal {
        bytes32 name;
        uint256 voteCount;
    }
    
    Proposal[] public proposals;
    mapping(address => uint256) public votingPowerSpent;

    constructor(bytes32[] memory proposalNames, address _tokenContract, uint256 _referenceBlock){
        // populate proposals array
        for(uint256 i = 0; i < proposalNames.length; i++){
            proposals.push(Proposal({voteCount: 0, name: proposalNames[i]}));
        }
        // initialize and set tokenContract instance and reference block
        tokenContract = IERC20Votes(_tokenContract);
        referenceBlock = _referenceBlock;
    }

    function vote(uint256 proposal, uint256 amount) public {
        // check voting power
        uint256 _votingPower = votingPower(msg.sender);
        require(_votingPower >= amount, "TokenizedBallot: trying to vote more than votingPower available");

        votingPowerSpent[msg.sender] += amount;
        // increase vote count for proposal that was passed as argument
        proposals[proposal].voteCount += amount;
    }

    function votingPower(address account) public view returns(uint256 votingPower_){
        votingPower_ = tokenContract.getPastVotes(account, referenceBlock) - votingPowerSpent[msg.sender];
    }

    function winningProposal() public view returns (uint256 winningProposal_) {
        uint256 winningVoteCount = 0;

        for(uint256 p = 0; p < proposals.length; p++){
            if(proposals[p].voteCount > winningVoteCount){
                winningVoteCount = proposals[p].voteCount;
                winningProposal_ = p;
            }
        }
    }

    function winnerName() external view returns (bytes32 winnerName_) {
        winnerName_ = proposals[winningProposal()].name;
    }

}