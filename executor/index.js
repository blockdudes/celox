import { ethers, Wallet } from "ethers";
import contractJSON from "./Contract.json" with { type: "json" };
import dotenv from "dotenv";
dotenv.config();

const provider = new ethers.JsonRpcProvider(process.env.TENDERLY_RPC_URL);

const contractAddress = "0xdd3c3546d303db3e0e9fda9ad174f4844051a6ec";
const contractABI = contractJSON;

const signer = new Wallet(process.env.PRIVATE_KEY, provider);

const contract = new ethers.Contract(contractAddress, contractABI, signer);

const executeContract = async () => {
  try {
    const tx = await contract.executeAllOrders({gasLimit:999999999});
    await tx.wait();
    console.log("Transaction successful:", tx.hash);
  } catch (error) {
    console.error("Error executing contract:", error);
  }
};

const INTERVAL = 10000;

// const executePeriodically = () => {
//   setInterval(async () => {
//     await executeContract();
//   }, INTERVAL);
// };

// executePeriodically();

executeContract();