import { Router } from "express";
import { scanGoContract } from "../services/blockchain";

const router = Router();

/**
 * GUARD: Verify order at exit (one-time QR)
 */
router.post("/verify-exit", async (req, res) => {
  try {
    const { orderHash } = req.body;

    if (!orderHash) {
      return res.status(400).json({
        success: false,
        message: "orderHash is required",
      });
    }

    // 🛑 HANDLED OFFLINE/INVALID HASHES GRACEFULLY
    if (typeof orderHash === 'string' && orderHash.startsWith('OFFLINE')) {
      return res.status(400).json({
        success: false,
        status: "OFFLINE_ORDER_DETECTED",
        message: "Cannot verify offline orders on blockchain"
      });
    }

    // 🔍 Check if QR is valid (PAID & not used)
    const isValid: boolean = await scanGoContract.isValid(orderHash);

    if (!isValid) {
      return res.status(403).json({
        success: false,
        status: "INVALID_OR_ALREADY_USED",
      });
    }

    // 🔒 Mark QR as used on blockchain
    const tx = await scanGoContract.verifyOrder(orderHash);
    await tx.wait();

    res.json({
      success: true,
      status: "EXIT_ALLOWED",
    });
  } catch (error: any) {
    console.error("Guard verify-exit error:", error);

    res.status(500).json({
      success: false,
      message: "Verification failed",
    });
  }
});

export default router;
