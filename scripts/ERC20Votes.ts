import { ethers } from "hardhat";
import { MyERC20Votes__factory } from "../typechain-types";
import * as dotenv from "dotenv";
dotenv.config();

// Arjun's code

// parse the string 0.01 into a BigNumber
const TOKEN_MINT = ethers.utils.parseEther("0.01");
const DELEGATED_ADDRESS = "0x2E6dfB34FD92a0F719137110205A54Aec4721865";

async function main() {
  const signer = await initWallet();

  const erc20VotesFactory = new MyERC20Votes__factory(signer);
  const erc20VotesContract = await erc20VotesFactory.deploy();
  await erc20VotesContract.deployed();

  console.log(
    `_______ my erc20Votes contract has been deployed ${erc20VotesContract.address}`
  );

  const totalSupply = await erc20VotesContract.totalSupply();
  console.log(`___ total supply at deployment: ${totalSupply} tokens`);

  const initialVotes = await erc20VotesContract.getVotes(DELEGATED_ADDRESS);
  console.log(
    `_____ at deployment: acc1 has voting power of: ${initialVotes} votes`
  );

  // mint a token
  const mintTx = await erc20VotesContract.mint(DELEGATED_ADDRESS, TOKEN_MINT);
  await mintTx.wait();
  console.log("--- Minting ERC20 tokens..");

  const acc1Balance = await erc20VotesContract.balanceOf(DELEGATED_ADDRESS);
  console.log(
    `_____ after mint acc1 has balance of ${ethers.utils.formatEther(
      acc1Balance
    )} tokens`
  );

  // get current block
  const latestBlock = await ethers.provider.getBlock("latest");
  console.log(`+++++++++ The latest block number is: ${latestBlock.number}`);

  // get history of votes
  const pastVotes = await Promise.all([
    await erc20VotesContract.getPastVotes(
      DELEGATED_ADDRESS,
      latestBlock.number
    ),
  ]);

  console.log(`_____ pastvotes: ${pastVotes}`);
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
  console.error(err);
  process.exitCode = 1;
});