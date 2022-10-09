import { ethers } from "ethers";
import * as dotenv from "dotenv";
import { MyERC20Votes__factory, TokenizedBallot__factory } from "../typechain-types";
dotenv.config();

///// Jesus code / script

const PROPOSALS = ["Proposal 1", "Proposal 2", "Proposal 3", "Proposal 4"];
function convertStringArrayToBytes32(array: string[]) {
    const bytes32Array = [];
    for (let index = 0; index < array.length; index++) {
      bytes32Array.push(ethers.utils.formatBytes32String(array[index]));
    }
    return bytes32Array;
}

async function main() {
    // initialize wallet 
    const signer = await initWallet();
    
    // create erc20votes token contract
    const erc20VotesFactory = new MyERC20Votes__factory(signer);
    const erc20VotesContract = await erc20VotesFactory.deploy();
    await erc20VotesContract.deployed();

    console.log(`Deployed erc20Votes token, address is: ${erc20VotesContract.address}`)

    // get currBlock to pass as referencedBlock param
    const currBlock = await signer.provider.getBlock("latest");
    console.log(`Goerli Test net - Current block number is: ${currBlock.number}`);

    // create tokenizedBallot contract
    const tokenizedBallotFactory = new TokenizedBallot__factory(signer);
    const tokenizedContract = await tokenizedBallotFactory.deploy(
        convertStringArrayToBytes32(PROPOSALS),
        erc20VotesContract.address,
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