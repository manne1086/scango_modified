import { Router } from "express";
import { scanGoContract } from "../services/blockchain";

const router = Router();

/**
 * CASHIER: Mark order as paid (cash at counter)
 */
router.post("/mark-paid", async (req, res) => {
  try {
    const { orderHash } = req.body;

    if (!orderHash) {
      return res
        .status(400)
        .json({ success: false, message: "orderHash is required" });
    }

    // 🛑 HANDLED OFFLINE/INVALID HASHES GRACEFULLY
    if (typeof orderHash === 'string' && orderHash.startsWith('OFFLINE')) {
      return res.status(400).json({
        success: false,
        message: "Cannot write offline orders to blockchain"
      });
    }

    // 🔗 Write payment confirmation to blockchain
    const tx = await scanGoContract.markPaid(orderHash);
    await tx.wait();

    res.json({
      success: true,
      status: "PAID_CONFIRMED",
    });
  } catch (error: any) {
    console.error("Cashier mark-paid error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to mark payment",
    });
  }
});

export default router;
