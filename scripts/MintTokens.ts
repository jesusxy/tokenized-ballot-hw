import { ethers } from "hardhat";
import { MyERC20Votes__factory, TokenizedBallot__factory } from "../typechain-types";

const TokenRation = 5;

// script will mint tokens to msg.sender
async function main(){
    const signer = await initWallet();
    const tokenizedBallotAddr = process.env.MYERC20VOTES_ADDRESS || "";

    const erc20TokenFactory = new MyERC20Votes__factory(signer);
    const erc20TokenContract = erc20TokenFactory.attach(tokenizedBallotAddr);

    const mintTokenTx = await erc20TokenContract.mint(signer.address, 20);
    await mintTokenTx.wait();

    console.log('---- mint successful ----', mintTokenTx);


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