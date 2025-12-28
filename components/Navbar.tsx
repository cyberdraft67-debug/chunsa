
import React from 'react';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onScrollTo: (id: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ cartCount, onOpenCart, onScrollTo }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-amber-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div 
            className="flex items-center cursor-pointer"
            onClick={() => onScrollTo('hero')}
          >
            <span className="text-2xl font-bold text-amber-600">CHAUNSA</span>
            <span className="text-2xl font-light text-amber-400 ml-1">GOLD</span>
          </div>
          
          <div className="hidden md:flex space-x-8 items-center">
            <button onClick={() => onScrollTo('products')} className="text-gray-700 hover:text-amber-600 transition-colors">Our Selection</button>
            <button onClick={() => onScrollTo('about')} className="text-gray-700 hover:text-amber-600 transition-colors">Why Chaunsa?</button>
            <button onClick={() => onScrollTo('ai-chef')} className="text-gray-700 hover:text-amber-600 transition-colors">AI Chef</button>
          </div>

          <div className="flex items-center space-x-4">
            <button 
              onClick={onOpenCart}
              className="relative p-2 bg-amber-100 rounded-full text-amber-700 hover:bg-amber-200 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
