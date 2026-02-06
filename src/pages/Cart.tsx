import React from 'react';
import { ChevronLeft, ShoppingCart, ArrowRight } from 'lucide-react';
import { CartItem as CartItemType } from '../types/product';
import { Screen } from '../types';
import { CartItem } from '../components/CartItem';

interface CartProps {
    cart: CartItemType[];
    updateQuantity: (id: string, d: number) => void;
    onScreenChange: (s: Screen) => void;
    totalAmount: number;
    totalSavings: number;
}

export const Cart: React.FC<CartProps> = ({ cart, updateQuantity, onScreenChange, totalAmount, totalSavings }) => {
    return (
        <div className="h-full flex flex-col bg-gray-50">
            <div className="bg-white p-6 shadow-sm z-10 sticky top-0">
                <div className="flex items-center gap-4">
                    <button onClick={() => onScreenChange('SCANNER')} className="p-2 -ml-2 hover:bg-gray-100 rounded-full text-gray-600">
                        <ChevronLeft size={24} />
                    </button>
                    <h1 className="text-xl font-black text-gray-800">Your Cart <span className="text-gray-400 font-medium text-sm">({cart.length} items)</span></h1>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {cart.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-50 pb-20">
                        <ShoppingCart size={64} className="mb-4 text-gray-300" />
                        <p className="font-bold text-gray-400">Your cart is empty</p>
                        <button onClick={() => onScreenChange('SCANNER')} className="mt-4 text-[#007041] font-bold text-sm uppercase tracking-widest">Start Scanning</button>
                    </div>
                ) : (
                    cart.map(item => (
                        <CartItem key={item.id} item={item} updateQuantity={updateQuantity} />
                    ))
                )}
            </div>

            {cart.length > 0 && (
                <div className="bg-white p-6 rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-20">
                    <div className="space-y-2 mb-6 text-sm">
                        <div className="flex justify-between text-gray-500">
                            <span>MRP Total</span>
                            <span>₹{(totalAmount + totalSavings).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-green-600 font-bold">
                            <span>Savings</span>
                            <span>- ₹{totalSavings.toFixed(2)}</span>
                        </div>
                        <div className="border-t border-gray-100 my-2 pt-2 flex justify-between text-lg font-black text-gray-900">
                            <span>To Pay</span>
                            <span>₹{totalAmount.toFixed(2)}</span>
                        </div>
                    </div>
                    <button
                        onClick={() => onScreenChange('PAYMENT')}
                        className="w-full bg-[#007041] text-white py-4 rounded-xl font-bold text-lg hover:bg-green-800 transition shadow-lg flex items-center justify-center gap-2"
                    >
                        Proceed to Pay <ArrowRight size={20} />
                    </button>
                </div>
            )}
        </div>
    );
};
