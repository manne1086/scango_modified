
// --- EMPLOYEE APP TYPES ---

export type Role = 'GUARD' | 'CASHIER' | 'ADMIN';

export interface Employee {
  id: string;
  name: string;
  permissions: Role[]; // Employee might be authorized for multiple roles
}

export type AppScreen = 'LOGIN' | 'ROLE_SELECT' | 'SCANNER' | 'RESULT';

// --- PRODUCT TYPES ---

export interface Product {
  id: string;
  barcode: string;
  name: string;
  brand: string;
  weight: string;
  mrp: number;
  discount: number;
  price: number;
  category: string;
  imageUrl: string;
}

// --- API RESPONSE TYPES ---

export type OrderStatus = 'PAID' | 'PENDING' | 'FAILED' | 'USED' | 'VERIFIED';
export type PaymentStatus = OrderStatus;

// Cashier Response
export interface CashierResult {
  success: boolean;
  status: 'PAYMENT_CONFIRMED' | 'ALREADY_PAID' | 'INVALID_QR' | 'NETWORK_ERROR';
  orderHash: string;
  amount?: number;
  timestamp: number;
}

// Guard Response
export interface GuardResult {
  allowed: boolean;
  status: 'EXIT_ALLOWED' | 'PAYMENT_PENDING' | 'QR_USED' | 'INVALID_QR' | 'NETWORK_ERROR';
  orderHash: string;
  timestamp: number;
  itemCount?: number;
}
