import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { QRCodePayload } from '../types/order';

interface OrderQRCodeProps {
  orderHash: string | undefined;
  txHash: string | undefined;
  receiptNumber: string | undefined;
  size?: number;
}

/**
 * 🛡️ PRODUCTION-GRADE QR GENERATOR
 * Encodes order identifier and transaction proof into a serialized JSON payload.
 */
export const OrderQRCode: React.FC<OrderQRCodeProps> = ({ orderHash, txHash, receiptNumber, size = 160 }) => {

  // 1. DEFENSIVE CHECK: Verify critical blockchain identifiers
  const isValid = !!(orderHash && txHash && receiptNumber && orderHash.length > 0 && txHash.length > 0);

  if (!isValid) {
    return (
      <div
        style={{ width: size, height: size }}
        className="bg-gray-100 animate-pulse rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-gray-200 p-4"
      >
        <div className="w-8 h-8 border-4 border-gray-300 border-t-[#007041] rounded-full animate-spin mb-3"></div>
        <p className="text-[10px] text-gray-400 font-black uppercase tracking-tighter text-center">
          Waiting for Blockchain Confirmation...
        </p>
      </div>
    );
  }

  // 2. SERIALIZATION: Create the mandatory JSON payload
  const payload: QRCodePayload = {
    orderHash: orderHash!,
    txHash: txHash!,
    receiptNumber: receiptNumber!
  };

  const serializedPayload = JSON.stringify(payload);

  // 3. RENDER: Standard QR readable by industrial scanners
  return (
    <div className="bg-white p-3 rounded-xl shadow-inner inline-block">
      <QRCodeSVG
        value={serializedPayload}
        size={size}
        level="H" // High error correction for retail environments
        includeMargin={false}
        imageSettings={{
          src: "/favicon.ico", // Optional branding
          x: undefined,
          y: undefined,
          height: 24,
          width: 24,
          excavate: true,
        }}
      />
    </div>
  );
};
