import { ethers } from "ethers";
import * as dotenv from "dotenv";
import { MyERC20Votes__factory, TokenizedBallot__factory } from "../typechain-types";
dotenv.config();


async function main() {
    const signer = await initWallet();
    const proposal_to_vote_for = 3;
    const ERC20Votes_Address = process.env.MYERC20VOTES_ADDRESS || "";
    const TOKENIZEDBALLOT_Address = process.env.TOKENIZED_BALLOT_ADDRESS || "";
    const REFERENCE_BLOCK = process.env.REFERENCE_BLOCK || "";

    const tokenizedBallotFactory = new TokenizedBallot__factory(signer);
    const tokenizedBallotContract = tokenizedBallotFactory.attach(TOKENIZEDBALLOT_Address);

    // i dont think it should be necessary to initialize a new erc20 votes contract
    // since this token address is set in TokenizedBallot constructor and passed to IERC20 interface
    // we should be able to interact with the methods defined in the interface
    // for example; 
    // we should be able to do tokenizedBallotContract.tokenContract.getPastVotes();

    const erc20VotesFactory = new MyERC20Votes__factory(signer);
    const erc20TokenContract = erc20VotesFactory.attach(ERC20Votes_Address);
    const votingBalance = erc20TokenContract.getPastVotes(signer.address, REFERENCE_BLOCK);

    const castVoteTx = await tokenizedBallotContract.vote(proposal_to_vote_for, votingBalance);
    await castVoteTx.wait();

    console.log(`A vote has succesfully been casted for proposal ${proposal_to_vote_for}. Txn Hash: ${castVoteTx.hash}`);

    const votingPowerStats = await tokenizedBallotContract.votingPowerSpent(signer.address);
    console.log(`Your voting power stats are as follows: ${votingPowerStats}`);

}


async function initWallet() {
    const options = {
        alchemy: process.env.ALCHEMY_API_KEY,
        infura: process.env.INFURA_API_KEY,
    };
    const provider = ethers.getDefaultProvider("goerli", options);

    const wallet = ethers.Wallet.fromMnemonic(process.env.MNEMONIC ?? "");
    console.log(`Using wallet address: ${wallet.address}`);
    const signer = wallet.connect(provider);

    return signer;
}
    
main().catch((err) => {
    console.log(err);
    process.exitCode = 1;
});
