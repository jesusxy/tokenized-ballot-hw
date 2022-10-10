import { ethers } from "hardhat";
import { MyERC20Votes__factory, TokenizedBallot__factory } from "../typechain-types";

async function main() {
    const signer = await initWallet();
    const tokenizedBallotAddr = process.env.TOKENIZED_BALLOT_ADDRESS || "";

    const tokenizedBallotFactory = new TokenizedBallot__factory(signer);
    const tokenizedBallotContract = tokenizedBallotFactory.attach(tokenizedBallotAddr);
    
    const winningProposal = await tokenizedBallotContract.winnerName();
    
    console.log(`The winning proposal with most votes was: ${winningProposal}`);

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
    

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });