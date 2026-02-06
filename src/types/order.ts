import { CartItem } from './product';

export enum PaymentMethod {
  UPI = 'UPI',
  CARD = 'CARD',
  CASH = 'CASH'
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  VERIFIED = 'VERIFIED'
}

export interface Order {
  id: string;
  receiptNumber: string;   // User-facing receipt ID
  storeName: string;       // Store context
  items: CartItem[];
  totalAmount: number;
  totalDiscount: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  timestamp: number;
  counterId?: string;
  tokenNumber?: string;

  // 🔗 Blockchain-backed fields
  orderHash: string;       // USED to generate QR (on-chain)
  txHash?: string;         // Optional Etherscan transaction proof

  // ❌ REMOVE this
  // qrPayload: string;
}

/**
 * 🛡️ MANDATORY QR PAYLOAD FORMAT
 * Used for both Payment and Gate verification.
 */
export interface QRCodePayload {
  orderHash: string;
  txHash: string;
  receiptNumber: string;
}

