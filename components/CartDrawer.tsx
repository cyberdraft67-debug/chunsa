
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CartItem } from '../types';
import { WHATSAPP_NUMBER } from '../constants';
import { sendOrderToSheet } from '../services/sheetsWebhook';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, delta: number) => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, items, onRemove, onUpdateQuantity }) => {
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    address: '',
    notes: '' 
  });
  const [showValidation, setShowValidation] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    if (items.length === 0 || isProcessing) return;
    
    // Validate required fields
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address) {
      setShowValidation(true);
      return;
    }

    setIsProcessing(true);

    const orderId = `CG-${Date.now().toString().slice(-6)}`;

    // 1. Log to Database (Google Sheets)
    await sendOrderToSheet({
      orderId,
      name: customerInfo.name,
      phone: customerInfo.phone,
      address: customerInfo.address,
      notes: customerInfo.notes,
      items,
      total
    });

    // 2. Prepare WhatsApp Message
    let message = `*👑 ROYAL CHAUNSA ORDER: ${orderId}*%0A%0A`;
    message += `*Customer Details:*%0A`;
    message += `• Name: ${customerInfo.name}%0A`;
    message += `• Phone: ${customerInfo.phone}%0A`;
    message += `• Address: ${customerInfo.address}%0A`;
    if (customerInfo.notes) {
      message += `• Instructions: ${customerInfo.notes}%0A`;
    }
    
    message += `%0A*Harvest Selection:*%0A`;
    items.forEach((item, index) => {
      message += `%0A${index + 1}. *${item.name}*%0A   Qty: ${item.quantity} × ${item.unit}%0A   Price: Rs. ${(item.price * item.quantity).toLocaleString()}%0A`;
    });

    message += `%0A*Total Order Value: Rs. ${total.toLocaleString()}*%0A%0A`;
    message += `_This order has been recorded in our harvest log._`;

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
    
    setIsProcessing(false);
    window.open(whatsappUrl, '_blank');
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex text-amber-400">
        {[...Array(5)].map((_, i) => (
          <svg key={i} xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill={i < Math.floor(rating) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-0.5">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] overflow-hidden">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity" 
            onClick={onClose} 
          />
          
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute top-0 right-0 h-full w-full max-w-lg bg-white shadow-2xl flex flex-col"
          >
            <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
              <div>
                <h2 className="text-3xl font-black text-gray-900 tracking-tight uppercase">Your Harvest</h2>
                <p className="text-[10px] text-amber-600 font-black uppercase tracking-[0.2em]">{items.length} Items selected</p>
              </div>
              <button onClick={onClose} className="p-3 hover:bg-gray-100 rounded-2xl text-gray-400 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 bg-gray-50/20 custom-scrollbar">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center px-8">
                  <div className="bg-amber-50 w-24 h-24 rounded-[2rem] flex items-center justify-center mb-6 shadow-inner">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
                  </div>
                  <h3 className="text-xl font-black text-gray-800 mb-2 uppercase tracking-widest">Basket Empty</h3>
                  <p className="text-gray-400 text-sm mb-8">The orchards are full but your basket is waiting.</p>
                  <button onClick={onClose} className="bg-amber-500 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-amber-600 transition-all shadow-lg">Start Browsing</button>
                </div>
              ) : (
                <div className="space-y-8 pb-12">
                  <div className="space-y-6">
                    {items.map(item => (
                      <motion.div 
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={item.id} 
                        className="flex gap-6 p-5 bg-white rounded-[2rem] shadow-sm border border-gray-50"
                      >
                        <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-2xl shrink-0" />
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 text-sm">{item.name}</h4>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-[10px] text-gray-400 font-bold">{item.unit}</span>
                            <div className="flex items-center bg-gray-50 rounded-lg p-1">
                              <button onClick={() => onUpdateQuantity(item.id, -1)} className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-amber-600 font-bold">−</button>
                              <span className="w-6 text-center font-bold text-xs">{item.quantity}</span>
                              <button onClick={() => onUpdateQuantity(item.id, 1)} className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-amber-600 font-bold">+</button>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end justify-between">
                          <button onClick={() => onRemove(item.id)} className="text-gray-200 hover:text-red-500"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></button>
                          <span className="font-black text-gray-900 text-sm">Rs. {(item.price * item.quantity).toLocaleString()}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-8 rounded-[2.5rem] border border-amber-100 shadow-sm space-y-6"
                  >
                    <h3 className="font-black text-gray-900 uppercase tracking-widest text-sm">Delivery Record</h3>
                    <div className="space-y-4">
                      <input 
                        type="text" 
                        value={customerInfo.name}
                        onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                        placeholder="Full Name"
                        className={`w-full px-6 py-4 rounded-2xl bg-gray-50 border ${showValidation && !customerInfo.name ? 'border-red-500' : 'border-gray-100'} outline-none font-bold text-gray-900`}
                      />
                      <input 
                        type="tel" 
                        value={customerInfo.phone}
                        onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                        placeholder="Phone Number (WhatsApp)"
                        className={`w-full px-6 py-4 rounded-2xl bg-gray-50 border ${showValidation && !customerInfo.phone ? 'border-red-500' : 'border-gray-100'} outline-none font-bold text-gray-900`}
                      />
                      <textarea 
                        value={customerInfo.address}
                        onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                        placeholder="Complete Shipping Address"
                        className={`w-full px-6 py-4 rounded-2xl bg-gray-50 border ${showValidation && !customerInfo.address ? 'border-red-500' : 'border-gray-100'} outline-none font-bold text-gray-900 min-h-[100px]`}
                      />
                      {showValidation && (!customerInfo.name || !customerInfo.phone || !customerInfo.address) && (
                        <p className="text-red-500 text-[10px] font-black uppercase text-center">Missing Required Information</p>
                      )}
                    </div>
                  </motion.div>
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="p-10 border-t border-gray-100 bg-white rounded-t-[3rem]">
                <div className="flex justify-between items-center mb-8">
                  <span className="text-gray-400 font-black text-xs uppercase tracking-[0.2em]">Total</span>
                  <span className="text-4xl font-black text-gray-900 tracking-tighter">Rs. {total.toLocaleString()}</span>
                </div>
                <button 
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  className="w-full py-6 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-3xl font-black text-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-4 disabled:bg-gray-400"
                >
                  {isProcessing ? "Processing..." : "Confirm via WhatsApp"}
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
