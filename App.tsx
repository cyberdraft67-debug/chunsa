
import React, { useState, useCallback } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import CartDrawer from './components/CartDrawer';
import AIChef from './components/AIChef';
import { PRODUCTS } from './constants';
import { Product, CartItem } from './types';

const App: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = useCallback((product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-white">
      <Navbar 
        cartCount={totalItems} 
        onOpenCart={() => setIsCartOpen(true)} 
        onScrollTo={scrollTo}
      />
      
      <Hero onExplore={() => scrollTo('products')} />

      {/* About Section */}
      <section id="about" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-amber-100 rounded-full z-0"></div>
            <img 
              src="https://images.unsplash.com/photo-1591073113125-e46713c829ed?q=80&w=1000&auto=format&fit=crop" 
              alt="Authentic Chaunsa Harvest" 
              className="rounded-3xl shadow-2xl relative z-10 w-full h-[500px] object-cover"
            />
          </div>
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">Authentic <br/>Punjab Heritage</h2>
            <p className="text-xl text-gray-600 mb-6 leading-relaxed">
              Our Chaunsa mangoes are sourced directly from the heart of the Punjab plains. Each box is packed with tradition—from the hand-selected fruits to the classic newspaper lining that ensures natural ripening and protection.
            </p>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="bg-amber-100 p-2 rounded-lg text-amber-600 shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="m4.93 4.93 14.14 14.14"/><path d="M2 12h20"/><path d="m19.07 4.93-14.14 14.14"/></svg>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">4.5kg - 5kg Standard Weight</h4>
                  <p className="text-gray-500 text-sm">Every box is weighed to precision, ensuring you get a consistent, generous harvest of the finest mangoes.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-amber-100 p-2 rounded-lg text-amber-600 shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="2" x2="22" y1="9" y2="9"/><line x1="7" x2="7" y1="21" y2="9"/><line x1="17" x2="17" y1="21" y2="9"/></svg>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">Traditional Newspaper Lining</h4>
                  <p className="text-gray-500 text-sm">We use traditional methods to protect each fruit, preserving that iconic honey-sweet aroma during transit.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Current Harvest</h2>
              <p className="text-xl text-gray-600">Pure Chaunsa selection available for immediate dispatch in standard 5kg crates.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {PRODUCTS.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={addToCart} 
              />
            ))}
          </div>
        </div>
      </section>

      <AIChef />

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-6">
                <span className="text-2xl font-bold text-amber-500">CHAUNSA</span>
                <span className="text-2xl font-light text-white ml-1">GOLD</span>
              </div>
              <p className="text-gray-400 max-w-sm mb-6">
                Direct from the orchards to your table. We take pride in delivering the highest grade Chaunsa mangoes available globally in our signature harvest boxes.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-amber-500 transition-colors"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg></a>
                <a href="#" className="hover:text-amber-500 transition-colors"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg></a>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-6 text-lg">Quick Links</h4>
              <ul className="space-y-4 text-gray-400">
                <li><button onClick={() => scrollTo('hero')} className="hover:text-amber-500 text-sm">Home</button></li>
                <li><button onClick={() => scrollTo('products')} className="hover:text-amber-500 text-sm">Shop Mangoes</button></li>
                <li><button onClick={() => scrollTo('about')} className="hover:text-amber-500 text-sm">Our Story</button></li>
                <li><button onClick={() => scrollTo('ai-chef')} className="hover:text-amber-500 text-sm">Recipes</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6 text-lg">Support</h4>
              <ul className="space-y-4 text-gray-400">
                <li className="text-sm">Bulk Inquiries</li>
                <li className="text-sm">Track Order</li>
                <li className="text-sm">Quality Guarantee</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
            <p>© 2024 Chaunsa Gold. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cart}
        onRemove={removeFromCart}
        onUpdateQuantity={updateQuantity}
      />
    </div>
  );
};

export default App;
