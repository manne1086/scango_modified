import React, { useState } from 'react';
import {
  ChevronLeft,
  QrCode,
  CreditCard,
  Banknote,
  CheckCircle2
} from 'lucide-react';
import { PaymentMethod, Screen } from '../types';

interface CheckoutProps {
  onScreenChange: (s: Screen) => void;
  totalAmount: number;
  handleCheckout: (m: PaymentMethod) => Promise<void>; // 🔥 async now
  isProcessing: boolean;
}

export const Checkout: React.FC<CheckoutProps> = ({
  onScreenChange,
  totalAmount,
  handleCheckout,
  isProcessing
}) => {
  const [method, setMethod] = useState<PaymentMethod>(PaymentMethod.UPI);

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onScreenChange('CART')}
            className="p-2 -ml-2 hover:bg-gray-100 rounded-full text-gray-600"
          >
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-xl font-black text-gray-800">Checkout</h1>
        </div>
      </div>

      {/* Body */}
      <div className="p-6 flex-1">
        <div className="bg-[#007041] text-white p-6 rounded-2xl shadow-lg mb-8 text-center">
          <p className="text-green-100 text-sm font-medium mb-1">
            Total Payable Amount
          </p>
          <h2 className="text-4xl font-black">
            ₹{totalAmount.toFixed(2)}
          </h2>
        </div>

        <h3 className="font-bold text-gray-800 mb-4 px-1">
          Select Payment Method
        </h3>

        <div className="space-y-3">
          {[
            {
              id: PaymentMethod.UPI,
              label: 'UPI / QR Code',
              icon: <QrCode size={20} />
            },
            {
              id: PaymentMethod.CARD,
              label: 'Credit / Debit Card',
              icon: <CreditCard size={20} />
            },
            {
              id: PaymentMethod.CASH,
              label: 'Pay Cash at Counter',
              icon: <Banknote size={20} />
            }
          ].map((opt) => (
            <button
              key={opt.id}
              onClick={() => setMethod(opt.id)}
              className={`w-full p-4 rounded-xl border flex items-center gap-4 transition-all ${method === opt.id
                  ? 'border-[#007041] bg-green-50 text-[#007041] ring-1 ring-[#007041]'
                  : 'border-gray-200 bg-white text-gray-600'
                }`}
            >
              <div
                className={`p-2 rounded-lg ${method === opt.id ? 'bg-white' : 'bg-gray-100'
                  }`}
              >
                {opt.icon}
              </div>

              <span className="font-bold">{opt.label}</span>

              {method === opt.id && (
                <CheckCircle2 size={20} className="ml-auto" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 bg-white border-t border-gray-100">
        <button
          onClick={async () => {
            try {
              await handleCheckout(method); // 🔥 blockchain call
            } catch (e: any) {
              alert(`Checkout Failed: ${e.message}\nMake sure you accepted the backend certificate!`);
            }
          }}
          disabled={isProcessing}
          className="w-full bg-[#007041] text-white py-4 rounded-xl font-bold text-lg hover:bg-green-800 transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isProcessing
            ? 'Processing on Blockchain...'
            : `Pay ₹${totalAmount.toFixed(2)}`}
        </button>
      </div>
    </div>
  );
};
