import React from 'react';
import { User, Store, Screen, CartItem } from '../types';

interface ProfileProps {
    user: User | null;
    cart: CartItem[];
    totalAmount: number;
    onChangeScreen: (s: Screen) => void;
}

export const Profile: React.FC<ProfileProps> = ({ user, cart, totalAmount, onChangeScreen }) => {
    const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    const menuItems = [
        { icon: 'person', label: 'Personal Information' },
        { icon: 'payments', label: 'Payment Methods' },
        { icon: 'history', label: 'Shopping History', action: () => onChangeScreen('HISTORY') },
        { icon: 'location_on', label: 'Saved Addresses' },
        { icon: 'notifications', label: 'Notifications' },
        { icon: 'shield', label: 'Security' },
    ];

    return (
        <div className="relative flex flex-col h-full overflow-hidden bg-white dark:bg-background-dark">
            {/* Header */}
            <header className="flex items-center px-6 pt-12 pb-4 bg-white dark:bg-background-dark shrink-0 relative">
                <button 
                    onClick={() => onChangeScreen('HOME')}
                    className="flex items-center justify-center rounded-full size-10 bg-gray-50 dark:bg-gray-800 absolute left-6 top-12"
                >
                    <span className="material-symbols-outlined text-[#0c1d16] dark:text-white">chevron_left</span>
                </button>
                <h1 className="w-full text-center text-xl font-bold">My Profile</h1>
            </header>

            <main className="flex-1 flex flex-col items-center pt-8 overflow-y-auto hide-scrollbar">
                {/* Profile Image Section */}
                <div className="relative mb-4">
                    <div className="size-28 rounded-full overflow-hidden border-4 border-gray-50 shadow-sm bg-gray-100 flex items-center justify-center">
                        <img 
                            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" 
                            alt="Profile" 
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <button className="absolute bottom-1 right-1 size-8 rounded-full bg-primary text-white border-4 border-white flex items-center justify-center shadow-md">
                        <span className="material-symbols-outlined text-sm">edit</span>
                    </button>
                </div>

                <h2 className="text-2xl font-extrabold text-[#0c1d16] dark:text-white mb-2">
                    {user?.name || 'Alex Johnson'}
                </h2>
                
                <div className="bg-[#e6f4ee] dark:bg-[#0a2e1f] px-4 py-2 rounded-full flex items-center gap-2 mb-8">
                    <span className="material-symbols-outlined text-primary text-lg">workspace_premium</span>
                    <span className="text-primary font-bold text-sm tracking-tight">Gold Member - 1,250 pts</span>
                </div>

                {/* Menu List */}
                <div className="w-full px-6 flex flex-col gap-1 mb-32">
                    {menuItems.map((item, i) => (
                        <button 
                            key={i} 
                            onClick={item.action}
                            className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 transition-colors group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="size-10 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-primary">
                                    <span className="material-symbols-outlined">{item.icon}</span>
                                </div>
                                <span className="font-bold text-gray-700 dark:text-gray-200">{item.label}</span>
                            </div>
                            <span className="material-symbols-outlined text-gray-300 group-hover:text-primary transition-colors">chevron_right</span>
                        </button>
                    ))}
                </div>
            </main>

            {/* Bottom Nav */}
            <div className="absolute bottom-0 left-0 right-0 z-40 bg-white dark:bg-background-dark shrink-0">
                {itemCount > 0 && (
                    <section className="px-4 pb-2">
                        <div className="flex items-center gap-4 bg-[#e6f4ee] dark:bg-[#0a2e1f] px-5 h-16 rounded-full justify-between shadow-lg">
                            <div className="flex items-center gap-3">
                                <div className="text-primary flex items-center justify-center rounded-full bg-white dark:bg-primary/20 shrink-0 size-10">
                                    <span className="material-symbols-outlined text-xl">shopping_cart</span>
                                </div>
                                <div className="flex flex-col">
                                    <p className="text-[#0c1d16] dark:text-white text-sm font-bold leading-tight">{itemCount} Items</p>
                                    <p className="text-primary dark:text-[#45a17a] text-xs font-semibold leading-tight">Total: ${totalAmount.toFixed(2)}</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => onChangeScreen('CART')}
                                className="flex items-center justify-center rounded-full h-9 px-5 bg-primary text-white text-xs font-bold active:bg-primary/90"
                            >
                                View Cart
                            </button>
                        </div>
                    </section>
                )}

                <div className="relative bg-white dark:bg-background-dark border-t border-gray-100 dark:border-gray-800">
                    <div className="absolute left-1/2 -translate-x-1/2 -top-8 flex flex-col items-center">
                        <button 
                            onClick={() => onChangeScreen('SCANNER')}
                            className="size-16 rounded-full bg-primary text-white border-4 border-white dark:border-background-dark shadow-lg flex items-center justify-center active:scale-95 transition-transform"
                        >
                            <span className="material-symbols-outlined text-3xl">barcode</span>
                        </button>
                        <span className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-tight">Scan</span>
                    </div>
                    <nav className="flex justify-between items-center px-4 py-4 pt-4">
                        <div className="flex flex-1 justify-around pr-8">
                            <button 
                                onClick={() => onChangeScreen('HOME')}
                                className="flex flex-col items-center gap-0.5 nav-button-inactive"
                            >
                                <span className="material-symbols-outlined">home</span>
                                <span className="text-[10px] font-bold">Home</span>
                            </button>
                            <button 
                                onClick={() => onChangeScreen('CATEGORIES')}
                                className="flex flex-col items-center gap-0.5 nav-button-inactive"
                            >
                                <span className="material-symbols-outlined">grid_view</span>
                                <span className="text-[10px] font-bold">Categories</span>
                            </button>
                        </div>
                        <div className="w-16"></div>
                        <div className="flex flex-1 justify-around pl-8">
                            <button 
                                onClick={() => onChangeScreen('HISTORY')}
                                className="flex flex-col items-center gap-0.5 nav-button-inactive"
                            >
                                <span className="material-symbols-outlined">history</span>
                                <span className="text-[10px] font-bold">Orders</span>
                            </button>
                            <button 
                                onClick={() => onChangeScreen('PROFILE')}
                                className="flex flex-col items-center gap-0.5 nav-button-active"
                            >
                                <span className="material-symbols-outlined">account_circle</span>
                                <span className="text-[10px] font-bold">Profile</span>
                            </button>
                        </div>
                    </nav>
                    <div className="h-6 bg-white dark:bg-background-dark"></div>
                </div>
            </div>
        </div>
    );
};
