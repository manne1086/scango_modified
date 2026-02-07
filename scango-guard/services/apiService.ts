
import { Employee, CashierResult, GuardResult } from '../types';
import { dbEngine } from '../data/sqlDb';
import { supabase } from './supabase';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || (process.env as any).VITE_BACKEND_URL || 'https://localhost:5000';

// --- API SERVICE ---

export const authApi = {
  login: async (id: string, pass: string): Promise<Employee | null> => {
    await new Promise(r => setTimeout(r, 500)); // Network delay
    if (id && pass) {
      return {
        id,
        name: `Staff ${id}`,
        permissions: ['CASHIER', 'GUARD']
      };
    }
    return null;
  }
};

export const cashierApi = {
  /**
   * Cashier scans QR -> Calls backend to mark as PAID on blockchain
   */
  markOrderPaid: async (orderHash: string, receiptNumber?: string): Promise<CashierResult> => {
    try {
      console.log('Fetching:', `${BACKEND_URL}/api/cashier/mark-paid`);
      const response = await fetch(`${BACKEND_URL}/api/cashier/mark-paid`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'bypass-tunnel-reminder': 'true',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({ orderHash })
      });

      console.log('Response Status:', response.status);
      const data = await response.json().catch((err) => {
        console.error('JSON Parse Error:', err);
        return {};
      });
      console.log('Response Data:', data);

      if (!response.ok || !data.success) {
        return {
          success: false,
          status: response.status === 500 ? 'INVALID_QR' : 'NETWORK_ERROR',
          orderHash,
          timestamp: Date.now()
        };
      }

      // Sync Local DB
      dbEngine.updateReceiptStatus(receiptNumber || orderHash, 'PAID');

      // Sync Supabase
      try {
        await supabase
          .from('receipts')
          .update({ payment_status: 'PAID' })
          .eq('receipt_number', receiptNumber || orderHash);
      } catch (e) {
        console.warn('Supabase update failed:', e);
      }

      return {
        success: true,
        status: 'PAYMENT_CONFIRMED',
        orderHash,
        timestamp: Date.now()
      };
    } catch (error) {
      console.error('markOrderPaid error:', error);
      return { success: false, status: 'NETWORK_ERROR', orderHash, timestamp: Date.now() };
    }
  }
};

export const guardApi = {
  /**
   * Guard scans QR -> Calls backend to verify and mark as USED
   */
  verifyExit: async (orderHash: string, receiptNumber?: string): Promise<GuardResult> => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/guard/verify-exit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'bypass-tunnel-reminder': 'true',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({ orderHash })
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.success) {
        const statusMap: Record<string, any> = {
          'INVALID_OR_ALREADY_USED': 'QR_USED',
          'PAYMENT_PENDING': 'PAYMENT_PENDING'
        };
        return {
          allowed: false,
          status: statusMap[data.status] || 'INVALID_QR',
          orderHash,
          timestamp: Date.now()
        };
      }

      // Sync Local DB
      dbEngine.updateReceiptStatus(receiptNumber || orderHash, 'VERIFIED');

      // Sync Supabase
      try {
        await supabase
          .from('receipts')
          .update({ payment_status: 'VERIFIED' })
          .eq('receipt_number', receiptNumber || orderHash);
      } catch (e) {
        console.warn('Supabase update failed:', e);
      }

      return {
        allowed: true,
        status: 'EXIT_ALLOWED',
        orderHash,
        timestamp: Date.now()
      };
    } catch (error) {
      console.error('verifyExit error:', error);
      return { allowed: false, status: 'NETWORK_ERROR', orderHash, timestamp: Date.now() };
    }
  }
};
