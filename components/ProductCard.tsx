
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product, Review } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const [showReviews, setShowReviews] = useState(false);
  const [showAddReview, setShowAddReview] = useState(false);
  const [reviews, setReviews] = useState<Review[]>(product.reviews);
  const [newReview, setNewReview] = useState({ userName: '', rating: 5, comment: '' });

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : 'New';

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.userName || !newReview.comment) return;
    
    const review: Review = {
      id: Date.now().toString(),
      userName: newReview.userName,
      rating: newReview.rating,
      comment: newReview.comment,
      date: new Date().toISOString().split('T')[0]
    };
    
    setReviews([review, ...reviews]);
    setNewReview({ userName: '', rating: 5, comment: '' });
    setShowAddReview(false);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex text-amber-400">
        {[...Array(5)].map((_, i) => (
          <svg key={i} xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill={i < Math.floor(rating) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-0.5">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        ))}
      </div>
    );
  };

  const stockStatus = product.stock <= 0 
    ? { label: 'Out of Stock', color: 'bg-red-50 text-red-600 border-red-100' }
    : product.stock <= 10 
    ? { label: 'Limited Batch', color: 'bg-orange-50 text-orange-600 border-orange-100' }
    : { label: 'Fresh Harvest', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      className="bg-white rounded-[2.5rem] overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-amber-50/50 group flex flex-col h-full transition-shadow hover:shadow-[0_20px_60px_rgba(251,191,36,0.15)]"
    >
      <div className="relative h-72 overflow-hidden shrink-0">
        <motion.img 
          src={product.image} 
          alt={product.name} 
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.6 }}
          className={`w-full h-full object-cover ${product.stock <= 0 ? 'grayscale opacity-60' : ''}`}
        />
        
        {/* Stock Status Label - Top Left */}
        <div className={`absolute top-4 left-4 border px-4 py-1.5 rounded-full text-[10px] font-black shadow-lg uppercase tracking-widest z-10 ${stockStatus.color}`}>
          {stockStatus.label} {product.stock > 0 && product.stock <= 10 && `(${product.stock})`}
        </div>

        {/* Category Label - Bottom Right to prevent overlap */}
        <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur px-4 py-1.5 rounded-full text-amber-800 text-[10px] font-black shadow-lg uppercase tracking-widest border border-amber-100 z-10">
          {product.category}
        </div>
        
        {/* Subtle overlay gradient to ensure labels are readable against busy images */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/10 pointer-events-none"></div>
      </div>
      
      <div className="p-8 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-2xl font-bold text-gray-900 tracking-tight">{product.name}</h3>
          <span className="text-2xl font-black text-amber-600">Rs. {product.price.toLocaleString()}</span>
        </div>
        
        <div className="flex items-center space-x-3 mb-6">
          {renderStars(typeof averageRating === 'string' && averageRating === 'New' ? 0 : Number(averageRating))}
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            {averageRating} ({reviews.length} Expert reviews)
          </span>
        </div>

        <p className="text-gray-500 text-sm mb-8 leading-relaxed line-clamp-2">{product.description}</p>
        
        <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{product.unit}</span>
          <button 
            onClick={() => onAddToCart(product)}
            disabled={product.stock <= 0}
            className={`relative flex items-center space-x-3 px-8 py-3.5 rounded-2xl font-black transition-all active:scale-95 group overflow-hidden ${
              product.stock <= 0 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-amber-500 hover:bg-amber-600 text-white shadow-[0_8px_20px_rgba(245,158,11,0.25)]'
            }`}
          >
            {product.stock <= 0 ? (
              <span>Out of Stock</span>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:rotate-12 transition-transform"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                <span>Add to Cart</span>
              </>
            )}
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </button>
        </div>

        <div className="mt-6 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <button 
              onClick={() => setShowReviews(!showReviews)}
              className="text-amber-600 text-[10px] font-black hover:text-amber-700 transition-colors uppercase tracking-widest flex items-center gap-2"
            >
              {showReviews ? 'Hide Reviews' : 'Customer Feedback'}
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-300 ${showReviews ? 'rotate-180' : ''}`}><path d="m6 9 6 6 6-6"/></svg>
            </button>
            <button 
              onClick={() => setShowAddReview(!showAddReview)}
              className="text-gray-300 text-[10px] font-black hover:text-amber-600 transition-colors uppercase tracking-widest"
            >
              Share Experience
            </button>
          </div>

          <AnimatePresence>
            {showReviews && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="space-y-4 pt-4 max-h-56 overflow-y-auto pr-3 custom-scrollbar">
                  {reviews.length === 0 ? (
                    <p className="text-[10px] text-gray-400 italic uppercase tracking-widest text-center py-4">Be the first to share your harvest story</p>
                  ) : (
                    reviews.map(review => (
                      <motion.div 
                        key={review.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-amber-50/30 p-4 rounded-3xl border border-amber-100/30"
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[10px] font-black text-gray-800 uppercase tracking-widest">{review.userName}</span>
                          <span className="text-[8px] text-gray-400 font-bold uppercase tracking-widest">{review.date}</span>
                        </div>
                        {renderStars(review.rating)}
                        <p className="text-xs text-gray-600 mt-2 italic leading-relaxed font-medium">"{review.comment}"</p>
                      </motion.div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showAddReview && (
              <motion.form 
                initial={{ height: 0, opacity: 0, y: -10 }}
                animate={{ height: 'auto', opacity: 1, y: 0 }}
                exit={{ height: 0, opacity: 0, y: -10 }}
                onSubmit={handleAddReview} 
                className="p-6 bg-gray-50 rounded-3xl space-y-4 border border-gray-100 shadow-inner overflow-hidden"
              >
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-2">Name</label>
                    <input 
                      type="text" 
                      required
                      value={newReview.userName}
                      onChange={e => setNewReview({...newReview, userName: e.target.value})}
                      className="w-full text-xs px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-2">Rating</label>
                    <select 
                      value={newReview.rating}
                      onChange={e => setNewReview({...newReview, rating: Number(e.target.value)})}
                      className="w-full text-xs px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                    >
                      {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} Stars</option>)}
                    </select>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-2">Thoughts</label>
                  <textarea 
                    required
                    value={newReview.comment}
                    onChange={e => setNewReview({...newReview, comment: e.target.value})}
                    className="w-full text-xs px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white min-h-[70px]"
                  />
                </div>
                <div className="flex gap-2">
                  <button 
                    type="submit"
                    className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                  >
                    Post Review
                  </button>
                  <button 
                    type="button"
                    onClick={() => setShowAddReview(false)}
                    className="px-4 py-2.5 text-gray-400 hover:text-gray-600 text-[10px] font-black uppercase tracking-widest"
                  >
                    Close
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
