
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CartItem } from '../types';
import { WHATSAPP_NUMBER } from '../constants';

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
    address: ''
  });
  const [showValidation, setShowValidation] = useState(false);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleWhatsAppOrder = () => {
    if (items.length === 0) return;
    
    // Check if fields are filled
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address) {
      setShowValidation(true);
      return;
    }

    let message = `*Royal Order: Chaunsa Gold*%0A%0A`;
    message += `*Customer Details:*%0A`;
    message += `Name: ${customerInfo.name}%0A`;
    message += `Phone: ${customerInfo.phone}%0A`;
    message += `Address: ${customerInfo.address}%0A%0A`;
    message += `*Order Selection:*%0A`;
    
    items.forEach((item, index) => {
      message += `%0A${index + 1}. *${item.name}*%0A   Qty: ${item.quantity} units (${item.unit})%0A   Sub: Rs. ${(item.price * item.quantity).toLocaleString()}%0A`;
    });

    message += `%0A*Total Order Value: Rs. ${total.toLocaleString()}*%0A%0A`;
    message += `Please confirm shipping and payment instructions.`;

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
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
                <p className="text-[10px] text-amber-600 font-black uppercase tracking-[0.2em]">{items.length} Varieties selected</p>
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
                  <p className="text-gray-400 text-sm mb-8">The orchards are full but your basket is waiting. Start your selection today.</p>
                  <button onClick={onClose} className="bg-amber-500 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-amber-600 transition-all shadow-lg active:scale-95">Browse Selection</button>
                </div>
              ) : (
                <div className="space-y-8 pb-12">
                  <div className="space-y-8">
                    {items.map(item => {
                      const averageRating = item.reviews.length > 0 
                        ? (item.reviews.reduce((acc, r) => acc + r.rating, 0) / item.reviews.length)
                        : 0;

                      return (
                        <motion.div 
                          layout
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          key={item.id} 
                          className="flex gap-6 p-5 bg-white rounded-[2rem] shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-gray-50 group hover:shadow-[0_10px_30px_rgba(0,0,0,0.05)] transition-all"
                        >
                          <div className="relative shrink-0">
                            <img src={item.image} alt={item.name} className="w-28 h-28 object-cover rounded-3xl" />
                            <div className="absolute -top-2 -right-2 bg-amber-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-black text-xs shadow-lg border-2 border-white">
                              {item.quantity}
                            </div>
                          </div>
                          <div className="flex-1 flex flex-col justify-between overflow-hidden">
                            <div className="space-y-1">
                              <h4 className="font-black text-gray-900 truncate text-lg tracking-tight">{item.name}</h4>
                              <div className="flex items-center gap-2">
                                {renderStars(averageRating)}
                                <span className="text-[9px] font-black text-amber-600/60 uppercase tracking-widest">{item.unit}</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between mt-4">
                              <div className="flex items-center bg-gray-50 rounded-xl border border-gray-100 p-1">
                                <button 
                                  onClick={() => onUpdateQuantity(item.id, -1)} 
                                  className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-amber-600 hover:bg-white rounded-lg transition-all font-black"
                                >
                                  −
                                </button>
                                <span className="w-10 text-center font-black text-sm text-gray-900">
                                  {item.quantity}
                                </span>
                                <button 
                                  onClick={() => onUpdateQuantity(item.id, 1)} 
                                  className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-amber-600 hover:bg-white rounded-lg transition-all font-black"
                                >
                                  +
                                </button>
                              </div>
                              <span className="font-black text-gray-900 text-lg tracking-tight">Rs. {(item.price * item.quantity).toLocaleString()}</span>
                            </div>
                          </div>
                          <div className="flex flex-col justify-start">
                            <button 
                              onClick={() => onRemove(item.id)} 
                              className="p-2 text-gray-200 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                            </button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Delivery Information Section */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-8 rounded-[2.5rem] border border-amber-100 shadow-sm space-y-6"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-amber-500 rounded-xl flex items-center justify-center text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                      </div>
                      <h3 className="font-black text-gray-900 uppercase tracking-widest text-sm">Delivery Details</h3>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Full Name</label>
                        <input 
                          type="text" 
                          value={customerInfo.name}
                          onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                          placeholder="Your Name"
                          className={`w-full px-6 py-4 rounded-2xl bg-gray-50 border ${showValidation && !customerInfo.name ? 'border-red-500' : 'border-gray-100'} focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-400 transition-all font-bold text-gray-900 placeholder:text-gray-300`}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Phone Number</label>
                        <input 
                          type="tel" 
                          value={customerInfo.phone}
                          onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                          placeholder="03xx xxxxxxx"
                          className={`w-full px-6 py-4 rounded-2xl bg-gray-50 border ${showValidation && !customerInfo.phone ? 'border-red-500' : 'border-gray-100'} focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-400 transition-all font-bold text-gray-900 placeholder:text-gray-300`}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Shipping Address</label>
                        <textarea 
                          value={customerInfo.address}
                          onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                          placeholder="House #, Street, City"
                          className={`w-full px-6 py-4 rounded-2xl bg-gray-50 border ${showValidation && !customerInfo.address ? 'border-red-500' : 'border-gray-100'} focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-400 transition-all font-bold text-gray-900 placeholder:text-gray-300 min-h-[100px]`}
                        />
                      </div>
                      {showValidation && (!customerInfo.name || !customerInfo.phone || !customerInfo.address) && (
                        <p className="text-red-500 text-[10px] font-black uppercase tracking-widest text-center">Please complete your delivery details</p>
                      )}
                    </div>
                  </motion.div>
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="p-10 border-t border-gray-100 bg-white shadow-[0_-20px_60px_rgba(0,0,0,0.05)] rounded-t-[3rem]">
                <div className="flex justify-between items-center mb-8">
                  <span className="text-gray-400 font-black text-xs uppercase tracking-[0.2em]">Est. Subtotal</span>
                  <span className="text-4xl font-black text-gray-900 tracking-tighter">Rs. {total.toLocaleString()}</span>
                </div>
                <button 
                  onClick={handleWhatsAppOrder}
                  className="w-full py-6 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-3xl font-black text-xl shadow-[0_15px_40px_rgba(37,211,102,0.3)] transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-4 relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor" className="text-white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                    Confirm via WhatsApp
                  </span>
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </button>
                <p className="text-center text-[9px] text-gray-400 font-black uppercase tracking-[0.3em] mt-8">Secure Premium Logistics Guaranteed</p>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
