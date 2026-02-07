import React from 'react';
import { User, Store, Screen, CartItem } from '../types';

interface CategoriesProps {
    user: User | null;
    store: Store | null;
    cart: CartItem[];
    totalAmount: number;
    onChangeScreen: (s: Screen) => void;
    onLogout: () => void;
}

export const Categories: React.FC<CategoriesProps> = ({ user, store, cart, totalAmount, onChangeScreen, onLogout }) => {
    const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    const categories = [
        { name: 'Fresh Produce', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC60eWlCWwta0MwaJD69rr39sMik1DKr5vj95Dl8LpmfOWcSFqAn-AgC19lInl7qnbYwpdVKTFHJ_RVsUNCUUCNwtVkbzjDzGTBLfh8kSmAB4FzskaVqsNaFVPrYpquh280wW27oC2kIDzm_tHR8TxgFXaTSuncE3KC-FLZ7sZhLmbN67_omkAwu8oaWnKPoOQ6aND9GzE6I2bzFjMWNfUXgKUCJ2LnhOgUjNTc4yDIVVaHVhrf9ahCFbJYE91RaxKQjzUOs24awAY' },
        { name: 'Dairy & Eggs', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCIkXbotVFy8wSPhOj01FG7eTsn22kdqCfQEqa8RO2rK0BalDdzyUnQbYvMVk2lMDVIV1ybK4doQEJrvTxwJCg5XCTxNLU37V5FV9XNAm8Q4poVgCxiE5Xq4hiA2GUgim2R3wbwBbaUHvrPc3d65Kp5YpmtpP3Ro4el6t7nm6oB6hYAH7DEf6BGVOq2eaDRYsa5EO54hPev9jYDEtcl77HymeDK_y3nFx968Ts7LrQhdlEVBcsDppQKvBfuD9e0_QaD4J3yZ_ga0_0' },
        { name: 'Bakery', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA-NRHyMbAsRJ1iOMBfShsuocyLtwpiXePMBFoNkoj5tmAn_dgA4uKSnDq-llefINivNGw6xbPNhxp3XgX8NCj2I1qgjS8VU1tFyetJZDSPgU1WSW6VKB0wkAayavnNF8JQ811yunF6SnkvN962xV_kp0tHUWTYMEdtINjWQAXY8ZT4pdVx-BCChgjzXU3QcTB39sVUcsDRtVu812Bdn72nO2PKMcTf4KxWTPojfmHkoCOMeU76Mi3967F4AFJRBdk8hLVywg-2u0w' },
        { name: 'Beverages', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBjLQ-OZzJshHoR3umv8q_1VZhn5cALhZm-iW8FZrFr8hzhMjJMp4W79JCnaz6e-_knaHEw7eyhAfH-L_qHUTpEUp6CZYP8WgjI0T8vpDbEIS9Rrr5TLl1iTg72kx3eCorY3SYrH9dweiNuK1W38FrFtq0Vu_wttyh3xMLaTLvTZCgNy8kWVoP8Ze1CBS4jyFy9ek0v4R8FTel8J_V4SgBww2P1IItu7kTDjDGJD73zcqySm5PKXtCeKI1DrsEi6lTYND6F8ZssHXE' },
        { name: 'Frozen Foods', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA9_TWuJPzziFn4vHEUvUDtNH32vZCfbu5E6VV-CBIr8weR9wC4mj2DTT_WDOKO4k8KcVn4-aIg7k3v1xeP9Sc-nOzYFtPTIhw6UmkC5xD0QK5FN0SNgxDoNH0nVNzSSQvg8i4mP6EtXvazU3W6Am9GIuwVhlsHTWQO60C8KpdyV2f1lDDDoK0Fq1MArxwM_ZIR5uLI4aejwaFF9U1WAObuXFruAtkhhlmOwWR6Z-fQtCqA12PNVq7ibgS8wOGG2QC8tNLz5b7a5no' },
        { name: 'Meat & Seafood', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDdkW5FVxEDLth8FD-5_JC9JUUZZSaofNlkb9UM0Olw-Cu1n_2KVs-eqTWvF3475fTweCEvVD3-46QFLdptJa29yftWZrzGpgXoOXQAVq4QIRg1Jw2lDZa4so_soQw8tL6-allsrjmQ_IDf1SJ72uQYznNatBFtyHnuegD19YBZA4wB4h2wAUlXZd_iHD2LhM8yqdhkmGbloz8xnTWR4W0H0-UY5gkH09gvTZCx91OdaTonzyI03Bve6cVYZG03H4vRJJXydKiAbRI' },
        { name: 'Snacks', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCZCVAKJbhMCvhOqUmBB8MtefpXpZOW71iabuF-u97Or7rpgrqPTPvFV7dpPnYaiyvP5t7NsYyhJOIxywMU5tsMoX4uQgmHEvRJqEU-QexP4bWMv46U0MkMJrBJrEQll-BAIla5PfsfKlBh2ko9lMtKFzSweFIXFbnkMDRLUvhsM0Ue37oPLwBxJGOvR8t8R-LhSrz3BOKmMRo8E5k8RCRCR5sGKqmkU3dRyoht19yF3wCSImm74pD_x59G8flhoJuGU2XLmH7yaR4' },
        { name: 'Personal Care', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCvciGu3HMlz6kzJiqLC49q21cfunz27GCxwXTBu2TfvTwnstEETQls0NSmaKzLkFUR5xrwDbHYEKmaD7jxqJdGGcqU2sLcd7oEFz8U6Fldv1EHdz3K0nJlr06RGuK5-A3B5hjtiGMg2PmW_zAcfWbXsTXSD-l9dLqNICapAgwinXMl_VbAXzmykY5LijxhhEELka0NiyfyMfv_WN6t7cW6qzXEXXr6zeA4FTDuYWV3O86ofGO2t8RHI3xypBFhdcu93WhMGssVyPw' }
    ];

    return (
        <div className="relative flex flex-col h-full overflow-hidden bg-white dark:bg-background-dark">
            <header className="flex flex-col px-6 pt-12 pb-4 bg-white dark:bg-background-dark border-b border-gray-100 dark:border-gray-800 shrink-0 gap-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-extrabold tracking-tight">Categories</h1>
                </div>
                <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                    <input 
                        className="w-full h-12 pl-12 pr-4 bg-gray-100 dark:bg-gray-900 border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary focus:bg-white transition-all outline-none" 
                        placeholder="Search products or categories" 
                        type="text"
                    />
                </div>
            </header>

            <main className="flex-1 flex flex-col items-center pt-4 overflow-y-auto overflow-x-hidden relative hide-scrollbar">
                <div className="w-full px-6 grid grid-cols-2 gap-4 pb-48">
                    {categories.map((cat, i) => (
                        <div key={i} className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden flex flex-col border border-gray-100 dark:border-gray-800 shadow-sm hover:border-primary/40 transition-all cursor-pointer group">
                            <img alt={cat.name} className="aspect-[4/3] object-cover w-full group-hover:scale-105 transition-transform duration-500" src={cat.img} />
                            <div className="p-4 flex items-center justify-center">
                                <span className="text-sm font-bold leading-tight">{cat.name}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

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
                            <button className="flex flex-col items-center gap-0.5 nav-button-active">
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
                                className="flex flex-col items-center gap-0.5 nav-button-inactive"
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
