import "dotenv/config";
import { ethers } from "ethers";
import ABI from "./ScanGoABI.json";

// Default dummy values for demo mode
const DUMMY_KEY = "0x0123456789012345678901234567890123456789012345678901234567890123";
const DUMMY_ADDR = "0x0000000000000000000000000000000000000000";

const rpcUrl = process.env.SEPOLIA_RPC || "http://localhost:8545";
const privateKey = process.env.PRIVATE_KEY || DUMMY_KEY;
const contractAddress = process.env.CONTRACT_ADDRESS || DUMMY_ADDR;

const provider = new ethers.JsonRpcProvider(rpcUrl);
const wallet = new ethers.Wallet(privateKey, provider);

const contract = new ethers.Contract(
  contractAddress,
  ABI,
  wallet
);

// Mocking contract for demo mode if no real configuration exists
export const scanGoContract = (process.env.PRIVATE_KEY && process.env.CONTRACT_ADDRESS) 
  ? contract 
  : new Proxy(contract, {
      get(target, prop) {
        if (typeof target[prop as any] === 'function') {
          return async (...args: any[]) => {
            console.log(`[MOCK BLOCKCHAIN] Calling ${String(prop)} with:`, args);
            return {
              hash: "0xmockhash" + Math.random().toString(16).slice(2),
              wait: async () => {
                console.log(`[MOCK BLOCKCHAIN] Waiting for ${String(prop)} confirmation...`);
                return { status: 1 };
              }
            };
          };
        }
        return (target as any)[prop];
      }
    });
