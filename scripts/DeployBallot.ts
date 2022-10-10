// provide address that was created in deployToken script as a param
import { ethers } from "ethers";
import * as dotenv from "dotenv";
import { MyERC20Votes__factory, TokenizedBallot__factory } from "../typechain-types";
dotenv.config();

const PROPOSALS = ["Proposal 1", "Proposal 2", "Proposal 3", "Proposal 4"];
function convertStringArrayToBytes32(array: string[]) {
    const bytes32Array = [];
    for (let index = 0; index < array.length; index++) {
      bytes32Array.push(ethers.utils.formatBytes32String(array[index]));
    }
    return bytes32Array;
}

// Deploys TokenizedBallot contract

async function main() {
    // initialize wallet 
    const signer = await initWallet();
    const erc20TokenAddress = process.env.MYERC20VOTES_ADDRESS || "";


    // get current block to pass as referencedBlock param
    const currBlock = await signer.provider.getBlock("latest");
    console.log(`Goerli Test net - Current block number is: ${currBlock.number}`);

    // create tokenized Ballot contract
    const tokenizedBallotFactory = new TokenizedBallot__factory(signer);
    const tokenizedContract = await tokenizedBallotFactory.deploy(
        convertStringArrayToBytes32(PROPOSALS),
        erc20TokenAddress,
        currBlock.number
    );

    await tokenizedContract.deployed();
    console.log(`TokenizedBallot contract deployed at address: ${tokenizedContract.address}`);

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
