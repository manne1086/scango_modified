import React, { useState, useEffect } from 'react';
import { OrderQRCode } from '../components/OrderQRCode';
import { Receipt, ChevronLeft, Smartphone, CreditCard, Banknote, QrCode } from 'lucide-react';
import { historyApi } from '../services/api';
import { Order } from '../types';

interface HistoryProps {
  onBack: () => void;
  onChangeScreen: (s: any) => void;
  cart: any[];
  totalAmount: number;
}

export const History: React.FC<HistoryProps> = ({
  onBack,
  onChangeScreen,
  cart,
  totalAmount,
}) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [fullReceiptOrder, setFullReceiptOrder] = useState<Order | null>(null);

  const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    setOrders(historyApi.getOrders());
  }, []);

  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 relative">
      {/* Full Receipt Modal */}
      {fullReceiptOrder && (
        <div className="fixed inset-0 z-[100] bg-white flex flex-col animate-in slide-in-from-bottom duration-300">
          <header className="p-6 flex items-center gap-4 border-b border-gray-100 shrink-0">
            <button
              onClick={() => setFullReceiptOrder(null)}
              className="p-2 -ml-2 hover:bg-gray-100 rounded-full text-gray-600"
            >
              <ChevronLeft size={24} />
            </button>
            <h1 className="text-xl font-black text-gray-800">Order Receipt</h1>
          </header>

          <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center">
            <div className="bg-white p-8 rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center w-full max-w-sm mb-8">
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6">
                <QRCodeSVG
                  value={JSON.stringify({
                    orderHash: fullReceiptOrder.orderHash,
                    txHash: fullReceiptOrder.txHash || "",
                    receiptNumber: fullReceiptOrder.receiptNumber,
                  })}
                  size={200}
                  level="H"
                  includeMargin={true}
                />
              </div>
              <div className="text-center">
                <h2 className="text-lg font-black text-gray-800 mb-1">
                  {fullReceiptOrder.storeName}
                </h2>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                  {fullReceiptOrder.receiptNumber}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  {new Date(fullReceiptOrder.timestamp).toLocaleDateString()} at{" "}
                  {new Date(fullReceiptOrder.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>

            <div className="w-full max-w-sm space-y-4">
              <div className="border-t border-gray-100 pt-6">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">
                  Itemized Receipt
                </h3>
                <div className="space-y-3">
                  {fullReceiptOrder.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-start gap-4"
                    >
                      <div className="flex-1">
                        <p className="font-bold text-sm text-gray-800">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          Qty: {item.quantity} x ₹{item.price}
                        </p>
                      </div>
                      <p className="font-bold text-sm text-gray-800">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6 space-y-2">
                <div className="flex justify-between text-sm text-gray-500 font-medium">
                  <span>Subtotal</span>
                  <span>
                    ₹
                    {(
                      fullReceiptOrder.totalAmount +
                      (fullReceiptOrder.totalDiscount || 0)
                    ).toFixed(2)}
                  </span>
                </div>
                {fullReceiptOrder.totalDiscount > 0 && (
                  <div className="flex justify-between text-sm text-green-600 font-bold">
                    <span>Savings</span>
                    <span>-₹{fullReceiptOrder.totalDiscount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-black text-gray-800 pt-2 border-t border-gray-50">
                  <span>Total Amount</span>
                  <span>₹{fullReceiptOrder.totalAmount.toFixed(2)}</span>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-2xl flex items-center justify-between border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-white flex items-center justify-center text-primary shadow-sm">
                    {fullReceiptOrder.paymentMethod === "UPI" && (
                      <Smartphone size={20} />
                    )}
                    {fullReceiptOrder.paymentMethod === "CARD" && (
                      <CreditCard size={20} />
                    )}
                    {fullReceiptOrder.paymentMethod === "CASH" && (
                      <Banknote size={20} />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-gray-400 uppercase leading-none">
                      Paid via
                    </span>
                    <span className="text-sm font-bold text-gray-800">
                      {fullReceiptOrder.paymentMethod}
                    </span>
                  </div>
                </div>
                <span className="bg-green-100 text-green-700 text-[10px] font-black px-2 py-1 rounded uppercase">
                  {fullReceiptOrder.status}
                </span>
              </div>
            </div>

            <div className="mt-12 mb-6 text-center">
              <p className="text-xs text-gray-400 font-bold">
                Thank you for shopping with ScanGo!
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 -ml-2 hover:bg-gray-100 rounded-full text-gray-600"
          >
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-xl font-black text-gray-800">Past Orders</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {orders.length === 0 ? (
          <div className="text-center text-gray-400 mt-20">
            <Receipt size={48} className="mx-auto mb-4 opacity-30" />
            <p className="font-medium">No orders yet</p>
            <p className="text-xs mt-1">
              Your shopping history will appear here
            </p>
          </div>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            >
              {/* Order Header */}
              <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="font-black text-gray-800 text-lg">
                      ₹{order.totalAmount.toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-400">
                      {new Date(order.timestamp).toLocaleDateString()} •{" "}
                      {new Date(order.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${order.status === "PAID" || order.status === "VERIFIED" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs text-gray-500 mb-1 font-medium">
                      {order.storeName}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <Receipt size={12} /> {order.receiptNumber}
                    </div>
                  </div>

                  <button
                    onClick={() => setFullReceiptOrder(order)}
                    className="flex items-center gap-1 text-xs font-bold text-primary bg-primary/5 px-4 py-2 rounded-full border border-primary/10 active:scale-95 transition-all shadow-sm"
                  >
                    View Full Receipt
                    <ChevronLeft size={14} className="-rotate-90" />
                  </button>
                </div>
              </div>

              {/* Expanded Order Details */}
              {expandedOrder === order.id && (
                <div className="border-t border-gray-100 bg-gray-50">
                  <div className="p-5 space-y-4">
                    {/* Items List */}
                    <div>
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
                        Items Purchased ({order.items.length})
                      </h4>
                      <div className="space-y-2">
                        {order.items.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 bg-white p-3 rounded-xl border border-gray-100"
                          >
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="w-12 h-12 rounded-lg object-cover bg-gray-100"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-sm text-gray-800 truncate">
                                {item.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {item.brand} • {item.weight}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs font-bold text-[#007041]">
                                  ₹{item.price}
                                </span>
                                {item.discount > 0 && (
                                  <span className="text-xs text-gray-400 line-through">
                                    ₹{item.mrp}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-gray-500">
                                Qty: {item.quantity}
                              </p>
                              <p className="font-bold text-sm text-gray-800">
                                ₹{(item.price * item.quantity).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                            {/* Expanded Order Details */}
                            {expandedOrder === order.id && (
                                <div className="border-t border-gray-100 bg-gray-50">
                                    <div className="p-5 space-y-4">
                                        {/* Items List */}
                                        <div>
                                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Items Purchased ({order.items.length})</h4>
                                            <div className="space-y-2">
                                                {order.items.map((item, index) => (
                                                    <div key={index} className="flex items-center gap-3 bg-white p-3 rounded-xl border border-gray-100">
                                                        <img src={item.imageUrl} alt={item.name} className="w-12 h-12 rounded-lg object-cover bg-gray-100" />
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-bold text-sm text-gray-800 truncate">{item.name}</p>
                                                            <p className="text-xs text-gray-500">{item.brand} • {item.weight}</p>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <span className="text-xs font-bold text-[#007041]">₹{item.price}</span>
                                                                {item.discount > 0 && (
                                                                    <span className="text-xs text-gray-400 line-through">₹{item.mrp}</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                                            <p className="font-bold text-sm text-gray-800">₹{(item.price * item.quantity).toFixed(2)}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Payment & Receipt Details */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-white p-4 rounded-xl border border-gray-100">
                                                <h5 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Payment</h5>
                                                <div className="flex items-center gap-2">
                                                    {order.paymentMethod === 'UPI' && <Smartphone size={16} className="text-blue-600" />}
                                                    {order.paymentMethod === 'CARD' && <CreditCard size={16} className="text-purple-600" />}
                                                    {order.paymentMethod === 'CASH' && <Banknote size={16} className="text-green-600" />}
                                                    <span className="text-sm font-bold text-gray-800">{order.paymentMethod}</span>
                                                </div>
                                                {order.totalDiscount > 0 && (
                                                    <p className="text-xs text-green-600 mt-1">Saved ₹{order.totalDiscount.toFixed(2)}</p>
                                                )}
                                            </div>

                                            <div className="bg-white p-4 rounded-xl border border-gray-100">
                                                <h5 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Receipt QR</h5>
                                                <div className="flex items-center justify-center">
                                                    <div className="bg-white p-2 rounded-lg border border-gray-200">
                                                        <OrderQRCode
                                                            orderHash={order.orderHash}
                                                            txHash={order.txHash}
                                                            receiptNumber={order.receiptNumber}
                                                            size={60}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Full Receipt Button */}
                                        <button
                                            onClick={() => {
                                                // Create a detailed receipt view
                                                const receiptData = {
                                                    ...order,
                                                    ...order,
                                                    // qrCode: order.qrPayload // Removed invalid property
                                                };
                                                console.log('Full Receipt:', receiptData);
                                                // You could open a modal or navigate to a full receipt view here
                                            }}
                                            className="w-full bg-gray-800 text-white py-3 rounded-xl font-bold text-sm hover:bg-gray-700 transition flex items-center justify-center gap-2"
                                        >
                                            <QrCode size={16} />
                                            View Full Receipt
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                        {order.totalDiscount > 0 && (
                          <p className="text-xs text-green-600 mt-1">
                            Saved ₹{order.totalDiscount.toFixed(2)}
                          </p>
                        )}
                      </div>

                      <div className="bg-white p-4 rounded-xl border border-gray-100">
                        <h5 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                          Receipt QR
                        </h5>
                        <div className="flex items-center justify-center">
                          <div className="bg-white p-2 rounded-lg border border-gray-200">
                            <QRCodeSVG
                              value={JSON.stringify({
                                orderHash: order.orderHash,
                                txHash: order.txHash || "",
                                receiptNumber: order.receiptNumber,
                              })}
                              size={60}
                              level="M"
                              includeMargin={false}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Full Receipt Button */}
                    <button
                      onClick={() => setFullReceiptOrder(order)}
                      className="w-full bg-gray-800 text-white py-3 rounded-xl font-bold text-sm hover:bg-gray-700 transition flex items-center justify-center gap-2"
                    >
                      <QrCode size={16} />
                      View Full Receipt
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

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
              <button
                onClick={() => onChangeScreen("HOME")}
                className="flex flex-col items-center gap-0.5 nav-button-inactive"
              >
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
              <button className="flex flex-col items-center gap-0.5 nav-button-active">
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
