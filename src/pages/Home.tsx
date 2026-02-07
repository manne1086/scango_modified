import React from "react";
import { User, Store, Screen, CartItem } from "../types";

interface HomeProps {
  user: User | null;
  store: Store | null;
  cart: CartItem[];
  totalAmount: number;
  onChangeScreen: (s: Screen) => void;
  onLogout: () => void;
}

export const Home: React.FC<HomeProps> = ({
  user,
  store,
  cart,
  totalAmount,
  onChangeScreen,
  onLogout,
}) => {
  const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="relative flex flex-col h-full overflow-hidden bg-white dark:bg-background-dark">
      <header className="flex items-center justify-between px-6 pt-12 pb-4 bg-white dark:bg-background-dark border-b border-gray-100 dark:border-gray-800 shrink-0">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => onChangeScreen("STORE_SELECT")}
        >
          <span className="material-symbols-outlined text-primary text-2xl font-bold">
            store
          </span>
          <div className="flex flex-col">
            <h2 className="text-[#0c1d16] dark:text-white text-sm font-bold leading-tight tracking-tight">
              {store?.name || "Select Store"}
            </h2>
            <span className="text-xs text-primary font-medium">
              Verified Store
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center pt-6 overflow-y-auto overflow-x-hidden relative hide-scrollbar">
        <div className="flex flex-col items-center mb-2 shrink-0 h-16">
          <img src="/ScanGo_logo.png" alt="ScanGo Logo" className="h-30" />
        </div>

        <div className="w-full shrink-0">
          <div className="px-6 mb-4 flex items-center justify-between">
            <h3 className="text-xl font-extrabold">Offers Nearby</h3>
            <span className="text-sm text-primary font-bold">See All</span>
          </div>
          <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-4 px-6 snap-x snap-mandatory">
            <div className="offer-card snap-center bg-gray-50 dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 flex flex-col relative overflow-hidden shrink-0 shadow-sm">
              <div className="h-44 overflow-hidden relative">
                <img
                  alt="Bananas"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAh1VSfRRlb_cVNUOWKh_N2yE01Wds0aChLcjlnBlt7HuTqOParaMrbKgsFBEM_xg9_KU9w6w9VmszjudF-sUOqT_nLNvbYkpfRdW9sFpNrcLfwF125CbZIhmB5cDkAKnHhuTAmARkl1ePWKNvwgtNmE0cQ1dKB7VQGTGNXDLN7Zqwi90cUc1Cr1aByqlr3DyAmzEDccM1esP3ppdgQCWa4pgLkwoNQuSjErqOFGMg3YhK_hVjLNt2gKWx-rpg2TS_IcDpvQh27WIQ"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-primary text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                    Fresh Produce
                  </span>
                </div>
              </div>
              <div className="p-5 flex flex-col justify-between flex-1">
                <div>
                  <h4 className="text-2xl font-extrabold leading-tight text-gray-900 dark:text-white mb-1">
                    Organic Bananas - 20% Off
                  </h4>
                  <p className="text-xs text-gray-500 font-medium">
                    Sweet & pesticide-free harvest
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded-md">
                    Valid today only
                  </span>
                  <span className="material-symbols-outlined text-primary text-lg">
                    arrow_forward
                  </span>
                </div>
              </div>
            </div>

            <div className="offer-card snap-center bg-gray-50 dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 flex flex-col relative overflow-hidden shrink-0 shadow-sm">
              <div className="h-44 overflow-hidden relative">
                <img
                  alt="Croissants"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCD8yedROawxaqx082BXGDcXajz4cDHll4NsZ5eQsXQ_JdN8DPYkVaI0a4eLbFlLlYnCRW2o-KGtvI_aMBuRGQO9iZem9Qe9S6C7GE6xd5ICqhJ2APV1tx36B4IRxT42kvszSJY-jLA8QA6uafUqWsW9vRkVK7PYsP12FJ73k_SHL8ZVrxQmGoBEwTC8sTP5i4nG8UgUn1G9E_GObT8g2sX3EEOeKPr_BkeInBTpOuGunUyvVWs9eLrg4ChDPV9vJsCPSHc4hSGqyY"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-orange-600 text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                    Bakery
                  </span>
                </div>
              </div>
              <div className="p-5 flex flex-col justify-between flex-1">
                <div>
                  <h4 className="text-2xl font-extrabold leading-tight text-gray-900 dark:text-white mb-1">
                    Fresh Croissants - 2 for $3
                  </h4>
                  <p className="text-xs text-gray-500 font-medium">
                    Buttery, flaky & baked this morning
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-orange-600 bg-orange-100 px-2 py-1 rounded-md">
                    Until 11:00 AM
                  </span>
                  <span className="material-symbols-outlined text-orange-600 text-lg">
                    arrow_forward
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-1.5 mt-2 mb-6">
            <div className="size-1.5 rounded-full bg-primary"></div>
            <div className="size-1.5 rounded-full bg-gray-300 dark:bg-gray-700"></div>
            <div className="size-1.5 rounded-full bg-gray-300 dark:bg-gray-700"></div>
          </div>
        </div>

        <div className="w-full px-6 grid grid-cols-2 gap-4 pb-32">
          <div className="h-24 bg-gray-50 dark:bg-gray-900 rounded-2xl flex items-center p-4 gap-3 border border-gray-100 dark:border-gray-800">
            <span className="material-symbols-outlined text-primary text-3xl">
              restaurant
            </span>
            <span className="text-sm font-bold">Groceries</span>
          </div>
          <div className="h-24 bg-gray-50 dark:bg-gray-900 rounded-2xl flex items-center p-4 gap-3 border border-gray-100 dark:border-gray-800">
            <span className="material-symbols-outlined text-primary text-3xl">
              local_laundry_service
            </span>
            <span className="text-sm font-bold">Essentials</span>
          </div>
        </div>
      </main>

      <div className="absolute bottom-0 left-0 right-0 z-40 bg-white dark:bg-background-dark shrink-0">
        {itemCount > 0 && (
          <section className="px-4 pb-2">
            <div className="flex items-center gap-4 bg-[#e6f4ee] dark:bg-[#0a2e1f] px-5 h-16 rounded-full justify-between shadow-lg">
              <div className="flex items-center gap-3">
                <div className="text-primary flex items-center justify-center rounded-full bg-white dark:bg-primary/20 shrink-0 size-10">
                  <span className="material-symbols-outlined text-xl">
                    shopping_cart
                  </span>
                </div>
                <div className="flex flex-col">
                  <p className="text-[#0c1d16] dark:text-white text-sm font-bold leading-tight">
                    {itemCount} Items
                  </p>
                  <p className="text-primary dark:text-[#45a17a] text-xs font-semibold leading-tight">
                    Total: ${totalAmount.toFixed(2)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => onChangeScreen("CART")}
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
              onClick={() => onChangeScreen("SCANNER")}
              className="size-16 rounded-full bg-primary text-white border-4 border-white dark:border-background-dark shadow-lg flex items-center justify-center active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined text-3xl">
                barcode
              </span>
            </button>
            <span className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-tight">
              Scan
            </span>
          </div>
          <nav className="flex justify-between items-center px-4 py-4 pt-4">
            <div className="flex flex-1 justify-around pr-8">
              <button className="flex flex-col items-center gap-0.5 nav-button-active">
                <span className="material-symbols-outlined">home</span>
                <span className="text-[10px] font-bold">Home</span>
              </button>
              <button
                onClick={() => onChangeScreen("CATEGORIES")}
                className="flex flex-col items-center gap-0.5 nav-button-inactive"
              >
                <span className="material-symbols-outlined">grid_view</span>
                <span className="text-[10px] font-bold">Categories</span>
              </button>
            </div>
            <div className="w-16"></div>
            <div className="flex flex-1 justify-around pl-8">
              <button
                onClick={() => onChangeScreen("HISTORY")}
                className="flex flex-col items-center gap-0.5 nav-button-inactive"
              >
                <span className="material-symbols-outlined">history</span>
                <span className="text-[10px] font-bold">History</span>
              </button>
              <button
                onClick={() => onChangeScreen("PROFILE")}
                className="flex flex-col items-center gap-0.5 nav-button-inactive"
              >
                <span className="material-symbols-outlined">
                  account_circle
                </span>
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
