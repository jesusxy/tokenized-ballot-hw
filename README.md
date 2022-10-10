# Lesson 12 Weekend Homework - Oct 08/09

This README file has our reports that go over each function execution, transaction hash, or the revert reason (if there was one) when 
interacting with the TokenizedBallot.sol contract through the different scripts that we created.

**Group Members:**

- Adrian Sandoval
- Jesus Chavez
- Arjun Mukherjee
- Micah Bly
- Jose Marvn Henriquez


## Jesus

### Created script (DeployToken.ts + DeployBallot.ts) to deploy Tokenized Ballot Contract to Goerli Testnet
Script deploys Tokenized Ballot contract and passes 3 params
- proposals
- erc20VotesToken contract address
- current block

###### Deployment tx details
```
transactionHash: 0x4484580498cd29e2a86c7f018fa40d56812a8ae1527c36051ba8e0ae68b83e8a,
blockNumber: 7746117,
tokenizedBallotAddress: 0x84DC87068c4642D4BcFFFC6aaC737Ec3dd592778,
erc20VotesTokenAddress: 0x054C163B212fFF59Cb42aEAC9EF27C6803F490Cc
```

### CastVote.ts script details 
###### Function exection-> `vote( )`

This script casts a vote for a proposal. After vote has been successfully casted it also logs the `msg.sender` votingPower stats by calling `votingPowerSpent( )`. 

###### CastVote Tx details
```
txHash: 0x4e61fc20c61863d4ae4d5a3cc59de813277f78ddd3b081aac2ea98cf3ae4a504,
proposalToVoteFor: 3,
votingPowerSpent: 0
```

## Arjun

### Created script to deploy ERC20Votes.ts to Goerli Testnet

###### Deployment Tx Details

```
transactionHash: 0x82aeeacee50f7ef5b22f6c354df744caf1c372d4372a3c68c07e50fd231ecb18
blockNumber: 7738878
ERC20Votes deployed address: 0x6104fa66F78D715c4650bEE0EDDaF526F29a541B
```
