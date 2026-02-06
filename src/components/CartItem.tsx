import React from 'react';
import { Minus, Plus } from 'lucide-react';
import { CartItem as CartItemType } from '../types/product';

interface CartItemProps {
    item: CartItemType;
    updateQuantity: (id: string, delta: number) => void;
}

export const CartItem: React.FC<CartItemProps> = ({ item, updateQuantity }) => {
    return (
        <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-4">
            <img src={item.imageUrl} alt={item.name} className="w-16 h-16 rounded-lg object-cover bg-gray-50" />
            <div className="flex-1">
                <h3 className="font-bold text-sm text-gray-800 line-clamp-2">{item.name}</h3>
                <p className="text-[10px] text-gray-400 mb-2">{item.weight}</p>
                <div className="flex justify-between items-end">
                    <div className="text-sm font-black text-[#007041]">₹{item.price * item.quantity}</div>
                    <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1">
                        <button onClick={() => updateQuantity(item.id, -1)} className="w-6 h-6 flex items-center justify-center bg-white shadow-sm rounded text-gray-600"><Minus size={14} /></button>
                        <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="w-6 h-6 flex items-center justify-center bg-white shadow-sm rounded text-green-600"><Plus size={14} /></button>
                    </div>
                </div>
            </div>
        </div>
    );
};
