import { ethers } from "ethers";
import * as dotenv from "dotenv";
import { MyERC20Votes__factory } from "../typechain-types";
dotenv.config();

///// Script deploys a ERC20Votes token

/// its address will be passed as a param to TokenizedBallot constructor;

const TOKEN_RATIO = 5;

async function main() {
    // initialize wallet 
    const signer = await initWallet();

    // create erc20Votes token contract 
    const erc20VotesFactory = new MyERC20Votes__factory(signer);
    const erc20VotesContract = await erc20VotesFactory.deploy(TOKEN_RATIO);
    await erc20VotesContract.deployed();

    console.log(`Deployed erc20Votes token, address is: ${erc20VotesContract.address}`)

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