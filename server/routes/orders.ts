import { Router } from "express";
import crypto from "crypto";
import { scanGoContract } from "../services/blockchain";

const router = Router();

/**
 * Generate a secure, non-guessable order hash
 */
function generateOrderHash({
  cart,
  total,
  storeId,
}: {
  cart: any[];
  total: number;
  storeId: string;
}) {
  const payload = {
    cart,
    total,
    storeId,
    timestamp: Date.now(),
    nonce: crypto.randomBytes(16).toString("hex"),
  };

  const hash = crypto
    .createHash("sha256")
    .update(JSON.stringify(payload))
    .digest("hex");

  return {
    orderHash: "0x" + hash,
    payload, // optional: store in DB if needed
  };
}

/**
 * CUSTOMER CHECKOUT
 * Creates blockchain-backed order & returns QR hash
 */
router.post("/checkout", async (req, res) => {
  try {
    const { cart, total, storeId } = req.body;

    if (!cart || !total || !storeId) {
      return res.status(400).json({
        error: "cart, total, and storeId are required",
      });
    }

    // 1️⃣ Generate cryptographic order hash
    const { orderHash } = generateOrderHash({
      cart,
      total,
      storeId,
    });

    // 2️⃣ Write order to blockchain
    const tx = await scanGoContract.createOrder(orderHash);
    await tx.wait(); // wait for confirmation

    // 2.5️⃣ Auto-mark as PAID if not CASH (Online Payment)
    if (req.body.paymentMethod && req.body.paymentMethod !== 'CASH') {
      console.log(`💳 Auto-paying for ${req.body.paymentMethod} order: ${orderHash}`);
      const payTx = await scanGoContract.markPaid(orderHash);
      await payTx.wait();
    }

    // 3️⃣ Return QR-safe response
    res.json({
      success: true,
      orderHash,
    });
  } catch (error: any) {
    console.error("Checkout error:", error);

    res.status(500).json({
      success: false,
      error: "Failed to create order",
    });
  }
});

export default router;
