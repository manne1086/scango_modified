import "dotenv/config";
import { ethers } from "ethers";
import ABI from "../server/services/ScanGoABI.json";

// Mocking environment variables if not loaded (or rely on dotenv)
// We need to make sure we point to the right .env file or rely on the one in root
import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function verifyBlockchain() {
    console.log("🔗 Connecting to Blockchain...");
    console.log(`RPC: ${process.env.SEPOLIA_RPC ? "Found ✅" : "Missing ❌"}`);
    console.log(`Contract: ${process.env.CONTRACT_ADDRESS ? "Found ✅" : "Missing ❌"}`);

    if (!process.env.SEPOLIA_RPC || !process.env.CONTRACT_ADDRESS) {
        console.error("Missing environment variables.");
        return;
    }

    try {
        const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC);
        // Just read-only, no need for wallet/private key for this test
        const contract = new ethers.Contract(
            process.env.CONTRACT_ADDRESS,
            ABI,
            provider
        );

        console.log("✅ Contract instantiated.");

        // Test a Read Call
        const dummyHash = "0x" + "0".repeat(64); // Valid bytes32 format
        console.log(`🔍 Testing isValid() with dummy hash: ${dummyHash}`);

        // This should return false (or true depending on logic, but shouldn't crash)
        const isValid = await contract.isValid(dummyHash);

        console.log(`✅ Blockchain Response: isValid = ${isValid}`);
        console.log("🎉 Blockchain connection is WORKING!");

    } catch (error) {
        console.error("❌ Blockchain Verification Failed:", error);
    }
}

verifyBlockchain();
