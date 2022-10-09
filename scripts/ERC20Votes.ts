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



// import { ethers } from "hardhat";
// import * as dotenv from "dotenv";
// dotenv.config();

// Jesus Code

// // parse the string 1 into a BigNumber
// const TOKEN_MINT = ethers.utils.parseEther("2");

// async function main() {
//     const [ deployer, acc1, acc2 ] = await ethers.getSigners();
//     const myErc20VotesContractFactory = await ethers.getContractFactory("MyERC20Votes");
//     const myErc20VotesContract = await myErc20VotesContractFactory.deploy();
//     await myErc20VotesContract.deployed();

//     console.log(`_______ my erc20Votes contract has been deployed ${myErc20VotesContract.address}`);

//     const totalSupply = await myErc20VotesContract.totalSupply();
//     console.log(`___ total supply at deployment: ${totalSupply} tokens`);

//     const initialVotes = await myErc20VotesContract.getVotes(acc1.address);
//     console.log(`_____ at deployment: acc1 has voting power of: ${initialVotes} votes`)

//     // mint a token
//     const mintTx = await myErc20VotesContract.mint(acc1.address, TOKEN_MINT);
//     await mintTx.wait();

//     // log total supply after mint
//     const totalSupplyAfterMint = await myErc20VotesContract.totalSupply();
//     console.log(`___ total supply after mint: ${ethers.utils.formatEther(totalSupplyAfterMint)} tokens`);

//     const acc1Balance = await myErc20VotesContract.balanceOf(acc1.address);
//     console.log(`_____ after mint acc1 has balance of ${ethers.utils.formatEther(acc1Balance)} tokens`);

//     const votesAfterMint = await myErc20VotesContract.getVotes(acc1.address);
//     console.log(`_____ after mint: acc1 has voting power of: ${votesAfterMint} votes`);

//     // delegate tx
//     const delegateTx = await myErc20VotesContract.connect(acc1).delegate(acc1.address);
//     await delegateTx.wait();

//     const votesAfterDelegate = await myErc20VotesContract.getVotes(acc1.address);
//     console.log(`_____ after mint: acc1 has voting power of: ${ethers.utils.formatEther(votesAfterDelegate)} votes`);


//     // get current block
//     const currentBlock = await ethers.provider.getBlock("latest");
//     console.log(`+++++++++ The current block number is: ${currentBlock.number}`);

//     // get history of v
//     const pastVotes = await Promise.all([
//         myErc20VotesContract.getPastVotes(acc1.address, 4),
//         myErc20VotesContract.getPastVotes(acc1.address, 3),
//         myErc20VotesContract.getPastVotes(acc1.address, 2),
//         myErc20VotesContract.getPastVotes(acc1.address, 1),
//         myErc20VotesContract.getPastVotes(acc1.address, 0),
//     ]);

//     console.log(`_____ pastvotes: ${pastVotes}`);
// }

// main().catch((err) => {
//     console.error(err);
//     process.exitCode = 1;
// })