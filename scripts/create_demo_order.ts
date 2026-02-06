
import "dotenv/config";
import fetch from "node-fetch";
import https from "https";
import { createClient } from "@supabase/supabase-js";

// --- CONFIG ---
// Replicating src/services/supabase.ts
// NOTE: Ideally import, but for script simplicity we copy keys (avoiding module resolution context issues)
const SUPABASE_URL = 'https://rrklrkbbvrmsztzgewhq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJya2xya2JidnJtc3p0emdld2hxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc4NjQ2NzUsImV4cCI6MjA4MzQ0MDY3NX0.YpfNHSrUeMfkc_bVJZVpWUoT8KQxLsbXLPp6GMyGLW4';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Bypassing SSL for local dev
const agent = new https.Agent({ rejectUnauthorized: false });
const BASE_URL = "https://localhost:5000/api"; // Connecting to backend

async function post(endpoint: string, body: any) {
    try {
        const res = await fetch(`${BASE_URL}${endpoint}`, {
            method: "POST",
            body: JSON.stringify(body),
            headers: { "Content-Type": "application/json" },
            agent
        });
        return await res.json();
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

async function createDemoOrder() {
    console.log("\n🛒 CREATING DEMO ORDER (Simulating User App)");

    // 1. Prepare Data
    const receiptNumber = `RCP-DEMO-${Math.floor(Math.random() * 10000)}`;
    const items = [{ id: "demo-item", price: 50, quantity: 2, name: "Demo Product" }];
    const totalAmount = 100;
    const storeId = "store-001";
    const paymentMethod = "UPI"; // Triggers PAID status immediately

    console.log(`   📝 Receipt ID: ${receiptNumber}`);

    // 2. Insert into Supabase (Critical for Guard App Sync)
    console.log("   💾 Inserting into Supabase...");
    const { error } = await supabase.from('receipts').insert([{
        receipt_number: receiptNumber,
        store_id: storeId,
        total_amount: totalAmount,
        payment_status: 'PAID', // UPI is auto-paid
        items_json: items,
        created_at: new Date().toISOString()
    }]);

    if (error) {
        console.error("   ❌ Supabase Insert Failed:", error.message);
        return;
    }
    console.log("   ✅ Supabase Insert Success");

    // 3. Call Backend to Create on Blockchain
    console.log("   ⛓️  Creating on Blockchain...");
    const res = await post("/orders/checkout", {
        cart: items,
        total: totalAmount,
        storeId,
        paymentMethod
    });

    if (!res.success) {
        console.error("   ❌ API Error:", res);
        return;
    }

    const { orderHash } = res;
    console.log(`   ✅ Blockchain Order Created! Hash: ${orderHash}`);

    // 4. Output Logic
    const qrPayload = {
        orderHash,
        txHash: '0x...simulated_tx_hash...',
        receiptNumber
    };

    console.log("\n📦 QR CODE PAYLOAD (For Guard App):");
    console.log(JSON.stringify(qrPayload, null, 2));

    // Save to file for easy reading
    const fs = await import('fs');
    fs.writeFileSync('demo_qr.json', JSON.stringify(qrPayload, null, 2));
    console.log("\n✨ SUCCESS: Demo Order is ready for verification.");
    console.log("   QR payload saved to demo_qr.json");
}

createDemoOrder();
