import "dotenv/config";
import { ethers } from "ethers";
import ABI from "./ScanGoABI.json";

const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);

export const scanGoContract = new ethers.Contract(
  process.env.CONTRACT_ADDRESS!,
  ABI,
  wallet
);
