import "dotenv/config";
import { ethers } from "ethers";
import ABI from "../server/services/ScanGoABI.json";
import path from 'path';
import dotenv from 'dotenv';

// Load env from root
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const { SEPOLIA_RPC, PRIVATE_KEY, CONTRACT_ADDRESS } = process.env;

if (!SEPOLIA_RPC || !PRIVATE_KEY || !CONTRACT_ADDRESS) {
    console.error("❌ Missing required environment variables (SEPOLIA_RPC, PRIVATE_KEY, CONTRACT_ADDRESS)");
    process.exit(1);
}

const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, wallet);

async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function verifyFlow() {
    console.log("🚀 Starting End-to-End Blockchain Verification");
    console.log(`📜 Contract: ${CONTRACT_ADDRESS}`);
    console.log(`👤 Executor: ${wallet.address}`);

    // 1. Generate Order Hash
    const randomBytes = ethers.randomBytes(32);
    const orderHash = ethers.hexlify(randomBytes);
    console.log(`\n📦 Generated Order Hash: ${orderHash}`);

    try {
        // 2. Create Order
        console.log("\n1️⃣  Running createOrder()...");
        const tx1 = await contract.createOrder(orderHash);
        console.log(`   Tx Hash: ${tx1.hash}`);
        console.log("   Waiting for confirmation...");
        await tx1.wait();
        console.log("   ✅ Order Created.");

        // 3. Mark Paid
        console.log("\n2️⃣  Running markPaid()...");
        const tx2 = await contract.markPaid(orderHash);
        console.log(`   Tx Hash: ${tx2.hash}`);
        console.log("   Waiting for confirmation...");
        await tx2.wait();
        console.log("   ✅ Order Marked as Paid.");

        // 4. Verify Validity (Should be TRUE)
        console.log("\n3️⃣  Checking isValid() [Expect: TRUE]...");
        // Force a small delay to ensure chain propagation if needed (optional)
        await sleep(2000);
        const validAfterPay = await contract.isValid(orderHash);
        console.log(`   Result: ${validAfterPay}`);
        if (validAfterPay !== true) throw new Error("Validation failed! Expected true.");
        console.log("   ✅ Order is Valid.");

        // 5. Verify Order (Exit)
        console.log("\n4️⃣  Running verifyOrder() [Guard Exit]...");
        const tx3 = await contract.verifyOrder(orderHash);
        console.log(`   Tx Hash: ${tx3.hash}`);
        console.log("   Waiting for confirmation...");
        await tx3.wait();
        console.log("   ✅ Order Verified/Exited.");

        // 6. Verify Validity (Should be FALSE)
        console.log("\n5️⃣  Checking isValid() [Expect: FALSE]...");
        await sleep(2000);
        const validAfterExit = await contract.isValid(orderHash);
        console.log(`   Result: ${validAfterExit}`);
        if (validAfterExit !== false) throw new Error("Validation failed! Expected false (already used).");
        console.log("   ✅ Order is now Invalid (Used).");

        console.log("\n🎉✨ SUCCESS: Full Blockchain Lifecycle Verified! ✨🎉");

    } catch (error) {
        console.error("\n❌ Verification FAILED:", error);
        process.exit(1);
    }
}

verifyFlow();
